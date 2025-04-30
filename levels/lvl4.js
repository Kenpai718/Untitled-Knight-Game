const level1_4 = {
    ID: 4,
    label: "Level 4",
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
        { x: 3, y: 6, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level3, transition: false }, //starting door
        { x: 6, y: 26, killQuota: 8, exitLocation: DOOR_SPAWNS.enter_to_level5, transition: false }, //exit door
    ],
    npcs: [
        {
            x: 5, y: 4, text: ["This castle could use some remodeling",
                "...and stairs."]
        },
        { x: 67, y: 35, text: ["I sense danger ahead..."] },
        { x: 30, y: 35, text: ["Yeowch! Hot!!"] },
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

        { x: 70, y: 43, width: 1, height: 5, type: 2 }, //right most obelisk wall

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
        { x: 71, y: 40, width: 2, height: 2 },

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
