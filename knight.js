class Knight {
    //game = engine, (x, y) = spawn cords
    constructor(game, x, y) {
        //setup spritesheets
        Object.assign(this, { game, x, y});
        this.game = game;
        this.spritesheetRight = ASSET_MANAGER.getAsset("./sprites/knight/knightRight.png");
        this.spritesheetLeft = ASSET_MANAGER.getAsset("./sprites/knight/knightLeft.png");

        //states
        this.facing = 1; //0 = left, 1 = right
        this.action = 0; //0 = idle, 1 = run, 2 = attack, 3 = crouch, 4 = crouch_atk
                         //5 = roll, 6 = crouch walk, 7 = death, 8 = wall climb
                         //9 = wall hang, 10 = wallslide, 11-13 = jump, 14 = turn around
                         //15 = slide

        //positioning
        this.scale = 3;
        this.x = x * this.scale;
        this.y = y;
        this.width = 120 * this.scale;
        this.height = 80 * this.scale;

        //physics
        this.speed = 150;
        this.velocity = {x:0, y:0};
        this.fallAcc = 500;
        this.groundLevel = y; //temporary until a real ground is implemented

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
        for (var i = 0; i < 2; i++) {
            this.animations.push([]);
            for (var j = 0; j < 16; j++){
                this.animations[i].push([]);
            }
        }
        // idle
        this.animations[0][0] = new Animator(this.spritesheetLeft, 240, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][0] = new Animator(this.spritesheetRight, 0, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run
        this.animations[0][1] = new Animator(this.spritesheetLeft, 240, 880, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][1] = new Animator(this.spritesheetRight, 0, 880, 120, 80, 10, 0.1, 0, false, true, false);
        // attack
        this.animations[0][2] = new Animator(this.spritesheetLeft, 240, 0, 120, 80, 10, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][2] = new Animator(this.spritesheetRight, 0, 0, 120, 80, 10, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // crouch
        this.animations[0][3] = new Animator(this.spritesheetLeft, 1200, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][3] = new Animator(this.spritesheetRight, 120, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch attack
        this.animations[0][4] = new Animator(this.spritesheetLeft, 960, 160, 120, 80, 4, 0.25, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][4] = new Animator(this.spritesheetRight, 0, 160, 120, 80, 4, 0.25, 0, false, false, false); // loop should be false in actual implementation
        // roll
        this.animations[0][5] = new Animator(this.spritesheetLeft, 0, 800, 120, 80, 12, 0.083, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][5] = new Animator(this.spritesheetRight, 0, 800, 120, 80, 12, 0.083, 0, false, false, false); // loop should be false in actual implementation
        // crouch walk
        this.animations[0][6] = new Animator(this.spritesheetLeft, 480, 240, 120, 80, 8, 0.1, 0, true, true, false);
        this.animations[1][6] = new Animator(this.spritesheetRight, 0, 240, 120, 80, 8, 0.1, 0, false, true, false);
        // death
        this.animations[0][7] = new Animator(this.spritesheetLeft, 360, 400, 120, 80, 9, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][7] = new Animator(this.spritesheetRight, 0, 400, 120, 80, 9, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // wall climb
        this.animations[0][8] = new Animator(this.spritesheetLeft, 600, 1120, 120, 80, 7, 0.2, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][8] = new Animator(this.spritesheetRight, 0, 1120, 120, 80, 7, 0.2, 0, false, false, false); // loop should be false in actual implementation
        // wall hang
        this.animations[0][9] = new Animator(this.spritesheetLeft, 1320, 1200, 120, 80, 1, 0.1, 0, true, true, false);
        this.animations[1][9] = new Animator(this.spritesheetRight, 0, 1200, 120, 80, 1, 0.1, 0, false, true, false);
        // wall slide
        this.animations[0][10] = new Animator(this.spritesheetLeft, 1080, 1320, 120, 80, 3, 0.1, 0, true, true, false);
        this.animations[1][10] = new Animator(this.spritesheetRight, 0, 1320, 120, 80, 3, 0.1, 0, false, true, false);
        // jump -> jump/fall inbetween -> fall
        // jump
        this.animations[0][11] = new Animator(this.spritesheetLeft, 1080, 640, 120, 80, 3, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][11] = new Animator(this.spritesheetRight, 0, 640, 120, 80, 3, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // jump/fall inbetween
        this.animations[0][12] = new Animator(this.spritesheetLeft, 1200, 720, 120, 80, 2, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][12] = new Animator(this.spritesheetRight, 0, 720, 120, 80, 2, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // fall
        this.animations[0][13] = new Animator(this.spritesheetLeft, 1080, 480, 120, 80, 3, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][13] = new Animator(this.spritesheetRight, 0, 480, 120, 80, 3, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // turn around
        this.animations[0][14] = new Animator(this.spritesheetLeft, 1080, 1040, 120, 80, 3, 0.1, 0, true, false, false); // loop should be false in actual implementation
        this.animations[1][14] = new Animator(this.spritesheetRight, 0, 1040, 120, 80, 3, 0.1, 0, false, false, false); // loop should be false in actual implementation
        // slide
        this.animations[0][15] = new Animator(this.spritesheetLeft, 960, 960, 120, 80, 4, 0.1, 0, true, true, false);
        this.animations[1][15] = new Animator(this.spritesheetRight, 0, 960, 120, 80, 4, 0.1, 0, false, true, false);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

        const TICK = this.game.clockTick;

        //currently using Chris Marriot's mario physics
        const MIN_WALK = 4.453125;
        const MAX_WALK = 93.75;
        const MAX_RUN = 153.75;
        const ACC_WALK = 133.59375;
        const ACC_RUN = 200.390625;
        const DEC_REL = 182.8125;
        const DEC_SKID = 365.625;
        const MIN_SKID = 33.75;

        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const STOP_FALL_A = 450;
        const WALK_FALL_A = 421.875;
        const RUN_FALL_A = 562.5;

        const MAX_FALL = 270;


        //choose animation based on keyboard input
        //horizontal movement
        if(this.game.right) { //run right
            this.facing = 1;
            this.action = 1;
            this.x += this.speed*this.game.clockTick
        }else if(this.game.left) { //run left
            this.facing = 0;
            this.action = 1;
            this.x -= this.speed*this.game.clockTick
        } else if(this.game.down) { //crouch
            this.action = 3;
            //TODO crouch left or right
        } else { //idle
            this.action = 0;
        }

        //other movement (roll or jump)
        //lumped together because you cannot roll and jump
        if(this.game.jump) {
            this.action = 11; //jump (11-13)
            if (this.animations[this.facing][13].isDone()) {
                this.game.jump = false;
            } else if (this.animations[this.facing][12].isDone()){
                this.action = 13;
            } else if (this.animations[this.facing][11].isDone()) {
                this.action = 12;
            }
        } else if(this.game.roll) {
            this.action  = 5; //roll
            if (this.animations[this.facing][this.action].isDone()) {
                this.action = 0;
                this.game.roll = false;
            }
        } else {
            // reset animation timers
            this.resetAnimationTimers(11);
            this.resetAnimationTimers(12);
            this.resetAnimationTimers(13);
            this.resetAnimationTimers(5);
        }


        //attack
        if (this.game.attack) {
            this.action = 2;
            if (this.animations[this.facing][this.action].isDone()) {
                this.action = 0;
                this.game.attack = false;
            }
        } else {
            this.resetAnimationTimers(2);
        }


        //TODO: Temporary solution! Delete once there is a moving camera
        //reset position if outside the canvas.
		if(this.x > this.game.surfaceWidth || this.x < 0) {
			this.x = 0;
			this.y = this.groundLevel;
		}

        //update position and bounding box
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
        this.updateBB();
    };

    draw(ctx) {
        this.animations[this.facing][this.action].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        //this.viewAllAnimations(ctx);

        if(PARAMS.DEBUG) {
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
    }

    resetAnimationTimers(action) {
        this.animations[0][action].elapsedTime = 0;
        this.animations[1][action].elapsedTime = 0;
    }

}
