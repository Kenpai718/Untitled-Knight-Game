class Cursor {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/GUI/crosshair.png");
        this.srcWidth = 82;
        this.srcHeight = 82;
        this.scale = 64;
        this.types = { default: 0, can_hit: 1, cannot_hit: 2 };
        this.myType = 0;

    }

    update() {
        this.BB = new BoundingBox(this.game.mouse.x - (this.scale / 2) + this.game.camera.x, this.game.mouse.y - (this.scale / 2) + this.game.camera.y, this.scale, this.scale);

        let self = this;
        let collided = false;
        this.game.enemies.forEach(function (entity) {
            //interactions with enemy
            if (entity instanceof AbstractEnemy) {
                if (entity.BB && self.BB.collide(entity.BB)) {
                    collided = true;
                    if (entity.canTakeDamage()) {
                        self.myType = self.types.can_hit;
                    } else {
                        self.myType = self.types.cannot_hit;
                    }
                }
            }
        });

        if (!collided) this.myType = this.types.default;


    }

    draw(ctx) {
        //offset dx and dy by half the drawing to get it in the middle of the actual cursor pos
        switch (this.myType) {
            case 0:
                ctx.drawImage(this.spritesheet, 0, 0, this.srcWidth, this.srcHeight, this.game.mouse.x - (this.scale / 2), this.game.mouse.y - (this.scale / 2), this.scale, this.scale);
                break;
            case 1:
                ctx.drawImage(this.spritesheet, this.srcWidth, 0, this.srcWidth, this.srcHeight, this.game.mouse.x - (this.scale / 2), this.game.mouse.y - (this.scale / 2), this.scale, this.scale);
                break;
            case 2:
                ctx.drawImage(this.spritesheet, this.srcWidth * 2, 0, this.srcWidth, this.srcHeight, this.game.mouse.x - (this.scale / 2), this.game.mouse.y - (this.scale / 2), this.scale, this.scale);
                break;
        }

        if (PARAMS.DEBUG) {
            ctx.fillStyle = "Red";
            ctx.StrokeStyle = "Red";
            ctx.fillText(this.myType, this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y);
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.scale, this.scale);
        }
    }
}