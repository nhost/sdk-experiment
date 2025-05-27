ifeq ($(shell uname -m),x86_64)
  HOST_ARCH?=x86_64
  ARCH?=amd64
else ifeq ($(shell uname -m),arm64)
  HOST_ARCH?=aarch64
  ARCH?=arm64
endif

ifeq ($(shell uname -o),Darwin)
  OS?=darwin
else
  OS?=linux
endif

VER=$(shell echo $(VERSION) | sed -e 's/\//_/g')


.PHONY: check
check:  ## Run nix flake check
	@sed -i 's/$$NHOST_PAT/$(NHOST_PAT)/' get_access_token.sh
	nix flake check --print-build-logs


.PHONY: build
build:  ## Build application and places the binary under ./result/bin
	nix build \
		--print-build-logs


.PHONY: get-version
get-version:  ## Return version
	@sed -i '/^\s*version = "0\.0\.0-dev";/s//version = "${VERSION}";/' flake.nix
	@echo $(VERSION)
