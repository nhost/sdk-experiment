module Nhost.Query where

import Prelude

import Control.Monad.ST as ST
import Data.Array (mapMaybe)
import Data.Array as Array
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.Array.ST as STArray
import Data.Either (Either(..))
import Data.FoldableWithIndex (foldMapWithIndex, foldrWithIndex)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String.NonEmpty (NonEmptyString)
import Data.String.NonEmpty as NES
import Data.Tuple (Tuple(..))
import JSURI as JSURI

-- collectLeftsOrRights [Left 1, Left 2] -- => Left [1,2]
-- collectLeftsOrRights [Right "x", Right "y"] -- => Right ["x","y"]
-- collectLeftsOrRights [Left 1, Right "oops"] -- => Left [1]
-- collectLeftsOrRights :: forall a b. Array (Either a b) -> Either (Array a) (Array b)
collectLeftsOrRights :: forall a b. Array (Either a b) -> Either (Array a) (Array b)
collectLeftsOrRights xs = ST.run do
  -- Create mutable arrays for Left and Right
  lefts <- STArray.new
  rights <- STArray.new

  ST.foreach xs \e -> case e of
    Left a -> void $ STArray.push a lefts
    Right b -> void $ STArray.push b rights

  -- Freeze mutable arrays to immutable arrays
  leftArr <- STArray.freeze lefts
  rightArr <- STArray.freeze rights

  if Array.length rightArr == 0 then
    pure (Left leftArr)
  else
    pure (Right rightArr)

mapStringToNEString_filterEmpty :: forall k. Ord k => Map k String -> Map k NonEmptyString
mapStringToNEString_filterEmpty = Map.catMaybes <<< map NES.fromString

partitionWithKeyMap :: forall k v. Ord k => Map k v -> (k -> v -> Boolean) -> Tuple (Map k v) (Map k v)
partitionWithKeyMap m pred =
  let
    yes = Map.filterWithKey pred m
    no = Map.filterWithKey (\k v -> not (pred k v)) m
  in
    Tuple yes no

map_collectJustValues :: forall k v. Map k (Maybe v) -> Array v
map_collectJustValues =
  foldrWithIndex
    ( \_ maybeV acc ->
        case maybeV of
          Just v -> Array.cons v acc
          Nothing -> acc
    )
    []

map_collectKeysWithNothingValues :: forall k v. Map k (Maybe v) -> Array k
map_collectKeysWithNothingValues =
  foldrWithIndex
    ( \k maybeV acc ->
        case maybeV of
          Just _ -> acc
          Nothing -> Array.cons k acc
    )
    []

catMaybes_errorIfSomeIsNothing :: forall k v. Ord k => Map k (Maybe v) -> Either (NonEmptyArray k) (Map k v)
catMaybes_errorIfSomeIsNothing m =
  case NE.fromArray (map_collectKeysWithNothingValues m) of
    Just ne -> Left ne
    Nothing -> Right (Map.catMaybes m)

nes_encodeURIComponent :: NonEmptyString -> Maybe NonEmptyString
nes_encodeURIComponent = join <<< map NES.fromString <<< JSURI.encodeURIComponent <<< NES.toString

-- > toQuery (Map.fromFoldable [ Tuple (NES.unsafeFromString "foo") "123", Tuple (NES.unsafeFromString "bar") "baz" ])
-- Just "foo=123&bar=baz"
-- > toQuery Map.empty
-- Nothing
toQuery :: Map NonEmptyString String -> Maybe NonEmptyString
toQuery m =
  NES.fromString
    $ NES.joinWith "&"
    $
      foldMapWithIndex
        (\k v -> [ NES.appendString k ("=" <> v) ])
        m

-- | ## Examples
-- |
-- | ```purescript
-- | encodeQueryParams $ Map.fromFoldable
-- |   [ Tuple "ok" ""
-- |   , Tuple "ok2" "hi"
-- |   , Tuple "fail2" "\xD800" -- invalid surrogate
-- |   ]
-- | -- Left ["fail2"]
-- | ```
-- |
-- | ```purescript
-- | encodeQueryParams $ Map.fromFoldable
-- |   [ Tuple "ok" ""
-- |   , Tuple "ok2" "hi"
-- |   ]
-- | -- Right "ok=&ok2=hi"
-- | ```
encodeQueryParams
  :: Map NonEmptyString String
  -> Either (NonEmptyArray NonEmptyString) (Map NonEmptyString String)
encodeQueryParams kvs =
  let
    -- Step 1: Attempt to encode each value, producing Map k (Maybe v)
    encodedMap :: Map NonEmptyString (Maybe String)
    encodedMap = map JSURI.encodeURIComponent kvs

  -- Step 2: Fail if any encoding returned Nothing
  in
    catMaybes_errorIfSomeIsNothing encodedMap

-- | ## Examples
-- |
-- | ```purescript
-- | mkUrlWithMaybeQuery "https://my.website.com"
-- |   [ Tuple "ok" ""
-- |   , Tuple "ok2" "hi"
-- |   , Tuple "fail2" "\xD800" -- invalid surrogate
-- |   ]
-- | -- Left ["fail2"]
-- | ```
-- |
-- | ```purescript
-- | mkUrlWithMaybeQuery "https://my.website.com"
-- |   [ Tuple "ok" ""
-- |   , Tuple "ok2" "hi"
-- |   ]
-- | -- Right "https://my.website.com?ok=&ok2=hi"
-- | ```
-- |
-- | ```purescript
-- | mkUrlWithMaybeQuery "https://my.website.com" [ ]
-- | -- Right "https://my.website.com"
-- | ```
mkUrlWithMaybeQuery
  :: String
  -> Array (Tuple String String)
  -> Either (NonEmptyArray NonEmptyString) String
mkUrlWithMaybeQuery baseUrl kvs = do
  -- Step 1: filter out empty keys, turn into Map
  let
    kvsMap :: Map NonEmptyString String
    kvsMap =
      Map.fromFoldable
        ( mapMaybe
            ( \(Tuple k v) -> do
                k' <- NES.fromString k
                pure (Tuple k' v) -- v stays String
            )
            kvs
        )

  -- Step 2: try to encode query params
  encodedMap <- encodeQueryParams kvsMap

  -- Step 3: build query string if any
  case toQuery encodedMap of
    Nothing ->
      Right baseUrl
    Just query ->
      Right (baseUrl <> "?" <> NES.toString query)
