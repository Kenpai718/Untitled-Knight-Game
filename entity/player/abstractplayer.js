/**
 * Abstract implementation of an player entity so polymorphism can be used
 *
 * Mainly used for the "is-a" relationship
 *
 * Has methods a player object should have access to such as healing, shooting, potions, and inventory
 */

class AbstractPlayer extends AbstractEntity {
    constructor(game, x, y, name, max_hp, width, height, scale) {
        super(game, x, y, name, max_hp, width, height, scale);
        if (new.target === AbstractPlayer) {
            throw new TypeError("Cannot construct AbstractPlayer instance directly!");
        }

        this.myInventory = new Inventory(this.game);
        this.respawn = false;
        this.myCheckpoint = null;

    }

    /**
     * Heal the character for a given ammount
     */
    heal(amount) {
        if (this.hp < this.max_hp) {
            let healed;

            if ((amount + this.hp) >= this.max_hp) {
                healed = this.max_hp - this.hp;
            } else {
                healed = amount;
            }

            healed = Math.round(100 * healed) / 100;

            this.hp += healed;
            ASSET_MANAGER.playAsset(SFX.HEAL);
            this.game.addEntityToFront(new Score(this.game, this, healed, PARAMS.HEAL_ID, false));
        }
    }

    /**
     * Shoot an arrow
     */
    shootArrow() {
        if (this.myInventory.arrows > 0) {
            //try to position starting arrow at the waist of the knight
            const target = this.chooseArrowTarget();
            this.game.addEntityToFront(new Arrow(this.game, this.x + this.offsetxBB + 20, (this.BB.top + this.BB.height / 4), target, this.myInventory.arrowUpgrade, true));
            this.myInventory.arrows--;
            ASSET_MANAGER.playAsset(SFX.BOW_SHOT);

        } else { //out of arrows
            ASSET_MANAGER.playAsset(SFX.CLICK);
        }
    }

    bladeBeam() {
        this.game.addEntityToFront(new BladeBeam(this.game, this.BB.left, this.BB.top, this.facing));
    }

    /**
     * Chooses arrow target based on if user shot an arrow with
     * mouse or keyboard input.
     * @returns target for arrow to fly in
     */
    chooseArrowTarget() {
        let target;
        if (this.game.shoot) {
            //keyboard input shoot in direction of keyboard
            if (this.game.shootButton) {
                //get cordinates of player
                let myX = this.BB.right;
                let myY = this.BB.top;
                let myH = this.BB.height;
                let myMid = myY + (myH / 2.5);

                //target cordinates
                let myTargetX = myX;
                let myTargetY = myMid;

                //flip arrow direction if left
                let xDir = 1;
                if (this.facing == this.dir.left) {
                    xDir = -1;
                    myX = this.BB.left;
                }

                //make arrow fly up or down depending on direction held
                if (this.game.up) {
                    myTargetY = myY - 500;
                } else if (this.game.down && this.inAir) {
                    myTargetY = myY + 500;
                }

                //xbuffer to choose a target in the right direction
                let xBuffer = 500 * xDir;
                //player cords are already in terms of the camera so need for an offset
                target = { x: myTargetX + xBuffer, y: myTargetY };

                //console.log("Shooting with button", target.x, target.y);;
            } else { //use mouse cursor input
                //console.log("Shooting with mouse");
                target = { x: this.game.mouse.x + this.game.camera.x, y: this.game.mouse.y + this.game.camera.y };
            }
        }

        return target;
    }

    /**
     * Use a potion to heal if there are any
     */
    usePotion() {
        if (this.hp < this.max_hp) {
            if (this.myInventory.potions > 0) {
                this.heal(PARAMS.POTION_HEAL);
                this.myInventory.potions--;
                ASSET_MANAGER.playAsset(SFX.DRINK);
            } else { //out of potions
                ASSET_MANAGER.playAsset(SFX.CLICK);
            }
        }
    }

    /**
     * Increases player attack
     */
    getAttackBonus() {
        let bonusAttack = [1.0, 1.2, 1.4, 1.6, 2];
        return (bonusAttack[this.myInventory.attackUpgrade]);
    }

    /**
     * Increases player defense
     */
    getDefenseBonus() {
        let bonusDefense = [1.0, 0.8, 0.7, 0.5];
        return (bonusDefense[this.myInventory.armorUpgrade]);
    }

    /**
     * Basic jump execution
     */
    doJump() {
        ASSET_MANAGER.playAsset(SFX.JUMP);
        this.action = this.states.jump; //jump (9-11)
        //set jump distance
        this.velocity.y -= PLAYER_PHYSICS.JUMP_HEIGHT;
        this.game.jump = false;
        this.inAir = true;
    }

    /**
    * Player takes damages
    * Set dead if hp below 0
    * Overrides original method to play a different grunt sound
    * @param {*} damage
    */
    takeDamage(damage, isCritical) {
        //close the shop if player took damage
        SHOP_ACTIVE = false;

        let dmg = 0
        if (this.canTakeDamage()) {
            isCritical ? ASSET_MANAGER.playAsset(SFX.CRITICAL) : ASSET_MANAGER.playAsset(SFX.DAMAGED);
            this.takeKnockback();
            dmg = damage * this.getDefenseBonus()
            this.hp -= dmg;
            this.vulnerable = false;

            if (this.hp <= 0) {
                this.dead = true;
                ASSET_MANAGER.playAsset(SFX.PLAYER_DEATH); //OOF!
            } else { //random player grunt
                let rand = randomInt(3);
                let grunt = SFX.PLAYER_GRUNT;
                rand == 0 ? grunt = SFX.PLAYER_GRUNT : rand == 1 ? grunt = SFX.PLAYER_GRUNT2 : grunt = SFX.PLAYER_GRUNT3;
                //console.log(rand + " " + grunt);
                ASSET_MANAGER.playAsset(grunt);
            }

            this.game.addEntityToFront(new Score(this.game, this, dmg, PARAMS.DMG_ID, isCritical));
        }
        return dmg;
    }

    /**
     * In dead state animation
     * Restart the game after the animation finishes
     */
    setDead() {
        this.action = this.states.death;

        //slow down velocity of x if moving and dead
        const TICK = this.game.clockTick;
        let friction = 1000;
        if (this.facing == this.dir.left) {
            if (this.velocity.x < 0) {
                this.velocity.x += friction * TICK;
            }
            else this.velocity.x = 0;
        }
        else if (this.facing == this.dir.right) {
            if (this.velocity.x > 0) {
                this.velocity.x -= friction * TICK;
            }
            else this.velocity.x = 0;
        }

        //falling collisions and gravity
        super.handleGravity();
        if (this.animations[this.facing][this.action][this.myInventory.armorUpgrade].isDone()) {
            this.game.myReportCard.myDeathes += 1;
            this.resetAnimationTimers(this.states.death);
            this.respawn = true;
            this.action = this.states.revive;
            this.respawnPlayer();
        }
    }


    /**
     * Restarts the current level when called
     */
    respawnPlayer() {
        // remove the current level from the level states if no checkpoint
        //if(this.myCheckpoint == null) if (this.game.camera.levelState[this.game.camera.currentLevel]) this.game.camera.levelState.splice(this.game.camera.levelState.indexOf(this.game.camera.currentLevel, 1));
        // set restart flag to true so self the state isn't saved
        this.game.camera.restart = true;
        this.game.camera.loadLevel(this.game.camera.currentLevel);
        ASSET_MANAGER.playAsset(SFX.RESPAWN);
    }


    /**
     * Handle all collisions related to the player
     * @param {*} TICK
     */
    handleCollisions(TICK) {
        this.handleEnvironmentCollisions(TICK);
        this.handleEntityCollisions(TICK);
        this.handleItemCollisions(TICK);
    }


    /**
     * Handles collision detection of the player
     * and adjusts positions or actions if needed
     * @params this.game.clocktick
     */
    handleEnvironmentCollisions(TICK) {
        //do collisions detection here
        const lastColl = this.collisions;
        this.collisions = {
            lo_left: false, hi_left: false, lo_right: false, hi_right: false,
            ceil: false, ceil_left: false, ceil_right: false,
            floor: false, floor_left: false, floor_right: false
        };
        const w = this.BB.right - this.BB.left;
        const h = this.BB.bottom - this.BB.top;
        const lastBB = this.lastBB;
        const BB = {
            top: new BoundingBox(this.BB.left, this.BB.top, w, h / 2),
            bottom: new BoundingBox(this.BB.left, this.BB.top + h / 2, w, h / 2),
            left: new BoundingBox(this.BB.left, this.BB.top, w / 2, h),
            right: new BoundingBox(this.BB.left + w / 2, this.BB.top, w / 2, h),
        };
        let dist = { x: 0, y: 0 };
        this.diffy = { hi: 0, lo: 0 };
        let high = 100000 * this.scale;

        let self = this;
        this.game.foreground2.forEach(function (entity) {
            const coll = {
                left: false, right: false, ceil: false, floor: false
            };
            if (entity.BB && self.BB.collide(entity.BB)) {
                // check which side collides

                if (BB.bottom.collide(entity.BB) ) coll.floor = true;
                if (BB.top.collide(entity.BB) ) coll.ceil = true;
                if (BB.right.collide(entity.BB) && lastBB.left <= self.BB.left && lastBB.right <= self.BB.right) coll.right = true;
                if (BB.left.collide(entity.BB) && lastBB.left >= self.BB.left && lastBB.right >= self.BB.right) coll.left = true;

                // record height of knight and wall for wall hang
                if (high > entity.BB.top) high = entity.BB.top;

                // determine via elimination which side is actually colliding
                if (coll.floor && !coll.ceil) { // somewhere below
                    const y = Math.abs(entity.BB.top - self.BB.bottom);
                    const xL = Math.abs(entity.BB.right - self.BB.left);
                    const xR = Math.abs(entity.BB.left - self.BB.right);
                    if (coll.left && !coll.right && xL < w / 2) { // somwehere left
                        if (xL < y) { // certaintly left
                            self.collisions.lo_left = true;
                            dist.x = entity.BB.right - self.BB.left;
                        }
                        else { // certaintly below
                            self.collisions.floor_left = true;
                            if (Math.abs(entity.BB.top - self.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - self.BB.bottom;
                        }
                    }
                    else if (coll.right && !coll.left && xR < w / 2) { // somewhere right
                        if (xR < y) { // certaintly right
                            self.collisions.lo_right = true;
                            dist.x = entity.BB.left - self.BB.right;
                        }
                        else { // certaintly below
                            self.collisions.floor_right = true;
                            if (Math.abs(entity.BB.top - self.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - self.BB.bottom;
                        }
                    }
                    else { // certaintly below
                        self.collisions.floor = true;
                        if (Math.abs(entity.BB.top - self.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                            dist.y = entity.BB.top - self.BB.bottom;
                    }
                }
                else if (coll.ceil && !coll.floor) { // somewhere above
                    const y = Math.abs(entity.BB.bottom - self.BB.top);
                    const xL = Math.abs(entity.BB.right - self.BB.left);
                    const xR = Math.abs(entity.BB.left - self.BB.right);
                    if (coll.left && !coll.right && xL < w / 2) { // somewhere left
                        if (xL <= y) { // certaintly left
                            self.collisions.hi_left = true;
                            dist.x = entity.BB.right - self.BB.left;
                            if (high > entity.BB.top) high = entity.BB.top;
                        }
                        else { // certaintly above
                            self.collisions.ceil_left = true;
                            if (Math.abs(entity.BB.bottom - self.BB.top && !self.collisions.floor) > Math.abs(dist.y));
                        }
                    }
                    else if (coll.right && !coll.left && xR < w / 2) { // somewhere right
                        if (xR <= y) { // certaintly right
                            self.collisions.hi_right = true;
                            dist.x = entity.BB.left - self.BB.right;
                            if (high > entity.BB.top) high = entity.BB.top;
                        }
                        else { // certaintly above
                            self.collisions.ceil_right = true;
                            if (Math.abs(entity.BB.bottom - self.BB.top && !self.collisions.floor) > Math.abs(dist.y))
                                dist.y = entity.BB.bottom - self.BB.top;
                        }
                    }
                    else { // certaintly above
                        self.collisions.ceil = true;
                        if (Math.abs(entity.BB.bottom - self.BB.top && !self.collisions.floor) > Math.abs(dist.y))
                            dist.y = entity.BB.bottom - self.BB.top;
                    }
                }
                else { // neither above nor below
                    if (coll.left) { // certaintly left
                        self.collisions.lo_left = true;
                        self.collisions.hi_left = true;
                        dist.x = entity.BB.right - self.BB.left;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                    else if (coll.right) { // certaintly right
                        self.collisions.lo_right = true;
                        self.collisions.hi_right = true;
                        dist.x = entity.BB.left - self.BB.right;
                        if (high > entity.BB.top) high = entity.BB.top;
                    }
                }
            }
        });

        this.diffy.hi = high - this.BB.top;

        // instances where there are collisons along horizontal, but need ignoring
        // currently only when there's a crawl space to allow auto-crawl
        if (this.touchFloor && this.touchHole() || this.action == this.states.wall_climb) {
            if (!this.collisions.lo_right && !this.collisions.lo_left)
                dist.x = 0;
        }

        // update position as a result of collision
        this.x += dist.x;
        this.y += dist.y;
        this.updateBB();

        // bottom collision
        if (this.touchFloor()) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
                this.inAir = false;
                this.doubleJump = true;
                if (this.action == this.states.jump || this.action == this.states.jump_to_fall || this.action == this.states.fall) {
                    this.action = this.DEFAULT_ACTION;
                }
                this.resetAnimationTimers(this.states.jump);
                this.resetAnimationTimers(this.states.jump_to_fall);
                this.resetAnimationTimers(this.states.falling);


            }
        }

        // top collison
        if (this.touchCeiling()) {
            if (this.velocity.y < 0) {
                this.y -= self.velocity.y * TICK;
                this.velocity.y = 0;
            }
        }

        // left collison
        if (this.collisions.hi_left || this.collisions.lo_left) {
            if (this.velocity.x < 0)
                this.velocity.x = 0;
        }

        // right collison
        if (this.collisions.hi_right || this.collisions.lo_right) {
            if (this.velocity.x > 0)
                this.velocity.x = 0;
        }
        this.updateBB();
        this.lastBB = this.BB;
    }

    /**
     * Handles interactions related to entities
     * Like doing damage to an enemy or taking damage from one
     */
    handleEntityCollisions() {
        let self = this;
        this.game.enemies.forEach(function (entity) {
            //interactions with enemy
            if (entity instanceof AbstractEnemy) {
                //attacked by an enemy
                if (entity.HB && self.BB.collide(entity.HB)) {
                    //console.log("knight hit by enemy");
                    let dmg = entity.getDamageValue();
                    //dmg = Math.round(100 * dmg) / 100; // Insures values to nearest hundredth 
                    if (self.canTakeDamage()) self.game.myReportCard.myDamageTaken += dmg;
                    dmg = self.takeDamage(dmg, false);
                    if (entity instanceof Wizard) {
                        entity.recoverDamage(dmg);
                    }

                }

                //attacked an enemy
                if (self.HB != null && entity.BB && self.HB.collide(entity.BB)) {
                    //console.log("knight hit an enemy");
                    let dmg = self.getDamageValue();
                    if (entity.canTakeDamage()) self.game.myReportCard.myDamageDealt += dmg;
                    entity.takeDamage(dmg, self.critical);
                }

            }
        });

        //check entities other than the player or enemies
        this.game.entities.forEach(function (entity) {
            if (entity instanceof NPC) { //shop keeper
                if (entity.BB && self.BB.collide(entity.BB)) {
                    //save a checkpoint and current player state
                    if (!entity.setCheckpoint) {
                        //ASSET_MANAGER.playAsset(SFX.CHECKPOINT);
                        entity.setCheckpoint = true;
                        let x = self.x + entity.BB.left - self.BB.left;
                        let y = self.y + entity.BB.bottom - self.BB.bottom;
                        self.myCheckpoint = { x: Math.round(x), y: Math.round(y)};
                        self.game.camera.savePlayerInfo();
                        self.game.camera.saveLevelStateCheckpoint();
                        self.game.addEntityToFront(new Score(self.game, self, 0, PARAMS.CHECKPOINT_ID, false));
                        //console.log("saved checkpoint", self.myCheckpoint.x, self.myCheckpoint.y);
                    }
                }
            }
        });
    }

    /**
     * Handles interactions related to items or projectiles
     * Such as picking up a stuck arrow
     */
    handleItemCollisions() {
        let self = this;
        this.game.projectiles.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB)) {
                //player picks up arrow stuck on ground
                if (entity instanceof Arrow && entity.stuck) {
                    entity.removeFromWorld = true;
                    self.myInventory.arrows++;
                    ASSET_MANAGER.playAsset(SFX.ITEM_PICKUP);
                }
            }
        });
    }

    /**Collision helper methods */

    touchFloor() {
        return this.collisions.floor || (this.collisions.floor_right && this.collisions.floor_left) ||
            (this.collisions.floor_right && !this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.floor_left && !this.collisions.hi_left && !this.collisions.lo_left);
    }

    touchCeiling() {
        return this.collisions.ceil || (this.collisions.ceil_right && this.collisions.ceil_left) ||
            (this.collisions.ceil_right && !this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.ceil_left && !this.collisions.hi_left && !this.collisions.lo_left);
    }

    touchHole() {
        return this.collisions.ceil || this.collisions.ceil_right && !this.collisions.lo_right || this.collisions.ceil_left && !this.collisions.lo_left ||
            (this.collisions.hi_right && !this.collisions.lo_right) || (this.collisions.hi_left && !this.collisions.lo_left);
    }

}
