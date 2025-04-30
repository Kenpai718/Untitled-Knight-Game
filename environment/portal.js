class Portal extends AbstractInteractable {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/portal.png");
        this.scale = PARAMS.BLOCKDIM;
        this.animation = new Animator(this.spritesheet, 0, 0, 32, 32, 40, 0.1, 0, false, false, false);
        this.states = { idle: 0, notIdle: 1};
        this.state = this.states.idle;
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x * this.scale, this.y * this.scale, this.scale * 3, this.scale * 3);
        this.VB = new BoundingBox((this.x * this.scale) - (5 * this.scale), this.y * this.scale, this.scale * 8, this.scale * 3);
    };

    update() {
        const TICK = this.game.clockTick;
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && entity instanceof AbstractPlayer) {
                if (that.VB.collide(entity.BB)) {
                    that.state = that.states.notIdle;
                }
                if (that.BB.collide(entity.BB) && that.animation.isDone() && that.game.up) {
                    that.game.camera.loadEndSequence();
                }
            }
        });
        if (this.state == this.states.notIdle) this.animation.update(TICK);
    };

    draw(ctx) {
        if (this.state == this.states.idle) ctx.drawImage(this.spritesheet, 0, 0, 32, 32, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.scale * 3, this.scale * 3);
        else this.animation.drawFrame(this.game.clockTick, ctx, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.scale / 32 * 3);
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        ctx.strokeStyle = "Blue";
        ctx.strokeRect(this.VB.x - this.game.camera.x, this.VB.y - this.game.camera.y, this.VB.width, this.VB.height);
    };
};
