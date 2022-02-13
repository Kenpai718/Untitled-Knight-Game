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
            const target = { x: this.game.mouse.x + this.game.camera.x, y: this.game.mouse.y + this.game.camera.y };
            this.game.addEntityToFront(new Arrow(this.game, this.x + this.offsetxBB + 20, (this.y + this.height / 2) + 40, target));
            this.myInventory.arrows--;
            ASSET_MANAGER.playAsset(SFX.BOW_SHOT);

        } else { //out of arrows 
            ASSET_MANAGER.playAsset(SFX.CLICK);
        }
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
    * Player takes damages
    * Set dead if hp below 0
    * Overrides original method to play a different grunt sound
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
                ASSET_MANAGER.playAsset(SFX.PLAYER_DEATH); //OOF!
            } else { //random player grunt
                let rand = randomInt(3);
                let grunt = SFX.PLAYER_GRUNT;
                rand == 0 ? grunt = SFX.PLAYER_GRUNT : rand == 1 ? grunt = SFX.PLAYER_GRUNT2 : grunt = SFX.PLAYER_GRUNT3;
                //console.log(rand + " " + grunt);
                ASSET_MANAGER.playAsset(grunt);
            }

            this.game.addEntityToFront(new Score(this.game, this, damage, PARAMS.DMG_ID, isCritical));
        }
    }


    /**
     * Restarts the current level when called
     */
    restartGame() {
        this.game.camera.loadLevel(this.game.camera.currentLevel);
    }
}