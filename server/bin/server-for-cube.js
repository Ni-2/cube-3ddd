import makeServer from '../index.js';

let port = process.env.PORT;
if (port == null || port === "") {
  port = 4000;
}
makeServer(port);