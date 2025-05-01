//source #1: https://arludus.itch.io/2d-pixel-art-medieval-backgrounds-pack
//source #2: https://www.deviantart.com/mokazar/art/Purple-Sky-and-cloud-PixelArt-681115409

class Background {
    constructor(game, type) {
        Object.assign(this, { game });
        this.backgrounds = [ASSET_MANAGER.getAsset("./sprites/environment/moonlit_sky.png"), ASSET_MANAGER.getAsset("./sprites/environment/moonlit_sky_2.png")];

        if(type > this.backgrounds.length - 1 || type < 0 || type == undefined || type == null) {
            this.spritesheet = this.backgrounds[0]; //default background if not defined properly
        } else { //assign the background spritesheet
            this.type = type;
            this.spritesheet = this.backgrounds[type];
        }
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
    };
};