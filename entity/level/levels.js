/**
 * JSON file to store level data.
 * This file contains global vaiables that store objects data used to build
 * environment or entities in a level. Used by scenemanager.
 * 
 * IMPORTANT DEVELOPER NOTES:
 * Levels are built in 1st quadrant of cordinate plane.
 * Height is drawn from up to down.
 * Width is drawn from left to right.
 * Build levels above y = 0 because below that is the death zone!
 * 
 * 
 * Each level variable MUST HAVE:
 *      ID: 0,1,2...    (level number)
 *      width, height   (converted into PARAMS.BLOCKDIM)
 *      player: {x, y}  (starting pos)
 * 
 * The rest will be entities or environment objects. Probably have ground below player or you will fall yo your death.
 * doors must be in the format of door: { x : 1, y : 3 , canEnter : true,  exitLocation: {x: 1, y: 1, levelNum: 1}},
 */

/**TEST LEVEL = Debugging/testing room aka LEVEL 0 */
var testLevel = {
    ID: 0,
    width: 24, height: 14,
    player: {x: 1, y: 1},
    doors: [
        { x : 1, y : 3 , canEnter : true,  exitLocation: {x: 1, y: 1, levelNum: 1}}, //door to level 3
        { x : 6, y : 6 , canEnter : true, exitLocation: {x: 1, y: 1, levelNum: 2}}, //door to level 2
        { x : 21, y : 3 , canEnter : true,  exitLocation: {x: 1, y: 1, levelNum: 3}}, //door to level 1
    ],
    backgroundWalls: [
        { x : 0, y : 14, width : 24, height : 14 }
    ],
    ground: [
        { x : 0, y : 0, width: 30, height : 1, type : 1 },
        { x : 4, y : 3, width: 5, height : 1, type : 2},
        { x : 10, y : 6, width: 3, height : 1, type : 2}

    ],

    walls: [
        { x : -1, y : 14, height : 14, type : 2 },
        { x : 15, y : 14, height : 13, type : 2 },
        { x : 25, y : 14, height : 14, type : 2 },
    ],

    shrooms: [
        { x : 16, y : 1 },

    ],
    goblins : [
        { x : 10, y : 1}
    ],
    skeletons : [
        { x : 10, y : 6}
    ],
}


/**
 * Levels below
 */
var level1_1 = {
    //music:
    //label:
    ID: 1,
    width: 120, height: 15,
    player: {x: 0, y: 1},
    doors: [
        { x : 116, y : 12 , canEnter : true, exitLocation: {x: 1, y: 1, levelNum: 2}}, //door to level 2
        { x : 2, y : 3 , canEnter : true, exitLocation: {x: 1, y: 1, levelNum: 0}} //debugging room, DELETE THIS BEFORE SUBMISSION!
    ],
    ground: [
        { x : 0, y : 0, width: 15, height : 1, type : 1 },
        { x : 60, y : 0, width: 34, height : 1, type : 1 },
        { x : 15, y : 1, width: 1, height : 1, type : 0 },
        { x : 16, y : 1, width: 1, height : 1, type : 1 },
        { x : 17, y : 1, width: 1, height : 1, type : 2 },
        { x : 20, y : 2, width: 1, height : 1, type : 0 },
        { x : 21, y : 2, width: 3, height : 1, type : 1 },
        { x : 24, y : 2, width: 1, height : 1, type : 2 },
        { x : 25, y : 1, width: 3, height : 1, type : 1 },
        { x : 28, y : 2, width : 1, height : 1, type : 0 },
        { x : 29, y : 2, width : 1, height : 1, type : 1 },
        { x : 30, y : 4, width : 1, height : 1, type : 0 },
        { x : 31, y : 4, width : 28, height : 1, type : 1 },
        { x : 59, y : 4, width : 1, height : 1, type : 2 },
        { x : 94, y : 9, width : 1, height : 1, type : 0 },
        { x : 95, y : 9, width : 25, height : 1, type : 1 }
    ],
    bricks: [
        { x : 30, y : 15, width : 90, height : 3 },
        { x : 30, y : 12, width : 60, height : 2 },
        { x : 30, y : 10, width : 30, height : 1 },
        { x : 75, y : 10, width : 15, height : 1 },
        { x : 30, y : 9, width : 25, height : 1 },
        { x : 80, y : 9, width : 10, height : 1 },
        { x : 32, y : 8, width : 18, height : 1 },
        { x : 85, y : 8, width : 5, height : 5 },
        { x : 95, y : 8, width : 25, height : 9 },
        { x : 32, y : 7, width : 13, height : 1 },
        { x : 40, y : 6, width : 5, height : 1 },
        { x : 31, y : 3, width : 28, height : 1 },
        { x : 30, y : 2, width : 29, height : 1 },
        { x : 21, y : 1, width : 4, height : 1 },
        { x : 28, y : 1, width : 31, height : 1 },
        { x : 15, y : 0, width : 3, height : 1 },
        { x : 20, y : 0, width : 40, height : 1 },
        { x : 94, y : 0, width : 1, height : 1 }
    ],
    walls: [
        { x : 90, y : 12, height : 8, type : 2 },
        { x : 90, y : 4, height : 1, type : 3 },
        { x : 94, y : 8, height : 8, type : 0 },
        { x : 30, y : 3, height : 1, type : 0 },
        { x : 59, y : 3, height : 3, type : 2 },
        { x : 20, y : 1, height : 1, type : 0 },
        { x : 120, y : 15, height : 1, type : 0 }
    ],
    backgroundWalls: [
        { x : 30, y : 12, width : 90, height : 12 }
    ],
    torches: [
        { x : 31, y : 7 },
        { x : 59, y : 7 },
        { x : 70, y : 5 },
        { x : 85, y : 3 },
        { x : 94, y : 12 },
        { x : 115, y : 12 }
    ],
    shrooms: [
        { x : 16, y : 2 },
        { x : 62, y : 1 },
        { x : 72, y : 5 },

    ],
    goblins : [
        { x : 112, y : 12}
    ],
    skeletons : [
        { x : 57, y : 7}
    ],
}

var level1_2 = {
    ID: 2,
    width : 120, height : 36,
    player: {x: 1, y: 1},
    doors : [
        { x : 116, y : 3, canEnter : true, exitLocation: {x: 1, y: 1, levelNum: 3}}, //next level to 3
        { x : 0, y : 3, canEnter : true, exitLocation: {x: 116, y: 10, levelNum: 1} } //go back to level 1
    ],

    ground : [
        { x : 0, y : 0, width : 120, height: 1, type : 1 },
        { x : 45, y : 6, width : 1, height: 1, type : 0 },
        { x : 46, y : 6, width : 14, height: 1, type : 1 },
        { x : 1, y : 6, width : 41, height: 1, type : 1 },
        { x : 5, y : 19, width: 35, height: 1, type : 1 },
        { x : 4, y : 19, width : 1, height: 1, type : 0 }
    ],
    bricks : [
        { x : 46, y : 5, width : 14, height : 5 },
        { x : 0, y : 5, width : 41, height : 2 },
        { x : 5, y : 18, width : 55, height : 7 },
        { x : 57, y : 11, width : 3, height : 1 },
        { x : 58, y : 10, width : 2, height : 1 },
        { x : 59, y : 9, width : 1, height : 1 },
        { x : 5, y : 11, width : 5, height : 1 },
        { x : 5, y : 10, width : 3, height : 1 },
        { x : 5, y : 9, width : 1, height : 1 },
        { x : 0, y : 24, width : 30, height : 2 },
        { x : 30, y : 20, width : 2, height : 1 },
        { x : 0, y : 36, width : 65, height : 8 },
        { x : 10, y : 28, width : 15, height : 2 },
        { x : 25, y : 28, width : 1, height : 1 },
        { x : 10, y : 26, width : 5, height : 1 },
        { x : 35, y : 24, width : 25, height : 2 },
        { x : 41, y : 22, width : 19, height : 4 },
        { x : 65, y : 36, width : 55, height : 14 },
        { x : 65, y : 19, width : 55, height : 8 },
        { x : 85, y : 22, width : 35, height : 3 },
        { x : 9, y : 28, width : 1, height : 1 }
    ],
    walls : [
        { x : 41, y : 5, height : 2, type : 2 },
        { x : 40, y : 22, height : 4, type : 0 },
        { x : 64, y : 28, height : 6, type: 0 },
        { x : 64, y : 19, height : 15, type : 0 },
        { x : 60, y : 24, height : 25, type : 2 },
        { x : 45, y : 5, height : 5, type : 0 },
        { x : 0, y : 24, height : 19, type : 2 },
        { x : 4, y : 18, height : 10, type : 0 },
        { x : 0, y : 28, height : 4, type : 2 },
        { x : 30, y : 24, height : 2, type : 2 },
        { x : 34, y : 24, height : 3, type : 0 },
        { x : 84, y : 22, height : 3, type : 0 }

    ],
    backgroundWalls: [
        { x : 0, y : 36, width : 120, height : 36 }
    ],
    shrooms : [
        { x : 6, y : 20 },
        { x : 12, y : 1 },
        { x : 40, y : 1 }

    ],
    windows : [
        { x : 2, y : 9, width : 1, height : 1.5 },
        { x : 2, y : 12, width : 1, height : 1.5 },
        { x : 2, y : 15, width : 1, height : 1.5 },
        { x : 2, y : 18, width : 1, height : 1.5 },
        { x : 67, y : 8, width : 4, height : 7 },
        { x : 77, y : 8, width : 4, height : 7 },
        { x : 87, y : 8, width : 4, height : 7 },
        { x : 97, y : 8, width : 4, height : 7 },
        { x : 107, y : 8, width : 4, height : 7 },
        { x : 37, y : 10, width : 3, height : 3 },
        { x : 47, y : 10, width : 3, height : 3 },
        { x : 39, y : 26, width : 1, height : 1.5},
        { x : 46, y : 26, width : 1, height : 1.5}
    ],
    banners : [
        { x : 71, y : 4 },
        { x : 76, y : 4 },
        { x : 81, y : 4 },
        { x : 86, y : 4 },
        { x : 91, y : 4 },
        { x : 96, y : 4 },
        { x : 101, y : 4 },
        { x : 106, y : 4 }
    ],
    torches : [
        { x : 10, y : 3 },
        { x : 20, y : 3 },
        { x : 30, y : 3 },
        { x : 40, y : 3 },
        { x : 35, y : 6 },
        { x : 25, y : 6 },
        { x : 15, y : 6 },
        { x : 25, y : 26},
        { x : 35, y : 22},
        { x : 83, y : 22},
        { x : 77, y : 21},
        { x : 71, y : 22},
        { x : 1, y : 27}
    ],
    chains : [
        { x : 36, y : 9 },
        { x : 40, y : 9 },
        { x : 46, y : 9 },
        { x : 50, y : 9 },
        { x : 35, y : 27 },
        { x : 42, y : 27 },
        { x : 49, y : 27 },
    ],
    columns : [
        { x : 74, y : 11, height : 11},
        { x : 84, y : 11, height : 11},
        { x : 94, y : 11, height : 11},
        { x : 104, y : 11, height : 11},
        { x : 53, y : 11, height : 5},
        { x : 34, y : 11, height : 5},
        { x : 24, y : 11, height : 5},
        { x : 14, y : 11, height : 5}
    ],
    supports : [
        { x : 64, y : 11, width : 56 },
        { x : 10, y : 11, width : 47 }
    ]
}

var level1_3 = {
    ID: 3,
    width : 120, height : 42,
    player: {x: 1, y: 1},
    doors : [
        { x : 1, y : 3, canEnter : true, exitLocation: {x: 116, y: 3, levelNum: 2}}, //go back to level 2
    ],
    ground : [
        { x : 0, y : 0, width : 10, type : 1}
    ],
    bricks : [
        { x : 10, y : 2, width : 3, height : 3},
        { x : 13, y : 0, width : 20, height : 1},
        { x : 33, y : 2, width : 3, height : 3},
        { x : 36, y : 0, width : 48, height : 1},
        { x : 77, y : 17, width : 7, height : 17},
        { x : 71, y : 25, width : 13, height : 5},
        { x : 84, y : 12, width : 15, height : 13},
        { x : 99, y : 22, width : 21, height : 22},
        { x : 30, y : 32, width : 13, height : 2},
        { x : 28, y : 42, width : 2, height : 12},
        { x : 30, y : 42, width : 13, height : 5},
        { x : 27, y : 42, width : 1, height : 33},
        { x : 26, y : 42, width : 1, height : 31},
        { x : 24, y : 42, width : 1, height : 15},
        { x : 23, y : 42, width : 1, height : 7},
        { x : 25, y : 42, width : 1, height : 33},
        { x : 30, y : 30, width : 10, height : 1},
        { x : 31, y : 29, width : 7, height : 1},
        { x : 33, y : 28, width : 4, height : 1},
        { x : 30, y : 33, width : 2, height : 1},
        { x : 30, y : 37, width : 10, height : 1},
        { x : 30, y : 36, width : 1, height : 1},
        { x : 35, y : 27, width : 1, height : 18},
        { x : 34, y : 27, width : 1, height : 16},
        { x : 36, y : 27, width : 1, height : 17},
        { x : 4, y : 42, width : 1, height : 33},
        { x : 5, y : 42, width : 1, height : 34},
        { x : 15, y : 42, width : 1, height : 33},
        { x : 16, y : 42, width : 1, height : 31},
        { x : 91, y : 42, width : 1, height : 18},
        { x : 90, y : 42, width : 1, height : 16},
        { x : 89, y : 42, width : 1, height : 10},
        { x : 69, y : 42, width : 21, height : 12},
        { x : 85, y : 30, width : 5, height : 1},
        { x : 87, y : 29, width : 3, height : 1},
        { x : 89, y : 28, width : 1, height : 1}
    ],
    platforms : [
        { x : 22, y : 2, width : 2, height : 1},
        { x : 42, y : 8, width : 2, height : 1},
        { x : 50, y : 12, width : 2, height : 1},
        { x : 59, y : 22, width : 5, height : 1},
        { x : 69, y : 12, width : 5, height : 1},
        { x : 89, y : 17, width : 3, height : 1},
        { x : 45, y : 30, width : 2, height : 1}
    ],
    walls : [
        { x : 57, y : 22, height : 8, type : 0},
        { x : 53, y : 25, height : 7, type : 2},
        { x : 70, y : 25, height : 12, type : 0}
    ],
    backgroundWalls: [
        { x : 0, y : 42, width : 120, height : 42 }
    ],
    columns : [
        { x : 5, y : 8, height : 8},
        { x : 15, y : 9, height : 9},
        { x : 26, y : 11, height : 11},
        { x : 35, y : 9, height : 9}
    ]
    
}
