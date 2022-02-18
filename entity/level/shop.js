class Shop {
    constructor(game) {
        Object.assign(this,{game});
        this.width = 900;
        this.height = 800;

        this.diamond_sprite = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.armor_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/armor.png");
        this.heart_sprite = ASSET_MANAGER.getAsset("./sprites/Hearts.png");

        this.armor = [];
        this.heart = [];
        this.diamond;

        this.x = 1920/2 - this.width / 2;
        this.y = 1080/2 - this.height / 2 - 50;

        this.seconds = 0;
        this.temp = 0;

        // Load Items
        this.loadAnimations();
    };

    update(){

        this.temp += this.game.clockTick;
        if(this.temp > 1){
            this.temp--;
            this.seconds += 1;
        }

    };

    loadAnimations() {

        let numStates = 5;
        for (var i = 0; i < numStates; i++) {
            this.armor.push([]);
        }
        
        this.armor[0] = new Animator(this.armor_sprite, 0, 0, 252, 63, 1, 0, 0, false, false, false);
        this.armor[1] = new Animator(this.armor_sprite, 0, 64, 252, 63, 1, 0, 0, false, false, false);
        this.armor[2] = new Animator(this.armor_sprite, 0, 128, 252, 63, 1, 0, 0, false, false, false);
        this.armor[3] = new Animator(this.armor_sprite, 0, 192, 252, 63, 1, 0, 0, false, false, false);
        
        this.diamond = new Animator(this.diamond_sprite, 19, 84, 10, 8, 6, 0.2, 6, false, true, false);

        this.heart[0] = new Animator(this.heart_sprite, PARAMS.HEART_DIM * 4, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[1] = new Animator(this.heart_sprite, PARAMS.HEART_DIM * 3, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[2] = new Animator(this.heart_sprite, PARAMS.HEART_DIM * 2, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[3] = new Animator(this.heart_sprite, PARAMS.HEART_DIM, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[4] = new Animator(this.heart_sprite, 0, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);

        

    };

    draw(ctx) {

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = 'rgba(50, 0, 107, 1)';
        ctx.strokeRect(this.x, this.y + this.height / 7 * 1, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 2, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 3, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 4, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 5, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 6, this.width, 0);

        ctx.strokeStyle = 'rgba(50, 0, 107, 1)';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x-1, this.y+1, this.width+1, this.height+1);
        ctx.strokeRect(this.x-2, this.y+2, this.width+2, this.height+2);

        let that = this;
        let tempFont = ctx.font;
        let tempFill = ctx.fillStyle;
        ctx.font = ctx.font.replace(/\d+px/, "35px");
        ctx.fillStyle = "white";
        this.game.entities.forEach(function (entity) {
            if(entity instanceof AbstractPlayer){
                ctx.fillText("Gandalf's Shop", that.x + that.width /4, that.y + + that.height / 7 * .5);
                ctx.fillText("🏹 x" + entity.myInventory.arrows, that.x, that.y + that.height / 7 * 1.9);
                ctx.fillText("⚗️ x" + entity.myInventory.potions, that.x, that.y + that.height / 7 * 2.9);
                ctx.fillText("󠀠󠀠󠀠❤️ x1", that.x, that.y + that.height / 7 * 3.9);
            }
        });

        this.diamond.drawFrame(this.game.clockTick, ctx, this.x + that.width /6, this.y + 30, 4);
        this.diamond.drawFrame(this.game.clockTick, ctx, this.x + that.width /6 * 5, this.y + 30, 4);

        this.heart[this.seconds%5].drawFrame(this.game.clockTick, ctx, this.x + 5, that.y + that.height / 7 * 3.62, 2.2);
        this.armor[this.seconds%4].drawFrame(this.game.clockTick, ctx, this.x + 5, this.y + that.height / 7 * 6.5, 1);
        
        

        ctx.fillStyle = tempFill; 
        ctx.font = tempFont; 
    };

    drawDebug(ctx) {
    };
};