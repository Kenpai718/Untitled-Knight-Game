/**
 * Black blurred border effect
 * used as a visual effect at a low hp
 */
class Vignette {
    constructor(game, player) {
        Object.assign(this, { game, player });
        this.img = ASSET_MANAGER.getAsset("./sprites/vignette.png");
        this.width = this.game.surfaceWidth;
        this.height = this.game.surfaceHeight;
        this.x = 0;
        this.y = 0;
        this.elapsedTime = 0;

        this.flickerFlag = false;
    };

    update() {
        const TICK = this.game.clockTick;
        if((this.player.hp / this.player.max_hp) <= PARAMS.LOW_HP) {
            this.doAlphaEffect();
        }

        this.elapsedTime += TICK;
    };

    /**
     * Modify transparency of vignette to it seems like its flickering
     * BUT tbh idk if it actually does anything lol
     *  */
    doAlphaEffect() {
        let duration = 5; //switch every 5 seconds
        let offset = .02;
        if (this.elapsedTime < duration) {
            this.alpha += offset;

        } else if (this.elapsedTime > duration && this.elapsedTime < duration * 2) {
            this.alpha -= offset;

        } else {
            //reset timer
            this.elapsedTime = 0;
        }
    }

    draw(ctx) {
        //draw border at low hp
        if ((this.player.hp / this.player.max_hp) <= PARAMS.LOW_HP) {
            ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            //ctx.restore();
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

    };

};

