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
          (final: prev: {
            certbot-full = prev.certbot.overrideAttrs (old: {
              doCheck = false;
            });
          })
        ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        src = nix-filter.lib.filter {
          root = ./.;
          include = with nix-filter.lib;[
            ".golangci.yaml"
            "go.mod"
            "go.sum"
            (inDirectory "vendor")
            isDirectory
            (nix-filter.lib.matchExt "go")
            (nix-filter.lib.matchExt "tmpl")
          ];
        };

        nix-src = nix-filter.lib.filter {
          root = ./.;
          include = with nix-filter.lib;[
            (matchExt "nix")
          ];
        };

        checkDeps = with pkgs; [
        ];

        buildInputs = with pkgs; [
        ];

        nativeBuildInputs = with pkgs; [
        ];

        nixops-lib = nixops.lib { inherit pkgs; };

        name = "codegen";
        description = "Codegen";
        version = "0.0.0-dev";
        submodule = ".";

        tags = [ ];

        ldflags = [
          "-X main.Version=${version}"
        ];
      in
      {
        checks = flake-utils.lib.flattenTree rec {
          nixpkgs-fmt = nixops-lib.nix.check { src = nix-src; };

          go-checks = nixops-lib.go.check {
            inherit src submodule ldflags tags buildInputs nativeBuildInputs checkDeps;
          };
        };

        devShells = flake-utils.lib.flattenTree rec {
          default = nixops-lib.go.devShell {
            buildInputs = with pkgs; [
            ] ++ checkDeps ++ buildInputs ++ nativeBuildInputs;
          };
        };

        packages = flake-utils.lib.flattenTree rec {
          codegen = nixops-lib.go.package {
            inherit name submodule description src version ldflags buildInputs nativeBuildInputs;
          };

          default = codegen;
        };
      }
    );
}
