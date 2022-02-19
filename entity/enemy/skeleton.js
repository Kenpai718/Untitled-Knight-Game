/**
 * Skeleton is a entity about the size of the player. It's attacks are rather slow.
 * It doesn't have self much hp, but it has a shield to reduce damage.
 *
 * Unique behavior: Switching between shield and attack mode when in range
 * At half HP it will keep its shield up during the idle.
 *
 */

class Skeleton extends AbstractEnemy {

    constructor(game, x, y, onGuard) {

        super(game, x, y, onGuard, STATS.SKELETON.NAME, STATS.SKELETON.MAX_HP, STATS.SKELETON.WIDTH, STATS.SKELETON.HEIGHT, STATS.SKELETON.SCALE, STATS.SKELETON.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png");

        // Update settings
        this.tick = 0;
        this.seconds = 0;
        this.doRandom = 0;
        this.alert = false; // enemy is near or got hit

        // Physics
        this.fallAcc = 1500;
        this.collisions = { left: false, right: false, top: false, bottom: false };

        //variables to control behavior
        this.canAttack = true;
        this.vulnerable = true;
        this.damagedCooldown = 0;
        this.runAway = false;
        this.attackCooldown = 0;
        this.playerInSight = false;
        this.myRoamRate = 3; //0-10 on how often


        //unique shielding behavior
        this.switchTimer = 0;
        this.phaseSwitchTime = 1;
        this.blockTimer = 0;
        this.blocking = false; //blocking state
        this.combatPhase = "block"; //block or attack string

        this.attackwidth = 200;
        this.visionwidth = 1200;

        this.damageValue = STATS.SKELETON.DAMAGE;

        // Mapping animations and mob states
        this.animations = []; // [state][direction]
        this.states = { idle: 0, damaged: 1, death: 2, attack: 3, move: 4, block: 5 };
        this.directions = { left: 0, right: 1 };
        this.direction = this.directions.left;
        this.state = this.states.idle;

        // Enemy drop
        this.dropDiamonds = false;
        this.dropAmount = randomInt(4) + 1;

        // Other
        this.loadAnimations();
        this.updateBoxes();
    };

    updateHB() {
        let offsetxBB = 30 * this.scale;
        let offsetyBB = 20 * this.scale;
        let heightBB = (this.height / 3) * this.scale;

        if (this.direction == this.directions.left) offsetxBB = (offsetxBB * -1) - (this.width / 2); //flip hitbox offset
        this.HB = new BoundingBox(this.x + offsetxBB, this.y - offsetyBB, this.width * 1.5, heightBB);
    };


    updateBoxes() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 14 * this.scale, this.y - 37, 21 * this.scale, 51 * this.scale)
        if (this.direction == 0) this.AR = new BoundingBox(this.x - 109, this.y - 53, this.attackwidth, 57 * this.scale)
        else this.AR = new BoundingBox(this.x + 32, this.y - 53, this.attackwidth, 57 * this.scale)

        if (this.direction == 0) this.VB = new BoundingBox((this.x - this.visionwidth / 2) + 150, this.y - 37, this.visionwidth / 2, this.height)
        else this.VB = new BoundingBox((this.x + this.visionwidth / 2) - 650, this.y - 37, this.visionwidth / 2, this.height)

    }

    update() {

        this.seconds += this.game.clockTick;
        const TICK = this.game.clockTick;

        if (this.dead) { // skeleton is dead play death animation and remove
            super.setDead();
        } else { // not dead keep moving
            this.velocity.y += this.fallAcc * TICK; //constant falling

            //set maximum speeds
            if (this.velocity.y >= this.myMaxFall) this.velocity.y = this.myMaxFall;
            if (this.velocity.y <= -this.myMaxFall) this.velocity.y = -this.myMaxFall;
            if (this.velocity.x >= this.myMaxSpeed) this.velocity.x = this.myMaxSpeed;
            if (this.velocity.x <= -this.myMaxSpeed) this.velocity.x = -this.myMaxSpeed;

            //update cordinate based on velocity
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            /**UPDATING BEHAVIOR*/
            let dist = { x: 0, y: 0 }; //the displacement needed between entities
            this.playerInSight = false; //set to true in environment collisions
            dist = super.checkEnvironmentCollisions(dist); //check if colliding with environment and adjust entity accordingly
            dist = this.checkEntityInteractions(dist, TICK); //move entity according to other entities
            dist = this.collideWithOtherEnemies(dist, TICK); // change speed based on other enemies
            this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
            this.checkCooldowns(TICK); //check and reset the cooldowns of its actions

            //set the attack hitbox if in an attack state and the attack frame is out
            if (this.state == this.states.attack) {
                const frame = this.animations[this.state][this.direction].currentFrame();
                if (frame >= 6 && frame <= 8) this.updateHB();
                else this.HB = null;
            } else {
                this.HB = null;
            }

            //do random movement while the player is not in sight and not on guardduty
            if (!this.playerInSight) this.doRandomMovement(this.myRoamRate);

            super.setAggro(this.playerInSight);
            super.updateVelocity();
            super.doJumpIfStuck(TICK); //jump if stuck horizontally
            super.checkInDeathZone();  //die if below blastzone

        }


    };

    /**
     * Checks interactions with entities.
     * Also controls how the entity will move/act
     *
     * @param {} dist
     * @param {*} TICK
     * @returns
     */
    checkEntityInteractions(dist, TICK) {
        let self = this;
        /**
          * Interactions with entities
          */
        this.game.entities.forEach(function (entity) {

            //player interactions
            if (entity instanceof AbstractPlayer) {
                // knight is in the vision box or hit by an arrow
                let playerInVB = entity.BB && self.VB.collide(entity.BB);
                let playerAtkInVB = entity.HB && self.VB.collide(entity.HB);
                if (playerInVB || playerAtkInVB || self.aggro) {
                    self.playerInSight = playerInVB;
                    self.aggro = true;
                    // knight is in the vision box and not in the attack range
                    if (!self.AR.collide(entity.BB) && self.state != self.states.damaged && (self.state != self.states.attack || self.state == self.states.attack && self.animations[self.state][self.direction].currentFrame() < 3)) {
                        // move towards the knight
                        self.state = self.states.move;
                        self.direction = entity.BB.right < self.BB.left ? self.directions.left : self.directions.right;
                        self.velocity.x = self.direction == self.directions.right ? self.velocity.x + self.myMaxSpeed : self.velocity.x - self.myMaxSpeed;

                        //reset action states
                        self.setAttackState(false);
                        self.setBlockState(false);
                    }
                }

                // knight is in attack range
                let inAttackRange = entity.BB && self.AR.collide(entity.BB);
                if (inAttackRange) {
                    self.velocity.x = 0;

                    self.switchTimer += TICK;

                    //switch the combat phase after reaching time
                    if (self.switchTimer >= self.phaseSwitchTime && self.state != self.states.damaged) {
                        self.switchTimer = 0; //reset timer
                        self.switchPhase();

                    }

                    //do an attack or block
                    if (!self.state != self.states.damaged) self.setCombatPhase();

                }

                // skeleton hit by something switch the state to damaged
                let isHit = entity.HB && self.BB.collide(entity.HB) && !self.HB;
                if (isHit) {
                    //entity.doDamage(self);
                    if (!self.blocking) {
                        self.setDamagedState();
                    } else {
                        //console.log("hit skeleton's shield");
                    }
                }
            }

        });

        return dist;
    }

    /**
     * Updates the cooldowns of entity actions
     * based on ticks
     * @param {*} TICK
     */
    checkCooldowns(TICK) {
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
                this.setCombatPhase();
                this.damagedCooldown = 0;
                this.canAttack = true;
                this.runAway = false;
                this.vulnerable = true;
            }
        }
    }

    /**
     * Do random movement like switching directions or walking
     * UNIQUE: overrides behavior so skeleton shields at low hp
     */
    doRandomMovement(theRoamRate) {
        //while hp is at half keep shield up to block projectiles
        if ((this.hp / this.max_hp) <= PARAMS.MID_HP) {
            this.velocity.x = 0;
            this.setBlockState(true);
            this.setAttackState(false);
        }

        //do random movements from superclass
        super.doRandomMovement(theRoamRate);

        //if doing an idle roam state then switch off phase states
        if (this.seconds >= this.doRandom) {
            this.setAttackState(false);
            this.setBlockState(false);
        }

    }


    /**
     * Override damage method from abstract entity.
     *
     * Reduce the damage when blocking.
     * @param {*} damage
     * @param {*} isCritical
     */
    takeDamage(damage, isCritical) {
        //reduce damage if shielding and pass to superclass
        let dmg = damage;
        if (this.blocking) {

            //shield broken
            if (this.shieldHP < damage) {
                this.blocking = false;
                this.shieldCooldown = 0;
            } else {
                if (this.canTakeDamage()) {
                    ASSET_MANAGER.playAsset(SFX.SHIELD_BLOCK);
                }

            }

            //half the damage when shielding
            dmg = damage / 2;
        }

        super.takeDamage(dmg, isCritical);
    }

    /**
     * Set combat phase
     */
    setCombatPhase() {
        if (this.phase == "block") {
            this.setBlockState(true);
        } else {
            this.setAttackState(true);
        }
    }

    switchPhase() {
        if (this.phase == "block") {
            this.phase = "attack";
            this.blocking = false;
        } else {
            this.phase = "block";
            this.blocking = true;
        }
    }


    /**
     * Toggle block state on or off
     * @param {} isOn
     */
    setBlockState(isOn) {
        if (isOn) {
            this.state = this.states.block;
            this.blocking = true;
            this.shieldCooldown = 0;
            this.canAttack = false;
        } else {
            this.blocking = false;
            this.shieldCooldown = 0;
            this.canAttack = true;
        }
    }

    /**
     * Toggle attack state on or off
     * @param {} isOn
     */
    setAttackState(isOn) {
        if (isOn) {
            this.canAttack = false;
            this.state = this.states.attack;
        } else {
            this.resetAnimationTimers(this.states.attack);
            this.attackCooldown = 0;
            this.canAttack = true;
            this.runAway = false;
        }

    }


    getDamageValue() {
        return this.damageValue;
    };

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    };


    resetAnimationTimers(action) {
        this.animations[action][0].elapsedTime = 0;
        this.animations[action][1].elapsedTime = 0;
    }

    loadAnimations() {

        let numDir = 2;
        let numStates = 6;
        for (var i = 0; i < numStates; i++) { //defines action
            this.animations.push([]);
            for (var j = 0; j < numDir; j++) { //defines directon: left = 0, right = 1
                this.animations[i].push([]);
            }
        }

        // Animations  [state][direction]

        // Idle Animation
        this.animations[0][0] = new Animator(this.spritesheet, 495, 50, 45, 51, 4, 0.7, -195, 0, 1, 0); // 0.7
        this.animations[0][1] = new Animator(this.spritesheet, 660, 50, 45, 51, 4, 0.7, 105, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 495, 348, 55, 53, 4, 0.1, -205, 0, 0, 0); //0.1
        this.animations[1][1] = new Animator(this.spritesheet, 650, 348, 55, 53, 4, 0.1, 95, 0, 0, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 492, 200, 56, 51, 4, 0.1, -206, 0, 0, 0); //0.1
        this.animations[2][1] = new Animator(this.spritesheet, 652, 200, 56, 51, 4, 0.1, 94, 0, 0, 0);

        // Attack Animations
        this.animations[3][0] = new Animator(this.spritesheet, 1052, 944, 95, 57, 8, 0.1, -245, 0, 1, 0); // 0.1
        this.animations[3][1] = new Animator(this.spritesheet, 53, 794, 95, 57, 8, 0.1, 55, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 495, 650, 45, 51, 4, 0.1, -195, 0, 1, 0); // 0.3?
        this.animations[4][1] = new Animator(this.spritesheet, 660, 650, 45, 51, 4, 0.1, 105, 0, 1, 0);

        // Block Animation
        this.animations[5][0] = new Animator(this.spritesheet, 491, 505, 40, 46, 4, 0.2, -190, 0, 1, 0); // 0.2
        this.animations[5][1] = new Animator(this.spritesheet, 669, 505, 40, 46, 4, 0.2, 110, 0, 1, 0);
    };

    draw(ctx) {
        if (this.dead) {
            super.drawWithFadeOut(ctx, this.animations[this.state][this.direction]);
        } else {
            this.healthbar.draw(ctx); //only show healthbar when not dead

            switch (this.state) {
                case 0: // Idle
                    if (this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 10 - this.game.camera.x, this.y - 37 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - 37 - this.game.camera.y, this.scale);
                    break;
                case 1: // Damaged
                    if (this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 15 - this.game.camera.x, this.y - 42 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - 42 - this.game.camera.y, this.scale);
                    break;
                case 2: // Death
                    if (this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 10 - this.game.camera.x, this.y - 37 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 10 - this.game.camera.x, this.y - 37 - this.game.camera.y, this.scale);
                    break;
                case 3: // Attack
                    if (this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 7 - this.game.camera.x, this.y - 52 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 108 - this.game.camera.x, this.y - 52 - this.game.camera.y, this.scale);
                    break;
                case 4: // Move
                    if (this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 10 - this.game.camera.x, this.y - 37 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - 37 - this.game.camera.y, this.scale);
                    break;
                case 5: // Block
                    if (this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 7 - this.game.camera.x, this.y - 24 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 14 - this.game.camera.x, this.y - 24 - this.game.camera.y, this.scale);
                    break;
            }
        }
    };
};
