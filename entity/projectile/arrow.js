class Arrow {
    constructor(game, x, y, target, team) {
        Object.assign(this, { game, x, y, target });
        this.radius = 15;
        this.smooth = false;

        this.arrowWidth = 32;
        this.arrowHeight = 32;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/projectile/arrow.png");

        var dist = distance(this, this.target);
        this.maxSpeed = 1000; // pixels per second

        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        this.cache = [];

        this.animations = [];
        this.animations.push(new Animator(this.spritesheet, 0, 0, 32, 32, 1, 0.2, 0, false, true)); //up
        this.animations.push(new Animator(this.spritesheet, 40, 0, 32, 32, 1, 0.2, 0, false, true)); //up right
        this.animations.push(new Animator(this.spritesheet, 80, 0, 32, 32, 1, 0.2, 0, false, true)); //right
        this.animations.push(new Animator(this.spritesheet, 120, 0, 32, 32, 1, 0.2, 0, false, true)); //down right
        this.animations.push(new Animator(this.spritesheet, 160, 0, 32, 32, 1, 0.2, 0, false, true)); //down

        this.facing = 5;
        this.scale = 2;

        this.elapsedTime = 0;


        //specific game values
        this.stuck = false; //stuck = true, hit something like ground and cannot move. Can be picked up by player.
        this.hit = false; //false = not hit an enemy, true = hit enemy. This is needed so an arrow doesn't multi hit during collision.
        this.damage = 10; //how much hp this arrow will take away if it hits something
        this.critical = false;

        this.updateBB();
    };

    drawAngle(ctx, angle) {
        if (angle < 0 || angle > 359) return;


        if (!this.cache[angle]) {
            let radians = angle / 360 * 2 * Math.PI;
            let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = 32;
            offscreenCanvas.height = 32;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(16, 16);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-16, -16);
            offscreenCtx.drawImage(this.spritesheet, 80, 0, 32, 32, 0, 0, 32, 32);
            offscreenCtx.restore();
            this.cache[angle] = offscreenCanvas;
        }
        var xOffset = 16;
        var yOffset = 16;

        ctx.drawImage(this.cache[angle], this.x - xOffset, this.y - yOffset);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(this.x - xOffset, this.y - yOffset, 32, 32);
        }
    };

    update() {

        //set speed and movement of the arrow (currently set to constant speed)
        this.x += (this.velocity.x * this.game.clockTick);
        this.y += (this.velocity.y * this.game.clockTick);

        //get direction of the arrow
        if (!this.stuck) this.facing = getFacing(this.velocity);

        //bound box
        this.updateBB();

        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB)) {

                //if it hits something in environment stick to the ground
                if ((entity instanceof Ground || entity instanceof Walls || entity instanceof Brick || entity instanceof Platform)) {
                    //stick to ground
                    self.velocity.x = 0;
                    self.velocity.y = 0;
                    self.stuck = true;
                }

                //damage value against an enemy that was hit by an arrow
                if (entity instanceof AbstractEnemy && self.hit == false && self.stuck == false) {
                    ASSET_MANAGER.playAsset(SFX.ARROW_HIT);
                    //console.log("hit mushroom with arrow");
                    self.removeFromWorld = true;
                    self.hit = true;
                    entity.takeDamage(self.getDamageValue(), self.critical);
                }


            }
        });

        //remove from world if outside the canvas
        if (this.x > this.game.surfaceWidth + this.game.camera.x || this.x < 0 || this.y > this.game.surfaceHeight || this.y < 0) this.removeFromWorld = true;


    };

    getDamageValue() {
        //critical bonus
        let dmg = this.damage;
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS;
        }
        return dmg;
    }

    isCriticalHit() {
        let isCritical = false;
        let percentage = (Math.random() * 100);

        isCritical = percentage <= PARAMS.CRITICAL_CHANCE;
        this.critical = isCritical;
        return isCritical;
    }

    updateBB() {
        //offset needed so the arrow doesnt move with the camera when it is
        this.BB = new BoundingBox(this.x - this.radius, this.y - this.radius, this.arrowHeight, this.arrowWidth);

    };

    draw(ctx) {
        var xOffset = 16 * this.scale;
        var yOffset = 16 * this.scale;
        if (this.smooth) {
            let angle = Math.atan2(this.velocity.y, this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);

            this.drawAngle(ctx, degrees);
        } else { //this is where the arrow gets drawn
            var camera_offset = this.game.camera.x;

            if (this.facing < 5) {
                this.animations[this.facing].drawFrame(this.game.clockTick, ctx, (this.x - xOffset) - camera_offset, this.y - yOffset, this.scale);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                this.animations[8 - this.facing].drawFrame(this.game.clockTick, ctx, (-(this.x) - (32 * this.scale) + xOffset) + camera_offset, this.y - yOffset, this.scale);
                ctx.restore();
            }
        }

        if (PARAMS.DEBUG) {

            //circle
            // ctx.strokeStyle = "Red";
            // ctx.beginPath();
            // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            // ctx.closePath();
            // ctx.stroke();

            //bounding box
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x - camera_offset, this.BB.y, this.BB.width, this.BB.height);
        }
    };


};