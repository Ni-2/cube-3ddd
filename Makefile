start-backend:
	nodemon --watch server --inspect server/bin/server-for-cube.js

start-frontend:
	cd cube-ui/ && npm install && npm run build

start-frontend-dev:
	cd cube-ui/ && npm run build && serve -s build