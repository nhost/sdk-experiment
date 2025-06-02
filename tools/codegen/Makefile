ROOT_DIR?=$(abspath ../../)
include $(ROOT_DIR)/build/makefiles/general.makefile


.PHONY: dev-env-up
dev-env-up:  ## Start the development environment
	echo "Nothing to do"


.PHONY: check-dry-run
check-dry-run:  ## Returns the derivation of the check
	@nix build \
		--dry-run \
		--json \
		--print-build-logs | jq -r '.[].outputs.out'


.PHONY: check
check:  ## Run nix flake check
	nix flake check --print-build-logs


.PHONY: build
build:  ## Build application and places the binary under ./result/bin
	nix build \
		--print-build-logs


.PHONY: get-version
get-version:  ## Return version
	@sed -i '/^\s*version = "0\.0\.0-dev";/s//        version = "${VERSION}";/' flake.nix
	@echo $(VERSION)
