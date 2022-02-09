/**
 * Skeleton is a entity about the size of the player. It's attacks are rather slow.
 * It doesn't have that much hp, but it has a shield to reduce damage.
 * 
 * Unique behavior: Switching between shield and attack mode when in range
 * At half HP it will keep its shield up during the idle.
 * 
 */

class Skeleton extends AbstractEnemy {

    constructor(game, x, y) {

        super(game, x, y, STATS.SKELETON.NAME, STATS.SKELETON.MAX_HP, STATS.SKELETON.WIDTH, STATS.SKELETON.HEIGHT, STATS.SKELETON.SCALE);
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


        //unique shielding behavior
        this.switchTimer = 0;
        this.phaseSwitchTime = 1;
        this.blockTimer = 0;
        this.blocking = false; //blocking state
        this.shieldHP = 20;
        this.combatPhase = "block";

        this.attackwidth = 200;
        this.visionwidth = 1200;

        this.damageValue = STATS.SKELETON.DAMAGE;

        // Mapping animations and mob states
        this.animations = []; // [state][direction]
        this.states = { idle: 0, damaged: 1, death: 2, attack: 3, move: 4, block: 5 };
        this.directions = { left: 0, right: 1 };
        this.direction = this.directions.left;
        this.state = this.states.idle;

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
            this.checkEnvironmentCollisions(dist);

            /**
             * Interactions with entities
             */
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

                        //reset action states
                        that.setAttackState(false);
                        that.setBlockState(false);
                    }
                }
                // knight is in attack range

                let inAttackRange = entity.BB && entity instanceof Knight && that.AR.collide(entity.BB);
                if (inAttackRange) {
                    that.velocity.x = 0;

                    that.switchTimer += TICK;

                    //switch the combat phase after reaching time
                    if (that.switchTimer >= that.phaseSwitchTime && that.state != that.states.damaged) {
                        that.switchTimer = 0; //reset timer
                        that.switchPhase();

                    }

                    //do an attack or block
                    if (!that.state != that.states.damaged) that.setCombatPhase();

                }

                // skeleton hit by something switch the state to damaged
                if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer && !that.HB) {
                    //entity.doDamage(that);
                    if (!that.blocking) {
                        that.setDamagedState();
                    } else {
                        //console.log("hit skeleton's shield");
                    }


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

            //attack hitbox if attacking
            if (this.state == this.states.attack && this.animations[this.states.attack][this.direction].isHalfwayDone()) {
                this.updateHB();
            } else {
                this.HB = null;
            }


            // Actions when player not in sight
            if (!knightInSight) {

                this.velocity.x = 0;
                //while hp is at half keep shield up to block projectiles
                if ((this.hp / this.max_hp) <= PARAMS.MID_HP) {
                    that.setBlockState(true);
                    that.setAttackState(false);
                } else { //do random movement
                    if (this.seconds >= this.doRandom) {

                        this.direction = Math.floor(Math.random() * 2);
                        this.event = Math.floor(Math.random() * 6);
                        if (this.event <= 0) {
                            this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                            this.state = this.states.move;
                            this.velocity.x = 0;
                            if (this.direction == 0) this.velocity.x -= MAX_RUN;
                            else this.velocity.x += MAX_RUN;
                        }
                        else {
                            this.doRandom = this.seconds + Math.floor(Math.random() * 10);
                            this.state = this.states.idle;
                            this.velocity.x = 0
                        }
                    }
                    //reset action states
                    that.setAttackState(false);
                    that.setBlockState(false);
                }
            }
        }


    };


    checkEnvironmentCollisions(dist) {
        let that = this;
        this.collisions = { left: false, right: false, top: false, bottom: false };
        this.game.foreground2.forEach(function (entity) {
            // collision with environment
            if (entity.BB && that.BB.collide(entity.BB)) {
                const below = that.lastBB.top <= entity.BB.top && that.BB.bottom >= entity.BB.top;
                const above = that.lastBB.bottom >= entity.BB.bottom && that.BB.top <= entity.BB.bottom;
                const right = that.lastBB.right <= entity.BB.right && that.BB.right >= entity.BB.left;
                const left = that.lastBB.left >= entity.BB.left && that.BB.left <= entity.BB.right;
                const between = that.lastBB.top >= entity.BB.top && that.lastBB.bottom <= entity.BB.bottom;
                if (between ||
                    below && that.BB.top > entity.BB.top - 20 * that.scale ||
                    above && that.BB.bottom < entity.BB.bottom + 20 * that.scale) {
                    if (right) {
                        that.collisions.right = true;
                        dist.x = entity.BB.left - that.BB.right;
                    } else {
                        that.collisions.left = true;
                        dist.x = entity.BB.right - that.BB.left;
                    }
                }
                if (below) {
                    if (left && Math.abs(that.BB.left - entity.BB.right) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                        that.collisions.left = true;
                        dist.x = entity.BB.right - that.BB.left;
                    } else if (right && Math.abs(that.BB.right - entity.BB.left) <= Math.abs(that.BB.bottom - entity.BB.top)) {
                        that.collisions.right = true;
                        dist.x = entity.BB.left - that.BB.right;
                    } else {
                        dist.y = entity.BB.top - that.BB.bottom;
                        that.collisions.bottom = true;
                    }
                }
                that.updateBoxes();
            }
        });
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
            this.canAttack = false;
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
        this.animations[1][0] = new Animator(this.spritesheet, 495, 348, 55, 53, 4, 0.1, -205, 0, 1, 0); //0.1
        this.animations[1][1] = new Animator(this.spritesheet, 650, 348, 55, 53, 4, 0.1, 95, 0, 1, 0);

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
            if (this.flickerFlag) {
                this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            }
            this.flickerFlag = !this.flickerFlag;
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
