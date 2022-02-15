class Diamond extends AbstractInteractable {
    constructor(game, x, y, amount) {
        super(game, x, y);
        this.amount = amount;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

        this.scale = 5;
        this.width = 10;
        this.height = 8;

        this.animations;

        this.collision = false;

        // Other
        this.loadAnimations();
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width * this.scale, this.height * this.scale)
    };

    viewBoundingBox(ctx) {
        // This is the Bounding Box, defines space where chest is and can be opened
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, this.width, this.height);
    };

    update() {

        // If collides with ground
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB) && entity instanceof AbstractPlayer && that.amount > 0) {
                entity.myInventory.diamonds += that.amount;
                that.amount -= that.amount;
                that.removeFromWorld = true;
                ASSET_MANAGER.playAsset(SFX.ITEM_PICKUP);
            }
        });
        // If collides with ground, stop
        if(!this.collision){ // If statement prevents constant searching
            this.game.foreground2.forEach(function (entity) {
                if(entity.BB && that.BB.collide(entity.BB) && entity instanceof AbstractBarrier){ // A poor attempt in collision detection
                    that.collision = true;
                }
            });
        }

        // An expert will change physics later :P
        //While there is no collision -> fall (simple slow gravity)
        if(!this.collision){
            this.y += 0.2;
            this.updateBB();
        }

    };


    updatePositionAndVelocity(dist) {
        // update positions based on environment collisions
        this.x += dist.x;
        this.y += dist.y;
        this.updateBoxes();
        // set respective velocities to 0 for environment collisions
        if (this.touchFloor() && this.velocity.y > 0) {
            this.jumped = false;
            this.velocity.y = 0;
        }
        if(this.collisions.top) this.velocity.y = 0; //bonk on ceiling halt momentum
        if (this.collisions.lo_left && this.velocity.x < 0) this.velocity.x = 0;
        if (this.collisions.lo_right && this.velocity.x > 0) this.velocity.x = 0;


    }


    loadAnimations() {
        this.animations = new Animator(this.spritesheet, 19, 84, 10, 8, 6, 0.2, 6, 0, 1, 0);
    };

    draw(ctx) {
        this.animations.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, this.width * this.scale, this.height * this.scale);
    }


};
