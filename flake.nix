{
  inputs = {
    nixops.url = "github:nhost/nixops";
    nixpkgs.follows = "nixops/nixpkgs";
    flake-utils.follows = "nixops/flake-utils";
    nix-filter.follows = "nixops/nix-filter";
  };

  outputs = { self, nixops, nixpkgs, flake-utils, nix-filter }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [
          nixops.overlays.default
        ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        nix-src = nix-filter.lib.filter {
          root = ./.;
          include = with nix-filter.lib;[
            (matchExt "nix")
          ];
        };

        nixops-lib = nixops.lib { inherit pkgs; };
      in
      {
        checks = flake-utils.lib.flattenTree {
          nixpkgs-fmt = nixops-lib.nix.check { src = nix-src; };
        };

        devShells = flake-utils.lib.flattenTree {
          default = nixops-lib.go.devShell {
            buildInputs = with pkgs; [
              openapi-generator-cli
              nodejs_22
              pnpm
            ];
          };
        };
      }
    );
}

