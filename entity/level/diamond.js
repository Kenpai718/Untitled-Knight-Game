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
        this.BB = new BoundingBox(this.x +1, this.y +1, this.width * this.scale , this.height * this.scale);
    };

    update() {

        // If collides with ground
        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB) && entity instanceof AbstractPlayer && self.amount > 0) {
                self.game.addEntityToFront(new Score(self.game, entity, self.amount, PARAMS.DIAMOND_ID, false));
                entity.myInventory.diamonds += self.amount;
                self.game.myReportCard.myDiamondsEarned += self.amount;
                self.amount -= self.amount;
                self.removeFromWorld = true;
                ASSET_MANAGER.playAsset(SFX.ITEM_PICKUP);
            }
        });
        // If collides with ground, stop
        if(!this.collision){ // If statement prevents constant searching
            this.game.foreground2.forEach(function (entity) {
                if(entity.BB && self.BB.collide(entity.BB) && entity instanceof AbstractBarrier){ // A poor attempt in collision detection
                    self.collision = true;
                }
            });
        }

        // An expert will change physics later :P
        //While there is no collision -> fall (simple slow gravity)
        if(!this.collision){
            this.y += 50 * this.game.clockTick;
            this.updateBB();
        }
        this.animations.update(this.game.clockTick);
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
        if (this.collisions.lao_left && this.velocity.x < 0) this.velocity.x = 0;
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
        ctx.strokeRect(this.x - this.game.camera.x + 1, this.y - this.game.camera.y, this.width * this.scale, this.height * this.scale);
    }


};
