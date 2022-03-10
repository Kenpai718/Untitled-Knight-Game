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
        this.canDestroy = true;
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
            if (entity instanceof AbstractPlayer) {
                let hitPlayer = self.BB.collide(entity.BB) && entity.vulnerable;
                if (hitPlayer) {
                    if (self.state == self.states.move) {
                        self.velocity = 0;
                        self.state = self.states.destroy;
                        self.width *= 2;
                        self.height *= 2;
                    }
                    if (entity.vulnerable) entity.takeDamage(self.getDamageValue(), self.critical);
                }

                if (self.canDestroy) {
                    //allow player to destroy it
                    let playerHit = entity.HB && entity.HB.collide(self.BB);
                    if (playerHit) {
                        //console.log("destroyed projectile");
                        if (self.state == self.states.move) {
                            self.velocity = 0;
                            self.state = self.states.destroy;
                            self.width *= 2;
                            self.height *= 2;
                        }
                    }
                }
            }
        });

        this.game.projectiles.forEach(function (entity) {
            if (entity instanceof Arrow || entity instanceof BladeBeam) {
                if (self.canDestroy) {
                    //allow arrow to destroy it
                    let hit = entity.BB && entity.BB.collide(self.BB);
                    if (hit) {
                        //console.log("destroyed projectile");
                        if (self.state == self.states.move) {
                            self.velocity = 0;
                            self.state = self.states.destroy;
                            self.width *= 2;
                            self.height *= 2;
                        }

                    }
                }
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

class SlimeProjectile extends FlyingEyeProjectile {
    constructor(game, x, y, dir, newScale, newDmg) {
        super(game, x, y, dir, newScale);

        this.scale = this.scale * newScale;
        this.width = this.width * newScale;
        this.height = this.height * newScale;
        this.damage = newDmg;
    }

    draw(ctx) {
        ctx.filter = "saturate(1000%) hue-rotate(-20deg)"; //turn it red
        super.draw(ctx);
        ctx.filter = "none";
    }
}

class WindBall extends FlyingEyeProjectile {
    constructor(game, x, y, dir, newScale, newDmg, canDestroy) {
        super(game, x, y, dir, newScale);

        this.scale = this.scale * newScale;
        this.width = this.width * newScale;
        this.height = this.height * newScale;
        this.damage = newDmg;

        this.canDestroy = canDestroy;

        this.velocity = this.velocity * 1.5;
    }

    draw(ctx) {
        this.canDestroy ? ctx.filter = "saturate(1000%) hue-rotate(100deg)" : ctx.filter = "saturate(1000%) hue-rotate(-100deg)"; //turn it green for destroyable and blue for undestroyable
        super.draw(ctx);
        ctx.filter = "none";
    }
}

class Fireball extends AbstractEntity {
    constructor(game, source, x, y, scale, direction, blue, max) {
        super(game, x, y, "Fireball", 1, 20, 20, scale);
        this.blue = blue;
        this.damage = 5;
        if (max) this.damage = 7.5
        this.source = source;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/wizard.png");
        this.animations = [];
        this.directions =  {right: 0, left: 1};
        this.dir = direction;
        this.loadAnimations();
    }

    loadAnimations() {
        for (var i = 0; i < 2; i++) {
            this.animations.push([]);
        }

        this.animations[0] = new Animator(this.spritesheet, 772, 25, 10, 20, 3, 0.15, 0, false, true, false);
        this.animations[1] = new Animator(this.spritesheet, 708, 45, 10, 20, 3, 0.15, 0, true, true, false);
    }

    getDamageValue() {
        let dmg = this.damage;
        if (this.blue) dmg *= 2;
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

    hit() {
        let self = this;

        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {
                let hitPlayer = self.BB.collide(entity.BB);
                if (hitPlayer) {
                    if(entity.vulnerable) entity.takeDamage(self.getDamageValue(), self.critical);
                }
            }
        });
    }

    draw(ctx) {
        if (this.blue) ctx.filter = "hue-rotate(180deg)";
        this.animations[this.dir].drawFrame(this.game.clockTick, ctx, this.x - this.width / 2 * this.scale - this.game.camera.x, this.y - this.height * 3 / 4 * this.scale - this.game.camera.y, this.scale);
        ctx.filter = "none";
    }

}

class FireballCircular extends Fireball {
    constructor(game, source, x, y, scale, direction, blue, max) {
        super(game, source, x, y, scale, direction, blue, max);
        this.angle = 0;
        if (this.dir == this.directions.right) 
            this.angle = Math.PI;
        let distx = x - source.center.x;
        distx *= distx;
        let disty = y - source.center.y;
        disty *= disty;
        this.r = Math.sqrt(distx + disty);
        this.velocity = {x: 600, r: 3};
        this.initialDir = direction;
        this.width = 10;
        this.height = 10;
        this.updateBB();
        this.stay = false;
        this.release = false;
        this.destroy = 3;
    }

    updateBB() {
        this.BB = new BoundingBox(this.x - this.width / 2 * this.scale, this.y, this.width * this.scale, this.height * this.scale);
    }

    update() {
        let TICK = this.game.clockTick;
        let bool = this.initialDir == this.directions.right;

        // deal with movement stuff
        if (this.r < 50 * this.scale) {
            this.x += (bool? 1 : -1) * this.velocity.x * TICK;
            let distx = this.x - this.source.center.x;
            let distxx = distx * distx;
            let disty = this.y - this.source.center.y;
            let distyy = disty * disty;
            this.r = Math.sqrt(distxx + distyy);
            if (this.r > 50 * this.scale) {
                this.r = 50 * this.scale;
            }
            this.angle = Math.asin(Math.abs(disty) / Math.abs(this.r));
            if (!bool) this.angle = Math.PI - this.angle;
        }
        else {
            if (!this.stay) {
                this.angle += (bool? 1: -1) * this.velocity.r * TICK;
                this.location = {x: this.source.BB.left + this.source.BB.width / 2, y: this.source.BB.top + this.source.BB.height / 2};
            }
            if (this.release) {
                this.r += this.velocity.x * 2 * TICK;
                this.destroy -= TICK;
                if (this.destroy <= 0)
                    this.removeFromWorld;
            }
            this.x = this.r * Math.cos(this.angle) + this.location.x;
            this.y = this.r * Math.sin(this.angle) + this.location.y;
        }
        this.updateBB();
        this.hit();
        this.animations[this.dir].update(TICK);
    }

    drawDebug(ctx) {
        ctx.strokeStyle = "red";
        //ctx.strokeRect(this.BB.left, this.BB.top, this.BB.width, this.BB.height);
        ctx.strokeRect(this.BB.left - this.game.camera.x, this.BB.top - this.game.camera.y, this.BB.width, this.BB.height);
    }
    
}