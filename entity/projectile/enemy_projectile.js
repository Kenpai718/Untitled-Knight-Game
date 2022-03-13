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
        this.explodeTime = 2;
        this.damage = STATS.EYE_PROJECTILE.DAMAGE
        this.canDestroy = true;
        this.canDamage = true; //if player hits projectile it explodes. Set this to false so they dont take damage from it.
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

        //timer for when projectile expires and EXPLOSIIIIION
        this.elapsedTime += this.game.clockTick;
        if (this.state == this.states.move && this.elapsedTime >= this.explodeTime) {
            this.state = this.states.destroy;
            this.width *= 2;
            this.height *= 2;
            this.updateBB();
        }
        else if(this.state == this.states.destroy) {
            if (this.animations[this.state][this.dir].isDone())
                this.removeFromWorld = true;
        }
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
                    if (entity.vulnerable && self.canDamage) entity.takeDamage(self.getDamageValue(), self.critical);
                }

                if (self.canDestroy) {
                    //allow player to destroy it
                    let playerHit = entity.HB && entity.HB.collide(self.BB);
                    if (playerHit) {
                        //console.log("destroyed projectile");
                        if (self.state == self.states.move) {
                            self.velocity = 0;
                            self.state = self.states.destroy;
                            self.canDamage = false;
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
                            self.canDamage = false;
                            self.width *= 2;
                            self.height *= 2;
                        }

                    }
                }
            }
        });
    }

    draw(ctx) {
        this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
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
    constructor(game, x, y, dir, newScale, source, newDmg, canDestroy, speedMultiplier) {
        super(game, x, y, dir, newScale);
        this.source = source;
        this.scale = this.scale * newScale;
        this.width = this.width * newScale;
        this.height = this.height * newScale;
        this.damage = newDmg;
        if(!speedMultiplier) this.speedMultiplier = 1;
        else this.speedMultiplier = speedMultiplier;
        this.velocity = 550;
        if (dir == this.directions.left)
            this.velocity = -550;

        this.canDestroy = canDestroy;
        this.velocity = this.velocity * this.speedMultiplier;
    }

    getDamageValue() {
        let damage = super.getDamageValue();
        this.source.recoverDamage(damage);
        return damage;
    }

    draw(ctx) {
        this.canDestroy ? ctx.filter = "saturate(1000%) hue-rotate(100deg)" : ctx.filter = "saturate(1000%) hue-rotate(-100deg)"; //turn it green for destroyable and blue for undestroyable
        super.draw(ctx);
        ctx.filter = "none";
    }
}

class Fireball extends AbstractEntity {
    constructor(game, source, x, y, scale, direction, blue, dmg) {
        super(game, x, y, "Fireball", 1, 10, 10, scale);
        this.blue = blue;
        if (dmg)
            this.damage = dmg;
        else
            this.damage = 5;
        this.source = source;
        this.width = 10;
        this.height = 10;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/wizard.png");
        this.animations = [];
        this.directions =  {right: 0, left: 1};
        this.dir = direction;
        this.states = {ignite1: 0, ignite2: 1, still1: 2, still2: 3, move: 4};
        this.state = this.states.move;
        this.loadAnimations();
        this.stay = true;
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x - this.width / 2 * this.scale, this.y - this.height / 2 * this.scale, this.width * this.scale, this.height * this.scale);
    }

    loadAnimations() {
        for (var i = 0; i < 5; i++) {
            this.animations.push([]);
            for (var j = 0; j < 2; j++) {
                this.animations[i].push([]);
            }
        }

        //ignite1
        this.animations[0][0] = new Animator(this.spritesheet, 640, 20, 10, 20, 3, 0.075, 0, false, false, false);
        this.animations[0][1] = new Animator(this.spritesheet, 760, 40, 10, 20, 3, 0.075, 0, true, false, false);

        // ignite2
        this.animations[1][0] = new Animator(this.spritesheet, 710, 20, 10, 20, 3, 0.075, 0, false, false, false);
        this.animations[1][1] = new Animator(this.spritesheet, 680, 40, 10, 20, 3, 0.075, 0, true, false, false);

        // still1
        this.animations[2][0] = new Animator(this.spritesheet, 670, 20, 10, 20, 4, 0.15, 0, false, true, false);
        this.animations[2][1] = new Animator(this.spritesheet, 740, 40, 10, 20, 4, 0.15, 0, true, true, false);

        // still2
        this.animations[3][0] = new Animator(this.spritesheet, 750, 20, 10, 20, 3, 0.15, 0, false, true, false);
        this.animations[3][1] = new Animator(this.spritesheet, 660, 40, 10, 20, 3, 0.15, 0, true, true, false);
        
        // move
        this.animations[4][0] = new Animator(this.spritesheet, 760, 20, 10, 20, 4, 0.15, 0, false, true, false);
        this.animations[4][1] = new Animator(this.spritesheet, 640, 40, 10, 20, 4, 0.15, 0, true, true, false);
    }

    getDamageValue() {
        let dmg = this.damage;
        if (this.blue) dmg *= 2;
        //critical bonus
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS;
        }
        this.source.recoverDamage(dmg);
        return dmg;
    }

    setDamagedState() {
        this.vulnerable = false;
        this.state = this.states.damaged;
    };

    update() {
        let TICK = this.game.clockTick;
        this.updateBB();
        this.hit();
        this.animations[this.state][this.dir].update(TICK);
        if (this.animations[this.state][this.dir].isDone()) {
            if (this.state == this.states.ignite1)
                this.state = this.states.ignite2;
            else if (this.state == this.states.ignite2) {
                if (this.stay)
                    this.state = this.states.still2;
                else this.state = this.states.move;
            }
        } 
    }

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
        this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x - this.width / 2 * this.scale - this.game.camera.x, this.y - this.height * 6 / 4 * this.scale - this.game.camera.y, this.scale);
        ctx.filter = "none";
    }

    drawDebug(ctx) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.BB.left - this.game.camera.x, this.BB.top - this.game.camera.y, this.BB.width, this.BB.height);
    }

}

class FireballCircular extends Fireball {
    constructor(game, source, x, y, scale, direction, blue, dmg) {
        super(game, source, x, y, scale, direction, blue, dmg);
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
        //this.updateBB();
        this.release = false;
        this.destroy = 3;
        this.stay = false;
        this.location = {x: this.source.BB.left + this.source.BB.width / 2, y: this.source.BB.top + this.source.BB.height / 2};
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
        super.update();
    }

    
    
}