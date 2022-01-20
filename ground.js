class Ground {
    //game = game engine
    //x, y = starting x and y cords on canvas
    //w, h = dimensions to draw image
    constructor(game, x, y, w, h) {
        Object.assign(this, { game, x, y, w, h });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

        //cordinates of the "castle" ground tile on spritesheet
        this.srcX = 16;
        this.srcY = 16;
        this.srcWidth = 48;
        this.srcHeight = 48;

        this.scale = PARAMS.BLOCKWIDTH;

        this.BB = new BoundingBox(this.x, this.y, this.w, this.h);
    };

    update() {
    };

    //draw the ground based on constructor values
    draw(ctx) {
        let blockCount = this.w / this.scale;
        for (let i = 0; i < blockCount; i++) {
           ctx.drawImage(this.spritesheet, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x + (i * this.scale), this.y, this.scale, this.scale);

        }

        if(PARAMS.DEBUG) {  
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};