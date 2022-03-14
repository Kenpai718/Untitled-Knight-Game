class Inventory {
    constructor(game) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.attack_sheet = ASSET_MANAGER.getAsset("./sprites/GUI/attack.png");
        this.arrow_sheet = ASSET_MANAGER.getAsset("./sprites/projectile/arrows.png");
        this.armor_sheet = ASSET_MANAGER.getAsset("./sprites/GUI/armor.png");

        const STARTING_ARROWS = 50;
        const STARTING_POTIONS = 5;
        const STARTING_DIAMONDS = 0;
        const STARTING_HEALTH_UPGRADE = 0;
        const STARTING_ATTACK_UPGRADE = 0;
        const STARTING_ARROW_UPGRADE = 0;
        const STARTING_ARMOR_UPGRADE = 0;
        this.maxStack = 9999;
        this.maxUpgrade = 4;
        this.maxxed = false;

        // inventory
        this.arrows = STARTING_ARROWS;
        this.potions = STARTING_POTIONS;
        this.diamonds = STARTING_DIAMONDS;
        this.healthUpgrade = STARTING_HEALTH_UPGRADE;
        this.attackUpgrade = STARTING_ATTACK_UPGRADE;
        this.arrowUpgrade = STARTING_ARROW_UPGRADE;
        this.armorUpgrade = STARTING_ARMOR_UPGRADE;

        // animations
        this.diamond = [];
        this.diamond[0] = new Animator(this.spritesheet, 19, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[1] = new Animator(this.spritesheet, 35, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[2] = new Animator(this.spritesheet, 51, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[3] = new Animator(this.spritesheet, 67, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[4] = new Animator(this.spritesheet, 83, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[5] = new Animator(this.spritesheet, 99, 84, 10, 8, 1, 0, 0, false, false, false);

        this.attack = [];
        this.attack[0] = new Animator(this.attack_sheet, 0, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[1] = new Animator(this.attack_sheet, 45, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[2] = new Animator(this.attack_sheet, 90, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[3] = new Animator(this.attack_sheet, 135, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[4] = new Animator(this.attack_sheet, 180, 0, 45, 45, 1, 0, 0, false, false, false);

        this.arrow = [];
        this.arrow[0] = new Animator(this.arrow_sheet, 38, -4, 36, 30, 1, 0, 0, false, false, false);
        this.arrow[2] = new Animator(this.arrow_sheet, 36, 34, 36, 30, 1, 0, 0, false, false, false);
        this.arrow[3] = new Animator(this.arrow_sheet, 38, 73, 36, 30, 1, 0, 0, false, false, false);
        this.arrow[4] = new Animator(this.arrow_sheet, 34, 115, 36, 30, 1, 0, 0, false, false, false);
        this.arrow[1] = new Animator(this.arrow_sheet, 36, 153, 36, 30, 1, 0, 0, false, false, false);

        this.armor = [];
        this.armor[0] = new Animator(this.armor_sheet, 60, 0,    64, 64, 1, 0, 0, false, false, false);
        this.armor[1] = new Animator(this.armor_sheet, 60, 64,   64, 64, 1, 0, 0, false, false, false);
        this.armor[2] = new Animator(this.armor_sheet, 60, 128,  64, 64, 1, 0, 0, false, false, false);
        this.armor[3] = new Animator(this.armor_sheet, 60, 192,  64, 64, 1, 0, 0, false, false, false);

        this.timer = 0;
        this.seconds = 0;
    };

    copyInventory(inventory) {
        this.maxxed = inventory.maxxed;
        this.maxStack = inventory.maxStack;
        this.maxUpgrade = inventory.maxUpgrade;
        this.arrows = inventory.arrows;
        this.potions = inventory.potions;
        this.diamonds = inventory.diamonds;
        this.healthUpgrade = inventory.healthUpgrade;
        this.attackUpgrade = inventory.attackUpgrade;
        this.arrowUpgrade = inventory.arrowUpgrade;
        this.armorUpgrade = inventory.armorUpgrade;
    };

    update() {
        this.timer += this.game.clockTick;
        if(this.timer > 1){
             this.seconds++;
        }

        if(this.arrows > this.maxStack) {
            this.arrows = this.maxStack;
        }

        if(this.potions > this.maxStack) {
            this.potions = this.maxStack;
        }

        if(this.diamonds > this.maxStack) {
            this.diamonds = this.maxStack;
        }

        if(this.healthUpgrade > this.maxUpgrade) {
            this.healthUpgrade = this.maxUpgrade;
        }
        if(this.attackUpgrade > this.maxUpgrade) {
            this.attackUpgrade = this.maxUpgrade;
        }
        if(this.arrowUpgrade > this.maxUpgrade) {
            this.arrowUpgrade = this.maxUpgrade;
        }
        if(this.armorUpgrade > 3) {
            this.armorUpgrade = 3;
        }
    };

    draw(ctx) {
        ctx.font = PARAMS.BIG_FONT;
        ctx.fillStyle = "White";
        ctx.fillText("🏹 x" + this.arrows, 5, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 10);
        ctx.fillText("⚗️ x" + this.potions, 150, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 10);
        ctx.fillText("💎 x" + this.diamonds, 7, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 50 -1);
        this.diamond[Math.floor(this.timer / 0.25) % 6].drawFrame(this.game.clockTick, ctx, 8, 133, 2.5);

        ctx.font = ctx.font.replace(/\d+px/, "14px");
        
        this.attack[Math.floor(this.timer / .35) % 5].drawFrame(this.game.clockTick, ctx, 8, 200, 1);
        ctx.fillText("x(" + (this.attackUpgrade+1) + "/" + (this.maxUpgrade + 1) + ")", 8 + 55, 200 + 35);

        this.arrow[this.arrowUpgrade].drawFrame(this.game.clockTick, ctx, 8, 250, 1.2);
        ctx.fillText("x(" + (this.arrowUpgrade+1) + "/" + (this.maxUpgrade + 1) + ")", 8 + 55, 250 + 30);

        this.armor[this.armorUpgrade].drawFrame(this.game.clockTick, ctx, 8, 300, .6);
        ctx.fillText("x(" + (this.armorUpgrade+1) + "/" + 4 + ")", 8 + 55, 300 + 24);
        

        ctx.font = PARAMS.DEFAULT_FONT;
    };
};
