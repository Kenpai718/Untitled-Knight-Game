class Shop {
    constructor(game) {
        Object.assign(this,{game});
        this.width = 900;
        this.height = 800;

        this.diamond_sprite = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.armor_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/armor.png");
        this.attack_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/attack.png");
        this.interactables = ASSET_MANAGER.getAsset("./sprites/GUI/interactables.png");

        this.heart_sprite = ASSET_MANAGER.getAsset("./sprites/Hearts.png");
        this.arrow_sprite = ASSET_MANAGER.getAsset("./sprites/projectile/arrowupgrades.png");

        this.armor = [];
        this.heart = [];
        this.diamond = [];
        this.attack = [];
        this.attackCost = [];
        this.arrows = [];
        this.button = [];
        this.progressbutton = [];

        this.x = 1920/2 - this.width / 2;
        this.y = 1080/2 - this.height / 2 - 50;

        this.seconds = 0;
        this.secondsx2 = 0;
        this.secondsx4 = 0;
        this.temp = 0;
        this.tempx2 = 0;
        this.tempx4 = 0;

        // Load Items
        this.loadAnimations();
    };



    update(){

        this.temp += this.game.clockTick * 1;
        this.tempx2 += this.game.clockTick * 2;
        this.tempx4 += this.game.clockTick * 8;
        if(this.temp > 1){
            this.temp--;
            this.seconds += 1;
        }
        if(this.tempx2 > 1){
            this.tempx2--;
            this.secondsx2 += 1;
        }
        if(this.tempx4 > 1){
            this.tempx4--;
            this.secondsx4 += 1;
        }

    };

    loadAnimations() {
        
        this.armor[0] = new Animator(this.armor_sprite, 0, 0, 252, 63, 1, 0, 0, false, false, false);
        this.armor[1] = new Animator(this.armor_sprite, 0, 64, 252, 63, 1, 0, 0, false, false, false);
        this.armor[2] = new Animator(this.armor_sprite, 0, 128, 252, 63, 1, 0, 0, false, false, false);
        this.armor[3] = new Animator(this.armor_sprite, 0, 192, 252, 63, 1, 0, 0, false, false, false);
        
        this.diamond[0] = new Animator(this.diamond_sprite, 19, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[1] = new Animator(this.diamond_sprite, 35, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[2] = new Animator(this.diamond_sprite, 51, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[3] = new Animator(this.diamond_sprite, 67, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[4] = new Animator(this.diamond_sprite, 83, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[5] = new Animator(this.diamond_sprite, 99, 84, 10, 8, 1, 0, 0, false, false, false);

        this.heart[0] = new Animator(this.heart_sprite, PARAMS.HEART_DIM * 4, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[1] = new Animator(this.heart_sprite, PARAMS.HEART_DIM * 3, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[2] = new Animator(this.heart_sprite, PARAMS.HEART_DIM * 2, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[3] = new Animator(this.heart_sprite, PARAMS.HEART_DIM, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.heart[4] = new Animator(this.heart_sprite, 0, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);

        this.arrows[0] = new Animator(this.arrow_sprite, 0,     46, 43, 34, 1, 0, 0, false, false, false);
        this.arrows[1] = new Animator(this.arrow_sprite, 43,    46, 43, 34, 1, 0, 0, false, false, false);
        this.arrows[2] = new Animator(this.arrow_sprite, 86,    46, 43, 34, 1, 0, 0, false, false, false);
        this.arrows[3] = new Animator(this.arrow_sprite, 130,   46, 43, 34, 1, 0, 0, false, false, false);

        this.attack[0] = new Animator(this.attack_sprite, 36,     0, 36, 44, 1, 0, 0, false, false, false);
        this.attack[1] = new Animator(this.attack_sprite, 72,     0, 36, 44, 1, 0, 0, false, false, false);
        this.attack[2] = new Animator(this.attack_sprite, 108,    0, 36, 44, 1, 0, 0, false, false, false);
        this.attack[3] = new Animator(this.attack_sprite, 144,    0, 36, 44, 1, 0, 0, false, false, false);

        this.button[0] = new Animator(this.interactables, 0, 0,     330, 130, 1, 0, 0, false, false, false);
        this.button[1] = new Animator(this.interactables, 0, 130,   330, 130, 1, 0, 0, false, false, false);
        this.button[2] = new Animator(this.interactables, 0, 260,   330, 130, 1, 0, 0, false, false, false);
        this.button[3] = new Animator(this.interactables, 0, 390,   330, 130, 1, 0, 0, false, false, false);
        this.button[4] = new Animator(this.interactables, 0, 520,   330, 130, 1, 0, 0, false, false, false);
        this.button[5] = new Animator(this.interactables, 0, 650,   330, 130, 1, 0, 0, false, false, false);

        this.progressbutton[0] = new Animator(this.interactables, 533,   73, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[1] = new Animator(this.interactables, 533,   146, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[2] = new Animator(this.interactables, 533,   219, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[3] = new Animator(this.interactables, 533,   292, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[4] = new Animator(this.interactables, 533,   365, 216, 71, 1, 0, 0, false, false, false);

    };

    draw(ctx) {

        let tempFont = ctx.font;
        let tempFill = ctx.fillStyle;

        // Shop Border and lines
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
        //ctx.strokeRect(this.x-2, this.y+2, this.width+2, this.height+2);

        // Item text
        ctx.fillStyle = "white";
        ctx.font = ctx.font.replace(/\d+px/, "35px");
        ctx.fillText("Wizard's Shop", this.x + this.width /4 + 8, this.y + + this.height / 7 * .5);

        ctx.font = ctx.font.replace(/\d+px/, "20px");
        ctx.fillText("Arrow Pack",      this.x + 10, this.y + this.height / 7 * 1.3);
        ctx.fillText("HP Potions",    this.x + 10, this.y + this.height / 7 * 2.3);
        ctx.fillText("Health Upgrade",  this.x + 10, this.y + this.height / 7 * 3.3);
        ctx.fillText("Attack Upgrade",  this.x + 10, this.y + this.height / 7 * 4.3);
        ctx.fillText("Arrow Upgrade",   this.x + 10, this.y + this.height / 7 * 5.3);
        ctx.fillText("Armor Upgrade",   this.x + 10, this.y + this.height / 7 * 6.3);


        // Shop Icons
        ctx.font = ctx.font.replace(/\d+px/, "25px");
        ctx.fillText("🏹 x" + 10,   this.x + 10, this.y + this.height / 7 * 1.7);
        ctx.fillText("⚗️ x" + 1,    this.x + 10, this.y + this.height / 7 * 2.7);
        ctx.fillText("󠀠󠀠󠀠❤️ x1",       this.x + 10, this.y + this.height / 7 * 3.7);


        // Item Animations
        this.heart[this.secondsx2%4 +1].drawFrame(this.game.clockTick,    ctx, this.x + 5 + 8, this.y + this.height / 7 * 3.5, 1.7);
        this.attack[this.secondsx2%4].drawFrame(this.game.clockTick,       ctx, this.x + 5 + 10, this.y + this.height / 7 * 4.3, 1.6);
        this.arrows[this.seconds%4].drawFrame(this.game.clockTick,      ctx, this.x + 5 + 10, this.y + this.height / 7 * 5.4, 1.8);
        this.armor[this.seconds%4].drawFrame(this.game.clockTick,       ctx, this.x + 5, this.y + this.height / 7 * 6.45, 1);

        this.manageButtons(ctx);
        this.manageProgress(ctx);


        // Purchasing
        let that = this;
        this.game.entities.forEach(function (entity) {
            if(entity instanceof AbstractPlayer){

            }
        });
        

        ctx.fillStyle = tempFill; 
        ctx.font = tempFont; 
    };
    manageProgress(ctx){

        this.progressbutton[0].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 4, this.y + this.height / 7 * 3.36, 0.5);
        this.progressbutton[0].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 4, this.y + this.height / 7 * 4.36, 0.5);
        this.progressbutton[0].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 4, this.y + this.height / 7 * 5.36, 0.5);
        this.progressbutton[0].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 4, this.y + this.height / 7 * 6.36, 0.5);
    }

    manageButtons(ctx){

        // Buttons
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 1.23, 0.5);
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 2.23, 0.5);
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 3.23, 0.5);
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 4.23, 0.5);
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 5.23, 0.5);
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 6.23, 0.5);

        // Shop Icons
        ctx.font = ctx.font.replace(/\d+px/, "25px");
        ctx.fillText("󠀠󠀠󠀠  x1",       this.x + this.width /6 * 5 + 4, this.y + this.height / 7 * 1.62);
        ctx.fillText("󠀠󠀠󠀠  x1",       this.x + this.width /6 * 5 + 4, this.y + this.height / 7 * 2.62);
        ctx.fillText("󠀠󠀠󠀠  x1",       this.x + this.width /6 * 5 + 4, this.y + this.height / 7 * 3.62);
        ctx.fillText("󠀠󠀠󠀠  x1",       this.x + this.width /6 * 5 + 4, this.y + this.height / 7 * 4.62);
        ctx.fillText("󠀠󠀠󠀠  x1",       this.x + this.width /6 * 5 + 4, this.y + this.height / 7 * 5.62);
        ctx.fillText("󠀠󠀠󠀠  x1",       this.x + this.width /6 * 5 + 4, this.y + this.height / 7 * 6.62);

        // Diamonds
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 + 5, this.y + this.height / 7 * 1.39, 3.4);
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 + 5, this.y + this.height / 7 * 2.39, 3.4);
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 + 5, this.y + this.height / 7 * 3.39, 3.4);
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 + 5, this.y + this.height / 7 * 4.39, 3.4);
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 + 5, this.y + this.height / 7 * 5.39, 3.4);
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 + 5, this.y + this.height / 7 * 6.39, 3.4);
    };

    drawDebug(ctx) {
    };
};