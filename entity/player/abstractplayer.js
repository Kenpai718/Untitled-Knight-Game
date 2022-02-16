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
            const target = this.chooseArrowTarget();
            this.game.addEntityToFront(new Arrow(this.game, this.x + this.offsetxBB + 20, (this.BB.top + this.BB.height / 4), target));
            this.myInventory.arrows--;
            ASSET_MANAGER.playAsset(SFX.BOW_SHOT);

        } else { //out of arrows
            ASSET_MANAGER.playAsset(SFX.CLICK);
        }
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
                if(this.game.up) {
                    myTargetY = myY - 500;
                } else if(this.game.down && this.inAir) {
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
        if (this.animations[this.facing][this.action].isDone()) {
            this.restartGame();
        }
    }


    /**
     * Restarts the current level when called
     */
    restartGame() {
        // remove the current level from the level states
        this.game.camera.levelState.splice(this.game.camera.levelState.indexOf(this.game.camera.currentLevel, 1));
        // set restart flag to true so that the state isn't saved
        this.game.camera.restart = true;
        this.game.camera.loadLevel(this.game.camera.currentLevel);
    }
}
