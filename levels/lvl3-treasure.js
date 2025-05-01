const treasureroom = {
    ID: 7,
    label: "Treasure Room",
    width: 80, height: 52,
    player: { x: 40, y: 28 },
    //player: { x: 53, y: 11 }, //down below
    music: MUSIC.SPLENDOUR,

    npcs: [{
        x: 37, y: 28, text: [
            "A birdie told me treasure lurks in every corner...",
            "Take to the skies, hero, and following your guiding light.",]
    },
        {
            x: 41, y: 1, text: [
                "The greatest treasure",
                "are those invisible to the eye",
                "but found by the heart."]
        }
    ],

    //quick access to all levels
    doors: [

        { x: 41, y: 28, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level3top, transition: false }, //door to level 3 top

    ],

    walls: [

        { x: 19, y: 44, height: 20, type: 2 }, // Support Wall
        { x: 64, y: 44, height: 6, type: 2 },
        { x: 64, y: 37, height: 13, type: 2 },
        { x: 30, y: 40, height: 1, type: 2 }, //left jump
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
        { x: 67, y: 45, brickX: 24, brickY: 25, brickWidth: 5, brickHeight: 1, initial: true, repeat: true }, //unlock bottom floor
        { x: 67, y: 45, brickX: 55, brickY: 25, brickWidth: 5, brickHeight: 1, initial: true, repeat: true },
        { x: 41, y: 19, brickX: 29, brickY: 21, brickWidth: 4, brickHeight: 1, initial: true, repeat: true }, // escape
        { x: 16, y: 22, brickX: 5, brickY: 50, brickWidth: 1, brickHeight: 1, initial: true, repeat: true }, //opens top left secret corner
    ],

    platforms: [
        { x: 28, y: 30, width: 4, height: 1, type: 0 },
        { x: 52, y: 30, width: 4, height: 1, type: 0 },

        { x: 39, y: 35, width: 6, height: 1, type: 0 },

        { x: 53, y: 40, width: 11, height: 1, type: 0 },
    ],

    moveable: [

        //{ x: 23, y: 4, width: 1, height: 1, directionList: [2], distanceList: [6], velocity: 1  },
        //secret room right lift
        { x: 78, y: 8, width: 1, height: 1, directionList: ["up"], distanceList: [29], velocity: 5, onTouch: true },
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
        //{ x: 15, y: 49, width: 9, height: 1, type: 0 }, //old roof by david
        { x: 15, y: 49, width: 8, height: 1, type: 0 },  //new roof by ken makes the jump a bit easier to secret
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
        { x: 17, y: 45, direction: 1 },

        // Underground secret
        { x: 42.5, y: 19, direction: 1 },
        { x: 33, y: 19, direction: 1 },
        { x: 37, y: 19, direction: 1 },

        { x: 40, y: 19, direction: 0 },
        { x: 45.5, y: 19, direction: 0 },
        { x: 49.5, y: 19, direction: 0 },


        { x: 43, y: 22, direction: 1 },
        { x: 39.5, y: 22, direction: 0 },

        //bottom floor chests
        { x: 56, y: 9, direction: 0 },
        { x: 72, y: 38, direction: 1 },
    ],

    shrooms: [
        { x: 35, y: 3, guard: true },
        { x: 48, y: 3, guard: true },
    ],

    slimes: [
        { x: 16, y: 50, guard: false },
        { x: 13, y: 50, guard: false },
        { x: 10, y: 50, guard: false },
        { x: 46, y: 14, guard: true },
        { x: 49, y: 14, guard: true },

    ],
    goblins: [
        { x: 15, y: 11, guard: true },
        //{ x: 64, y: 3, guard: false },
        //{ x: 69, y: 3, guard: false },
    ],
    skeletons: [
        { x: 6, y: 11, guard: true },
        //{ x: 75, y: 7, guard: true },
        //{ x: 59, y: 7, guard: true },
    ],
    flyingeyes: [
        { x: 30, y: 35, guard: false },
        { x: 50, y: 43, guard: false },
        //{ x: 64, y: 12, guard: true },
        //{ x: 69, y: 10, guard: true },
        //{ x: 67, y: 8, guard: true },

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
        { x: 20, y: 47 },

        { x: 41.5, y: 38 },
        { x: 56, y: 11 },

    ],

    banners: [
        { x: 40, y: 28 },
        { x: 43, y: 28 },
    ],

    chains: [
        { x: 24, y: 22 },
        { x: 59, y: 22 },

        { x: 62, y: 12 },
        { x: 71, y: 12 },

        { x: 53, y: 39 },

        { x: 2, y: 36 },
        { x: 3, y: 24 },
        { x: 1, y: 12 },
        { x: 65, y: 3 },
        { x: 68, y: 3 },
    ],

    ceilingChains: [
        { x: 29, y: 29, height: 2 },
        { x: 30, y: 29, height: 1 },

        { x: 54, y: 29, height: 2 },
        { x: 53, y: 29, height: 1 },

        //{ x: 54, y: 28, height: 2 },
        //{ x: 53, y: 28, height: 1.5 },

        { x: 60, y: 24, height: 1 },
        { x: 63, y: 24, height: 1.5 },

        { x: 23, y: 24, height: 1 },
        { x: 20, y: 24, height: 1.5 },

        { x: 22, y: 50, height: 1 },
        { x: 18, y: 50, height: 1 },

        { x: 1, y: 50, height: 2 },
        { x: 4, y: 50, height: 1.5 },

        { x: 4, y: 30, height: 2 },
        { x: 1, y: 24, height: 3 },

        { x: 78, y: 39, height: 4 },
        { x: 70, y: 39, height: 1 },

        { x: 61, y: 39, height: 1 },
        { x: 62, y: 39, height: 2 },
        { x: 63, y: 39, height: 1 },



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

    signs: [
        {
            x: 16, y: 46,
            title: "    Need a hint?",
            text: [
                "To infinity and beyond!",
            ],

        },

        {
            x: 3, y: 2,
            title: "   haha gotcha!!",
            text: [
                "Bad things come to those who are greedy.",
                "Welcome to the pits of hell >:)",


                "-Sincerely,",
                " David and Ken",

                "",
                " P.S: yes you can still get back up if ur gud",
            ],

        },

        {
            x: 45, y: 27,
            title: "      ???",
            text: [
                "Wealth, fame, power. Gold Roger, the King of the Pirates,",
                "attained everything this world has to offer.",
                "And so, many men head for the Grand Line to find",
                "the great treasure he left behind, the One Piece.",
                "",
                "\"My wealth and treasures? If you want it,",
                "you can have it! Search for it!\"",
                "-Gold Roger",
            ],

        },

        {
            x: 69, y: 39,
            title: "Where could it be?",
            text: [
                "Did you find the treasure room?",
                "No...? It's ok, diamonds are temporary.",
                "You are free to sever the chains of fate that bind you.",
                "Maybe you'll find it one day when slimes fly!"
            ],

        },

        {
            x: 41.5, y: 23,
            title: "Can you make it here?",
            text: [
                "Wow, your brain is simply too big.",
                "The treasure is yours.",
                "You earned it :D",
                "",
                "-David and Ken"
            ],

        },

        // {
        //     x: 66.5, y: 2,
        //     title: "41:9",
        //     text: [
        //         "4576656E206D7920636C6F736573742066726965",
        //         "6E642077686F6D204920747275737465642C2074",
        //         "6865206F6E652077686F20617465206D79206272",
        //         "6561642C20686173206C69667465642068697320",
        //         "6865656C20616761696E7374206D652E - 5073616C6D732034313A39",
        //     ],

        // },

        {

            x: 66.5, y: 2,
            title: "      41:9",
            text: [
                "Even my closest friend whom I trusted,",
                "the one who ate my bread,",
                "has lifted his heel against me.",
                "-Psalms 41:9"
            ],

        },

        {
            x: 62, y: 42,
            title: "  Hear ye hear ye",
            text: ["Vasts amount of opportunities are open before you,",
                "but let not your heart corrupt lest you lose your freedom,",
                "for the pits of hell shall surely open and swallow the greedy,",
                "thus, seize the moment to go above and beyond",
                "and profit from the fools beneath you.",
            ],

        },
    ],

    secrets: [
        //main secret
        {
            indicate: true,
            bricks: [
                { x: 5, y: 50, width: 20, height: 1 }, //hide top path
                { x: 23, y: 49, width: 2, height: 1 }, //hide path entrance
                { x: 1, y: 50, width: 4, height: 38 }, //hide drop down
                { x: 75, y: 39, width: 4, height: 27 },
                { x: 1, y: 12, width: 28, height: 4 }, // undergrounds
                { x: 65, y: 39, width: 10, height: 2 },
                { x: 29, y: 12, width: 50, height: 12 },
                { x: 33, y: 4, width: 16, height: 4 },

            ]
        },

        //hide ceiling jump to treasure room
        {
            indicate: true,
            bricks: [
                { x: 47, y: 18, width: 1, height: 4 }, //hide top path
                { x: 47, y: 14, width: 16, height: 1 }, //hide path entrance
                { x: 62, y: 13, width: 1, height: 1 },

            ]
        },
    ],

    events: [
        {
            space: [
                { x: 56, y: 13, width: 2, height: 10 }
            ],
            bricks:
                [
                    { x: 51, y: 8, width: 5, height: 2, type: 2 },
                    { x: 76, y: 12, width: 5, height: 5, type: 2 },
                    { x: 75, y: 13, width: 5, height: 1, type: 2 },

                ],

            slimes: [
                { x: 62, y: 14, guard: true },
                { x: 62, y: 13, guard: true },
            ],
            goblins: [
                { x: 64, y: 3, guard: false },
                { x: 69, y: 3, guard: false },
            ],
            skeletons: [
                { x: 70, y: 7, guard: true },
                { x: 59, y: 7, guard: true },
            ],
            flyingeyes: [
                { x: 70, y: 12, guard: true },
                { x: 71, y: 10, guard: true },
            ],

        }
    ]
}
