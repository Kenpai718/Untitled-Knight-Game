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
        let lvlHeight = this.game.camera.levelH * PARAMS.BLOCKDIM;
        if (this.y >= (lvlHeight + this.game.camera.y * 1.5)) {
            this.takeDamage(this.max_hp, false);
        }
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
        if(theAnim.isHalfwayDone() && this.myOpacity > 0) {
            this.myOpacity -= 1;
            ctx.filter = "opacity(" + this.myOpacity + "%)";
            theAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            ctx.filter = "none";
        } else {
            theAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        }
    }

    drawDebug(ctx) {
        this.healthbar.drawDebug(ctx);
        ctx.strokeStyle = "Blue";
        if (this.VB)
            ctx.strokeRect(this.VB.x - this.game.camera.x, this.VB.y - this.game.camera.y, this.VB.width, this.VB.height);
        ctx.strokeStyle = "Purple";
        if (this.AR)
            ctx.strokeRect(this.AR.x - this.game.camera.x, this.AR.y - this.game.camera.y, this.AR.width, this.AR.height);
        ctx.strokeStyle = "Red";
        if (this.BB)
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);

        ctx.strokeStyle = "Green";
        if (this.HB)
            ctx.strokeRect(this.HB.x - this.game.camera.x, this.HB.y - this.game.camera.y, this.HB.width, this.HB.height);


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

}