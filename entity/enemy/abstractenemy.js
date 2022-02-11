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


    /** checks collisions on walls */
    collisionWall() {
        //do collisions detection here
        this.collisions = { left: false, right: false, top: false, bottom: false };
        const w = this.BB.right - this.BB.left;
        const h = this.BB.bottom - this.BB.top;
        const BB = {
            top: new BoundingBox(this.BB.left, this.BB.top, w, h / 2),
            bottom: new BoundingBox(this.BB.left, this.BB.top + h / 2, w, h / 2),
            left: new BoundingBox(this.BB.left, this.BB.top, w / 2, h),
            right: new BoundingBox(this.BB.left + w / 2, this.BB.top, w / 2, h),
        };
        let dist = { x: 0, y: 0 };

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
                    if (coll.left && !coll.right) { // somwehere left
                        if (xL < y && y > h / 16) { // certaintly left
                            that.collisions.left = true;
                            dist.x = entity.BB.right - that.BB.left;
                        }
                        else if (xL > w / 16) { // certaintly below
                            that.collisions.bottom = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    else if (coll.right && !coll.left) { // somewhere right
                        if (xR < y && y > h / 16) { // certaintly right
                            that.collisions.right = true;
                            dist.x = entity.BB.left - that.BB.right;
                        }
                        else if (xR > w / 16) { // certaintly below
                            that.collisions.bottom = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    else { // certaintly below
                        that.collisions.bottom = true;
                        if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                            dist.y = entity.BB.top - that.BB.bottom;
                    }
                }
                else if (coll.top && !coll.bottom) { // somewhere below
                    const y = Math.abs(entity.BB.bottom - that.BB.top);
                    const xL = Math.abs(entity.BB.right - that.BB.left);
                    const xR = Math.abs(entity.BB.left - that.BB.right);
                    if (coll.left && !coll.right && xL < w / 2) { // somwehere left
                        if (xL < y && y > h / 8) { // certaintly left
                            that.collisions.left = true;
                            dist.x = entity.BB.right - that.BB.left;
                        }
                        else { // certaintly below
                            that.collisions.top = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    else if (coll.right && !coll.left && xR < w / 2) { // somewhere right
                        if (xR < y && y > h / 8) { // certaintly right
                            that.collisions.right = true;
                            dist.x = entity.BB.left - that.BB.right;
                        }
                        else { // certaintly below
                            that.collisions.bottom = true;
                            if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                                dist.y = entity.BB.top - that.BB.bottom;
                        }
                    }
                    else { // certaintly below
                        that.collisions.top = true;
                        if (Math.abs(entity.BB.top - that.BB.bottom) > Math.abs(dist.y) || dist.y > 0)
                            dist.y = entity.BB.top - that.BB.bottom;
                    }
                }
                else { // neither above nor below
                    if (coll.left) { // certaintly left
                        that.collisions.left = true;
                        dist.x = entity.BB.right - that.BB.left;
                    }
                    else if (coll.right) { // certaintly right
                        that.collisions.right = true;
                        dist.x = entity.BB.left - that.BB.right;
                    }
                }
            }
        });

        // update positions based on environment collisions
        this.x += dist.x;
        this.y += dist.y;
        this.updateBoxes();


        //check to see if entity hit the bottom blastzone
        super.checkInDeathZone();
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
    updateVelocity() {
        //if touching floor entity can jump again
        if (this.collisions.bottom && this.velocity.y > 0) {
            this.velocity.y = 0;
            this.jumped = false;
        }
        if(this.collisions.top && this.velocity.y > 0) {
            //B O N K on ceiling halt momentum
            this.y -= that.velocity.y * TICK;
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
            if(this.state == this.states.move && this.velocity.x == 0) {
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