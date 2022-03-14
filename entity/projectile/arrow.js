class Arrow extends AbstractEntity {
    constructor(game, x, y, target, type, playerTeam) {
        super(game, x, y, STATS.ARROW.NAME, STATS.ARROW.MAX_HP, STATS.ARROW.WIDTH, STATS.ARROW.HEIGHT, STATS.ARROW.SCALE);
        Object.assign(this, { game, x, y, target, type, playerTeam });

        this.radius = 15;
        this.smooth = true; //this is used for angle transitions
        this.arrowWidth = 32;
        this.arrowHeight = 32;
        this.facing = 5;
        this.scale = 2;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/projectile/arrows.png");

        var dist = distance(this, this.target);
        this.maxSpeed = 1000 + (this.type * 100); //pixels per second, upgraded arrows fly a bit faster
        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        //gravity
        this.fallAcc = 1000;    //gravity
        this.timeToFall = 0.75;  //after this amount of seconds apply gravity
        this.elapsedTime = 0;

        this.cache = [];
        this.animations = [];
        this.loadAnimations();

        //specific game values
        this.stuck = false; //stuck = true, hit something like ground and cannot move. Can be picked up by player.
        this.hit = false; //false = not hit an enemy, true = hit enemy. This is needed so an arrow doesn't multi hit during collision.
        this.damage = STATS.ARROW.DAMAGE; //how much hp this arrow will take away if it hits something
        this.upgradeDmg = 2; //upgrade multiplier

        this.updateBB();
    };

    update() {

        //set speed and movement of the arrow (currently set to constant speed)
        if (!this.stuck) {
            this.elapsedTime += this.game.clockTick;
            if (this.elapsedTime > this.timeToFall) {
                this.velocity.y += this.fallAcc * this.game.clockTick;
            }
        }
        else {
            this.stuckTimer -= this.game.clockTick;
            if (this.stuckTimer <= 0) this.removeFromWorld = true;
        }

        this.x += (this.velocity.x * this.game.clockTick);
        this.y += (this.velocity.y * this.game.clockTick);

        //get direction of the arrow
        if (!this.stuck) this.facing = getFacing(this.velocity);
        this.updateBB();
        this.handleCollisions();


        let w = this.game.surfaceWidth;
        let h = this.game.surfaceHeight;
        //despawn if outside the canvas
        if (this.x > 3 / 2 * w + this.game.camera.x || this.x + w / 2 < this.game.camera.x ||
            this.y > h + w / 2 + this.game.camera.y || this.y + w / 2 < this.game.camera.y)
            this.removeFromWorld = true;


    };

    handleCollisions() {
        let self = this;
        let hitWall = false;
        //hit environment stick to the ground!
        this.game.foreground2.forEach(function (entity) {
            if (entity.BB && self.BB.collide(entity.BB)) {
                hitWall = true;
                if (!self.stuck) {
                    self.smooth = false;
                    let check1 = entity.BB.left - self.BB.left;
                    let check2 = entity.BB.right - self.BB.right;
                    let check3 = entity.BB.top - self.BB.top;
                    let check4 = entity.BB.bottom - self.BB.bottom;
                    //console.log(check1, check2, check3, check4)
                    if (check1 >= 0 && check2 >= 0 && check3 >= 0 && check4 >= 0) {
                        let x = 0;
                        let y = 0;
                        if (Math.abs(check1) < Math.abs(check2)) x = check1;
                        else x = check2;
                        if (Math.abs(check3) < Math.abs(check4)) y = check3;
                        else y = check4;
                        let dist = 0;
                        let random = Math.random() / 2 + .5;
                        if (Math.abs(x) < Math.abs(y)) {
                            if (x == check1) {
                                dist = check1 + self.BB.width * random;
                            }
                            else {
                                dist = check2 - self.BB.width * random;
                            }
                        }
                        else {
                            if (y == check3) {
                                dist = check3 + self.BB.height * random;
                            }
                            else {
                                dist = check4 - self.BB.height * random;
                            }
                        }
                        self.x -= dist;
                        self.y -= dist;
                        console.log(dist);
                    }
                    self.velocity.x = 0;
                    self.velocity.y = 0;
                    self.stuck = true;
                    self.stuckTimer = 15;
                    ASSET_MANAGER.playAsset(SFX.ARROW_STICK);
                }
            }
        });

        //unstick arrow if the wall that it hit is no longer there (like through an obelisk)
        if (this.stuck && !hitWall) this.stuck = false;

        //player's arrow try to do damage to enemy
        if (this.playerTeam) {
            this.game.enemies.forEach(function (entity) {
                if (entity.BB && self.BB.collide(entity.BB)) {
                    //do damage to enemy hit by player arrow
                    if (entity instanceof AbstractEnemy) {
                        if (!self.hit && !self.stuck && !entity.dead) {
                            self.doArrowHit(entity);
                            if (!entity.aggro) entity.aggro = true;
                        }
                    }
                }
            });
        } else { //enemy arrow try to hit the player
            let player = this.game.camera.player;
            if (player.BB && self.BB.collide(player.BB)) {
                if (!self.hit && !self.stuck && !player.dead) {
                    if (player.vulnerable) self.doArrowHit(player);
                }
            }
            // this.game.entities.forEach(function (entity) {
            //     if (entity.BB && self.BB.collide(entity.BB)) {
            //         //do damage to enemy hit by player arrow
            //         if (entity instanceof AbstractPlayer) {
            //             if (!self.hit && !self.stuck && !entity.dead) {
            //                 if (entity.vulnerable) self.doArrowHit(entity);
            //             }
            //         }
            //     }
            // });
        }

        this.updateBB();
    }

    doArrowHit(entity) {
        if (entity.canTakeDamage()) {
            this.game.myReportCard.myDamageDealt += this.getDamageValue();
            ASSET_MANAGER.playAsset(SFX.ARROW_HIT);
            this.removeFromWorld = true;
            this.hit = true;
            entity.takeDamage(this.getDamageValue(), this.critical);
            entity.setDamagedState();
        }
    }

    updateBB() {
        //offset needed so the arrow doesnt move with the camera when it is
        this.BB = new BoundingBox(this.x - this.radius, this.y - this.radius, this.arrowHeight, this.arrowWidth);

    };

    draw(ctx) {
        var xOffset = 16 * this.scale;
        var yOffset = 16 * this.scale;
        if (this.smooth) { //drawn when arrow is shot/flying
            let angle = Math.atan2(this.velocity.y, this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);

            this.drawAngle(ctx, degrees);
        } else { //this is where the arrow gets drawn when stuck
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

    /**
     * Takes the arrow and uses an invisible canvas
     * to make a new arrow image drawn at a different angle
     * @param {*} ctx 
     * @param {*} angle 
     * @returns 
     */
    drawAngle(ctx, angle) {
        if (angle < 0 || angle > 359) return;

        if (!this.cache[angle]) {
            let radians = angle / 360 * 2 * Math.PI;
            let offscreenCanvas = document.createElement('canvas');

            //canvas must be bigger than arrow width/height scale so there is some buffer
            offscreenCanvas.width = 80 * this.scale;
            offscreenCanvas.height = 80 * this.scale;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(16 * this.scale, 16 * this.scale);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-16 * this.scale, -16 * this.scale);
            //draw the translated sprite onto an invisible canvas
            offscreenCtx.drawImage(this.spritesheet, 76, this.mySpriteY, 40, 38, 0, 0, 40 * this.scale, 38 * this.scale);
            offscreenCtx.restore();

            //put this new angled image into a cache for use in drawing onto canvas
            this.cache[angle] = offscreenCanvas;
        }

        var xOffset = 16 * this.scale;
        var yOffset = 16 * this.scale;
        var camera_offsetx = this.game.camera.x;
        var camera_offsety = this.game.camera.y;
        ctx.drawImage(this.cache[angle], this.x - xOffset - camera_offsetx, this.y - yOffset - camera_offsety);
    };

    getDamageValue() {
        let dmg = this.damage;

        //if upgraded arrow increase the damage
        if (this.type != 0) {
            dmg += (this.upgradeDmg * this.type);
        }
        //critical bonus
        if (this.isCriticalHit()) {
            dmg = dmg * PARAMS.CRITICAL_BONUS;
        }
        return dmg;
    }


    setDamagedState() {
        //do nothing this is just required by AbstractEntity
    }


    loadAnimations() {
        switch (this.type) {
            case 1: //iron arrow
                this.mySpriteY = 157;
                this.animations.push(new Animator(this.spritesheet, 0, 154, 32, 36, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 154, 37, 36, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 154, 43, 36, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 154, 37, 36, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 160, 154, 32, 36, 1, 0.2, 0, false, true)); //down
                break;
            case 2: //gold arrow
                this.mySpriteY = 40;
                this.animations.push(new Animator(this.spritesheet, 0, 34, 32, 39, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 34, 36, 37, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 34, 40, 32, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 34, 36, 37, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 160, 34, 32, 37, 1, 0.2, 0, false, true)); //down
                break;
            case 3: //diamond arrow
                this.mySpriteY = 76;
                this.animations.push(new Animator(this.spritesheet, 0, 72, 32, 39, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 72, 37, 37, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 72, 43, 32, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 72, 37, 37, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 160, 72, 32, 38, 1, 0.2, 0, false, true)); //down
                break;
            case 4: //netherite arrow
                this.mySpriteY = 118;
                this.animations.push(new Animator(this.spritesheet, 0, 115, 32, 36, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 32, 115, 37, 36, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 75, 115, 43, 36, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 119, 115, 37, 36, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 160, 115, 32, 36, 1, 0.2, 0, false, true)); //down
                break;
            default: //base arrow
                this.type = 0;
                this.mySpriteY = 0;
                this.animations.push(new Animator(this.spritesheet, 0, 0, 32, 32, 1, 0.2, 0, false, true)); //up
                this.animations.push(new Animator(this.spritesheet, 29, 0, 32, 32, 1, 0.2, 0, false, true)); //up right
                this.animations.push(new Animator(this.spritesheet, 76, 0, 36, 32, 1, 0.2, 0, false, true)); //right
                this.animations.push(new Animator(this.spritesheet, 117, 0, 32, 32, 1, 0.2, 0, false, true)); //down right
                this.animations.push(new Animator(this.spritesheet, 158, 0, 32, 32, 1, 0.2, 0, false, true)); //down
                break;

        }
    }

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
        //info
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.fillStyle = "SpringGreen";
        let arrowType = "Arrow: Type " + this.type;
        let cords = "Cords:(" + Math.round(this.x) + ", " + Math.round(this.y) + ")";
        let velocity = "Velocity:{" + Math.round(this.velocity.x) + ", " + Math.round(this.velocity.y) + "}";
        let usingGravity = this.elapsedTime >= this.timeToFall;

        ctx.fillText(arrowType, this.BB.x - camera_offsetx - (this.width / 2), this.BB.y - camera_offsety - 50);
        ctx.fillText(cords, this.BB.x - camera_offsetx - (this.width / 2), this.BB.y - camera_offsety - 40);
        ctx.fillText(velocity, this.BB.x - camera_offsetx - (this.width / 2), this.BB.y - camera_offsety - 30);
        usingGravity && !this.stuck ? ctx.fillStyle = "White" : ctx.fillStyle = "gray";
        ctx.fillText("Gravity:" + usingGravity, this.BB.x - camera_offsetx - (this.width / 2), this.BB.y - camera_offsety - 20);
        this.stuck ? ctx.fillStyle = "White" : ctx.fillStyle = "gray";
        ctx.fillText("Is Stuck:" + this.stuck, this.BB.x - camera_offsetx - (this.width / 2), this.BB.y - camera_offsety - 10);
        //ctx.strokeStyle = 'Green';
        //ctx.strokeRect(this.x - xOffset, this.y - yOffset, 32, 32);
    }

};
