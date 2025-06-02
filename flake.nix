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

        checkDeps = with pkgs; [
          self.packages.${system}.codegen
          nhost-cli
          nodejs
          pnpm
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

        devShells = flake-utils.lib.flattenTree rec {
          default = nhost-js;

          nhost-js = pkgs.mkShell {
            buildInputs = [
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

