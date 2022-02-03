class Inventory {
    constructor(game, player) {
        Object.assign(this, { game, player });

    };

    update() {
       
    };

    draw(ctx) {
        ctx.font = PARAMS.BIG_FONT;
        ctx.fillText("🏹 x" + this.player.numArrows, 5, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 10);
        ctx.fillText("⚗️ x" + this.player.numPotions, 130, (PARAMS.HEART_DIM * PARAMS.GUI_SCALE) * 2 + 10);
        ctx.font = PARAMS.DEFAULT_FONT;
    };
};