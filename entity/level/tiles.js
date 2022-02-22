class AbstractBarrier {
    constructor(game, x, y, w, h, srcWidth, srcHeight) {
        Object.assign(this, {game, x, y, w, h, srcWidth, srcHeight});
        this.canvas = document.createElement("Canvas"); 
	    this.ctx = this.canvas.getContext("2d");
        this.canvas.width = srcWidth * w;
        this.canvas.height = srcHeight * h;
    }

    loadImage() {
        throw new TypeError("Cannot load image directly from AbstractBarrier instance directly!");
    }

    update() {
    };

    draw(ctx) {
        ctx.drawImage(this.canvas, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h * this.scale);
    }

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        if (this.BB) {
            ctx.strokeRect(this.BB.x-this.game.camera.x, this.BB.y - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
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

class AbstractSecret extends AbstractBarrier {
    constructor(game, x, y, w, h, sW, sH, found, indicate) {
        super(game, x, y, w, h, sW, sH);
        this.found = found;
        this.indicate = indicate;
        this.myOpacity = 100;
        this.myBrightness = 100;
        this.up = true;
    }

    draw(ctx) {
        if (this.indicate) {
            ctx.filter = "brightness(" + this.myBrightness + "%) ";
            if (this.up) this.myBrightness += 10 * this.game.clockTick;
            else this.myBrightness -= 10 * this.game.clockTick;
            if (this.myBrightness >= 130) {
                this.up = false;
                this.myBrightness = 130;
            }
            if (this.myBrightness <= 75) {
                this.up = true;
                this.myBrightness = 75;
            }
        }
        if (!this.found) {        
            super.draw(ctx);
        }
        else {
            if (this.myOpacity > 0) {
                this.myOpacity -= 25 * this.game.clockTick;
                if (this.myOpacity < 0) this.myOpacity = 0;
                if (this.indicate) ctx.filter += "opacity(" + this.myOpacity + "%)";
                else ctx.filter = "opacity(" + this.myOpacity + "%)";
                ctx.drawImage(this.canvas, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h * this.scale);
            }
            else {
                this.remove = true;
            }
        }
        ctx.filter = "none";
    }

}

class Secret {
    constructor(game, secrets, found, indicate) {
        Object.assign(this, {game, secrets, found, indicate});
        this.myOpacity = 100;
        this.myBrightness = 100;
        this.up = true;
        this.scale = PARAMS.BLOCKDIM;
        this.lower = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
        this.upper = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
        let self = this;
        secrets.forEach(function(secret) {
            if (secret.x < self.lower.x)
                self.lower.x = secret.x;
            if (secret.y < self.lower.y)
                self.lower.y = secret.y;
            if ((secret.x + secret.w) * secret.srcWidth > self.upper.x)
                self.upper.x = (secret.x + secret.w) * secret.srcWidth;
            if ((secret.y + secret.h) * secret.srcHeight > self.upper.y)
                self.upper.y = (secret.y + secret.h) * secret.srcHeight;
        })
        this.canvas = document.createElement("Canvas"); 
	    this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.upper.x;
        this.canvas.height = this.upper.y;
        secrets.forEach(function(secret) {
            let x = secret.x - self.lower.x;
            let y = secret.y - self.lower.y;
            self.ctx.drawImage(secret.canvas, x * secret.srcWidth, y * secret.srcHeight, secret.w * secret.srcWidth, secret.h * secret.srcHeight);
        })
    }

    update() {
        let self = this;
        this.game.entities.forEach(function(entity) {
            if (entity instanceof AbstractPlayer) {
                self.secrets.forEach(function(secret) {
                    if (entity.BB.collide(secret.BB) && !self.found) {
                        let top = secret.BB.top - entity.BB.top;
                        let bottom = entity.BB.bottom - secret.BB.bottom;
                        let left = secret.BB.left - entity.BB.left;
                        let right = entity.BB.right - secret.BB.right;
                        top = top < 0? 0 : top;
                        bottom = bottom < 0? 0 : bottom;
                        left = left < 0? 0 : left;
                        right = right < 0? 0 : right;
                        let total = (top + bottom) * (left + right);
                        if (total / (entity.BB.width * entity.BB.height) <= 0.01)
                            self.found = true;
                    }
                })
            }
        });
    }

    draw(ctx) {
        let self = this;
        if (this.indicate) {
            ctx.filter = "brightness(" + this.myBrightness + "%) ";
            if (this.up) this.myBrightness += 25 * this.game.clockTick;
            else this.myBrightness -= 25 * this.game.clockTick;
            if (this.myBrightness >= 125) {
                this.up = false;
                this.myBrightness = 125;
            }
            if (this.myBrightness <= 75) {
                this.up = true;
                this.myBrightness = 75;
            }
        }
        if (!this.found) {        
            ctx.drawImage(this.canvas, this.lower.x * this.scale - this.game.camera.x, this.lower.y * this.scale - this.game.camera.y, this.upper.x / 16 * this.scale, this.upper.y / 16 * this.scale);
        }
        else {
            this.myOpacity -= 50 * this.game.clockTick;
            if (this.myOpacity < 0) this.myOpacity = 0;
            if (this.myOpacity > 0) {
                ctx.filter = "opacity(" + this.myOpacity + "%)";
                ctx.drawImage(this.canvas, this.lower.x * this.scale - this.game.camera.x, this.lower.y * this.scale - this.game.camera.y, this.upper.x / 16 * this.scale, this.upper.y / 16 * this.scale);
            }
            else {
                ASSET_MANAGER.playAsset(SFX.OBELISK_ON);
                this.removeFromWorld = true;
            }
        }
        ctx.filter = "none";
        
        /*
        if (this.found) {
            this.secrets.forEach(function(secret) {
                secret.found = true;
            });
        } 
        this.secrets.forEach(function(secret) {
            secret.draw(ctx);
        });
        for (let i = 0; i < this.secrets.length; i++) {
            if (this.secrets[i].remove) {
                this.secrets.splice(i, 1);
            }
        }
        if (this.secrets.length == 0) {
            ASSET_MANAGER.playAsset(SFX.OBELISK_ON);
            this.removeFromWorld = true;
        }*/
    }

    drawDebug(ctx) {
        this.secrets.forEach(function(secret) {
            secret.drawDebug(ctx);
        })
    }
}

class SecretBricks extends AbstractSecret {
    constructor(game, x, y, w, h, found, indicate) {
        super(game, x, y, w, h, 16, 16, found, indicate);
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

class Ground extends AbstractBarrier {
    constructor(game, x, y, w, h, type) {
        super(game, x, y, w, h, 16, 16);
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
        this.scale = PARAMS.BLOCKDIM;
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

class Walls extends AbstractBarrier {
    constructor(game, x, y, w, h, type) {
        super(game, x, y, w, h, 16, 16);
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
        this.scale = PARAMS.BLOCKDIM;
        this.updateBB();
        this.loadImage();
    };

    loadImage() {
        let sW = this.srcWidth;
        let sH = this.srcHeight;
        for (var i = 0; i < this.h; i++) 
            this.ctx.drawImage(this.spritesheet, this.srcX, this.srcY, sW, sH, 0, i * sH, sW, sH);
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
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
    }

    update() {}
    drawDebug() {}
}

class Torch extends AbstractBackFeature {
    constructor(game, x, y, w, h, srcWidth, srcHeight) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = 5;
        this.animation = new Animator(this.spritesheet, 19, 112, 17, 17, 3, 0.7, 4, false, true, false); // torch animation
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.scale);
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
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
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
        this.w = 1;
        this.h = 3;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
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
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, (this.y - i * 2) - this.game.camera.y, this.w, PARAMS.BLOCKDIM * this.h);
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
        this.w = 1;
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
        ctx.drawImage(this.spritesheet, this.baseX, this.baseY, this.baseW, this.baseH, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y + this.h * PARAMS.BLOCKDIM - PARAMS.BLOCKDIM, this.w * PARAMS.BLOCKDIM, PARAMS.BLOCKDIM);
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
        this.h = 1;
    };

    draw(ctx) {
        let blockcount = this.w / PARAMS.BLOCKDIM;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x + (i * PARAMS.BLOCKDIM) - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKDIM, PARAMS.BLOCKDIM);
        }
    };
}
