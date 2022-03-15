/**
 * Player character of game
 */
class Knight extends AbstractPlayer {
    //game = engine, (x, y) = spawn cords
    constructor(game, x, y) {
        super(game, x, y, STATS.PLAYER.NAME, STATS.PLAYER.MAX_HP, STATS.PLAYER.WIDTH, STATS.PLAYER.HEIGHT, STATS.PLAYER.SCALE);

        // get spritesheets
        this.spritesheetRight = ASSET_MANAGER.getAsset("./sprites/knight/knightRight.png");
        this.spritesheetLeft = ASSET_MANAGER.getAsset("./sprites/knight/knightLeft.png");
        this.spritesheetRight1 = ASSET_MANAGER.getAsset("./sprites/knight/knightRight1.png");
        this.spritesheetLeft1 = ASSET_MANAGER.getAsset("./sprites/knight/knightLeft1.png");
        this.spritesheetRight2 = ASSET_MANAGER.getAsset("./sprites/knight/knightRight2.png");
        this.spritesheetLeft2 = ASSET_MANAGER.getAsset("./sprites/knight/knightLeft2.png");
        this.spritesheetRight3 = ASSET_MANAGER.getAsset("./sprites/knight/knightRight3.png");
        this.spritesheetLeft3 = ASSET_MANAGER.getAsset("./sprites/knight/knightLeft3.png");

        //setup variable mapping for the states. Labeled for ease of use
        this.dir = { left: 0, right: 1 }; //directions
        this.states = {
            idle: 0, run: 1,
            crouch: 2, crouch_walk: 3, crouch_atk: 4, crouch_shoot: 5, crouch_pluck: 6,
            roll: 7, wall_climb: 8, wall_hang: 9, wall_slide: 10,
            jump: 11, jump_to_fall: 12, falling: 13,
            turn_around: 14, slide: 15,
            attack1: 16, attack2: 17, shoot: 18, pluck: 19,
            death: 20, revive: 21
        };

        //animation speed stats
        this.animRunSpd = 0.075; //speed of the dashing animation
        this.animRollSpd = 0.06; //speed of the dashing animation
        this.atkSpd = 0.08;        //slash1
        this.atkSpd2 = this.atkSpd + .01; //slash 2 must be slightly slower than atkspd1
        this.bowSpd = .1;

        //how long a bufferable action input is held
        this.jumpBuffer = 0;
        this.rollBuffer = 0;
        this.atkBuffer = 0;
        this.bufferTime = 0.5;


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
        this.arrow = false;
        this.crouch = false;
        this.doubleJump = true;
        this.flickerFlag = false;
        this.bladeBeam1 = true;
        this.bladeBeam2 = true;
        this.berserk = false;
        this.berserkBonus = 1.3;
        this.berserkTimer = 0;
        this.berserkFilter = 0.6;
        //these two audio variables control which sound effect is playing during the attack combo
        this.playAttackSFX1 = true;
        this.playAttackSFX2 = true;
        this.playBerserkSFX = true;

        // bounding box (hitbox) used for attacks
        this.HB = null;
        this.offsetxBB = 0;
        this.offsetyBB = 0;

        //PLAYER_PHYSICS
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = PLAYER_PHYSICS.ACC_FALL;
        this.slideAcc = PLAYER_PHYSICS.ACC_SLIDE;
        this.collisions = {
            lo_left: false, hi_left: false, lo_right: false, hi_right: false,
            ceil: false, ceil_left: false, ceil_right: false,
            floor: false, floor_left: false, floor_right: false
        };
        this.diffy = { hi: 0, lo: 0 };
        this.jumpTime = 0;
        this.slideTime = 0;
        this.wallSliding = false;
        this.wasFloor = true;
        this.climbHeight = 0;
        this.climbWidth = 0;

        //animations
        this.animations = [];
        this.loadAnimations();
        this.updateBB();
        this.lastBB = this.BB;
    };

    /**
     * All states of player to default
     * Used for instance when the knight needs to be respawned in
     */
    resetToDefault() {
        this.removeFromWorld = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.x = 0;
        this.y = 0;
        this.action = this.DEFAULT_ACTION;
        this.facing = this.DEFAULT_DIRECTION;
        this.updateBB();
        this.lastBB = this.BB;
    }

    /** Update methods */

    updateBoxes() {
        this.updateBB()
    }

    updateHB() {
        this.getOffsets();
        this.lastHB = this.HB;
        this.HB = new BoundingBox(this.x + this.offsetxHB, this.y + this.offsetyHB, this.widthHB, this.heightHB);
    };

    updateBB() {
        this.getOffsets();
        this.BB = new BoundingBox(this.x + this.offsetxBB, this.y + this.offsetyBB, this.widthBB, this.heightBB);
    };

    //**Controls player animations and movement */
    update() {
        const TICK = this.game.clockTick;
        //to prevent playing the same roll sound
        if (this.action != this.states.roll) super.checkDamageCooldown(TICK); //check if can be hit
        super.checkInDeathZone(); //check if outside of canvas

        //NOTE: this.dead is set when the knight hp drops to 0.
        if (this.dead) { //player died
            super.setDead();
        } else if (this.respawn) { //player is in respawn animation
            //console.log("respawn animation");
            this.action = this.states.revive;
            this.vulnerable = false;
            super.handleGravity();
            if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].isDone()) {
                this.respawn = false;
                this.vulnerable = true;
                this.action = this.DEFAULT_ACTION;
                this.resetAnimationTimers(this.states.revive);
            }
        } else { //not dead listen for player controls and do them
            if (this.berserk) { //NOTE: this is set by Vignette class!
                if (this.playBerserkSFX) {
                    this.playBerserkSFX = false;
                    ASSET_MANAGER.playAsset(SFX.BERSERK_ACTIVATE);
                }
                this.berserkTimer += TICK;
                if (this.berserkTimer >= 10) {
                    this.berserk = false;
                }

                //flickers when the powerup state is almost gone
                if (this.berserkTimer > 7) {
                    if (this.berserkFilter <= 1 && this.berserkFilter >= 0.8) this.berserkFilter -= .01;
                    else if (this.berserkFilter <= 0.8 && this.berserkFilter >= 0.2) this.berserkFilter -= .01;
                    else this.berserkFilter = 0.5;
                }

            }
            /**CONTROLS:
             * CheckAndDo..() checks user input and executes that action if possible
            */
            this.checkAndDoPlayerActions(TICK);
            this.setVelocityAndPosition(TICK);

            //set to falling state if needed
            if (!super.touchFloor() && (this.action < this.states.jump || this.action > this.states.falling) &&
                this.action != this.states.attack1 && this.action != this.states.attack2 && this.action != this.states.shoot && this.action != this.states.pluck) {
                if ((this.action != this.states.wall_slide && this.action != this.states.roll && this.action != this.states.wall_hang && this.action != this.states.wall_climb) ||
                    (this.action == this.states.wall_slide && !(this.collisions.lo_left || this.collisions.lo_right))) {
                    this.action = this.states.falling;
                    this.inAir = true;
                    if (this.wasFloor) {
                        this.jumpTime = 10;
                        this.wasFloor = false;
                    }
                }
            }

            /**COLLISION HANDLING
             * All interactions like environment or entities
             * are handled by the AbstractPlayer superclass
             */
            super.handleCollisions(TICK);

            if (this.touchFloor()) {
                this.wasFloor = true;
            }

            //when idling set player direction according to mouse
            if (PARAMS.AUTO_FOCUS) {
                if (this.action == this.states.idle || this.action == this.states.attack1 || this.action == this.states.attack2) {
                    if (this.game.mouse.x > (this.BB.x + this.BB.width / 2) - this.game.camera.x && this.facing == 0) {
                        this.facing = 1;
                    }
                    else if (this.game.mouse.x < (this.BB.x + this.BB.width / 2) - this.game.camera.x && this.facing == 1) {
                        this.facing = 0;
                    }
                }
                
                /*
                let time = this.animations[this.facing][this.action][this.myInventory.armorUpgrade].currentFrame();
                if (this.action == this.states.attack1 || this.action == this.states.attack2) {
                    let x = this.game.mouse.x + this.game.camera.x;
                    if (x < this.x + this.width / 2)
                        this.facing = this.dir.left;
                    if (x > this.x + this.width / 2)
                        this.facing = this.dir.right;
                }
                //...
                */

                
                let time = this.animations[this.facing][this.action][this.myInventory.armorUpgrade].elapsedTime;
                if (this.action == this.states.attack1 || this.action == this.states.attack2) {
                    let x = this.game.mouse.x + this.game.camera.x;
                    if (x < this.x + this.width / 2)
                        this.facing = this.dir.left;
                    if (x > this.x + this.width / 2)
                        this.facing = this.dir.right;
                }
                this.animations[this.facing][this.action][this.myInventory.armorUpgrade].elapsedTime = time;
                
            }


        }
        if (this.action != this.states.wall_slide) this.wallSliding = false;
        if (this.touchHole() && this.action < this.states.crouch) {
            this.action = this.states.crouch;
        }
        this.animations[this.facing][this.action][this.myInventory.armorUpgrade].update(TICK);
    }

    /**Draws player to the canvas */
    draw(ctx) {


        //flicker if the knight was damaged
        if (!this.vulnerable && !this.game.roll && !this.berserk) {
            ctx.filter = "drop-shadow(0 0 0.2rem crimson) opacity(100%)"; //red border to indicate damaged
            //drop the opacity a bit each flicker to create an effect of switching between 100% opaque
            if (this.flickerFlag) {
                ctx.filter = "drop-shadow(0 0 0.2rem crimson) opacity(85%)";
            }
            this.animations[this.facing][this.action][this.myInventory.armorUpgrade].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            this.flickerFlag = !this.flickerFlag;
        } else {
            if (this.berserk) {
                ctx.filter = "drop-shadow(0 0 " + this.berserkFilter + "rem crimson) opacity(100%)";
            }
            //white border to indicate roll invincibility
            //if(this.game.roll) ctx.filter = "drop-shadow(0 0 0.15rem ghostwhite)";
            this.animations[this.facing][this.action][this.myInventory.armorUpgrade].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            //ctx.filter = "none";
        }

        ctx.filter = "none"; //set this to none so the rest of the canvas is not affected!
        //this.viewAllAnimations(ctx);
        if (!this.dead) this.healthbar.draw(ctx);
    };

    drawDebug(ctx) {
        super.drawDebug(ctx);
        this.viewBoundingBox(ctx);
        this.viewCollisionsBox(ctx);
    }


    /**
     * Holds the bufferable input for a certain amount of time
     * If the input was not done in the buffer time
     * turn off the input.
     * 
     * Bufferable inputs are jump and attack
     * @param {*} TICK 
     */
    checkBuffers(TICK) {
        //jump
        if ((this.game.jump && this.action != this.states.jump)) {
            this.jumpBuffer += TICK;
            if (this.jumpBuffer >= this.bufferTime) {
                this.game.jump = false;
            }
        } else {
            this.jumpBuffer = 0;
        }

        //roll
        if ((this.game.roll && this.action != this.states.roll)) {
            this.rollBuffer += TICK;
            if (this.rollBuffer >= this.bufferTime) {
                this.game.roll = false;
            }
        } else {
            this.rollBuffer = 0;
        }

    }

    /**
     * Checks all avaliable actions of a player
     * and if the player's chosen action can be done it will
     * be executed.
     * @param {} TICK
     */
    checkAndDoPlayerActions(TICK) {
        //horizontal or vertical actions
        this.checkBuffers(TICK);
        this.checkAndDoMovement(TICK); //keyboard movement
        this.checkAndDoAttack();       //attacking
        this.checkAndDoHeal();         //healing

        /**
         * ROLLING SHOULD ALWAYS BE LAST
         * This is so roll can cancel other animations
         */
        this.checkAndDoRoll();

        //vertical actions
        this.checkAndDoAerialActions(TICK);

    }


    /**
     * Sets vertical action states like wall hang, wall slide, etc
     *
     * If it is not a wallslide, hang or an aerial bow shot then flip the
     * direction if needed depending on velocity
     * @param {*} TICK
     */
    checkAndDoAerialActions(TICK) {

        let isWallAction = (this.action == this.states.wall_hang || this.action == this.states.wall_climb || this.action == this.states.wall_slide)
        if (isWallAction) {
            if (this.action == this.states.wall_hang) {
                this.doubleJump = true;
                if (this.game.up) {
                    this.action = this.states.wall_climb;
                    if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].isDone()) {
                        this.resetAnimationTimers(this.action);
                    }
                }
                else if (this.game.down) {

                    this.action = this.states.wall_slide;
                    if (!this.wallSliding) {
                        this.slideTime = 60;
                        this.wallSliding = true;
                    }
                    this.facing = this.facing == this.dir.right ? this.dir.left : this.dir.right;
                }
            }
            if (this.action == this.states.wall_climb) {
                this.velocity.y = -255;
                switch (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].currentFrame()) {
                    case 0:
                        if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].elapsedTime == 0) {
                            this.y = this.climbHeight - 3 * this.scale;
                            this.velocity.y = 0;
                        }
                        if (this.y <= this.climbHeight - 14 * this.scale) {
                            this.y = this.climbHeight - 14 * this.scale;
                            this.velocity.y = 0;
                        }
                        break;
                    case 1:
                        if (this.y > this.climbHeight - 14 * this.scale) {
                            this.y = this.climbHeight - 14 * this.scale;
                        }
                        if (this.y <= this.climbHeight - 22 * this.scale) {
                            this.y = this.climbHeight - 22 * this.scale;
                            this.velocity.y = 0;
                        }
                        break;
                    case 2:
                        if (this.y > this.climbHeight - 22 * this.scale) {
                            this.y = this.climbHeight - 22 * this.scale;
                        }
                        if (this.y <= this.climbHeight - 25 * this.scale) {
                            this.y = this.climbHeight - 25 * this.scale;
                            this.velocity.y = 0;
                        }
                        break;
                    default:
                        this.velocity.y = 0;
                }
            }
        } else if (this.inAir && this.action != this.states.shoot) { //player is falling and not shooting an arrow
            //adjust the direction depending on how the player is drifting
            let flip = (this.velocity.x < 0 && this.facing == this.dir.right) ||
                (this.velocity.x > 0 && this.facing == this.dir.left);
            if (flip) this.flipFacing();
        }
    }

    /**
     * Checks/Executes horizontal and vertical movement
     * @params TICK = this.game.clocktick
     */
    checkAndDoMovement(TICK) {
        //choose animation based on keyboard input
        //this if statement is to make sure special states are not interrupted
        let uninterruptibleAction = this.action == this.states.roll || this.game.attack || this.game.shoot || this.action == this.states.wall_climb ||
            (this.action == this.states.attack1 || this.action == this.states.attack2);
        if (!uninterruptibleAction) {
            if (this.action != this.states.jump && !this.inAir) { //not in the air
                this.checkAndDoGroundedMovement(TICK);
            } else { //in the air
                this.checkAndDoAerialMovement(TICK);
            }
        } else { //player is in an uninteruptible action
            //if player was attacking slow down that momentum on the ground so there is a bit of a skid
            if ((this.game.attack || this.game.shoot) && !this.inAir) {
                if (this.velocity.x > 0) { //right momentum
                    this.velocity.x -= PLAYER_PHYSICS.ATTACK_SKID * TICK;
                    if (this.velocity.x < 0) this.velocity.x = 0;
                } else { //left momentum
                    this.velocity.x += PLAYER_PHYSICS.ATTACK_SKID * TICK;
                    if (this.velocity.x > 0) this.velocity.x = 0;
                }
            }
            if (this.action == this.states.wall_climb) {
                if (this.BB.left > this.climbWidth - PARAMS.BLOCKDIM && this.BB.right < this.climbWidth + PARAMS.BLOCKDIM)
                    this.velocity.x = (this.facing == 1 ? 100 : -100) * this.scale;
                if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].isDone()) {
                    if (this.touchHole()) {
                        this.action = this.states.crouch;
                    }
                    else this.action = this.states.idle;
                }
                if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].currentFrame() == 5 && this.touchHole()) {
                    this.resetAnimationTimers(this.action);
                    this.action = this.states.crouch;
                }
            }
        }
    }



    /**
     * Movement controls while grounded
     * @param {} TICK
     */
    checkAndDoGroundedMovement(TICK) {
        //horizontal movement
        if (this.game.down || this.touchHole()) { //crouch
            this.action = this.states.crouch;
            this.crouch = true;
            //crouch left or right (move at half speed)
            if (this.game.right && !this.game.attack && !this.game.shoot) { //run right
                this.facing = this.dir.right;
                this.action = this.states.crouch_walk; //crouch walk
                this.velocity.x += PLAYER_PHYSICS.CROUCH_SPD;
            } else if (this.game.left && !this.game.attack && !this.game.shoot) { //run left
                this.facing = this.dir.left;
                this.action = this.states.crouch_walk; //crouch walk
                this.velocity.x -= PLAYER_PHYSICS.CROUCH_SPD;
            }
            else {
                if (this.facing == this.dir.left) {
                    if (this.velocity.x < 0) {
                        this.velocity.x += PLAYER_PHYSICS.SKID * TICK;
                    }
                    else this.velocity.x = 0;
                }
                else if (this.facing == this.dir.right) {
                    if (this.velocity.x > 0) {
                        this.velocity.x -= PLAYER_PHYSICS.SKID * TICK;
                    }
                    else this.velocity.x = 0;
                }
            }
        } else if (this.game.right && !this.game.attack && !this.game.shoot) { //run right
            if (this.facing == this.dir.left && this.velocity.x < 0) {
                this.action = this.states.turn_around;
                this.velocity.x += PLAYER_PHYSICS.SKID * TICK;
            }
            else {
                this.facing = this.dir.right;
                this.action = this.states.run;
                this.velocity.x += PLAYER_PHYSICS.MAX_RUN;
            }
            this.crouch = false;
        } else if (this.game.left && !this.game.attack && !this.game.shoot) { //run left
            if (this.facing == this.dir.right && this.velocity.x > 0) {
                this.action = this.states.turn_around;
                this.velocity.x -= PLAYER_PHYSICS.SKID * TICK;
            }
            else {
                this.facing = this.dir.left;
                this.action = this.states.run;
                this.velocity.x -= PLAYER_PHYSICS.MAX_RUN;
            }
            this.crouch = false;
        } else { //idle
            if (this.facing == this.dir.left) {
                if (this.velocity.x < 0) {
                    this.velocity.x += (PLAYER_PHYSICS.SKID) * TICK;
                }
                else this.velocity.x = 0;
            }
            else if (this.facing == this.dir.right) {
                if (this.velocity.x > 0) {
                    this.velocity.x -= (PLAYER_PHYSICS.SKID) * TICK;
                }
                else this.velocity.x = 0;
            }
            this.action = this.DEFAULT_ACTION;
            this.crouch = false;
        }
        //jump press
        if (this.game.jump && !this.action.jump && !this.touchCeiling()) {
            super.doJump();
            this.wasFloor = false;
            this.jumpTime = 0;
        }
        if (this.action != this.states.turn_around) this.resetAnimationTimers(this.states.turn_around);
    }


    /**
     * Movement of player while airbourne
     * @param {*} TICK
     */
    checkAndDoAerialMovement(TICK) {
        // horizontal PLAYER_PHYSICS while in the air
        if (this.action != this.states.wall_hang && this.action != this.states.wall_climb) {
            if (this.game.right && !this.game.left) {
                if (this.action != this.states.wall_slide || this.action == this.states.wall_slide && this.facing == this.dir.right && this.slideTime <= 0) {
                    if (Math.abs(this.velocity.x) > PLAYER_PHYSICS.MAX_WALK) {
                        this.velocity.x += PLAYER_PHYSICS.ACC_RUN * TICK;
                    } else this.velocity.x += PLAYER_PHYSICS.ACC_WALK * TICK;
                    this.wallSliding = false;
                }
                else this.slideTime -= 100 * TICK;
            } else if (this.game.left && !this.game.right) {
                if (this.action != this.states.wall_slide || this.action == this.states.wall_slide && this.facing == this.dir.left && this.slideTime <= 0) {
                    if (Math.abs(this.velocity.x) > PLAYER_PHYSICS.MAX_WALK) {
                        this.velocity.x -= PLAYER_PHYSICS.ACC_RUN * TICK;
                    } else this.velocity.x -= PLAYER_PHYSICS.ACC_WALK * TICK;
                    this.wallSliding = false;
                }
                else this.slideTime -= 100 * TICK;
            }
        }



        if (this.inAir) {
            // //logic to handle switching between jump animations
            if (this.animations[this.facing][this.states.jump_to_fall][this.myInventory.armorUpgrade].isDone()) { //falling in between finished transition to falling
                this.action = this.states.falling;                                 //set to falling until reach ground
            } else if (this.animations[this.facing][this.states.jump][this.myInventory.armorUpgrade].isDone()) {  //jump finished transition to falling
                this.action = this.states.jump_to_fall;                            //set to falling-in-between
            }

            //FALLING STATE, SET APPROPRIATE ANIMATIONS IF COLLIDING WITH SOMETHING LIKE WALLSLIDE
            if (this.velocity.y >= 0) {
                this.jumpTime -= 75 * TICK;
                if (this.action != this.states.wall_climb) {
                    if (this.diffy.hi > 0 * this.scale && this.diffy.hi <= 12 * this.scale) {
                        if ((this.collisions.lo_left || this.collisions.hi_left) && (this.facing == this.dir.left || this.game.left) ||
                            (this.collisions.lo_right || this.collisions.hi_right) && (this.facing == this.dir.right || this.game.right)) {
                            if (this.collisions.lo_left || this.collisions.hi_left) this.facing = this.dir.left;
                            else this.facing = this.dir.right;

                            this.action = this.states.wall_hang;
                            if (!this.game.down) {
                                this.y = this.y + this.diffy.hi - 8 * this.scale;
                                this.climbHeight = this.y;
                                this.climbWidth = this.BB.left;
                                this.velocity.x = 0;
                            }
                        }
                    }
                    else if (this.diffy.hi < 8) {
                        if (this.collisions.lo_left) {
                            this.action = this.states.wall_slide;
                            this.facing = this.dir.right;
                            if (!this.wallSliding) {
                                this.slideTime = 60;
                                this.wallSliding = true;
                            }
                        }
                        else if (this.collisions.lo_right) {
                            this.action = this.states.wall_slide;
                            this.facing = this.dir.left;
                            if (!this.wallSliding) {
                                this.slideTime = 60;
                                this.wallSliding = true;
                            }
                        }
                    }
                }
            }
        }

        //PLAYER IS DOING A JUMP WHILE IN THE AIR
        if (this.game.jump) {
            // do a wall jump if touching a wall
            if (!this.touchFloor()) {
                if (this.collisions.lo_left) {
                    ASSET_MANAGER.playAsset(SFX.WALLJUMP);
                    this.game.jump = false;
                    this.resetAnimationTimers(this.states.jump);
                    this.resetAnimationTimers(this.states.jump_to_fall);
                    if (this.action == this.states.wall_slide || this.action == this.states.wall_hang && this.game.left && this.facing == this.dir.right)
                        this.velocity.y -= PLAYER_PHYSICS.JUMP_HEIGHT;
                    else
                        this.velocity.y -= PLAYER_PHYSICS.DOUBLE_JUMP_HEIGHT * 2;
                    if (this.action != this.states.wall_hang || this.action == this.states.wall_hang && this.game.right) {
                        this.velocity.x += PLAYER_PHYSICS.MAX_WALK;
                        this.facing = this.dir.right;
                    }
                    this.action = this.states.jump;
                    this.slideTime = 0;
                }
                else if (this.collisions.lo_right) {
                    ASSET_MANAGER.playAsset(SFX.WALLJUMP);
                    this.game.jump = false;
                    this.resetAnimationTimers(this.states.jump);
                    this.resetAnimationTimers(this.states.jump_to_fall);
                    if (this.action == this.states.wall_slide || this.action == this.states.wall_hang && this.game.right && this.facing == this.dir.right)
                        this.velocity.y -= PLAYER_PHYSICS.JUMP_HEIGHT;
                    else
                        this.velocity.y -= PLAYER_PHYSICS.DOUBLE_JUMP_HEIGHT * 2;
                    if (this.action != this.states.wall_hang || this.action == this.states.wall_hang && this.game.left) {
                        this.velocity.x -= PLAYER_PHYSICS.MAX_WALK;
                        this.facing = this.dir.left;
                    }
                    this.action = this.states.jump;
                }
                this.game.jump = false;
            }

            if (this.jumpTime > 0) {
                super.doJump();
                this.jumpTime = 0;
                this.wasFloor = false;
            }

            //do a double jump if the player is in the air and hasn't double jumped while in air
            else if (this.doubleJump && this.inAir && this.action >= this.states.jump
                && this.action <= this.states.falling) {
                ASSET_MANAGER.playAsset(SFX.DOUBLEJUMP);
                this.doubleJump = false;
                this.game.jump = false;
                this.resetAnimationTimers(this.states.jump);
                this.resetAnimationTimers(this.states.jump_to_fall);
                if (this.action == this.states.jump) {
                    this.velocity.y -= PLAYER_PHYSICS.DOUBLE_JUMP_HEIGHT;
                }
                else {
                    this.velocity.y = -PLAYER_PHYSICS.JUMP_HEIGHT / 2;
                }
                this.action = this.states.jump;
                this.wasFloor = false;
                this.jumpTime = 0;

                //handle double jump x velocity
                let isLeft = this.facing == this.dir.left;
                if (this.game.left) {
                    if (isLeft) { //keep momentum and jump left
                        this.velocity.x -= PLAYER_PHYSICS.DOUBLE_JUMP_X_BOOST * TICK;

                    } else { //was facing right cut momentum and double jump other way
                        this.facing = this.dir.left;
                        this.velocity.x = 0;
                        //gave a slightly higher boost since momentum was just killed
                        this.velocity.x -= (PLAYER_PHYSICS.DOUBLE_JUMP_X_BOOST * PHYSIC_SCALER) * TICK;
                    }

                } else if (this.game.right) {
                    if (!isLeft) { //keep momentum and jump right
                        this.velocity.x += PLAYER_PHYSICS.DOUBLE_JUMP_X_BOOST * TICK;
                    } else { //was facing left cut momentum and double jump other way
                        this.facing = this.dir.right;
                        this.velocity.x = 0;
                        //gave a slightly higher boost since momentum was just killed
                        this.velocity.x += (PLAYER_PHYSICS.DOUBLE_JUMP_X_BOOST * PHYSIC_SCALER) * TICK;
                    };
                }
            }
        }
    }


    /**
     * Checks and execute attack input
     */
    checkAndDoAttack() {
        let action = this.action;
        //attack logic (melee/ranged)
        if (this.game.attack) {
            if (this.crouch && !this.inAir) { //crouch attack
                this.action = this.states.crouch_atk;
            } else { //standing or jumping attack
                //set action based on combo counter.
                //If attack button was pressed more than once change action to the second attack after the animation is complete
                this.combo = (this.game.comboCounter > 1 && this.animations[this.facing][this.states.attack1][this.myInventory.armorUpgrade].isDone()) ? true : false;
                this.action = (this.combo) ? this.states.attack2 : this.states.attack1; //if comboing switch to the second animation

                //play the second attack sound if the first sword swing is done
                if (this.action == this.states.attack2 && this.combo && !this.playAttackSFX1 && this.playAttackSFX2) {
                    this.playAttackSFX2 = false;
                    ASSET_MANAGER.playAsset(SFX.SLASH2)
                }
            }
            this.updateHB();
            if (this.bladeBeam1 && this.berserk) {
                this.bladeBeam1 = false;
                super.bladeBeam();
            } else if (this.bladeBeam2 && this.animations[this.facing][this.states.attack1][this.myInventory.armorUpgrade].isDone() && this.berserk) {
                this.bladeBeam2 = false;
                super.bladeBeam();
            }

            //play
            if (this.playAttackSFX1) {
                this.playAttackSFX1 = false;
                if (this.action == this.states.attack1 || this.action == this.states.crouch_atk) ASSET_MANAGER.playAsset(SFX.SLASH1);
            }
            let done = this.animations[this.facing][this.action][this.myInventory.armorUpgrade].isDone();

            if (done) {
                if (this.combo && this.action == this.states.attack1) { //continue combo after first attack
                    this.action = this.states.attack2;

                } else { //end attack
                    this.action = this.game.down || this.touchHole() ? this.states.crouch : this.DEFAULT_ACTION; //back to idle; added case for crouch attacks
                    this.bladeBeam1 = true;
                    this.bladeBeam2 = true;
                    this.HB = null;
                    this.game.attack = false; //stop attackin
                    // delete hitbox here
                }

                //to ensure the animation does not get stuck we reset the combo regardless
                this.resetCombo();

            }

        } else if (!this.game.attack && this.game.shoot && !this.game.roll) { //only shoot an arrow when not attacking
            if (this.myInventory.arrows > 0 || this.myInventory.arrows == 0 && this.arrow) {
                if (this.crouch && !this.inAir)
                    this.action = this.states.crouch_shoot;
                else this.action = this.states.shoot;
            }
            else {
                if (this.game.down || this.touchHole())
                    this.action = this.states.crouch_pluck;
                else this.action = this.states.pluck;
            }
            let done = this.animations[this.facing][this.action][this.myInventory.armorUpgrade].isDone();

            // shoot arrow
            if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].currentFrame() == 2 && !this.arrow) {
                if (this.myInventory.arrows > 0)
                    this.arrow = true;
                super.shootArrow();
            }

            //only adjust the direction if using the mouse to shoot
            let time = this.animations[this.facing][this.action][this.myInventory.armorUpgrade].elapsedTime;
            if (!this.game.shootButton) {
                let x = this.game.mouse.x + this.game.camera.x;
                if (x < this.x + this.width / 2)
                    this.facing = this.dir.left;
                if (x > this.x + this.width / 2)
                    this.facing = this.dir.right;
            }
            this.animations[this.facing][this.action][this.myInventory.armorUpgrade].elapsedTime = time;

            if (done) {
                this.action = this.game.down || this.touchHole() ? this.states.crouch : this.DEFAULT_ACTION; //back to idle; added case for crouch attacks
                this.game.shoot = false;
                this.game.shootButton = false;
                this.arrow = false;
            }
        } else {
            //crouch attack
            this.resetAnimationTimers(this.states.crouch_atk);
            //slash 1 and 2
            this.resetAnimationTimers(this.states.attack1);
            this.resetAnimationTimers(this.states.attack2);

            this.resetAnimationTimers(this.states.shoot);
            this.resetAnimationTimers(this.states.crouch_shoot);

            this.resetAnimationTimers(this.states.pluck);
            this.resetAnimationTimers(this.states.crouch_pluck);

            //reset shooting animation
        }
        if (action == this.states.turn_around && this.action != this.states.turn_around && this.action != this.states.run) {
            this.flipFacing();
        }
    }

    /**
     * Checks and executes heal input
     */
    checkAndDoHeal() {
        if (this.game.heal) { //reset all attack animations
            super.usePotion();
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
            this.game.shoot = false;
            this.arrow = false;
            this.resetCombo();
            this.HB = null;

            //set roll behavior
            if (this.action != this.states.roll) {
                this.resetAnimationTimers(this.action);
                this.action = this.states.roll; //roll
                if (this.game.left && !this.game.right)
                    this.facing = this.dir.left;
                if (this.game.right && !this.game.left)
                    this.facing = this.dir.right;
            }
            this.velocity.x += (this.facing == this.dir.left) ? -1 * (PLAYER_PHYSICS.ROLL_SPD) : (PLAYER_PHYSICS.ROLL_SPD); //movement speed boost
            if (this.vulnerable) {
                ASSET_MANAGER.playAsset(SFX.DODGE);
                this.vulnerable = false;
            }

            if (this.animations[this.facing][this.states.roll][this.myInventory.armorUpgrade].isDone()) {
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
     * Adjusts the position of player based on current velocity
     * The velocity was changed by player actions on keyboard
     * @param {*} TICK
    */
    setVelocityAndPosition(TICK) {
        /**SET THE VELOCITY OF THE PLAYER */
        //constant falling velocity, different depending on state
        switch (this.action) {
            case this.states.wall_slide:
                this.velocity.y += this.slideAcc * TICK;
                break;
            case this.states.wall_climb:
                if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].currentFrame() >= 3);
                //this.velocity.y += this.fallAcc * TICK;
                break;
            case this.states.wall_hang:
                this.velocity.y = 0;
                break;
            default:
                this.velocity.y += this.fallAcc * TICK;
                break;
        }

        // max y velocity
        if (this.velocity.y >= PLAYER_PHYSICS.MAX_FALL) this.velocity.y = PLAYER_PHYSICS.MAX_FALL;
        if (this.velocity.y <= -PLAYER_PHYSICS.MAX_FALL) this.velocity.y = -PLAYER_PHYSICS.MAX_FALL;
        if (this.action == this.states.wall_slide) {
            if (this.velocity.y >= PLAYER_PHYSICS.MAX_SLIDE) this.velocity.y = PLAYER_PHYSICS.MAX_SLIDE;
        }

        //max x velocity
        let doubleJumpBonus = 0;
        if (!this.doubleJump) doubleJumpBonus = PLAYER_PHYSICS.DOUBLE_JUMP_X_BOOST;
        if (this.velocity.x >= PLAYER_PHYSICS.MAX_RUN) this.velocity.x = PLAYER_PHYSICS.MAX_RUN + doubleJumpBonus;
        if (this.velocity.x <= -PLAYER_PHYSICS.MAX_RUN) this.velocity.x = -PLAYER_PHYSICS.MAX_RUN - doubleJumpBonus;
        if (this.action == this.states.crouch_walk) {
            if (this.velocity.x >= PLAYER_PHYSICS.CROUCH_SPD) this.velocity.x = PLAYER_PHYSICS.CROUCH_SPD;
            if (this.velocity.x <= -PLAYER_PHYSICS.CROUCH_SPD) this.velocity.x = -PLAYER_PHYSICS.CROUCH_SPD;
        }

        //update the position and set the bounding box

        if (this.action == this.states.wall_climb) {
            if (this.BB.left >= this.climbWidth + PARAMS.BLOCKDIM)
                this.x = (this.x - this.BB.left) + this.climbWidth + PARAMS.BLOCKDIM;
            else if (this.BB.left <= this.climbWidth - PARAMS.BLOCKDIM)
                this.x = (this.x - this.BB.right) + this.climbWidth - PARAMS.BLOCKDIM + this.BB.width;
        }
        this.x += this.velocity.x * TICK;
        if (this.action != this.states.wall_hang || this.action != this.states.wall_climb)
            this.y += this.velocity.y * TICK;
        this.updateBB();
    }

    //reset the animation timer in both direction
    resetAnimationTimers(action) {
        this.animations[0][action][this.myInventory.armorUpgrade].elapsedTime = 0;
        this.animations[1][action][this.myInventory.armorUpgrade].elapsedTime = 0;
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

    /**
     * Reset the powered up state from low hp
     */
    resetBerserkState() {
        this.berserk = false;
        this.berserkTimer = 0;
        this.berserkFilter = 0.6;
        this.playBerserkSFX = true;
    }

    /**reverse current facing direction */
    flipFacing() {
        (this.facing == this.dir.left) ? this.facing = this.dir.right : this.facing = this.dir.left;
    }


    //choose how much damage the knight should do based on what action it is doing
    getDamageValue() {
        let dmg = 0;
        if (this.action == this.states.attack1) {
            dmg = STATS.PLAYER.DMG_SLASH1 * super.getAttackBonus();
        } else if (this.action == this.states.attack2) {
            dmg = STATS.PLAYER.DMG_SLASH2 * super.getAttackBonus();
        } else if (this.action == this.states.crouch_atk) {
            dmg = STATS.PLAYER.DMG_CROUCHATK * super.getAttackBonus();
        }

        //beserker bonus
        if (this.berserk) dmg = (dmg * this.berserkBonus);

        //critical bonus
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS * super.getAttackBonus();
        }
        dmg = Math.round(100 * dmg) / 100;
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
        const y = 20 + this.height - this.heightBB;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, this.widthBB, this.heightBB);
        const coll = this.collisions;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        if (coll.ceil) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.widthBB, y);
        }
        if (coll.ceil_left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.widthBB / 2, y);
        }
        if (coll.ceil_right) {
            ctx.moveTo(x + this.widthBB / 2, y);
            ctx.lineTo(x + this.widthBB, y);
        }
        if (coll.floor) {
            ctx.moveTo(x, y + this.heightBB);
            ctx.lineTo(x + this.widthBB, y + this.heightBB);
        }
        if (coll.floor_left) {
            ctx.moveTo(x, y + this.heightBB);
            ctx.lineTo(x + this.widthBB / 2, y + this.heightBB);
        }
        if (coll.floor_right) {
            ctx.moveTo(x + this.widthBB / 2, y + this.heightBB);
            ctx.lineTo(x + this.widthBB, y + this.heightBB);
        }
        if (coll.hi_left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this.heightBB / 2);
        }
        if (coll.lo_left) {
            ctx.moveTo(x, y + this.heightBB / 2);
            ctx.lineTo(x, y + this.heightBB);
        }
        if (coll.hi_right) {
            ctx.moveTo(x + this.widthBB, y);
            ctx.lineTo(x + this.widthBB, y + this.heightBB / 2);
        }
        if (coll.lo_right) {
            ctx.moveTo(x + this.widthBB, y + this.heightBB / 2);
            ctx.lineTo(x + this.widthBB, y + this.heightBB);
        }
        ctx.stroke();
        ctx.lineWidth = 2;
    }

    /**Offset the bounding box based on action state */
    getOffsets() {
        const frame = this.animations[this.facing][this.action][this.myInventory.armorUpgrade].currentFrame();
        switch (this.action) {
            // idle, running and jumping BB offsets
            case this.states.idle:
            case this.states.run:
            case this.states.jump:
            case this.states.jump_to_fall:
            case this.states.falling:
            case this.states.wall_slide:
                this.offsetxBB = 50 * this.scale;
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
                    case 0, 1:
                        this.offsetyBB = 48 * this.scale;
                        break;
                    case 2:
                        this.heightBB = 28 * this.scale;
                        break;
                    case 3:
                        this.heightBB = 24 * this.scale;
                        break;
                    default:
                        this.heightBB = 28 * this.scale;

                }
                break;
            // crouch and crouch walk BB offsets
            case this.states.crouch:
            case this.states.crouch_walk:
                this.offsetxBB = 50 * this.scale;
                this.offsetyBB = 53 * this.scale;
                this.heightBB = 27 * this.scale;
                break;
            // roll BB offsets
            case this.states.roll:
                this.offsetxBB = this.facing == 1 ? 50 * this.scale : 35 * this.scale;
                this.offsetyBB = 53 * this.scale;
                this.heightBB = 27 * this.scale;
                this.widthBB = 35 * this.scale;
                break;
            // crouch attack HB offsets
            case this.states.crouch_atk:
                //this.offsetxHB = 20 * this.scale;
                this.widthHB = 80 * this.scale;
                this.offsetyHB = 53 * this.scale;
                this.heightHB = 27 * this.scale;
                if (frame > 0) {
                    if (frame > 1) this.widthHB = 70 * this.scale;
                    this.offsetxHB = this.facing == 1 ? 25 * this.scale : this.width - 25 * this.scale - this.widthHB;
                }
                else this.HB = null;
                break;
            // attack combo HB offsets
            case this.states.attack1:
                if (frame > 0 && frame < 3) {
                    this.offsetyHB = 37 * this.scale;
                    this.offsetxHB = this.facing == 1 ? 43 * this.scale : 9 * this.scale;
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
                    this.offsetxHB = this.facing == 1 ? 30 * this.scale : this.width - 30 * this.scale - this.widthHB;
                }
                else this.HB = null;
                break;
        }
    };

    loadAnimations() {
        let numDir = 2;
        let numStates = 22;
        let armorUpgrades = 4;
        for (var i = 0; i < numDir; i++) {
            this.animations.push([]);
            for (var j = 0; j < numStates; j++) {
                this.animations[i].push([]);
                for (var k = 0; k < armorUpgrades; k++) {
                    this.animations[i][j].push([]);
                }
            }
        }

        //states: 1-10
        // idle = 0
        this.animations[0][this.states.idle][0] = new Animator(this.spritesheetLeft, 245, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][this.states.idle][0] = new Animator(this.spritesheetRight, -5, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run = 1
        this.animations[0][this.states.run][0] = new Animator(this.spritesheetLeft, 245, 880, 120, 80, 10, this.animRunSpd, 0, true, true, false);
        this.animations[1][this.states.run][0] = new Animator(this.spritesheetRight, -5, 880, 120, 80, 10, this.animRunSpd, 0, false, true, false);
        // crouch = 2
        this.animations[0][this.states.crouch][0] = new Animator(this.spritesheetLeft, 1205, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][this.states.crouch][0] = new Animator(this.spritesheetRight, 115, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch walk = 3
        this.animations[0][this.states.crouch_walk][0] = new Animator(this.spritesheetLeft, 485, 240, 120, 80, 8, 0.085, 0, true, true, false);
        this.animations[1][this.states.crouch_walk][0] = new Animator(this.spritesheetRight, -5, 240, 120, 80, 8, 0.085, 0, false, true, false);
        // crouch attack = 4
        this.animations[0][this.states.crouch_atk][0] = new Animator(this.spritesheetLeft, 965, 160, 120, 80, 4, 0.08, 0, true, false, false);
        this.animations[1][this.states.crouch_atk][0] = new Animator(this.spritesheetRight, -5, 160, 120, 80, 4, 0.08, 0, false, false, false);
        // crouch pluck = 6
        this.animations[0][this.states.crouch_shoot][0] = new Animator(this.spritesheetLeft, 965, 1440, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_shoot][0] = new Animator(this.spritesheetRight, -5, 1440, 120, 80, 4, 0.1, 0, false, false, false);
        // crouch shoot = 5
        this.animations[0][this.states.crouch_pluck][0] = new Animator(this.spritesheetLeft, 965, 1600, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_pluck][0] = new Animator(this.spritesheetRight, -5, 1600, 120, 80, 4, 0.1, 0, false, false, false);
        // roll = 7
        this.animations[0][this.states.roll][0] = new Animator(this.spritesheetLeft, 5, 800, 120, 80, 12, this.animRollSpd, 0, true, false, false);
        this.animations[1][this.states.roll][0] = new Animator(this.spritesheetRight, -5, 800, 120, 80, 12, this.animRollSpd, 0, false, false, false);
        // wall climb = 8
        this.animations[0][this.states.wall_climb][0] = new Animator(this.spritesheetLeft, 605, 1120, 120, 80, 7, 0.1, 0, true, false, false);
        this.animations[1][this.states.wall_climb][0] = new Animator(this.spritesheetRight, -5, 1120, 120, 80, 7, 0.1, 0, false, false, false);
        // wall hang = 9
        this.animations[0][this.states.wall_hang][0] = new Animator(this.spritesheetLeft, 1323, 1200, 120, 80, 1, 0.2, 0, true, true, false);
        this.animations[1][this.states.wall_hang][0] = new Animator(this.spritesheetRight, -3, 1200, 120, 80, 1, 0.2, 0, false, true, false);
        // wall slide = 10
        this.animations[0][this.states.wall_slide][0] = new Animator(this.spritesheetLeft, 1081, 1280, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide][0] = new Animator(this.spritesheetRight, -2, 1280, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump = 11
        this.animations[0][this.states.jump][0] = new Animator(this.spritesheetLeft, 1085, 640, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump][0] = new Animator(this.spritesheetRight, -5, 640, 120, 80, 3, 0.1, 0, false, false, false);
        // jump/fall inbetween = 12
        this.animations[0][this.states.jump_to_fall][0] = new Animator(this.spritesheetLeft, 1205, 720, 120, 80, 2, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump_to_fall][0] = new Animator(this.spritesheetRight, -5, 720, 120, 80, 2, 0.1, 0, false, false, false);
        // fall = 13
        this.animations[0][this.states.falling][0] = new Animator(this.spritesheetLeft, 1085, 480, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.falling][0] = new Animator(this.spritesheetRight, -5, 480, 120, 80, 3, 0.1, 0, false, true, false);
        // turn around = 14
        this.animations[0][this.states.turn_around][0] = new Animator(this.spritesheetLeft, 1085, 1040, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.turn_around][0] = new Animator(this.spritesheetRight, -5, 1040, 120, 80, 3, 0.1, 0, false, false, false);
        // slide = 15
        this.animations[0][this.states.slide][0] = new Animator(this.spritesheetLeft, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][this.states.slide][0] = new Animator(this.spritesheetRight, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);

        //attack combo (on ground or in air)
        //Note: Slash 1 is a faster attack but less damage. Slash 2 is slower but more damage
        //slash 1 = 16
        this.animations[0][this.states.attack1][0] = new Animator(this.spritesheetLeft, 725, 0, 120, 80, 6, this.atkSpd, 0, true, false, false);
        this.animations[1][this.states.attack1][0] = new Animator(this.spritesheetRight, -5, 0, 120, 80, 6, this.atkSpd, 0, false, false, false);
        //slash 2 = 17
        this.animations[0][this.states.attack2][0] = new Animator(this.spritesheetLeft, 245, 0, 120, 80, 6, this.atkSpd2, 0, true, false, false);
        this.animations[1][this.states.attack2][0] = new Animator(this.spritesheetRight, 475, 0, 120, 80, 6, this.atkSpd2, 0, false, false, false);
        //shoot = 18
        this.animations[0][this.states.shoot][0] = new Animator(this.spritesheetLeft, 965, 1360, 120, 80, 4, this.bowSpd, 0, true, false, false);
        this.animations[1][this.states.shoot][0] = new Animator(this.spritesheetRight, -5, 1360, 120, 80, 4, this.bowSpd, 0, false, false, false);
        // pluck = 19
        this.animations[0][this.states.pluck][0] = new Animator(this.spritesheetLeft, 965, 1520, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.pluck][0] = new Animator(this.spritesheetRight, -5, 1520, 120, 80, 4, 0.1, 0, false, false, false);

        // death = 19 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death][0] = new Animator(this.spritesheetLeft, 365, 400, 120, 80, 9, 0.1, 0, true, false, false);
        this.animations[1][this.states.death][0] = new Animator(this.spritesheetRight, -5, 400, 120, 80, 9, 0.1, 0, false, false, false);

        // revive animation (death in reverse)
        this.animations[0][this.states.revive][0] = new Animator(this.spritesheetLeft, 365, 400, 120, 80, 9, 0.1, 0, false, false, false);
        this.animations[1][this.states.revive][0] = new Animator(this.spritesheetRight, -5, 400, 120, 80, 9, 0.1, 0, true, false, false);


        //________________________________________________________GOLD________________________________________________________________________



        //states: 1-10
        // idle = 0
        this.animations[0][this.states.idle][1] = new Animator(this.spritesheetLeft1, 245, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][this.states.idle][1] = new Animator(this.spritesheetRight1, -5, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run = 1
        this.animations[0][this.states.run][1] = new Animator(this.spritesheetLeft1, 245, 880, 120, 80, 10, this.animRunSpd, 0, true, true, false);
        this.animations[1][this.states.run][1] = new Animator(this.spritesheetRight1, -5, 880, 120, 80, 10, this.animRunSpd, 0, false, true, false);
        // crouch = 2
        this.animations[0][this.states.crouch][1] = new Animator(this.spritesheetLeft1, 1205, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][this.states.crouch][1] = new Animator(this.spritesheetRight1, 115, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch walk = 3
        this.animations[0][this.states.crouch_walk][1] = new Animator(this.spritesheetLeft1, 485, 240, 120, 80, 8, 0.085, 0, true, true, false);
        this.animations[1][this.states.crouch_walk][1] = new Animator(this.spritesheetRight1, -5, 240, 120, 80, 8, 0.085, 0, false, true, false);
        // crouch attack = 4
        this.animations[0][this.states.crouch_atk][1] = new Animator(this.spritesheetLeft1, 965, 160, 120, 80, 4, 0.08, 0, true, false, false);
        this.animations[1][this.states.crouch_atk][1] = new Animator(this.spritesheetRight1, -5, 160, 120, 80, 4, 0.08, 0, false, false, false);
        // crouch pluck = 6
        this.animations[0][this.states.crouch_shoot][1] = new Animator(this.spritesheetLeft1, 965, 1440, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_shoot][1] = new Animator(this.spritesheetRight1, -5, 1440, 120, 80, 4, 0.1, 0, false, false, false);
        // crouch shoot = 5
        this.animations[0][this.states.crouch_pluck][1] = new Animator(this.spritesheetLeft1, 965, 1600, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_pluck][1] = new Animator(this.spritesheetRight1, -5, 1600, 120, 80, 4, 0.1, 0, false, false, false);
        // roll = 7
        this.animations[0][this.states.roll][1] = new Animator(this.spritesheetLeft1, 0, 800, 120, 80, 12, this.animRollSpd, 0, true, false, false);
        this.animations[1][this.states.roll][1] = new Animator(this.spritesheetRight1, 0, 800, 120, 80, 12, this.animRollSpd, 0, false, false, false);
        // wall climb = 8
        this.animations[0][this.states.wall_climb][1] = new Animator(this.spritesheetLeft1, 608, 1120, 120, 80, 7, 0.1, 0, true, false, false);
        this.animations[1][this.states.wall_climb][1] = new Animator(this.spritesheetRight1, -8, 1120, 120, 80, 7, 0.1, 0, false, false, false);
        // wall hang = 9
        this.animations[0][this.states.wall_hang][1] = new Animator(this.spritesheetLeft1, 1323, 1200, 120, 80, 1, 0.2, 0, true, true, false);
        this.animations[1][this.states.wall_hang][1] = new Animator(this.spritesheetRight1, -3, 1200, 120, 80, 1, 0.2, 0, false, true, false);
        // wall slide = 10
        this.animations[0][this.states.wall_slide][1] = new Animator(this.spritesheetLeft1, 1081, 1280, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide][1] = new Animator(this.spritesheetRight1, -2, 1280, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump = 11
        this.animations[0][this.states.jump][1] = new Animator(this.spritesheetLeft1, 1085, 640, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump][1] = new Animator(this.spritesheetRight1, -5, 640, 120, 80, 3, 0.1, 0, false, false, false);
        // jump/fall inbetween = 12
        this.animations[0][this.states.jump_to_fall][1] = new Animator(this.spritesheetLeft1, 1205, 720, 120, 80, 2, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump_to_fall][1] = new Animator(this.spritesheetRight1, -5, 720, 120, 80, 2, 0.1, 0, false, false, false);
        // fall = 13
        this.animations[0][this.states.falling][1] = new Animator(this.spritesheetLeft1, 1085, 480, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.falling][1] = new Animator(this.spritesheetRight1, -5, 480, 120, 80, 3, 0.1, 0, false, true, false);
        // turn around = 14
        this.animations[0][this.states.turn_around][1] = new Animator(this.spritesheetLeft1, 1085, 1040, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.turn_around][1] = new Animator(this.spritesheetRight1, -5, 1040, 120, 80, 3, 0.1, 0, false, false, false);
        // slide = 15
        this.animations[0][this.states.slide][1] = new Animator(this.spritesheetLeft1, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][this.states.slide][1] = new Animator(this.spritesheetRight1, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);

        //attack combo (on ground or in air)
        //Note: Slash 1 is a faster attack but less damage. Slash 2 is slower but more damage
        //slash 1 = 16
        this.animations[0][this.states.attack1][1] = new Animator(this.spritesheetLeft1, 725, 0, 120, 80, 6, this.atkSpd, 0, true, false, false);
        this.animations[1][this.states.attack1][1] = new Animator(this.spritesheetRight1, -5, 0, 120, 80, 6, this.atkSpd, 0, false, false, false);
        //slash 2 = 17
        this.animations[0][this.states.attack2][1] = new Animator(this.spritesheetLeft1, 245, 0, 120, 80, 6, this.atkSpd2, 0, true, false, false);
        this.animations[1][this.states.attack2][1] = new Animator(this.spritesheetRight1, 475, 0, 120, 80, 6, this.atkSpd2, 0, false, false, false);
        //shoot = 18
        this.animations[0][this.states.shoot][1] = new Animator(this.spritesheetLeft1, 965, 1360, 120, 80, 4, this.bowSpd, 0, true, false, false);
        this.animations[1][this.states.shoot][1] = new Animator(this.spritesheetRight1, -5, 1360, 120, 80, 4, this.bowSpd, 0, false, false, false);
        // pluck = 19
        this.animations[0][this.states.pluck][1] = new Animator(this.spritesheetLeft1, 965, 1520, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.pluck][1] = new Animator(this.spritesheetRight1, -5, 1520, 120, 80, 4, 0.1, 0, false, false, false);

        // death = 19 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death][1] = new Animator(this.spritesheetLeft1, 365, 400, 120, 80, 9, 0.1, 0, true, false, false);
        this.animations[1][this.states.death][1] = new Animator(this.spritesheetRight1, -5, 400, 120, 80, 9, 0.1, 0, false, false, false);

        // revive animation (death in reverse)
        this.animations[0][this.states.revive][1] = new Animator(this.spritesheetLeft1, 365, 400, 120, 80, 9, 0.1, 0, false, false, false);
        this.animations[1][this.states.revive][1] = new Animator(this.spritesheetRight1, -5, 400, 120, 80, 9, 0.1, 0, true, false, false);


        //___________________________________________________________DIAMOND________________________________________________________________________

        //states: 1-10
        // idle = 0
        this.animations[0][this.states.idle][2] = new Animator(this.spritesheetLeft2, 245, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][this.states.idle][2] = new Animator(this.spritesheetRight2, -5, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run = 1
        this.animations[0][this.states.run][2] = new Animator(this.spritesheetLeft2, 245, 880, 120, 80, 10, this.animRunSpd, 0, true, true, false);
        this.animations[1][this.states.run][2] = new Animator(this.spritesheetRight2, -5, 880, 120, 80, 10, this.animRunSpd, 0, false, true, false);
        // crouch = 2
        this.animations[0][this.states.crouch][2] = new Animator(this.spritesheetLeft2, 1205, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][this.states.crouch][2] = new Animator(this.spritesheetRight2, 115, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch walk = 3
        this.animations[0][this.states.crouch_walk][2] = new Animator(this.spritesheetLeft2, 485, 240, 120, 80, 8, 0.085, 0, true, true, false);
        this.animations[1][this.states.crouch_walk][2] = new Animator(this.spritesheetRight2, -5, 240, 120, 80, 8, 0.085, 0, false, true, false);
        // crouch attack = 4
        this.animations[0][this.states.crouch_atk][2] = new Animator(this.spritesheetLeft2, 965, 160, 120, 80, 4, 0.08, 0, true, false, false);
        this.animations[1][this.states.crouch_atk][2] = new Animator(this.spritesheetRight2, -5, 160, 120, 80, 4, 0.08, 0, false, false, false);
        // crouch pluck = 6
        this.animations[0][this.states.crouch_shoot][2] = new Animator(this.spritesheetLeft2, 965, 1440, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_shoot][2] = new Animator(this.spritesheetRight2, -5, 1440, 120, 80, 4, 0.1, 0, false, false, false);
        // crouch shoot = 5
        this.animations[0][this.states.crouch_pluck][2] = new Animator(this.spritesheetLeft2, 965, 1600, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_pluck][2] = new Animator(this.spritesheetRight2, -5, 1600, 120, 80, 4, 0.1, 0, false, false, false);
        // roll = 7
        this.animations[0][this.states.roll][2] = new Animator(this.spritesheetLeft2, 0, 800, 120, 80, 12, this.animRollSpd, 0, true, false, false);
        this.animations[1][this.states.roll][2] = new Animator(this.spritesheetRight2, 0, 800, 120, 80, 12, this.animRollSpd, 0, false, false, false);
        // wall climb = 8
        this.animations[0][this.states.wall_climb][2] = new Animator(this.spritesheetLeft2, 608, 1120, 120, 80, 7, 0.1, 0, true, false, false);
        this.animations[1][this.states.wall_climb][2] = new Animator(this.spritesheetRight2, -8, 1120, 120, 80, 7, 0.1, 0, false, false, false);
        // wall hang = 9
        this.animations[0][this.states.wall_hang][2] = new Animator(this.spritesheetLeft2, 1323, 1200, 120, 80, 1, 0.2, 0, true, true, false);
        this.animations[1][this.states.wall_hang][2] = new Animator(this.spritesheetRight2, -3, 1200, 120, 80, 1, 0.2, 0, false, true, false);
        // wall slide = 10
        this.animations[0][this.states.wall_slide][2] = new Animator(this.spritesheetLeft2, 1081, 1280, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide][2] = new Animator(this.spritesheetRight2, -2, 1280, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump = 11
        this.animations[0][this.states.jump][2] = new Animator(this.spritesheetLeft2, 1085, 640, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump][2] = new Animator(this.spritesheetRight2, -5, 640, 120, 80, 3, 0.1, 0, false, false, false);
        // jump/fall inbetween = 12
        this.animations[0][this.states.jump_to_fall][2] = new Animator(this.spritesheetLeft2, 1205, 720, 120, 80, 2, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump_to_fall][2] = new Animator(this.spritesheetRight2, -5, 720, 120, 80, 2, 0.1, 0, false, false, false);
        // fall = 13
        this.animations[0][this.states.falling][2] = new Animator(this.spritesheetLeft2, 1085, 480, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.falling][2] = new Animator(this.spritesheetRight2, -5, 480, 120, 80, 3, 0.1, 0, false, true, false);
        // turn around = 14
        this.animations[0][this.states.turn_around][2] = new Animator(this.spritesheetLeft2, 1085, 1040, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.turn_around][2] = new Animator(this.spritesheetRight2, -5, 1040, 120, 80, 3, 0.1, 0, false, false, false);
        // slide = 15
        this.animations[0][this.states.slide][2] = new Animator(this.spritesheetLeft2, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][this.states.slide][2] = new Animator(this.spritesheetRight2, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);

        //attack combo (on ground or in air)
        //Note: Slash 1 is a faster attack but less damage. Slash 2 is slower but more damage
        //slash 1 = 16
        this.animations[0][this.states.attack1][2] = new Animator(this.spritesheetLeft2, 725, 0, 120, 80, 6, this.atkSpd, 0, true, false, false);
        this.animations[1][this.states.attack1][2] = new Animator(this.spritesheetRight2, -5, 0, 120, 80, 6, this.atkSpd, 0, false, false, false);
        //slash 2 = 17
        this.animations[0][this.states.attack2][2] = new Animator(this.spritesheetLeft2, 245, 0, 120, 80, 6, this.atkSpd2, 0, true, false, false);
        this.animations[1][this.states.attack2][2] = new Animator(this.spritesheetRight2, 475, 0, 120, 80, 6, this.atkSpd2, 0, false, false, false);
        //shoot = 18
        this.animations[0][this.states.shoot][2] = new Animator(this.spritesheetLeft2, 965, 1360, 120, 80, 4, this.bowSpd, 0, true, false, false);
        this.animations[1][this.states.shoot][2] = new Animator(this.spritesheetRight2, -5, 1360, 120, 80, 4, this.bowSpd, 0, false, false, false);
        // pluck = 19
        this.animations[0][this.states.pluck][2] = new Animator(this.spritesheetLeft2, 965, 1520, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.pluck][2] = new Animator(this.spritesheetRight2, -5, 1520, 120, 80, 4, 0.1, 0, false, false, false);

        // death = 19 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death][2] = new Animator(this.spritesheetLeft2, 365, 400, 120, 80, 9, 0.1, 0, true, false, false);
        this.animations[1][this.states.death][2] = new Animator(this.spritesheetRight2, -5, 400, 120, 80, 9, 0.1, 0, false, false, false);

        // revive animation (death in reverse)
        this.animations[0][this.states.revive][2] = new Animator(this.spritesheetLeft2, 365, 400, 120, 80, 9, 0.1, 0, false, false, false);
        this.animations[1][this.states.revive][2] = new Animator(this.spritesheetRight2, -5, 400, 120, 80, 9, 0.1, 0, true, false, false);


        //________________________________________________________NETHERITE___________________________________________________________________________

        //states: 1-10
        // idle = 0
        this.animations[0][this.states.idle][3] = new Animator(this.spritesheetLeft3, 245, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][this.states.idle][3] = new Animator(this.spritesheetRight3, -5, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run = 1
        this.animations[0][this.states.run][3] = new Animator(this.spritesheetLeft3, 245, 880, 120, 80, 10, this.animRunSpd, 0, true, true, false);
        this.animations[1][this.states.run][3] = new Animator(this.spritesheetRight3, -5, 880, 120, 80, 10, this.animRunSpd, 0, false, true, false);
        // crouch = 2
        this.animations[0][this.states.crouch][3] = new Animator(this.spritesheetLeft3, 1205, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][this.states.crouch][3] = new Animator(this.spritesheetRight3, 115, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch walk = 3
        this.animations[0][this.states.crouch_walk][3] = new Animator(this.spritesheetLeft3, 485, 240, 120, 80, 8, 0.085, 0, true, true, false);
        this.animations[1][this.states.crouch_walk][3] = new Animator(this.spritesheetRight3, -5, 240, 120, 80, 8, 0.085, 0, false, true, false);
        // crouch attack = 4
        this.animations[0][this.states.crouch_atk][3] = new Animator(this.spritesheetLeft3, 965, 160, 120, 80, 4, 0.08, 0, true, false, false);
        this.animations[1][this.states.crouch_atk][3] = new Animator(this.spritesheetRight3, -5, 160, 120, 80, 4, 0.08, 0, false, false, false);
        // crouch pluck = 6
        this.animations[0][this.states.crouch_shoot][3] = new Animator(this.spritesheetLeft3, 965, 1440, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_shoot][3] = new Animator(this.spritesheetRight3, -5, 1440, 120, 80, 4, 0.1, 0, false, false, false);
        // crouch shoot = 5
        this.animations[0][this.states.crouch_pluck][3] = new Animator(this.spritesheetLeft3, 965, 1600, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.crouch_pluck][3] = new Animator(this.spritesheetRight3, -5, 1600, 120, 80, 4, 0.1, 0, false, false, false);
        // roll = 7
        this.animations[0][this.states.roll][3] = new Animator(this.spritesheetLeft3, 0, 800, 120, 80, 12, this.animRollSpd, 0, true, false, false);
        this.animations[1][this.states.roll][3] = new Animator(this.spritesheetRight3, 0, 800, 120, 80, 12, this.animRollSpd, 0, false, false, false);
        // wall climb = 8
        this.animations[0][this.states.wall_climb][3] = new Animator(this.spritesheetLeft3, 608, 1120, 120, 80, 7, 0.1, 0, true, false, false);
        this.animations[1][this.states.wall_climb][3] = new Animator(this.spritesheetRight3, -8, 1120, 120, 80, 7, 0.1, 0, false, false, false);
        // wall hang = 9
        this.animations[0][this.states.wall_hang][3] = new Animator(this.spritesheetLeft3, 1323, 1200, 120, 80, 1, 0.2, 0, true, true, false);
        this.animations[1][this.states.wall_hang][3] = new Animator(this.spritesheetRight3, -3, 1200, 120, 80, 1, 0.2, 0, false, true, false);
        // wall slide = 10
        this.animations[0][this.states.wall_slide][3] = new Animator(this.spritesheetLeft3, 1081, 1280, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide][3] = new Animator(this.spritesheetRight3, -2, 1280, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump = 11
        this.animations[0][this.states.jump][3] = new Animator(this.spritesheetLeft3, 1085, 640, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump][3] = new Animator(this.spritesheetRight3, -5, 640, 120, 80, 3, 0.1, 0, false, false, false);
        // jump/fall inbetween = 12
        this.animations[0][this.states.jump_to_fall][3] = new Animator(this.spritesheetLeft3, 1205, 720, 120, 80, 2, 0.1, 0, true, false, false);
        this.animations[1][this.states.jump_to_fall][3] = new Animator(this.spritesheetRight3, -5, 720, 120, 80, 2, 0.1, 0, false, false, false);
        // fall = 13
        this.animations[0][this.states.falling][3] = new Animator(this.spritesheetLeft3, 1085, 480, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.falling][3] = new Animator(this.spritesheetRight3, -5, 480, 120, 80, 3, 0.1, 0, false, true, false);
        // turn around = 14
        this.animations[0][this.states.turn_around][3] = new Animator(this.spritesheetLeft3, 1085, 1040, 120, 80, 3, 0.1, 0, true, false, false);
        this.animations[1][this.states.turn_around][3] = new Animator(this.spritesheetRight3, -5, 1040, 120, 80, 3, 0.1, 0, false, false, false);
        // slide = 15
        this.animations[0][this.states.slide][3] = new Animator(this.spritesheetLeft3, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][this.states.slide][3] = new Animator(this.spritesheetRight3, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);

        //attack combo (on ground or in air)
        //Note: Slash 1 is a faster attack but less damage. Slash 2 is slower but more damage
        //slash 1 = 16
        this.animations[0][this.states.attack1][3] = new Animator(this.spritesheetLeft3, 725, 0, 120, 80, 6, this.atkSpd, 0, true, false, false);
        this.animations[1][this.states.attack1][3] = new Animator(this.spritesheetRight3, -5, 0, 120, 80, 6, this.atkSpd, 0, false, false, false);
        //slash 2 = 17
        this.animations[0][this.states.attack2][3] = new Animator(this.spritesheetLeft3, 245, 0, 120, 80, 6, this.atkSpd2, 0, true, false, false);
        this.animations[1][this.states.attack2][3] = new Animator(this.spritesheetRight3, 475, 0, 120, 80, 6, this.atkSpd2, 0, false, false, false);
        //shoot = 18
        this.animations[0][this.states.shoot][3] = new Animator(this.spritesheetLeft3, 965, 1360, 120, 80, 4, this.bowSpd, 0, true, false, false);
        this.animations[1][this.states.shoot][3] = new Animator(this.spritesheetRight3, -5, 1360, 120, 80, 4, this.bowSpd, 0, false, false, false);
        // pluck = 19
        this.animations[0][this.states.pluck][3] = new Animator(this.spritesheetLeft3, 965, 1520, 120, 80, 4, 0.1, 0, true, false, false);
        this.animations[1][this.states.pluck][3] = new Animator(this.spritesheetRight3, -5, 1520, 120, 80, 4, 0.1, 0, false, false, false);

        // death = 19 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death][3] = new Animator(this.spritesheetLeft3, 365, 400, 120, 80, 9, 0.1, 0, true, false, false);
        this.animations[1][this.states.death][3] = new Animator(this.spritesheetRight3, -5, 400, 120, 80, 9, 0.1, 0, false, false, false);

        // revive animation (death in reverse)
        this.animations[0][this.states.revive][3] = new Animator(this.spritesheetLeft3, 365, 400, 120, 80, 9, 0.1, 0, false, false, false);
        this.animations[1][this.states.revive][3] = new Animator(this.spritesheetRight3, -5, 400, 120, 80, 9, 0.1, 0, true, false, false);

    };
}
