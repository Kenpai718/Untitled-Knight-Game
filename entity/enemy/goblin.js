/**
 * Goblin is a small enemy entity self attacks fast. It has low hp and not much of a threat on its own.
 * However when in a group it becomes dangerous as it attacks your blindspot!
 *
 * Special behavior: prioritizes attacking player from behind while they have half hp.
 * They do 1.5* more damage when attacking from behind.
 */

class Goblin extends AbstractEnemy {
    constructor(game, x, y) {

        super(game, x, y, STATS.GOBLIN.NAME, STATS.GOBLIN.MAX_HP, STATS.GOBLIN.WIDTH, STATS.GOBLIN.HEIGHT, STATS.GOBLIN.SCALE, STATS.GOBLIN.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");

        // Update settings
        this.tick = 0;
        this.seconds = 0;
        this.doRandom = 0;
        this.behindPlayer = false;
        this.playerInSight = false;

        // Physics
        this.fallAcc = 1500;
        this.collisions = { left: false, right: false, top: false, bottom: false };

        //variables to control behavior
        this.canAttack = true;
        this.vulnerable = true;
        this.damagedCooldown = 0;
        this.runAway = false;
        this.attackCooldown = 0;
        this.visionwidth = 1400;
        this.attackwidth = 89 * this.scale;
        this.damageValue = STATS.GOBLIN.DAMAGE;

        // Mapping animations and mob states
        this.animations = []; // [state][direction]
        this.states = { idle: 0, damaged: 1, death: 2, attack: 3, move: 4, run: 5 };
        this.directions = { left: 0, right: 1 };
        this.direction = this.directions.left;
        this.state = this.states.idle;

        // Enemy drop
        this.dropDiamonds = false;
        this.dropAmount = randomInt(3) + 1;

        // Other
        this.loadAnimations();
        this.updateBoxes();
    };



    update() { // physics

        this.seconds += this.game.clockTick;
        const TICK = this.game.clockTick;

        if (this.dead) { // goblin is dead play death animation and remove
            super.setDead();
        } else { // not dead keep moving
            this.velocity.y += this.fallAcc * TICK; //constant falling, and fixed by collision detection

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
            if (this.touchHole()) {
                dist.x = 0;
            }
            dist = this.checkEntityInteractions(dist, TICK); //move entity according to other entities
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

            //do random movement while the player is not in sight
            if (!this.playerInSight) this.doRandomMovement();

            //entity can jump if it is on floor
            super.setAggro(this.playerInSight);
            super.doJumpIfStuck(TICK); //jump if stuck horizontally
            super.checkInDeathZone();  //die if below blastzone
        }
    };

    /**
    * Based on distance {x, y} displace
    * the entity by the given amount.
    *
    * Set velocities based on positioning
    * @param {} dist {x, y}
    */
    updatePositionAndVelocity(dist) {
        // update positions based on environment collisions
        this.x += dist.x;
        this.y += dist.y;
        this.updateBoxes();
        // set respective velocities to 0 for environment collisions
        if (this.touchFloor() && this.velocity.y > 0) {
            this.jumped = false;
            this.velocity.y = 0;
        }
        if(this.collisions.top) this.velocity.y = 0; //bonk on ceiling halt momentum
        if (this.collisions.lo_left && this.velocity.x < 0) this.velocity.x = 0;
        if (this.collisions.lo_right && this.velocity.x > 0) this.velocity.x = 0;


    }

    /**
    * Checks interactions with entities.
    * Also controls how the entity will move/act.
    * Adds dist displacement if necessary
    * @param {} dist
    * @param {*} TICK
    * @returns dist
    */
    checkEntityInteractions(dist, TICK) {
        let self = this;
        /* Entity Interactions */
        this.game.entities.forEach(function (entity) {
            // knight interactions
            if (entity instanceof AbstractPlayer) {
                //set flag to see if the goblin is currently behind the knight
                self.behindPlayer = self.isBehindPlayer(entity);

                // knight is in the vision box or was hit by an arrow
                let playerInVB = entity.BB && self.VB.collide(entity.BB);
                let playerAtkInVB = entity.HB != null && self.VB.collide(entity.HB);
                if (playerInVB || playerAtkInVB || self.aggro) {
                    self.playerInSight = playerInVB;
                    self.aggro = true;
                    // knight is in the vision box and not in the attack range
                    if (!self.AR.collide(entity.BB)) {
                        // move towards the knight
                        self.state = self.states.move;
                        self.direction = entity.BB.right < self.BB.left ? self.directions.left : self.directions.right;
                        self.velocity.x = self.direction == self.directions.right ? self.velocity.x + self.myMaxSpeed : self.velocity.x - self.myMaxSpeed;
                        self.resetAttack();
                    }
                }


                //knight within attack range
                if (entity.BB && self.AR.collide(entity.BB)) {

                    /**
                     * Until low hp prioritize attacking from the back
                     */
                    let changeBehavior = (self.hp / self.max_hp) <= 0.5;


                    if (!changeBehavior) { //strike the back or player
                        if (self.behindPlayer) {
                            self.velocity.x = 0;
                            if (!self.sameFacing(entity)) {
                                self.flipDir();
                            }
                            if (self.canAttack && !self.animations[self.states.attack][self.direction].isDone()) {
                                self.runAway = true;
                                self.canAttack = false;
                                self.state = self.states.attack;
                            }
                        }
                    } else { //attack normally from wherever
                        self.velocity.x = 0;
                        if (self.canAttack && !self.animations[self.states.attack][self.direction].isDone()) {
                            self.runAway = true;
                            self.canAttack = false;
                            self.state = self.states.attack;
                        }
                    }

                    // goblin hit by player switch to damaged state
                    if (entity.HB && self.BB.collide(entity.HB) && !self.HB) {
                        //entity.doDamage(self);
                        self.setDamagedState();
                        self.resetAttack();

                    }
                }
            }

        });

        return dist;
    }

    checkCooldowns() {
        const TICK = this.game.clockTick;
        // goblin attack cooldown
        if (!this.canAttack) {
            this.attackCooldown += TICK;
            if (this.attackCooldown >= 1.7) {
                this.resetAttack();
            }
        }
        // goblin hit cooldown
        if (!this.vulnerable) {
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

    doRandomMovement() {
        if (this.seconds >= this.doRandom) {

            this.direction = Math.floor(Math.random() * 2);
            this.event = Math.floor(Math.random() * 6);
            let moveTrigger = 3; //0-6, higher the number the more often it moves
            if (this.event <= moveTrigger) {
                this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                this.state = this.states.move;
                this.velocity.x = 0;
                if (this.direction == 0) this.velocity.x -= this.myMaxSpeed;
                else this.velocity.x += this.myMaxSpeed;
            }
            else {
                this.doRandom = this.seconds + Math.floor(Math.random() * 10);
                this.state = this.states.idle;
                this.velocity.x = 0
            }
        }

    }

    /**
     * Uses bounding boxes to check if the goblin is
     * behind the player so it can attack
     * @param {*} thePlayer
     * @returns
     */
    isBehindPlayer(thePlayer) {
        let isBehind = false;
        if (thePlayer instanceof AbstractPlayer) {
            let facingLeft = thePlayer.facing == thePlayer.dir.left;
            //let offset = 30 * this.scale; //same offset as HB
            let offset = this.attackwidth - (this.width * this.scale);

            if (facingLeft) {
                isBehind = thePlayer.BB.right < this.BB.left - offset
            } else {
                isBehind = thePlayer.BB.left > this.BB.right + offset;
            }
        }
        return isBehind;

    }


    /**
     * Checks if goblin is facing the same direction as the player
     * @param {*} thePlayer
     * @returns
     */
    sameFacing(thePlayer) {

        let result = false;
        if (thePlayer instanceof AbstractPlayer) {
            let playerLeft = thePlayer.facing == thePlayer.dir.left;
            let playerRight = thePlayer.facing == thePlayer.dir.right;
            let goblinLeft = this.direction == this.directions.left;
            let goblinRight = this.direction == this.directions.right;

            result = (playerLeft == goblinLeft) || (playerRight == goblinRight);
        }

        return result;
    }

    /**
     * Flip current direction of the goblin
     */
    flipDir() {
        this.direction = (this.direction == this.directions.right) ? this.directions.left : this.directions.right;
    }

    /**
    * Hard reset all variables related to attacking
    */
    resetAttack() {
        this.resetAnimationTimers(this.states.attack);
        this.attackCooldown = 0;
        this.canAttack = true;
        this.runAway = false;

    }

    resetAnimationTimers(action) {
        this.animations[action][0].elapsedTime = 0;
        this.animations[action][1].elapsedTime = 0;
    }

    /**
     * Does more damage if attacking player from behind
     */
    getDamageValue() {
        let dmg = this.damageValue;
        if (this.behindPlayer) dmg = dmg * 1.5;
        return dmg;
    };

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    };

    /**
     * When attackin place the hitbox directly in front of the goblin
     */
    updateHB() {
        let offsetxBB = this.width * this.scale;
        let offsetyBB = 10 * this.scale;
        let heightBB = (this.height / 3) * this.scale;

        if (this.direction == this.directions.left) offsetxBB = (offsetxBB * -1); //flip hitbox offset
        this.HB = new BoundingBox(this.x - this.width, this.y + offsetyBB, this.attackwidth, heightBB);
    };

    updateBoxes() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 4 * this.scale, this.y + 2 * this.scale, 19 * this.scale, 34 * this.scale + 1);
        if (this.direction == 0) this.AR = new BoundingBox(this.x - 71, this.y - 24, this.attackwidth, 46 * this.scale);
        else this.AR = new BoundingBox(this.x - 84, this.y - 24, this.attackwidth, 46 * this.scale);


        if (this.direction == 0) this.VB = new BoundingBox((this.x - this.visionwidth / 2) + 155, this.y - 37, this.visionwidth / 2, this.height + 1)
        else this.VB = new BoundingBox((this.x + this.visionwidth / 2) - 800, this.y - 37, this.visionwidth / 2, this.height + 1)
    };

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
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);   // 0.1 Animation Speed
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

        // Move Animation
        this.animations[5][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);   // 0.1 Animation Speed
        this.animations[5][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

    };



    draw(ctx) {

        if (this.dead) {
            super.drawWithFadeOut(ctx, this.animations[this.state][this.direction]);
        } else {
            this.healthbar.draw(ctx); //only show healthbar when not dead

            switch (this.state) { // Prefecting Refections... Might just remove anyways.
                case 0: // Idle
                    if (this.direction == 1) this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 16 - this.game.camera.x, this.y - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
                    break;
                case 1: // Damaged
                    if (this.direction == 1) this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 25 - this.game.camera.x, this.y - 2 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 13 - this.game.camera.x, this.y - 2 - this.game.camera.y, this.scale);
                    break;
                case 2: // Death
                    if (this.direction == 1) this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 50 - this.game.camera.x, this.y - 4 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 40 - this.game.camera.x, this.y - 4 - this.game.camera.y, this.scale);
                    break;
                case 3: // Attack
                    if (this.direction == 1) this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 83 - this.game.camera.x, this.y - 25 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 70 - this.game.camera.x, this.y - 25 - this.game.camera.y, this.scale);
                    break;
                case 4: // Move
                    if (this.direction == 1) this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 20 - this.game.camera.x, this.y - 5 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 8 - this.game.camera.x, this.y - 5 - this.game.camera.y, this.scale);
                    break;
                case 5: // Run
                    if (this.direction == 1) this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 20 - this.game.camera.x, this.y - 5 - this.game.camera.y, this.scale);
                    else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 8 - this.game.camera.x, this.y - 5 - this.game.camera.y, this.scale);
                    break;
            }

        };
    };
};
