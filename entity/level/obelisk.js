class Obelisk extends AbstractBackFeature {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/Obelisk_full.png");
        this.states = { idle : 0, notIdle : 1 };
        this.state = this.states.notIdle;
        this.width = 190;
        this.height = 380;
        this.loadAnimations();
        this.updateBB();
    };

    update() {

    };

    draw(ctx) {
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
    };

    loadAnimations() {
        this.animations = [];
        this.animations[this.states.idle] = new Animator(this.spritesheet, 0, 380, 190, 380, 14, 0.1, 0, false, true, false);
        this.animations[this.states.notIdle] = new Animator(this.spritesheet, 0, 0, 190, 380, 14, 0.1, 0, false, true, false);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height - 15);
    };
}
