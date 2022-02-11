/**This file holds helpful functions and global variables/objects used throughout the game */

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/** Global Parameters Objects */
const PARAMS = {
    DEBUG: false,      //for showing debug settings on canvas when ticked
    BLOCKDIM: 81,      //dimensions of blocks
    DMG_COOLDOWN: .5,  //how long the cooldown is for an entity to take damage,
    DEATHZONE: 200,    //deathzone = canvasH + DEATHZONE; (area below the canvas height)


    //GUI
    BIG_FONT: '20px "Press Start 2P"',       //font used for big moments like damage numbers
    DEFAULT_FONT: '10px "Press Start 2P"',    //regular font
    HEART_DIM: 17,                  //for hearts hp bar
    GUI_SCALE: 3,                   //gui scaling

    //critical
    CRITICAL_BONUS: 2,                  //multipler for a crit dmg
    CRITICAL_FONT: '30px "Press Start 2P"',
    CRITICAL_CHANCE: 10,                //percentage 0-100
    CRITICAL_COLOR: rgb(255, 215, 0),   //yellow

    //colors
    DMG_COLOR: rgb(183, 3, 3),      //red
    HEAL_COLOR: rgb(124, 252, 0),   //green

    //IDS for Score class
    DMG_ID: 0,
    HEAL_ID: 1,

    //HP RATIOS to compare with a percentage
    LOW_HP: .2,
    MID_HP: .5,
    HIGH_HP: .8,

    POTION_HEAL: 50,
};

/**Global stats that define an entity */
const STATS = {
    /*player stats*/
    PLAYER: {
        NAME: "Player (Knight)",
        MAX_HP: 100,
        SCALE: 3.12,
        WIDTH: 120,
        HEIGHT: 80,
        DMG_SLASH1: 10,
        DMG_SLASH2: 15,
        DMG_CROUCHATK: 7
    },

    ARROW: {
        NAME: "Arrow",
        MAX_HP: 10,
        WIDTH: 32,
        HEIGHT: 32,
        SCALE: 2,
        DAMAGE: 10
    },

    /*enemy stats*/

    MUSHROOM: {
        NAME: "Mushroom",
        MAX_HP: 100,
        SCALE: 3.5,
        WIDTH: 150,
        HEIGHT: 150,
        DAMAGE: 12.5
    },

    GOBLIN: {
        NAME: "Goblin",
        MAX_HP: 50,
        SCALE: 2.5,
        WIDTH: 33,
        HEIGHT: 36,
        DAMAGE: 8
    },

    SKELETON: {
        NAME: "Skeleton",
        MAX_HP: 50,
        SCALE: 2.5,
        WIDTH: 45,
        HEIGHT: 51,
        DAMAGE: 10
    },

    WIZARD: {
        NAME: "Wizard",
        MAX_HP: 80,
        SCALE: 3,
        WIDTH: 80,
        HEIGHT: 80,
        DAMAGE: 20
    },

    FLYINGEYE: {
        NAME: "Flying Eye",
        MAX_HP: 30,
        SCALE: 2,
        WIDTH: 150,
        HEIGHT: 150,
        DAMAGE: 5
    },

}

/* Global sfx paths */
const SFX = {
    ARROW_HIT: "./sound/sfx/arrow_hit.mp3",
    ARROW_STICK: "./sound/sfx/arrow_stick.wav",
    BOW_SHOT: "./sound/sfx/bow_shoot.mp3",
    CLICK: "./sound/sfx/click.wav",
    ITEM_PICKUP: "./sound/sfx/item_pickup.mp3",
    SLASH1: "./sound/sfx/slash1.wav",
    SLASH2: "./sound/sfx/slash2.wav",
    JUMP: "./sound/sfx/jump.wav",
    JUMP2: "./sound/sfx/jump2.wav",
    DOUBLEJUMP: "./sound/sfx/double_jump.wav",
    WALLJUMP: "./sound/sfx/walljump.wav",
    CRITICAL: "./sound/sfx/critical.wav",
    DODGE: "./sound/sfx/dodge.wav",
    DAMAGED: "./sound/sfx/hit.mp3",
    HEAL: "./sound/sfx/heal.mp3",
    DRINK: "./sound/sfx/potion_drink.mp3",
    HEARTBEAT: "./sound/sfx/heartbeat.mp3",
    PLAYER_DEATH: "./sound/sfx/player_death.mp3",
    PLAYER_GRUNT: "./sound/sfx/player_grunt.wav",
    PLAYER_GRUNT2: "./sound/sfx/player_grunt2.wav",
    PLAYER_GRUNT3: "./sound/sfx/player_grunt3.wav",
    SHIELD_BLOCK: "./sound/sfx/shield_block.mp3",
    DOOR_ENTER: "./sound/sfx/door_enter.wav",


};

/** Global music paths */
const MUSIC = {
    CHASING_DAYBREAK: "./sound/music/FE3H_Chasing_Daybreak.mp3",
    FODLAN_WINDS: "./sound/music/FE3H_Fodlan_Winds.mp3",
    BETWEEN_HEAVEN_AND_EARTH: "./sound/music/FE3H_Between_Heaven_And_Earth.mp3",

}

/** HELPER FUNCTIONS */

function getFacing(velocity) {
    if (velocity.x === 0 && velocity.y === 0) return 4;
    let angle = Math.atan2(velocity.y, velocity.x) / Math.PI;

    if (-0.625 < angle && angle < -0.375) return 0;
    if (-0.375 < angle && angle < -0.125) return 1;
    if (-0.125 < angle && angle < 0.125) return 2;
    if (0.125 < angle && angle < 0.375) return 3;
    if (0.375 < angle && angle < 0.625) return 4;
    if (0.625 < angle && angle < 0.875) return 5;
    if (-0.875 > angle || angle > 0.875) return 6;
    if (-0.875 < angle && angle < -0.625) return 7;
};

//distance formula between two points (x, y)
function distance(A, B) {
    return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
};

/** Easy access to math functions */
const {
    pow, ceil, floor, round, log, log2: lg, max, min, random, sqrt, abs,
    PI, E, sin, cos, tan, asin, acos, atan, atan2,
} = Math

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}, ${l})`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};
