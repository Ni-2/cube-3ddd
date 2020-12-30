# Only fo development

backend:
	nodemon --watch lib --inspect lib/bin/

frontend:
	cd cube-ui/ && npm run build && serve -s build