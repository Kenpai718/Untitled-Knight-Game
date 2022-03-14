class AbstractBarrier {
    constructor(game, x, y, w, h, srcWidth, srcHeight, myOpacity) {
        Object.assign(this, {game, x, y, w, h, srcWidth, srcHeight, myOpacity});
        this.canvas = document.createElement("Canvas"); 
	    this.ctx = this.canvas.getContext("2d");
        this.canvas.width = srcWidth * w;
        this.canvas.height = srcHeight * h;
        this.myOpacity = myOpacity;
    }

    loadImage() {
        throw new TypeError("Cannot load image directly from AbstractBarrier instance directly!");
    }

    update(){
    };

    draw(ctx) {
        ctx.filter = "opacity(" + this.myOpacity + "%)";
        
        ctx.drawImage(this.canvas, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h * this.scale);

        ctx.filter = "none";
    }

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        if (this.BB) {
            ctx.strokeRect(this.BB.x-this.game.camera.x, this.BB.y - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
        }
        if(this.TBB){
            ctx.strokeStyle = "Yellow";
            ctx.strokeRect(this.TBB.x-this.game.camera.x, this.TBB.y - this.game.camera.y, this.TBB.width, this.TBB.height);
        }
    }

    updateBB() {
        const scale = this.scale;
        this.BB = new BoundingBox(this.x * scale, this.y * scale, this.w * scale, this.h * scale);
        this.leftBB = new BoundingBox(this.x * scale, this.y * scale, this.w / 2 * scale, this.h * scale);
        this.rightBB = new BoundingBox(this.x * scale + (this.w / 2) * scale, this.y * scale, this.w / 2 * scale, this.h * scale);
        this.topBB = new BoundingBox(this.x * scale, this.y * scale, this.w * scale, this.h / 2 * scale);
        this.bottomBB = new BoundingBox(this.x * scale, this.y + this.h / 2 * scale, this.w * scale, this.h / 2 * scale);
    };
}

class Barrier extends AbstractBarrier {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h, 0, 0);
        this.scale = PARAMS.BLOCKDIM;
        this.ctx = null;
        this.canvas = null;
        this.updateBB();
    };
};

class TrappedFloor extends AbstractBarrier {
    constructor(game, x, y, w, h, type, percent, rate) {

        if(type < 3){
            h = 1;
        }

        super(game, x, y, w, h, 16, 16, 100);
        
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        
        this.type = type;
        this.percent = percent;
        this.rate = rate;
        this.decay = false;

        this.scale = PARAMS.BLOCKDIM;
        this.srcY;
        
        // GROUND: left is for left corner piece, middle is for middle piece, right is for right corner piece
        if(this.type < 3) {
            this.srcY = 16;
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
            this.loadImageGround();
        }
        else{ // BRICKS
            this.srcY = 32;
            this.type -= 3;
            this.types = { middle : 0, innerLeft : 1, innerRight : 2, broken1 : 3, broken2 : 4, broken3 : 5, broken4 : 6, broken5 : 7, broken6 : 8};
            this.loadImageBrick();
        }
        
        this.updateBB();
        this.updateTrapBB();
    };

    updateTrapBB(){
        this.TBB = new BoundingBox(this.BB.x + (this.BB.width - this.BB.width * this.percent)/2, this.BB.y - PARAMS.BLOCKDIM, this.BB.width * this.percent, PARAMS.BLOCKDIM);
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

    loadImageBrick() {
        let blocksY = this.h;
        let blocksX = this.w;
        for (let i = 0; i < blocksY; i++) {
            for (let j = 0; j < blocksX; j++) {
                this.type = randomInt(9);
                this.getBrickType();
                let w = this.srcWidth;
                let h = this.srcHeight;
                this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, w, h, j * w, i * h, w, h);
            }
        }
        
    };

    loadImageGround() {
        let sW = this.srcWidth;
        let sH = this.srcHeight;
        for (var i = 0; i < this.w; i++) 
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, i * sW, 0, sW, sH);
    };

    update(){

        if(this.decay && this.myOpacity > 0){
            this.myOpacity -= this.game.clockTick * this.rate;
        } else if(this.decay && this.myOpacity <= 0) this.removeFromWorld = true;

        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {
                if(entity.BB && self.TBB.collide(entity.BB)) {
                    self.decay = true;
                }
            }
        });
    };

};

class Ground extends AbstractBarrier {
    constructor(game, x, y, w, h, left, right) {
        super(game, x, y, w, h, 16, 16);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        // left is for left corner piece, middle is for middle piece, right is for right corner piece
        this.types = { left : 0, middle : 1, right : 2};
        // switch expression to get the source coordinates depending on the type
        this.srcY = 16;
        this.scale = PARAMS.BLOCKDIM;
        this.updateBB();
        this.loadImage(left, right);
    };

    switchType () {
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
    }

    loadImage(left, right) {
        let sW = this.srcWidth;
        let sH = this.srcHeight;
        this.type = this.types.middle;
        this.switchType();
        for (var i = 0; i < this.w; i++) 
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, i * sW, 0, sW, sH);
        if (left) {
            this.type = this.types.left;
            this.switchType();
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, 0, 0, sW, sH);
        }
        if (right) {
            this.type = this.types.right;
            this.switchType();
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, (this.w-1) * sW, 0, sW, sH);
        }
    }

};

class Walls extends AbstractBarrier {
    constructor(game, x, y, w, h, type, corner) {
        super(game, x, y, w, h, 16, 16);
        this.type = type;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        // left : middle left wall, leftCorner : bottom left corner wall, right : middle right wall, rightCorner : bottom right corner wall
        this.types = { left : 0, leftCorner : 1, right : 2, rightCorner : 3};
        
        this.scale = PARAMS.BLOCKDIM;
        this.updateBB();
        this.loadImage(corner);
    };

    switchType() {
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
    }

    loadImage(corner) {
        let sW = this.srcWidth;
        let sH = this.srcHeight;
        this.switchType();
        for (var i = 0; i < this.h; i++) 
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, 0, i * sH, sW, sH);
        if (corner) {
            this.type++;
            this.switchType();
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, 0, (this.h - 1) * sH, sW, sH);
        }
    }
};

class Brick extends AbstractBarrier {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h, 16, 16);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        // only need to worry about these if you want a specific kind of brick
        this.types = { middle : 0, innerLeft : 1, innerRight : 2, broken1 : 3, broken2 : 4, broken3 : 5, broken4 : 6, broken5 : 7, broken6 : 8};
        this.loadImage();
        this.updateBB();
    };

    // generates a random 2d array of brick types
    loadImage() {
        let blocksY = this.h;
        let blocksX = this.w;
        for (let i = 0; i < blocksY; i++) {
            for (let j = 0; j < blocksX; j++) {
                this.type = randomInt(9);
                this.getBrickType();
                let w = this.srcWidth;
                let h = this.srcHeight;
                this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, w, h, j * w, i * h, w, h);
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
};

class Block extends AbstractBarrier{
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h, 16, 16);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        // left is for left corner piece, middle is for middle piece, right is for right corner piece
        this.types = { topleft : 0, topmiddle : 1, topright : 2,
            left : 3, middle : 4, right : 5,
            bottomleft : 6, bottommiddle : 7, bottomright : 8};
        this.scale = PARAMS.BLOCKDIM;
        this.updateBB();
        this.loadImage();
    };

    getType(type) {
        // switch expression to get the source coordinates depending on the type
        switch (type) {
            case this.types.topleft:
                this.srcX = 16;
                this.srcY = 16;
                break;
            case this.types.topmiddle:
                this.srcX = 32;
                this.srcY = 16;
                break;
            case this.types.topright:
                this.srcX = 48;
                this.srcY = 16;
                break;
            case this.types.left:
                this.srcX = 16;
                this.srcY = 32;
                break;
            case this.types.middle:
                this.srcX = 32;
                this.srcY = 32;
                break;
            case this.types.right:
                this.srcX = 48;
                this.srcY = 32;
                break;
                case this.types.bottomleft:
                this.srcX = 16;
                this.srcY = 48;
                break;
            case this.types.bottommiddle:
                this.srcX = 32;
                this.srcY = 48;
                break;
            case this.types.bottomright:
                this.srcX = 48;
                this.srcY = 48;
                break;
        }
    }

    loadImage() {
        let sW = this.srcWidth;
        let sH = this.srcHeight;
        for (var i = 0; i < this.w; i++) {
            let typeX = 0;
            if (i > 0) typeX+= 1;
            if (i == this.w - 1) typeX+= 1; 
            for (var j = 0; j < this.h; j++) {
                let typeY = 0;
                if (j > 0) typeY += 3;
                if (j == this.h - 1) typeY += 3;
                this.getType(typeX + typeY);
                this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, i * sW, j * sH, sW, sH);
            }
        }
    }
}

class Platform extends AbstractBarrier {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h, 16, 13);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.srcX = 144;
        this.srcY = 32;
        this.updateBB();
        this.loadImage();
    };

    loadImage() {
        let sW = this.srcWidth;
        let sH = this.srcHeight;
        for (var i = 0; i < this.w; i++) 
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, i * sW, 0, sW, sH);
    }
    
};

class MoveableBlocks extends Platform {

    constructor(game, x, y, w, h, directionList = [1], distanceList = [5], velocity = 0.1){
    super(game, x, y, w, h);
    this.directionList = directionList;
    this.distanceList = distanceList;
    this.velocity = velocity;

    this.directions = {left: 0, right: 1, up: 2, down: 3};
    this.direction = this.directionList[0];
    this.targetX = this.x;
    this.targetY = this.y;
    this.index = 0;

    this.reverseLists = false;

    this.setTarget();
    }

    update(){

        const TICK = this.game.clockTick;

        if(!this.reverseLists){
            if(this.directionList[this.index] == this.directions.right) {
                if(this.targetX > this.x) this.x += this.velocity * TICK;
                else {
                    this.index += 1;
                    this.setTarget();
                }
            }
            if(this.directionList[this.index] == this.directions.left) {
                if(this.targetX < this.x) this.x -= this.velocity * TICK;
                    else {
                        this.index += 1;
                        this.setTarget();
                    }
            }
            if(this.directionList[this.index] == this.directions.up) {
                if(this.targetY < this.y) this.y -= this.velocity * TICK;
                else {
                    this.index += 1;
                    this.setTarget();
                }
            }
            if(this.directionList[this.index] == this.directions.down) {
                if(this.targetY > this.y) this.y += this.velocity * TICK;
                else {
                    this.index += 1;
                    this.setTarget();
                }
            }
        }
        else if(this.reverseLists){ // Reverses direction
            if(this.directionList[this.index] == this.directions.left) {
                if(this.targetX > this.x) this.x += this.velocity * TICK;
                else {
                    this.index -= 1;
                    this.setRevTarget();
                }
            }
            if(this.directionList[this.index] == this.directions.right) {
                if(this.targetX < this.x) this.x -= this.velocity * TICK;
                else {
                    this.index -= 1;
                    this.setRevTarget();
                }
            }
            if(this.directionList[this.index] == this.directions.down) {
                if(this.targetY < this.y) this.y -= this.velocity * TICK;
                else {
                    this.index -= 1;
                    this.setRevTarget();
                }
            }
            if(this.directionList[this.index] == this.directions.up) {
                if(this.targetY > this.y) this.y += this.velocity * TICK;
                else {
                    this.index -= 1;
                    this.setRevTarget();
                }
            }
        }

        if(this.index > this.directionList.length -1){
            //console.log("Reversing");
            this.index -= 1;
            this.setRevTarget();
            this.reverseLists = true;
        }
        else if(this.index < 0) {
            //console.log("Starting over");
            this.index += 1;
            this.setTarget();
            this.reverseLists = false;
        }
        this.direction = this.directionList[this.index];
        this.updateBB();

    }

    setTarget() {
        if(this.directionList[this.index] == this.directions.right) this.targetX = this.x + this.distanceList[this.index];
        else if(this.directionList[this.index] == this.directions.left) this.targetX = this.x - this.distanceList[this.index]; 
        else if(this.directionList[this.index] == this.directions.up) this.targetY = this.y - this.distanceList[this.index];
        else if(this.directionList[this.index] == this.directions.down) this.targetY = this.y + this.distanceList[this.index];
    }

    setRevTarget() {
        if(this.directionList[this.index] == this.directions.right) this.targetX =  this.x - this.distanceList[this.index];
        else if(this.directionList[this.index] == this.directions.left) this.targetX = this.x + this.distanceList[this.index]; 
        else if(this.directionList[this.index] == this.directions.up) this.targetY = this.y + this.distanceList[this.index];
        else if(this.directionList[this.index] == this.directions.down) this.targetY = this.y - this.distanceList[this.index];
    }

};

class BackgroundWalls {
    constructor(game, x, y, w, h) {
        Object.assign(this, { game, x, y, w, h});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.srcWidth = 16;
        this.srcHeight = 16;
        this.bricks = [];
        this.canvas = document.createElement("Canvas"); 
	    this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.srcWidth * w;
        this.canvas.height = this.srcHeight * h;
        this.loadImage();
    };

    // generates a random 2d array of brick types
    loadImage() {
        let blocksY = this.h;
        let blocksX = this.w;
        for (let i = 0; i < blocksY; i++) {
            this.bricks.push([]);
            for (let j = 0; j < blocksX; j++) {
                this.bricks[i].push([j]);
                this.type = randomInt(9);
                this.getTileType();
                this.bricks[i][j] = { x : this.srcX, y : this.srcY };
                let w = this.srcWidth;
                let h = this.srcHeight;
                this.ctx.drawImage(this.spritesheet, this.bricks[i][j].x, this.bricks[i][j].y, w, h, j * w, i * h, w, h);
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
        ctx.drawImage(this.canvas, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h * this.scale);
    }
};

class AbstractBackFeature {
    constructor(game, x, y, w, h) {
        Object.assign(this, { game, x, y, w, h });

        this.scale = PARAMS.BLOCKDIM;
    }

    update() {}
    drawDebug() {}
}

class Torch extends AbstractBackFeature {
    constructor(game, x, y, w, h, srcWidth, srcHeight) {
        super(game, x, y, 1, 1);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = 5;
        this.animation = new Animator(this.spritesheet, 19, 112, 17, 17, 3, 0.7, 4, false, true, false); // torch animation
    };

    update() {
        this.animation.update(this.game.clockTick);
    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.scale);
    };
};

class Window extends AbstractBackFeature {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.w = w;
        this.h = h;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 176;
        this.srcY = 70;
        this.srcW = 19;
        this.srcH = 25;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
    };
};

class Banner extends AbstractBackFeature {
    constructor(game, x, y) {
        super(game, x, y, 1, 3);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 207;
        this.srcY = 7;
        this.srcW = 18;
        this.srcH = 23;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
    };
};

class Chain extends AbstractBackFeature {
    constructor(game, x, y) {
        super(game, x, y, 1/2, 2);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 245;
        this.srcY = 7;
        this.srcW = 7;
        this.srcH = 26;
        this.x += this.w / 2;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h *this.scale);
    };
};

class CeilingChain extends AbstractBackFeature {
    constructor(game, x, y, h) {
        super(game, x, y, 1/4, h);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 256;
        this.srcY = 7;
        this.srcW = 3;
        this.srcH = 18;
        this.x += 1.5 * this.w;
    };

    draw(ctx) {
        let blockcount = this.h;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, 
                this.x * this.scale - this.game.camera.x, 
                (this.y + i) * this.scale - this.game.camera.y,
                this.scale * this.w, 1.375 * this.scale);
        }
    };
};

class Column extends AbstractBackFeature {
    constructor(game, x, y, h) {
        super(game, x, y, 1, h);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 320;
        this.srcY = 27;
        this.srcW = 19;
        this.srcH = 28;
        this.baseX = 320;
        this.baseY = 55;
        this.baseW = 16;
        this.baseH = 9;
    };

    draw(ctx) {
        for (var i = 0; i < this.h - 1; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * this.scale - this.game.camera.x, (this.y + i) * this.scale - this.game.camera.y, this.scale, this.scale);
        }
        ctx.drawImage(this.spritesheet, this.baseX, this.baseY, this.baseW, this.baseH, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y + (this.h - 1) * this.scale, this.scale, this.scale);
    };
};

class Support extends AbstractBackFeature {
    constructor(game, x, y, w) {
        super(game, x, y, w, 1);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.srcX = 272;
        this.srcY = 0;
        this.srcW = 32;
        this.srcH = 13;
    };

    draw(ctx) {
        let blockcount = this.w;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, 
                (this.x + i) * this.scale - this.game.camera.x, 
                this.y * this.scale - this.game.camera.y, 
                this.scale, this.scale / 2);
        }
    };
}
