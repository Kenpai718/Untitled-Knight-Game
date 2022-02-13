class Inventory {
    constructor(game) {
        Object.assign(this, {game});
        const STARTING_ARROWS = 50;
        const STARTING_POTIONS = 5;
        const STARTING_DIAMONDS = 0;
        this.maxStack = 99;

        //inventory
        this.arrows = STARTING_ARROWS;
        this.potions = STARTING_POTIONS;
        this.diamonds = STARTING_DIAMONDS;

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
        ctx.fillText("💎 x" + this.diamonds, 5, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 50);
        ctx.font = PARAMS.DEFAULT_FONT;
    };
};