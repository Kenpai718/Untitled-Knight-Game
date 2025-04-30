const DEFAULT_FONT_SIZE = 10;
var PAUSED = false;         //if game is paused or not
var SHOP_ACTIVE = false;    //if shop menu is open or not
/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/** Global Parameters Objects */
const PARAMS = {
    //version for public releases
    VERSION_NUM: 1.4,
    UPDATE_DATE: "3/21/22",

    //game-control
    DEBUG: false,      //for showing debug settings on canvas when ticked,
    CURSOR: true,
    AUTO_FOCUS: false,
    BLOCKDIM: 81,      //dimensions of blocks
    DMG_COOLDOWN: .5,  //how long the cooldown is for an entity to take damage,
    SCALE: 10,          //dimensions used for minimap


    //GUI
    BIG_FONT: (DEFAULT_FONT_SIZE * 2) + 'px "Press Start 2P"',       //font used for big moments like damage numbers
    DEFAULT_FONT: DEFAULT_FONT_SIZE + 'px "Press Start 2P"',    //regular font
    HEART_DIM: 17,                  //for hearts hp bar
    GUI_SCALE: 3,                   //gui scaling

    //critical
    CRITICAL_BONUS: 2,                  //multipler for a crit dmg
    CRITICAL_FONT: (DEFAULT_FONT_SIZE * 3) + 'px "Press Start 2P"',
    CRITICAL_CHANCE: 10,                //percentage 0-100
    CRITICAL_COLOR: rgb(255, 215, 0),   //yellow

    //colors
    DMG_COLOR: rgb(183, 3, 3),      //red
    HEAL_COLOR: rgb(124, 252, 0),   //green
    DIAMOND_COLOR: rgb(185, 242, 255),   //diamond blue

    //IDS for Score class
    DMG_ID: 0,
    HEAL_ID: 1,
    DIAMOND_ID: 2,
    CHECKPOINT_ID: 3,

    //HP RATIOS to compare with a percentage
    LOW_HP: .2,
    MID_HP: .5,
    HIGH_HP: .8,

    //MISC
    POTION_HEAL: 50,
    DEATH_PITY: 3, //give the player some pity after dying more than this many times
};

/**Physics of the player
 * Inspired by Chris Marriott's Marriot Bros
 * A jump is about 3.5 blocks and with a double jump its about 4.5
 */
const PHYSIC_SCALER = 3; //scalar for some physics
const PLAYER_JUMP_HEIGHT = 1500; //players base jump height
const FALL_GRAVITY = 1.2; //gravity put on player's fall acc
const BASE_KNOCKBACK = 50;
const KNOCKBACK_BONUS_X = 1000;
const KNOCKBACK_BONUS_Y = 500;
const PLAYER_PHYSICS = {
    MAX_WALK: 95 * PHYSIC_SCALER,
    MAX_RUN: 200 * PHYSIC_SCALER,
    ACC_WALK: 205 * PHYSIC_SCALER,
    ACC_RUN: 300 * PHYSIC_SCALER,
    ROLL_SPD: 400 * PHYSIC_SCALER,
    SLIDE_SPD: 150 * PHYSIC_SCALER,
    SKID: 4500,
    ATTACK_SKID: 3000 * 0.75,
    CROUCH_SPD: 70 * PHYSIC_SCALER,
    DOUBLE_JUMP_X_BOOST: 5,
    JUMP_HEIGHT: PLAYER_JUMP_HEIGHT,
    DOUBLE_JUMP_HEIGHT: PLAYER_JUMP_HEIGHT * .5,
    MAX_FALL: 270 * PHYSIC_SCALER,
    ACC_FALL: PLAYER_JUMP_HEIGHT * FALL_GRAVITY,
    MAX_SLIDE: 150 * PHYSIC_SCALER,
    ACC_SLIDE: 750
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
        DMG_SLASH2: 20,
        DMG_CROUCHATK: 7,
        DMG_SLIDEATK: 5
    },

    SPIKE: {
        DMG: 2
    },

    ARROW: {
        NAME: "Arrow",
        MAX_HP: 10,
        WIDTH: 32,
        HEIGHT: 32,
        SCALE: 2,
        DAMAGE: 10
    },

    BLADE_BEAM: {
        NAME: "Blade Beam",
        MAX_HP: 10,
        WIDTH: 40,
        HEIGHT: 20,
        SCALE: 5,
        DAMAGE: 15
    },

    /*enemy stats*/

    MUSHROOM: {
        NAME: "Mushroom",
        MAX_HP: 100,
        SCALE: 3.5,
        WIDTH: 150,
        HEIGHT: 150,
        DAMAGE: 12.5,
        PHYSICS: {MAX_RUN: PLAYER_PHYSICS.MAX_RUN - 50, MAX_FALL: 810}
    },

    GOBLIN: {
        NAME: "Goblin",
        MAX_HP: 50,
        SCALE: 2.5,
        WIDTH: 33,
        HEIGHT: 36,
        DAMAGE: 8,
        PHYSICS: {MAX_RUN: PLAYER_PHYSICS.MAX_RUN - 5, MAX_FALL: 500}
    },

    SKELETON: {
        NAME: "Skeleton",
        MAX_HP: 50,
        SCALE: 2.5,
        WIDTH: 45,
        HEIGHT: 51,
        DAMAGE: 10,
        PHYSICS: {MAX_RUN: PLAYER_PHYSICS.MAX_RUN - 40, MAX_FALL: 600}
    },

    WIZARD: {
        NAME: "Wizard",
        MAX_HP: 1000,
        SCALE: 3,
        WIDTH: 10,
        HEIGHT: 60,
        DAMAGE: 20,
        PHYSICS: {MAX_RUN: PLAYER_PHYSICS.MAX_RUN - 10, MAX_FALL: 400}

    },

    FLYINGEYE: {
        NAME: "Flying Eye",
        MAX_HP: 30,
        SCALE: 2.5,
        WIDTH: 22,
        HEIGHT: 25,
        DAMAGE: 5,
        PHYSICS: {MAX_RUN: PLAYER_PHYSICS.MAX_RUN - 10, MAX_FALL: 200}
    },

    EYE_PROJECTILE: {
        NAME: "Flying Eye Projectile",
        MAX_HP: 10,
        WIDTH: 16,
        HEIGHT: 16,
        SCALE: 2.5,
        DAMAGE: 2.5
    },

    DEMON_SLIME: {
        NAME: "Demon Slime",
        MAX_HP: 200,
        WIDTH: 288,
        HEIGHT: 160,
        DAMAGE: 0,
        PROJECTILE: 7.5,
        SCALE: 3,
        PHYSICS: {MAX_RUN: (PLAYER_PHYSICS.MAX_RUN - 60) * 3, MAX_FALL: 500}
    },

    SLIME: {
        NAME: "Slime",
        MAX_HP: 30,
        WIDTH: 82,
        HEIGHT: 82,
        DAMAGE: 0,
        SCALE: 3,
        PROJECTILE: 5,
        PHYSICS: {MAX_RUN: (PLAYER_PHYSICS.MAX_RUN - 60) * 3, MAX_FALL: 500}
    },

}
