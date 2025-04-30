/*misc extra level files*/

//bonus level made by david's brother
const level_extra = {
    ID: 8,
    label: "Lv 3 but on steroids to the nth degree",
    width: 140, height: 100,
    player: { x: 14, y: 80 },
    music: MUSIC.SPLENDOUR,

    ground: [
        { x: 11, y: 74, width: 10, height: 1, type: 1 },
        { x: 20, y: 18, width: 41, height: 1, type: 1 },


    ],



    bricks: [
        { x: 11, y: 83, width: 15, height: 1 },
        { x: 25, y: 30, width: 14, height: 1 },
        { x: 21, y: 71, width: 1, height: 1 },
        { x: 23, y: 64, width: 2, height: 1 },
        { x: 21, y: 55, width: 1, height: 1 },
        { x: 24, y: 55, width: 1, height: 1 },
        { x: 21, y: 47, width: 3, height: 1 },
        { x: 22, y: 39, width: 3, height: 1 },
        { x: 21, y: 30, width: 2, height: 1 },
        { x: 39, y: 72, width: 2, height: 1 },
        { x: 41, y: 71, width: 2, height: 1 },
        { x: 43, y: 70, width: 2, height: 1 },
        { x: 22, y: 21, width: 1, height: 1 },
        { x: 30, y: 22, width: 2, height: 1 },
        { x: 40, y: 22, width: 1, height: 1 },
        { x: 46, y: 26, width: 2, height: 1 },
        { x: 59, y: 20, width: 2, height: 1 },
        { x: 40, y: 22, width: 1, height: 1 },
        { x: 54, y: 23, width: 1, height: 1 },
        { x: 64, y: 23, width: 1, height: 1 },
        { x: 67, y: 25, width: 1, height: 1 },
        { x: 67, y: 26, width: 2, height: 1 },
        { x: 67, y: 32, width: 1, height: 1 },
        { x: 68, y: 30, width: 1, height: 1 },
        { x: 41, y: 30, width: 1, height: 1 },
        { x: 43, y: 43, width: 2, height: 1 },
        { x: 39, y: 49, width: 2, height: 1 },
        { x: 43, y: 55, width: 2, height: 1 },
        { x: 39, y: 59, width: 2, height: 1 },
        { x: 39, y: 67, width: 2, height: 1 },
        { x: 39, y: 70, width: 1, height: 1 },
        { x: 45, y: 33, width: 25, height: 1 },
        { x: 44, y: 36, width: 1, height: 1 },
        { x: 44, y: 63, width: 1, height: 1 },
        { x: 41, y: 69, width: 1, height: 1 },
        { x: 41, y: 70, width: 1, height: 1 },
        { x: 62, y: 7, width: 8, height: 4 },
        { x: 69, y: 19, width: 29, height: 1 },
        { x: 66, y: 32, width: 1, height: 4 },
        { x: 76, y: 6, width: 1, height: 3 },
        { x: 83, y: 10, width: 2, height: 9 },
        { x: 94, y: 8, width: 2, height: 1 },
        { x: 103, y: 9, width: 2, height: 1 },
        { x: 97, y: 24, width: 9, height: 1 },
        { x: 106, y: 35, width: 31, height: 1 },
        { x: 108, y: 30, width: 30, height: 1 },
        { x: 98, y: 24, width: 8, height: 1 },
        { x: 107, y: 14, width: 1, height: 1 },
        { x: 102, y: 19, width: 2, height: 1 },
        { x: 137, y: 35, width: 1, height: 5 },

    ],

    walls: [
        { x: 11, y: 83, height: 10, type: 2 },
        { x: 20, y: 74, height: 56, type: 2 },
        { x: 25, y: 83, height: 54, type: 2 },
        { x: 38, y: 71, height: 41, type: 2 },
        { x: 45, y: 69, height: 37, type: 2 },
        { x: 69, y: 33, height: 15, type: 2 }, // If Wall type not in game Blocks will be invisible :Example: Type:43
        { x: 61, y: 18, height: 15, type: 2 },
        { x: 108, y: 30, height: 24, type: 2 },
        { x: 106, y: 35, height: 12, type: 2 },
        { x: 97, y: 23, height: 5, type: 2 },

    ],

    spikes: [
        { x: 21, y: 19, width: 41 },
        { x: 21, y: 72, width: 1 },
        { x: 23, y: 65, width: 2 },
        { x: 21, y: 56, width: 1 },
        { x: 24, y: 56, width: 1 },
        { x: 21, y: 48, width: 3 },
        { x: 22, y: 40, width: 3 },
        { x: 44, y: 44, width: 1 },
        { x: 39, y: 50, width: 1 },
        { x: 44, y: 56, width: 1 },
        { x: 39, y: 60, width: 1 },
        { x: 21, y: 31, width: 2 },
    ],

    backgroundWalls: [
        { x: 0, y: 120, width: 150, height: 180 }
    ],

    npcs: [
        { x: 16, y: 75 },
        { x: 65, y: 8 },
    ],

    flyingeyes: [
        { x: 25, y: 26, guard: false },
        { x: 36, y: 26, guard: false },
        { x: 45, y: 24, guard: false },
        { x: 47, y: 30, guard: false },
        { x: 54, y: 27, guard: false },
        { x: 61, y: 22, guard: false },
        { x: 67, y: 29, guard: false },
        { x: 40, y: 40, guard: false },
        { x: 63, y: 22, guard: false },
        { x: 67, y: 22, guard: false },
        { x: 82, y: 15, guard: false },
        { x: 98, y: 12, guard: false },
        { x: 106, y: 21, guard: false },
        { x: 22, y: 43, guard: true },
        { x: 22, y: 34, guard: true },
        { x: 40, y: 53, guard: true },
        { x: 41, y: 62, guard: true },
        { x: 39, y: 69, guard: true },
        { x: 31, y: 25, guard: true },
        { x: 52, y: 24, guard: true },
        { x: 65, y: 26, guard: true },
        { x: 24, y: 23, guard: true },
        { x: 42, y: 27, guard: true },



    ],

    doors: [

        { x: 1, y: 1, killQuota: 0, exitLocation: { x: 1, y: 1, levelNum: 8 }, transition: false },
        { x: 1, y: 1, killQuota: 10, exitLocation: { x: 1, y: 1, levelNum: 4 }, transition: false },
    ],
    skeletons: [
        { x: 23, y: 10, guard: true },

    ],
    events: [
        {
            space: [
                { x: 108, y: 31, width: 1, height: 6 }
            ],
            walls: [
                { x: 122, y: 31, height: 6, type: 2 },
                { x: 107, y: 20, height: 1, type: 2 },
            ],

            skeletons: [
                { x: 109, y: 36, guard: false },
                { x: 112, y: 36, guard: false },
                { x: 114, y: 36, guard: false },
                { x: 116, y: 36, guard: false },
                { x: 118, y: 36, guard: false },

            ],

        }
    ],

    signs: [
        {
            x: 125, y: 32,
            title: "is this over yet?",
            text: ["Is this the end?",
                "I feel like My mind is playing tricks on me",
                "probably been all that vodka i drank with Mr.bear"

            ]

        },
    ],
}
