# Only for development

start:
	nodemon --watch lib --inspect lib/bin/

build:
	./node_modules/.bin/babel server -d lib && cd cube-ui/ && npm run build

build-f:
	cd cube-ui/ && npm run build