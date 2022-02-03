class Door {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.w = 2 * PARAMS.BLOCKDIM;
        this.h = 3 * PARAMS.BLOCKDIM;
        this.srcX = 274;
        this.srcY = 28;
        this.srcW = 28;
        this.srcH = 36;
        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
        console.log(this.BB)
    };

    update() {
        //some kind of collision detection to load next level
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, this.x - this.game.camera.x, this.y - this.game.camera.y, this.w, this.h);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
}
