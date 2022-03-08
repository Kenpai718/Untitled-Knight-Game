/**
 * Abstract implementation of a creature entity so polymorphism can be used
 * 
 * This is to ensure all entities have the same properties when created such as 
 * a name, cordinates, width/height, scale and HP
 */

class AbstractEntity {
    constructor(game, x, y, name, max_hp, width, height, scale) {
        if (new.target === AbstractEntity) {
            throw new TypeError("Cannot construct AbstractEntity instance directly!");
        }

        //make subclass
        Object.assign(this, { game, x, y, name, max_hp });
        this.width = width * scale;
        this.height = height * scale;
        this.scale = scale;
        this.myOpacity = 100;

        //define variables for a healthbar
        this.hp = this.max_hp;
        this.healthbar = new HealthBar(game, this);
        this.dead = false;

        //damage cooldown
        this.vulnerable = true;
        this.damagedCooldown = 0;
        this.flickerFlag = false;
        this.critical = false;

        //movement speed on canvas
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 800;

        //if the child class does not have these methods then it will throw an error
        this.checkRequiredMethods();

    }

    /*
    * These methods are required to be an AbstractEntity
    */
    checkRequiredMethods() {

        //load animation states
        if (this.loadAnimations === undefined) {
            throw new TypeError("Must override loadAnimations() method for the entity");
        }

        //draw method to canvas
        if (this.draw === undefined) {
            throw new TypeError("Must override draw method(ctx) for the entity");
        }

        //update entity actions on canvas
        if (this.update === undefined) {
            throw new TypeError("Must override update() method for the entity");
        }

        //get dmg of an attack
        if (this.getDamageValue === undefined) {
            throw new TypeError("Must override getDamageValue() in entity");
        }

        //set state of animation to damaged
        if (this.setDamagedState === undefined) {
            throw new TypeError("Must override setDamagedState() in entity");
        }

        // if (this.updateBoxes === undefined) {
        //     throw new TypeError("Must override updateBoxes() method that updates the BoundingBox!");
        // }


    }

    /**METHODS INHERITED BY ALL ENTITIES */

    /**
     * Do damage to an entity
     * @param {*} entity 
     */
    doDamage(entity) {
        //only do damage if the entity can be damaged
        //make sure the entity has this
        if (entity.canTakeDamage()) {
            var dmg = this.getDamageValue();
            if (dmg > 0) {
                entity.takeDamage(dmg);
            }
        }
    }

    /**
     * Entity takes damages
     * Set dead if hp below 0
     * @param {*} damage 
     */
    takeDamage(damage, isCritical) {
        if (this.canTakeDamage()) {
            isCritical ? ASSET_MANAGER.playAsset(SFX.CRITICAL) : ASSET_MANAGER.playAsset(SFX.DAMAGED);
            this.takeKnockback();
            this.hp -= damage;
            this.vulnerable = false;

            if (this.hp <= 0) {
                this.dead = true;
            }

            this.game.addEntityToFront(new Score(this.game, this, damage, PARAMS.DMG_ID, isCritical));
        }
    }

    /**
     * Entity will be knockbacked after taking damage
     * distance is dependent on how much damage was taken
     * @param {*} damage 
     */
    takeKnockback(damage) {

    }

    /**
     * Checks if entity can be attacked
     * such as not in a vulnerable state
     * @returns 
     */
    canTakeDamage() {
        return this.vulnerable;
    }

    /**
     * Checks and sets the cooldown for the entity
     * to get damaged again.
     * @param {*} TICK 
     */
    checkDamageCooldown(TICK) {
        if (!this.vulnerable) {
            this.damagedCooldown += TICK;
            if (this.damagedCooldown >= PARAMS.DMG_COOLDOWN) {
                this.damagedCooldown = 0;
                this.canAttack = true;
                this.runAway = false;
                this.vulnerable = true;
            }
        }
    }

    /**
     * Randomly calculates if the instance hit the crit percentage
     * @returns bool
     */
    isCriticalHit() {
        let isCritical = false;
        let percentage = (Math.random() * 100);

        isCritical = percentage <= PARAMS.CRITICAL_CHANCE;
        this.critical = isCritical;
        return isCritical;
    }

    /**
    * Dead if too far below the initial level height
    */
    checkInDeathZone() {
        if (this.isDeathZone()) {
            this.takeDamage(this.max_hp, false);
        }
    }

    isDeathZone() {
        let lvlHeight = this.game.camera.levelH * PARAMS.BLOCKDIM;
        return (this.y >= (lvlHeight + this.game.surfaceHeight / 2));
    }

    /**
     * Lowers the opacity each time it is called
     * and draw the entity with that opacity.
     * 
     * Mainly used as a dead fade out animation.
     * @param ctx canvas to draw on
     * @param {*} theAnim the animator to drawframe of
     */
    drawWithFadeOut(ctx, theAnim) {
        if (theAnim.isHalfwayDone() && this.myOpacity > 0) {
            this.myOpacity -= 1;
            ctx.filter = "opacity(" + this.myOpacity + "%)";
            theAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            ctx.filter = "none";
        } else {
            theAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        }
    }

    drawDebug(ctx) {
        const camera = this.game.camera;
        this.healthbar.drawDebug(ctx);
        ctx.strokeStyle = "Blue";
        if (this.VB)
            ctx.strokeRect(this.VB.x - camera.x, this.VB.y - camera.y, this.VB.width, this.VB.height);
        ctx.strokeStyle = "Purple";
        if (this.AR)
            ctx.strokeRect(this.AR.x - camera.x, this.AR.y - camera.y, this.AR.width, this.AR.height);
        ctx.strokeStyle = "Red";
        if (this.BB)
            ctx.strokeRect(this.BB.x - camera.x, this.BB.y - camera.y, this.BB.width, this.BB.height);

        ctx.strokeStyle = "Green";
        if (this.HB)
            ctx.strokeRect(this.HB.x - camera.x, this.HB.y - camera.y, this.HB.width, this.HB.height);
        if (this.displayHitbox) {        // This is the Hitbox, defines space where mob can be hit
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.x + 14 * this.scale, this.y - 37, 21 * this.scale, 51 * this.scale);
        }
        if (this.displayAttackbox) {     // This is Attack Box, defines mob attack area
            ctx.strokeStyle = "Orange";
            this.attackwidth = 200;
            if (this.direction == 0) ctx.strokeRect(this.x - 109, this.y - 53, this.attackwidth, 57 * this.scale);
            else ctx.strokeRect(this.x + 32, this.y - 53, this.attackwidth, 57 * this.scale);
        }
        if (this.displayVisionbox) {      // This is Vision Box, allows mob to see player when it collides with player's hitbox
            this.visionwidth = 1200;
            ctx.strokeStyle = "Yellow";
            ctx.strokeRect(this.x + 62 - this.visionwidth / 2, this.y - 37, this.visionwidth, this.height);
        }
    }

    /**Collision Detection methods for use for all entities */

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
            this.velocity.y = 0;
        }
        if (this.collisions.top) this.velocity.y = 0; //bonk on ceiling halt momentum
        if (this.collisions.lo_left && this.velocity.x < 0) this.velocity.x = 0;
        if (this.collisions.lo_right && this.velocity.x > 0) this.velocity.x = 0;


    }

    /**
    * Call this at the end up the update
    * to change velocities based on any collisions it might have had
     */
    updateVelocity(TICK) {
        //if touching floor entity can jump again
        if (this.collisions.bottom && this.velocity.y > 0) {
            this.velocity.y = 0;
            this.jumped = false;
        }
        if (this.collisions.top && this.velocity.y > 0) {
            //B O N K on ceiling halt momentum
            this.y -= this.velocity.y * TICK;
            this.velocity.y = 0;
        }
        if (this.collisions.left && this.velocity.x < 0) this.velocity.x = 0;
        if (this.collisions.right && this.velocity.x > 0) this.velocity.x = 0;
    }

    /**
     * Used to set the gravity and collision detection for environments and nothing else
     */
    handleGravity() {
        const TICK = this.game.clockTick;
        const SCALER = 3;
        const MAX_RUN = 123 * SCALER;
        const ACC_RUN = 200.390625 * SCALER;
        const MAX_FALL = 270 * SCALER;

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

        let dist = { x: 0, y: 0 }; //the displacement needed between entities
        dist = this.checkEnvironmentCollisions(dist); //check if colliding with environment and adjust entity accordingly
        this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
        this.updateVelocity();
    }

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
        if (this.collisions.top) this.velocity.y = 0; //bonk on ceiling halt momentum
        if (this.collisions.lo_left && this.velocity.x < 0) this.velocity.x = 0;
        if (this.collisions.lo_right && this.velocity.x > 0) this.velocity.x = 0;


    }

    /**
     * Checks collisions with environment.
     * Returns distance needed to be displaced.
     * @param {*} dist 
     * @returns dist 
     */
    checkEnvironmentCollisions(dist) {
        //do collisions detection here
        let lastBB = this.lastBB;
        this.collisions = {
            lo_left: false, hi_left: false, lo_right: false, hi_right: false,
            ceil: false, ceil_left: false, ceil_right: false,
            floor: false, floor_left: false, floor_right: false
        };
        const w = this.BB.right - this.BB.left;
        const h = this.BB.bottom - this.BB.top;
        const BB = {
            top: new BoundingBox(this.BB.left, this.BB.top, w, h / 2),
            bottom: new BoundingBox(this.BB.left, this.BB.top + h / 2, w, h / 2),
            left: new BoundingBox(this.BB.left, this.BB.top, w / 2, h),
            right: new BoundingBox(this.BB.left + w / 2, this.BB.top, w / 2, h),
        };

        let that = this;
        this.game.foreground2.forEach(function (entity) {
            const coll = {
                left: false, right: false, ceil: false, floor: false
            };
            if (entity.BB && that.BB.collide(entity.BB)) {
                // check which side collides
                if (BB.bottom.collide(entity.BB) ) coll.floor = true;
                if (BB.top.collide(entity.BB)) coll.ceil = true;
                if (BB.right.collide(entity.BB) && lastBB.left <= that.BB.left && lastBB.right <= that.BB.right) coll.right = true;
                if (BB.left.collide(entity.BB) && lastBB.left >= that.BB.left && lastBB.right >= that.BB.right) coll.left = true;

                // determine via elimination which side is actually colliding
                if (coll.floor && !coll.ceil) { // somewhere below
                    const y = Math.abs(entity.BB.top - that.BB.bottom);
                    const xL = Math.abs(entity.BB.right - that.BB.left);
                    const xR = Math.abs(entity.BB.left - that.BB.right);
                    if (coll.left && !coll.right && xL < w / 2) { // somwehere left
                        if (xL < y) { // certaintly left
                            that.collisions.lo_left = true;
                            dist.x = entity.BB.right - that.BB.left;
                        }
                        else { // certaintly below
                            that.collisions.floor_left = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    else if (coll.right && !coll.left && xR < w / 2) { // somewhere right
                        if (xR < y) { // certaintly right
                            that.collisions.lo_right = true;
                            dist.x = entity.BB.left - that.BB.right;
                        }
                        else { // certaintly below
                            that.collisions.floor_right = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    else { // certaintly below
                        that.collisions.floor = true;
                        if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                            dist.y = entity.BB.top - that.BB.bottom;
                    }
                }
                else if (coll.ceil && !coll.floor) { // somewhere above
                    const y = Math.abs(entity.BB.bottom - that.BB.top);
                    const xL = Math.abs(entity.BB.right - that.BB.left);
                    const xR = Math.abs(entity.BB.left - that.BB.right);
                    if (coll.left && !coll.right && xL < w / 2) { // somewhere left
                        if (xL <= y) { // certaintly left
                            that.collisions.hi_left = true;
                            dist.x = entity.BB.right - that.BB.left;
                        }
                        else { // certaintly above
                            that.collisions.ceil_left = true;
                            if (Math.abs(entity.BB.bottom - that.BB.top && !that.collisions.floor) > Math.abs(dist.y));
                        }
                    }
                    else if (coll.right && !coll.left && xR < w / 2) { // somewhere right
                        if (xR <= y) { // certaintly right
                            that.collisions.hi_right = true;
                            dist.x = entity.BB.left - that.BB.right;
                        }
                        else { // certaintly above
                            that.collisions.ceil_right = true;
                            if (Math.abs(entity.BB.bottom - that.BB.top && !that.collisions.floor) > Math.abs(dist.y))
                                dist.y = entity.BB.bottom - that.BB.top;
                        }
                    }
                    else { // certaintly above
                        that.collisions.ceil = true;
                        if (Math.abs(entity.BB.bottom - that.BB.top && !that.collisions.floor) > Math.abs(dist.y))
                            dist.y = entity.BB.bottom - that.BB.top;
                    }
                }
                else { // neither above nor below
                    if (coll.left) { // certaintly left
                        that.collisions.lo_left = true;
                        that.collisions.hi_left = true;
                        dist.x = entity.BB.right - that.BB.left;
                    }
                    else if (coll.right) { // certaintly right
                        that.collisions.lo_right = true;
                        that.collisions.hi_right = true;
                        dist.x = entity.BB.left - that.BB.right;
                    }
                }
            }
            that.updateBoxes();

        });
        this.lastBB = this.BB;
        return dist;
    }

    /**Collision helper methods */

    touchFloor() {
        return this.collisions.floor || (this.collisions.floor_right && this.collisions.floor_left) ||
            (this.collisions.floor_right && !this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.floor_left && !this.collisions.hi_left && !this.collisions.lo_left);
    }


    touchHole() {
        return this.collisions.ceil || this.collisions.ceil_right && !this.collisions.lo_right || this.collisions.ceil_left && !this.collisions.lo_left ||
            (this.collisions.hi_right && !this.collisions.lo_right) ||
            (this.collisions.hi_left && !this.collisions.lo_left);
    }


}