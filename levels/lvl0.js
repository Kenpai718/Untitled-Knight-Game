/**TEST LEVEL = Debugging/testing rom aka LEVEL 0 */
const testLevel = {
    ID: 0,
    label: "Developer Room",
    width: 48, height: 14,
    player: { x: 1, y: 1 },
    music: MUSIC.FODLAN_WINDS,

    //quick access to all levels
    doors: [
        //entrances left
        { x: 0, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level1, transition: false }, //door to level 1
        { x: 6, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level2, transition: false }, //door to level 2
        { x: 9, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level3, transition: false }, //door to level 3
        { x: 12, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level4, transition: false }, //door to level 4
        { x: 10, y: 8, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_level5, transition: false }, //door to level 5
        { x: 13, y: 8, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_final, transition: false }, //door to final boss

        //exit right
        { x: 20, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level1, transition: false },
        { x: 24, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level2, transition: false },
        { x: 28, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level3, transition: false },
        { x: 32, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level4, transition: false },
        { x: 36, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level5, transition: false },
        { x: 40, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_final, transition: false },
        { x: 40, y: 9, killQuota: 0, exitLocation: { x: 126, y: 33, levelNum: 8 }, transition: false },

        //top right special
        { x: 28, y: 9, killQuota: 0, exitLocation: { x: 22, y: 40, levelNum: 4 }, transition: false }, //door to level 4 miniboss
        { x: 32, y: 9, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_treasure, transition: false }, //treasure top
        { x: 36, y: 9, killQuota: 0, exitLocation: { x: 53, y: 1, levelNum: 6 }, transition: false }, //treasure bottom
        //{ x: 4, y: 3, killQuota: 0, exitLocation: { x: 14, y: 78, levelNum: 5 }, transition: false },


    ],

    portal: { x: 22, y: 10 },

    npcs: [
        { x: 3, y: 5, text: "what da dog doin?" },
        { x: 45, y: 3, text: "ur kinda sus ඞ" },
    ],

    signs: [
        {
            x: 3, y: 2,
            title: "  DEV-MODE-OPTIONS",
            text: ["console.log(\'here\'):",
                "-This room is for developers to test mechanics",
                "-If you are not a developer then... 🔫😬",
                "-Press [RIGHT-CTRL] in this room to instantly get",
                " MAX DIAMONDS. This is to test the shop.",
                "",
                "-The left most door are entrances to the levels",
                "-Right most doors lead to exits or special places"
            ]

        },

        {
            x: 8.5, y: 7,
            title: "IMPORTANT DISCLOSURE",
            text: ["According to all known laws of aviation",
                "there is no way a bee should be able to fly.",
                "Its wings are too small to get",
                "its fat little body off the ground.",
                "The bee, of course, flies anyway",
                "because bees don't care",
                "what humans think is impossible."
            ]
        },

        {
            x: 19, y: 8,
            title: "    PORTAL",
            text: ["Enter this special door to test finishing the game."
            ]
        },

        {
            x: 26, y: 8,
            title: "    MINIBOSS #1",
            text: ["Enter here if you want to fight the miniboss",
                "Go right from spawn to activate the fight."
            ]
        },

        {
            x: 34.5, y: 8,
            title: "   Treasure Room",
            text: ["Left treasure door for start",
                "Right treasure door for bottom"
            ]
        },

        {
            x: 18, y: 2,
            title: "     Exits",
            text: ["The bottom floor doors are the exit locations of the levels",
                ["Top right is special locations to test"]
            ]
        },


    ],

    backgroundWalls: [
        { x: 0, y: 14, width: 50, height: 14 }
    ],
    ground: [
        { x: 0, y: 0, width: 50, height: 1, type: 1 },
        { x: 3, y: 5, width: 3, height: 1, type: 1 },
        { x: 10, y: 5, width: 5, height: 1, type: 1 },
        { x: 8, y: 10, width: 7, height: 1, type: 1 },

        //right side
        { x: 18, y: 6, width: 25, height: 1, type: 1 }
    ],
    trap: [
        { x: 6, y: 5, width: 4, height: 1, type: 1, percent: 0.1, rate: 20 }
    ],
    chests: [
        //{ x: 3, y: 1, direction : 1},
        //{ x: 16, y: 1, direction: 0 }
    ],
    bricks: [
        //{ x: 10, y: 7, width: 1, height: 1 },
    ],
    walls: [
        { x: -1, y: 14, height: 14, type: 2 },
        { x: 15, y: 14, height: 13, type: 2 },
        //{ x: 25, y: 14, height: 14, type: 2 }
    ],
    obelisks: [
        { x: 4.5, y: 1, brickX: 15, brickY: 1, brickWidth: 1, brickHeight: 1, initial: true, repeat: true },
        { x: 4.5, y: 1, brickX: 7, brickY: 12, brickWidth: 1, brickHeight: 3, initial: false, repeat: true }
    ],
    moveable: [
        { x: 1, y: 10, width: 3, height: 1, directionList: ["down", "right"], distanceList: [7, 2], velocity: 1, onTouch: true },
    ],

    shrooms: [
        { x: 14, y: 13, guard: true }
    ],
    goblins: [
        { x: 12, y: 13, guard: true }
    ],
    skeletons: [
        { x: 13, y: 13, guard: true },
    ],
    flyingeyes: [
        { x: 11, y: 12, guard: true },
    ],
    slimes: [
        { x: 1, y: 11, guard: false }
    ]
}
