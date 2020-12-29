start-backend:
	node server/bin/server-for-cube.js
	
start-backend-dev:
	nodemon --watch server --inspect server/bin/server-for-cube.js

start-frontend:
	cd cube-ui/ && npm install && npm run build

start-frontend-dev:
	cd cube-ui/ && npm run build && serve -s build

deploy:
	node lib/bin/server-for-cube.js