/**
 * JSON file to store level data.
 * This file contains global vaiables that store objects data used to build
 * environment or entities in a level. Used by scenemanager.
 *
 * IMPORTANT DEVELOPER NOTES:
 * Levels are built in 1st quadrant of coordinate plane.
 * Height is drawn from up to down.
 * Width is drawn from left to right.
 * Build levels above y = 0 because below that is the death zone!
 *
 *
 * Each level variable MUST HAVE:
 *      ID: 0,1,2...    (level number and this id must be an index in scene manager's level array)
 *      Label: "1-1"    level-sublevel
 *      width, height   (converted into PARAMS.BLOCKDIM)
 *      player: {x, y}  (starting pos)
 *      music: MUSIC.TRACK_NAME (found in utils class)
 *
 * The rest will be entities or environment objects. Probably have ground below player or you will fall yo your death.
 * doors must be in the format of door: { x : 1, y : 3 , killQuota : x,  exitLocation: {x: 1, y: 1, levelNum: 1}},
 */

//version of up to date info. Make sure to update with each public push!
const SIGN_VERSION = { x: 20, y: 3, title: "    VERSION " + PARAMS.VERSION_NUM, text: ["Last updated:" + PARAMS.UPDATE_DATE]}

//spawn locations for using a door
const DOOR_SPAWNS = {
    //entrances of a level
    enter_to_level0: { x: 2, y: 1, levelNum: 0 },
    enter_to_level1: { x: 2, y: 1, levelNum: 1 },
    enter_to_level2: { x: 1, y: 1, levelNum: 2 },
    enter_to_level3: { x: 1, y: 1, levelNum: 3 },
    enter_to_level4: { x: 3, y: 5, levelNum: 4 },
    enter_to_level5: { x: 1, y: 6, levelNum: 5 },
    //enter_to_level5: { x: 83, y: 4, levelNum: 5 },//to elevator of death
    enter_to_treasure: { x: 41, y: 26, levelNum: 6 },
    enter_to_final: { x: 4, y: 1, levelNum: 7 },

    //exits of a level
    exit_to_level1: { x: 114, y: 10, levelNum: 1 },
    exit_to_level2: { x: 114, y: 1, levelNum: 2 },
    exit_to_level3: { x: 115, y: 23, levelNum: 3 },
    exit_to_level3top: { x: 34, y: 33, levelNum: 3 },
    exit_to_level4: { x: 8, y: 24, levelNum: 4 },
    exit_to_level5: { x: 0, y: 51, levelNum: 5 },
    exit_to_final: { x: 120, y: 1, levelNum: 7 },
}


/**
 * Level with doors to all levels
 */
const levelLoader = {
    ID: 0,
    label: "Level-Loader",
    width: 24, height: 14,
    player: { x: 1, y: 2 },
    music: MUSIC.TITLE,

    //quick access to all levels
    doors: [
        { x: 0.5, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level0, transition: false }, //door to level 0 (DEVELOPER ROOM)
        //{ x: 0.5, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level6, transition: false }, //door to level 0 (DEVELOPER ROOM)
        { x: 7, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level1, transition: false }, //door to level 1
        { x: 10, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level2, transition: false }, //door to level 2
        { x: 13, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level3, transition: false }, //door to level 3
        { x: 16, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level4, transition: false }, //door to level 4
        { x: 22, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level5, transition: false }, //door to level 5
        //{ x: 22, y: 4, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_treasure, transition: false }, //treasure

        //{ x: 3, y: 12, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level5, transition: false }, //door to level 5
        { x: 11, y: 12, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_final, transition: false }, //door to boss
    ],

    torches: [
        //one above each door left
        { x: 3, y: 4 },
        { x: 5, y: 4 },
        { x: 7.5, y: 6 },
        { x: 10.5, y: 6 },
        { x: 13.5, y: 6 },
        { x: 16.5, y: 6 },
        //one above each door right
        { x: 19, y: 4 },
        { x: 21, y: 4 },
        //top floor
        { x: 5.5, y: 11 },
        { x: 9.5, y: 11 },
        { x: 13.5, y: 11 },
        { x: 17.5, y: 11 },
    ],

    banners: [
        { x: 4, y: 5 },
        { x: 20, y: 5 }
    ],

    chains: [
        { x: 8.5, y: 7 },
        { x: 15.5, y: 7 },
    ],

    supports: [
        { x: 0, y: 13, width: 25 },
        { x: 0, y: 6, width: 3 },
        { x: 1, y: 8, width: 22 }
    ],

    columns: [
        { x: 2, y: 15, height: 7 },
        { x: 21, y: 15, height: 7 },
        { x: 6, y: 8, height: 10 },
        { x: 18, y: 8, height: 10 }
    ],

    windows: [
        //{ x: 0, y: 12, width: 2, height: 3 },
        //{ x: 3, y: 12, width: 2, height: 3 },
        { x: 7, y: 12, width: 2, height: 3 },
        //{ x: 11, y: 12, width: 2, height: 3 },
        { x: 15, y: 12, width: 2, height: 3 },
        //{ x: 19, y: 12, width: 2, height: 3 },
        //{ x: 22, y: 12, width: 2, height: 3 },

    ],

    npcs: [
        // x: 0, y: 7 },
    ],

    signs: [
        {
            x: 4, y: 3,
            title: "   LEVEL SELECT",
            text: ["-Stand next to the door of the level",
                " you want to enter and press W!"]
        },
        SIGN_VERSION
    ],

    backgroundWalls: [
        { x: 0, y: 14, width: 24, height: 24 }
    ],
    ground: [
        { x: 0, y: 1, width: 30, height: 1, type: 1 },
    ],
    platforms: [
        //{x: 4, y: 10.8, width: 16, height: 0.5}
        { x: 0, y: 6, width: 3, height: 1, type: 0 },
        { x: 21, y: 6, width: 3, height: 1, type: 0 },
        { x: 1, y: 9, width: 22, height: 1, type: 0 },
    ],
    walls: [
        { x: -1, y: 14, height: 14, type: 2 },
        { x: 24, y: 14, height: 14, type: 2 },
    ],

    bricks: [
        { x: 0, y: 16, width: 25, height: 2, type: 0 },
        { x: 0, y: 0, width: 25, height: 5, type: 0 }
    ],
}

/**
 * Title Screen scene
 */
const titleScene = {
    ID: 0,
    label: "Title-Screen",
    width: 24, height: 14,
    //player: { x: 1, y: 3 },
    player: { x: 11.5, y: 10 },
    music: MUSIC.TITLE,

    //quick access to all levels
    doors: [
        { x: 7, y: 4, killQuota: 0, exitLocation: { x: 1, y: 1, levelNum: 1 }, transition: false }, //door to level 1
        { x: 10, y: 4, killQuota: 0, exitLocation: { x: 3, y: 1, levelNum: 2 }, transition: false }, //door to level 2
        { x: 13, y: 4, killQuota: 0, exitLocation: { x: 4, y: 1, levelNum: 3 }, transition: false }, //door to level 3
        { x: 16, y: 4, killQuota: 0, exitLocation: { x: 3.5, y: 4, levelNum: 4 }, transition: false }, //door to level 4
    ],

    torches: [
        //one above each door left
        { x: 3, y: 4 },
        { x: 5, y: 4 },
        { x: 7.5, y: 6 },
        { x: 10.5, y: 6 },
        { x: 13.5, y: 6 },
        { x: 16.5, y: 6 },
        //one above each door right
        { x: 19, y: 4 },
        { x: 21, y: 4 },
        //top floor
        { x: 5.5, y: 11 },
        { x: 9.5, y: 11 },
        { x: 13.5, y: 11 },
        { x: 17.5, y: 11 },
    ],

    banners: [
        { x: 4, y: 5 },
        { x: 20, y: 5 }
    ],

    chains: [
        { x: 8.5, y: 7 },
        { x: 15.5, y: 7 },
    ],

    supports: [
        { x: 0, y: 13, width: 25 },
        { x: 0, y: 6, width: 3 },
        { x: 0, y: 8, width: 25 }
    ],

    columns: [
        { x: 2, y: 15, height: 7 },
        { x: 21, y: 15, height: 7 },
        { x: 6, y: 8, height: 10 },
        { x: 18, y: 8, height: 10 }
    ],

    windows: [
        { x: 0, y: 12, width: 2, height: 3 },
        { x: 3, y: 12, width: 2, height: 3 },
        { x: 7, y: 12, width: 2, height: 3 },
        { x: 11, y: 12, width: 2, height: 3 },
        { x: 15, y: 12, width: 2, height: 3 },
        { x: 19, y: 12, width: 2, height: 3 },
        { x: 22, y: 12, width: 2, height: 3 },

    ],

    npcs: [
        //{ x: 0, y: 7 }
    ],

    signs: [
        SIGN_VERSION
    ],

    backgroundWalls: [
        { x: 0, y: 14, width: 24, height: 14 }
    ],
    ground: [
        { x: 0, y: 1, width: 30, height: 1, type: 1 },
        { x: 0, y: 9, width: 25, height: 1, type: 1 }
    ],
    platforms: [
        //{x: 4, y: 10.8, width: 16, height: 0.5}
        { x: 0, y: 6, width: 3, height: 1, type: 0 },
        { x: 21, y: 6, width: 3, height: 1, type: 2 },
    ],
    chests: [
        { x: 0, y: 7, direction: 1 },
        { x: 22.5, y: 7, direction: 0 }
    ],
    walls: [
        { x: -1, y: 14, height: 14, type: 2 },
        { x: 24, y: 14, height: 14, type: 2 },
    ],

    bricks: [
        { x: 0, y: 16, width: 25, height: 2, type: 0 }
    ],

    skeletons: [
        { x: 2, y: 7, guard: true, initialState: 6 }
    ],

    shrooms: [
        { x: 4, y: 2, guard: true }
    ],

    goblins: [
        { x: 21, y: 7, guard: true }
    ],

    flyingeyes: [
        { x: 20, y: 4, guard: true }
    ],
}
