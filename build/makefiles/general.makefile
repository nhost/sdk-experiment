PROJ_DIR=$(abspath .)
PROJ=$(subst $(ROOT_DIR)/,,$(PROJ_DIR))
NAME=$(notdir $(PROJ))


ifeq ($(shell uname -m),x86_64)
  ARCH?=x86_64
else ifeq ($(shell uname -m),arm64)
  ARCH?=aarch64
else ifeq ($(shell uname -m),aarch64)
   ARCH?=aarch64
else
   ARCH?=FIXME-$(shell uname -m)
endif

ifeq ($(shell uname -o),Darwin)
  OS?=darwin
else
  OS?=linux
endif


VERSION=$(shell echo $(VER) | sed -e 's/\//_/g')

.PHONY: help
help: ## Show this help.
	@echo
	@awk 'BEGIN { \
		FS = "##"; \
		printf "Usage: make \033[36m<target>\033[0m\n"} \
		/^[a-zA-Z_-]+%?:.*?##/ { printf "  \033[36m%-38s\033[0m %s\n", $$1, $$2 } ' \
		$(MAKEFILE_LIST)


.PHONY: print-vars
print-vars:  ## print all variables
	@$(foreach V,$(sort $(.VARIABLES)), \
	   $(if $(filter-out environment% default automatic, \
	   $(origin $V)),$(info $V=$($V) ($(value $V)))))
