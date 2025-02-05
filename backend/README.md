# backend

This is a very simple Nhost backend that we will use to demonstrate how to use the various SDKs we are experimenting with. The backend will consist of the following:

- A `tasks` table with the following columns:
  - `id` (UUID)
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
  - `user_id` (foreigh key to `auth.users.id`)
  - `title` (Text)
  - `description` (Text)
  - `completed` (Boolean)
  - `attachment` (foreigh key to `storage.files.id`)

- A `simple` function called `echo` that will just return back some request information
