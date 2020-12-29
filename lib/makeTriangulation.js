"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// eslint-disable-next-line import/no-anonymous-default-export
var _default = function _default(usersData) {
  var makeBoxPoints = function makeBoxPoints(boxLength, boxHeight, boxWidth) {
    return [[0, 0, boxWidth], // 0
    [boxLength, 0, boxWidth], // 1
    [0, boxHeight, boxWidth], // 2
    [boxLength, boxHeight, boxWidth], // 3
    [0, 0, 0], // 4
    [boxLength, 0, 0], // 5
    [0, boxHeight, 0], // 6
    [boxLength, boxHeight, 0] // 7
    ];
  };
  /*
        6----7
      /|   /|
      2----3 |
      | |  | |
      | 4--|-5
      |/   |/
      0----1
  */


  var makeBoxFaces = function makeBoxFaces() {
    return [// front
    [0, 3, 2], [0, 1, 3], // right
    [1, 7, 3], [1, 5, 7], // back
    [5, 6, 7], [5, 4, 6], // left
    [4, 2, 6], [4, 0, 2], // top
    [2, 7, 6], [2, 3, 7], // bottom
    [4, 1, 0], [4, 5, 1]];
  };

  var boxLength = usersData.boxLength,
      boxHeight = usersData.boxHeight,
      boxWidth = usersData.boxWidth;
  var points = makeBoxPoints(boxLength, boxHeight, boxWidth);
  var faces = makeBoxFaces();
  return {
    points: points,
    faces: faces
  };
};

exports["default"] = _default;