"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _server = _interopRequireDefault(require("./server.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line import/no-anonymous-default-export
var _default = function _default(port) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var absoluteFileName = _path["default"].resolve(process.cwd(), 'server/boxParameters.json');

  var data = _fs["default"].readFileSync(absoluteFileName, 'utf-8');

  var boxParameters = JSON.parse(data);
  var server = (0, _server["default"])(boxParameters);
  server.listen(port, function () {
    return callback(server);
  });
};

exports["default"] = _default;