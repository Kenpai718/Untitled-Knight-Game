/** Global Parameters Object */
/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
 const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

const PARAMS = {
        DEBUG : false, //for showing debug settings
        BLOCKDIM : 81, //dimensions of blocks
        DMG_COOLDOWN : .8, //how long the cooldown is for an entity to take damage
        BIG_FONT : "30px Impact", //font used for big moments like damage numbers
        DEFAULT_FONT : "10px Arial", //regular font
        HEART_DIM: 17, //for hearts hp bar
        GUI_SCALE: 3,
        CRITICAL_BONUS: 2,
        CRITICAL_FONT: "40px Impact",
        CRITICAL_CHANCE: 10, //percentage 0-100
        CRITICAL_COLOR: rgb(255, 215, 0),
        DMG_COLOR: rgb(183, 3, 3)


};

/* Global sfx path object */
const SFX =  {
    ARROW_HIT: "./sound/sfx/arrow_hit.mp3",
    BOW_SHOT: "./sound/sfx/bow_shoot.mp3",
    ITEM_PICKUP: "./sound/sfx/item_pickup.mp3",
    SLASH1: "./sound/sfx/slash1.wav",
    SLASH2: "./sound/sfx/slash2.wav",
    JUMP: "./sound/sfx/jump.wav",
    DOUBLEJUMP: "./sound/sfx/double_jump.wav",
    WALLJUMP: "./sound/sfx/walljump.wav",
    CRITICAL: "./sound/sfx/critical_hit.wav",
    DODGE: "./sound/sfx/dodge.wav",
    DAMAGED: "./sound/sfx/hit.mp3"

};

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
    return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y)*(B.y - A.y));
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
