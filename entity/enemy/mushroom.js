/**
 * 
 * Mushroom is a big entity about the size of the player.
 * Its attacks are slow but pack a punch.
 * 
 * Unique behavior: runs away after an attack
 */

class Mushroom extends AbstractEnemy {
    constructor(game, x, y) {
        super(game, x, y, STATS.MUSHROOM.NAME, STATS.MUSHROOM.MAX_HP, STATS.MUSHROOM.WIDTH, STATS.MUSHROOM.HEIGHT, STATS.MUSHROOM.SCALE);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png");

        //seting up animation states
        this.animations = []; // [state][direction]
        this.states = { idle: 0, death: 1, damaged: 2, attack: 3, move: 4 };
        this.directions = { left: 0, right: 1 };
        this.state = this.states.idle;
        this.direction = this.directions.left;

        //variables to control behavior
        this.canAttack = true;
        this.vulnerable = true;
        this.damagedCooldown = 0;
        this.runAway = false;
        this.attackCooldown = 0;

        this.damageValue = STATS.MUSHROOM.DAMAGE;

        //movement control on canvas
        this.fallAcc = 1500;
        this.collisions = { left: false, right: false, top: false, bottom: false };


        this.loadAnimations();
        this.updateBoxes();

    };
    // only use when attacking
    updateHB() {
        this.getOffsets();
        this.HB = new BoundingBox(this.x + (30 * this.scale), this.y + this.offsetyBB, this.width - (60 * this.scale), this.heightBB);
    };
    // use after any change to this.x or this.y
    updateBoxes() {
        this.lastBB = this.BB;
        this.getOffsets();
        this.AR = new BoundingBox(this.x + (40 * this.scale), this.y + this.offsetyBB, this.width - (80 * this.scale), this.heightBB);
        this.VB = new BoundingBox(this.x - (80 * this.scale), this.y, this.width + (160 * this.scale), this.height);
        this.BB = new BoundingBox(this.x + this.offsetxBB, this.y + this.offsetyBB, this.widthBB, this.heightBB);
    };
    // only used by updateHB and updateBoxes to get bounding boxes to fit properly
    getOffsets() {
        this.offsetxBB = 64 * this.scale;
        this.offsetyBB = 64 * this.scale;
        this.widthBB = 23 * this.scale;
        this.heightBB = 37 * this.scale;
    };

    loadAnimations() {
        let numDir = 2;
        let numStates = 5;
        for (var i = 0; i < numStates; i++) {
            this.animations.push([]);
            for (var j = 0; j < numDir; j++) {
                this.animations[i].push([]);
            }
        }
        // Animations  [state][direction]
        // Idle
        this.animations[this.states.idle][0] = new Animator(this.spritesheet, 0, 0, 150, 150, 4, 0.2, 0, true, true, false);
        this.animations[this.states.idle][1] = new Animator(this.spritesheet, 600, 0, 150, 150, 4, 0.2, 0, false, true, false);
        // Death
        this.animations[this.states.death][0] = new Animator(this.spritesheet, 0, 150, 150, 150, 4, 0.4, 0, true, false, false);
        this.animations[this.states.death][1] = new Animator(this.spritesheet, 600, 150, 150, 150, 4, 0.4, 0, false, false, false);
        // Damaged
        this.animations[this.states.damaged][0] = new Animator(this.spritesheet, 0, 300, 150, 150, 4, 0.15, 0, true, true, false);
        this.animations[this.states.damaged][1] = new Animator(this.spritesheet, 600, 300, 150, 150, 4, 0.15, 0, false, true, false);
        // Attack
        this.animations[this.states.attack][0] = new Animator(this.spritesheet, 0, 600, 150, 150, 8, 0.1, 0, true, false, false);
        this.animations[this.states.attack][1] = new Animator(this.spritesheet, 0, 450, 150, 150, 8, 0.1, 0, false, false, false);
        // Move
        this.animations[this.states.move][0] = new Animator(this.spritesheet, 0, 900, 150, 150, 8, 0.1, 0, true, true, false);
        this.animations[this.states.move][1] = new Animator(this.spritesheet, 0, 750, 150, 150, 8, 0.1, 0, false, true, false);
    };


    update() {
        const TICK = this.game.clockTick;
        const SCALER = 3;
        const MAX_RUN = 123 * SCALER;
        const ACC_RUN = 200.390625 * SCALER;
        const MAX_FALL = 270 * SCALER;

        if (this.dead) { //mushroom is dead play death animation and remove
            this.healthbar.removeFromWorld = true;
            this.state = this.states.death;
            this.HB = null; //so it cant attack while dead
            if (this.animations[this.state][this.direction].isDone()) {
                this.removeFromWorld = true;
            }

        } else { //not dead keep moving

            this.velocity.y += this.fallAcc * TICK;
            if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
            if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;
            if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
            if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;

            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            let knightInSight = false;
            let that = this;

            this.collisionWall();

            this.game.entities.forEach(function (entity) {
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
                if (entity.BB && entity instanceof Knight && that.AR.collide(entity.BB) && that.vulnerable) {
                    that.velocity.x = 0;
                    if (that.canAttack || !that.animations[that.states.attack][that.direction].isDone()) {
                        that.runAway = true;
                        that.canAttack = false;
                        that.state = that.states.attack;
                    }
                }
                //mushroom hit by something switch the state to damaged
                if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer && !that.HB) {
                    //entity.doDamage(that);
                    that.setDamagedState();
                }
            });

            this.game.entities.forEach(function (entity) {
                if (entity.BB && that.BB.collide(entity.BB) && entity instanceof Arrow && !that.HB) {
                    that.setDamagedState();
                }
            });

            // set respective velocities to 0 for environment collisions
            if (this.collisions.bottom && this.velocity.y > 0) this.velocity.y = 0;
            if (this.collisions.left && this.velocity.x < 0) this.velocity.x = 0;
            if (this.collisions.right && this.velocity.x > 0) this.velocity.x = 0;
            // handles the mushrooms attack cooldown
            if (!this.canAttack) {
                this.attackCooldown += TICK;
                if (this.attackCooldown >= 1.7) {
                    this.resetAnimationTimers(this.states.attack);
                    this.attackCooldown = 0;
                    this.canAttack = true;
                    this.runAway = false;
                }
            }

            // handles the mushrooms being hit cooldown
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
            // mushroom runs away after attacking
            if (this.runAway && that.animations[that.states.attack][that.direction].isDone()) {
                that.state = that.states.move;
                that.direction = that.direction == that.direction.left ? that.directions.right : that.directions.left;
                that.velocity.x = that.direction == that.directions.right ? that.velocity.x + MAX_RUN : that.velocity.x - MAX_RUN;
            } else if (this.animations[this.states.attack][this.direction].isHalfwayDone()) {
                this.updateHB();
            }
            // deleted HB when not attacking
            if (this.state != this.states.attack) this.HB = null;
            // set state to idle when the knight isnt in the vision box
            if (!knightInSight) {
                this.state = this.states.idle;
                this.velocity.x = 0;
            }
        }
    };

    getDamageValue() {
        return this.damageValue;
    }

    draw(ctx) {

        if (this.dead) {
            if (this.flickerFlag) {
                this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            }
            this.flickerFlag = !this.flickerFlag;
        } else {
            this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            this.healthbar.draw(ctx); //only show healthbar when not dead
        }
    };

    resetAnimationTimers(action) {
        this.animations[action][0].elapsedTime = 0;
        this.animations[action][1].elapsedTime = 0;
    }

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    }


};
