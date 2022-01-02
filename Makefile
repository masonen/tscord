MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c

DOCKER_COMPOSE := docker-compose
DOCKER := docker

build: ## Builds the bot service
	$(DOCKER_COMPOSE) build --build-arg BUILDKIT_INLINE_CACHE=1 bot
.PHONY: build

start: ## starts the bot
	$(DOCKER_COMPOSE) up --remove-orphans -d bot
.PHONY: start

start-logs: ## starts the bot and opens bot logs
	$(DOCKER_COMPOSE) up --remove-orphans -d bot
	$(DOCKER) logs -f tscord_bot_1
.PHONY: start-logs

deploy-commands: ## deploys commands should be done after updating the bot
	$(DOCKER_COMPOSE) run --rm bot npm run deploy-commands
.PHONY: deploy-commands

start-express: ## Starts the mongo express service
	$(DOCKER_COMPOSE) up --remove-orphans -d mongo-express
.PHONY: start-express

pull: ## Pull images
	$(DOCKER_COMPOSE) pull --include-deps
.PHONY: pull

stop: ## Stop the entire docker compose stack
	$(DOCKER_COMPOSE) stop
.PHONY: stop

down: ## Shutdown all containers and but leaving volumes
	$(DOCKER_COMPOSE) down
.PHONY: down

clean: ## Stops and removes all containers from the docker compose stack
	$(DOCKER_COMPOSE) down -v
.PHONY: clean

clean-dist: ## Stops and removes all containers from the docker compose stack, as well as their images
	$(DOCKER_COMPOSE) down --rmi all -v
.PHONY: clean-dist

bot-logs: ## show bot logs
	$(DOCKER) logs -f tscord_bot_1
.PHONY: bot-logs

db-logs: ## show db logs
	$(DOCKER) logs -f tscord_mongo_1
.PHONY: db-logs