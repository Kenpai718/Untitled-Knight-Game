class AbstractBarrier {
    constructor(game, x, y, w, h) {
        Object.assign(this, {game, x, y, w, h});
    }

    update() {
    };

    draw(ctx) {
    }

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        if (this.BB)
            ctx.strokeRect(this.BB.x-this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
    }

    /**
     * Draws the tile in a minimap. Expected all parameters are translated beforehand.
     * @param {} ctx 
     * @param {*} mmX 
     * @param {*} mmY 
     * @param {*} mmW 
     * @param {*} mmH 
     */
    drawMinimap(ctx, mmX, mmY) {
        
    }
}

class Ground extends AbstractBarrier {
    constructor(game, x, y, w, h, type) {
        super(game, x, y, w, h);
        this.type = type;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        // left is for left corner piece, middle is for middle piece, right is for right corner piece
        this.types = { left : 0, middle : 1, right : 2};
        // switch expression to get the source coordinates depending on the type
        switch (this.type) {
            case this.types.left:
                this.srcX = 16;
                break;
            case this.types.middle:
                this.srcX = 32;
                break;
            case this.types.right:
                this.srcX = 48;
                break;
        }
        this.srcY = 16;
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.scale = PARAMS.BLOCKDIM;
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
    };

    draw(ctx) {
        let blockCount = this.w / this.scale; // number of blocks to draw
        for (let i = 0; i < blockCount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x + (i * this.scale) - this.game.camera.x, this.y - this.game.camera.y, this.scale, this.scale);
        }
    };

    /**
     * Draw minimap for ground
     * @param {} ctx 
     * @param {*} mmX minimap x cord
     * @param {*} mmY minimap y cord
     * @param {*} mmY minimap's level width
     * @param {*} mmY minimap's level height
     */
    drawMinimap(ctx, mmX, mmY, levelW, levelH) {
        let blockCount = this.w / PARAMS.BLOCKDIM; 
        ctx.fillStyle = "brown";
        //let print = true;

        for (let i = 0; i < blockCount; i++) {
            let myX = ( mmX + Math.round(this.x / PARAMS.BLOCKDIM));
            let myY = mmY - (levelH - Math.round(this.y / PARAMS.BLOCKDIM)  - 1);
            let myW = PARAMS.SCALE;
            let myH = PARAMS.SCALE;

            ctx.fillRect(myX + (i * PARAMS.SCALE), myY, myW, myH);
            //ctx.drawImage(this.srcX, this.srcY, this.srcWidth, this.srcHeight, 
            //this.x + (i * this.scale) - this.game.camera.x, this.y - this.game.camera.y, this.scale, this.scale);
        }

    }
};

class Walls extends AbstractBarrier {
    constructor(game, x, y, w, h, type) {
        super(game, x, y, w, h);
        this.type = type;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        // left : middle left wall, leftCorner : bottom left corner wall, right : middle right wall, rightCorner : bottom right corner wall
        this.types = { left : 0, leftCorner : 1, right : 2, rightCorner : 3};
        // switch expression to get the source coordinates depending on the type
        switch (this.type) {
            case this.types.left:
                this.srcX = 16;
                this.srcY = 32;
                break;
            case this.types.leftCorner:
                this.srcX = 16;
                this.srcY = 48;
                break;
            case this.types.right:
                this.srcX = 48;
                this.srcY = 32;
                break;
            case this.types.rightCorner:
                this.srcX = 48;
                this.srcY = 48;
                break;
        }
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.scale = PARAMS.BLOCKDIM;
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
    };

    draw(ctx) {
        let blockcount = this.h / this.scale;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x - this.game.camera.x, this.y + (i * this.scale) - this.game.camera.y, this.scale, this.scale);
        }
    };
};

class Brick extends AbstractBarrier {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        // only need to worry about these if you want a specific kind of brick
        this.types = { middle : 0, innerLeft : 1, innerRight : 2, broken1 : 3, broken2 : 4, broken3 : 5, broken4 : 6, broken5 : 7, broken6 : 8};
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.bricks = [];
        this.loadBricks();
        this.updateBB();
    };

    // generates a random 2d array of brick types
    loadBricks() {
        let blocksY = this.h / this.scale;
        let blocksX = this.w / this.scale;
        for (let i = 0; i < blocksY; i++) {
            this.bricks.push([]);
            for (let j = 0; j < blocksX; j++) {
                this.bricks[i].push([j]);
                this.type = randomInt(9);
                this.getBrickType();
                this.bricks[i][j] = { x : this.srcX, y : this.srcY };
            }
        }
    };

    // switch expression to get the source coordinates depending on the type
    getBrickType() {
        switch (this.type) {
            case this.types.middle:
                this.srcX = 32;
                this.srcY = 32;
                break;
            case this.types.innerLeft:
                this.srcX = 80;
                this.srcY = 32;
                break;
            case this.types.innerRight:
                this.srcX = 112;
                this.srcY = 32;
                break;
            case this.types.broken1:
                this.srcX = 32;
                this.srcY = 48;
                break;
            case this.types.broken2:
                this.srcX = 80;
                this.srcY = 16;
                break;
            case this.types.broken3:
                this.srcX = 96;
                this.srcY = 16;
                break;
            case this.types.broken4:
                this.srcX = 112;
                this.srcY = 16;
                break;
            case this.types.broken5:
                this.srcX = 80;
                this.srcY = 48;
                break;
            case this.types.broken6:
                this.srcX = 112;
                this.srcY = 48;
                break;
        }
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
    };

    draw(ctx) {
        let blocksY = this.h / this.scale; // number of rows of blocks
        let blocksX = this.w / this.scale; // number of columns of blocks
        for (var i = 0; i < blocksY; i++) {
            for (var j = 0; j < blocksX; j++) {
                ctx.drawImage(this.spritesheet, this.bricks[i][j].x, this.bricks[i][j].y, this.srcWidth, this.srcHeight, this.x + (j * this.scale) - this.game.camera.x, this.y + (i * this.scale) - this.game.camera.y, this.scale, this.scale);
            }
        }
    };
};

class Platform extends AbstractBarrier {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.srcX = 144;
        this.srcY = 32;
        this.srcWidth = 16;
        this.srcHeight = 13;
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
    };

    draw(ctx) {
        let blockCount = this.w / this.scale;
        for (let i = 0; i < blockCount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x + (i * this.scale) - this.game.camera.x, this.y - this.game.camera.y, this.scale, this.scale);
        }
    };
};

class BackgroundWalls {
    constructor(game, x, y, w, h) {
        Object.assign(this, { game, x, y, w, h});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.bricks = [];
        this.loadBricks();
    };

    // generates a random array of brick types
    loadBricks() {
        let blockCountY = this.h / this.scale;
        let blockCountX = this.w / this.scale;
        for (let i = 0; i < blockCountY; i++) {
            this.bricks.push([]);
            for (let j = 0; j < blockCountX; j++) {
                this.bricks[i].push([]);
                this.type = randomInt(20);
                this.getTileType();
                this.bricks[i][j] = { x : this.srcX, y : this.srcY };
            }
        }
    };

    // switch expression to get the source coordinates depending on the type
    getTileType() {
        switch (this.type) {
            case 0:
                this.srcX = 176;
                this.srcY = 48;
                break;
            case 1:
                this.srcX = 208;
                this.srcY = 48;
                break;
            default:
                this.srcX = 176;
                this.srcY = 30;
        }
    };

    update() {
    };

    draw(ctx) {
        let blockCountY = this.h / this.scale;
        let blockCountX = this.w / this.scale;
        for (let i = 0; i < blockCountY; i++) {
            for (let j = 0; j < blockCountX; j++) {
                ctx.drawImage(this.spritesheet, this.bricks[i][j].x, this.bricks[i][j].y, this.srcWidth, this.srcHeight, this.x + (j * this.scale) - this.game.camera.x, this.y + (i * this.scale) - this.game.camera.y, this.scale, this.scale);
            }
        }

    };
};

class AbstractBackFeature {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
    }

    update() {}
    drawDebug() {}
}

class Torch extends AbstractBackFeature {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = 5;
        this.animation = new Animator(this.spritesheet, 19, 112, 17, 17, 3, 0.7, 4, false, true, false); // torch animation
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
    };
};

class Window extends AbstractBackFeature {
    constructor(game, x, y, w, h) {
        super(game, x, y);
        this.w = w;
        this.h = h;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 176;
        this.srcY = 70;
        this.srcW = 19;
        this.srcH = 25;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - this.game.camera.y, this.w, this.h);
    };
};

class Banner extends AbstractBackFeature {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 207;
        this.srcY = 7;
        this.srcW = 18;
        this.srcH = 23;
        this.w = 1 * PARAMS.BLOCKDIM;
        this.h = 3 * PARAMS.BLOCKDIM;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - this.game.camera.y, this.w, this.h);
    };
};

class Chain extends AbstractBackFeature {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 245;
        this.srcY = 7;
        this.srcW = 7;
        this.srcH = 26;
        this.w = PARAMS.BLOCKDIM / 2;
        this.h = 2 * PARAMS.BLOCKDIM;
        this.x += this.w;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - this.game.camera.y, this.w, this.h);
    };
};

class CeilingChain extends AbstractBackFeature {
    constructor(game, x, y, h) {
        super(game, x, y);
        this.h = h;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 256;
        this.srcY = 7;
        this.srcW = 3;
        this.srcH = 18;
        this.w = PARAMS.BLOCKDIM / 4;
        this.x += this.w;
    };

    draw(ctx) {
        let blockcount = this.w / PARAMS.BLOCKDIM;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - (i * 2 * PARAMS.BLOCKDIM) - this.game.camera.y, this.w, PARAMS.BLOCKDIM * this.h);
        }
    };
};

class Column extends AbstractBackFeature {
    constructor(game, x, y, h) {
        super(game, x, y);
        this.h = h;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 320;
        this.srcY = 27;
        this.srcW = 19;
        this.srcH = 28;
        this.baseX = 320;
        this.baseY = 55;
        this.baseW = 16;
        this.baseH = 9;
        this.w = 1 * PARAMS.BLOCKDIM;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - this.game.camera.y, this.w, this.h);
        ctx.drawImage(this.spritesheet, this.baseX, this.baseY, this.baseW, this.baseH, this.x - this.game.camera.x, this.y - this.game.camera.y + this.h - PARAMS.BLOCKDIM, this.w, PARAMS.BLOCKDIM);
    };
};

class Support extends AbstractBackFeature {
    constructor(game, x, y, w) {
        super(game, x, y);
        this.w = w;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 272;
        this.srcY = 0;
        this.srcW = 32;
        this.srcH = 13;
        this.h = 1 * PARAMS.BLOCKDIM;
    };

    draw(ctx) {
        let blockcount = this.w / PARAMS.BLOCKDIM;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x + (i * PARAMS.BLOCKDIM) - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKDIM, this.h);
        }
    };
}
