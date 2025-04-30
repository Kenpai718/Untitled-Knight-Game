const level1_3 = {
    ID: 3,
    label: "Level 3",
    width: 120, height: 42,
    player: { x: 1, y: 1 },
    music: MUSIC.BETWEEN_HEAVEN_AND_EARTH,
    signs: [
        {
            x: 4, y: 2,
            title: "[TUTORIAL: OBELISK]",
            text: OBELISK_BLURB
        },
        {
            x: 34, y: 4,
            title: "[TUTORIAL: ADVANCED JUMPS]",
            text: PLATFORMING_TIPS_BLURB
        },

        {
            x: 39, y: 8,
            title: "[TUTORIAL: MOVING PLATFORMS]",
            text: MOVING_PLATY_BLURB
        },

        {
            x: 37, y: 34,
            title: "[????????????????????]",
            text: [
                ">-(•_•)-<",
                "   ( )",
                "   o o.",
                "wooper is the best",
            ]
        },

        {
            x: 12, y: 37,
            title: "[You are a very curious player!]",
            text: [
                "Hope you are enjoying the game!",
                "Take these chests as your reward!",
                "-Ken was here :)",
                "",
                "P.S: There's a super secret DOOR",
                " on this level to a bonus level!",
                " Hint: Follow the torches ;)"
            ]
        },

    ],
    npcs: [
        { x: 10, y: 16, text: "Just uh dropping by..." },
        {
            x: 51, y: 10, text: ["A little birdie told me that",
                "that this floor holds treasures",
                "beyond your wildest imagination..."]
        },
        { x: 39, y: 35, text: "I can practically taste the treasure in here." },

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
        { x: 1, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level2, transition: false }, //go back to level 2
        { x: 117, y: 25, killQuota: 8, exitLocation: DOOR_SPAWNS.enter_to_level4, transition: false }, // change to level 4 once theres a level 4
        { x: 34, y: 35, killQuota: 0, exitLocation: DOOR_SPAWNS.enter_to_treasure, transition: false } // change to treasure room
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
        //{ x: 36, y: 35, guard: false },
        { x: 61, y: 10, guard: false }
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
        { x: 39, y: 10 },
        { x: 53, y: 7 },
        { x: 68, y: 25 },
        { x: 56, y: 17 },
        { x: 52.5, y: 27 }, //subtle hint to go left to find the treasure room                                                                                                        :c
        { x: 49, y: 30 },
        { x: 46, y: 14 },
        { x: 50, y: 35 },
        { x: 61, y: 25 },

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
        { x: 23, y: 7, width: 1, height: 1 },
        { x: 29, y: 7, width: 2, height: 1 },

        //middle parkour left
        { x: 17, y: 16, width: 4, height: 1 },
        { x: 23, y: 20, width: 2, height: 1 },
        { x: 17, y: 31, width: 1, height: 1 },
        { x: 23, y: 31, width: 1, height: 1 },
        { x: 22, y: 38, width: 1, height: 1 },

        //middle parkour right
        { x: 28, y: 12, width: 1, height: 1 },
        { x: 33, y: 18, width: 1, height: 1 },
        { x: 31, y: 23, width: 1, height: 1 },
        { x: 28, y: 27, width: 3, height: 1 },


        //true middle parkour
        { x: 46, y: 11, width: 1, height: 1 },
        { x: 56, y: 15, width: 1, height: 1 },
        { x: 56, y: 15, width: 1, height: 1 },
        { x: 58, y: 7, width: 2, height: 1 },

        //obelisk to treasure room

        { x: 38, y: 6, width: 3, height: 1 },
        //{ x: 50, y: 34, width: 3, height: 1 },
        { x: 64, y: 35, width: 5, height: 1 }, //chest on top

        //{ x: 49, y: 12, width: 2, height: 1 },
        { x: 59, y: 22, width: 5, height: 1 },
        { x: 69, y: 12, width: 8, height: 1 },
        { x: 89, y: 17, width: 3, height: 1 },
        { x: 95, y: 21, width: 1, height: 1 },
        { x: 45, y: 30, width: 2, height: 1 },
        { x: 51, y: 4, width: 5, height: 1 },
    ],

    moveable: [

        //{ x: 23, y: 4, width: 1, height: 1, directionList: [2], distanceList: [6], velocity: 1  },
        { x: 16, y: 2, width: 2, height: 1, directionList: ["right"], distanceList: [10], velocity: 1 },

        //middle parkour right
        //{ x: 29, y: 7, width: 2, height: 1, directionList: [1], distanceList: [7], velocity: 1  },

        //obelisk to treasure room
        { x: 41, y: 6, width: 2, height: 1, directionList: ["right", "down"], distanceList: [8, 2], velocity: 1.5 },
        { x: 47, y: 11, width: 2, height: 1, directionList: ["right"], distanceList: [7], velocity: 1 },

        { x: 50, y: 33, width: 3, height: 1, directionList: ["right"], distanceList: [7], velocity: 1.5 }, //travel to the top right obelisk

        { x: 60, y: 9, width: 3, height: 1, directionList: ["up"], distanceList: [5], velocity: 1 }
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
