.PHONY: check
check:  ## Run nix flake check
	nix flake check --print-build-logs
