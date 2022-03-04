class FlyingEyeProjectile extends AbstractEntity {
    constructor(game, x, y, dir, scale) {
        super(game, x, y, STATS.EYE_PROJECTILE.NAME, STATS.EYE_PROJECTILE.MAX_HP, STATS.EYE_PROJECTILE.WIDTH, STATS.EYE_PROJECTILE.HEIGHT, STATS.EYE_PROJECTILE.SCALE);
        this.dir = dir;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/flyingeye.png");
        this.animations = [];
        this.loadAnimations();

        this.states = { move: 0, destroy: 1 };
        this.directions = { right: 0, left: 1 };
        this.velocity = 400;
        if (dir == this.directions.left)
            this.velocity = -400;
        this.state = this.states.move;
        this.elapsedTime = 0;
        this.damage = STATS.EYE_PROJECTILE.DAMAGE
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + 16 * this.scale - (this.width - 16 * this.scale) / 2, this.y + 16 * this.scale - (this.height - 16 * this.scale) / 2, this.width, this.height);
    }

    loadAnimations() {
        for (let i = 0; i < 2; i++) {
            this.animations.push([]);
            for (let j = 0; j < 2; j++) {
                this.animations.push([]);
            }
        }

        this.animations[0][0] = new Animator(this.spritesheet, 384, 1800, 48, 48, 3, 0.15, 0, false, true, false);
        this.animations[0][1] = new Animator(this.spritesheet, 240, 1800, 48, 48, 3, 0.15, 0, true, true, false);

        this.animations[1][0] = new Animator(this.spritesheet, 528, 1800, 48, 48, 4, 0.1, 0, false, false, false);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 1800, 48, 48, 4, 0.1, 0, true, false, false);

    }

    getDamageValue() {
        let dmg = this.damage;
        //critical bonus
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS;
        }
        return dmg;
    }

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    };

    update() {
        if (this.state == this.states.destroy)
            this.velocity = 0;
        let TICK = this.game.clockTick;
        this.x += this.velocity * TICK;
        this.updateBB();
        this.hit();
        this.animations[this.state][this.dir].update(TICK);
    }

    hit() {
        let self = this;
        if (this.state == this.states.move) {
            this.game.foreground2.forEach(function (entity) {
                //if it hits something in environment stick to the ground
                //stick to ground
                if (entity.BB && self.BB.collide(entity.BB)) {
                    self.velocity = 0;
                    self.state = self.states.destroy;
                    self.width *= 2;
                    self.height *= 2;
                }
            });
        }

        this.game.entities.forEach(function (entity) {
            //if it hits something in environment stick to the ground
            //stick to ground
            if (entity instanceof AbstractPlayer && self.BB.collide(entity.BB) && entity.vulnerable) {
                if (self.state == self.states.move) {
                    self.velocity = 0;
                    self.state = self.states.destroy;
                    self.width *= 2;
                    self.height *= 2;
                }
                entity.takeDamage(self.getDamageValue(), self.critical);
            }
            if (entity.BB && self.BB.collide(entity.BB)) {
            }
        });
    }

    draw(ctx) {
        this.elapsedTime += this.game.clockTick;
        this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        if (this.state == this.states.move && this.elapsedTime >= 2) {
            this.state = this.states.destroy;
            this.width *= 2;
            this.height *= 2;
            this.updateBB();
        }
        else {
            if (this.animations[this.state][this.dir].isDone())
                this.removeFromWorld = true;
        }
    }

    drawDebug(ctx) {
        const camera = this.game.camera;

        //bounding box
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - camera.x, this.BB.y - camera.y, this.BB.width, this.BB.height);
    }
}

class DemonSlimeProjectile extends FlyingEyeProjectile {
    constructor(game, x, y, dir, scale) {
        super(game, x, y, dir, scale);

        this.scale = this.scale * 2;
        this.damage = 5;
    }

    draw(ctx) {
        ctx.filter = "saturate(1000%) hue-rotate(-20deg)"; //turn it red
        super.draw(ctx);
        ctx.filter = "none";
    }
}