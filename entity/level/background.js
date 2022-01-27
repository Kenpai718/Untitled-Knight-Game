class Background { 
    constructor(game) {
        Object.assign(this, { game});

        //source: https://www.artstation.com/artwork/nY2VbE
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/moonlit_sky.png");
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
    };
};