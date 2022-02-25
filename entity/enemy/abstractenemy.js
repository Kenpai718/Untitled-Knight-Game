/**
 * Abstract implementation of an enemy so polymorphism can be used
 * 
 * Mainly used for the "is-a" relationship
 */


class AbstractEnemy extends AbstractEntity {
    /**
     * 
     * @param {*} game    game engine
     * @param {*} x       xCord on canvas in blockdims
     * @param {*} y       yCord on canvas in blockdims
     * @param {*} onGuard is the enemy will stand still (true) or roam around (false)
     * @param {*} name    name of entity
     * @param {*} max_hp  maximum hitpoints
     * @param {*} width   initial width
     * @param {*} height  initial height
     * @param {*} scale   scale of size ex: (width * scale)
     * @param {*} physics physics that includes: MAX_RUN, MAX_FALL
     */
    constructor(game, x, y, onGuard, name, max_hp, width, height, scale, physics) {
        super(game, x, y, name, max_hp, width, height, scale);
        if (new.target === AbstractEnemy) {
            throw new TypeError("Cannot construct AbstractEnemy instance directly!");
        }

        this.onGuardDuty = onGuard; //controls if should move or stay still on idle
        this.collisions = { left: false, right: false, top: false, bottom: false };

        this.physics = physics;
        this.myMaxSpeed = this.physics.MAX_RUN;
        this.myMaxFall = this.physics.MAX_FALL;

        //entity will try to jump if it is stuck in one x-cord for too long
        this.jumped = false;
        this.myJumpHeight = PLAYER_JUMP_HEIGHT / 2;
        this.stuckTimer = 0;
        this.lastXCord = Math.round(this.x);

        //aggro will chase player for a certain amount of time
        this.aggro = false; //toggled by player entering vb or attacking
        this.playerInSight = false; //player is in the vb
        this.myAlert = false; //show alert icon or not (when entering vb for first time)
        this.aggroTimer = 0; //cool down for aggro
        this.aggroCooldown = 3; //after 5 seconds turn off the aggro

        //loot
        this.dropDiamonds = false;
        this.dropAmount = randomInt(3) + 1;

        //random behavior
        this.seconds = 0;
        this.doRandom = 0;
        this.myRoamRate = 1; //Default roam rate from 0-10.
    }

    /**
     * Reset aggro after a certain amount of time
     * Aggro means the enemy will chase the player around
     * 
     * @param inPlayerVision boolean so the aggro is kept as long as the player is in their sight
     *                       otherwise start counting the aggro timer
     */
    setAggro(playerInVision) {
        if (this.aggro) {
            if (!this.myAlert) {
                this.myAlert = true;
                this.game.addEntityToFront(new Alert(this.game, this));
            }
            this.aggroTimer += this.game.clockTick;

            //only reset the timer if player is no longer in vision
            if (!playerInVision) {
                if (this.aggroTimer >= this.aggroCooldown) {
                    this.aggro = false;
                    this.aggroTimer = 0;
                }
            }

        } else {
            this.myAlert = false;
        }
    }

    /**
     * Displaces enemy entities to prevent grouping
     * @param {*} dist 
     * @param {*} TICK 
     * @returns 
     */
    collideWithOtherEnemies(dist, TICK) {
        let self = this;
        let speed = 20;
        if (this.velocity.x == 0)
            speed = 10;
        this.game.enemies.forEach(function (entity) {
            if (entity != self && self.BB.collide(entity.BB)) {
                if (self.BB.left < entity.BB.left)
                    dist.x -= speed * TICK;
                else if (self.BB.right > entity.BB.right)
                    dist.x += speed * TICK;
                else dist.x += (Math.round(Math.random() * 4) - 2) * speed / 2 * TICK;
            }
        });
        return dist;
    }


    /**
     * If entity is in a moving state and it's x cordinate is not changing
     * then it must be stuck so attempt to do a jump to get out.
     * @param {*} TICK 
     */
    doJumpIfStuck(TICK) {
        //console.log(this.lastXCord, Math.round(this.x), this.stuckTimer);

        //if it it has the same x cord as last time it might be stuck so check
        if (this.lastXCord == Math.round(this.x)) {
            if (this.state == this.states.move && this.velocity.x == 0 && !this.touchHole()) {
                this.stuckTimer += TICK;
            }

            if (this.stuckTimer >= .15) {
                if (!this.jumped) {
                    //console.log("enemy jumped");
                    this.stuckTimer = 0;
                    this.doJump();
                }
            }
        }

        this.lastXCord = Math.round(this.x);
        //console.log(this.lastXCord == Math.round(this.x) && this.state == this.states.move && this.velocity.x == 0);

    }

    /**
 * Switch the facing direction every so often
 */
    doRandomFacing() {
        //just idling so don't move
        this.state = this.states.idle;
        this.velocity.x = 0;
        //switch facing directions
        if (this.seconds >= this.doRandom) {
            this.direction = Math.floor(Math.random() * 2);
            this.doRandom = this.seconds + Math.floor(Math.random() * 10);
        }
    }

    /**
     * Do random roaming options every so often
     * Like walking in certain directions or idling/switching facing
     * 
     * @param number from 0-10 for how often this movement should be done
     */
    doRandomMovement(moveTrigger) {
        if(moveTrigger >= 10 || moveTrigger < 0) throw "move trigger rate must be from 0-10";

        if (this.seconds >= this.doRandom) {

            this.direction = randomInt(2); //1-2
            this.event = randomInt(10); 1-10
            if (this.event <= moveTrigger) {
                this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                this.velocity.x = 0;

                //if on guard duty dont have it roam around
                if (!this.onGuardDuty) {
                    this.state = this.states.move;
                    if (this.direction == 0) this.velocity.x -= this.myMaxSpeed;
                    else this.velocity.x += this.myMaxSpeed;
                }
            }
            else {
                this.doRandom = this.seconds + Math.floor(Math.random() * 10);
                this.state = this.states.idle;
                this.velocity.x = 0
            }
        }

    }

    /**
     * Sets enemy to a dead state
     */
    setDead() {
        this.healthbar.removeFromWorld = true;
        this.state = this.states.death;
        this.HB = null; // so it cant attack while dead

        // Drops random # of diamond upon death
        this.dropLoot();

        let friction = 1000;
        const TICK = this.game.clockTick;
        //slow down velocity of x if moving
        if (this.direction == this.directions.left) {
            if (this.velocity.x < 0) {
                this.velocity.x += friction * TICK;
            }
            else this.velocity.x = 0;
        }
        else if (this.direction == this.directions.right) {
            if (this.velocity.x > 0) {
                this.velocity.x -= friction * TICK;
            }
            else this.velocity.x = 0;
        }

        this.handleGravity();
        if (this.animations[this.state][this.direction].isDone()) {
            this.removeFromWorld = true;
            this.game.camera.killCount++;
            this.game.myReportCard.myEnemiesDefeated++;
        }
    }

    /**
     * Jump if able to
     */
    doJump() {
        if (!this.jumped) {
            this.jumped = true;
            this.velocity.y -= this.myJumpHeight;
            //ASSET_MANAGER.playAsset(SFX.JUMP2);
        }
    }

    /**
     * Spawnds a diamond upon death of an enemy
     */
    dropLoot() {
        // Drops random # of diamond upon death
        if (!this.dropDiamonds) {
            this.game.addEntityToFront(new Diamond(this.game, this.BB.x, this.BB.y, this.dropAmount));
            this.dropDiamonds = true;
        }
    }

    drawHealth(ctx) {
        if (!this.dead)
            this.healthbar.draw(ctx);
    }


}