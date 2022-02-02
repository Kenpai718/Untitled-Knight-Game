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
        Object.assign(this, {game, x, y, name, max_hp});
        this.width = width * scale;
        this.height = height * scale;
        this.scale = scale;

        //define variables for a healthbar
        this.hp = this.max_hp;
        this.healthbar = new HealthBar(game, this);

        //if the child class does not have these methods then it will throw an error
        this.checkRequiredMethods();

    }

    /*
    * These methods are required to be an AbstractEntity
    */
    checkRequiredMethods() {
        
        if (this.loadAnimations === undefined) {
            throw new TypeError("Must override loadAnimations() method for the entity");
        }
                
        if (this.draw === undefined) {
            throw new TypeError("Must override draw method() for the entity");
        }

        if (this.update === undefined) {
            throw new TypeError("Must override update() method for the entity");
        }

        if (this.canTakeDamage === undefined) {
            throw new TypeError("Must override canTakeDamage() method to check if entity can be damaged!");
        }

        if (this.viewBoundingBox === undefined) {
            throw new TypeError("Must override viewBoundingBox() method to see box in debugging");
        }

        
        // if (this.updateBoxes === undefined) {
        //     throw new TypeError("Must override updateBoxes() method that updates the BoundingBox!");
        // }


    }

}