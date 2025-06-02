ROOT_DIR?=$(abspath .)
include $(ROOT_DIR)/build/makefiles/general.makefile
include $(ROOT_DIR)/build/makefiles/typescript.makefile

.PHONY: dev-env-up
dev-env-up:
	@cd backend && nhost up
