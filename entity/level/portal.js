class Portal extends AbstractInteractable {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/portal.png");
        this.scale = PARAMS.BLOCKDIM;
        this.animation = new Animator(this.spritesheet, 0, 0, 32, 32, 40, 0.1, 0, false, true, false);
        this.states = { idle: 0, notIdle: 1};
        this.state = this.states.notIdle;
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x * this.scale, this.y * this.scale, this.scale * 3, this.scale * 3);
    };

    update() {
        const TICK = this.game.clockTick;
        // if (this.animations[this.states.notIdle].isDone()) {
        //     var that = this;
        //     this.game.entities.forEach(function (entity) {
        //         if (entity.BB && that.BB.collide(entity.BB)) {
        //             if (entity instanceof AbstractPlayer && that.game.up) {
        //                 //load cutscene
        //             }
        //         }
        //     });
        // }
        this.animation.update(TICK);
    };

    draw(ctx) {
        if (this.state == this.states.idle) {
            ctx.drawImage(this.spritesheet, 0, 0, 32, 32, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.scale * 3, this.scale * 3);
        } else {
            //console.log("fjei");
            this.animation.drawFrame(this.game.clockTick, ctx, this.x * this.scale - this.game.camera.x, this.y * this.scale - this.game.camera.y, this.scale / 32 * 3);
        }

    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        let theX = this.BB.x - this.game.camera.x;
        let theY = this.BB.y - this.game.camera.y;
        ctx.strokeRect(theX, theY, this.BB.width, this.BB.height);
    };
};
