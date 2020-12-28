start-backend:
	npx nodemon --watch server server/bin/server-for-cube.js

start-frontend:
	cd cube-ui && npm run build && serve -s build