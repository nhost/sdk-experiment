.PHONY: check
check:  ## Run tests with pnpm
	pnpm test


.PHONY: build
build:  ## Build project with pnpm
	pnpm install
	pnpm build
