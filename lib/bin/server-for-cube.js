"use strict";

var _index = _interopRequireDefault(require("../index.js"));

var _cluster = _interopRequireDefault(require("cluster"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var numCPUs = _os["default"].cpus().length;

var isDev = process.env.NODE_ENV !== 'production';
var PORT = process.env.PORT || 5000; // Multi-process to utilize all CPU cores.

if (!isDev && _cluster["default"].isMaster) {
  console.error("Node cluster master ".concat(process.pid, " is running")); // Fork workers.

  for (var i = 0; i < numCPUs; i++) {
    _cluster["default"].fork();
  }

  _cluster["default"].on('exit', function (worker, code, signal) {
    console.error("Node cluster worker ".concat(worker.process.pid, " exited: code ").concat(code, ", signal ").concat(signal));
  });
} else {
  (0, _index["default"])(PORT);
}