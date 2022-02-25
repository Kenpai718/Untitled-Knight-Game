class DemonSlime extends AbstractEnemy {
    constructor(game, x, y, guard) {
        super(game, x, y, guard, STATS.DEMON_SLIME.NAME, STATS.DEMON_SLIME.MAX_HP, STATS.DEMON_SLIME.WIDTH, STATS.DEMON_SLIME.HEIGHT, STATS.DEMON_SLIME.SCALE, STATS.DEMON_SLIME.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/demon_slime.png");
        this.animations = [];
        this.states = { idle: 0, walk: 1, attack: 2, damaged: 3, death: 4 };
        this.directions = { left: 0, right: 1 };
        this.state = this.states.idle;
        this.direction = this.directions.right;
        this.scale = STATS.DEMON_SLIME.SCALE;
        this.canAttack = true;
        this.vulnerable = true;
        this.damagedCooldown = 0;
        this.attackCooldown = 0;
        this.attackFrame = 0;
        this.fallAcc = 1500;
        this.loadAnimations();
        this.updateBoxes();
    };

    getOffsets() {
        this.offsetX = 100 * this.scale;
        this.offsetY = 72 * this.scale;
        this.width = (STATS.DEMON_SLIME.WIDTH * this.scale) / 3.7;
        this.height = (STATS.DEMON_SLIME.HEIGHT * this.scale) / 1.845;
    };

    updateHB() {
        this.getOffsets();
        if (this.direction == this.directions.left) this.HB = new BoundingBox(this.x + this.offsetX - (85 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
        else this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
    }

    updateBoxes() {
        this.lastBB = this.BB;
        this.getOffsets();
        this.AR = new BoundingBox(this.x + this.offsetX - (70 * this.scale), this.y + this.offsetY, this.width + (140 * this.scale), this.height);
        this.VB = new BoundingBox(this.x + this.offsetX - (180 * this.scale), this.y + this.offsetY, this.width + (360 * this.scale), this.height);
        this.BB = new BoundingBox(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
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
        this.animations[this.states.idle][this.directions.left] = new Animator(this.spritesheet, 0, 0, 288, 160, 6, 0.1, 0, false, true, false);
        this.animations[this.states.idle][this.directions.right] = new Animator(this.spritesheet, 4608, 800, 288, 160, 6, 0.1, 0, true, true, false);

        this.animations[this.states.walk][this.directions.left] = new Animator(this.spritesheet, 0, 160, 288, 160, 12, 0.1, 0, false, true, false);
        this.animations[this.states.walk][this.directions.right] = new Animator(this.spritesheet, 2880, 960, 288, 160, 12, 0.1, 0, true, true, false);

        this.animations[this.states.attack][this.directions.left] = new Animator(this.spritesheet, 0, 320, 288, 160, 15, 0.1, 0, false, false, false);
        this.animations[this.states.attack][this.directions.right] = new Animator(this.spritesheet, 2016, 1120, 288, 160, 15, 0.1, 0, true, false, false);

        this.animations[this.states.damaged][this.directions.left] = new Animator(this.spritesheet, 0, 480, 288, 160, 5, 0.1, 0, false, false, false);
        this.animations[this.states.damaged][this.directions.right] = new Animator(this.spritesheet, 4896, 1280, 288, 160, 5, 0.1, 0, true, false, false);

        this.animations[this.states.death][this.directions.left] = new Animator(this.spritesheet, 0, 640, 288, 160, 22, 0.1, 0, false, false, false);
        this.animations[this.states.death][this.directions.right] = new Animator(this.spritesheet, 0, 1440, 288, 160, 22, 0.1, 0, true, false, false);
    };

    update() {
        const TICK = this.game.clockTick;
        if (this.dead) {
            super.setDead();
        } else {
            this.velocity.y += this.fallAcc * TICK;
            if (this.velocity.y >= this.myMaxFall) this.velocity.y = this.myMaxFall;
            if (this.velocity.y <= -this.myMaxFall) this.velocity.y = -this.myMaxFall;
            if (this.velocity.x >= this.myMaxSpeed) this.velocity.x = this.myMaxSpeed;
            if (this.velocity.x <= -this.myMaxSpeed) this.velocity.x = -this.myMaxSpeed;
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            let dist = { x: 0, y: 0 }; //the displacement needed between entities
            this.playerInSight = false; //set to true in environment collisions
            dist = super.checkEnvironmentCollisions(dist); //check if colliding with environment and adjust entity accordingly
            this.checkEntityInteractions(); //move entity according to other entities
            dist = this.collideWithOtherEnemies(dist, TICK); // change speed based on other enemies
            this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
            this.checkCooldowns(TICK); //check and reset the cooldowns of its actions

            // attack hitbox timing
            if (this.state == this.states.attack) {
                this.attackFrame = this.animations[this.state][this.direction].currentFrame();
                if (this.attackFrame >= 6) this.updateHB();
            } else {
                this.state = this.states.idle;
                this.HB = null;
            }

            // what the mushroom does on its free time
            if (!this.playerInSight && !this.aggro) {
                this.state = this.states.idle;
                this.velocity.x = 0;
            }

            super.setAggro(this.playerInSight);
            super.updateVelocity();
            super.doJumpIfStuck(TICK); //jump if stuck horizontally
            super.checkInDeathZone();  //die if below blastzone
        }
        this.animations[this.state][this.direction].update(TICK);
    };

    draw(ctx) {
        if (this.dead) {
            super.drawWithFadeOut(ctx, this.animations[this.state][this.direction]);
        } else {
            this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            this.healthbar.draw(ctx); //only show healthbar when not dead
        }
    };

    checkEntityInteractions() {
        let self = this;
        this.game.entities.forEach(function (entity) {
            // knight is in the vision box or was hit by an arrow
            if (entity instanceof AbstractPlayer) {
                let playerInVB = entity.BB && self.VB.collide(entity.BB);
                let playerAtkInVB = entity.HB != null && self.VB.collide(entity.HB);
                if (playerInVB || playerAtkInVB || self.aggro) {
                    self.playerInSight = playerInVB;
                    self.aggro = true;
                    // knight is in the vision box and not in the attack range
                    if (!self.AR.collide(entity.BB) && self.state != self.states.damaged && (self.state != self.states.attack || self.state == self.states.attack && self.animations[self.state][self.direction].currentFrame() < 3)) {
                        // move towards the knight
                        self.state = self.states.walk;
                        self.direction = entity.BB.right < self.BB.left ? self.directions.left : self.directions.right;
                        self.velocity.x = self.direction == self.directions.right ? self.velocity.x + self.myMaxSpeed : self.velocity.x - self.myMaxSpeed;
                    }
                }
                // knight is in attack range
                if (entity.BB && self.AR.collide(entity.BB) && self.vulnerable) {
                    self.velocity.x = 0;
                    self.state = self.states.idle;
                    if (self.canAttack || !self.animations[self.states.attack][self.direction].isDone()) {
                        self.canAttack = false;
                        self.state = self.states.attack;
                    }
                }

                if (entity.HB && self.BB.collide(entity.HB) && self.attackFrame <= 2) {
                    self.setDamagedState();
                }
            }
        });
    };

    checkCooldowns(TICK) {
        // handles the mushrooms attack cooldown
        if (!this.canAttack) {
            this.attackCooldown += TICK;
            if (this.attackCooldown >= 4.5) {
                this.resetAnimationTimers(this.states.attack);
                this.attackFrame = 0;
                this.attackCooldown = 0;
                this.canAttack = true;
            }
        }
        // handles the mushrooms being hit cooldown
        if (!this.vulnerable) {
            this.damagedCooldown += TICK;
            if (this.damagedCooldown >= PARAMS.DMG_COOLDOWN) {
                this.resetAnimationTimers(this.states.damaged);
                this.state = this.states.move;
                this.damagedCooldown = 0;
                this.canAttack = true;
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
        return STATS.DEMON_SLIME.DAMAGE;
    };
};
