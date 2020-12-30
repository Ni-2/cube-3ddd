"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _cluster = _interopRequireDefault(require("cluster"));

var _os = _interopRequireDefault(require("os"));

var _makeTriangulation = _interopRequireDefault(require("./makeTriangulation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

var numCPUs = _os["default"].cpus().length;

// eslint-disable-next-line import/no-anonymous-default-export
var _default = function _default(port, isDev) {
  if (!isDev && _cluster["default"].isMaster) {
    // Multi-process to utilize all CPU cores.
    console.error("Node cluster master ".concat(process.pid, " is running")); // Fork workers.

    for (var i = 0; i < numCPUs; i++) {
      _cluster["default"].fork();
    }

    _cluster["default"].on('exit', function (worker, code, signal) {
      console.error("Node cluster worker ".concat(worker.process.pid, " exited: code ").concat(code, ", signal ").concat(signal));
    });
  } else {
    var absoluteFileName = _path["default"].resolve(__dirname, './boxParameters.json');

    var data = _fs["default"].readFileSync(absoluteFileName, 'utf-8');

    var boxParameters = JSON.parse(data);
    var app = (0, _express["default"])(); // Priority serve any static files.

    app.use(_express["default"]["static"](_path["default"].resolve(__dirname, '../cube-ui/build')));
    app.use(_express["default"].json()); // for parsing application/json

    app.use(_express["default"].urlencoded({
      extended: false
    })); // for parsing application/x-www-form-urlencoded
    // Answer API requests.

    app.get('/api', function (request, response) {
      response.set('Content-Type', 'application/json');
      response.set('Access-Control-Allow-Methods', ['POST', 'GET']);
      response.status(200);
      var url = new URL(request.url, "http://".concat(request.headers.host));

      var _Object$fromEntries = Object.fromEntries(url.searchParams),
          set = _Object$fromEntries.set;

      if (set === 'defaultParams') {
        var _boxParameters = boxParameters,
            defaultParameters = _boxParameters.defaultParameters;
        boxParameters = (_readOnlyError("boxParameters"), {
          defaultParameters: defaultParameters
        });
        response.json(boxParameters.defaultParameters);
      } else {
        response.json(boxParameters.usersParameters || boxParameters.defaultParameters);
      }
    });
    app.post('/api', function (request, response) {
      response.set('Content-Type', 'application/json');
      response.set('Access-Control-Allow-Methods', ['POST', 'GET']);
      var data = request.body;
      var parsedData = JSON.parse(Object.keys(data)[0]);
      var triangulation = (0, _makeTriangulation["default"])(parsedData);
      boxParameters.usersParameters = _objectSpread(_objectSpread({}, parsedData), triangulation);
      response.status(201);
      response.json(boxParameters.usersParameters);
    }); // All remaining requests return the React app, so it can handle routing.

    app.get('*', function (request, response) {
      response.sendFile(_path["default"].resolve(__dirname, '../cube-ui/build', 'index.html'));
    });
    app.listen(port, function () {
      console.error("Node ".concat(isDev ? 'dev server' : 'cluster worker ' + process.pid, ": listening on port ").concat(port));
    });
  }
};

exports["default"] = _default;