class Arrow extends AbstractEntity {
    constructor(game, x, y, target, type, team) {
        super(game, x, y, STATS.ARROW.NAME, STATS.ARROW.MAX_HP, STATS.ARROW.WIDTH, STATS.ARROW.HEIGHT, STATS.ARROW.SCALE);
        Object.assign(this, { game, x, y, target, type});
        this.radius = 15;
        this.smooth = false;

        this.arrowWidth = 32;
        this.arrowHeight = 32;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/projectile/arrows.png");

        var dist = distance(this, this.target);
        this.maxSpeed = 1000 + (this.type * 100); //pixels per second, upgraded arrows fly a bit faster
        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        this.cache = [];

        this.animations = [];
        this.loadAnimations();


        this.facing = 5;
        this.scale = 2;

        this.elapsedTime = 0;


        //specific game values
        this.stuck = false; //stuck = true, hit something like ground and cannot move. Can be picked up by player.
        this.hit = false; //false = not hit an enemy, true = hit enemy. This is needed so an arrow doesn't multi hit during collision.
        this.damage = STATS.ARROW.DAMAGE; //how much hp this arrow will take away if it hits something
        this.upgradeDmg = 2; //upgrade multiplier

        this.updateBB();
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

        this.game.foreground2.forEach(function (entity) {
            //if it hits something in environment stick to the ground
            //stick to ground
            if (entity.BB && self.BB.collide(entity.BB)) {
                if (!self.stuck) {
                    self.velocity.x = 0;
                    self.velocity.y = 0;
                    self.stuck = true;
                    ASSET_MANAGER.playAsset(SFX.ARROW_STICK);
                }
            }
        });

        this.game.enemies.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB)) {
                //damage value against an enemy that was hit by an arrow
                if (entity instanceof AbstractEnemy && !self.hit && !self.stuck && !entity.dead) {
                    ASSET_MANAGER.playAsset(SFX.ARROW_HIT);
                    //console.log("hit mushroom with arrow");
                    self.removeFromWorld = true;
                    self.hit = true;
                    entity.takeDamage(self.getDamageValue(), self.critical);
                    if (entity instanceof AbstractEnemy) entity.setDamagedState();
                    if (!entity.aggro) entity.aggro = true;
                }


            }
        });
        let w = this.game.surfaceWidth;
        let h = this.game.surfaceHeight;
        //remove from world if outside the canvas
        if (this.x > 3 / 2 * w + this.game.camera.x || this.x + w / 2 < this.game.camera.x ||
            this.y > h + w / 2 + this.game.camera.y || this.y + w / 2 < this.game.camera.y)
            this.removeFromWorld = true;


    };

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
            var camera_offsetx = this.game.camera.x;
            var camera_offsety = this.game.camera.y;
            if (this.facing < 5) {
                this.animations[this.facing].drawFrame(this.game.clockTick, ctx, (this.x - xOffset) - camera_offsetx, (this.y - yOffset) - camera_offsety, this.scale);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                this.animations[8 - this.facing].drawFrame(this.game.clockTick, ctx, (-(this.x) - (32 * this.scale) + xOffset) + camera_offsetx, (this.y - yOffset) - camera_offsety, this.scale);
                ctx.restore();
            }
        }
    };

    setDamagedState() {
        //do nothing this is just required by AbstractEntity
    }

    getDamageValue() {
        let dmg = this.damage;

        //if upgraded arrow increase the damage
        if(this.type != 0) {
            dmg += (this.upgradeDmg * this.type);
        }
        //critical bonus
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS;
        }
        return dmg;
    }


    loadAnimations() {
        switch (this.type) {
            case 1: //iron arrow
                this.animations.push(new Animator(this.spritesheet, 0, 154, 32, 36, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 154, 37, 36, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 154, 43, 36, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 154, 37, 36, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 166, 154, 32, 36, 1, 0.2, 0, false, true)); //down
                break;
            case 2: //gold arrow
                this.animations.push(new Animator(this.spritesheet, 0, 34, 32, 39, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 34, 36, 37, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 34, 40, 32, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 34, 36, 37, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 166, 34, 32, 37, 1, 0.2, 0, false, true)); //down
                break;
            case 3: //diamond arrow
                this.animations.push(new Animator(this.spritesheet, 0, 72, 32, 39, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 72, 37, 37, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 72, 43, 32, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 72, 37, 37, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 166, 72, 32, 38, 1, 0.2, 0, false, true)); //down
                break;
            case 4: //netherite arrow
                this.animations.push(new Animator(this.spritesheet, 0, 115, 32, 36, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 115, 37, 36, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 115, 43, 36, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 115, 37, 36, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 166, 115, 32, 36, 1, 0.2, 0, false, true)); //down
                break;
            default: //base arrow
                this.type = 0;
                this.animations.push(new Animator(this.spritesheet, 0, 0, 32, 32, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 29, 0, 32, 32, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 76, 0, 36, 32, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 117, 0, 32, 32, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 160, 0, 32, 32, 1, 0.2, 0, false, true)); //down
                break;



        }
    }

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
    };

    drawDebug(ctx) {
        const camera_offsetx = this.game.camera.x;
        const camera_offsety = this.game.camera.y;
        const xOffset = 16 * this.scale;
        const yOffset = 16 * this.scale;
        //circle
        // ctx.strokeStyle = "Red";
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        // ctx.closePath();
        // ctx.stroke();

        //bounding box
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - camera_offsetx, this.BB.y - camera_offsety, this.BB.width, this.BB.height);
        //ctx.strokeStyle = 'Green';
        //ctx.strokeRect(this.x - xOffset, this.y - yOffset, 32, 32);
    }

};
