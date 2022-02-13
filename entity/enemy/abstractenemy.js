/**
 * Abstract implementation of an enemy so polymorphism can be used
 * 
 * Mainly used for the "is-a" relationship
 */

class AbstractEnemy extends AbstractEntity {
    constructor(game, x, y, name, max_hp, width, height, scale) {
        super(game, x, y, name, max_hp, width, height, scale);
        if (new.target === AbstractEnemy) {
            throw new TypeError("Cannot construct AbstractEnemy instance directly!");
        }
        this.collisions = { left: false, right: false, top: false, bottom: false };

        //entity will try to jump if it is stuck in one x-cord for too long
        this.jumped = false;
        this.JUMP_HEIGHT = 650;
        this.stuckTimer = 0;
        this.lastXCord = Math.round(this.x);

        //aggro will chase player for a certain amount of time
        this.aggro = false; //toggled by being hit by a projectile
        this.aggroTimer = 0;
        this.aggroCooldown = 3; //after 5 seconds turn off the aggro
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
        if(this.collisions.top) this.velocity.y = 0; //bonk on ceiling halt momentum
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
                if (BB.bottom.collide(entity.BB)) coll.floor = true;
                if (BB.top.collide(entity.BB)) coll.ceil = true;
                if (BB.right.collide(entity.BB)) coll.right = true;
                if (BB.left.collide(entity.BB)) coll.left = true;

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

    /**
     * Reset aggro after a certain amount of time
     * Aggro means the enemy will chase the player around
     */
    setAggro() {
        if(this.aggro) {
            this.aggroTimer += this.game.clockTick;

            if(this.aggroTimer >= this.aggroCooldown) {
                this.aggro = false;
                this.aggroTimer = 0;
            }
        }
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
        if(this.collisions.top && this.velocity.y > 0) {
            //B O N K on ceiling halt momentum
            this.y -= this.velocity.y * TICK;
            this.velocity.y = 0; 
        } 
        if (this.collisions.left && this.velocity.x < 0) this.velocity.x = 0;
        if (this.collisions.right && this.velocity.x > 0) this.velocity.x = 0;
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
            if(this.state == this.states.move && this.velocity.x == 0 && !this.touchHole()) {
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
     * Jump if able to
     */
    doJump() {
        if (!this.jumped) {
            this.jumped = true;
            this.velocity.y -= this.JUMP_HEIGHT;
            //ASSET_MANAGER.playAsset(SFX.JUMP2);
        }
    }

    



}