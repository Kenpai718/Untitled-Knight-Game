class Goblin {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");
        this.count = 0;
        
        // Mob sizes
        this.scale = 2.5; // 2.5
        this.width = 33 * this.scale;
        this.height = 36 * this.scale;

        // Update settings
        this.tick = 0;
        this.seconds = 0;
        this.doRandom = 0;
        this.alert = false; // enemy is near or got hit

        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 1500;
        this.collisions = {left: false, right: false, top: false, bottom: false};

        // Mapping animations and mob states
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4, run: 5};
        this.directions = {left: 0, right: 1 };
        this.animations = []; // [state][direction]

        this.state = 0;
        this.direction = 0;

        // Hit, Attack, and View boxes.
        this.AB = null;
        this.VB = null;
        this.BB = null;

        // When Debug box is true, select mob box to display
        this.displayBoundingbox = true;
        this.displayAttackbox = true;
        this.displayVisionbox = true;

        // Other
        this.loadAnimations();
        this.updateBB();
    };

    updateBB() {
        this.lastHitBox = this.BB;
        this.BB = new BoundingBox(this.x + 4 * this.scale, this.y + 2 * this.scale, 19 * this.scale, 34 * this.scale + 1)
        this.updateAB();
        this.updateVB();
    };

    updateAB() {
        this.updateVB();
        this.lastAttackbox = this.AB;
        if (this.direction == 0)    this.AB = new BoundingBox(this.x-71, this.y-24, this.attackwidth, 46 * this.scale)
        else                        this.AB = new BoundingBox(this.x-84, this.y-24, this.attackwidth, 46 * this.scale)
    };

    updateVB() {
        this.lastVisionbox = this.VB;
        this.VB = new BoundingBox(this.x + 32 - this.visionwidth/2, this.y, this.visionwidth, this.height + 1)
    };

    viewBoundingBox(ctx) { 
        if(this.displayBoundingbox) {        // This is the Bounding Box, defines space where mob can be hit
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.x + 4 * this.scale, this.y + 2 * this.scale, 19 * this.scale, 34 * this.scale + 1);
        }
        if(this.displayAttackbox) {     // This is Attack Box, defines mob attack area
            ctx.strokeStyle = "Orange";
            this.attackwidth = 89 * this.scale;
            if (this.direction == 0)    ctx.strokeRect(this.x-71, this.y-24, this.attackwidth, 46 * this.scale);
            else                        ctx.strokeRect(this.x-84, this.y-24, this.attackwidth, 46 * this.scale);
        }
        if(this.displayVisionbox) {      // This is Vision Box, allows mob to see player when it collides with player's hitbox
            this.visionwidth = 1400;
            ctx.strokeStyle = "Yellow";
            ctx.strokeRect(this.x + 32 - this.visionwidth/2, this.y, this.visionwidth, this.height + 1);
        }
    };

    update() { // physics

        this.seconds += this.game.clockTick;

        // All this aint me vv
        const TICK = this.game.clockTick;
        const SCALER = 1;
        //currently using Chris Marriot's mario physics
        const MIN_WALK = 1 * SCALER;
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

        // Collision variables
        this.collisions = {left: false, right: false, top: false, bottom: false};
        let dist = { x : 0, y : 0};
        let hole = 0; // at most 15, floor/ceil = 8, adj floor/ceil = 4, low wall = 2, high wall = 1
        let that = this;
        let knightInSight = false;

        // Collisions
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (that.BB.top < entity.BB.top && that.BB.bottom > entity.BB.top) { 
                    that.collisions.bottom = true;
                    dist.y = entity.BB.top - that.BB.bottom;
                }
                that.updateBB();
            }
            if (entity.BB && that.VB.collide(entity.BB) && !that.AB.collide(entity.BB) && entity instanceof Knight) {
                knightInSight = true;
                that.state = that.states.move;
                that.direction = entity.BB.right < that.BB.left ? that.directions.left : that.directions.right;
            }
            if (entity.BB && that.VB.collide(entity.BB) && that.AB.collide(entity.BB) && entity instanceof Knight) {
                knightInSight = true;
                that.state = that.states.attack;
                that.direction = entity.BB.right < that.BB.left ? that.directions.left : that.directions.right;
            }
        });
        this.y += dist.y;
        this.updateBB();
        if (this.collisions.bottom) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
            }
        }
        /*
        //Do something random player isnt in sight 
        if(!knightInSight){
            if(this.seconds >= this.doRandom){
                this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                this.direction = Math.floor(Math.random() * 2);
                this.action = Math.floor(Math.random() * 6);
                if(this.action <= 1) {
                    this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                    this.state = 4;
                }
                else {
                    this.state = 0;
                }
            }
        }
        


        // update velocity

        if(that.state = 4 && knightInSight) {
            if (this.direction == 0)    that.velocity.x -= MIN_WALK;
            else                        that.velocity.x += MIN_WALK;
        }
        */
        
        
    };

    loadAnimations() {

        let numDir = 2;
        let numStates = 6;
        for (var i = 0; i < numStates; i++) { //defines action
            this.animations.push([]);
            for (var j = 0; j < numDir; j++){ //defines directon: left = 0, right = 1
                this.animations[i].push([]);
            }
        }

        // Animations  [state][direction]

        // Idle Animation
        this.animations[0][0] = new Animator(this.spritesheet, 509, 65, 33, 36, 4, 0.14, -183, 0, 1, 0);    // 0.14 Animation Speed 
        this.animations[0][1] = new Animator(this.spritesheet, 658, 65, 33, 36, 4, 0.14, 117, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 504, 364, 42, 37, 4, 0.12, -192, 0, 0, 0);   // 0.12 Animation Speed
        this.animations[1][1] = new Animator(this.spritesheet, 654, 364, 42, 37, 4, 0.12, 108, 0, 0, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 491, 212, 74, 39, 4, 0.1, -230, 0, 0, 0);    // 0.1 Animation Speed
        this.animations[2][1] = new Animator(this.spritesheet, 640, 212, 74, 39, 4, 0.1, 82, 0, 0, 0);

        // Attack Animation
        this.animations[3][0] = new Animator(this.spritesheet, 1081, 655, 88, 46, 8, 0.06, -238, 0, 1, 0);  // 0.06 Animation Speed
        this.animations[3][1] = new Animator(this.spritesheet, 31, 505, 88, 46, 8, 0.06, 62, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.2, -188, 0, 1, 0);   // 0.1 Animation Speed
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.2, 112, 0, 1, 0);

        // Move Animation
        this.animations[5][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);   // 0.1 Animation Speed
        this.animations[5][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

    };



    draw(ctx) {

        switch(this.state) { // Prefecting Refections... Might just remove anyways.
            case 0: // Idle
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x -16, this.y, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case 1: // Damaged
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 25, this.y -2, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 13, this.y -2, this.scale);
                break;
            case 2: // Death
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-50, this.y-4, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-40, this.y-4, this.scale);
                break;
            case 3: // Attack
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-83, this.y-25, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-70, this.y-25, this.scale);
                break;
            case 4: // Move
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-20, this.y-5, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
                break;
            case 5: // Run
            if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-20, this.y-5, this.scale);
            else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
            break;
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }
    };

};