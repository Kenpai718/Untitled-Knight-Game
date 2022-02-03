class Score {
    constructor(game, entity, score, type, isCritical) {
        Object.assign(this, { game, entity, score, type, isCritical });

        var box = this.entity.BB;
        this.x = box.x;
        this.y = box.y - 40;


        this.velocity = -32;
        this.elapsed = 0;
    };

    update() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 1) this.removeFromWorld = true;

        this.y += this.game.clockTick * this.velocity;
    };

    draw(ctx) {

        var offset = this.score < 10 ? 6 : 12;

        if(this.type == PARAMS.DMG_ID) {
            if (this.score > 0) {
                if (this.isCritical) {
    
                    ctx.font = PARAMS.CRITICAL_FONT;
                    ctx.fillStyle = "Black";
                    ctx.fillText(this.score, (this.x - offset + 1) - this.game.camera.x, this.y + 1);
                    ctx.fillStyle = PARAMS.CRITICAL_COLOR;
                    ctx.fillText(this.score, (this.x - offset) - this.game.camera.x, this.y);
                } else {
                    ctx.font = PARAMS.BIG_FONT;
                    ctx.fillStyle = "Black";
                    ctx.fillText(this.score, (this.x - offset + 1) - this.game.camera.x, this.y + 1);
                    ctx.fillStyle = PARAMS.DMG_COLOR;
                    ctx.fillText(this.score, (this.x - offset) - this.game.camera.x, this.y);
                }
            }
        } else if(this.type == PARAMS.HEAL_ID) {
            ctx.font = PARAMS.BIG_FONT;
            ctx.fillStyle = "Black";
            ctx.fillText(this.score, (this.x + offset + 1) - this.game.camera.x, this.y + 1);
            ctx.fillStyle = PARAMS.HEAL_COLOR;
            ctx.fillText(this.score, (this.x + offset) - this.game.camera.x, this.y);
        }


        ctx.font = PARAMS.DEFAULT_FONT;
    };
};