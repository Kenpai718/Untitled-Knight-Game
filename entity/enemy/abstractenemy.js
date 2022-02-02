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

    }

}