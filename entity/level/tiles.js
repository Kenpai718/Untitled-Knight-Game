class Ground {
    //game = game engine
    //x, y = starting x and y cords on canvas
    //w, h = dimensions to draw image
    constructor(game, x, y, w, h, type) {
        Object.assign(this, { game, x, y, w, h, type});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        //cordinates of the "castle" ground tile on spritesheet
        this.types = { left : 0, middle : 1, right : 2};

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

        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + this.w / 2, this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
    };

    update() {
    };

    //draw the ground based on constructor values
    draw(ctx) {
        let blockCount = this.w / this.scale;
        for (let i = 0; i < blockCount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x + (i * this.scale) - this.game.camera.x, this.y, this.scale, this.scale);
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x-this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};

class Walls {
    //game = game engine
    //x, y = starting x and y cords on canvas
    //w, h = dimensions to draw image
    constructor(game, x, y, w, h, type) {
        Object.assign(this, { game, x, y, w, h, type});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        //cordinates of the "castle" ground tile on spritesheet
        this.types = { left : 0, leftCorner : 1, right : 2, rightCorner : 3};

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

        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + this.w / 2, this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x
            , this.y + this.h / 2, this.w, this.h / 2);
    };

    update() {
    };

    //draw the ground based on constructor values
    draw(ctx) {
        let blocksY = this.h / this.scale;
        let blocksX = this.w / this.scale;
        for (let i = 0; i < blocksY; i++) {
            for (let j = 0; j < blocksX; j++) {
                ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x + (j * this.scale) - this.game.camera.x, this.y + (i * this.scale), this.scale, this.scale);
            }
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
}
class BackgroundWalls {
    //game = game engine
    //x, y = starting x and y cords on canvas
    //w, h = dimensions to draw image
    constructor(game, x, y, w, h) {
        Object.assign(this, { game, x, y, w, h});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        //cordinates of the "castle" ground tile on spritesheet
        this.bricks = [];
        this.srcY = 48;
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.scale = PARAMS.BLOCKDIM;
    };

    getTileType() {
        switch (this.type) {
            case 0:
                this.srcX = 176;
                break;
            case 1:
                this.srcX = 208;
                break;
        }
    };

    update() {
    };

    //draw the ground based on constructor values
    draw(ctx) {
        let blockCount = this.w / this.scale;
        for (let i = 0; i < blockCount; i++) {
            if (this.bricks.length != blockCount) {
                this.type = randomInt(2);
                this.getTileType();
                this.bricks[i] = { x : this.srcX, y : this.srcY};
            }
            ctx.drawImage(this.spritesheet, this.bricks[i].x, this.bricks[i].y, this.srcWidth, this.srcHeight, this.x + (i * this.scale) - this.game.camera.x, this.y, this.scale, this.scale);
        }

    };
}

class Torch {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.animation = new Animator(this.spritesheet, 19, 112, 17, 17, 3, 0.7, 4, false, true, false);
        this.scale = 5;
    };

    update() {

    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, this.scale);
    };
}

class Platform {
    //game = game engine
    //x, y = starting x and y cords on canvas
    //w, h = dimensions to draw image
    constructor(game, x, y, w, h) {
        Object.assign(this, { game, x, y, w, h });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

        //cordinates of the "castle" platform tile on spritesheet
        this.srcX = 144;
        this.srcY = 32;
        this.srcWidth = 16;
        this.srcHeight = 13;

        this.scale = PARAMS.BLOCKDIM;

        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + this.w / 2, this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, this.h);
        this.rightBB = new BoundingBox(this.x + (this.w / 2), this.y, this.w / 2, this.h);
        this.topBB = new BoundingBox(this.x, this.y, this.w, this.h / 2);
        this.bottomBB = new BoundingBox(this.x, this.y + this.h / 2, this.w, this.h / 2);
    };

    update() {
    };

    //draw the ground based on constructor values
    draw(ctx) {
        let blockCount = this.w / this.scale;
        for (let i = 0; i < blockCount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x + (i * this.scale) - this.game.camera.x, this.y, this.scale, this.scale);
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };

}

class Brick {
    //game = game engine
    //x, y = starting x and y cords on canvas
    //w, h = dimensions to draw image
    constructor(game, x, y, w, h, type, random) {
        Object.assign(this, { game, x, y, w, h, type, random});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.types = { middle : 0, innerLeft : 1, innerRight : 2, broken1 : 3, broken2 : 4, broken3 : 5, broken4 : 6, broken5 : 7, broken6 : 8};
        //cordinates of the "castle" brick tile on spritesheet
        if (!this.random) this.getBrickType();
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.scale = PARAMS.BLOCKDIM;
        this.bricks = [];
        this.updateBB();
    };

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

    update() {
    };

    //draw the ground based on constructor values
    draw(ctx) {
        let blockCount = this.w / this.scale;
        for (let i = 0; i < blockCount; i++) {
            if (this.bricks.length != blockCount) {
                this.type = randomInt(9);
                this.getBrickType();
                this.bricks[i] = { x : this.srcX, y : this.srcY};
            }
            ctx.drawImage(this.spritesheet, this.bricks[i].x, this.bricks[i].y, this.srcWidth, this.srcHeight, this.x + (i * this.scale) - this.game.camera.x, this.y, this.scale, this.scale);
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};
