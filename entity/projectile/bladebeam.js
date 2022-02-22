class BladeBeam extends AbstractEntity {
    constructor(game, x, y, direction) {
        super(game, x, y, STATS.BLADE_BEAM.NAME, STATS.BLADE_BEAM.MAX_HP, STATS.BLADE_BEAM.WIDTH, STATS.BLADE_BEAM.HEIGHT, STATS.BLADE_BEAM.SCALE);
        this.direction = direction;
        this.damage = STATS.BLADE_BEAM.DAMAGE;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/projectile/bladeBeam.png");
        this.scale = 5;

        this.directions = { left : 0, right : 1 };
        this.velocity = this.direction == this.directions.right ? 1000 : -1000;

        this.hit = false;
        this.loadAnimations();
        this.updateBB();

        //how long the blade beam lasts before it fades out
        this.duration = 0;
        this.maxDuration = 0.5;
        this.myOpacity = 100;
    };

    loadAnimations() {
        this.animations = [];
        this.animations[this.directions.right] = new Animator(this.spritesheet, 0, 11, 40, 20, 7, 0.1, 0, false, false, false);
        this.animations[this.directions.left] = new Animator(this.spritesheet, 0, 236, 40, 20, 7, 0.1, 0, true, false, false);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x + (14 * this.scale), this.y, this.width / 2, this.height);
    };

    update() {
        const TICK = this.game.clockTick;
        //remove from world after set time
        this.duration += TICK;
        if(this.duration > this.maxDuration) {
            if(this.myOpacity > 0) this.myOpacity -= 1;
            if(this.myOpacity <= 0) this.removeFromWorld = true;
        }


        this.x += (this.velocity * TICK);
        this.updateBB();
        let self = this;
        this.game.foreground2.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB)) {
                self.removeFromWorld = true;
            }
        });

        this.game.enemies.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB)) {
                if (entity instanceof AbstractEnemy && !self.hit && !entity.dead) {
                    self.removeFromWorld = true;
                    self.hit = true;
                    entity.takeDamage(self.damage, false);
                    entity.setDamagedState();
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

    draw(ctx) {
        ctx.filter = "Opacity(" + this.myOpacity + "%)";
        this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        ctx.filter = "none";
    };

    setDamagedState() {};

    getDamageValue() {
        let dmg = this.damage;
        if (this.isCriticalHit()) {
            dmg *= PARAMS.CRITICAL_BONUS;
        }
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
    };
};
