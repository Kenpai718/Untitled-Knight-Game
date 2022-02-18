class Inventory {
    constructor(game) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

        const STARTING_ARROWS = 50;
        const STARTING_POTIONS = 5;
        const STARTING_DIAMONDS = 0;
        this.maxStack = 99;

        //inventory
        this.arrows = STARTING_ARROWS;
        this.potions = STARTING_POTIONS;
        this.diamonds = STARTING_DIAMONDS;

        // Other
        this.loadAnimations();
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