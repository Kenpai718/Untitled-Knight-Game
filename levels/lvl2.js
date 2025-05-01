const level1_2 = {
    ID: 2,
    label: "Level 2",
    width: 120, height: 36,
    player: { x: 1, y: 1 },
    music: MUSIC.CHASING_DAYBREAK,
    doors: [
        { x: 116, y: 3, killQuota: 7, exitLocation: DOOR_SPAWNS.enter_to_level3, transition: false }, //next level to 3
        { x: 0, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level1, transition: false } //go back to level 1
    ],

    signs: [{
        x: 4, y: 2,
        title: "[TUTORIAL: COMBOS]",
        text: COMBAT_TIP_BLURB
    },
        {
            x: 4, y: 26,
            title: "[GET 1,000,0000 DIAMONDS WITH THIS ONE SIMPLE TRICK!]",
            text: TROLL_COMBO_BLURB
        },
        {
            x: 62, y: 2,
            title: "[TUTORIAL: BLADE BEAM]",
            text: BLADE_BEAM_BLURB
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
        { x: 7, y: 1, text: ["I would read this sign if I knew how to read."] },
        { x: 38, y: 21}
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
        { x: -1, y: 3, width: 1, height: 3 },
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
        { x: 76, y: 3, guard: true },
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
