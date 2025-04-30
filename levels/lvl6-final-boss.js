const levelBoss1 = {
    ID: 100,
    label: "The Final Room",
    width: 120, height: 20,
    player: {x: 3, y: 1},
    music: MUSIC.COUNTERATTACK,

    npcs: [
        {
            x: 14, y: 1, text: [
                "The Demon Lord is right ahead!",
                "You should prepare yourself...",
                "Good luck, hero."]
        },
    ],

    portal: {x: 115, y: 4},

    chests: [
        {x: 7, y: 1, direction: 0},
        {x: 9, y: 1, direction: 0},
        {x: 11, y: 1, direction: 0},
    ],

    events: [
        {
            space: [
                {x: 62, y: 20, width: 39, height: 20}
            ],
            walls: [
                {x: 60, y: 5, height: 5, type: 2},
                {x: 102, y: 5, height: 5, type: 0},
                {x: 103, y: 5, height: 5, type: 2},
                {x: 59, y: 5, height: 5, type: 0},
            ],
            wizard: {x: 75, y: 2, left: 61, right: 102, top: 6, bottom: 1},
        }
    ],

    doors: [
        {x: 1, y: 3, killQuota: 0, exitLocation: DOOR_SPAWNS.exit_to_level5, transition: false}, //door to level 1
    ],

    signs: [
        {
            x: 112, y: 2, title: "    The End", text: [
                "Hero, this is the end of the game.",
                "Your job here is finally done.",
                "Enter this portal with [W] and return to your homeworld!",
                "",
                "P.S: Did you know there are 3 different endings?",
                "     Can you find them all?",
                "     Hint: They are based on your purchases/upgrades :)"]
        },
    ],

    ground: [
        {x: 0, y: 0, width: 120, height: 1, type: 1},
    ],
    bricks: [
        {x: 0, y: 20, width: 60, height: 15},
        {x: 103, y: 20, width: 20, height: 15},
    ],
    walls: [
        {x: 60, y: 20, height: 15, type: 2},
        {x: 102, y: 20, height: 15, type: 0},
    ],
    torches: [
        {x: 0, y: 3},
        {x: 3, y: 3},
        {x: 9, y: 3},
        {x: 15, y: 3},
        {x: 21, y: 3},
        {x: 27, y: 3},
        {x: 33, y: 3},
        {x: 39, y: 3},
        {x: 45, y: 3},
        {x: 51, y: 3},
        {x: 57, y: 3},

        {x: 66, y: 9},
        {x: 72, y: 9},
        {x: 78, y: 9},
        {x: 84, y: 9},
        {x: 90, y: 9},
        {x: 96, y: 9},

        {x: 114, y: 4},
        {x: 118, y: 4},
    ],
    backgroundWalls: [
        {x: 0, y: 20, width: 120, height: 20},
    ],
    columns: [
        {x: 6, y: 4, width: 1, height: 4},
        {x: 12, y: 4, width: 1, height: 4},
        {x: 18, y: 4, width: 1, height: 4},
        {x: 24, y: 4, width: 1, height: 4},
        {x: 30, y: 4, width: 1, height: 4},
        {x: 36, y: 4, width: 1, height: 4},
        {x: 42, y: 4, width: 1, height: 4},
        {x: 48, y: 4, width: 1, height: 4},
        {x: 54, y: 4, width: 1, height: 4},
        {x: 60, y: 4, width: 1, height: 4},

        {x: 61, y: 20, width: 1, height: 20},
        {x: 65, y: 20, width: 1, height: 20},
        {x: 67, y: 20, width: 1, height: 20},
        {x: 71, y: 20, width: 1, height: 20},
        {x: 73, y: 20, width: 1, height: 20},
        {x: 77, y: 20, width: 1, height: 20},
        {x: 79, y: 20, width: 1, height: 20},
        {x: 83, y: 20, width: 1, height: 20},
        {x: 85, y: 20, width: 1, height: 20},
        {x: 89, y: 20, width: 1, height: 20},
        {x: 91, y: 20, width: 1, height: 20},
        {x: 95, y: 20, width: 1, height: 20},
        {x: 97, y: 20, width: 1, height: 20},
        {x: 101, y: 20, width: 1, height: 20},
    ],
    supports: [
        {x: 0, y: 5, width: 61, height: 1},
    ],
    windows: [
        {x: 62, y: 12, width: 3, height: 10},
        {x: 68, y: 12, width: 3, height: 10},
        {x: 74, y: 12, width: 3, height: 10},
        {x: 80, y: 12, width: 3, height: 10},
        {x: 86, y: 12, width: 3, height: 10},
        {x: 92, y: 12, width: 3, height: 10},
        {x: 98, y: 12, width: 3, height: 10},
    ],
    banners: [
        {x: 66, y: 8},
        {x: 72, y: 8},
        {x: 78, y: 8},
        {x: 84, y: 8},
        {x: 90, y: 8},
        {x: 96, y: 8},

        //end room
        {x: 114, y: 3},
        {x: 118, y: 3}
    ],

};
