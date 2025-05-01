const level1_1 = {
    ID: 1,
    label: "Level 1",
    width: 120, height: 15,
    player: { x: 2, y: 1 },
    music: MUSIC.FODLAN_WINDS,
    doors: [
        { x: 116, y: 12, killQuota: 3, exitLocation: DOOR_SPAWNS.enter_to_level2, transition: false }, //door to level 2
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
                "then I can grant you more power."]
        },
    ],

    signs: [
        {
            x: 16, y: 3,
            title: "[TUTORIAL: BASIC COMBAT/MOVEMENT]",
            text: CONTROLS_BLURB
        },
        {
            x: 36, y: 6,
            title: "[TUTORIAL: CROUCHING]",
            text: CROUCHING_BLURB
        },

        {
            x: 49, y: 6,
            title: "[TUTORIAL: SHOP/HEALING]",
            text: SHOP_HEAL_BLURB
        },

        {
            x: 59, y: 6,
            title: "[TUTORIAL: DODGING]",
            text: DODGING_BLURB
        },

        {
            x: 69, y: 6,
            title: "[TUTORIAL: CHESTS]",
            text: CHEST_BLURB
        },


        {
            x: 92, y: 2,
            title: "[TUTORIAL: WALLJUMP]",
            text: WALLJUMP_BLURB
        },

        {
            x: 102, y: 2,
            title: "    Secrets!!!",
            text: SECRETS_BLURB
        },

        {
            x: 110, y: 11,
            title: "[TUTORIAL: DOORS]",
            text: DOORS_BLURB
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
        { x: 26, y: 4, guard: true },
        { x: 62, y: 1, guard: false },
        { x: 72, y: 5, guard: false },
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
