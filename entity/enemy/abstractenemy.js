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
        this.collisions = {left: false, right: false, top: false, bottom: false};
    }


    /** checks collisions on walls */
    collisionWall() {
        //do collisions detection here
        this.collisions = {left: false, right: false, top: false, bottom: false};
        const w = this.BB.right - this.BB.left;
        const h = this.BB.bottom - this.BB.top;
        const BB = {top: new BoundingBox(this.BB.left, this.BB.top, w, h / 2), 
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
                        else if (xL > w / 16){ // certaintly below
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
    }

}