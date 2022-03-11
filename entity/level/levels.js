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
 *      ID: 0,1,2...    (level number and this id must be an index in scene manager's level array)
 *      Label: "1-1"    level-sublevel
 *      width, height   (converted into PARAMS.BLOCKDIM)
 *      player: {x, y}  (starting pos)
 *      music: MUSIC.TRACK_NAME (found in utils class)
 *
 * The rest will be entities or environment objects. Probably have ground below player or you will fall yo your death.
 * doors must be in the format of door: { x : 1, y : 3 , killQuota : x,  exitLocation: {x: 1, y: 1, levelNum: 1}},
 */

/**TEST LEVEL = Debugging/testing rom aka LEVEL 0 */
var testLevel = {
    ID: 0,
    label: "Testing Room",
    width: 24, height: 14,
    player: { x: 1, y: 1 },
    music: MUSIC.FODLAN_WINDS,

    //quick access to all levels
    doors: [

        { x: 0, y: 3, killQuota: 0, exitLocation: { x: 5, y: 2, levelNum: 1 }, transition: false }, //door to level 1
        { x: 6, y: 3, killQuota: 0, exitLocation: { x: 3, y: 1, levelNum: 2 }, transition: false }, //door to level 2
        { x: 9, y: 3, killQuota: 0, exitLocation: { x: 4, y: 1, levelNum: 3 }, transition: false }, //door to level 3

        { x: 12, y: 3, killQuota: 0, exitLocation: { x: 10, y: 4, levelNum: 4 }, transition: false }, //door to level 4
        { x: 20, y: 3, killQuota: 0, exitLocation: { x: 3.5, y: 4, levelNum: 4 }, transition: true }, //door to level 4
        { x: 24, y: 3, killQuota: 0, exitLocation: { x: 41, y: 24, levelNum: 5 }, transition: false }, //door to level 4
        //{ x: -1.9, y: 9, killQuota: 0, exitLocation: { x: 2, y: 1, levelNum: 6 }, transition: false }, //door to level 4
        { x: -1.9, y: 9, killQuota: 0, exitLocation: { x: 40, y: 1, levelNum: 6 }, transition: false }, //door to level 4

    ],

    npcs: [
        { x: 3, y: 5, text: "what da dog doin?" }
    ],

    signs: [
        {
            x: 3, y: 2,
            title: "  DEV-MODE-OPTIONS",
            text: ["console.log(\'here\'):",
                "-This room is for developers to test mechanics",
                "-If you are not a developer then... 🔫😬",
                "-Press [CTRL] in this room to instantly get",
                " MAX DIAMONDS. This is to test the shop.",
            ]

        },

        {
            x: 18, y: 2,
            title: "IMPORTANT DISCLOSURE",
            text: ["According to all known laws of aviation",
                "there is no way a bee should be able to fly.",
                "Its wings are too small to get",
                "its fat little body off the ground.",
                "The bee, of course, flies anyway",
                "because bees don't care",
                "what humans think is impossible."
            ]
        }
    ],

    backgroundWalls: [
        { x: 0, y: 14, width: 24, height: 14 }
    ],
    ground: [
        { x: 0, y: 0, width: 30, height: 1, type: 1 },
        { x: 3, y: 5, width: 3, height: 1, type: 1 },
        { x: 10, y: 6, width: 5, height: 1, type: 1 }
    ],
    trap: [
        { x: 6, y: 6, width: 4, height: 1, type: 1, percent: 0.2, rate: 200 }
    ],
    chests: [
        //{ x: 3, y: 1, direction : 1},
        { x: 13, y: 7, direction: 0 }
    ],
    bricks: [
        { x: 10, y: 7, width: 1, height: 1 },
    ],
    walls: [
        { x: -1, y: 14, height: 14, type: 2 },
        { x: 15, y: 14, height: 13, type: 2 },
        { x: 25, y: 14, height: 14, type: 2 }
    ],
    obelisks: [
        { x: 4.5, y: 1, brickX: 15, brickY: 1, brickWidth: 1, brickHeight: 1, initial: true, repeat: true },
        { x: 4.5, y: 1, brickX: 10, brickY: 12, brickWidth: 1, brickHeight: 5, initial: false, repeat: true }
    ],
    shrooms: [
        { x: 16, y: 1, guard: true }
    ],
    goblins: [
        { x: 17, y: 1, guard: false }
    ],
    skeletons: [
        { x: 12, y: 7, guard: true },
        { x: 13, y: 7, guard: true }
    ],
    flyingeyes: [
        { x: 17, y: 5, guard: false },
        { x: 15, y: 7, guard: true }
    ],
    moveable: [
        { x: 10, y: 8, width: 3, height: 1 },
    ],
}

/**
 * Level with doors to all levels
 */
var levelLoader = {
    ID: 0,
    label: "Level-Loader",
    width: 24, height: 14,
    player: { x: 1, y: 2 },
    music: MUSIC.TITLE,

    //quick access to all levels
    doors: [
        { x: 0.5, y: 4, killQuota: 0, exitLocation: { x: 3, y: 1, levelNum: 0 }, transition: false }, //door to level 0 (DEVELOPER ROOM)
        { x: 7, y: 4, killQuota: 0, exitLocation: { x: 2, y: 1, levelNum: 1 }, transition: false }, //door to level 1
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
        { x: 8, y: 7 },
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
        // x: 0, y: 7 },
    ],

    signs: [
        {
            x: 4, y: 3,
            title: "   LEVEL SELECT",
            text: ["-Stand next to the door of the level",
                " you want to enter and press W!"]
        },
    ],

    backgroundWalls: [
        { x: 0, y: 14, width: 24, height: 24 }
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
var titleScene = {
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
        { x: 8, y: 7 },
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
        { x: 22, y: 3, title: "VERSION 1.0 (BETA)", text: "" }
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
        { x: 20, y: 3, guard: true }
    ],

}



/**
 * Levels below
 */
var level1_1 = {
    ID: 1,
    label: "1",
    width: 120, height: 15,
    player: { x: 2, y: 1 },
    music: MUSIC.FODLAN_WINDS,
    doors: [
        { x: 116, y: 12, killQuota: 3, exitLocation: { x: 3, y: 1, levelNum: 2 }, transition: false }, //door to level 2
        //{ x: 2, y: 3, killQuota: 0, exitLocation: { x: 1, y: 1, levelNum: 0 }, transition : false } //debugging room, DELETE THIS BEFORE SUBMISSION!
    ],

    npcs: [
        {
            x: 5, y: 1, text: ["Great Hero, I have brought you here from another world.",
                "Right now, this castle is under seige by monsters!",
                "I need your help. Please save the castle!"]
        },
        {
            x: 55, y: 5, text: ["Your journey will be arduous...",
                "If you bring me the DIAMONDS that you find",
                "and I can grant you more power."]
        },
    ],

    signs: [
        {
            x: 16, y: 3,
            title: "[TUTORIAL: BASIC COMBAT/MOVEMENT]",
            text: [
                "KEYBOARD CONTROLS:",
                "-[A] to move left, [D] to move right",
                "-[SPACE] to jump and press again to double jump",
                "-[P] to swing your sword. Double tap to attack twice.",
                "     The second hit is slower, but deals more damage.",
                "-[O] to shoot an arrow forward in your direction",
                "     if you have any in your inventory.",
                "     *Hold [W] to shoot diagonally up or [S] down.",
                "-[SHIFT] to roll and dodge attacks.",
                " *Recommend to disable sticky keys!",
                "-[ESC] to pause/unpause the game",
                "",
                "KEYBOARD + MOUSE CONTROLS:",
                "*NOTE: Keep mouse cursor within game screen!",
                "-[LEFT-CLICK]: Melee attack",
                "-[MOUSE-MOVE]: Aim an arrow with cursor in game screen",
                "-[RIGHT-CLICK]: Shoot arrow in cursor direction",
            ]
        },
        {
            x: 36, y: 6,
            title: "[TUTORIAL: CROUCHING]",
            text: [
                "CROUCHING OPTIONS:",
                "-Hold [S] to crouch.",
                "-While crouching you can move left or right.",
                "-You are still able to attack while crouching!",
                "-Use crouches to get through small spaces or attack quickly.",
                "-You can still roll or shoot an arrow while crouching."
            ]
        },

        {
            x: 49, y: 6,
            title: "[TUTORIAL: HEALING/SHOP]",
            text: [
                "HOW TO HEAL:",
                "-[E] to use a potion in your inventory.",
                "-Potions will heal you for a set 50 HP",
                "-Potions are limited so use them sparingly.",
                "",
                "HOW TO SHOP:",
                "-Stand next to the shopkeeper and tap [W] to shop",
                "-The friendly shopkeeper will be your supporter on",
                " this journey. Give him DIAMONDS to upgrade your tools.",
                "-Use your mouse cursor to click the buttons in the shop."]
        },

        {
            x: 69, y: 6,
            title: "[TUTORIAL: CHESTS]",
            text: [
                "OPENING CHESTS:",
                "-Press W to open a chest!",
                "-Chests are hidden throughout the map",
                " and sometimes where you least expect it...",
                "-Chests provide the most amount of diamonds",
                " in the whole game!",
                "-Make sure to explore each level for chests ",
                " so you can afford upgrades from the shop!"
            ]
        },


        {
            x: 92, y: 2,
            title: "[TUTORIAL: WALLJUMP]",
            text: [
                "HOW TO SCALE WALLS:",
                "-While falling next to a wall you will wallslide",
                "-While wallsliding or next to a wall",
                " tap [SPACE] to walljump in the other direction.",
                " Chain together walljumps to scale vertical heights!",
                "-If hanging on a ledge press [W] to get up",
                " or [S] to slide down",
            ]
        },

        {
            x: 102, y: 2,
            title: "    Secrets!!!",
            text: [
                "-You may find secrets in unexpected places!",
                "-Secret room blocks will slightly blink.",
                "-There is a secret room on every floor!",
                "-So keep a look out!"
            ]
        },

        {
            x: 110, y: 11,
            title: "[TUTORIAL: DOORS]",
            text: [
                "PROGRESSING IN LEVEL:",
                "-In general use W to interact with game objects.",
                "-To progress to the next level press [W] next to door.",
                "-A KILL QUOTA must be met to progress to next level!"

            ]
        },
    ],

    chests: [
        { x: 76, y: 7, direction: 0 },
        { x: 112, y: 10, direction: 0 },

        //secret room
        { x: 102, y: 5, direction: 0 },
        { x: 100, y: 1, direction: 0 },
        { x: 104, y: 1, direction: 1 },
    ],
    ground: [
        { x: 0, y: 0, width: 15, height: 1, type: 1 },
        { x: 60, y: 0, width: 47, height: 1, type: 1 },
        { x: 15, y: 1, width: 1, height: 1, type: 0 },
        { x: 16, y: 1, width: 1, height: 1, type: 1 },
        { x: 17, y: 1, width: 1, height: 1, type: 2 },
        { x: 20, y: 2, width: 1, height: 1, type: 0 },
        { x: 21, y: 2, width: 3, height: 1, type: 1 },
        { x: 24, y: 2, width: 1, height: 1, type: 2 },
        { x: 25, y: 1, width: 3, height: 1, type: 1 },
        { x: 28, y: 2, width: 1, height: 1, type: 0 },
        { x: 29, y: 2, width: 1, height: 1, type: 1 },
        { x: 30, y: 4, width: 1, height: 1, type: 0 },
        { x: 31, y: 4, width: 28, height: 1, type: 1 },
        { x: 59, y: 4, width: 1, height: 1, type: 2 },
        { x: 94, y: 9, width: 1, height: 1, type: 0 },
        { x: 95, y: 9, width: 25, height: 1, type: 1 }
    ],

    platforms: [
        { x: 68, y: 4, width: 3, height: 1 },
        { x: 75, y: 6, width: 3, height: 1 },
        { x: 101, y: 4, width: 3, height: 1, direction: 0 },
    ],

    bricks: [
        { x: 30, y: 15, width: 90, height: 3 },
        { x: 30, y: 12, width: 60, height: 2 },
        { x: 30, y: 10, width: 30, height: 1 },
        { x: 75, y: 10, width: 15, height: 1 },
        { x: 30, y: 9, width: 25, height: 1 },
        { x: 80, y: 9, width: 10, height: 1 },
        { x: 32, y: 8, width: 18, height: 1 },
        { x: 85, y: 8, width: 5, height: 5 },
        { x: 95, y: 8, width: 4, height: 1 },
        { x: 95, y: 7, width: 2, height: 1 },
        { x: 95, y: 6, width: 1, height: 1 },
        { x: 103, y: 8, width: 4, height: 1 },
        { x: 105, y: 7, width: 2, height: 1 },
        { x: 106, y: 6, width: 1, height: 1 },
        { x: 107, y: 8, width: 13, height: 8 },
        { x: 32, y: 7, width: 13, height: 1 },
        { x: 40, y: 6, width: 5, height: 1 },
        { x: 31, y: 3, width: 28, height: 1 },
        { x: 30, y: 2, width: 29, height: 1 },
        { x: 21, y: 1, width: 4, height: 1 },
        { x: 28, y: 1, width: 31, height: 1 },
        { x: 15, y: 0, width: 3, height: 1 },
        { x: 20, y: 0, width: 40, height: 1 },
        { x: 107, y: 0, width: 13, height: 1 }
    ],
    walls: [
        { x: -1, y: 15, height: 16, type: 0 },
        { x: 90, y: 12, height: 8, type: 2 },
        { x: 90, y: 4, height: 1, type: 3 },
        { x: 94, y: 8, height: 7, type: 0 },
        { x: 30, y: 3, height: 1, type: 0 },
        { x: 59, y: 3, height: 3, type: 2 },
        { x: 20, y: 1, height: 1, type: 0 },
        { x: 120, y: 15, height: 16, type: 0 }
    ],
    secrets: [
        {
            indicate: true,
            bricks: [
                { x: 94, y: 1, width: 1, height: 1 },
                { x: 99, y: 8, width: 4, height: 1 },
                { x: 97, y: 7, width: 8, height: 1 },
                { x: 96, y: 6, width: 10, height: 1 },
                { x: 95, y: 5, width: 12, height: 5 }
            ]
        }
    ],
    backgroundWalls: [
        { x: 30, y: 12, width: 90, height: 12 }
    ],
    torches: [
        { x: 31, y: 7 },
        { x: 59, y: 7 },
        { x: 68, y: 6 },
        { x: 70, y: 6 },
        { x: 85, y: 3 },
        { x: 94, y: 12 },
        { x: 115, y: 12 }
    ],
    shrooms: [
        { x: 62, y: 1, guard: false },
        { x: 72, y: 5, guard: false }
    ],
    goblins: [
        { x: 76, y: 8, guard: true },
        { x: 105, y: 12, guard: true },
    ],
    skeletons: [
        { x: 47, y: 7, guard: true }
    ],

    slimes: [
        { x: 97, y: 2, guard: false },
        { x: 104, y: 2, guard: false },

    ]
}

var level1_2 = {
    ID: 2,
    label: "2",
    width: 120, height: 36,
    player: { x: 1, y: 1 },
    music: MUSIC.CHASING_DAYBREAK,
    doors: [
        { x: 116, y: 3, killQuota: 7, exitLocation: { x: 4, y: 3, levelNum: 3 }, transition: false }, //next level to 3
        { x: 0, y: 3, killQuota: 0, exitLocation: { x: 114, y: 10, levelNum: 1 }, transition: false } //go back to level 1
    ],

    signs: [{
        x: 4, y: 2,
        title: "[TUTORIAL: MORE COMBAT TIPS]",
        text: [
            "ADVANCED COMBAT TIPS:",
            "-Cancel an attack animation with a roll.",
            " This lets you do damage while staying evasive.",
            "-Each hit has a base 10% chance to CRIT and do x2 damage!",
            "-If you shoot an arrow and it got stuck then you can retrieve it.",
            "-After an enemy spots you they will chase you down for a",
            " certain amount of time.",
        ],
    },
    {
        x: 4, y: 26,
        title: "[GET 1,000,0000 DIAMONDS WITH THIS ONE SIMPLE TRICK!]",
        text: [
            "Never gonna give you up",
            "Never gonna let you down",
            "Never gonna run around and desert you",
            "Never gonna make you cry",
            "Never gonna say goodbye",
            "Never gonna tell a lie and hurt you"
        ],
    },
    {
        x: 64, y: 2,
        title: "[TUTORIAL: RAGE BOOST]",
        text: [
            "When in a pinch:",
            "-At low-hp you will tap into a secret power",
            " called BESERKER MODE! Indicated by a red aura.",
            "-This is a powerful state that deals extra damage",
            " and shoots a blade beam projectile with each swing!",
            "-However it only lasts for a short time and you can",
            " easily die in one hit!"
        ]
    },

    ],

    chests: [
        { x: 2, y: 25, direction: 1 },
        //{ x: 50, y: 7, direction: 0 },
        { x: 82, y: 19, direction: 0 },
        { x: 58, y: 1, direction: 1 }, //secret
        { x: 58, y: 4, direction: 1 },
        { x: 52, y: 1, direction: 1 },
        { x: 117, y: 8, direction: 0 },
        { x: 118.5, y: 8, direction: 1 },
    ],

    npcs: [
        { x: 7, y: 1 , text: ["I would read this sign if I knew how to read."]},
        { x: 38, y: 21, text: ["Welcome to WizardMart.",
                               "May I take your order?"] }
    ],

    ground: [
        { x: 0, y: 0, width: 45, height: 1, type: 1 },
        { x: 58, y: 3, width: 1, height: 1, type: 1 }, //secret chest
        { x: 61, y: 0, width: 60, height: 1, type: 1 },
        { x: 45, y: 6, width: 1, height: 1, type: 0 },
        { x: 46, y: 6, width: 13, height: 1, type: 1 },
        { x: 1, y: 6, width: 41, height: 1, type: 1 },
        { x: 5, y: 19, width: 35, height: 1, type: 1 },
        { x: 4, y: 19, width: 1, height: 1, type: 0 },
        { x: 65, y: 18, width: 5, height: 1, type: 1 },
        { x: 80, y: 18, width: 4, height: 1, type: 1 },

    ],

    secrets: [
        {
            indicate: true,
            bricks: [
                { x: 58, y: 5, width: 2, height: 5 }, //blocks covering chests
                { x: 52, y: 1, width: 6, height: 1 }, //secret 2
                //{ x: 59, y: 6, width: 1, height: 1 }, //entrance to fall into secret room
                //{ x: 60, y: 4, width: 1, height: 1 }, //shortcut to right room
            ],
            ground: [
                { x: 59, y: 6, width: 1, height: 1, type: 0 }, //entrance to fall into secret room
            ],
        },
        {
            indicate: true,
            walls: [
                { x: 60, y: 4, width: 1, height: 1, type: 2 },
            ]
        }
    ],

    bricks: [
        { x: 45, y: 0, width: 16, height: 1 },
        { x: 46, y: 5, width: 12, height: 4 }, //secret
        { x: 46, y: 1, width: 6, height: 1 }, //secret 2
        { x: 0, y: 5, width: 41, height: 2 },
        { x: 5, y: 18, width: 55, height: 7 },
        { x: 57, y: 11, width: 3, height: 1 },
        { x: 58, y: 10, width: 2, height: 1 },
        { x: 59, y: 9, width: 1, height: 1 },
        { x: 5, y: 11, width: 5, height: 1 },
        { x: 5, y: 10, width: 3, height: 1 },
        { x: 5, y: 9, width: 1, height: 1 },
        { x: 0, y: 24, width: 30, height: 2 },
        { x: 30, y: 20, width: 2, height: 1 },
        { x: 0, y: 36, width: 65, height: 8 },
        { x: 10, y: 28, width: 15, height: 2 },
        { x: 25, y: 28, width: 1, height: 1 },
        { x: 10, y: 26, width: 5, height: 1 },
        { x: 35, y: 24, width: 25, height: 2 },
        { x: 41, y: 22, width: 19, height: 4 },
        { x: 65, y: 36, width: 55, height: 14 },
        { x: 65, y: 17, width: 5, height: 8 },
        { x: 70, y: 15, width: 10, height: 6 },
        { x: 80, y: 17, width: 40, height: 8 },
        { x: 85, y: 22, width: 35, height: 5 },
        { x: 9, y: 28, width: 1, height: 1 }
    ],

    platforms: [
        { x: 75, y: 5, width: 2, height: 1 },
        { x: 85, y: 6, width: 2, height: 1 },
        { x: 91, y: 6, width: 2, height: 1 },
        { x: 101, y: 6, width: 3, height: 1 },
        { x: 112, y: 6, width: 2, height: 1 },
        { x: 116, y: 7, width: 4, height: 1 },
    ],

    spikes: [{ x: 70, y: 16, width: 10 }],
    walls: [
        { x: 41, y: 5, height: 2, type: 2 },
        { x: 40, y: 22, height: 4, type: 0 },
        { x: 64, y: 28, height: 6, type: 0 },
        { x: 64, y: 19, height: 15, type: 0 },
        { x: 60, y: 24, height: 20, type: 2 }, //wall dividing left and right room
        { x: 60, y: 3, height: 3, type: 2 }, //wall dividing left and right room
        { x: 45, y: 5, height: 5, type: 0 },
        { x: 0, y: 24, height: 19, type: 2 },
        { x: 4, y: 18, height: 10, type: 0 },
        { x: 0, y: 28, height: 4, type: 2 },
        { x: 30, y: 24, height: 2, type: 2 },
        { x: 34, y: 24, height: 3, type: 0 },
        { x: 84, y: 22, height: 5, type: 0 },
        { x: 120, y: 36, height: 37, type: 0 }
    ],
    backgroundWalls: [
        { x: 0, y: 36, width: 120, height: 36 }
    ],
    shrooms: [
        { x: 15, y: 20, guard: false },
        { x: 12, y: 1, guard: false },
        { x: 40, y: 25, guard: false },
        { x: 47, y: 25, guard: false },
        { x: 102, y: 1, guard: false }
    ],
    goblins: [
        { x: 10, y: 7, guard: false },
        { x: 8, y: 7, guard: false },
        { x: 17, y: 20, guard: true },
        { x: 72, y: 1, guard: false },
        { x: 105, y: 1, guard: true }
    ],
    skeletons: [
        { x: 3, y: 26, guard: true },
        { x: 55, y: 9, guard: true },
        { x: 70, y: 3, guard: true },
        { x: 75, y: 3, guard: true },
        { x: 81, y: 22, guard: true },
        { x: 100, y: 3, guard: true },
    ],
    flyingeyes: [
        { x: 75, y: 21, guard: true },
    ],
    slimes: [
        //secret slimes
        { x: 52, y: 1, guard: true },
        { x: 53, y: 1, guard: true },
        { x: 53, y: 1, guard: true },

        { x: 28, y: 27, guard: true },
        { x: 102, y: 9, guard: true },
        { x: 91, y: 9, guard: true },

    ],
    windows: [
        { x: 2, y: 9, width: 1, height: 1.5 },
        { x: 2, y: 12, width: 1, height: 1.5 },
        { x: 2, y: 15, width: 1, height: 1.5 },
        { x: 2, y: 18, width: 1, height: 1.5 },
        { x: 67, y: 8, width: 4, height: 7 },
        { x: 77, y: 8, width: 4, height: 7 },
        { x: 87, y: 8, width: 4, height: 7 },
        { x: 97, y: 8, width: 4, height: 7 },
        { x: 107, y: 8, width: 4, height: 7 },
        { x: 17, y: 10, width: 2, height: 3 },
        { x: 27, y: 10, width: 2, height: 3 },
        { x: 37, y: 10, width: 2, height: 3 },
        { x: 47, y: 10, width: 2, height: 3 },
        { x: 39, y: 28, width: 2, height: 3 },
        { x: 46, y: 28, width: 2, height: 3 }
    ],
    banners: [
        { x: 71, y: 4 },
        { x: 76, y: 4 },
        { x: 81, y: 4 },
        { x: 86, y: 4 },
        { x: 91, y: 4 },
        { x: 96, y: 4 },
        { x: 101, y: 4 },
        { x: 106, y: 4 },
        { x: 2, y: 3 },
        { x: 19, y: 3 }
    ],
    torches: [
        { x: 10, y: 3 },
        { x: 8, y: 9 },
        { x: 20, y: 3 },
        { x: 30, y: 3 },
        { x: 40, y: 3 },
        { x: 35, y: 6 },
        { x: 25, y: 6 },
        { x: 15, y: 6 },
        { x: 25, y: 26 },
        { x: 35, y: 22 },
        { x: 83, y: 22 },
        { x: 77, y: 21 },
        { x: 71, y: 22 },
        { x: 1, y: 27 },
        { x: 7, y: 21 },
        { x: 17, y: 22 },
        { x: 115, y: 2 },
        { x: 118, y: 2 },

    ],
    chains: [
        { x: 16, y: 9 },
        { x: 18.5, y: 9 },
        { x: 26, y: 9 },
        { x: 28.5, y: 9 },
        { x: 36, y: 9 },
        { x: 38.5, y: 9 },
        { x: 46, y: 9 },
        { x: 48.5, y: 9 },
        { x: 38, y: 27 },
        { x: 47.5, y: 27 }
    ],
    ceilingChains: [
        { x: 4, y: 3, height: 1.5 },
        { x: 4.5, y: 3, height: 2 },
        { x: 11, y: 3, height: 1.2 },
        { x: 11.5, y: 3, height: 2.2 },
        { x: 12, y: 3, height: 1.5 },
        { x: 15, y: 3, height: 2 },
        { x: 21, y: 3, height: 1.5 },
        { x: 27, y: 3, height: 1.5 },
        { x: 27.5, y: 4, height: 2 },
        { x: 37, y: 3, height: 1.5 },
        { x: 37.5, y: 3, height: 2 },
        { x: 38, y: 4, height: 2 },
        { x: 58, y: 9, height: 2 },
        { x: 6, y: 9, height: 1.5 },
        { x: 6.5, y: 10, height: 2 },
        { x: 1, y: 22, height: 1.5 },
        { x: 1.3, y: 22, height: 2 },
        { x: 1.6, y: 23, height: 2 },
        { x: 3, y: 22, height: 1.5 },
        { x: 3.3, y: 22, height: 2 },
        { x: 3.6, y: 23, height: 2 },
        { x: 12, y: 22, height: 2 },
        { x: 12.3, y: 22, height: 1.5 },
        { x: 12.6, y: 23, height: 2 },
        { x: 20, y: 22, height: 2 },
        { x: 22, y: 22, height: 2 },
        { x: 22.3, y: 22, height: 1.5 },
        { x: 22.6, y: 23, height: 2 },
        { x: 24, y: 22, height: 2 },
        { x: 67, y: 22, height: 2 },
        { x: 67.3, y: 22, height: 1.5 },
        { x: 67.6, y: 23, height: 2 },
        { x: 78, y: 22, height: 1.5 },
        { x: 78.3, y: 22, height: 2 },
        { x: 78.6, y: 23, height: 2 }
    ],
    columns: [
        { x: 74, y: 11, height: 11 },
        { x: 84, y: 11, height: 11 },
        { x: 94, y: 11, height: 11 },
        { x: 104, y: 11, height: 11 },
        { x: 53, y: 11, height: 5 },
        { x: 34, y: 11, height: 5 },
        { x: 24, y: 11, height: 5 },
        { x: 14, y: 11, height: 5 }
    ],
    supports: [
        { x: 64, y: 11, width: 56 },
        { x: 10, y: 11, width: 47 }
    ]
}

var level1_3 = {
    ID: 3,
    label: "3",
    width: 120, height: 42,
    player: { x: 1, y: 1 },
    music: MUSIC.BETWEEN_HEAVEN_AND_EARTH,
    signs: [
        {
            x: 4, y: 2,
            title: "[TUTORIAL: OBELISK]",
            text: [
                "OBELISK DEVICE:",
                "-These strange devices can unlock inaccessible/secret areas!",
                "-To activate: hit them with your SWORD or ARROW!",
                " ...or you could press \'W'\ next to it, but that's boring.",
                "-Some obelisk puzzles can only be solved by hitting them",
                " from afar with your bow and arrow!"
            ]
        },
        {
            x: 34, y: 4,
            title: "[TUTORIAL: ADVANCED JUMPS]",
            text: [
                "PLATFORMING TIPS:",
                "-Delay your second jump to cover more distance.",
                "-If you are running and THEN jump your momentum",
                " will be carried over and you will go farther.",
                "-Wait until you're at the peak of your first jump",
                " before doing your double jump to go higher.",
                "-While in air, hold the opposite direction and double ",
                " jump to quickly switch directions.",
            ]
        },
        {
            x: 37, y: 34,
            title: "[????????????????????]",
            text: [
                ">-(•_•)-<",
                "   ( )",
                "   o o.",
                "  wooper",
            ]
        },

        {
            x: 12, y: 37,
            title: "[You are a very curious player!]",
            text: [
                "Hope you are enjoying the game!",
                "Take these chests as your reward!",
                "-Ken was here :)",
            ]
        },

    ],
    npcs: [
        { x: 10, y: 16, text: "Just uh dropping by..." },
        { x: 51, y: 10, text: ["A little birdie told me that",
                               "that this floor holds treasures",
                               "beyond your wildest imagination..."] },
        { x: 39, y: 35, text: "I can practically taste the treasure in here."},

    ],

    secrets: [
        {
            indicate: true,
            bricks: [
                { x: 6, y: 40, width: 10, height: 5 }, //hide treasure room
                { x: 16, y: 37, width: 1, height: 2 }, //hide treasure room
            ]
        }
    ],

    doors: [
        { x: 1, y: 3, killQuota: 0, exitLocation: { x: 114, y: 1, levelNum: 2 }, transition: false }, //go back to level 2
        { x: 117, y: 25, killQuota: 8, exitLocation: { x: 3.5, y: 4, levelNum: 4 }, transition: false }, // change to level 4 once theres a level 4
        { x: 34, y: 35, killQuota: 0, exitLocation: { x: 41, y: 26, levelNum: 5 }, transition: false } // change to treasure room
    ],
    ground: [
        { x: 0, y: 0, width: 10, type: 1 },
        { x: 16, y: 10, width: 3, type: 1 },
        //obelisk to right room
        { x: 68, y: 21, width: 2, type: 1 }, //chest on top
        { x: 70, y: 25, width: 14, type: 1 },
        { x: 99, y: 22, width: 21, type: 1 },

    ],
    obelisks: [
        { x: 7, y: 1, brickX: 10, brickY: 12, brickWidth: 3, brickHeight: 10 },
        { x: 79, y: 15, brickX: 81, brickY: 17, brickWidth: 3, brickHeight: 3 },
        { x: 100, y: 23, brickX: 105, brickY: 30, brickWidth: 11, brickHeight: 8 },
        { x: 17, y: 11, brickX: 19, brickY: 15, brickWidth: 6, brickHeight: 3 },
        { x: 67, y: 36.5, brickX: 42, brickY: 37, brickWidth: 1, brickHeight: 5 },
        { x: 68, y: 22.5, brickX: 70, brickY: 30, brickWidth: 2, brickHeight: 18 },
    ],
    shrooms: [
        { x: 107, y: 32, guard: false },
        { x: 36, y: 35, guard: false },
        { x: 61, y: 9, guard: false }
    ],
    goblins: [
        { x: 110, y: 32, guard: true },
        { x: 76, y: 28, guard: true },
    ],
    skeletons: [
        { x: 112, y: 32, guard: true },
        { x: 73, y: 27, guard: true },
        { x: 77, y: 27, guard: true },
    ],
    flyingeyes: [
        { x: 45.5, y: 32, guard: true },
        { x: 20, y: 5, guard: true },
        { x: 51, y: 6, guard: true },
        { x: 55, y: 6, guard: true },
        { x: 88, y: 19, guard: true },
        { x: 90, y: 19, guard: true },
        { x: 92, y: 19, guard: true },
    ],

    slimes: [
        { x: 65, y: 38, guard: true },
        { x: 6, y: 37, guard: true }, //secret slime
        { x: 7, y: 37, guard: true }, //secret slime
    ],

    chests: [
        //secret
        { x: 6, y: 36, direction: 1 },
        { x: 7.5, y: 36, direction: 1 },
        { x: 9, y: 36, direction: 1 },
        { x: 10.5, y: 36, direction: 1 },

        { x: 75, y: 13, direction: 0 },
        { x: 77, y: 15, direction: 0 },
        { x: 54, y: 5, directon: 0 },
        { x: 29, y: 28, directon: 0 },
        { x: 22, y: 35, direction: 0 },
        { x: 22, y: 39, direction: 0 },

        { x: 65, y: 36, direction: 0 }, //chest on top
    ],
    torches: [
        { x: 4, y: 3 },
        { x: 6, y: 37 },
        { x: 12, y: 37 },
        { x: 18, y: 14 },
        { x: 23, y: 5 },
        { x: 34, y: 5 },
        { x: 41, y: 10 },
        { x: 53, y: 7 },
        { x: 68, y: 25 },
        { x: 52.5, y: 27 }, //subtle hint to go left to find the treasure room                                                                                                        :c
        { x: 49, y: 30 },
        { x: 49, y: 14 },

        { x: 116, y: 24 },
        { x: 119, y: 24 },
    ],
    bricks: [
        { x: 20, y: 34, width: 4, height: 1 },
        { x: 120, y: 42, width: 1, height: 43 },
        { x: 105, y: 42, width: 1, height: 12 },
        { x: 115, y: 42, width: 1, height: 12 },
        { x: 10, y: 2, width: 3, height: 3 },
        { x: 13, y: 0, width: 20, height: 1 },
        { x: 33, y: 2, width: 3, height: 3 },
        { x: 36, y: 0, width: 48, height: 1 },
        { x: 17, y: 42, width: 6, height: 2 },
        { x: 77, y: 14, width: 7, height: 14 },
        { x: 71, y: 24, width: 13, height: 7 },
        { x: 71, y: 17, width: 2, height: 1 },
        { x: 71, y: 16, width: 1, height: 1 },
        { x: 84, y: 12, width: 15, height: 13 },
        { x: 99, y: 21, width: 21, height: 22 },
        { x: 30, y: 32, width: 13, height: 2 },
        { x: 28, y: 42, width: 2, height: 12 },
        { x: 30, y: 42, width: 13, height: 5 },
        { x: 27, y: 42, width: 1, height: 33 },
        { x: 26, y: 42, width: 1, height: 31 },
        { x: 24, y: 42, width: 1, height: 15 },
        { x: 23, y: 42, width: 1, height: 7 },
        { x: 25, y: 42, width: 1, height: 33 },
        { x: 30, y: 30, width: 10, height: 1 },
        { x: 32, y: 29, width: 7, height: 1 },
        { x: 33, y: 28, width: 4, height: 1 },
        { x: 30, y: 33, width: 2, height: 1 },
        { x: 30, y: 37, width: 10, height: 1 },
        { x: 30, y: 36, width: 1, height: 1 },
        { x: 35, y: 27, width: 1, height: 18 },
        { x: 34, y: 27, width: 1, height: 16 },
        { x: 36, y: 27, width: 1, height: 17 },
        { x: 4, y: 42, width: 1, height: 33 },
        { x: 5, y: 42, width: 1, height: 34 },

        //{ x: 15, y: 42, width: 1, height: 33 },
        //{ x: 16, y: 42, width: 1, height: 31 },
        { x: 0, y: 42, width: 120, height: 3 },
        { x: 15, y: 35, width: 1, height: 26 },
        { x: 16, y: 35, width: 1, height: 24 },
        { x: 6, y: 35, width: 9, height: 1 },

        { x: 91, y: 42, width: 1, height: 18 },
        { x: 90, y: 42, width: 1, height: 16 },
        { x: 89, y: 32, width: 1, height: 2 },
        { x: 89, y: 42, width: 1, height: 10 },
        { x: 69, y: 42, width: 20, height: 12 },
        { x: 85, y: 30, width: 5, height: 1 },
        { x: 87, y: 29, width: 3, height: 1 },
        { x: 89, y: 28, width: 1, height: 1 },
        { x: 84, y: 22, width: 1, height: 1 },
    ],
    platforms: [
        { x: 22, y: 2, width: 2, height: 1 },
        { x: 23, y: 7, width: 1, height: 1 },
        //middle parkour left
        { x: 17, y: 16, width: 4, height: 1 },
        { x: 23, y: 20, width: 2, height: 1 },
        { x: 17, y: 31, width: 1, height: 1 },
        { x: 23, y: 31, width: 1, height: 1 },
        { x: 22, y: 38, width: 1, height: 1 },

        //middle parkour right
        { x: 29, y: 7, width: 2, height: 1 },
        { x: 28, y: 12, width: 1, height: 1 },
        { x: 33, y: 18, width: 1, height: 1 },
        { x: 31, y: 23, width: 1, height: 1 },
        { x: 28, y: 27, width: 3, height: 1 },
        //obelisk to treasure room

        { x: 50, y: 34, width: 3, height: 1 },
        { x: 57, y: 35, width: 3, height: 1 },
        { x: 64, y: 35, width: 5, height: 1 }, //chest on top

        { x: 40, y: 7, width: 2, height: 1 },
        { x: 49, y: 12, width: 2, height: 1 },
        { x: 59, y: 22, width: 5, height: 1 },
        { x: 69, y: 12, width: 8, height: 1 },
        { x: 89, y: 17, width: 3, height: 1 },
        { x: 95, y: 21, width: 1, height: 1 },
        { x: 45, y: 30, width: 2, height: 1 },
        { x: 51, y: 4, width: 5, height: 1 },
        { x: 60, y: 8, width: 3, height: 1 }
    ],
    walls: [
        { x: 16, y: 40, height: 3, type: 0 }, //secret room cover
        { x: 57, y: 22, height: 8, type: 0 },
        { x: 53, y: 25, height: 8, type: 2 },
        { x: 70, y: 24, height: 11, type: 0 },
        { x: 19, y: 11, height: 2, type: 2 },
        { x: 22, y: 26, height: 4, type: 2 },
        { x: 20, y: 40, height: 5, type: 2 },
    ],
    backgroundWalls: [
        { x: 0, y: 42, width: 120, height: 42 }
    ],
    columns: [
        { x: 5, y: 8, height: 8 },
        { x: 15, y: 9, height: 9 },
        { x: 26, y: 11, height: 11 },
        { x: 35, y: 9, height: 9 }
    ],
    spikes: [
        { x: 13, y: 1, width: 20 },
        { x: 36, y: 1, width: 41 },
        { x: 84, y: 13, width: 15 }
    ]
}

var level1_4 = {
    ID: 4,
    label: "4",
    width: 75, height: 50,
    player: { x: 3, y: 5 }, //regular spawn
    //player: { x: 65, y: 45 }, //top right spawn
    //player: { x: 10, y: 43 },//boss room spawn
    music: MUSIC.LONG_WAY,
    signs: [
        {
            x: 69, y: 23,
            title: "[TUTORIAL: LONG WALL-JUMP]",
            text: [
                "ADVANCED WALLJUMP:",
                "-Right after a wall jump hold the direction",
                " you are jumping towards to go farther!",
                "-This will allow you to scale wide gaps!"
            ]
        },
    ],
    doors: [
        { x: 3, y: 6, killQuota: 0, exitLocation: { x: 115, y: 23, levelNum: 3 }, transition: false }, //starting door
        { x: 6, y: 26, killQuota: 8, exitLocation: { x: 4, y: 1, levelNum: 6 }, transition: false }, //exit door
    ],
    npcs: [
        { x: 5, y: 4, text: ["This castle could use some remodeling",
                            "...and stairs."]},
        { x: 67, y: 35, text: ["I sense danger ahead..."]},
    ],
    chests: [
        { x: 29, y: 1, direction: 0 },    //bottom floor
        { x: 37, y: 12, direction: 1 },   //secret room
        { x: 38.5, y: 12, direction: 1 }, //secret room
        { x: 40, y: 12, direction: 1 }, //secret room
        { x: 52, y: 12, direction: 1 },   //middle floor
        { x: 65, y: 12, direction: 0 },   //middle floor
        { x: 52, y: 42, direction: 1 },   //top floor right
        { x: 65, y: 34, direction: 1 },   //top floor right near right obelisk
        { x: 1, y: 27, direction: 1 }, //exit door plat (chest on top)
        { x: 24, y: 34, direction: 0 }, //chest udner miniboss fight

        { x: 73, y: 43, direction: 0 }, //above right most obelisk
    ],
    ground: [
        //{ x: 0, y: 0, width: 15, height: 1, type: 1 },
        { x: 1, y: 3, width: 10, height: 1, type: 1 }, //starting ground
        { x: 28, y: 0, width: 3, height: 1, type: 0 }, //bottom floor after jumps with chest on top
        { x: 34, y: 1, width: 5, height: 1, type: 0 }, //right most bottom floor
        { x: 34, y: 7, width: 2, height: 1, type: 0 }, //bottom floor wall holding obelisk
        { x: 61, y: 16, width: 3, height: 1, type: 0 }, //right of middle floor spikes
        { x: 68, y: 21, width: 6, height: 1, type: 0 }, //top of middle floor right
        { x: 27, y: 30, width: 37, height: 1, type: 0 }, //under top floor spikes
        //{ x: 0, y: 36, width: 26, height: 1, type: 0 }, //top left floor (boss fight) // EVENT
        { x: 1, y: 36, width: 12, height: 1, type: 0 }, //left miniboss ground
        { x: 16, y: 36, width: 10, height: 1, type: 0 }, //right miniboss ground

        { x: 70, y: 37, width: 5, height: 1, type: 0 }, //right msot obelisk floor


    ],
    spikes: [
        { x: 27, y: 31, width: 37 }, //top floor spikes
        { x: 52, y: 16, width: 9 }, //top ground of middle floor
    ],
    bricks: [
        //{ x: 30, y: 15, width: 90, height: 3 },
        { x: 0, y: 2, width: 11, height: 4 }, //starting bricks
        { x: 0, y: 22, width: 37, height: 13 }, //bottom floor ceiling
        { x: 34, y: 0, width: 33, height: 1, type: 0 }, //right most bottom floor
        { x: 37, y: 10, width: 4, height: 7, type: 0 }, //bottom floor crouch ceiling left
        { x: 37, y: 11, width: 5, height: 1, type: 0 }, //secret floor
        { x: 37, y: 15, width: 10, height: 1, type: 0 }, //secret floor ceiling
        { x: 40, y: 3, width: 1, height: 1, type: 0 }, //bottom floor crouch ceiling right
        { x: 44, y: 14, width: 3, height: 12, type: 0 }, //bottom floor crouch ceiling right
        { x: 44, y: 14, width: 3, height: 12, type: 0 }, //bottom floor
        { x: 49, y: 11, width: 18, height: 2, type: 0 }, //right most middle floor bottom
        { x: 50, y: 16, width: 2, height: 2, type: 0 }, //middle floor first left wall
        { x: 52, y: 15, width: 13, height: 1, type: 0 }, //top ground of middle floor
        { x: 55, y: 9, width: 12, height: 9, type: 0 }, //bottom right filler blocks
        { x: 37, y: 23, width: 10, height: 8, type: 0 }, //FILLER LEFT OF SECRET ROOM
        { x: 0, y: 23, width: 40, height: 1, type: 0 }, //filler between bottom and middle
        { x: 16, y: 29, width: 54, height: 6, type: 0 }, //top floor ground
        { x: 64, y: 33, width: 3, height: 4, type: 1 }, //top floor above spikes
        { x: 16, y: 33, width: 11, height: 4, type: 1 }, //left top floor (fight miniboss)
        { x: 0, y: 35, width: 13, height: 7, type: 0 }, //top left filler above exit room
        { x: 0, y: 53, width: 75, height: 8, type: 0 }, //top most ceiling
        { x: 68, y: 20, width: 7, height: 21, type: 0 }, //right
        { x: 75, y: 55, width: 10, height: 56, type: 0 }, //filler far right

    ],
    walls: [
        //{ x: -1, y: 15, height: 16, type: 0 },
        { x: 0, y: 45, height: 10, type: 2 },
        { x: 0, y: 10, height: 8, type: 0 }, //wall left first door
        { x: 17, y: 2, height: 4, type: 0 }, //bottom floor first jump
        { x: 24, y: 5, height: 7, type: 0 }, //bottom floor 2nd jump
        { x: 25, y: 5, height: 7, type: 0 }, //bottom floor 2nd jump 2
        { x: 36, y: 10, height: 8, type: 0 }, //first closing wall of bottom floor
        { x: 37, y: 3, height: 1, type: 0 }, //first closing wall of bottom floor
        { x: 41, y: 10, height: 7, type: 0 }, //secret room wall left
        { x: 43, y: 14, height: 11, type: 0 }, //secret room wall right
        { x: 47, y: 24, height: 22, type: 0 }, //bottom floor last right wall
        { x: 49, y: 15, height: 4, type: 0 }, //middle floor first left wall
        { x: 50, y: 14, height: 5, type: 0 }, //middle floor first left wall
        { x: 64, y: 21, width: 5, height: 6, type: 0 }, //right wall on middle floor
        { x: 67, y: 21, height: 22, type: 0 }, //middle floor last right wall
        { x: 74, y: 45, width: 1, height: 25, type: 0 }, //far most right wall
        { x: 0, y: 28, width: 1, height: 5, type: 0 }, //far left wall on top (exit)
        { x: 48, y: 36, width: 1, height: 6, type: 0 }, //top floor spikes right wall (bottom)
        { x: 48, y: 45, width: 1, height: 3, type: 0 }, //top floor spikes right wall (TOP)
        { x: 45, y: 43, width: 1, height: 13, type: 0 }, //top floor spikes left wall
        { x: 42, y: 45, width: 1, height: 7, type: 0 }, //top floor spikes right wall (TOP) 2
        { x: 38, y: 42, width: 1, height: 5, type: 0 }, //top floor spikes left wall (TOP) 2
        { x: 38, y: 45, width: 1, height: 1, type: 0 }, //top floor spikes left wall (TOP) 2
        { x: 35, y: 37, width: 1, height: 7, type: 0 }, //top floor spikes left (TOP) 3
        { x: 26, y: 38, width: 1, height: 5, type: 0 }, //closing top wall right in top left

        { x: 70, y: 45, width: 1, height: 7, type: 2 }, //right most obelisk wall

    ],

    platforms: [
        { x: 48, y: 7, width: 3, height: 1, type: 0 },             //bottom floor plat
        { x: 60, y: 21, width: 4, height: 1, type: 0 }, //middle floor plat
        { x: 1, y: 26, width: 3, height: 1, type: 0 }, //exit door plat (chest on top)
        { x: 60, y: 38, width: 2, height: 1, type: 0 }, //far right top plat over spikes
        { x: 52, y: 41, width: 2, height: 1, type: 0 }, //far right top plat over spikes 2
        { x: 39, y: 41, width: 3, height: 1, type: 0 }, //holds obelisk top floor
        { x: 39, y: 34, width: 4, height: 1, type: 0 }, //middle floor plat
        { x: 30, y: 33, width: 3, height: 1, type: 0 }, //middle floor plat top left over spikes
        { x: 53, y: 34, width: 1, height: 1, type: 0 }, //middle floor plat top left over spikes
        { x: 73, y: 42, width: 1, height: 1, type: 0 }, //above right most chest and obelisk
    ],

    obelisks: [
        { x: 34, y: 8, brickX: 36, brickY: 2, brickWidth: 1, brickHeight: 1 }, //unlock bottom floor
        { x: 62, y: 17, brickX: 65, brickY: 23, brickWidth: 2, brickHeight: 12 }, //unlock middle floor
        { x: 39, y: 42.5, brickX: 35, brickY: 48, brickWidth: 1, brickHeight: 11 }, //unlock top floor
        { x: 72, y: 38, brickX: 64, brickY: 48, brickWidth: 1, brickHeight: 15 }, //unlock top floor
    ],


    secrets: [
        {
            indicate: true,
            bricks: [
                { x: 42, y: 10, width: 1, height: 8 }, //hide secret walljump
                { x: 37, y: 15, width: 6, height: 6 }, //hide treasure room
                { x: 41, y: 3, width: 3, height: 1 }, //hide treasure bottom

            ]
        }
    ],
    backgroundWalls: [
        { x: 0, y: 50, width: 75, height: 40 }, //top
        { x: 0, y: 10, width: 8, height: 11 }, //bottom left
        { x: 34, y: 10, width: 30, height: 11 }, //bottom right
    ],

    columns: [
        { x: 8, y: 10, height: 8 }, //bottom left floor near door
        { x: 34, y: 10, height: 9 }, //bottom right
        { x: 65, y: 24, height: 13 }, //middle room
        { x: 66, y: 24, height: 13 }, //middle room
        { x: 66, y: 45, height: 12 }, //top floor right
        { x: 25, y: 45, height: 9 }, //top floor left
        { x: 1, y: 45, height: 9 }, //top floor left

    ],

    supports: [
        { x: 0, y: 9, width: 36 }, //bottom floor left
        { x: 48, y: 23, width: 22 }, //middle
        { x: 13, y: 45, width: 75 }, //top
        { x: 1, y: 45, width: 10 }, //top floor left
    ],

    chains: [
        //middle top
        { x: 52, y: 21 },
        { x: 55, y: 21 },
        { x: 58, y: 21 },

        //middle goblin room
        { x: 54, y: 14 },
        { x: 56, y: 14 },
        { x: 5, y: 14 },
        { x: 59, y: 14 },

        //top
        { x: 68, y: 32 },

        //exit
        { x: 11, y: 26 }

    ],

    ceilingChains: [
        { x: 73, y: 53, height: 20 },
        { x: 14, y: 45, height: 20 },
        { x: 53, y: 10, height: 20 }
    ],


    torches: [
        //near entrance
        { x: 5, y: 6 },
        { x: 2, y: 6 },
        //bottom right
        { x: 35, y: 4 },
        { x: 49, y: 3 },
        { x: 52, y: 3 },
        //secret room
        { x: 39, y: 13 },

        //middle room
        { x: 61, y: 19 },
        //middle goblin room
        { x: 53, y: 14 },
        { x: 58, y: 14 },
        //top parkour
        { x: 31, y: 36 },
        { x: 40, y: 44 },
        { x: 45, y: 46 },
        { x: 48, y: 38 },
        { x: 52, y: 44 },
        { x: 65, y: 37 },
        //miniboss room
        { x: 1, y: 41 },
        { x: 7, y: 41 },
        { x: 13, y: 41 },
        { x: 19, y: 41 },
        { x: 25, y: 41 },
        //exit
        { x: 24, y: 35 },
        { x: 6.5, y: 28 },
    ],

    banners: [
        { x: 38, y: 14 },
        { x: 40, y: 14 },
        //middle room
        { x: 51, y: 21 },
        { x: 54, y: 21 },
        { x: 56, y: 21 },
        { x: 59, y: 21 },
        //exit
        { x: 5, y: 26 },
        { x: 8, y: 26 },
        { x: 11, y: 26 },
        { x: 14, y: 26 },

        //miniboss room
        { x: 1, y: 40 },
        { x: 7, y: 40 },
        { x: 13, y: 40 },
        { x: 19, y: 40 },
        { x: 25, y: 40 },
    ],

    windows: [
        { x: 50, y: 3, width: 2, height: 2 },
        //middle goblin room
        { x: 60, y: 14, width: 4, height: 3 },
        //top floor
        { x: 71, y: 25, width: 2, height: 2 },
        { x: 71, y: 32, width: 2, height: 2 },
        { x: 71, y: 39, width: 2, height: 2 },

        { x: 40, y: 38, width: 2, height: 3 },

        //exit
        { x: 2, y: 42, width: 5, height: 5 },
        { x: 8, y: 42, width: 5, height: 5 },
        { x: 14, y: 42, width: 5, height: 5 },
        { x: 20, y: 42, width: 5, height: 5 },
        { x: 12, y: 26, width: 2, height: 2 },
    ],
    slimes: [
        { x: 29, y: 3, guard: true },
        { x: 31, y: 36, guard: true },
        { x: 41, y: 37, guard: true },

    ],
    shrooms: [
        { x: 72, y: 24, guard: false },

    ],
    goblins: [
        //bottom
        { x: 42, y: 4, guard: true },
        { x: 44, y: 4, guard: false },

        //middle
        { x: 53, y: 14, guard: true },
        { x: 55, y: 14, guard: true },
        { x: 57, y: 14, guard: true },
        { x: 58, y: 14, guard: true },
        { x: 60, y: 14, guard: false },

        //top
        { x: 3, y: 28, guard: true },

    ],
    skeletons: [
        //bottom
        { x: 41, y: 4, guard: true },
        //top
        //{ x: 20, y: 35, guard: true }
    ],

    flyingeyes: [
        //bottom floor
        { x: 15, y: 7, guard: false },
        { x: 25, y: 8, guard: true },
        { x: 32, y: 7, guard: true },

        //middle floor
        { x: 50, y: 23, guard: true },
        { x: 55, y: 23, guard: true },

        //top floor left
        { x: 31, y: 45, guard: true },
        { x: 32, y: 45, guard: true },
        //top floor right
        { x: 60, y: 39, guard: true },
        { x: 50, y: 41, guard: true },
        { x: 53, y: 37, guard: true },
    ],
    events: [
        {
            space: [
                { x: 24, y: 45, width: 1, height: 10 }
            ],
            platforms: [
                { x: 13, y: 36, width: 3, height: 1, type: 0 }, //middle platform to get to exit
            ],
            walls: [
                { x: 26, y: 45, height: 7, type: 2 }
            ],
            demon: { x: 8, y: 38, guard: false },
            slimes: [
                { x: 10, y: 38, guard: false },
                { x: 12, y: 38, guard: false },
                { x: 14, y: 38, guard: false },
                { x: 16, y: 38, guard: false },
            ]

        }
    ]

    //NOTE: place miniboss at x: 18, y: 38
}

var treasureroom = {
    ID: 5,
    label: "Treasure Room",
    width: 80, height: 52,
    player: { x: 40, y: 28 },
    music: MUSIC.SPLENDOUR,

    npcs: [{ x: 37, y: 28, text: ["My brain is too small to figure out the secrets of this room..."] }],

    //quick access to all levels
    doors: [

        { x: 41, y: 28, killQuota: 0, exitLocation: { x: 34, y: 33, levelNum: 3 }, transition: false }, //door to level 1

    ],

    walls: [

        { x: 19, y: 44, height: 20, type: 2 }, // Support Wall
        { x: 64, y: 44, height: 6, type: 2 },
        { x: 64, y: 37, height: 13, type: 2 },
    ],

    backgroundWalls: [
        { x: 20, y: 50, width: 59, height: 38 }, // Main wall
        { x: 16, y: 24, width: 4, height: 4 }, // Chest L1
        { x: 64, y: 24, width: 4, height: 4 }, // Chest R1
        { x: 15, y: 49, width: 5, height: 5 }, // Top Left
        { x: 64, y: 49, width: 5, height: 5 }, // Top Right
        { x: 1, y: 50, width: 19, height: 1 }, // Top Right
        { x: 1, y: 49, width: 4, height: 37 }, // Top Right // height!

        { x: 1, y: 12, width: 78, height: 13 }, // Underground
    ],
    obelisks: [
        { x: 67, y: 45, brickX: 24, brickY: 25, brickWidth: 5, brickHeight: 1 }, //unlock bottom floor
        { x: 67, y: 45, brickX: 55, brickY: 25, brickWidth: 5, brickHeight: 1 },
        { x: 41, y: 19, brickX: 29, brickY: 21, brickWidth: 4, brickHeight: 1 }, // escape
        { x: 16, y: 22, brickX: 30, brickY: 40, brickWidth: 1, brickHeight: 1 },
    ],

    platforms: [
        { x: 28, y: 30, width: 4, height: 1, type: 0 },
        { x: 52, y: 30, width: 4, height: 1, type: 0 },

        { x: 39, y: 35, width: 6, height: 1, type: 0 },

        { x: 53, y: 40, width: 11, height: 1, type: 0 },
    ],

    ground: [
        // Base floor
        { x: 29, y: 25, width: 26, height: 1, type: 1 },

        { x: 20, y: 25, width: 4, height: 1, type: 1 }, // Support Floor
        { x: 60, y: 25, width: 4, height: 1, type: 1 },

        //Underground
        { x: 39, y: 21, width: 6, height: 1, type: 1 },
    ],

    trap: [
        //Center
        { x: 20, y: 20, width: 9, height: 5, type: 4, percent: 0.1, rate: 50 },
        { x: 55, y: 20, width: 9, height: 5, type: 4, percent: 0.1, rate: 50 },
        { x: 1, y: 8, width: 6, height: 9, type: 4, percent: 0.2, rate: 500 },
        { x: 64, y: 38, width: 1, height: 1, type: 3, percent: 8, rate: 100 },
    ],

    bricks: [
        //Center
        { x: 29, y: 24, width: 4, height: 3, type: 0 },
        { x: 29, y: 20, width: 4, height: 8, type: 0 },
        //{ x: 48, y: 20, width: 4, height: 6, type: 0 },
        { x: 51, y: 24, width: 4, height: 10, type: 0 }, // Height Centers!

        { x: 33, y: 24, width: 18, height: 1, type: 0 },
        { x: 33, y: 23, width: 3, height: 1, type: 0 },
        { x: 33, y: 22, width: 1, height: 1, type: 0 },
        { x: 48, y: 23, width: 3, height: 1, type: 0 },
        { x: 50, y: 22, width: 1, height: 1, type: 0 },

        //{ x: 23, y: 19, width: 3, height: 14, type: 0 }, // Delete with done!

        //Behind Wall
        { x: 15, y: 44, width: 4, height: 20, type: 0 },
        { x: 65, y: 44, width: 4, height: 5, type: 0 },
        { x: 65, y: 37, width: 4, height: 13, type: 0 },
        { x: 79, y: 51, width: 1, height: 43, type: 0 },
        { x: 0, y: 50, width: 1, height: 38, type: 0 }, // Height!

        //Tops
        //{ x: 14, y: 24, width: 4, height: 20, type: 0 },
        { x: 5, y: 49, width: 10, height: 37, type: 0 }, // Height Left~!
        { x: 69, y: 48, width: 10, height: 9, type: 0 }, // Height right side!
        { x: 69, y: 37, width: 6, height: 25, type: 0 },
        { x: 0, y: 51, width: 25, height: 1, type: 0 },

        //Roof
        { x: 15, y: 49, width: 9, height: 1, type: 0 },
        { x: 25, y: 51, width: 54, height: 3, type: 0 },


        //Underground

        { x: 33, y: 18, width: 14, height: 5, type: 0 }, // Center
        { x: 48, y: 18, width: 3, height: 4, type: 0 },

        { x: 0, y: 12, width: 1, height: 13, type: 0 }, // Left wall
        { x: 7, y: 8, width: 22, height: 9, type: 0 },


        { x: 33, y: 13, width: 18, height: 10, type: 0 },
        { x: 29, y: 0, width: 51, height: 1, type: 0 }, // Bottom bottom floor

        // tall
        { x: 55, y: 8, width: 3, height: 8, type: 0 },
        { x: 76, y: 8, width: 4, height: 8, type: 0 },

        // med
        { x: 73, y: 3, width: 3, height: 3, type: 0 },
        { x: 58, y: 3, width: 3, height: 3, type: 0 },

        //Bottom Roof
        { x: 51, y: 13, width: 11, height: 1, type: 0 },
        { x: 63, y: 14, width: 1, height: 2, type: 0 },




        //Chests L1
        { x: 15, y: 24, width: 1, height: 12, type: 0 }, // Height all chests!
        { x: 16, y: 21, width: 2, height: 9, type: 0 },
        { x: 18, y: 20, width: 2, height: 8, type: 0 },

        // Chest R1
        { x: 68, y: 24, width: 1, height: 12, type: 0 },
        { x: 66, y: 21, width: 2, height: 9, type: 0 },
        { x: 64, y: 20, width: 2, height: 8, type: 0 },


        { x: 20, y: 15, width: 9, height: 3, type: 1 }, // Spike floors
        { x: 55, y: 15, width: 9, height: 1, type: 1 },
        { x: 1, y: 0, width: 6, height: 1, type: 1 }, // Spike floor


        //Fall down spikes
        { x: 1, y: 37, width: 2, height: 1, type: 1 },
        { x: 3, y: 31, width: 2, height: 1, type: 1 },
        { x: 1, y: 25, width: 3, height: 1, type: 1 },
        { x: 2, y: 20, width: 3, height: 1, type: 1 },

        { x: 1, y: 13, width: 1, height: 1, type: 1 },
        { x: 4, y: 13, width: 1, height: 1, type: 1 },
    ],

    spikes: [
        { x: 20, y: 16, width: 9 },
        { x: 55, y: 16, width: 9 },

        { x: 1, y: 38, width: 2 },
        { x: 3, y: 32, width: 2 },
        { x: 1, y: 26, width: 3 },
        { x: 2, y: 21, width: 3 },

        { x: 1, y: 14, width: 1 },
        { x: 4, y: 14, width: 1 },


        { x: 1, y: 1, width: 6 },
    ],

    chests: [

        //L1
        { x: 18, y: 21, direction: 1 },

        //R1
        { x: 64.5, y: 21, direction: 0 },
        { x: 66.5, y: 22, direction: 0 },


        // Door Top
        { x: 40.5, y: 36, direction: 0 },
        { x: 42, y: 36, direction: 1 },

        //Top Right
        { x: 15, y: 45, direction: 1 },

        // Underground secret
        { x: 42.5, y: 19, direction: 1 },
        { x: 33, y: 19, direction: 1 },
        { x: 37, y: 19, direction: 1 },

        { x: 40, y: 19, direction: 0 },
        { x: 45.5, y: 19, direction: 0 },
        { x: 49.5, y: 19, direction: 0 },


        { x: 43, y: 22, direction: 1 },
        { x: 39.5, y: 22, direction: 0 },
    ],

    shrooms: [
        { x: 35, y: 3, guard: true },
        { x: 48, y: 3, guard: true },
    ],
    goblins: [
        { x: 15, y: 11, guard: true },
        { x: 64, y: 3, guard: false },
        { x: 69, y: 3, guard: false },
    ],
    skeletons: [
        { x: 6, y: 11, guard: true },
        { x: 75, y: 7, guard: true },
        { x: 59, y: 7, guard: true },
    ],
    flyingeyes: [
        { x: 30, y: 35, guard: false },
        { x: 50, y: 43, guard: false },
        { x: 64, y: 12, guard: true },
        { x: 69, y: 10, guard: true },
        { x: 67, y: 8, guard: true },

        { x: 4, y: 7, guard: true },

    ],

    diamonds: [
        //{ x: 43, y: 30, amount: 5 },
    ],


    torches: [
        { x: 31, y: 28 },
        { x: 36, y: 28 },
        { x: 47, y: 28 },
        { x: 52, y: 28 },

        { x: 37, y: 22 },
        { x: 46, y: 22 },


        { x: 18, y: 23 },
        { x: 65, y: 23 },

        { x: 6, y: 11 },
        { x: 10, y: 11 },

        { x: 25, y: 11 },
        { x: 29, y: 11 },

        { x: 63, y: 2 },
        { x: 70, y: 2 },

        { x: 55, y: 43 },
        { x: 61, y: 43 },

        { x: 30, y: 42 },
    ],

    banners: [
        { x: 40, y: 28 },
        { x: 43, y: 28 },
    ],

    chains: [
        { x: 23.8, y: 22 },
        { x: 58.8, y: 22 },

        { x: 61.8, y: 12 },
        { x: 70.8, y: 12 },

        { x: 53.8, y: 39 },

        { x: 1.8, y: 36 },
        { x: 2.8, y: 24 },
        { x: 0.8, y: 12 },
        { x: 65.25, y: 3 },
        { x: 67.25, y: 3 },
    ],

    ceilingChains: [
        { x: 29, y: 28, height: 2 },
        { x: 30, y: 28, height: 1.5 },

        { x: 54, y: 28, height: 2 },
        { x: 53, y: 28, height: 1.5 },

        { x: 54, y: 28, height: 2 },
        { x: 53, y: 28, height: 1.5 },

        { x: 60, y: 24, height: 1 },
        { x: 63, y: 23, height: 1.5 },

        { x: 23, y: 24, height: 1 },
        { x: 20, y: 23, height: 1.5 },

        { x: 22, y: 50, height: 1 },
        { x: 20, y: 50, height: 1.5 },

        { x: 1, y: 50, height: 2 },
        { x: 4, y: 50, height: 1.5 },

        { x: 78, y: 36, height: 4 },
        { x: 70, y: 39, height: 1 },

        { x: 61, y: 39, height: 1 },
        { x: 62, y: 38, height: 2 },
        { x: 63, y: 39, height: 1 },

        { x: 4, y: 29, height: 2 },
        { x: 1, y: 21, height: 3 },

    ],



    columns: [
        { x: 33, y: 48, height: 23 },
        { x: 34, y: 48, height: 23 },

        { x: 49, y: 48, height: 23 },
        { x: 50, y: 48, height: 23 },

        { x: 35, y: 22, height: 5 },
        { x: 48, y: 22, height: 5 },

        { x: 8, y: 12, height: 4 },
        { x: 27, y: 12, height: 4 },

        { x: 34, y: 3, height: 3 },
        { x: 35, y: 3, height: 3 },

        { x: 48, y: 3, height: 3 },
        { x: 49, y: 3, height: 3 },
    ],


    windows: [
        { x: 16, y: 48, width: 3, height: 4 },
        { x: 65, y: 48, width: 3, height: 4 },
        { x: 11, y: 18, width: 2, height: 3 },
        { x: 58, y: 7, width: 3, height: 4 },
        { x: 73, y: 7, width: 3, height: 4 },
        { x: 66, y: 39, width: 2, height: 2 },
    ],

    secrets: [
        {
            indicate: true,
            bricks: [
                { x: 5, y: 50, width: 20, height: 1 }, //hide top path
                { x: 24, y: 49, width: 1, height: 1 }, //hide path entrance
                { x: 1, y: 50, width: 4, height: 38 }, //hide drop down
                { x: 75, y: 39, width: 4, height: 27 },
                { x: 1, y: 12, width: 28, height: 4 }, // undergrounds
                { x: 65, y: 39, width: 10, height: 2 },
                { x: 29, y: 12, width: 50, height: 12 },
                //{ x: 33, y: 4, width: 16, height: 4 },

            ]
        },
        {
            indicate: false,
            bricks: [
                { x: 47, y: 18, width: 1, height: 4 }, //hide top path
                { x: 47, y: 14, width: 16, height: 1 }, //hide path entrance
                { x: 62, y: 13, width: 1, height: 1 },

            ]
        }
    ],

    signs: [
        {
            x: 66.5, y: 2,
            title: "  Encrypted Message",
            text: [
                "4576656E206D7920636C6F736573742066726965",
                "6E642077686F6D204920747275737465642C2074",
                "6865206F6E652077686F20617465206D79206272",
                "6561642C20686173206C69667465642068697320",
                "6865656C20616761696E7374206D652E - 5073616C6D732034313A39",
            ],

        },

        {
            x: 62, y: 42,
            title: "  Hear ye hear ye",
            text: ["Vasts amount of opportunities are open before you,",
                "but let not your heart corrupt lest you lose your freedom,",
                "for the pits of hell shall surely open and swallow the greedy,",
                "thus, seize the moment to go above and beyond the fools that came before you..",
            ],

        },
    ]


}

var levelBoss1 = {
    ID: 100,
    label: "Final Room",
    width: 120, height: 20,
    player: { x: 40, y: 1 },
    music: MUSIC.COUNTERATTACK,

    portal: { x: 115, y: 4 },

    events: [
        {
            space: [
                { x: 62, y: 20, width: 39, height: 20 }
            ],
            walls: [
                { x: 60, y: 5, height: 5, type: 2 },
                { x: 102, y: 5, height: 5, type: 0 },
                { x: 103, y: 5, height: 5, type: 2 },
                { x: 59, y: 5, height: 5, type: 0 },
            ],
            wizard: { x: 75, y: 2, left: 61, right: 102, top: 6, bottom: 1 },
        }
    ],
    doors: [
        { x: 1, y: 3, killQuota: 0, exitLocation: { x: 8, y: 24, levelNum: 4 }, transition: false }, //door to level 1
    ],
    ground: [
        { x: 0, y: 0, width: 120, height: 1, type: 1 },
    ],
    bricks: [
        { x: 0, y: 20, width: 60, height: 15 },
        { x: 103, y: 20, width: 20, height: 15 },
    ],
    walls: [
        { x: 60, y: 20, height: 15, type: 2 },
        { x: 102, y: 20, height: 15, type: 0 },
    ],
    torches: [
        { x: 0, y: 3 },
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 15, y: 3 },
        { x: 21, y: 3 },
        { x: 27, y: 3 },
        { x: 33, y: 3 },
        { x: 39, y: 3 },
        { x: 45, y: 3 },
        { x: 51, y: 3 },
        { x: 57, y: 3 },

        { x: 66, y: 9 },
        { x: 72, y: 9 },
        { x: 78, y: 9 },
        { x: 84, y: 9 },
        { x: 90, y: 9 },
        { x: 96, y: 9 },
    ],
    backgroundWalls: [
        { x: 0, y: 20, width: 120, height: 20 },
    ],
    columns: [
        { x: 6, y: 4, width: 1, height: 4 },
        { x: 12, y: 4, width: 1, height: 4 },
        { x: 18, y: 4, width: 1, height: 4 },
        { x: 24, y: 4, width: 1, height: 4 },
        { x: 30, y: 4, width: 1, height: 4 },
        { x: 36, y: 4, width: 1, height: 4 },
        { x: 42, y: 4, width: 1, height: 4 },
        { x: 48, y: 4, width: 1, height: 4 },
        { x: 54, y: 4, width: 1, height: 4 },
        { x: 60, y: 4, width: 1, height: 4 },

        { x: 61, y: 20, width: 1, height: 20 },
        { x: 65, y: 20, width: 1, height: 20 },
        { x: 67, y: 20, width: 1, height: 20 },
        { x: 71, y: 20, width: 1, height: 20 },
        { x: 73, y: 20, width: 1, height: 20 },
        { x: 77, y: 20, width: 1, height: 20 },
        { x: 79, y: 20, width: 1, height: 20 },
        { x: 83, y: 20, width: 1, height: 20 },
        { x: 85, y: 20, width: 1, height: 20 },
        { x: 89, y: 20, width: 1, height: 20 },
        { x: 91, y: 20, width: 1, height: 20 },
        { x: 95, y: 20, width: 1, height: 20 },
        { x: 97, y: 20, width: 1, height: 20 },
        { x: 101, y: 20, width: 1, height: 20 },
    ],
    supports: [
        { x: 0, y: 5, width: 61, height: 1 },
    ],
    windows: [
        { x: 62, y: 12, width: 3, height: 10 },
        { x: 68, y: 12, width: 3, height: 10 },
        { x: 74, y: 12, width: 3, height: 10 },
        { x: 80, y: 12, width: 3, height: 10 },
        { x: 86, y: 12, width: 3, height: 10 },
        { x: 92, y: 12, width: 3, height: 10 },
        { x: 98, y: 12, width: 3, height: 10 },
    ],
    banners: [
        { x: 66, y: 8 },
        { x: 72, y: 8 },
        { x: 78, y: 8 },
        { x: 84, y: 8 },
        { x: 90, y: 8 },
        { x: 96, y: 8 },
    ],

}
