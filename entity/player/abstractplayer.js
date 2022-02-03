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

    }

    
    restartGame() {
        if(this.dead) {
            this.game.camera.loadLevel(this.game.camera.currentLevel);
        }
    }

}