const level1_5 = {
    ID: 5,
    label: "Level 5",
    width: 88, height: 80,
    player: { x: 1, y: 6 },
    music: MUSIC.VEILED_IN_BLACK,
    background: { type: 1 },

    backgroundWalls: [
        { x: 0, y: 20, width: 100, height: 21 },
        { x: 66, y: 63, width: 22, height: 45 },
        { x: 64, y: 46, width: 2, height: 2 },
        { x: 37, y: 46, width: 2, height: 2 },
        { x: 64 - 39, y: 46, width: 2, height: 2 },
        { x: 37 - 34, y: 46, width: 2, height: 2 },
        { x: 27, y: 58, width: 10, height: 14 },
        { x: 0, y: 51, width: 3, height: 3 },
        { x: 27, y: 37, width: 9, height: 3 },
    ],
    ground: [
        // 1:1
        { x: 0, y: 5, width: 10, height: 1, type: 1 },
        // 1:2
        { x: 22, y: 5, width: 31, height: 1, type: 1 },
        // 2:4
        { x: 73, y: 24, width: 8, height: 1, type: 1 },
        // 3:4
        { x: 71, y: 60, width: 14, height: 1, type: 1 },
        { x: 69, y: 54, width: 4, height: 1, type: 1 },
        // 3:1
        { x: 0, y: 48, width: 3, type: 0 },
    ],


    doors: [

        { x: 0, y: 51, killQuota: 15, exitLocation: DOOR_SPAWNS.enter_to_final, transition: false }, // exit door
        { x: 1, y: 8, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level4, transition: false }, // entry door

        //{ x: 31, y: 55, killQuota: 0, exitLocation: { x: 34, y: 37, levelNum: 6 }, transition: false }, // secret exit
        //{ x: 34, y: 37, killQuota: 0, exitLocation: { x: 100, y: 100, levelNum: 6 }, transition: false }, // secret enter
    ],

    bricks: [
        { x: -1, y: 59, width: 1, height: 60, type: 0 },
        // 1:1
        { x: 0, y: 4, width: 9, height: 5, type: 0 }, // Fill floor
        { x: 9, y: 0, width: 14, height: 1, type: 0 }, // spike floor
        { x: 0, y: 12, width: 8, height: 2, type: 0 }, //Roof
        { x: 0, y: 20, width: 22, height: 8, type: 0 }, //Roof Main
        { x: 0, y: 23, width: 80, height: 3, type: 0 }, //Roof Main
        { x: 8, y: 12, width: 2, height: 1, type: 0 }, //Roof M1
        // 1:2
        { x: 23, y: 8, width: 12, height: 1, type: 0 }, //Roof
        { x: 23, y: 11, width: 1, height: 1, type: 0 }, //Roof
        { x: 23, y: 4, width: 29, height: 5, type: 0 }, // Floor fill
        { x: 37, y: 16, width: 7, height: 9, type: 0 }, // Right
        { x: 39, y: 20, width: 5, height: 4, type: 0 }, // Right
        //{ x: 32, y: 11, width: 3, height: 3, type: 0 }, // mini cave bricks

        { x: 22, y: 17, width: 2, height: 4, type: 0 },
        { x: 28, y: 17, width: 1, height: 5, type: 0 },
        { x: 29, y: 16, width: 8, height: 2, type: 0 },
        // 1:3
        { x: 52, y: 1, width: 36, height: 2, type: 0 }, // spike floor
        { x: 44, y: 11, width: 9, height: 4, type: 0 }, // door floor
        { x: 50, y: 13, width: 3, height: 2, type: 0 },


        // 1:4
        { x: 66, y: 20, width: 14, height: 3, type: 0 }, // Roof fill
        { x: 66, y: 16, width: 5, height: 15, type: 0 }, // Wall fill
        { x: 71, y: 3, width: 17, height: 2, type: 0 }, // Floor
        { x: 77, y: 17, width: 3, height: 12, type: 0 }, // M wall fill
        // 2:4
        { x: 76, y: 40, width: 2, height: 13, type: 0 }, // left wall fill
        { x: 78, y: 38, width: 10, height: 11, type: 0 }, // right wall fill////////
        { x: 67, y: 43, width: 5, height: 13, type: 0 }, // right wall fill////////
        // 3:4
        { x: 66, y: 48, width: 18, height: 5, type: 0 }, // right wall fill
        { x: 67, y: 64, width: 21, height: 2, type: 0 }, // top
        { x: 79, y: 59, width: 5, height: 11, type: 0 }, // wall fill
        { x: 66, y: 66, width: 2, height: 2, type: 0 }, // top spikes
        { x: 71, y: 66, width: 2, height: 2, type: 0 },
        { x: 76, y: 66, width: 2, height: 2, type: 0 },
        { x: 81, y: 66, width: 2, height: 2, type: 0 },
        { x: 86, y: 66, width: 2, height: 2, type: 0 },

        { x: 72, y: 59, width: 7, height: 2, type: 0 }, // top floor fill
        { x: 67, y: 62, width: 1, height: 11, type: 0 }, // top outside fill
        // 3:3
        { x: 59, y: 48, width: 7, height: 2, type: 0 }, // bridge right
        { x: 60, y: 46, width: 2, height: 1, type: 0 },//
        { x: 62, y: 46, width: 2, height: 2, type: 0 },//
        { x: 63, y: 44, width: 1, height: 1, type: 0 },//
        { x: 64, y: 45, width: 1, height: 1, type: 0 },//
        { x: 64, y: 44, width: 2, height: 2, type: 0 },//
        { x: 65, y: 42, width: 1, height: 2, type: 0 },
        { x: 37, y: 48, width: 7, height: 2, type: 0 }, // bridge left
        { x: 41, y: 46, width: 2, height: 1, type: 0 },//
        { x: 39, y: 46, width: 2, height: 2, type: 0 },//
        { x: 39, y: 44, width: 1, height: 1, type: 0 },//
        { x: 38, y: 45, width: 1, height: 1, type: 0 },//
        { x: 37, y: 44, width: 2, height: 2, type: 0 },//
        { x: 37, y: 42, width: 1, height: 2, type: 0 },

        { x: 37, y: 30, width: 35, height: 7, type: 0 }, // Spike floor



        // 3:1
        { x: 59 - 39, y: 48, width: 7, height: 2, type: 0 }, // bridge right
        { x: 60 - 39, y: 46, width: 2, height: 1, type: 0 },//
        { x: 62 - 39, y: 46, width: 2, height: 2, type: 0 },//
        { x: 63 - 39, y: 44, width: 1, height: 1, type: 0 },//
        { x: 64 - 39, y: 45, width: 1, height: 1, type: 0 },//
        { x: 64 - 39, y: 44, width: 2, height: 2, type: 0 },//
        { x: 65 - 39, y: 42, width: 1, height: 2, type: 0 },
        { x: 37 - 34, y: 48, width: 7, height: 2, type: 0 }, // bridge left
        { x: 41 - 34, y: 46, width: 2, height: 1, type: 0 },//
        { x: 39 - 34, y: 46, width: 2, height: 2, type: 0 },//
        { x: 39 - 34, y: 44, width: 1, height: 1, type: 0 },//
        { x: 38 - 34, y: 45, width: 1, height: 1, type: 0 },//
        { x: 37 - 34, y: 44, width: 2, height: 2, type: 0 },//
        { x: 37 - 34, y: 42, width: 1, height: 2, type: 0 },

        // 3:2
        { x: 28, y: 54, width: 1, height: 4, type: 0 }, // Left Tops
        { x: 29, y: 52, width: 6, height: 2, type: 0 },
        { x: 35, y: 54, width: 1, height: 4, type: 0 },

        { x: 26, y: 56, width: 1, height: 2, type: 0 },
        { x: 37, y: 56, width: 1, height: 2, type: 0 },

        { x: 25, y: 58, width: 11, height: 2, type: 0 }, //Top
        { x: 37, y: 58, width: 2, height: 2, type: 0 },
        { x: 25, y: 59, width: 2, height: 1, type: 0 }, // Top spikes
        { x: 37, y: 59, width: 2, height: 1, type: 0 }, // Top spikes


        { x: 28, y: 40, width: 8, height: 3, type: 0 }, // Lower
        { x: 28, y: 34, width: 8, height: 4, type: 0 }, // Lower //////////////
        { x: 27, y: 30, width: 10, height: 7, type: 0 },

        // 3:1
        { x: 27, y: 48, width: 10, height: 8, type: 0 },
        { x: 2, y: 47, width: 1, height: 7, type: 0 }, // Behind wall
        { x: 0, y: 47, width: 2, height: 17, type: 0 },

        { x: 0, y: 59, width: 2, height: 8, type: 0 }, // top

        { x: 0, y: 30, width: 27, height: 7, type: 0 }, // Spike floor

    ],

    walls: [
        // 1:1
        { x: 9, y: 4, height: 4, type: 2 },
        // 1:2
        { x: 22, y: 4, height: 5, type: 2 }, // floor left
        { x: 22, y: 11, height: 4, type: 2 }, // Left
        { x: 27, y: 17, height: 5, type: 0 }, // mini cave
        { x: 24, y: 17, height: 7, type: 0 },
        { x: 33, y: 9, height: 1, type: 0 }, // mini cave bricks l
        { x: 34, y: 10, height: 2, type: 0 }, // mini cave bricks m
        { x: 35, y: 11, height: 4, type: 0 }, // mini cave bricks r

        // 1:3
        { x: 52, y: 4, height: 3, type: 0 }, // Left
        // 1:4
        { x: 65, y: 16, height: 15, type: 0 }, // Left
        { x: 65, y: 20, height: 3, type: 0 }, // Left
        { x: 71, y: 16, height: 13, type: 0 }, // Right
        { x: 76, y: 17, height: 12, type: 0 }, // M Left
        { x: 80, y: 23, height: 18, type: 0 }, // M Right
        { x: 87, y: 27, height: 24, type: 0 }, // R Right
        // 2:4
        { x: 72, y: 43, height: 20, type: 0 }, // Right
        { x: 75, y: 40, height: 13, type: 0 }, // Right
        { x: 66, y: 43, height: 13, type: 0 }, // Right
        // 3:4
        { x: 84, y: 59, height: 16, type: 0 }, // Right
        { x: 87, y: 63, height: 25, type: 0 }, // Right
        { x: 66, y: 64, height: 13, type: 0 }, // outside
        { x: 71, y: 59, height: 2, type: 0 },
        { x: 68, y: 62, height: 11, type: 0 }, // top floor fill

        // 3:2
        { x: 27, y: 54, height: 4, type: 0 }, // lower tops
        { x: 36, y: 54, height: 4, type: 0 },

        { x: 25, y: 56, height: 2, type: 0 },
        { x: 38, y: 56, height: 2, type: 0 },

        { x: 37, y: 54, height: 1, type: 0 },
        { x: 26, y: 54, height: 1, type: 0 },

        { x: 36, y: 40, height: 10, type: 0 }, ///////////////
        { x: 27, y: 40, height: 3, type: 0 },
        { x: 27, y: 35, height: 5, type: 0 },

        // 3:1
        { x: 2, y: 59, height: 9, type: 0 }, // top
        { x: 2, y: 40, height: 10, type: 0 }, //lower

        //elevator of death edges
        { x: 81, y: 7, width: 1, height: 1, type: 2 },
        { x: 86, y: 7, width: 1, height: 1, type: 2 },
        { x: 81, y: 11, width: 1, height: 1, type: 2 },
        { x: 86, y: 11, width: 1, height: 1, type: 2 },
        { x: 81, y: 15, width: 1, height: 1, type: 2 },
        { x: 86, y: 15, width: 1, height: 1, type: 2 },
        { x: 81, y: 19, width: 1, height: 1, type: 2 },
        { x: 86, y: 19, width: 1, height: 1, type: 2 },
        { x: 81, y: 23, width: 1, height: 1, type: 2 },
        { x: 86, y: 23, width: 1, height: 1, type: 2 },




    ],
    obelisks: [
        { x: 22, y: 12, brickX: 22, brickY: 7, brickWidth: 2, brickHeight: 2, initial: true, repeat: true },
        { x: 22, y: 12, brickX: 24, brickY: 17, brickWidth: 4, brickHeight: 5, initial: false, repeat: true },
        { x: 22, y: 12, brickX: 10, brickY: 5, brickWidth: 12, brickHeight: 1, initial: false, repeat: true },

        { x: 70, y: 49, brickX: 66, brickY: 51, brickWidth: 3, brickHeight: 3, initial: true, repeat: true },
        { x: 70, y: 49, brickX: 44, brickY: 48, brickWidth: 15, brickHeight: 2, initial: true, repeat: true },

        { x: 34, y: 35, brickX: 20, brickY: 39, brickWidth: 2, brickHeight: 2, initial: false, repeat: false },
        { x: 34, y: 35, brickX: 16, brickY: 43, brickWidth: 2, brickHeight: 2, initial: false, repeat: false },
        { x: 34, y: 35, brickX: 21, brickY: 53, brickWidth: 2, brickHeight: 1, initial: false, repeat: false },
        { x: 34, y: 35, brickX: 22, brickY: 54, brickWidth: 2, brickHeight: 1, initial: false, repeat: false },
    ],

    trap: [
        { x: 10, y: 48, width: 10, height: 2, type: 3, percent: 0.9, rate: 200 }
    ],

    spikes: [
        // 1:1
        { x: 10, y: 1, width: 12 },
        // 1:3
        { x: 53, y: 2, width: 12 },
        // 3:3
        { x: 37, y: 31, width: 29, type: 0 },
        // 3:1
        { x: 3, y: 31, width: 29, type: 0 },
    ],

    platforms: [
        //{ x: 75, y: 52, width: 2, height: 1 },
        //{ x: 58, y: 10, width: 4, height: 1 },
    ],
    moveable: [
        { x: 58, y: 4, width: 4, height: 1, directionList: ["up"], distanceList: [10], velocity: 3 },
        { x: 73, y: 49, width: 2, height: 1, directionList: ["up"], distanceList: [5], velocity: 1 },
        { x: 82, y: 3, width: 4, height: 1, directionList: ["up"], distanceList: [18], velocity: 1.4, onTouch: true }, //elevator of death
    ],

    chests: [
        { x: 4, y: 6, direction: 0 },
        { x: 18, y: 22, direction: 1},
        { x: 23, y: 9, direction: 1 },
        // 1:2
        { x: 29, y: 17, direction: 1 },
        { x: 37.5, y: 17, direction: 0 },
        // 3:2
        { x: 27, y: 55, direction: 1 },
        { x: 29, y: 53, direction: 1 },
        { x: 33.5, y: 53, direction: 0 },
        { x: 35.5, y: 55, direction: 0 },
        { x: 44, y: 12, direction: 1 },
    ],

    shrooms: [
        { x: 85, y: 40, guard: true },
        { x: 81, y: 40, guard: true },
        { x: 83, y: 40, guard: true },
    ],
    goblins: [
        { x: 26.3, y: 46, guard: true },
        { x: 3.3, y: 46, guard: true },

        { x: 13, y: 50, guard: true },
        { x: 14, y: 50, guard: true },
        { x: 12, y: 50, guard: true },

        //1:2
        { x: 26, y: 10, guard: false },
        { x: 28, y: 10, guard: false },
        { x: 30, y: 10, guard: false },

        //1:3
        { x: 45, y: 14, guard: true },
        { x: 48, y: 14, guard: true },
    ],
    skeletons: [
        { x: 23, y: 10, guard: true },
        { x: 60, y: 50, guard: false },
        { x: 41, y: 50, guard: true },
    ],
    flyingeyes: [
        { x: 15, y: 10, guard: true },
        { x: 19, y: 9, guard: false },
        { x: 21, y: 6, guard: false },

        // 1:3
        { x: 55, y: 15, guard: true },
        { x: 62, y: 20, guard: false },
        // 1:4
        // { x: 84, y: 8, guard: false },
        // { x: 85, y: 15, guard: false },
        // { x: 86, y: 18, guard: false },
        // 3:3
        { x: 43, y: 52, guard: true },
        { x: 53, y: 53, guard: true },

        //3:1
        //bridge left
        { x: 4, y: 54, guard: true },
        { x: 9, y: 52, guard: true },
        { x: 15, y: 52, guard: true },
        { x: 19, y: 53, guard: true },
        { x: 24, y: 43, guard: true },
        { x: 11, y: 41, guard: true },

        //bridge right
        { x: 50, y: 54, guard: true },
        { x: 48, y: 52, guard: true },
    ],

    slimes: [
        // 1:2
        { x: 32, y: 18, guard: false },
        { x: 35, y: 18, guard: false },
        // 3:4
        { x: 70, y: 56, guard: true },
        { x: 77, y: 52, guard: false },

    ],

    npcs: [
        {
            x: 6, y: 7, text: [
                "Friend, we are almost at the finish line.",
                "I am more in need of the bread of your labor.",
            ]
        },

        {
            x: 77, y: 4, text: [
                "Why is the elevator always sick?",
                "It keeps coming down with something!",
                "hehehe~"
            ]
        },

        {
            x: 72, y: 54, text: [
                // "YES, At last! The Aether is fina.. err.. I mean dinner time.. ",
                // "I must leave soon.. lucifer has sent his biddings..",
                // "~ Give the goblins afar my falling regards ~",
                // "Doesn’t matter what you did,",
                // "or what you were.",
                // "If you go out there, you fight,",
                // "and you fight to kill."
                "You know,",
                "I have come to realize that",
                "elevator jokes aren't always that funny.",
                "After all they always have their,",
                "ups and downs.",
                "~hehehe"
            ]
        },
    ],

    /*
        Friend, come.
        I am more in need of the bread of your labor.
        I must leave soon.. lucifer has sent his biddings..

        ~Give the goblins afar my regards~
    */


    torches: [
        { x: 4, y: 8 },
        // 1:2
        { x: 30, y: 19 },
        { x: 37, y: 19 },

        // 3:2
        { x: 30, y: 55 },
        { x: 33, y: 55 },

        // 1:2
        { x: 25, y: 7 },
        { x: 49, y: 7 },

        { x: 32, y: 7 },
        { x: 39, y: 7 },

        //1:4
        //evil torches that spawn events
        { x: 81, y: 6 },
        { x: 86, y: 6 },
        { x: 81, y: 10 }, //wave one
        { x: 86, y: 10 },
        { x: 81, y: 14 },
        { x: 86, y: 14 }, //wave two
        { x: 81, y: 18 },
        { x: 86, y: 18 },
        { x: 81, y: 22 }, //wave three
        { x: 86, y: 22 },

        { x: 74, y: 26 },
        { x: 85, y: 26 },

        // 2:4
        { x: 81, y: 41 },
        { x: 86, y: 41 },
        // 3:2
        { x: 30, y: 50 },
        { x: 33, y: 50 },
        // 3:4
        { x: 70, y: 51 },
        { x: 77, y: 51 },

    ],

    banners: [
        // 1:2
        { x: 43, y: 7 },
        { x: 45, y: 7 },
        // 3:4
        { x: 67, y: 51 },
    ],

    chains: [
        // 1:2
        { x: 28, y: 12 },
        // 2:4
        { x: 74, y: 43 },
        //{ x: 84, y: 43 },
        // 3:4
        { x: 72, y: 53 },
    ],

    ceilingChains: [
        // 1:2
        { x: 24, y: 10, height: 1 },
        // 1:3
        { x: 50, y: 20, height: 4 },
        { x: 51, y: 20, height: 5 },
        { x: 52, y: 20, height: 3 },
        // 1:4
        { x: 74, y: 17, height: 6 },
        { x: 76, y: 4, height: 1 },
        // 2:4
        { x: 73, y: 43, height: 9 },
        // 3:4
        { x: 69, y: 62, height: 3 },
        { x: 78, y: 57, height: 2 },

    ],

    supports: [
        // 1:2
        { x: 29, y: 14, width: 8 },
    ],

    columns: [
        // 1:1
        { x: 8, y: 11, height: 6 },
        { x: 9, y: 11, height: 6 },
        // 1:2
        { x: 22, y: 7, height: 2 },
        { x: 23, y: 7, height: 2 },

        { x: 34, y: 7, height: 2 },
        { x: 37, y: 7, height: 2 },
        //1:3
        { x: 51, y: 7, height: 2 },
        { x: 52, y: 7, height: 2 },
        // 2:4
        { x: 83, y: 43, height: 5 },
        { x: 84, y: 43, height: 5 },
        // 3:2
        { x: 27, y: 50, height: 2 },
        { x: 28, y: 50, height: 2 },
        { x: 35, y: 50, height: 2 },
        { x: 36, y: 50, height: 2 },
    ],

    windows: [
        // 1:2
        { x: 22, y: 20, width: 3, height: 3 },
        // 1:3
        { x: 45, y: 16, width: 4, height: 5 },
        // 2:4
        //{ x: 83, y: 41, width: 3, height: 3 },
    ],

    signs: [
        {
            x: 62, y: 50, title: "    Hey listen.", text: ["There's no turning back from this point.",
                "Have you done everything you needed to?"]
        }
    ],


    secrets: [
        {
            indicate: true,
            bricks: [
                { x: 27, y: 37, width: 9, height: 2 },
                { x: 28, y: 35, width: 8, height: 1 },
            ]
        }
    ],


    events: [
        //elevator of death
        //wave 1
        {
            space: [
                { x: 81, y: 10, width: 6, height: 1 }, //wave one
            ],
            bricks:
                [
                    //block path top
                    { x: 81, y: 24, width: 7, height: 2, type: 2 },
                    //{ x: 81, y: 6, width: 7, height: 1, type: 2 },
                    //block path left
                    { x: 76, y: 5, width: 1, height: 2, type: 2 },
                ],

            //fall from the skies
            goblins: [
                { x: 85, y: 15, guard: true },
                //{ x: 82, y: 15, guard: true },
            ],

        },

        //wave 2
        {
            space: [
                { x: 81, y: 14, width: 6, height: 1 }, //wave one
            ],
            bricks:
                [
                    { x: 81, y: 24, width: 7, height: 1, type: 2 },
                    //{ x: 81, y: 6, width: 7, height: 1, type: 2 },
                    //block path left
                    { x: 76, y: 5, width: 1, height: 2, type: 2 },

                ],

            //fall from the skies
            slimes: [
                { x: 83, y: 18, guard: true },
            ],
            skeletons: [
                //{ x: 82, y: 20, guard: true },
                { x: 84, y: 20, guard: true },
            ],

        },
        // wave 3
        {
            space: [
                { x: 81, y: 22, width: 6, height: 1 }, //wave one
            ],
            bricks:
                [
                    { x: 81, y: 24, width: 7, height: 1, type: 2 },
                    //{ x: 81, y: 6, width: 7, height: 1, type: 2 },
                    //block path left
                    { x: 76, y: 5, width: 1, height: 2, type: 2 },
                ],

            //fall from the skies
            flyingeyes: [
                { x: 85, y: 22, guard: true },
                { x: 80, y: 22, guard: true },
                { x: 82, y: 22, guard: true },
            ],

        },
    ]
}
