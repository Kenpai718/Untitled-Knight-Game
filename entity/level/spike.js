class Spike extends AbstractBarrier{
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.scale = PARAMS.BLOCKDIM;
        this.srcX = 240;
        this.srcY = 48;
        this.srcW = 15;
        this.srcH = 16;
        this.BB = new BoundingBox(this.x * this.scale, (this.y + 1 / 2) * this.scale, this.w * this.scale, this.scale / 2);
    };

    update() {

    };

    draw(ctx) {
        let blockcount = this.w;
        for (var i = 0; i < blockcount; i++) {
            ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcW, this.srcH, (this.x + i) * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.scale, this.scale);
        }
    };

}
