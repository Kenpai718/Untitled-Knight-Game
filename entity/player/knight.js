//constants used for physics
const SCALER = 3;
//currently using Chris Marriot's mario physics
const MIN_WALK = 4.453125 * SCALER;
const MAX_WALK = 93.75 * SCALER;
const MAX_RUN = 153.75 * SCALER;
const ACC_WALK = 133.59375 * SCALER;
const ACC_RUN = 200.390625 * SCALER;
const DEC_REL = 182.8125 * SCALER;
const DEC_SKID = 365.625 * SCALER;
const MIN_SKID = 33.75 * SCALER;
const ROLL_SPD = 400 * SCALER;
const ATTACK_SKID = 10;
const CROUCH_SPD = 50 * SCALER;
const DOUBLE_JUMP_X_BOOST = 10;
const STOP_FALL = 1575;
const WALK_FALL = 1800;
const RUN_FALL = 2025;
const STOP_FALL_A = 450;
const WALK_FALL_A = 421.875;
const RUN_FALL_A = 562.5;
const JUMP_HEIGHT = 1500;
const DOUBLE_JUMP_HEIGHT = 650;
const MAX_FALL = 270 * SCALER;
const MAX_SLIDE = 150 * SCALER;

class Knight extends AbstractPlayer {
    //game = engine, (x, y) = spawn cords
    constructor(game, x, y) {
        super(game, x, y, STATS.PLAYER.NAME,  STATS.PLAYER.MAX_HP,  STATS.PLAYER.WIDTH,  STATS.PLAYER.HEIGHT,  STATS.PLAYER.SCALE);

        // get spritesheets
        this.spritesheetRight = ASSET_MANAGER.getAsset("./sprites/knight/knightRight.png");
        this.spritesheetLeft = ASSET_MANAGER.getAsset("./sprites/knight/knightLeft.png");

        //setup variable mapping for the states. Labeled for ease of use
        this.dir = { left: 0, right: 1 }; //directions
        this.states = {
            idle: 0, run: 1,
            crouch: 2, crouch_walk: 3, crouch_atk: 4,
            roll: 5, wall_climb: 6, wall_hang: 7, wall_slide: 8,
            jump: 9, jump_to_fall: 10, falling: 11,
            turn_around: 12, slide: 13,
            attack1: 14, attack2: 15,
            death: 16
        };

        //default starting values
        this.DEFAULT_DIRECTION = this.dir.right;
        this.DEFAULT_ACTION = this.states.idle;

        //states of the animation
        this.facing = this.DEFAULT_DIRECTION; //0 = left, 1 = right
        this.action = this.DEFAULT_ACTION; //see this.states for options

        //in game variables to keep track state of the MC
        //boolean to check whenever knight is doing a combo or not
        this.combo = false;
        this.inAir = false;
        this.doubleJump = true;
        this.flickerFlag = false;
        //these two audio variables control which sound effect is playing during the attack combo
        this.playAttackSFX1 = true;
        this.playAttackSFX2 = true;

        // bounding box (hitbox) used for attacks
        this.HB = null;
        this.offsetxBB = 0;
        this.offsetyBB = 0;

        //physics
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 1500;
        this.slideAcc = 750;
        this.collisions = {
            lo_left: false, hi_left: false, lo_right: false, hi_right: false,
            ceil: false, ceil_left: false, ceil_right: false,
            floor: false, floor_left: false, floor_right: false
        };
        this.diffy = { hi: 0, lo: 0 };

        //animations
        this.animations = [];
        this.loadAnimations();
        this.updateBB();
    };

    /** Update methods */

    updateHB() {
        this.getOffsets();
        this.lastHB = this.HB;
        this.HB = new BoundingBox(this.x + this.offsetxHB, this.y + this.offsetyHB, this.widthHB, this.heightHB);
    };

    updateBB() {
        this.getOffsets();
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + this.offsetxBB, this.y + this.offsetyBB, this.widthBB, this.heightBB);
    };

    //**Controls player animations and movement */
    update() {
        const TICK = this.game.clockTick;
        //to prevent playing the same roll sound
        if (this.action != this.states.roll) super.checkDamageCooldown(TICK); //check if can be hit
        super.checkInDeathZone(); //check if outside of canvas


        //NOTE: this.dead is set when the knight hp drops to 0.
        if (this.dead) {
            this.action = this.states.death;
            if (this.animations[this.facing][this.action].isDone()) {
                super.restartGame();
            }
        } else {
            /**CONTROLS:
             * CheckAndDo..() checks user input and executs that action is possible
            */
            this.checkAndDoMovement(TICK);
            this.checkAndDoAttack();
            this.checkAndDoHeal();
            //NOTE: Roll should be the last option checked because user should be able to cancel actions into roll
            this.checkAndDoRoll();

            if (this.action == this.states.wall_hang) {
                if (this.game.up) {
                    this.action = this.states.wall_climb;
                    this.y -= 3 * this.scale;
                    if (this.animations[this.facing][this.action].isDone()) {
                        this.resetAnimationTimers(this.action);
                    }
                }
                else if (this.game.down) {
                    this.action = this.states.wall_slide;
                    this.facing = this.facing == this.dir.right ? this.dir.left : this.dir.right;
                }
            }
            if (this.action == this.states.wall_climb) {
                if (this.animations[this.facing][this.action].currentFrame() < 4)
                    this.velocity.y = -250;
                else if (this.animations[this.facing][this.action].currentFrame() == 4)
                    this.velocity.y = -125;
            }

            /**SET THE VELOCITY OF THE PLAYER */
            //constant falling velocity
            switch (this.action) {
                case this.states.wall_slide:
                    this.velocity.y += this.slideAcc * TICK;
                    break;
                case this.action == this.states.wall_climb:
                    if (this.animations[this.facing][this.action].currentFrame() >= 3)
                        this.velocity.y += this.fallAcc * TICK;
                    break;
                case this.states.wall_hang:
                    this.velocity.y = 0;
                    break;
                default:
                    this.velocity.y += this.fallAcc * TICK;
                    break;
            }
            
            // max y velocity
            if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
            if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;
            if (this.action == this.states.wall_slide) {
                if (this.velocity.y >= MAX_SLIDE) this.velocity.y = MAX_SLIDE;
            }

            //max x velocity
            let doubleJumpBonus = 0;
            if (!this.doubleJump) doubleJumpBonus = DOUBLE_JUMP_X_BOOST;
            if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN + doubleJumpBonus;
            if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN - doubleJumpBonus;
            if (this.action == this.states.crouch_walk) {
                if (this.velocity.x >= CROUCH_SPD) this.velocity.x = CROUCH_SPD;
                if (this.velocity.x <= -CROUCH_SPD) this.velocity.x = -CROUCH_SPD;
            }

            /**UPDATE POSITIONING AND BOUNDING BOX */
            this.x += this.velocity.x * TICK;
            if (this.action != this.states.wall_hang || this.action != this.states.wall_climb)
                this.y += this.velocity.y * TICK;
            this.updateBB();

            //set to falling state if needed
            if (!this.touchFloor() && (this.action < this.states.jump || this.action > this.states.falling) && this.action != this.states.attack1 && this.action != this.states.attack2) {
                if ((this.action != this.states.wall_slide && this.action != this.states.roll && this.action != this.states.wall_hang && this.action != this.states.wall_climb) ||
                    (this.action == this.states.wall_slide && !(this.collisions.lo_left || this.collisions.lo_right))) {
                    this.action = this.states.falling;
                    this.inAir = true;
                }
            }

            /**COLLISION HANDLING */
            this.handleCollisions(TICK);
        }

    }

    /**Draws player to the canvas */
    draw(ctx) {
        //flicker if the knight was damaged
        if (!this.vulnerable && !this.game.roll) {
            if (this.flickerFlag) {
                this.animations[this.facing][this.action].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            }
            this.flickerFlag = !this.flickerFlag;
        } else {
            this.animations[this.facing][this.action].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        }
        //this.viewAllAnimations(ctx);
        if (!this.dead) this.healthbar.draw(ctx);

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
            this.viewCollisionsBox(ctx);
        }
    };

    /**
     * Checks/Executes horizontal and vertical movement
     * @params TICK = this.game.clocktick
     */
    checkAndDoMovement(TICK) {

        //choose animation based on keyboard input
        //this if statement is to make sure special states are not interrupted
        let uninterruptibleAction = this.action == this.states.roll || this.game.attack || this.action == this.states.wall_climb ||
            (this.action == this.states.attack1 || this.action == this.states.attack2);
        if (!uninterruptibleAction) {
            if (this.action != this.states.jump && !this.inAir) { //not in the air
                //horizontal movement
                if (this.game.down || this.touchHole()) { //crouch
                    this.action = this.states.crouch;
                    //crouch left or right (move at half speed)
                    if (this.game.right && !this.game.attack) { //run right
                        this.facing = this.dir.right;
                        this.action = this.states.crouch_walk; //crouch walk
                        this.velocity.x += CROUCH_SPD;
                    } else if (this.game.left && !this.game.attack) { //run left
                        this.facing = this.dir.left;
                        this.action = this.states.crouch_walk; //crouch walk
                        this.velocity.x -= CROUCH_SPD;
                    }
                    else {
                        if (this.facing == this.dir.left) {
                            if (this.velocity.x < 0) {
                                this.velocity.x += 25;
                            }
                            else this.velocity.x = 0;
                        }
                        else if (this.facing == this.dir.right) {
                            if (this.velocity.x > 0) {
                                this.velocity.x -= 25;
                            }
                            else this.velocity.x = 0;
                        }
                    }
                } else if (this.game.right && !this.game.attack) { //run right
                    if (this.facing == this.dir.left && this.velocity.x < 0) {
                        this.action = this.states.turn_around;
                        this.velocity.x += 40;
                    }
                    else {
                        this.facing = this.dir.right;
                        this.action = this.states.run;
                        this.velocity.x += MAX_RUN;
                    }
                } else if (this.game.left && !this.game.attack) { //run left
                    if (this.facing == this.dir.right && this.velocity.x > 0) {
                        this.action = this.states.turn_around;
                        this.velocity.x -= 50;
                    }
                    else {
                        this.facing = this.dir.left;
                        this.action = this.states.run;
                        this.velocity.x -= MAX_RUN;
                    }
                } else { //idle
                    if (this.facing == this.dir.left) {
                        if (this.velocity.x < 0) {
                            this.velocity.x += 25;
                        }
                        else this.velocity.x = 0;
                    }
                    else if (this.facing == this.dir.right) {
                        if (this.velocity.x > 0) {
                            this.velocity.x -= 25;
                        }
                        else this.velocity.x = 0;
                    }
                    this.action = this.DEFAULT_ACTION;
                }
                //jump press
                if (this.game.jump && !this.action.jump && !this.touchCeiling()) {
                    ASSET_MANAGER.playAsset(SFX.JUMP);
                    this.action = this.states.jump; //jump (9-11)
                    //set jump distance
                    this.velocity.y -= JUMP_HEIGHT;
                    this.game.jump = false;
                    this.inAir = true;
                }
            } else { //in the air
                // horizontal physics
                if (this.action != this.states.wall_hang || this.action != this.states.wall_climb) {
                    if (this.game.right && !this.game.left) {
                        if (Math.abs(this.velocity.x) > MAX_WALK) {
                            this.velocity.x += ACC_RUN * TICK;
                        } else this.velocity.x += ACC_WALK * TICK;
                    } else if (this.game.left && !this.game.right) {
                        if (Math.abs(this.velocity.x) > MAX_WALK) {
                            this.velocity.x -= ACC_RUN * TICK;
                        } else this.velocity.x -= ACC_WALK * TICK;
                    }
                }

                if (this.inAir) {
                    // //logic to handle switching between jump animations
                    // if (this.animations[this.facing][this.states.falling].isDone()) { //done falling
                    //     //this.game.jump = false; //jump finished set to false
                    if (this.animations[this.facing][this.states.jump_to_fall].isDone()) { //falling in between finished transition to falling
                        //console.log("here fall");
                        this.action = this.states.falling; //set to falling until reach ground
                    } else if (this.animations[this.facing][this.states.jump].isDone()) { //jump finished transition to falling
                        this.action = this.states.jump_to_fall; //set to falling-in-between
                        //console.log("transition jump here");
                    }
                    
                    if (this.action == this.states.falling) {
                        if (this.action != this.states.wall_climb) {
                            if (this.diffy.hi > 0 * this.scale && this.diffy.hi <= 12 * this.scale) {
                                if ((this.collisions.lo_left || this.collisions.hi_left) && this.facing == this.dir.left ||
                                (this.collisions.lo_right || this.collisions.hi_right) && this.facing == this.dir.right) {
                                    this.action = this.states.wall_hang;
                                    this.y = this.y + this.diffy.hi - 8 * this.scale;
                                    this.velocity.x = 0;
                                }
                            }
                            else if (this.diffy.hi < 8) {
                                if (this.collisions.lo_left) {
                                    this.action = this.states.wall_slide;
                                    this.facing = this.dir.right;
                                }
                                else if (this.collisions.lo_right) {
                                    this.action = this.states.wall_slide;
                                    this.facing = this.dir.left;
                                }
                            }
                        }
                    }
                }

                if (this.game.jump) {
                    // do a wall jump if touching a wall
                    if (!this.touchFloor()) {
                        if (this.collisions.lo_left) {
                            ASSET_MANAGER.playAsset(SFX.WALLJUMP);
                            this.game.jump = false;
                            this.resetAnimationTimers(this.states.jump);
                            this.resetAnimationTimers(this.states.jump_to_fall);
                            if (this.action == this.states.wall_slide || this.action == this.states.wall_hang && this.game.left && this.facing == this.dir.right)
                                this.velocity.y -= JUMP_HEIGHT;
                            else
                                this.velocity.y -= DOUBLE_JUMP_HEIGHT * 2;
                            this.velocity.x += MAX_WALK;
                            this.facing = this.dir.right;
                            this.action = this.states.jump;
                        }
                        else if (this.collisions.lo_right) {
                            ASSET_MANAGER.playAsset(SFX.WALLJUMP);
                            this.game.jump = false;
                            this.resetAnimationTimers(this.states.jump);
                            this.resetAnimationTimers(this.states.jump_to_fall);
                            if (this.action == this.states.wall_slide || this.action == this.states.wall_hang && (this.game.left && this.facing == this.dir.right))
                                this.velocity.y -= JUMP_HEIGHT;
                            else
                                this.velocity.y -= DOUBLE_JUMP_HEIGHT * 2;
                            this.velocity.x -= MAX_WALK;
                            this.facing = this.dir.left;
                            this.action = this.states.jump;
                        }
                    }

                    //do a double jump if the player is in the air and hasn't double jumped while in air
                    if (this.doubleJump && this.inAir && this.action >= this.states.jump && this.action <= this.states.falling) {
                        ASSET_MANAGER.playAsset(SFX.DOUBLEJUMP);
                        this.doubleJump = false;
                        this.game.jump = false;
                        this.resetAnimationTimers(this.states.jump);
                        this.resetAnimationTimers(this.states.jump_to_fall);
                        if (this.action == this.states.jump) {
                            this.velocity.y -= DOUBLE_JUMP_HEIGHT;
                        }
                        else {
                            this.velocity.y = -JUMP_HEIGHT / 2;
                        }
                        this.action = this.states.jump;
                        if (this.facing == this.states.right) this.velocity += DOUBLE_JUMP_X_BOOST;
                        if (this.facing == this.states.left) this.velocity -= DOUBLE_JUMP_X_BOOST;
                    }
                }
            }
        } else { //player is in an uninteruptible action
            //if player was attacking slow down that momentum on the ground so there is a bit of a skid
            if (this.game.attack && !this.inAir) {
                if (this.velocity.x > 0) { //right momentum
                    this.velocity.x -= ATTACK_SKID;
                    if (this.velocity.x < 0) this.velocity.x = 0;
                } else { //left momentum
                    this.velocity.x += ATTACK_SKID;
                    if (this.velocity.x > 0) this.velocity.x = 0;
                }
            }
            if (this.action == this.states.wall_climb) {
                this.velocity.x = (this.facing == 1? 50 : -50) * this.scale;
                if (this.animations[this.facing][this.action].isDone()){
                    if (this.touchHole()) {
                        this.action = this.states.crouch;
                    }
                    else this.action = this.states.idle;
                }
            }
        }
    }

    /**
     * Checks and execute attack input
     */
    checkAndDoAttack() {
        //attack logic (melee/ranged)
        if (this.game.attack) {

            if (this.game.down || this.touchHole()) { //crouch attack
                this.action = this.states.crouch_atk;
            } else { //standing or jumping attack

                //set action based on combo counter.
                //If attack button was pressed more than once change action to the second attack after the animation is complete
                this.combo = (this.game.comboCounter > 1 && this.animations[this.facing][this.states.attack1].isDone()) ? true : false;
                this.action = (this.combo) ? this.states.attack2 : this.states.attack1; //if comboing switch to the second animation

                //play the second attack sound if the first sword swing is done
                if (this.action == this.states.attack2 && this.combo && !this.playAttackSFX1 && this.playAttackSFX2) {
                    this.playAttackSFX2 = false;
                    ASSET_MANAGER.playAsset(SFX.SLASH2)
                }
            }
            this.updateHB();

            //play
            if (this.playAttackSFX1) {
                this.playAttackSFX1 = false;
                if (this.action == this.states.attack1 || this.action == this.states.crouch_atk) ASSET_MANAGER.playAsset(SFX.SLASH1);
            }

            let done = this.animations[this.facing][this.action].isDone();
            //console.log(this.action + " " + this.game.comboCounter + " " + this.combo);

            if (done) {
                if (this.combo && this.action == this.states.attack1) { //continue combo after first attack
                    this.action = this.states.attack2;

                } else { //end attack
                    this.action = this.game.down || this.touchHole() ? this.states.crouch : this.DEFAULT_ACTION; //back to idle; added case for crouch attacks
                    this.HB = null;
                    this.game.attack = false; //stop attackin
                    // delete hitbox here
                }

                //to ensure the animation does not get stuck we reset the combo regardless
                this.resetCombo();

            }

        } else if (!this.game.attack && this.game.shoot) { //only shoot an arrow when not attacking

            if (this.myInventory.arrows > 0) {
                //try to position starting arrow at the waist of the knight
                const target = { x: this.game.mouse.x + this.game.camera.x, y: this.game.mouse.y + this.game.camera.y };
                this.game.addEntityToFront(new Arrow(this.game, this.x + this.offsetxBB, (this.y + this.height / 2) + 40, target));
                this.myInventory.arrows--;
                ASSET_MANAGER.playAsset(SFX.BOW_SHOT);

            }
            this.game.shoot = false;
            this.action = this.DEFAULT_ACTION;


        } else {
            //crouch attack
            this.resetAnimationTimers(this.states.crouch_atk);
            //slash 1 and 2
            this.resetAnimationTimers(this.states.attack1);
            this.resetAnimationTimers(this.states.attack2);

            //reset shooting animation
        }
    }

    /**
     * Checks and executes heal input
     */
    checkAndDoHeal() {
        if (this.game.heal) { //reset all attack animations
            if (this.myInventory.potions > 0) {
                super.healPotion();
            }
            this.game.heal = false;

        }
    }

    /**
     * Checks and executes roll input
     */
    checkAndDoRoll() {
        if (this.game.roll && !this.inAir) {
            //disable attack so the player isn't buffered into an attack during the roll
            this.game.attack = false;
            this.resetCombo();
            this.HB = null;

            //set roll behavior
            this.action = this.states.roll; //roll
            this.velocity.x += (this.facing == this.dir.left) ? -1 * (ROLL_SPD) : (ROLL_SPD); //movement speed boost
            if (this.vulnerable) {
                ASSET_MANAGER.playAsset(SFX.DODGE);
                this.vulnerable = false;
            }

            if (this.animations[this.facing][this.states.roll].isDone()) {
                this.action = this.states.idle;
                this.game.roll = false;
                this.vulnerable = true;
            }
        } else {
            //roll
            this.resetAnimationTimers(this.states.roll);
        }
    }

    /**
     * Handles collision detection of the player
     * and adjusts positions or actions if needed
     * @params this.game.clocktick
     */
    handleCollisions(TICK) {    
        //do collisions detection here
        this.collisions = {
            lo_left: false, hi_left: false, lo_right: false, hi_right: false,
            ceil: false, ceil_left: false, ceil_right: false,
            floor: false, floor_left: false, floor_right: false
        };
        let dist = { x: 0, y: 0 };
        this.diffy = { hi: 0, lo: 0 };
        let ent = {top_left: null, top: null, top_right: null};
        let high = 100000 * this.scale;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB) && (entity instanceof Ground || entity instanceof Walls || entity instanceof Platform || entity instanceof Brick)) {
                // defines which sides are collided
                const below = that.BB.top <= entity.BB.top && that.BB.bottom >= entity.BB.top;
                const above = that.BB.bottom >= entity.BB.bottom && that.BB.top <= entity.BB.bottom;
                const right = that.BB.right <= entity.BB.right && that.BB.right >= entity.BB.left;
                const left = that.BB.left >= entity.BB.left && that.BB.left <= entity.BB.right;
                const between = that.BB.top >= entity.BB.top && that.BB.bottom <= entity.BB.bottom;
                if (between || 
                    below && that.BB.top > entity.BB.top - 20 * that.scale ||
                    above && that.BB.bottom < entity.BB.bottom + 20 * that.scale) {
                    if (right) {
                        that.collisions.lo_right = true;
                        that.collisions.hi_right = true;
                        dist.x = entity.BB.left - that.BB.right;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                    else {
                        that.collisions.lo_left = true;
                        that.collisions.hi_left = true;
                        dist.x = entity.BB.right - that.BB.left;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                }
                if (below) { // checks if mainly bottom, left, or right collison
                    if (right && Math.abs(that.BB.right - entity.BB.left) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                        that.collisions.lo_right = true;
                        dist.x = entity.BB.left - that.BB.right;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                    else if (left && Math.abs(that.BB.left - entity.BB.right) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                        that.collisions.lo_left = true;
                        dist.x = entity.BB.right - that.BB.left;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                    else {
                        if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                            dist.y = entity.BB.top - that.BB.bottom;
                        if (that.BB.left <= entity.BB.left) {
                            that.collisions.floor_right = true;
                        }
                        else if (that.BB.right >= entity.BB.right) {
                            that.collisions.floor_left = true;
                        }
                        else {
                            that.collisions.floor = true;
                        }
                    }
                }
                else if (above) { // checks if mainly top, left, or right collison
                    if (right && Math.abs(that.BB.right - entity.BB.left) <= Math.abs(that.BB.top - entity.BB.bottom)) {
                        that.collisions.hi_right = true;
                        ent.top_right = entity;
                        dist.x = entity.BB.left - that.BB.right;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                    else if (left && Math.abs(that.BB.left - entity.BB.right) <= Math.abs(that.BB.top - entity.BB.bottom)) {
                        that.collisions.hi_left = true;
                        ent.top_left = entity;
                        dist.x = entity.BB.right - that.BB.left;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                    else {
                        if (Math.abs(entity.BB.bottom - that.BB.top && !that.collisions.floor) > Math.abs(dist.y))
                            dist.y = entity.BB.bottom - that.BB.top;
                        if (that.BB.left <= entity.BB.left) {
                            that.collisions.ceil_right = true;
                            ent.top_right = entity;
                        }
                        else if (that.BB.right >= entity.BB.right) {
                            that.collisions.ceil_left = true;
                            ent.top_left = entity;
                        }
                        else {
                            that.collisions.ceil = true;
                            ent.top = entity;
                        }
                    }
                }
            }
            else if (entity.BB && that.BB.collide(entity.BB)) {
                //player picks up arrow stuck on ground
                if (entity instanceof Arrow && entity.stuck) {
                    entity.removeFromWorld = true;
                    that.myInventory.arrows++;
                    ASSET_MANAGER.playAsset(SFX.ITEM_PICKUP);
                }
            }

            //interactions with enemy
            if (entity instanceof AbstractEnemy) {
                //attacked by an enemy
                if (entity.HB && that.BB.collide(entity.HB)) {
                    //console.log("knight hit by enemy");
                    that.takeDamage(entity.getDamageValue(), false);

                }

                //attacked an enemy
                if (that.HB != null && entity.BB && that.HB.collide(entity.BB)) {
                    //console.log("knight hit an enemy");
                    entity.takeDamage(that.getDamageValue(), that.critical);

                }

            }
        });

        this.diffy.hi = high - this.BB.top;
        console.log(this.diffy.hi);
        
        if (this.collisions.hi_right && ent.top_right && (this.collisions.ceil || this.collisions.ceil_left)) {
            if (ent.top && ent.top.BB.bottom == ent.top_right.BB.bottom ||
                ent.top_left && ent.top_left.BB.bottom == ent.top_right.BB.bottom) {
                this.collisions.hi_right = false;
                this.collisions.ceil = true;
                if (!this.collisions.lo_right);
                    dist.x = 0;
            }

        }
        else if (this.collisions.hi_left && ent.top_left && (this.collisions.ceil || this.collisions.ceil_right)) {
            if (ent.top && ent.top.BB.bottom == ent.top_left.BB.bottom ||
                ent.top_right && ent.top_left.BB.bottom == ent.top_right.BB.bottom) {
                this.collisions.hi_left = false;
                this.collisions.ceil = true;
                if (!this.collisions.lo_left);
                    dist.x = 0;
            }

        }

        // instances where there are collisions along vertical, but need ignoring
        // all cases are when there's no definitive ceiling or floor (top/bottom collision as part of a wall)
        if (!(this.touchFloor() || this.touchCeiling())) {
            dist.y = 0
        }
        // instances where there are collisons along horizontal, but need ignoring
        // currently only when there's a crawl space to allow auto-crawl
        if (this.touchFloor() && this.touchHole()) {
            dist.x = 0;
        }

        // update position as a result of collision
        this.x += dist.x;
        this.y += dist.y;
        this.updateBB();
        
        // bottom collision
        if (this.touchFloor()) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
                this.inAir = false;
                this.doubleJump = true;
                if (this.action == this.states.jump || this.action == this.states.jump_to_fall || this.action == this.states.fall) {
                    this.action = this.DEFAULT_ACTION;
                }
                this.resetAnimationTimers(this.states.jump);
                this.resetAnimationTimers(this.states.jump_to_fall);
                this.resetAnimationTimers(this.states.falling);


            }
        }

        // top collison
        if (this.touchCeiling()) {
            if (this.velocity.y < 0) {
                this.y -= that.velocity.y * TICK;
                this.velocity.y = 0;
            }
            this.updateBB();
        }

        // left collison
        if (this.collisions.hi_left || this.collisions.lo_left) {
            if (this.velocity.x < 0)
                this.velocity.x = 0;
        }

        // right collison
        if (this.collisions.hi_right || this.collisions.lo_right) {
            if (this.velocity.x > 0)
                this.velocity.x = 0;
        }

    }

    /**Collision helper methods */

    touchFloor() {
        return this.collisions.floor || (this.collisions.floor_right && this.collisions.floor_left) ||
            (this.collisions.floor_right && !this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.floor_left && !this.collisions.hi_left && !this.collisions.lo_left);
    }

    touchCeiling() {
        return this.collisions.ceil || (this.collisions.ceil_right && this.collisions.ceil_left) ||
            (this.collisions.ceil_right && !this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.ceil_left && !this.collisions.hi_left && !this.collisions.lo_left);
    }

    touchHole() {
        return this.collisions.ceil || this.collisions.ceil_right && !this.collisions.lo_right || this.collisions.ceil_left && !this.collisions.lo_left ||
            (this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.hi_left && !this.collisions.lo_left);
    }

    isCrouched() {
        return this.action == this.states.crouch || this.action == this.states.crouch_walk || this.action == this.states.crouch_atk;
    }

    //reset the animation timer in both direction
    resetAnimationTimers(action) {
        this.animations[0][action].elapsedTime = 0;
        this.animations[1][action].elapsedTime = 0;
    }

    /**Attack/Damage Logic helper methods */

    /** reset the combocounter for an attack
     *  call this whenever an attack is finished
     *  so attack variables are put to a default slate
     */
    resetCombo() {
        this.combo = false;
        this.game.comboCounter = 0;
        this.playAttackSFX1 = true;
        this.playAttackSFX2 = true;
    }

    //choose how much damage the knight should do based on what action it is doing
    getDamageValue() {
        let dmg = 0;
        if (this.action == this.states.attack1) {
            dmg = STATS.PLAYER.DMG_SLASH1;
        } else if (this.action == this.states.attack2) {
            dmg = STATS.PLAYER.DMG_SLASH2;
        } else if (this.action == this.states.crouch_atk) {
            dmg = STATS.PLAYER.DMG_CROUCHATK;
        }

        //critical bonus
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS;
        }
        return dmg;

    }

    setDamagedState() {
        //set state to damaged animation
    }

    /**Animations and bounding box logic */

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        ctx.strokeStyle = "Green";
        if (this.HB != null) ctx.strokeRect(this.HB.x - this.game.camera.x, this.HB.y - this.game.camera.y, this.HB.width, this.HB.height);
    }

    viewCollisionsBox(ctx) { // debug
        ctx.strokeStyle = "Gray";
        const x = 20;
        const y = 20+this.height - this.heightBB;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, this.widthBB, this.heightBB);
        const coll = this.collisions;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        if (coll.ceil) {
            ctx.moveTo(x, y);
            ctx.lineTo(x+this.widthBB, y);
        }
        if (coll.ceil_left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x+this.widthBB / 2, y);
        }
        if (coll.ceil_right) {
            ctx.moveTo(x+this.widthBB / 2, y);
            ctx.lineTo(x+this.widthBB, y);
        }
        if (coll.floor) {
            ctx.moveTo(x, y+this.heightBB);
            ctx.lineTo(x+this.widthBB, y+this.heightBB);
        }
        if (coll.floor_left) {
            ctx.moveTo(x, y+this.heightBB);
            ctx.lineTo(x+this.widthBB / 2, y+this.heightBB);
        }
        if (coll.floor_right) {
            ctx.moveTo(x+this.widthBB / 2, y+this.heightBB);
            ctx.lineTo(x+this.widthBB, y+this.heightBB);
        }
        if (coll.hi_left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this.heightBB/2);
        }
        if (coll.lo_left) {
            ctx.moveTo(x, y + this.heightBB/2);
            ctx.lineTo(x, y + this.heightBB);
        }
        if (coll.hi_right) {
            ctx.moveTo(x+this.widthBB, y);
            ctx.lineTo(x+this.widthBB, y + this.heightBB/2);
        }
        if (coll.lo_right) {
            ctx.moveTo(x+this.widthBB, y + this.heightBB/2);
            ctx.lineTo(x+this.widthBB, y + this.heightBB);
        }
        ctx.stroke();
    }


    loadAnimations() {
        let numDir = 2;
        let numStates = 17;
        for (var i = 0; i < numDir; i++) {
            this.animations.push([]);
            for (var j = 0; j < numStates; j++) {
                this.animations[i].push([]);
            }
        }

        //states: 1-10
        // idle = 0
        this.animations[0][this.states.idle] = new Animator(this.spritesheetLeft, 240, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][this.states.idle] = new Animator(this.spritesheetRight, 0, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run = 1
        this.animations[0][this.states.run] = new Animator(this.spritesheetLeft, 240, 880, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][this.states.run] = new Animator(this.spritesheetRight, 0, 880, 120, 80, 10, 0.1, 0, false, true, false);
        // crouch = 2
        this.animations[0][this.states.crouch] = new Animator(this.spritesheetLeft, 1200, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][this.states.crouch] = new Animator(this.spritesheetRight, 120, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch walk = 3
        this.animations[0][this.states.crouch_walk] = new Animator(this.spritesheetLeft, 480, 240, 120, 80, 8, 0.1, 0, true, true, false);
        this.animations[1][this.states.crouch_walk] = new Animator(this.spritesheetRight, 0, 240, 120, 80, 8, 0.1, 0, false, true, false);
        // crouch attack = 4
        this.animations[0][this.states.crouch_atk] = new Animator(this.spritesheetLeft, 960, 160, 120, 80, 4, 0.08, 0, true, false, false);
        this.animations[1][this.states.crouch_atk] = new Animator(this.spritesheetRight, 0, 160, 120, 80, 4, 0.08, 0, false, false, false);
        // roll = 5
        this.animations[0][this.states.roll] = new Animator(this.spritesheetLeft, 0, 800, 120, 80, 12, 0.083, 0, true, false, false);
        this.animations[1][this.states.roll] = new Animator(this.spritesheetRight, 0, 800, 120, 80, 12, 0.083, 0, false, false, false);
        // wall climb = 6
        this.animations[0][this.states.wall_climb] = new Animator(this.spritesheetLeft, 603, 1120, 120, 80, 7, 0.1, 0, true, false, false);
        this.animations[1][this.states.wall_climb] = new Animator(this.spritesheetRight, -3, 1120, 120, 80, 7, 0.1, 0, false, false, false);
        // wall hang = 7
        this.animations[0][this.states.wall_hang] = new Animator(this.spritesheetLeft, 1318, 1200, 120, 80, 1, 0.2, 0, true, true, false);
        this.animations[1][this.states.wall_hang] = new Animator(this.spritesheetRight, 2, 1200, 120, 80, 1, 0.2, 0, false, true, false);
        // wall slide
        this.animations[0][this.states.wall_slide] = new Animator(this.spritesheetLeft, 1076, 1280, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide] = new Animator(this.spritesheetRight, 4, 1280, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump = 9
        this.animations[0][this.states.jump] = new Animator(this.spritesheetLeft, 1080, 640, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump] = new Animator(this.spritesheetRight, 0, 640, 120, 80, 3, 0.1, 0, false, false, false);
        // jump/fall inbetween = 10
        this.animations[0][this.states.jump_to_fall] = new Animator(this.spritesheetLeft, 1200, 720, 120, 80, 2, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump_to_fall] = new Animator(this.spritesheetRight, 0, 720, 120, 80, 2, 0.1, 0, false, false, false);
        // fall = 11
        this.animations[0][this.states.falling] = new Animator(this.spritesheetLeft, 1080, 480, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.falling] = new Animator(this.spritesheetRight, 0, 480, 120, 80, 3, 0.1, 0, false, true, false);
        // turn around = 12
        this.animations[0][this.states.turn_around] = new Animator(this.spritesheetLeft, 1080, 1040, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.turn_around] = new Animator(this.spritesheetRight, 0, 1040, 120, 80, 3, 0.1, 0, false, false, false);
        // slide = 13
        this.animations[0][this.states.slide] = new Animator(this.spritesheetLeft, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][this.states.slide] = new Animator(this.spritesheetRight, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);

        //attack combo (on ground or in air)
        //Note: Slash 1 is a faster attack but less damage. Slash 2 is slower but more damage
        //slash 1 = 14
        this.animations[0][this.states.attack1] = new Animator(this.spritesheetLeft, 720, 0, 120, 80, 6, 0.09, 0, true, false, false);
        this.animations[1][this.states.attack1] = new Animator(this.spritesheetRight, 0, 0, 120, 80, 6, 0.09, 0, false, false, false);
        //slash 2 = 15
        this.animations[0][this.states.attack2] = new Animator(this.spritesheetLeft, 240, 0, 120, 80, 6, 0.1, 0, true, false, false);
        this.animations[1][this.states.attack2] = new Animator(this.spritesheetRight, 480, 0, 120, 80, 6, 0.1, 0, false, false, false);

        // death = 16 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death] = new Animator(this.spritesheetLeft, 360, 400, 120, 80, 9, 0.1, 0, true, false, false);
        this.animations[1][this.states.death] = new Animator(this.spritesheetRight, 0, 400, 120, 80, 9, 0.1, 0, false, false, false);
    };

    /**Offset the bounding box based on action state */
    getOffsets() {
        const frame = this.animations[this.facing][this.action].currentFrame();
        switch (this.action) {
            // idle, running and jumping BB offsets
            case this.states.idle:
            case this.states.run:
            case this.states.jump:
            case this.states.jump_to_fall:
            case this.states.falling:
            case this.states.wall_slide:
                this.offsetxBB = this.facing == 1 ? 44 * this.scale : 55 * this.scale;
                this.offsetyBB = 41 * this.scale;
                this.widthBB = 21 * this.scale;
                this.heightBB = 39 * this.scale;
                break;
            // wall hang BB offsets
            case this.states.wall_hang:
                this.offsetyBB = 41 * this.scale;
                this.heightBB = 35 * this.scale;
                break;
            // wall climb BB offsets
            case this.states.wall_climb:
                switch (frame) {
                    case 0:
                        this.offsetyBB = 48 * this.scale;
                        break;
                    case 2:
                        this.heightBB = 28 * this.scale;
                        break;
                    case 3:
                        this.heightBB = 28 * this.scale;
                        break;
                }
                break;
            // crouch and crouch walk BB offsets
            case this.states.crouch:
            case this.states.crouch_walk:
                this.offsetxBB = this.facing == 1 ? 44 * this.scale : 55 * this.scale;
                this.offsetyBB = 53 * this.scale;
                this.heightBB = 27 * this.scale;
                break;
            // roll BB offsets
            case this.states.roll:
                this.offsetxBB = this.facing == 1 ? 44 * this.scale : 35 * this.scale;
                this.offsetyBB = 53 * this.scale;
                this.heightBB = 27 * this.scale;
                this.widthBB = 42 * this.scale;
                break;
            // crouch attack HB offsets
            case this.states.crouch_atk:
                this.offsetxHB = 20 * this.scale;
                this.offsetyHB = 53 * this.scale;
                this.heightHB = 27 * this.scale;
                break;
            // attack combo HB offsets
            case this.states.attack1:
                if (frame > 0 && frame < 3) {
                    this.offsetyHB = 37 * this.scale;
                    this.offsetxHB = this.facing == 1 ? 38 * this.scale : 14 * this.scale;
                    this.widthHB = 68 * this.scale;
                    this.heightHB = 44 * this.scale;
                }
                else this.HB = null;
                break;
            case this.states.attack2:
                if (frame > 1 && frame <= 4) {
                    this.offsetyHB = 38 * this.scale;
                    this.widthHB = 79 * this.scale;
                    this.heightHB = 42 * this.scale;
                    if (frame > 2) {
                        this.widthHB = 62 * this.scale;
                    }
                    this.offsetxHB = this.facing == 1 ? 25 * this.scale : this.width - 25 * this.scale - this.widthHB;
                }
                else this.HB = null;
                break;
        }
    };

    viewAllAnimations(ctx) { //for development purposes
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, 0 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][0].drawFrame(this.game.clockTick, ctx, 0 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][1].drawFrame(this.game.clockTick, ctx, 120 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][1].drawFrame(this.game.clockTick, ctx, 120 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][2].drawFrame(this.game.clockTick, ctx, 240 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][2].drawFrame(this.game.clockTick, ctx, 240 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][3].drawFrame(this.game.clockTick, ctx, 360 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][3].drawFrame(this.game.clockTick, ctx, 360 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][4].drawFrame(this.game.clockTick, ctx, 480 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][4].drawFrame(this.game.clockTick, ctx, 480 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][5].drawFrame(this.game.clockTick, ctx, 600 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][5].drawFrame(this.game.clockTick, ctx, 600 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][6].drawFrame(this.game.clockTick, ctx, 720 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][6].drawFrame(this.game.clockTick, ctx, 720 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][7].drawFrame(this.game.clockTick, ctx, 840 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][7].drawFrame(this.game.clockTick, ctx, 840 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][8].drawFrame(this.game.clockTick, ctx, 0 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][8].drawFrame(this.game.clockTick, ctx, 0 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][9].drawFrame(this.game.clockTick, ctx, 120 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][9].drawFrame(this.game.clockTick, ctx, 120 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][10].drawFrame(this.game.clockTick, ctx, 240 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][10].drawFrame(this.game.clockTick, ctx, 240 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][11].drawFrame(this.game.clockTick, ctx, 360 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][11].drawFrame(this.game.clockTick, ctx, 360 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][12].drawFrame(this.game.clockTick, ctx, 480 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][12].drawFrame(this.game.clockTick, ctx, 480 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][13].drawFrame(this.game.clockTick, ctx, 600 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][13].drawFrame(this.game.clockTick, ctx, 600 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][14].drawFrame(this.game.clockTick, ctx, 720 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][14].drawFrame(this.game.clockTick, ctx, 720 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][15].drawFrame(this.game.clockTick, ctx, 840 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][15].drawFrame(this.game.clockTick, ctx, 840 * this.scale, 240 * this.scale, this.scale);

        this.animations[0][16].drawFrame(this.game.clockTick, ctx, 960 * this.scale, 160 * this.scale, this.scale);
        this.animations[1][16].drawFrame(this.game.clockTick, ctx, 960 * this.scale, 240 * this.scale, this.scale);
    }



}
