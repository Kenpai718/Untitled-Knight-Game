const SKELETON = {
    NAME: "Skeleton",
    MAX_HP: 100,
    SCALE: 2.5,
    WIDTH: 33 * this.scale,
    HEIGHT: 51 * this.scale,
    DAMAGE: 20
};

class Skeleton extends AbstractEnemy {

    constructor(game, x, y){
        
        super(game, x, y, STATS.SKELETON.NAME,  STATS.SKELETON.MAX_HP, STATS.SKELETON.WIDTH, STATS.SKELETON.HEIGHT, STATS.SKELETON.SCALE);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png");

       // Update settings
       this.tick = 0;
       this.seconds = 0;
       this.doRandom = 0;
       this.alert = false; // enemy is near or got hit

       // Physics
       this.fallAcc = 1500;
       this.collisions = {left: false, right: false, top: false, bottom: false};

       //variables to control behavior
       this.canAttack = true;
       this.vulnerable = true;
       this.damagedCooldown = 0;
       this.runAway = false;
       this.attackCooldown = 0;

       this.damageValue = STATS.SKELETON.DAMAGE;

       // Mapping animations and mob states
       this.animations = []; // [state][direction]
       this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4, run: 5};
       this.directions = {left: 0, right: 1 };
       this.direction = this.directions.left;
       this.state = this.states.idle;

        // Other
        this.loadAnimations();
        this.updateBoxes();
    };

    resetAnimationTimers(action) {
        this.animations[action][0].elapsedTime = 0;
        this.animations[action][1].elapsedTime = 0;
    }

    getDamageValue() {
        return this.damageValue;
    };

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    };

    updateHB() {
        if (this.direction == 0)    this.AR = new BoundingBox(this.x - 109, this.y-53, this.attackwidth, 57 * this.scale)
        else                        this.AR = new BoundingBox(this.x + 32, this.y-53, this.attackwidth, 57 * this.scale)
    };

    updateBoxes() {
        this.BB = new BoundingBox(this.x + 14 * this.scale, this.y-37, 21 * this.scale, 51 * this.scale)
        if (this.direction == 0)    this.AR = new BoundingBox(this.x - 109, this.y-53, this.attackwidth, 57 * this.scale)
        else                        this.AR = new BoundingBox(this.x + 32, this.y-53, this.attackwidth, 57 * this.scale)
        this.VB = new BoundingBox(this.x + 62 - this.visionwidth/2, this.y-37, this.visionwidth, this.height)

    }

    viewBoundingBox(ctx) { 
        // This is the Bounding Box, defines space where mob can be hit
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x + 14 * this.scale, this.y-37, 21 * this.scale, 51 * this.scale);
        
        // This is Attack Box, defines mob attack area
        ctx.strokeStyle = "Orange";
        this.attackwidth = 200;
        if (this.direction == 0)    ctx.strokeRect(this.x - 109, this.y-53, this.attackwidth, 57 * this.scale);
        else                        ctx.strokeRect(this.x + 32, this.y-53, this.attackwidth, 57 * this.scale);
        
        // This is Vision Box, allows mob to see player when it collides with player's hitbox
        this.visionwidth = 1200;
        ctx.strokeStyle = "Yellow";
        ctx.strokeRect(this.x + 62 - this.visionwidth/2, this.y-37, this.visionwidth, this.height);
        
    };

    update() {

        this.seconds += this.game.clockTick;


        const TICK = this.game.clockTick;
        const SCALER = 3;
        const MAX_RUN = 123 * SCALER;
        const ACC_RUN = 200.390625 * SCALER;
        const MAX_FALL = 270 * SCALER;

        if (this.dead) { // skeleton is dead play death animation and remove
            this.healthbar.removeFromWorld = true;
            this.state = this.states.death;
            this.HB = null; // so it cant attack while dead
            if (this.animations[this.state][this.direction].isDone()) {
                this.removeFromWorld = true;
            }

        } else { // not dead keep moving

            this.velocity.y += this.fallAcc * TICK;
            if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
            if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;
            if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
            if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;

            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            let dist = { x: 0, y: 0 };
            let that = this;
            let knightInSight = false;
            this.collisions = { left: false, right: false, top: false, bottom: false };
            this.game.entities.forEach(function (entity) {
                // collision with environment
                if (entity.BB && that.BB.collide(entity.BB) && (entity instanceof Ground || entity instanceof Walls || entity instanceof Platform || entity instanceof Brick)) {
                    if (that.BB.top < entity.BB.top && that.BB.bottom > entity.BB.top) {
                        if (that.BB.left < entity.BB.left && Math.abs(that.BB.right - entity.BB.left) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                            that.collisions.right = true;
                            dist.x = entity.BB.left - that.BB.right;
                        } else if (that.BB.right > entity.BB.right && Math.abs(that.BB.left - entity.BB.right) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                            that.collisions.left = true;
                            dist.x = entity.BB.right - that.BB.left;
                        } else {
                            that.collisions.bottom = true;
                            dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    that.updateBoxes();
                }
                // knight is in the vision box
                if (entity.BB && entity instanceof Knight && that.VB.collide(entity.BB)) {
                    knightInSight = true;
                    // knight is in the vision box and not in the attack range
                    if (!that.AR.collide(entity.BB)) {
                        // move towards the knight
                        that.state = that.states.move;
                        that.direction = entity.BB.right < that.BB.left ? that.directions.left : that.directions.right;
                        that.velocity.x = that.direction == that.directions.right ? that.velocity.x + MAX_RUN : that.velocity.x - MAX_RUN;
                    }
                }
                // knight is in attack range
                if (entity.BB && entity instanceof Knight && that.AR.collide(entity.BB)) {
                    that.velocity.x = 0;
                    if (that.canAttack || !that.animations[that.states.attack][that.direction].isDone()) {
                        that.runAway = true;
                        that.canAttack = false;
                        that.state = that.states.attack;
                    }
                }

                // skeleton hit by something switch the state to damaged
                if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer && !that.HB) {
                    //entity.doDamage(that);
                    that.setDamagedState();

                } else if (entity.BB && that.BB.collide(entity.BB) && entity instanceof Arrow && !that.HB) {
                    that.setDamagedState();
                }

            });
            // update positions based on environment collisions
            this.x += dist.x;
            this.y += dist.y;
            this.updateBoxes();
            // set respective velocities to 0 for environment collisions
            if (this.collisions.bottom && this.velocity.y > 0) this.velocity.y = 0;
            if (this.collisions.left && this.velocity.x < 0) this.velocity.x = 0;
            if (this.collisions.right && this.velocity.x > 0) this.velocity.x = 0;
            // skeleton attack cooldown
            if (!this.canAttack) {
                this.attackCooldown += TICK;
                if (this.attackCooldown >= 1.7) {
                    this.resetAnimationTimers(this.states.attack);
                    this.attackCooldown = 0;
                    this.canAttack = true;
                    this.runAway = false;
                }
            }
            // skeleton hit cooldown
            if (!this.vulnerable) {
                this.damagedCooldown += TICK;
                if (this.damagedCooldown >= PARAMS.DMG_COOLDOWN) {
                    this.resetAnimationTimers(this.states.damaged);
                    this.damagedCooldown = 0;
                    this.canAttack = true;
                    this.runAway = false;
                    this.vulnerable = true;
                }
            }
            // deleted HB when not attacking
            if (this.state != this.states.attack) this.HB = null;
            // Do something random when player isnt in sight 
            if (!knightInSight) {
                this.state = this.states.idle;
                this.velocity.x = 0;
            }
        }
        

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
        this.animations[0][0] = new Animator(this.spritesheet, 495, 50, 45, 51, 4, 0.7, -195, 0, 1, 0); // 0.7
        this.animations[0][1] = new Animator(this.spritesheet, 660, 50, 45, 51, 4, 0.7, 105, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 495, 348, 55, 53, 4, 0.1, -205, 0, 1, 0); //0.1
        this.animations[1][1] = new Animator(this.spritesheet, 650, 348, 55, 53, 4, 0.1, 95, 0, 1, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 492, 200, 56, 51, 4, 0.1, -206, 0, 0, 0); //0.1
        this.animations[2][1] = new Animator(this.spritesheet, 652, 200, 56, 51, 4, 0.1, 94, 0, 0, 0);

        // Attack Animations
        this.animations[3][0] = new Animator(this.spritesheet, 1052, 944, 95, 57, 8, 0.1, -245, 0, 1, 0); // 0.1
        this.animations[3][1] = new Animator(this.spritesheet, 53, 794, 95, 57, 8, 0.1, 55, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 495, 650, 45, 51, 4, 0.3, -195, 0, 1, 0); // 0.3?
        this.animations[4][1] = new Animator(this.spritesheet, 660, 650, 45, 51, 4, 0.3, 105, 0, 1, 0);

        // Block Animation 
        this.animations[5][0] = new Animator(this.spritesheet, 491, 505, 40, 46, 4, 0.2, -190, 0, 1, 0); // 0.2
        this.animations[5][1] = new Animator(this.spritesheet, 669, 505, 40, 46, 4, 0.2, 110, 0, 1, 0);
    };

    draw(ctx) {

        if (this.dead) {
            if (this.flickerFlag) {
                this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            }
            this.flickerFlag = !this.flickerFlag;
        } else {
            this.healthbar.draw(ctx); //only show healthbar when not dead
        
        switch(this.state) {
            case 0: // Idle
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x+10, this.y-37, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-37, this.scale);
                break;
            case 1: // Damaged
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-15, this.y-42, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-42, this.scale);
                break;
            case 2: // Death
                if(this.direction == 1) 
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-10, this.y-37, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-10, this.y-37, this.scale);
                break;
            case 3: // Attack
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-7, this.y-52, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-108, this.y-52, this.scale);
                break;
            case 4: // Move
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 10, this.y-37, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-37, this.scale);
                break;
            case 5: // Block
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 7, this.y-24, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 14, this.y-24, this.scale);
                break;
            }
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };
};