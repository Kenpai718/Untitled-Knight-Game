class Knight {
    constructor(game) {
        this.game = game;
        this.spritesheetRight = ASSET_MANAGER.getAsset("./knight/knightRight.png");
        this.spritesheetLeft = ASSET_MANAGER.getAsset("./knight/knightLeft.png");
        this.facing = 0;
        this.action = 0;
        this.scale = 2;
        this.x = 0;
        this.y = 0;
        this.width = 120 * this.scale;
        this.height = 80 * this.scale;
        this.animations = [];
        this.loadAnimations();
        this.updateBB();
    };

    loadAnimations() {
        for (var i = 0; i < 2; i++) {
            this.animations.push([]);
            for (var j = 0; j < 17; j++){
                this.animations[i].push([]);
            }
        }
        // idle
        this.animations[0][0] = new Animator(this.spritesheetLeft, 240, 560, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][0] = new Animator(this.spritesheetRight, 0, 560, 120, 80, 10, 0.1, 0, false, true, false);
        // run
        this.animations[0][1] = new Animator(this.spritesheetLeft, 240, 880, 120, 80, 10, 0.1, 0, true, true, false);
        this.animations[1][1] = new Animator(this.spritesheetRight, 0, 880, 120, 80, 10, 0.1, 0, false, true, false);
        // attack
        this.animations[0][2] = new Animator(this.spritesheetLeft, 240, 0, 120, 80, 10, 0.1, 0, true, true, false); // loop should be false in actual implementation
        this.animations[1][2] = new Animator(this.spritesheetRight, 0, 0, 120, 80, 10, 0.1, 0, false, true, false); // loop should be false in actual implementation
        // crouch
        this.animations[0][3] = new Animator(this.spritesheetLeft, 1200, 80, 120, 80, 1, 1, 0, true, true, false);
        this.animations[1][3] = new Animator(this.spritesheetRight, 120, 80, 120, 80, 1, 1, 0, false, true, false);
        // crouch attack
        this.animations[0][4] = new Animator(this.spritesheetLeft, 960, 160, 120, 80, 4, 0.25, 0, true, true, true); // loop should be false in actual implementation
        this.animations[1][4] = new Animator(this.spritesheetRight, 0, 160, 120, 80, 4, 0.25, 0, false, true, true); // loop should be false in actual implementation
        // roll
        this.animations[0][5] = new Animator(this.spritesheetLeft, 0, 800, 120, 80, 12, 0.083, 0, true, true, true); // loop should be false in actual implementation
        this.animations[1][5] = new Animator(this.spritesheetRight, 0, 800, 120, 80, 12, 0.083, 0, false, true, true); // loop should be false in actual implementation

        this.animations[0][6] = new Animator(this.spritesheetLeft);
        this.animations[1][6] = new Animator(this.spritesheetRight);

        this.animations[0][7] = new Animator(this.spritesheetLeft);
        this.animations[1][7] = new Animator(this.spritesheetRight);

        this.animations[0][8] = new Animator(this.spritesheetLeft);
        this.animations[1][8] = new Animator(this.spritesheetRight);

        this.animations[0][9] = new Animator(this.spritesheetLeft);
        this.animations[1][9] = new Animator(this.spritesheetRight);

        this.animations[0][10] = new Animator(this.spritesheetLeft);
        this.animations[1][10] = new Animator(this.spritesheetRight);

        this.animations[0][11] = new Animator(this.spritesheetLeft);
        this.animations[1][11] = new Animator(this.spritesheetRight);

        this.animations[0][12] = new Animator(this.spritesheetLeft);
        this.animations[1][12] = new Animator(this.spritesheetRight);

        this.animations[0][13] = new Animator(this.spritesheetLeft);
        this.animations[1][13] = new Animator(this.spritesheetRight);

        this.animations[0][14] = new Animator(this.spritesheetLeft);
        this.animations[1][14] = new Animator(this.spritesheetRight);

        this.animations[0][15] = new Animator(this.spritesheetLeft);
        this.animations[1][15] = new Animator(this.spritesheetRight);

        this.animations[0][16] = new Animator(this.spritesheetLeft);
        this.animations[1][16] = new Animator(this.spritesheetRight);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

    };

    draw(ctx) {
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, 0 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][0].drawFrame(this.game.clockTick, ctx, 0 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][1].drawFrame(this.game.clockTick, ctx, 120 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][1].drawFrame(this.game.clockTick, ctx, 120 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][2].drawFrame(this.game.clockTick, ctx, 240 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][2].drawFrame(this.game.clockTick, ctx, 240 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][3].drawFrame(this.game.clockTick, ctx, 360 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][3].drawFrame(this.game.clockTick, ctx, 360 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][4].drawFrame(this.game.clockTick, ctx, 480 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][4].drawFrame(this.game.clockTick, ctx, 480 * this.scale, 80 * this.scale, this.scale);

        this.animations[0][5].drawFrame(this.game.clockTick, ctx, 600 * this.scale, 0 * this.scale, this.scale);
        this.animations[1][5].drawFrame(this.game.clockTick, ctx, 600 * this.scale, 80 * this.scale, this.scale);
        //
        // ctx.strokeStyle = 'Red';
        // ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
    };
}
