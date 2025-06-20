# Variables
NPM := npm
TSC := npx tsc
TSX := npx tsx
NODE := node
PROJECT_NAME := mcp-docker-102
IMAGE_NAME := mcp-weather-server

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.PHONY: help
help: ## Display this help message
	@echo "$(GREEN)$(PROJECT_NAME) - Available commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# Installation
.PHONY: install
install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	$(NPM) install

.PHONY: install-clean
install-clean: clean-deps install ## Clean install dependencies

# Development
.PHONY: dev
dev: ## Run development server with hot reload
	@echo "$(GREEN)Starting development server...$(NC)"
	$(NPM) run dev

.PHONY: watch
watch: ## Run in watch mode
	@echo "$(GREEN)Starting watch mode...$(NC)"
	$(NPM) run watch

# Building
.PHONY: build
build: ## Build the project
	@echo "$(GREEN)Building project...$(NC)"
	$(NPM) run build

.PHONY: build-clean
build-clean: clean build ## Clean build

# Testing
.PHONY: test
test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	$(NPM) run test

.PHONY: test-watch
test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	$(TSX) watch src/test.ts

# Running
.PHONY: start
start: ## Start the built application
	@echo "$(GREEN)Starting application...$(NC)"
	$(NPM) run start

.PHONY: start-prod
start-prod: build start ## Build and start the application

# Linting and formatting (if you add these tools later)
.PHONY: lint
lint: ## Lint the code (requires eslint)
	@if [ -f "node_modules/.bin/eslint" ]; then \
		echo "$(GREEN)Linting code...$(NC)"; \
		npx eslint src/**/*.ts; \
	else \
		echo "$(YELLOW)ESLint not installed. Run 'npm install --save-dev eslint' to add linting.$(NC)"; \
	fi

.PHONY: format
format: ## Format the code (requires prettier)
	@if [ -f "node_modules/.bin/prettier" ]; then \
		echo "$(GREEN)Formatting code...$(NC)"; \
		npx prettier --write src/**/*.ts; \
	else \
		echo "$(YELLOW)Prettier not installed. Run 'npm install --save-dev prettier' to add formatting.$(NC)"; \
	fi

# Type checking
.PHONY: typecheck
typecheck: ## Run TypeScript type checking
	@echo "$(GREEN)Running type check...$(NC)"
	$(TSC) --noEmit

# Cleaning
.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf *.tsbuildinfo

.PHONY: clean-deps
clean-deps: ## Clean dependencies
	@echo "$(GREEN)Cleaning dependencies...$(NC)"
	rm -rf node_modules/
	rm -f package-lock.json

.PHONY: clean-all
clean-all: clean clean-deps ## Clean everything

# Package management
.PHONY: outdated
outdated: ## Check for outdated packages
	@echo "$(GREEN)Checking for outdated packages...$(NC)"
	$(NPM) outdated

.PHONY: update
update: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	$(NPM) update

# Git helpers
.PHONY: git-status
git-status: ## Show git status
	@git status

.PHONY: git-clean
git-clean: ## Clean untracked files (dry run)
	@echo "$(YELLOW)Files that would be removed:$(NC)"
	@git clean -n

# Production helpers
.PHONY: package
package: build ## Create a package (tar.gz)
	@echo "$(GREEN)Creating package...$(NC)"
	$(NPM) pack

.PHONY: verify
verify: clean install build test ## Full verification pipeline
	@echo "$(GREEN)✅ All checks passed!$(NC)"

# Quick development commands
.PHONY: quick
quick: install build ## Quick setup: install and build

.PHONY: reset
reset: clean-all install build ## Reset project: clean everything and rebuild

# Docker helpers
.PHONY: docker-build

docker-build: ## Build the Docker image ($(IMAGE_NAME))
	@echo "$(GREEN)Building Docker image '$(IMAGE_NAME)'...$(NC)"
	docker build -t $(IMAGE_NAME) .

.PHONY: docker-remove

docker-remove: ## Remove the Docker image ($(IMAGE_NAME))
	@echo "$(YELLOW)Removing Docker image '$(IMAGE_NAME)'...$(NC)"
	docker rmi $(IMAGE_NAME) || true

# Docker security scan
.PHONY: scan

scan: ## Scan the Docker image ($(IMAGE_NAME)) for vulnerabilities using Trivy
	@echo "$(GREEN)Scanning Docker image '$(IMAGE_NAME)' for vulnerabilities with Trivy...$(NC)"
	@docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $(IMAGE_NAME)

# Default target when no arguments provided
.DEFAULT_GOAL := help