class DemonSlime extends AbstractEnemy {
    constructor(game, x, y, guard) {
        super(game, x, y, guard, STATS.DEMON_SLIME.NAME, STATS.DEMON_SLIME.MAX_HP, STATS.DEMON_SLIME.WIDTH, STATS.DEMON_SLIME.HEIGHT, STATS.DEMON_SLIME.SCALE, STATS.DEMON_SLIME.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/demon_slime.png");

        this.states = { idle: 0, walk: 1, attack: 2, damaged: 3, death: 4, rebirth: 5 };
        this.directions = { left: 0, right: 1 };
        this.phases = { normal: 0, superHardAnnoyingTeleportingMode: 1 };
        this.state = this.states.idle;
        this.direction = this.directions.right;
        this.phase = this.phases.normal;

        this.runAwayDirection = this.directions.left;
        this.canAttack = true;
        this.vulnerable = true;
        this.canBeHit = true;
        this.runAway = false;
        this.damagedCooldown = 0;
        this.attackCooldown = 0;
        this.attackMaxCooldown = 3;
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
        if (this.direction == this.directions.left && this.state == this.states.attack) this.HB = new BoundingBox(this.x + this.offsetX - (85 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
        else if (this.direction == this.directions.right && this.state == this.states.attack) this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
        else if (this.state == this.states.rebirth) this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.width, this.BB.height);
    }

    updateBoxes() {
        this.lastBB = this.BB;
        this.getOffsets();
        this.VB = new BoundingBox(this.x + this.offsetX - (500 * this.scale), this.y + this.offsetY, this.width + (1000 * this.scale), this.height);
        this.BB = new BoundingBox(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
        if (this.direction == this.directions.left) this.AR = new BoundingBox(this.x + this.offsetX - (40 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (40 * this.scale)), this.height);
        else this.AR = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (40 * this.scale)), this.height);
    };

    loadAnimations() {
        this.animations = [];
        let numDir = 2;
        let numStates = 6;
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

        this.animations[this.states.damaged][this.directions.left] = new Animator(this.spritesheet, 0, 480, 288, 160, 5, 0.09, 0, false, false, false);
        this.animations[this.states.damaged][this.directions.right] = new Animator(this.spritesheet, 4896, 1280, 288, 160, 5, 0.09, 0, true, false, false);

        this.animations[this.states.death][this.directions.left] = new Animator(this.spritesheet, 0, 640, 288, 160, 22, 0.07, 0, false, false, false);
        this.animations[this.states.death][this.directions.right] = new Animator(this.spritesheet, 0, 1440, 288, 160, 22, 0.07, 0, true, false, false);

        this.animations[this.states.rebirth][this.directions.left] = new Animator(this.spritesheet, 0, 640, 288, 160, 22, 0.07, 0, true, false, false);
        this.animations[this.states.rebirth][this.directions.right] = new Animator(this.spritesheet, 0, 1440, 288, 160, 22, 0.07, 0, false, false, false);
    };

    update() {
        const TICK = this.game.clockTick;
        if (this.dead) {
            super.setDead();
        } else {
            if (this.hp <= ((this.max_hp / 4) * 3)) this.phase = this.phases.superHardAnnoyingTeleportingMode;
            if (this.hp <= (this.max_hp / 2)) this.attackMaxCooldown = 1;
            this.velocity.y += this.fallAcc * TICK;
            if (this.velocity.y >= this.myMaxFall) this.velocity.y = this.myMaxFall;
            if (this.velocity.y <= -this.myMaxFall) this.velocity.y = -this.myMaxFall;
            if (this.velocity.x >= this.myMaxSpeed) this.velocity.x = this.myMaxSpeed;
            if (this.velocity.x <= -this.myMaxSpeed) this.velocity.x = -this.myMaxSpeed;
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            let dist = { x: 0, y: 0 }; //the displacement needed between entities
            dist = super.checkEnvironmentCollisions(dist); //check if colliding with environment and adjust entity accordingly
            this.playerInSight = false; //set to true in environment collisions
            this.checkEntityInteractions(); //move entity according to other entities
            dist = this.collideWithOtherEnemies(dist, TICK); // change speed based on other enemies
            this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
            this.checkCooldowns(TICK); //check and reset the cooldowns of its actions
            this.checkHB();

            if (!this.playerInSight && !this.aggro) {
                this.state = this.states.idle;
                this.velocity.x = 0;
            }

            super.setAggro(this.playerInSight);
            super.updateVelocity();
            super.doJumpIfStuck(TICK);
            super.checkInDeathZone();
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

    checkHB() {
        if (this.state == this.states.attack || this.state == this.states.rebirth) {
            if (this.state == this.states.attack) {
                this.attackFrame = this.animations[this.state][this.direction].currentFrame();
                if (this.attackFrame >= 10 && this.attackFrame <= 12) this.updateHB();
            } else {
                this.updateHB();
            }
        } else {
            this.HB = null;
        }
    };

    checkEntityInteractions() {
        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {
                if (entity.HB && self.BB.collide(entity.HB) && (self.state == self.states.idle || self.state == self.states.walk)) {
                    self.setDamagedState();
                }
                if (entity.BB && self.AR.collide(entity.BB) && self.canBeHit) {
                    self.velocity.x = 0;
                    if (self.canAttack || !self.animations[self.states.attack][self.direction].isDone()) {
                        self.canAttack = false;
                        self.runAway = true;
                        self.state = self.states.attack;
                    }
                }
                if ((entity.BB && self.VB.collide(entity.BB)) || self.aggro) {
                    self.playerInSight = true;
                    self.aggro = true;
                    if (!self.AR.collide(entity.BB) && self.canAttack && self.canBeHit) {
                        self.direction = entity.BB.left < self.BB.left ? self.directions.left : self.directions.right;
                        if (self.phase != self.phases.normal) {
                            self.state = self.states.rebirth;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed : -self.myMaxSpeed;
                        } else {
                            self.state = self.states.walk;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed / 3 : -self.myMaxSpeed / 3;
                        }
                    }
                }
            }
        });
    };

    checkCooldowns(TICK) {
        if (!this.canAttack) {
            if (this.checkAnimationDone(this.states.attack)) {
                if (this.phase == this.phases.normal) {
                    this.state = this.states.walk;
                    this.direction = this.runAwayDirection;
                    this.velocity.x = this.direction == this.directions.right ? this.myMaxSpeed / 3 : -this.myMaxSpeed / 3;
                    this.attackCooldown += TICK;
                } else {
                    this.state = this.states.rebirth;
                    this.direction = this.runAwayDirection;
                    this.velocity.x = this.direction == this.directions.right ? this.myMaxSpeed : -this.myMaxSpeed;
                }
            }
            if (this.checkAnimationDone(this.states.rebirth)) {
                this.state = this.states.idle;
                this.direction = this.direction == this.directions.right ? this.directions.left : this.directions.right;
                this.velocity.x = 0;
                this.runAway = false;
                this.attackCooldown += TICK;
            }
            if (this.attackCooldown >= this.attackMaxCooldown) {
                this.runAwayDirection = this.runAwayDirection == this.directions.left ? this.directions.right : this.directions.left;
                this.attackFrame = 0;
                this.attackCooldown = 0;
                this.canAttack = true;
                this.runAway = false;
                this.resetAnimationTimers(this.states.rebirth);
                this.resetAnimationTimers(this.states.attack);
            }
        }
        if (!this.canBeHit) {
            this.damagedCooldown += TICK;
            if (this.state == this.states.idle || this.state == this.states.walk) this.state = this.states.damaged;
            if (this.checkAnimationDone(this.states.damaged) && !this.vulnerable) {
                this.state = this.states.idle;
            }
            if (this.damagedCooldown >= 0.45) {
                this.resetAnimationTimers(this.states.damaged);
                this.state = this.states.idle;
                this.damagedCooldown = 0;
                this.vulnerable = true;
                this.canBeHit = true;
            }
        }
    };

    resetAnimationTimers(action) {
        this.animations[action][this.directions.left].elapsedTime = 0;
        this.animations[action][this.directions.right].elapsedTime = 0;
    };

    checkAnimationDone(action) {
        return (this.animations[action][this.directions.left].isDone() || this.animations[action][this.directions.right].isDone());
    };

    setDamagedState() {
        if (this.canBeHit) {
            this.vulnerable = false;
            this.canBeHit = false;
        }
    };

    getDamageValue() {
        return STATS.DEMON_SLIME.DAMAGE;
    };
};
