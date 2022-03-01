class Cursor {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/GUI/crosshair.png");
        this.srcWidth = 82;
        this.srcHeight = 82;
        this.scale = 64;
    }

    update() {

    }

    draw(ctx) {
        //offset dx and dy by half the drawing to get it in the middle of the actual cursor pos
        ctx.drawImage(this.spritesheet, 0, 0, this.srcWidth, this.srcHeight, this.game.mouse.x - (this.scale / 2), this.game.mouse.y - (this.scale / 2), this.scale, this.scale);
    }
}