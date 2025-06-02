ROOT_DIR?=$(abspath .)
include $(ROOT_DIR)/build/makefiles/general.makefile
include $(ROOT_DIR)/build/makefiles/typescript.makefile


.PHONY: dev-env-up
dev-env-up:
	make -C backend dev-env-up


.PHONY: dev-env-down
dev-env-down:
	make -C backend dev-env-down
