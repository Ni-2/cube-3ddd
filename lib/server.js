"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _makeTriangulation = _interopRequireDefault(require("./makeTriangulation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line import/no-anonymous-default-export
var _default = function _default(boxParameters) {
  var app = (0, _express["default"])(); // Priority serve any static files.

  app.use(_express["default"]["static"](_path["default"].resolve(process.cwd(), '../cube-ui/build')));
  app.use(_express["default"].json()); // for parsing application/json

  app.use(_express["default"].urlencoded({
    extended: true
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
      boxParameters = {
        defaultParameters: defaultParameters
      };
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
    response.sendFile(_path["default"].resolve(process.cwd(), 'cube-ui/build', 'index.html'));
  });
  return app;
};

exports["default"] = _default;