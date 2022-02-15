class Spike extends AbstractBackFeature {
    constructor(game, x, y, w, h) {
        super(game, x, y);
        this.w = w;
        this.h = h;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.srcX = 240;
        this.srcY = 48;
        this.srcW = 15;
        this.srcH = 16;
        this.BB = new BoundingBox(this.x * this.scale, (this.y + 1 / 2) * this.scale, this.w * this.scale, this.scale / 2);
    };

    update() {
        var self = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB) && entity instanceof AbstractEntity) {
                entity.takeDamage(10, false);
            }
        });
        this.game.enemies.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB) && entity instanceof AbstractEntity) {
                entity.takeDamage(10, false);
            }
        });
    };

    draw(ctx) {
        let blockcount = this.w;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, (this.x + i) * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.scale, this.scale);
        }
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM + (PARAMS.BLOCKDIM / 2) - this.game.camera.y, this.w * PARAMS.BLOCKDIM, this.h * PARAMS.BLOCKDIM);
    };

};
