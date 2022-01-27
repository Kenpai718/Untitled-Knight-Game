class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop, flipped) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop, flipped});

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                if (!this.flipped) {
                    if (this.reverse)
                        ctx.drawImage(this.spritesheet,
                            this.xStart, this.yStart,
                            this.width, this.height,
                            x, y,
                            this.width * scale,
                            this.height * scale);
                    else
                        ctx.drawImage(this.spritesheet,
                            this.xStart + (this.frameCount - 1) * (this.width + this.framePadding), this.yStart,
                            this.width, this.height,
                            x, y,
                            this.width * scale,
                            this.height * scale);
                } else {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.spritesheet,
                        this.xStart + (this.frameCount - 1) * (this.width + this.framePadding), this.yStart,
                        this.width, this.height,
                        -x - this.width * scale, y,
                        this.width * scale,
                        this.height * scale);
                    ctx.restore();
                }
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;

        if (!this.flipped) {
            ctx.drawImage(this.spritesheet,
                this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
                this.width, this.height,
                x, y,
                this.width * scale,
                this.height * scale);
        } else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.spritesheet,
                this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
                this.width, this.height,
                -x - this.width * scale, y,
                this.width * scale,
                this.height * scale);
            ctx.restore();
        }
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};
