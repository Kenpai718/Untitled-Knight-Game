/**
 *
 * Mushroom is a big entity about the size of the player.
 * Its attacks are slow but pack a punch.
 *
 * Unique behavior: runs away after an attack like a coward
 */
class Mushroom extends AbstractEnemy {
    constructor(game, x, y) {
        super(game, x, y, STATS.MUSHROOM.NAME, STATS.MUSHROOM.MAX_HP, STATS.MUSHROOM.WIDTH, STATS.MUSHROOM.HEIGHT, STATS.MUSHROOM.SCALE);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png");
        // seting up animation states
        this.animations = []; // [state][direction]
        this.states = { idle: 0, death: 1, damaged: 2, attack: 3, move: 4 };
        this.directions = { left: 0, right: 1 };
        this.state = this.states.idle;
        this.direction = this.directions.left;
        // variables to control behavior
        this.canAttack = true;
        this.vulnerable = true;
        this.aggro = false;
        this.runAway = false;
        this.damagedCooldown = 0;
        this.attackCooldown = 0;
        this.attackFrame = 0;
        // gravity
        this.fallAcc = 1500;

        this.loadAnimations();
        this.updateBoxes();
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
        // Idle
        this.animations[this.states.idle][this.directions.left] = new Animator(this.spritesheet, 0, 0, 150, 150, 4, 0.2, 0, true, true, false);
        this.animations[this.states.idle][this.directions.right] = new Animator(this.spritesheet, 600, 0, 150, 150, 4, 0.2, 0, false, true, false);
        // Death
        this.animations[this.states.death][this.directions.left] = new Animator(this.spritesheet, 0, 150, 150, 150, 4, 0.35, 0, true, false, false);
        this.animations[this.states.death][this.directions.right] = new Animator(this.spritesheet, 600, 150, 150, 150, 4, 0.35, 0, false, false, false);
        // Damaged
        this.animations[this.states.damaged][this.directions.left] = new Animator(this.spritesheet, 0, 300, 150, 150, 4, 0.15, 0, true, true, false);
        this.animations[this.states.damaged][this.directions.right] = new Animator(this.spritesheet, 600, 300, 150, 150, 4, 0.15, 0, false, true, false);
        // Attack
        this.animations[this.states.attack][this.directions.left] = new Animator(this.spritesheet, 0, 600, 150, 150, 8, 0.1, 0, true, false, false);
        this.animations[this.states.attack][this.directions.right] = new Animator(this.spritesheet, 0, 450, 150, 150, 8, 0.1, 0, false, false, false);
        // Move
        this.animations[this.states.move][this.directions.left] = new Animator(this.spritesheet, 0, 900, 150, 150, 8, 0.1, 0, true, true, false);
        this.animations[this.states.move][this.directions.right] = new Animator(this.spritesheet, 0, 750, 150, 150, 8, 0.1, 0, false, true, false);
    };

    update() {
        const TICK = this.game.clockTick;
        const SCALER = 3;
        const MAX_RUN = 123 * SCALER;
        const ACC_RUN = 200.390625 * SCALER;
        const MAX_FALL = 270 * SCALER;

        if (this.dead) { // mushroom is dead play death animation and remove
            this.healthbar.removeFromWorld = true;
            this.state = this.states.death;
            this.HB = null;
            if (this.animations[this.state][this.direction].isDone()) this.removeFromWorld = true;
        } else { // not dead keep moving
            // gravity
            this.velocity.y += this.fallAcc * TICK;
            // slow down bucko
            if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
            if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;
            if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
            if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
            // update position and boxes
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();
            // environment collision check
            this.collisionWall();
            // entity collision check
            this.knightInSight = false;
            this.checkEntityInteractions();
            // cooldown check
            this.checkCooldowns(TICK);
            // attack hitbox timing
            if (this.state == this.states.attack) {
                this.attackFrame = this.animations[this.state][this.direction].currentFrame();
                if (this.attackFrame >= 6) this.updateHB();
            } else {
                this.HB = null;
            }
            // what the mushroom does on its free time
            if (!this.knightInSight) {
                this.state = this.states.idle;
                this.velocity.x = 0;
            }
        }
    };

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

    // only use when attacking
    updateHB() {
        this.getOffsets();
        if (this.direction == this.directions.left) this.HB = new BoundingBox(this.x + (30 * this.scale), this.y + this.offsetyBB, (this.width - (60 * this.scale)) / 2, this.heightBB);
        else this.HB = new BoundingBox(this.x + (30 * this.scale) + ((this.width - (60 * this.scale)) / 2), this.y + this.offsetyBB, (this.width - (60 * this.scale)) / 2, this.heightBB);
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

    checkEntityInteractions() {
        let that = this;
        this.game.entities.forEach(function (entity) {
            // knight is in the vision box or was hit by an arrow
            if (entity.BB && entity instanceof Knight && (that.VB.collide(entity.BB) || that.aggro)) {
                that.knightInSight = true;
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
                that.aggro = false;
                that.velocity.x = 0;
                if (that.canAttack || !that.animations[that.states.attack][that.direction].isDone()) {
                    that.runAway = true;
                    that.canAttack = false;
                    that.state = that.states.attack;
                }
            }
            // mushroom hit by something switch the state to damaged
            if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer && that.attackFrame <= 2) {
                that.setDamagedState();
            }
        });
        // mushroom runs away after attacking
        // this must be with the collsion detection or it breaks for some reason
        if (this.runAway && (this.animations[this.states.attack][this.directions.left].isDone() || this.animations[this.states.attack][this.directions.right].isDone())) {
            this.state = this.states.move;
            this.direction = this.direction == this.direction.left ? this.directions.right : this.directions.left;
            this.velocity.x = this.direction == this.directions.right ? this.velocity.x + MAX_RUN : this.velocity.x - MAX_RUN;
        }
    };

    checkCooldowns(TICK) {
        // handles the mushrooms attack cooldown
        if (!this.canAttack) {
            this.attackCooldown += TICK;
            if (this.attackCooldown >= 1.7) {
                this.resetAnimationTimers(this.states.attack);
                this.attackFrame = 0;
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
    };

    resetAnimationTimers(action) {
        this.animations[action][this.directions.left].elapsedTime = 0;
        this.animations[action][this.directions.right].elapsedTime = 0;
    };

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    };

    getDamageValue() {
        return STATS.MUSHROOM.DAMAGE;
    };

};
