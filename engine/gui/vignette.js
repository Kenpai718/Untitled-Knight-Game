/**
 * Black blurred border effect
 * used as a visual effect at a low hp
 * 
 * Also synced to control the player's beserker mode at low hp
 *
 * Make sure this is made AFTER the player character was created in scene manager
 */
class Vignette {
    constructor(game) {
        Object.assign(this, { game });
        this.img = ASSET_MANAGER.getAsset("./sprites/vignette.png");
        this.width = this.game.surfaceWidth;
        this.height = this.game.surfaceHeight;
        this.x = 0;
        this.y = 0;
        this.elapsedTime = 0;
        this.alpha = 0.5;

        this.myPlayer = this.game.camera.player;
        this.show = false;
        this.myOpacity = 0;
    };

    update() {

        if ((this.myPlayer.hp / this.myPlayer.max_hp) <= PARAMS.LOW_HP) {
            this.show = true;
            if (this.myPlayer.berserkTimer < 10) this.myPlayer.berserk = true;
        } else {
            this.reset();
        }

        //fade in effect
        if(this.show && this.myOpacity < 100) {
            this.myOpacity += 5;
        } else { //fade out effect
            if(!this.show && this.myOpacity > 0) this.myOpacity -= 5;
        }

    };

    reset() {
        this.show = false;
        this.myPlayer.resetBerserkState();
    }

    /**
     * Modify transparency of vignette to it seems like its flickering
     * BUT tbh idk if it actually does anything lol
     *  */
    doAlphaEffect() {
        const TICK = this.game.clockTick;
        if ((this.myPlayer.hp / this.myPlayer.max_hp) <= PARAMS.LOW_HP) {

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
        this.elapsedTime += TICK;
    }

    draw(ctx) {
        //draw border at low hp
        if (this.show || this.myOpacity > 0) {
            ctx.filter = "Opacity(" + this.myOpacity + "%)";
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.filter = "none";
        }
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

};
