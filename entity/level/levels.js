var level1_1 = {
    //music:
    //label:
    width: 120,
    ground: [
        { x : 0, y : 12, width: 15, height : 1, type : 1 },
        { x : 60, y : 12, width: 34, height : 1, type : 1 },
        { x : 15, y : 11, width: 1, height : 1, type : 0 },
        { x : 16, y : 11, width: 1, height : 1, type : 1 },
        { x : 17, y : 11, width: 1, height : 1, type : 2 },
        { x : 20, y : 10, width: 1, height : 1, type : 0 },
        { x : 21, y : 10, width: 3, height : 1, type : 1 },
        { x : 24, y : 10, width: 1, height : 1, type : 2 },
        { x : 25, y : 11, width: 3, height : 1, type : 1 },
        { x : 28, y : 10, width : 1, height : 1, type : 0 },
        { x : 29, y : 10, width : 1, height : 1, type : 1 },
        { x : 30, y : 8, width : 1, height : 1, type : 0 },
        { x : 31, y : 8, width : 28, height : 1, type : 1 },
        { x : 59, y : 8, width : 1, height : 1, type : 2 },
        { x : 94, y : 3, width : 1, height : 1, type : 0 },
        { x : 95, y : 3, width : 25, height : 1, type : 1 }
    ],
    bricks: [
        { x : 30, y : -3, width : 90, height : 3 },
        { x : 30, y : 0, width : 60, height : 1 },
        { x : 30, y : 1, width : 60, height : 1 },
        { x : 30, y : 2, width : 30, height : 1 },
        { x : 75, y : 2, width : 15, height : 1 },
        { x : 30, y : 3, width : 25, height : 1 },
        { x : 80, y : 3, width : 10, height : 1 },
        { x : 32, y : 4, width : 18, height : 1 },
        { x : 85, y : 4, width : 5, height : 1 },
        { x : 95, y : 4, width : 25, height : 9 },
        { x : 32, y : 5, width : 13, height : 1 },
        { x : 85, y : 5, width : 5, height : 1 },
        { x : 40, y : 6, width : 5, height : 1 },
        { x : 85, y : 6, width : 5, height : 1 },
        { x : 85, y : 7, width : 5, height : 1 },
        { x : 85, y : 8, width : 5, height : 1 },
        { x : 31, y : 9, width : 28, height : 1 },
        { x : 30, y : 10, width : 29, height : 1 },
        { x : 21, y : 11, width : 4, height : 1 },
        { x : 28, y : 11, width : 31, height : 1 },
        { x : 15, y : 12, width : 3, height : 1 },
        { x : 20, y : 12, width : 42, height : 1 },
        { x : 94, y : 12, width : 1, height : 1 }
    ],
    walls: [
        { x : 90, y : 0, height : 8, type : 2 },
        { x : 90, y : 8, height : 1, type : 3 },
        { x : 94, y : 4, height : 8, type : 0 },
        { x : 30, y : 9, height : 1, type : 0 },
        { x : 59, y : 9, height : 3, type : 2 },
        { x : 20, y : 11, height : 1, type : 0 }
    ],
    backgroundWalls: [
        { x : 30, y : 0, width : 90, height : 12 }
    ],
    torches: [
        { x : 31, y : 5 },
        { x : 59, y : 5 },
        { x : 70, y : 7 },
        { x : 85, y : 9 },
        { x : 94, y : 0 },
        { x : 115, y : 0 }
    ],
    shrooms: [
        { x : 13, y : 6 },
        { x : 59, y : 5 },
        { x : 70, y : 7 },

    ],
    goblins : [
        { x : 10, y : 5}
    ],
    skeletons : [
        { x : 10, y : 5}
    ],
    doors: [
        { x : 116, y : 0 , canEnter : true }
    ]
}

var level1_2 = {
    width : 120,
    height : 36,
    ground : [
        { x : 0, y : 12, width : 120, type : 1 },
        { x : 45, y : 6, width : 1, type : 0 },
        { x : 46, y : 6, width : 14, type : 1 },
        { x : 1, y : 6, width : 41, type : 1 },
        { x : 5, y : -7, width: 35, type : 1 },
        { x : 4, y : -7, width : 1, type : 0 }
    ],
    bricks : [
        { x : 46, y : 7, width : 14, height : 5 },
        { x : 0, y : 7, width : 41, height : 2 },
        { x : 5, y : -6, width : 55, height : 7 },
        { x : 57, y : 1, width : 3, height : 1 },
        { x : 58, y : 2, width : 2, height : 1 },
        { x : 59, y : 3, width : 1, height : 1 },
        { x : 5, y : 1, width : 5, height : 1 },
        { x : 5, y : 2, width : 3, height : 1 },
        { x : 5, y : 3, width : 1, height : 1 },
        { x : 0, y : -12, width : 30, height : 2 },
        { x : 30, y : -8, width : 2, height : 1 },
        { x : 0, y : -24, width : 65, height : 8 },
        { x : 10, y : -16, width : 15, height : 2 },
        { x : 25, y : - 16, width : 1, height : 1 },
        { x : 10, y : -14, width : 5, height : 1 },
        { x : 35, y : -12, width : 25, height : 2 },
        { x : 41, y : -10, width : 19, height : 4 },
        { x : 65, y : -24, width : 55, height : 14 },
        { x : 65, y : -7, width : 55, height : 8 },
        { x : 85, y : -10, width : 35, height : 3 },
        { x : 9, y : -16, width : 1, height : 1 }
    ],
    walls : [
        { x : 41, y : 7, height : 2, type : 2 },
        { x : 40, y : -10, height : 4, type : 0 },
        { x : 64, y : -16, height : 6, type: 0 },
        { x : 64, y : -7, height : 15, type : 0 },
        { x : 60, y : -12, height : 25, type : 2 },
        { x : 45, y : 7, height : 5, type : 0 },
        { x : 0, y : -10, height : 19, type : 2 },
        { x : 4, y : -6, height : 10, type : 0 },
        { x : 0, y : -16, height : 4, type : 2 },
        { x : 30, y : -12, height : 2, type : 2 },
        { x : 34, y : -12, height : 3, type : 0 },
        { x : 84, y : -10, height : 3, type : 0 }

    ],
    backgroundWalls: [
        { x : 0, y : -24, width : 120, height : 36 }
    ],
    shrooms : [
        { x : 6, y : -12 },
        { x : 12, y : 8 },
        { x : 40, y : 8 }

    ],
    windows : [
        { x : 2, y : 3, width : 1, height : 1.5 },
        { x : 2, y : 0, width : 1, height : 1.5 },
        { x : 2, y : -3, width : 1, height : 1.5 },
        { x : 2, y : -6, width : 1, height : 1.5 },
        { x : 67, y : 4, width : 4, height : 7 },
        { x : 77, y : 4, width : 4, height : 7 },
        { x : 87, y : 4, width : 4, height : 7 },
        { x : 97, y : 4, width : 4, height : 7 },
        { x : 107, y : 4, width : 4, height : 7 },
        { x : 37, y : 2, width : 3, height : 3 },
        { x : 47, y : 2, width : 3, height : 3 },
        { x : 39, y : -14, width : 1, height : 1.5},
        { x : 46, y : -14, width : 1, height : 1.5}
    ],
    banners : [
        { x : 71, y : 8 },
        { x : 76, y : 8 },
        { x : 81, y : 8 },
        { x : 86, y : 8 },
        { x : 91, y : 8 },
        { x : 96, y : 8 },
        { x : 101, y : 8 },
        { x : 106, y : 8 }
    ],
    doors : [
        { x : 116, y : 9, canEnter : true},
        { x : 0, y : 9, canEnter : false }
    ],
    torches : [
        { x : 10, y : 9 },
        { x : 20, y : 9 },
        { x : 30, y : 9 },
        { x : 40, y : 9 },
        { x : 35, y : 3 },
        { x : 25, y : 3 },
        { x : 15, y : 3 },
        { x : 25, y : -14},
        { x : 35, y : -10},
        { x : 83, y : -10},
        { x : 77, y : -9},
        { x : 71, y : - 10},
        { x : 1, y : -15}
    ],
    chains : [
        { x : 36, y : 3 },
        { x : 40, y : 3 },
        { x : 46, y : 3 },
        { x : 50, y : 3 },
        { x : 35, y : -15 },
        { x : 42, y : -15 },
        { x : 49, y : -15 },
    ],
    columns : [
        { x : 74, y : 1, height : 11},
        { x : 84, y : 1, height : 11},
        { x : 94, y : 1, height : 11},
        { x : 104, y : 1, height : 11},
        { x : 53, y : 1, height : 5},
        { x : 34, y : 1, height : 5},
        { x : 24, y : 1, height : 5},
        { x : 14, y : 1, height : 5}
    ],
    supports : [
        { x : 64, y : 1, width : 56 },
        { x : 10, y : 1, width : 47 }
    ]
}

var level1_3 = {
    width : 120,
    height : 42,
    ground : [
        { x : 0, y : 12, width : 10, type : 1}
    ],
    bricks : [
        { x : 10, y : 10, width : 3, height : 3},
        { x : 13, y : 12, width : 20, height : 1},
        { x : 33, y : 10, width : 3, height : 3},
        { x : 36, y : 12, width : 48, height : 1},
        { x : 77, y : -5, width : 7, height : 17},
        { x : 71, y : -13, width : 13, height : 5},
        { x : 84, y : 0, width : 15, height : 13},
        { x : 99, y : -10, width : 21, height : 22},
        { x : 30, y : - 20, width : 13, height : 2},
        { x : 28, y : - 30, width : 2, height : 12},
        { x : 30, y : -30, width : 13, height : 5},
        { x : 27, y : -30, width : 1, height : 33},
        { x : 26, y : -30, width : 1, height : 31},
        { x : 24, y : -30, width : 1, height : 15},
        { x : 23, y : -30, width : 1, height : 7},
        { x : 25, y : -30, width : 1, height : 33},
        { x : 30, y : -18, width : 10, height : 1},
        { x : 31, y : -17, width : 7, height : 1},
        { x : 33, y : -16, width : 4, height : 1},
        { x : 30, y : -21, width : 2, height : 1},
        { x : 30, y : -25, width : 10, height : 1},
        { x : 30, y : -24, width : 1, height : 1},
        { x : 35, y : -15, width : 1, height : 18},
        { x : 34, y : -15, width : 1, height : 16},
        { x : 36, y : -15, width : 1, height : 17},
        { x : 4, y : -30, width : 1, height : 33},
        { x : 5, y : -30, width : 1, height : 34},
        { x : 15, y : -30, width : 1, height : 33},
        { x : 16, y : -30, width : 1, height : 31},
        { x : 91, y : -30, width : 1, height : 18},
        { x : 90, y : -30, width : 1, height : 16},
        { x : 89, y : -30, width : 1, height : 10},
        { x : 69, y : -30, width : 21, height : 12},
        { x : 85, y : -18, width : 5, height : 1},
        { x : 87, y : -17, width : 3, height : 1},
        { x : 89, y : -16, width : 1, height : 1}
    ],
    platforms : [
        { x : 22, y : 10, width : 2, height : 1},
        { x : 42, y : 4, width : 2, height : 1},
        { x : 50, y : 0, width : 2, height : 1},
        { x : 59, y : -10, width : 5, height : 1},
        { x : 69, y : 0, width : 5, height : 1},
        { x : 89, y : -5, width : 3, height : 1},
        { x : 45, y : -18, width : 2, height : 1}
    ],
    walls : [
        { x : 57, y : -10, height : 8, type : 0},
        { x : 53, y : - 13, height : 7, type : 2},
        { x : 70, y : -13, height : 12, type : 0}
    ],
    backgroundWalls: [
        { x : 0, y : -30, width : 120, height : 42 }
    ],
    columns : [
        { x : 5, y : 4, height : 8},
        { x : 15, y : 3, height : 9},
        { x : 26, y : 1, height : 11},
        { x : 35, y : 3, height : 9}
    ]
}
