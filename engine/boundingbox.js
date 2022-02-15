class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });
        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    collide(oth) {
        if (this.right >= oth.left && this.left <= oth.right && this.top <= oth.bottom && this.bottom >= oth.top) return true;
        return false;
    };

    collideMouse(x, y) {
        if (x >= this.left && x <= this.right && y <= this.top && y >= this.bottom) return true;
        return false;
    }

};
