// eslint-disable-next-line import/no-anonymous-default-export
export default (usersData) => {
    const makeBoxPoints = (boxLength, boxHeight, boxWidth) => [
        [0, 0, boxWidth],  // 0
        [boxLength, 0, boxWidth],  // 1
        [0, boxHeight, boxWidth],  // 2
        [boxLength, boxHeight, boxWidth],  // 3
        [0, 0, 0],  // 4
        [boxLength, 0, 0],  // 5
        [0, boxHeight, 0],  // 6
        [boxLength, boxHeight, 0],  // 7
    ];

    /*
          6----7
        /|   /|
        2----3 |
        | |  | |
        | 4--|-5
        |/   |/
        0----1
    */

    const makeBoxFaces = () => [
        // front
        [0, 3, 2],
        [0, 1, 3],
        // right
        [1, 7, 3],
        [1, 5, 7],
        // back
        [5, 6, 7],
        [5, 4, 6],
        // left
        [4, 2, 6],
        [4, 0, 2],
        // top
        [2, 7, 6],
        [2, 3, 7],
        // bottom
        [4, 1, 0],
        [4, 5, 1],
    ];

    const { boxLength, boxHeight, boxWidth } = usersData;
    const points = makeBoxPoints(boxLength, boxHeight, boxWidth);
    const faces = makeBoxFaces();
    return { points, faces };
};