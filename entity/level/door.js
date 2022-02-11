class Door extends AbstractBackFeature {
    constructor(game, x, y, canEnter, exitLocation) {
        super(game, x, y);
        this.canEnter = canEnter;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.w = 2 * PARAMS.BLOCKDIM;
        this.h = 3 * PARAMS.BLOCKDIM;
        this.srcX = 274;
        this.srcY = 28;
        this.srcW = 28;
        this.srcH = 36;
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);

        if (exitLocation == null) {
            throw "Exit location not defined for door! Needs {x: , y:, levelNum: }"
        }

        this.exitLocation = exitLocation;
    };

    update() {
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof AbstractPlayer && that.canEnter) {
                    if (that.game.up) {
                        //ASSET_MANAGER.playAsset(SFX.DOOR_ENTER);
                        let scene = that.game.camera;
                        let spawnX = that.exitLocation.x;
                        let spawnY = that.exitLocation.y;
                        let nextLevel = that.exitLocation.levelNum;

                        //console.log("entering door to #" + nextLevel + "| x:" + spawnX + ", Y:" + spawnY)


                        scene.loadLevel(nextLevel, true, spawnX, spawnY);
                        that.game.up = false;
                    }
                }
            }
        });
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - this.game.camera.y, this.w, this.h);
    
        //what level it is going to
        ctx.font = PARAMS.DEFAULT_FONT;
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.fillStyle = "GhostWhite";
        ctx.fillStyle = "GhostWhite";
        if(this.exitLocation.levelNum) {
            ctx.fillText("Exit to Level " + this.exitLocation.levelNum, theX, theY - 50);
        } else {
            ctx.fillText("Enter Level 0: DEBUG/TESTING ROOM", theX, theY - 50);
            
        }
    };

    drawDebug(ctx) {
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.strokeStyle = "Red";
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.strokeRect(theX, theY, this.BB.width, this.BB.height);

            
        //what level it is going to
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.fillStyle = "GhostWhite";
        if(this.exitLocation.levelNum != 0) {
            ctx.fillText("Exit to Level " + this.exitLocation.levelNum, theX, theY - 50);
        } else {
            ctx.fillText("Enter Level 0: DEBUG/TESTING ROOM", theX, theY - 50);
            
        }
        (this.canEnter) ? ctx.fillStyle = "GhostWhite" : ctx.fillStyle = "DimGray";
        ctx.fillText("Can enter: " + this.canEnter, theX, theY - 30);



    }
}
