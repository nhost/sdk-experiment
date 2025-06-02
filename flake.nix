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
          (final: prev: { })
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

        checkDeps = [
          self.packages.${system}.codegen
        ];

        buildInputs = [
        ];

        nativeBuildInputs = [
        ];

        nixops-lib = nixops.lib { inherit pkgs; };

        codegenf = import ./tools/codegen/project.nix {
          inherit self pkgs nix-filter nixops-lib;
        };
      in
      {
        checks = flake-utils.lib.flattenTree {
          nixpkgs-fmt = nixops-lib.nix.check { src = nix-src; };

          codegen = codegenf.check;
        };

        devShells = flake-utils.lib.flattenTree {
          default = nixops-lib.go.devShell {
            buildInputs = with pkgs; [
              nhost-cli
              nodejs
              pnpm
            ] ++ checkDeps ++ buildInputs ++ nativeBuildInputs;
          };

          codegen = codegenf.devShell;
        };

        packages = flake-utils.lib.flattenTree {
          codegen = codegenf.package;
        };
      }
    );
}

