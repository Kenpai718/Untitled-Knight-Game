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

        //view BB
        if (this.viewBoundingBox === undefined) {
            throw new TypeError("Must override viewBoundingBox() method to see box in debugging");
        }

        //get dmg of an attack
        if (this.getDamageValue === undefined) {
            throw new TypeError("Must override getDamageValue() in entity");
        }

        // if (this.updateBoxes === undefined) {
        //     throw new TypeError("Must override updateBoxes() method that updates the BoundingBox!");
        // }


    }

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
                this.game.addEntityToFront(new DamageScore(this.game, entity, dmg));
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
            ASSET_MANAGER.playAsset(SFX.DAMAGED);
            this.takeKnockback();
            this.hp -= damage;
            this.vulnerable = false;

            if(this.hp <= 0) {
                this.dead = true;
            }

            this.game.addEntityToFront(new DamageScore(this.game, this, damage, isCritical));
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

    isCriticalHit() {
        let isCritical = false;
        let percentage = (Math.random() * 100);

        isCritical = percentage <= PARAMS.CRITICAL_CHANCE;
        this.critical = isCritical;
        return isCritical;
    }
}