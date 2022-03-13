class Door extends AbstractInteractable {
    constructor(game, x, y, killQuota, exitLocation, transition) {
        super(game, x, y);
        this.killQuota = killQuota;
        this.canEnter = false;
        this.exitLocation = exitLocation;
        this.transition = transition;
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

        this.nextLevelLabel = this.game.camera.levels[this.exitLocation.levelNum].label;
    };

    update() {
        const TICK = this.game.clockTick;
        // have a kill quota message flag in both the door and scenemanager so that all doors in a level dont execute this code
        if (this.killQuotaMessage) {
            this.messageTimer += TICK;
            //display message for 4 seconds
            if (this.messageTimer >= 4) {
                this.messageTimer = 0;
                this.setKillMessage(false);
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
                        if (!that.transition) {
                            ASSET_MANAGER.playAsset(SFX.DOOR_ENTER);
                            scene.loadLevel(nextLevel, true, spawnX, spawnY);
                        } else {
                            ASSET_MANAGER.playAsset(SFX.COMPLETE);
                            scene.loadTransition();
                        }
                        that.game.up = false;
                    }
                }
                // player tries to enter a door befor meeting the kill quota
                if (entity instanceof AbstractPlayer && !that.canEnter && that.game.up) {
                    that.setKillMessage(true);
                }
            }
        });
    };

    setKillMessage(isOn) {
        if (isOn) {
            let scene = this.game.camera;
            this.killQuotaMessage = true;
            scene.updateKillQuota(this.killQuota - scene.killCount);
            let message = "Must defeat " + scene.remainingKills + " more enemies to advance";
            scene.myTextBox.setMessage(message, true);
            scene.myTextBox.centerTop();
        } else {
            let scene = this.game.camera;
            this.killQuotaMessage = false;
            scene.myTextBox.show = false;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.w * this.scale, this.h * this.scale);
        //what level it is going to
        ctx.font = PARAMS.DEFAULT_FONT;
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.fillStyle = "GhostWhite";

        if (this.transition) {
            ctx.fillText("FINISH LEVEL", theX + 15, theY - 50);
        } else if (this.exitLocation.levelNum == this.game.camera.levels.length - 1) {
            ctx.fillText("THE FINAL FLOOR", theX - 5, theY - 50);
        } else if (this.exitLocation.levelNum) {
            let offset = 40;
            if(this.nextLevelLabel.length > 8) offset = 5;
            ctx.fillText(this.nextLevelLabel, theX + offset, theY - 50);
        } else if (this.exitLocation.levelNum == 0) {
            ctx.fillText("DEBUG/TESTING ROOM", theX - 10, theY - 50);
        }
    };

    drawDebug(ctx) {
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.strokeStyle = "Red";
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.strokeRect(theX, theY, this.BB.width, this.BB.height);

        ctx.fillStyle = "GhostWhite";
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.fillText("Spawn= (x:" + this.exitLocation.x + " ,y:" + this.exitLocation.y + ")", theX, theY - 30);
        ctx.fillText("Can enter Lv" + this.exitLocation.levelNum + "= " + this.canEnter, theX, theY - 15);
    };
};
