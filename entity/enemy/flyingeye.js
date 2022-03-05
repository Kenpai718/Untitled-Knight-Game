class FlyingEye extends AbstractEnemy {
    constructor(game, x, y, onGuard) {
        super(game, x, y, onGuard, STATS.FLYINGEYE.NAME, STATS.FLYINGEYE.MAX_HP, STATS.FLYINGEYE.WIDTH, STATS.FLYINGEYE.HEIGHT, STATS.FLYINGEYE.SCALE, STATS.FLYINGEYE.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/flyingeye.png");
        this.animations = [];
        this.loadAnimations();
        this.states = { idle: 0, attack1: 1, attack2: 2, attack3: 3, damaged: 4, death: 5 };
        this.directions = { right: 0, left: 1 };
        this.state = this.states.idle;
        this.direction = this.directions.left;
        this.phase = Math.floor(Math.random() * 6);
        this.elapsedTime = 0;

        //for random movements
        this.tick = 0;
        this.seconds = 0;
        this.doRandom = 0;

        //attack related
        this.vulnerable = true;
        this.damagedCooldown = 0;
        this.projectile = false;

        this.updateBoxes();
        this.lastBB = this.BB;
    }

    updateBoxes() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 70 * this.scale, this.y + 65 * this.scale, this.width, this.height);

        if (this.direction == 0) this.VB = new BoundingBox(this.BB.left - 20 * this.scale, this.BB.top - 100 * this.scale, 400 * this.scale, this.BB.height + 200 * this.scale);
        else this.VB = new BoundingBox(this.BB.right + 20 * this.scale - 400 * this.scale, this.BB.top - 100 * this.scale, 400 * this.scale, this.BB.height + 200 * this.scale);
        this.updateAR1();
        this.updateAR2();
        this.updateAR3();
    };

    updateAR1() {
        const arDim = { w: 75 * this.scale, h: 150 * this.scale };
        if (this.direction == 0)
            this.AR1 = new BoundingBox(this.BB.right - 20 * this.scale, (this.BB.top + this.BB.bottom) / 2 - arDim.h / 2 - 6 * this.scale, arDim.w, arDim.h);
        else this.AR1 = new BoundingBox(this.BB.left + 20 * this.scale - arDim.w, (this.BB.top + this.BB.bottom) / 2 - arDim.h / 2 - 6 * this.scale, arDim.w, arDim.h);
    }

    updateAR2() {
        const arDim = { w: 150 * this.scale, h: 150 * this.scale };
        if (this.direction == 0)
            this.AR2 = new BoundingBox(this.BB.right + 20 * this.scale, (this.BB.top + this.BB.bottom) / 2 - arDim.h / 2 - 6 * this.scale, arDim.w, arDim.h);
        else this.AR2 = new BoundingBox(this.BB.left - 20 * this.scale - arDim.w, (this.BB.top + this.BB.bottom) / 2 - arDim.h / 2 - 6 * this.scale, arDim.w, arDim.h);
    }

    updateAR3() {
        const arDim = { w: 230 * this.scale, h: 25 * this.scale }
        if (this.direction == 0)
            this.AR3 = new BoundingBox(this.BB.right + 100 * this.scale, (this.BB.top + this.BB.bottom) / 2 - arDim.h / 2 - 6 * this.scale, arDim.w, arDim.h);
        else this.AR3 = new BoundingBox(this.BB.left - 100 * this.scale - arDim.w, (this.BB.top + this.BB.bottom) / 2 - arDim.h / 2 + 5 * this.scale - 6 * this.scale, arDim.w, arDim.h);
    }

    checkCooldowns() {
        const TICK = this.game.clockTick;
        // flying eye attack cooldown
        if (!this.canAttack) {
            this.attackCooldown += TICK;
            if (this.attackCooldown >= 1.7) {
                this.resetAttack();
            }
        }
        // flying eye hit cooldown
        if (!this.vulnerable && this.state != this.states.attack2) {
            this.damagedCooldown += TICK;
            if (this.damagedCooldown >= PARAMS.DMG_COOLDOWN) {
                this.resetAnimationTimers(this.states.damaged);
                this.damagedCooldown = 0;
                this.canAttack = true;
                this.runAway = false;
                this.vulnerable = true;
                this.state = this.states.idle;
            }
        }
    }

    drawDebug(ctx) {
        super.drawDebug(ctx);
        ctx.strokeStyle = "magenta";
        this.drawBB(ctx, this.AR1);
        ctx.strokeStyle = "cyan";
        this.drawBB(ctx, this.AR2);
        ctx.strokeStyle = "yellow";
        this.drawBB(ctx, this.AR3);
    }

    drawBB(ctx, BB) {
        ctx.strokeRect(BB.left - this.game.camera.x, BB.top - this.game.camera.y, BB.width, BB.height);
    }


    checkEntityInteractions(dist, TICK) {
        let self = this;
        this.game.entities.forEach(function (entity) {
            let states = [];
            if (entity instanceof AbstractPlayer) {
                const dest = { x: entity.BB.left + entity.BB.width / 2, y: entity.BB.top + entity.BB.height / 2 };
                const init = { x: self.BB.left + self.BB.width / 2, y: self.BB.top + self.BB.height / 2 };
                const distX = dest.x - init.x;
                const distY = dest.y - init.y;
                const dist = Math.sqrt(distX * distX + distY * distY);
                if (self.state == self.states.idle) {
                    const state = self.states
                    if (self.AR1.collide(entity.BB)) {
                        states.push(state.attack1);
                        self.attacking = false;
                    }
                    if (self.AR2.collide(entity.BB)) {
                        states.push(state.attack2);
                    }
                    if (self.AR3.collide(entity.BB)) {
                        states.push(state.attack3);
                    }

                }
                if (states.length > 1 && Math.random() > 0.25) {
                    states.pop();
                }
                if (states.length > 0) {
                    let state = states.pop();
                    self.state = state;
                    if (state == self.states.attack2) {
                        const v = 400;
                        self.velocity.x = v * distX / dist;
                        self.velocity.y = v * distY / dist;
                    }
                    else {
                        self.velocity.x = 0;
                        self.velocity.y = 0;
                    }
                }
                let playerInVB = entity.BB && self.VB.collide(entity.BB);
                let playerAtkInVB = entity.HB != null && self.VB.collide(entity.HB);
                if (playerInVB || playerAtkInVB || self.aggro) {
                    self.playerInSight = playerInVB;
                    self.aggro = true;
                    let time = self.animations[self.state][self.direction].elapsedTime;
                    let frame = self.animations[self.state][self.direction].currentFrame();
                    let state = self.states;
                    let switchable = self.state != state.attack1 || self.state == state.attack1 && frame < 5;
                    if (distX > 0 && switchable) {
                        self.direction = self.directions.right;
                    }
                    else if (distX < 0 && switchable) {
                        self.direction = self.directions.left;
                    }
                    self.animations[self.state][self.direction].elapsedTime = time;

                    if (self.state == self.states.idle) {
                        const v = 400;
                        self.velocity.x = v * distX / dist;
                        self.velocity.y = v * distY / dist;
                    }
                    else if (self.state == self.states.attack1 && !switchable && !self.attacking) {
                        self.attacking = true;
                        const v = 800;
                        self.velocity.x = v * distX / dist;
                        self.velocity.y = v * distY / dist;
                    }
                }
                else {
                    if (self.state == self.state.attack1) {
                        self.velocity.x = 0;
                        self.velocity.y = 0;
                    }

                    if (self.state != self.states.idle)
                        self.resetAnimationTimers(self.state);
                    self.state = self.states.idle;
                    if (!self.onGuard)
                        self.doRandomMovement();
                    else {
                        self.velocity.x = 0;
                        self.velocity.y = 0;
                    }
                }

                // goblin hit by player switch to damaged state
                if (entity.HB && self.BB.collide(entity.HB) && !self.HB && self.vulnerable) {
                    self.setDamagedState();
                    self.resetAttack();
                }
            }


        });
        return dist;
    }

    /**
    * Hard reset all variables related to attacking
    */
    resetAttack() {
        this.resetAnimationTimers(this.states.attack1);
        this.resetAnimationTimers(this.states.attack2);
        this.resetAnimationTimers(this.states.attack3);
        this.attackCooldown = 0;
        this.canAttack = true;
        this.runAway = false;
    }

    resetAnimationTimers(action) {
        this.animations[action][0].elapsedTime = 0;
        this.animations[action][1].elapsedTime = 0;
    }

    getDamageValue() {
        if (this.state == this.states.attack1)
            return STATS.FLYINGEYE.DAMAGE * 1.5;
        else return STATS.FLYINGEYE.DAMAGE;
    }

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    }

    loadAnimations() {
        for (let i = 0; i < 6; i++) {
            this.animations.push([]);
            for (let j = 0; j < 2; j++) {
                this.animations.push([]);
            }
        }

        // idle
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 150, 150, 8, 0.15, 0, false, true, false);
        this.animations[0][1] = new Animator(this.spritesheet, -12, 150, 150, 150, 8, 0.15, 0, true, true, false);

        // attack 1
        this.animations[1][0] = new Animator(this.spritesheet, 0, 300, 150, 150, 8, 0.15, 0, false, false, false);
        this.animations[1][1] = new Animator(this.spritesheet, -12, 450, 150, 150, 8, 0.15, 0, true, false, false);

        // attack 2
        this.animations[2][0] = new Animator(this.spritesheet, 0, 600, 150, 150, 8, 0.15, 0, false, false, false);
        this.animations[2][1] = new Animator(this.spritesheet, -12, 750, 150, 150, 8, 0.15, 0, true, false, false);

        // attack 3
        this.animations[3][0] = new Animator(this.spritesheet, 0, 900, 150, 150, 6, 0.15, 0, false, false, false);
        this.animations[3][1] = new Animator(this.spritesheet, -12, 1050, 150, 150, 6, 0.15, 0, true, false, false);

        // get hit
        this.animations[4][0] = new Animator(this.spritesheet, 0, 1200, 150, 150, 4, 0.15, 0, false, false, false);
        this.animations[4][1] = new Animator(this.spritesheet, -12, 1350, 150, 150, 4, 0.15, 0, true, false, false);

        // dead
        this.animations[5][0] = new Animator(this.spritesheet, 0, 1500, 150, 150, 4, 0.15, 0, false, false, false);
        this.animations[5][1] = new Animator(this.spritesheet, -12, 1650, 150, 150, 4, 0.15, 0, true, false, false);

    }

    update() {
        let TICK = this.game.clockTick;
        this.seconds += TICK;
        if (this.dead) { // flying eye is dead play death animation and remove
            super.setDead();
        } else {
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            /**UPDATING BEHAVIOR*/
            let dist = { x: 0, y: 0 }; //the displacement needed between entities
            this.playerInSight = false; //set to true in environment collisions
            dist = super.checkEnvironmentCollisions(dist); //check if colliding with environment and adjust entity accordingly
            if (this.touchHole()) {
                dist.x = 0;
            }
            dist = this.checkSpikeCollisions(dist); //check if colliding with environment and adjust entity accordingly
            dist = this.checkEntityInteractions(dist, TICK); //move entity according to other entities
            dist = this.collideWithOtherEnemies(dist, TICK); // change speed based on other enemies
            this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
            this.checkCooldowns(TICK); //check and reset the cooldowns of its actions

            if (this.state == this.states.attack3) {
                if (this.animations[this.state][this.direction].currentFrame() == 3 && !this.projectile) {
                    if (this.direction == this.directions.right)
                        this.game.addEntity(new FlyingEyeProjectile(this.game, this.BB.right - 20 * this.scale, this.y + 53 * this.scale, this.direction));
                    else
                        this.game.addEntity(new FlyingEyeProjectile(this.game, this.BB.left + (20 - STATS.EYE_PROJECTILE.WIDTH * this.scale) * this.scale, this.y + 53 * this.scale, this.direction));
                    this.projectile = true;
                }
            }

            //do random movement while the player is not in sight
            if (!this.playerInSight && !this.onGuard) this.doRandomMovement();
            else {
            }
            super.setAggro(this.playerInSight);

            //set the attack hitbox if in an attack state and the attack frame is out
            const frame = this.animations[this.state][this.direction].currentFrame();
            if (this.state == this.states.attack1) {
                if (frame >= 5) this.updateHB();
                else this.HB = null;
            } else if (this.state == this.states.attack2) {
                if (frame >= 5) {
                    this.updateHB();
                    this.vulnerable = false;
                }
                else this.HB = null;
            } else {
                this.HB = null;
            }
        }
        this.animations[this.state][this.direction].update(TICK);
    }

    checkSpikeCollisions(dist) {
        let self = this;
        this.game.foreground1.forEach(function (entity) {
            if (entity instanceof Spike && self.BB.collide(entity.BB) && self.vulnerable) {
                dist.y -= 40 * self.scale;
                self.velocity.x = 0;
                self.velocity.y = 0;
                self.takeDamage(10, false);
                self.setDamagedState();
            }
        })
        return dist;
    }

    /**
     * When attackin place the hitbox directly in front of the goblin
     */
    updateHB() {
        const anim = this.animations[this.state][this.direction];
        const frame = anim.currentFrame();
        let width = 0;
        let height = 0;
        if (this.state == this.states.attack1) {
            width = this.BB.width * .75;
            height = this.BB.height;
            let xOffset = 10 * this.scale;
            if (this.direction == this.directions.left) {
                xOffset = -xOffset - width;
                this.HB = new BoundingBox(this.BB.right + xOffset, this.BB.top, width, height);
            }
            else
                this.HB = new BoundingBox(this.BB.left + xOffset, this.BB.top, width, height);
        }
        else {
            width = this.BB.width * 2;
            height = this.BB.height * 2;
            let offset = this.BB.width / 2;
            let xOffset = 3 * this.scale;
            if (this.direction == this.directions.left) {
                this.HB = new BoundingBox(this.BB.left - offset - xOffset, this.BB.top - offset - 5 * this.scale, width, height);
            }
            else this.HB = new BoundingBox(this.BB.left - offset + xOffset, this.BB.top - offset - 5 * this.scale, width, height);

        }
    };

    doRandomMovement() {
        if (this.seconds >= this.doRandom) {
            this.direction = Math.floor(Math.random() * 2);
            this.event = Math.floor(Math.random() * 6);
            this.state = this.states.idle;
            this.seconds = 0;
            let moveTrigger = 3; //0-6, higher the number the more often it moves
            if (this.event <= moveTrigger) {
                this.doRandom = Math.floor(Math.random() * 3);
                let angle = Math.random() * 2 * Math.PI;
                if (angle < Math.PI / 2 || angle > Math.PI * 3 / 2) {
                    this.direction = this.directions.right;
                }
                else if (angle > Math.PI / 2 && angle < Math.PI * 3 / 2) {
                    this.direction = this.directions.left;
                }

                //set velocities
                if (!this.onGuardDuty) {
                    this.velocity.x = 200 * Math.cos(angle);
                    this.velocity.y = 200 * Math.sin(angle);
                }
            }
            else {
                this.doRandom = Math.floor(Math.random() * 10);
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }

    }

    draw(ctx) {
        if (this.dead) {
            super.drawWithFadeOut(ctx, this.animations[this.states.death][this.direction]);
        } else {
            let anim = this.animations[this.state][this.direction];
            anim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            if (!anim.loop && anim.isDone()) {
                if (this.state == this.states.attack2)
                    this.vulnerable = true;
                this.resetAnimationTimers(this.state);
                this.projectile = false;
                this.state = this.states.idle;
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }
    }
}