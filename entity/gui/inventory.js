class Inventory {
    constructor(game, player) {
        Object.assign(this, { game, player });

    };

    update() {
       
    };

    draw(ctx) {
        ctx.font = PARAMS.BIG_FONT;
        ctx.fillText("🏹 x" + this.player.numArrows, 0, 50);
        ctx.fillText("⚗️ x" + this.player.numPotions, 0, 100);
        ctx.font = PARAMS.DEFAULT_FONT;
    };
};