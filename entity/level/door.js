class Door extends AbstractBackFeature {
    constructor(game, x, y, killQuota, exitLocation) {
        super(game, x, y);
        this.killQuota = killQuota;
        this.canEnter = false;
        this.exitLocation = exitLocation;
        if (!this.exitLocation) throw "Exit location not defined for door! Needs {x: , y:, levelNum: }"
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.w = 2;
        this.h = 3;
        this.srcX = 274;
        this.srcY = 28;
        this.srcW = 28;
        this.srcH = 36;
        this.messageTimer = 0;
        this.BB = new BoundingBox(this.x * this.scale, this.y * this.scale, this.w * this.scale, this.h * this.scale);
    };

    update() {
        const TICK = this.game.clockTick;
        // have a kill quota message flag in both the door and scenemanager so that all doors in a level dont execute this code
        if (this.game.camera.killQuotaMessage && this.killQuotaMessage) {
            this.messageTimer += TICK;
            if (this.messageTimer >= 3) {
                this.game.camera.killQuotaMessage = false;
                this.killQuotaMessage = false;
                this.messageTimer = 0;
            }
        }
        // once player has killed enough mobs, set canEnter to true
        if (this.game.camera.killCount >= this.killQuota) this.canEnter = true;
        
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof AbstractPlayer && that.canEnter) {
                    if (that.game.up) {
                        let scene = that.game.camera;
                        let spawnX = that.exitLocation.x;
                        let spawnY = that.exitLocation.y;
                        let nextLevel = that.exitLocation.levelNum;
                        scene.loadLevel(nextLevel, true, spawnX, spawnY);
                        that.game.up = false;
                    }
                }
                // player tries to enter a door befor meeting the kill quota
                if (entity instanceof AbstractPlayer && !that.canEnter && that.game.up) {
                    that.killQuotaMessage = true;
                    that.game.camera.killQuotaMessage = true;
                    that.game.camera.updateKillQuota(that.killQuota - that.game.camera.killCount);
                }
            }
        });
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h * this.scale);
        //what level it is going to
        ctx.font = PARAMS.DEFAULT_FONT;
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.fillStyle = "GhostWhite";
        if (this.exitLocation.levelNum) {
            ctx.fillText("Exit to Level " + this.exitLocation.levelNum, theX, theY - 50);
        } else {
            ctx.fillText("ENTER DEBUG/TESTING ROOM", theX - 35, theY - 50);
        }
    };

    drawDebug(ctx) {
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.strokeStyle = "Red";
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.strokeRect(theX, theY, this.BB.width, this.BB.height);

        ctx.fillStyle = "GhostWhite";
        if (this.exitLocation.levelNum) {
            ctx.fillText("Exit to Level " + this.exitLocation.levelNum, theX, theY - 50);
        } else {
            ctx.fillText("ENTER DEBUG/TESTING ROOM", theX - 35, theY - 50);

        }
        ctx.font = PARAMS.DEFAULT_FONT;
        (this.canEnter) ? ctx.fillStyle = "GhostWhite" : ctx.fillStyle = "DimGray";
        ctx.fillText("Can enter: " + this.canEnter, theX, theY - 30);
    };
};
