class Event {
    constructor(game, space, blocks, entities, activated, finished, finishedSFX) {
        Object.assign(this, {game, space, blocks, entities, activated, finished});
        if(finishedSFX == null || finishedSFX == undefined) {
            this.finishedSFX = true; //enabled sound by default if not defined
        } else {
            //set whether or not to play this sfx when the event finishes
            this.finishedSFX = this.finishedSFX;
        }
        this.scale = PARAMS.BLOCKDIM;
        this.lower = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
        this.upper = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
        let self = this;
        space.forEach(function(s) {
            if (s.x < self.lower.x)
                self.lower.x = s.x;
            if (s.y < self.lower.y)
                self.lower.y = s.y;
            if ((s.x + s.w) * self.scale > self.upper.x)
                self.upper.x = (s.x + s.w) * self.scale;
            if ((s.y + s.h) * self.scale > self.upper.y)
                self.upper.y = (s.y + s.h) * self.scale;
        });
        this.active = false;
    }

    update() {
        let self = this;
        this.game.entities.forEach(function(entity) {
            if (entity instanceof AbstractPlayer) {
                self.space.forEach(function(s) {
                    if (entity.BB.collide(s.BB) && !self.activated) {
                        let top = s.BB.top - entity.BB.top;
                        let bottom = entity.BB.bottom - s.BB.bottom;
                        let left = s.BB.left - entity.BB.left;
                        let right = entity.BB.right - s.BB.right;
                        top = top < 0? 0 : top;
                        bottom = bottom < 0? 0 : bottom;
                        left = left < 0? 0 : left;
                        right = right < 0? 0 : right;
                        let total = (top + bottom) * (left + right);
                        if (total / (entity.BB.width * entity.BB.height) <= 0.01)
                            self.activated = true;
                    }
                })
            }
        });
        if (this.activated && !this.active) {
            if(this instanceof Secret) this.game.myReportCard.mySecretsFound++; //increment secret report card
            else ASSET_MANAGER.playAsset(SFX.TRIGGER);                          //blocked in sound effect
            this.active = true;
            if (this.blocks) {
                this.blocks.forEach(block => self.game.addEntity(block));
            }
            if (this.entities) {
                this.entities.forEach(entity => self.game.addEntity(entity));
            }
        }
        else if (this.activated && this.active) {
            if (this.entities) {
                let count = 0;
                this.entities.forEach(function (entity1) {
                    self.game.enemies.forEach(function (entity2) {
                        if (entity1 == entity2)
                            count++;
                    });
                })
                if (count == 0)
                    this.finished = true;
            }
        }
        if (this.finished) {
            
            if(!(this instanceof Secret) && this.finishedSFX) {
                //sfx for finishing an event fight
                ASSET_MANAGER.playAsset(SFX.COMPLETION);
            }
            if (this.blocks) {
                this.blocks.forEach(function (block) {
                    block.removeFromWorld = true;
                });
            }
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {

    }

    drawDebug(ctx) {
        this.space.forEach(function(s) {
            s.drawDebug(ctx);
        })
    }
}
class Secret extends Event {
    constructor(game, secrets, found, indicate) {
        super(game, secrets, null, null, found, false);
        Object.assign(this, {indicate});
        this.myOpacity = 100;
        this.myBrightness = 100;
        this.up = true;
        this.canvas = document.createElement("Canvas"); 
	    this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.upper.x;
        this.canvas.height = this.upper.y;
        let self = this;
        secrets.forEach(function(secret) {
            let x = secret.x - self.lower.x;
            let y = secret.y - self.lower.y;
            self.ctx.drawImage(secret.canvas, x * self.scale, y * self.scale, secret.w * self.scale, secret.h * self.scale);
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
        if (!this.activated) {        
            ctx.drawImage(this.canvas, this.lower.x * this.scale - this.game.camera.x, this.lower.y * this.scale - this.game.camera.y, this.upper.x, this.upper.y);
        }
        else {
            this.myOpacity -= 100 * this.game.clockTick;
            if (this.myOpacity < 0) this.myOpacity = 0;
            if (this.myOpacity > 0) {
                ctx.filter = "opacity(" + this.myOpacity + "%)";
                ctx.drawImage(this.canvas, this.lower.x * this.scale - this.game.camera.x, this.lower.y * this.scale - this.game.camera.y, this.upper.x, this.upper.y);
            }
            else {
                ASSET_MANAGER.playAsset(SFX.OBELISK_ON);
                this.finished = true;
            }
        }
        ctx.filter = "none";
    }
}