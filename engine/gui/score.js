/**
 * Damage/healing score
 */
class Score {
    constructor(game, entity, score, type, isCritical) {
        Object.assign(this, { game, entity, score, type, isCritical });
        

        var box = this.entity.BB;
        this.x = box.x;
        this.y = box.y - 40;
        this.myOpacity = 100;


        this.velocity = -32;
        this.elapsed = 0;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.diamond = [];
        this.diamond[0] = new Animator(this.spritesheet, 19, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[1] = new Animator(this.spritesheet, 35, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[2] = new Animator(this.spritesheet, 51, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[3] = new Animator(this.spritesheet, 67, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[4] = new Animator(this.spritesheet, 83, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[5] = new Animator(this.spritesheet, 99, 84, 10, 8, 1, 0, 0, false, false, false);
    };

    update() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 1) this.removeFromWorld = true;

        this.y += this.game.clockTick * this.velocity;
    };

    draw(ctx) {

        //fade out
        if (this.elapsed >= .5) {
            this.myOpacity--;
            ctx.filter = "opacity(" + this.myOpacity + "%)";
        }

        var offset = this.score < 10 ? 6 : 12;

        if (this.type == PARAMS.DMG_ID) {
            if (this.score >= 0) {
                if (this.isCritical) {

                    ctx.font = PARAMS.CRITICAL_FONT;
                    ctx.fillStyle = "Black";
                    ctx.fillText(this.score, (this.x - offset + 1) - this.game.camera.x, this.y - this.game.camera.y + 1);
                    ctx.fillStyle = PARAMS.CRITICAL_COLOR;
                    ctx.fillText(this.score, (this.x - offset) - this.game.camera.x, this.y - this.game.camera.y);
                } else {

                    ctx.font = PARAMS.BIG_FONT;
                    ctx.fillStyle = "Black";
                    ctx.fillText(this.score, (this.x - offset + 1) - this.game.camera.x, this.y - this.game.camera.y + 1);
                    ctx.fillStyle = PARAMS.DMG_COLOR;
                    ctx.fillText(this.score, (this.x - offset) - this.game.camera.x, this.y - this.game.camera.y);
                }
            }
        } else if (this.type == PARAMS.HEAL_ID) {
            ctx.font = PARAMS.BIG_FONT;
            ctx.fillStyle = "Black";
            ctx.fillText(this.score, (this.x + offset + 1) - this.game.camera.x, this.y - this.game.camera.y + 1);
            ctx.fillStyle = PARAMS.HEAL_COLOR;
            ctx.fillText(this.score, (this.x + offset) - this.game.camera.x, this.y - this.game.camera.y);
        } else if (this.type == PARAMS.DIAMOND_ID) {
            ctx.font = PARAMS.CRITICAL_FONT;
            ctx.fillStyle = "Black";
            ctx.fillText("  +" + this.score, (this.x + offset + 1) - this.game.camera.x, this.y - this.game.camera.y + 1);
            ctx.fillStyle = PARAMS.DIAMOND_COLOR;
            ctx.fillText("  +" + this.score, (this.x + offset) - this.game.camera.x, this.y - this.game.camera.y);
            this.diamond[Math.floor(this.elapsed / 0.166) % 6].drawFrame(this.game.clockTick, ctx, (this.x + offset + 8) - this.game.camera.x, this.y - 28 - this.game.camera.y, 4);
        } else if ( this.type == PARAMS.CHECKPOINT_ID) {
            ctx.font = PARAMS.BIG_FONT;
            ctx.fillStyle = "Black";
            //ctx.fillText("💎 +" + this.score, (this.x + offset + 1) - this.game.camera.x, this.y - this.game.camera.y + 1);
            ctx.fillStyle = "GhostWhite";
            ctx.fillText("Checkpoint Saved!", (this.x + offset) - this.game.camera.x, this.y - this.game.camera.y);
        }

        ctx.filter = "none";


        ctx.font = PARAMS.DEFAULT_FONT;
    };

    drawDebug(ctx) {

    }
};

/**
 * Alerts for enemies
 */
class Alert {
    constructor(game, entity) {
        Object.assign(this, { game, entity });

        var box = this.entity.BB;
        this.x = box.x;
        this.y = box.y - 40;
        this.velocity = -32;
        this.elapsed = 0;
        this.myOpacity = 100;
    };

    update() {
        this.elapsed += this.game.clockTick;
        this.x = this.entity.BB.x;
        if (this.elapsed > 1) this.removeFromWorld = true;

        this.y += this.game.clockTick * this.velocity;
    };

    draw(ctx) {

        //fade out
        if (this.elapsed >= .5) {
            this.myOpacity--;
            ctx.filter = "opacity(" + this.myOpacity + "%)";
        }

        var offset = this.score < 10 ? 6 : 12;
        ctx.font = PARAMS.CRITICAL_FONT;
        ctx.fillStyle = "Black";
        ctx.fillText("!", (this.x - offset + 11) - this.game.camera.x, this.y - this.game.camera.y - 5);
        ctx.fillStyle = "Crimson";
        ctx.fillText("!", (this.x - offset + 10) - this.game.camera.x, this.y - this.game.camera.y - 4);
        ctx.font = PARAMS.DEFAULT_FONT;

        ctx.filter = "none";
    };

    drawDebug(ctx) {

    }
}