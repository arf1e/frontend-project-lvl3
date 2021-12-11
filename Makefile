develop:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

link:
	npm link

test-coverage:
	npm test -- --coverage --coverage-provider=v8

.PHONY: test