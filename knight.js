class Knight {
    //game = engine, (x, y) = spawn cords
    constructor(game, x, y) {
        //setup spritesheets
        Object.assign(this, { game, x, y });
        this.game = game;
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
        this.action = this.DEFAULT_ACTION; //0 = idle, 1 = run
        //2 = crouch, 3 = crouch_walk, 4 = crouch_atk,
        //5 = roll, 6 = wall climb, 7 = wall hang, 8 = wallslide,
        //9-11 = jump, 12 = turn around, 13 = slide,
        //14 = attack1, 15 = attack2
        //16 = death


        //in game variables to keep track state of the MC
        //boolean to check whenever knight is doing a combo or not
        this.combo = false;
        this.inAir = false;
        this.doubleJump = true;




        //positioning
        this.scale = 3;
        this.x = x * this.scale;
        this.y = y;
        this.width = 120 * this.scale;
        this.height = 80 * this.scale;

        //physics
        //this.speed = 150; //temporary should be changed to only use velocity later
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 1500;
        this.groundLevel = 777; //temporary until a real ground is implemented

        //animations
        this.animations = [];
        this.loadAnimations();
        this.updateBB();

        // controls moved to game engine
        //controls (uses event.key)
        // this.left = "a";
        // this.right = "d";
        // this.down = "s";
        // this.up = "w";
        // this.jump = " "; //spacebar
        // this.attack = "p"; //TODO: change this to a left click later
        // this.roll = "Shift";
        // this.shoot = ;
    };

    loadAnimations() {
        let numDir = 2;
        let numStates = 17;
        for (var i = 0; i < numDir; i++) { //facing direction: left = 0, right = 1
            this.animations.push([]);
            for (var j = 0; j < numStates; j++) { //action
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
        this.animations[0][this.states.crouch_atk] = new Animator(this.spritesheetLeft, 960, 160, 120, 80, 4, 0.08, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.crouch_atk] = new Animator(this.spritesheetRight, 0, 160, 120, 80, 4, 0.08, 0, false, false, false); // loop should be false in actual implementation
        // roll = 5
        this.animations[0][this.states.roll] = new Animator(this.spritesheetLeft, 0, 800, 120, 80, 12, 0.083, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.roll] = new Animator(this.spritesheetRight, 0, 800, 120, 80, 12, 0.083, 0, false, false, false); // loop should be false in actual implementation
        // wall climb = 6
        this.animations[0][this.states.wall_climb] = new Animator(this.spritesheetLeft, 600, 1120, 120, 80, 7, 0.2, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.wall_climb] = new Animator(this.spritesheetRight, 0, 1120, 120, 80, 7, 0.2, 0, false, false, false); // loop should be false in actual implementation
        // wall hang = 7
        this.animations[0][this.states.wall_hang] = new Animator(this.spritesheetLeft, 1320, 1200, 120, 80, 1, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_hang] = new Animator(this.spritesheetRight, 0, 1200, 120, 80, 1, 0.1, 0, false, true, false);
        // wall slide
        this.animations[0][this.states.wall_slide] = new Animator(this.spritesheetLeft, 1080, 1320, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][this.states.wall_slide] = new Animator(this.spritesheetRight, 0, 1320, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump = 9 
        this.animations[0][this.states.jump] = new Animator(this.spritesheetLeft, 1080, 640, 120, 80, 3, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.jump] = new Animator(this.spritesheetRight, 0, 640, 120, 80, 3, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // jump/fall inbetween = 10
        this.animations[0][this.states.jump_to_fall] = new Animator(this.spritesheetLeft, 1200, 720, 120, 80, 2, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.jump_to_fall] = new Animator(this.spritesheetRight, 0, 720, 120, 80, 2, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // fall = 11
        this.animations[0][this.states.falling] = new Animator(this.spritesheetLeft, 1080, 480, 120, 80, 3, 0.1, 0, true, true, false); // loop because we dont know when knight stops falling
        this.animations[1][this.states.falling] = new Animator(this.spritesheetRight, 0, 480, 120, 80, 3, 0.1, 0, false, true, false); // loop because we dont know when knight stops falling
        // turn around = 12
        this.animations[0][this.states.turn_around] = new Animator(this.spritesheetLeft, 1080, 1040, 120, 80, 3, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.turn_around] = new Animator(this.spritesheetRight, 0, 1040, 120, 80, 3, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // slide = 13
        this.animations[0][this.states.slide] = new Animator(this.spritesheetLeft, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][this.states.slide] = new Animator(this.spritesheetRight, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);

        //attack combo (on ground or in air)
        //Note: Slash 1 is a faster attack but less damage. Slash 2 is slower but more damage
        //slash 1 = 14
        this.animations[0][this.states.attack1] = new Animator(this.spritesheetLeft, 240, 0, 120, 80, 6, 0.09, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.attack1] = new Animator(this.spritesheetRight, 0, 0, 120, 80, 6, 0.09, 0, false, false, false); // loop should be false in actual implementation
        //slash 2 = 15
        this.animations[0][this.states.attack2] = new Animator(this.spritesheetLeft, 720, 0, 120, 80, 6, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.attack2] = new Animator(this.spritesheetRight, 480, 0, 120, 80, 6, 0.1, 0, false, false, false); // loop should be false in actual implementation


        // death = 16 (special property so might be better to just have it called only when the player dies)
        this.animations[0][this.states.death] = new Animator(this.spritesheetLeft, 360, 400, 120, 80, 9, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][this.states.death] = new Animator(this.spritesheetRight, 0, 400, 120, 80, 9, 0.1, 0, false, false, false); // loop should be false in actual implementation
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
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
        const DOUBLE_JUMP_HEIGHT = 500;
        

        const MAX_FALL = 270 * SCALER;


        //choose animation based on keyboard input
        //this if statement is to make sure special states are not interrupted
        if (this.action != this.states.attack1 || this.action != this.states.attack2 || this.action != this.states.roll) {
            if (this.action != this.states.jump && !this.inAir) { //not in the air
                //horizontal movement
                this.velocity.x = 0;

                if (this.game.right && !this.game.down && !this.game.attack) { //run right
                    this.facing = this.dir.right;
                    this.action = this.states.run;

                    this.velocity.x += MAX_RUN;
                } else if (this.game.left && !this.game.down && !this.game.attack) { //run left
                    this.facing = this.dir.left;
                    this.action = this.states.run;

                    this.velocity.x -= MAX_RUN;
                } else if (this.game.down) { //crouch
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

                } else { //idle
                    this.action = this.DEFAULT_ACTION;
                }

                //jump press
                if (this.game.jump && !this.action.jump) {
                    this.action = this.states.jump; //jump (9-11)
                    //set jump distance
                    this.velocity.y -= JUMP_HEIGHT;
                    this.game.jump = false;
                    this.inAir = true;

                    // //logic to handle switching between jump animations
                    // if (this.animations[this.facing][this.states.falling].isDone()) { //done falling
                    //     //this.game.jump = false; //jump finished set to false
                    // } else if (this.animations[this.facing][this.states.jump_to_fall].isDone()) { //falling in between finished transition to falling
                    //     this.game.jump = false;
                    //     this.action = this.states.falling; //set to falling
                    // } else if (this.animations[this.facing][this.states.jump].isDone()) { //jump finished transition to falling
                    //     this.action = this.states.jump_to_fall; //set to falling-in-between
                    // }
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
                } else {
                    // do nothing
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


        //attack logic
        if (this.game.attack) {

            if (this.game.down) { //crouch attack
                this.action = this.states.crouch_atk;
            } else { //standing or jumping attack

                //set action based on combo counter.
                //If attack button was pressed more than once change action to the second attack after the animation is complete
                this.combo = (this.game.comboCounter > 1 && this.animations[this.facing][this.states.attack1].isDone()) ? true : false;
                this.action = (this.combo) ? this.states.attack2 : this.states.attack1; //if comboing switch to the second animation
            }


            let done = this.animations[this.facing][this.action].isDone();
            //console.log(this.action + " " + this.game.comboCounter + " " + this.combo);

            if (done) {

                //console.log(this.game.comboCounter);
                if (this.combo && this.action == this.states.attack1) { //continue combo after first attack
                    this.action = this.states.attack2;
                } else { //end attack
                    this.action = this.DEFAULT_ACTION; //back to idle
                    this.game.attack = false; //stop attackin
                }

                //to ensure the animation does not get stuck we reset the combo regardless
                this.resetCombo();

            }

        } else {
            //crouch attack
            this.resetAnimationTimers(this.states.crouch_atk);
            //slash 1 and 2
            this.resetAnimationTimers(this.states.attack1);
            this.resetAnimationTimers(this.states.attack2);
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


        //TODO: Temporary solution! Delete once there is a moving camera
        //this reset position if outside the canvas.
        if (this.x > this.game.surfaceWidth || this.x < 0) {
            this.x = 0;
            this.y = this.groundLevel;
        }

        //update position and bounding box
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
        this.updateBB();


        let buffer = 110; //for collision placement

        //do collisions detection here
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (that.velocity.y > 0) { // falling
                    if ((entity instanceof Ground) // landing
                        && (that.lastBB.bottom) >= entity.BB.top) { // was above last tick
                        //console.log("touched grass");
                        that.y = entity.BB.top - PARAMS.BLOCKWIDTH - buffer;

                        //touched ground so reset all jumping properties
                        that.inAir = false;
                        that.doubleJump = true;
                        if (that.action == that.states.jump || that.action == that.states.jump_to_fall || that.action == that.states.falling) {
                            that.action = that.DEFAULT_ACTION// set state to idle
                        }

                        //reset jump timers
                        that.resetAnimationTimers(that.states.jump);
                        that.resetAnimationTimers(that.states.jump_to_fall);
                        that.resetAnimationTimers(that.states.falling);

                    }

                    that.velocity.y === 0;

                    that.updateBB();
                }
            }


        });
    };

    draw(ctx) {
        this.animations[this.facing][this.action].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        //this.viewAllAnimations(ctx);

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
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
