class Knight {
    //game = engine, (x, y) = spawn cords
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

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
        this.action = this.DEFAULT_ACTION;
        //0 = idle, 1 = run
        //2 = crouch, 3 = crouch_walk, 4 = crouch_atk,
        //5 = roll, 6 = wall climb, 7 = wall hang, 8 = wallslide,
        //9-11 = jump,
        //12 = turn around, 13 = slide,
        //14 = attack1, 15 = attack2
        //16 = death

        //in game variables to keep track state of the MC
        //boolean to check whenever knight is doing a combo or not
        this.combo = false;
        this.inAir = false;
        this.doubleJump = true;
        this.numArrows = 100;

        //positioning
        this.scale = 3.12;
        this.width = 120 * this.scale;
        this.height = 80 * this.scale;

        // bounding box (hitbox) used for attacks
        this.HB = null;
        this.offsetxBB = 0;
        this.offsetyBB = 0;

        //physics
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 1500;
        this.collisions = { left: false, right: false, top: false, bottom: false };

        //animations
        this.animations = [];
        this.loadAnimations();
        this.updateBB();

    };

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
        this.animations[0][this.states.wall_climb] = new Animator(this.spritesheetLeft, 600, 1120, 120, 80, 7, 0.2, 0, true, false, false);
        this.animations[1][this.states.wall_climb] = new Animator(this.spritesheetRight, 0, 1120, 120, 80, 7, 0.2, 0, false, false, false);
        // wall hang = 7
        this.animations[0][this.states.wall_hang] = new Animator(this.spritesheetLeft, 1320, 1200, 120, 80, 1, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_hang] = new Animator(this.spritesheetRight, 0, 1200, 120, 80, 1, 0.1, 0, false, true, false);
        // wall slide
        this.animations[0][this.states.wall_slide] = new Animator(this.spritesheetLeft, 1080, 1320, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide] = new Animator(this.spritesheetRight, 0, 1320, 120, 80, 3, 0.1, 0, false, true, false);
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
        this.animations[0][this.states.attack1] = new Animator(this.spritesheetLeft, 240, 0, 120, 80, 6, 0.09, 0, true, false, false);
        this.animations[1][this.states.attack1] = new Animator(this.spritesheetRight, 0, 0, 120, 80, 6, 0.09, 0, false, false, false);
        //slash 2 = 15
        this.animations[0][this.states.attack2] = new Animator(this.spritesheetLeft, 720, 0, 120, 80, 6, 0.1, 0, true, false, false);
        this.animations[1][this.states.attack2] = new Animator(this.spritesheetRight, 480, 0, 120, 80, 6, 0.1, 0, false, false, false);

        // death = 16 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death] = new Animator(this.spritesheetLeft, 360, 400, 120, 80, 9, 0.1, 0, true, false, false);
        this.animations[1][this.states.death] = new Animator(this.spritesheetRight, 0, 400, 120, 80, 9, 0.1, 0, false, false, false);
    };

    getOffsets() {
        switch (this.action) {
            // idle, running and jumping BB offsets
            case this.states.idle:
            case this.states.run:
            case this.states.jump:
            case this.states.jump_to_fall:
            case this.states.falling:
                this.offsetxBB = this.facing == 1 ? 44 * this.scale : 55 * this.scale;
                this.offsetyBB = 41 * this.scale;
                this.widthBB = 21 * this.scale;
                this.heightBB = 39 * this.scale;
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
            case this.states.attack2:
                this.offsetxHB = this.facing == 1 ? 26 * this.scale : 14 * this.scale;
                this.offsetyHB = 35 * this.scale;
                this.widthHB = 80 * this.scale;
                this.heightHB = 45 * this.scale;
                break;
        }
    };

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

    update() {
        const TICK = this.game.clockTick;
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
        const CROUCH_SPD = 50 * SCALER;
        const DOUBLE_JUMP_X_BOOST = 10;
        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const STOP_FALL_A = 450;
        const WALK_FALL_A = 421.875;
        const RUN_FALL_A = 562.5;
        const JUMP_HEIGHT = 1500;
        const DOUBLE_JUMP_HEIGHT = 550;
        const MAX_FALL = 270 * SCALER;

        //choose animation based on keyboard input
        //this if statement is to make sure special states are not interrupted
        if (this.action != this.states.attack1 || this.action != this.states.attack2 || this.action != this.states.roll) {
            if (this.action != this.states.jump && !this.inAir) { //not in the air
                //horizontal movement
                this.velocity.x = 0;
                if (this.game.down) { //crouch
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
                } else if (this.game.right && !this.game.attack) { //run right
                    this.facing = this.dir.right;
                    this.action = this.states.run;
                    this.velocity.x += MAX_RUN;
                } else if (this.game.left && !this.game.attack) { //run left
                    this.facing = this.dir.left;
                    this.action = this.states.run;
                    this.velocity.x -= MAX_RUN;
                } else { //idle
                    this.action = this.DEFAULT_ACTION;
                }
                //jump press
                if (this.game.jump && !this.action.jump && !this.collisions.top) {
                    this.action = this.states.jump; //jump (9-11)
                    //set jump distance
                    this.velocity.y -= JUMP_HEIGHT;
                    this.game.jump = false;
                    this.inAir = true;
                }
            } else { //in the air
                // horizontal physics
                if (this.game.right && !this.game.left) {
                    if (Math.abs(this.velocity.x) > MAX_WALK) {
                        this.velocity.x += ACC_RUN * TICK;
                    } else this.velocity.x += ACC_WALK * TICK;
                } else if (this.game.left && !this.game.right) {
                    if (Math.abs(this.velocity.x) > MAX_WALK) {
                        this.velocity.x -= ACC_RUN * TICK;
                    } else this.velocity.x -= ACC_WALK * TICK;
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
                }

                //do a double jump if the player is not in a falling state
                if (this.doubleJump && this.game.jump && this.inAir && this.action != this.states.falling) {
                    this.doubleJump = false;
                    this.game.jump = false;
                    this.resetAnimationTimers(this.states.jump);
                    this.action = this.states.jump;
                    this.velocity.y -= DOUBLE_JUMP_HEIGHT;
                    if (this.facing == this.states.right) this.velocity += DOUBLE_JUMP_X_BOOST;
                    if (this.facing == this.states.left) this.velocity -= DOUBLE_JUMP_X_BOOST;
                }

            }
        }


        //attack logic (melee/ranged)
        if (this.game.attack) {

            if (this.game.down || this.collisions.top) { //crouch attack
                this.action = this.states.crouch_atk;
            } else { //standing or jumping attack

                //set action based on combo counter.
                //If attack button was pressed more than once change action to the second attack after the animation is complete
                this.combo = (this.game.comboCounter > 1 && this.animations[this.facing][this.states.attack1].isDone()) ? true : false;
                this.action = (this.combo) ? this.states.attack2 : this.states.attack1; //if comboing switch to the second animation
            }
            this.updateHB();

            let done = this.animations[this.facing][this.action].isDone();
            //console.log(this.action + " " + this.game.comboCounter + " " + this.combo);

            if (done) {

                //console.log(this.game.comboCounter);
                if (this.combo && this.action == this.states.attack1) { //continue combo after first attack
                    this.action = this.states.attack2;
                } else { //end attack
                    this.action = this.game.down ? this.states.crouch : this.DEFAULT_ACTION; //back to idle; added case for crouch attacks
                    this.HB = null;
                    this.game.attack = false; //stop attackin
                    // delete hitbox here
                }

                //to ensure the animation does not get stuck we reset the combo regardless
                this.resetCombo();

            }

        } else if (!this.game.attack && this.game.shoot) { //only shoot an arrow when not attacking

            if (this.numArrows > 0) {
                //try to position starting arrow at the waist of the knight
                const target = { x: this.game.mouse.x + this.game.camera.x, y: this.game.mouse.y };
                this.game.addEntityToFront(new Arrow(this.game, this.x + this.offsetxBB, (this.y + this.height / 2) + 40, target));
                this.numArrows--;

            }
            this.game.shoot = false;
            this.action = this.DEFAULT_ACTION;
            //}


        } else { //reset all attack animations
            //crouch attack
            this.resetAnimationTimers(this.states.crouch_atk);
            //slash 1 and 2
            this.resetAnimationTimers(this.states.attack1);
            this.resetAnimationTimers(this.states.attack2);

            //reset shooting animation
        }

        //roll input
        //this is placed last because the player should be able to cancel their animation to dodge
        if (this.game.roll && !this.inAir) {
            this.action = this.states.roll; //roll
            this.velocity.x += (this.facing == this.dir.left) ? -1 * (ROLL_SPD) : (ROLL_SPD); //movement speed boost
            if (this.animations[this.facing][this.states.roll].isDone()) {
                this.action = this.states.idle;
                this.game.roll = false;
            }
        } else {
            //roll
            this.resetAnimationTimers(this.states.roll);
        }


        //constant falling velocity
        this.velocity.y += this.fallAcc * TICK;


        // max y velocity
        if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

        //max x velocity
        let doubleJumpBonus = 0;
        if (!this.doubleJump) doubleJumpBonus = DOUBLE_JUMP_X_BOOST;
        if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN + doubleJumpBonus;
        if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN - doubleJumpBonus;

        //update position and bounding box
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
        this.updateBB();

        //do collisions detection here
        this.collisions = { left: false, right: false, top: false, bottom: false };
        let dist = { x: 0, y: 0 };
        let hole = 0; // at most 15, floor/ceil = 8, adj floor/ceil = 4, low wall = 2, high wall = 1
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                //collides with something in the environment
                if ((entity instanceof Ground || entity instanceof Walls || entity instanceof Brick || entity instanceof Platform)) {
                    // defines which sides are collided
                    if (that.BB.top < entity.BB.top && that.BB.bottom > entity.BB.top) { // checks if mainly bottom, left, or right collison
                        if (that.BB.left < entity.BB.left && Math.abs(that.BB.right - entity.BB.left) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                            that.collisions.right = true;
                            dist.x = entity.BB.left - that.BB.right;
                            hole += 2;
                        }
                        else if (that.BB.right > entity.BB.right && Math.abs(that.BB.left - entity.BB.right) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                            that.collisions.left = true;
                            dist.x = entity.BB.right - that.BB.left;
                            hole += 2;
                        }
                        else {
                            that.collisions.bottom = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                            if (that.BB.left <= entity.BB.left || that.BB.right >= entity.BB.right)
                                hole += 4;
                            else hole += 8;
                        }
                    }
                    else if (that.BB.bottom > entity.BB.bottom && that.BB.top < entity.BB.bottom) { // checks if mainly top, left, or right collison
                        if (that.BB.left < entity.BB.left && Math.abs(that.BB.right - entity.BB.left) <= Math.abs(that.BB.top - entity.BB.bottom)) {
                            that.collisions.right = true;
                            dist.x = entity.BB.left - that.BB.right;
                            hole += 1;
                        }
                        else if (that.BB.right > entity.BB.right && Math.abs(that.BB.left - entity.BB.right) <= Math.abs(that.BB.top - entity.BB.bottom)) {
                            that.collisions.left = true;
                            dist.x = entity.BB.right - that.BB.left;
                            hole += 1;
                        }
                        else {
                            that.collisions.top = true;
                            if (Math.abs(entity.BB.bottom - that.BB.top && !that.collisions.bottom) > Math.abs(dist.y))
                                dist.y = entity.BB.bottom - that.BB.top;
                            if (that.BB.left <= entity.BB.left || that.BB.right >= entity.BB.right)
                                hole += 4;
                            else hole += 8;
                        }
                    }
                }

                //player picks up arrow stuck on ground
                if (entity instanceof Arrow && entity.stuck) {
                    entity.removeFromWorld = true;
                    that.numArrows++;

                }
                that.updateBB();
            }
        });

        // used to debug the number for collision as well as which side are collided
        //console.log(hole + " " + this.collisions.top + " " + this.collisions.right + " " + this.collisions.bottom + " " + this.collisions.left);

        // instances where there are collisions along vertical, but need ignoring
        // all cases are when there's no definitive ceiling or floor (top/bottom collision as part of a wall)
        if ((hole <= 7 && hole != 4) || (this.collisions.top && (hole == 8 && (this.collisions.left || this.collisions.right)))) {
            dist.y = 0
            this.collisions.bottom = false;
            this.collisions.top = false;
        }
        // instances where there are collisons along horizontal, but need ignoring
        // currently only when there's a crawl space to allow auto-crawl
        if (this.collisions.bottom && hole == 9) {
            dist.x = 0;
            this.collisions.right = false;
            this.collisions.left = false;
        }

        // update position as a result of collision
        this.x += dist.x;
        this.y += dist.y;
        this.updateBB();

        // bottom collision
        if (this.collisions.bottom) {
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

                if (this.collisions.top) {  // only crawl under if the platform is above the character
                    // logic to make character crawl under obstacles
                    if (that.action == that.states.idle) {
                        that.action = that.states.crouch;
                    } else if (that.action == that.states.run) {
                        that.action = that.states.crouch_walk;
                        that.x -= that.velocity.x * TICK;
                        that.x = that.facing == 0 ? that.x - CROUCH_SPD * TICK : that.x + CROUCH_SPD * TICK;
                    }
                }
                this.updateBB();
            }
        }

        // top collison
        if (this.collisions.top) {
            if (this.velocity.y < 0) {
                this.y -= that.velocity.y * TICK;
                this.velocity.y = 0;
            }
            this.updateBB();
        }

        // left collison
        if (this.collisions.left) {
            if (this.velocity.x < 0)
                this.velocity.x = 0;
        }

        // right collison
        if (this.collisions.right) {
            if (this.velocity.x > 0)
                this.velocity.x = 0;
        }
    };

    isCrouched() {
        return this.action == this.states.crouch || this.action == this.states.crouch_walk || this.action == this.states.crouch_atk;
    }

    draw(ctx) {
        this.animations[this.facing][this.action].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, this.scale);
        //this.viewAllAnimations(ctx);

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        ctx.strokeStyle = "Green";
        if (this.HB != null) ctx.strokeRect(this.HB.x - this.game.camera.x, this.HB.y, this.HB.width, this.HB.height);
    }

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

    //reset the animation timer in both direction
    resetAnimationTimers(action) {
        this.animations[0][action].elapsedTime = 0;
        this.animations[1][action].elapsedTime = 0;
    }


    //reset the combocounter for an attack
    resetCombo() {
        this.combo = false;
        this.game.comboCounter = 0; //set combo counter to 0
    }

}
