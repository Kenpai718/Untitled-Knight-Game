class Inventory {
    constructor(game) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

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

        //inventory
        this.arrows = STARTING_ARROWS;
        this.potions = STARTING_POTIONS;
        this.diamonds = STARTING_DIAMONDS;
        this.healthUpgrade = STARTING_HEALTH_UPGRADE;
        this.attackUpgrade = STARTING_ATTACK_UPGRADE;
        this.arrowUpgrade = STARTING_ARROW_UPGRADE;
        this.armorUpgrade = STARTING_ARMOR_UPGRADE;

        // Other
        this.loadAnimations();
    };

    copyInventory(inventory) {
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
        ctx.fillText("⚗️ x" + this.potions, 130, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 10);
        ctx.fillText("💎 x" + this.diamonds, 7, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 50 -1);
        this.animations.drawFrame(this.game.clockTick, ctx, 8, 133, 2.5);
        ctx.font = PARAMS.DEFAULT_FONT;
    };

    loadAnimations() {
        this.animations = new Animator(this.spritesheet, 19, 84, 10, 8, 6, 0.2, 6, 0, 1, 0);
    };
};
