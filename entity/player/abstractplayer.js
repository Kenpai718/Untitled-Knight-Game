/**
 * Abstract implementation of an enemy so polymorphism can be used
 * 
 * Mainly used for the "is-a" relationship
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
     * Use a potion to heal the character for up to half their hp
     */
    healPotion() {
        if (this.hp < this.max_hp) {
            let potionRestore = (this.max_hp / 2);
            let healed;

            if((potionRestore + this.hp) >= this.max_hp) {
                healed = this.max_hp - this.hp;
            } else {
                healed = potionRestore;
            }

            this.hp += healed;
            this.myInventory.potions--;
            ASSET_MANAGER.playAsset(SFX.HEAL);
            this.game.addEntityToFront(new Score(this.game, this, healed, PARAMS.HEAL_ID, false));
        }
    }

    /**
    * Entity takes damages
    * Set dead if hp below 0
    * 
    * override to add player death sound
    * @param {*} damage 
    */
    takeDamage(damage, isCritical) {
        if (this.canTakeDamage()) {
            ASSET_MANAGER.playAsset(SFX.DAMAGED);
            this.takeKnockback();
            this.hp -= damage;
            this.vulnerable = false;

            if (this.hp <= 0) {
                this.dead = true;
                ASSET_MANAGER.playAsset(SFX.PLAYER_DEATH);
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

    /**
     * Dead if too far below the stage
     */
    checkInDeathZone() {
        if(this.y >= (this.game.surfaceHeight + 200)) {
            this.takeDamage(this.max_hp, false);
            this.restartGame();
        }
    }

}