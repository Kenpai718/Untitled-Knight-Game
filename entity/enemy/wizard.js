class Wizard extends AbstractBoss {
    constructor(game, x, y, left, right, top, bottom, h) {
        super(game, x, y, false, STATS.WIZARD.NAME, STATS.WIZARD.MAX_HP, STATS.WIZARD.WIDTH, STATS.WIZARD.HEIGHT, STATS.WIZARD.SCALE, STATS.WIZARD.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/wizard.png");
        this.h = h;
        this.activeBoss = true;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.animations = [];
        this.loadAnimations();
        this.tick = 0;
        this.states = {
            idle1: 0, idleto2: 1, idle2: 2, idleto1: 3,
            stoptofly: 4, fly: 5, flytostop: 6, attack: 7, atoidle: 8, dead: 9,
            disappear: 10, reappear: 11, throw: 12, raise: 13, casting: 14, lower: 15,
        };
        this.state = this.states.idle1;
        this.directions = { right: 0, left: 1 };
        this.direction = this.directions.left;
        this.phase = Math.floor(Math.random() * 4);
        this.updateBoxes();
        this.lastBB = this.BB;
        this.damagedCooldown = 0;
        this.hit = false;
        this.phases = {avoid: 0, fire_ring: 1};
        this.phase = this.phases.avoid;
        this.teleporting = false;
        this.teleportLocation = {x: 0, y: 0};
        this.tWidth = 80 * this.scale;
        this.tHeight = 80 * this.scale;
        this.fireCircle = [];
        this.phaseCooldown = 5;
        this.velocity.r = 300;
        this.telportTimer = 0;
        this.appearTime = 0;
        this.disappearTime = 0;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 80;
        this.canvas.height = 80;
    }

    // use after any change to this.x or this.y
    updateBoxes() {
        this.getOffsets();
        this.AR = new BoundingBox(this.x + (40 * this.scale), this.y + this.offsetyBB, this.width - (80 * this.scale), this.heightBB);
        this.VB = new BoundingBox(this.x - (80 * this.scale), this.y, this.width + (160 * this.scale), this.height);
        this.BB = new BoundingBox(this.x + this.offsetxBB * this.scale, this.y + this.offsetyBB * this.scale, this.widthBB * this.scale, this.heightBB * this.scale);
        this.center = {x: this.BB.left + this.BB.width / 2, y: this.BB.top + this.BB.height / 2};
    };

    getDamageValue() {
    }

    setDamagedState() {
        this.vulnerable = false;
        this.hit = true;
        if (this.phase == this.phases.avoid) {
            this.teleporting = true;
            this.teleportLocation.x = this.center.x;
            this.teleportLocation.y = this.center.y;
            this.disappearTime = .75;
        }
    }

    checkCooldowns() {
        let TICK = this.game.clockTick;
        this.phaseCooldown -= TICK;
        if (this.state == this.states.casting) {
            this.wait -= TICK;
        }
        if(this.phaseCooldown <= 0 && !this.teleporting) {
            this.phaseCooldown = 5;
            let random = Math.round(Math.random());
            this.changePhase(random);
        }
        // wizard eye hit cooldown
        if (!this.vulnerable) {
            this.damagedCooldown += TICK;
            this.hitCooldown += TICK;
            if (this.damagedCooldown >= PARAMS.DMG_COOLDOWN) {
                this.damagedCooldown = 0;
                //this.canAttack = true;
                //this.runAway = false;
                if (!this.teleporting)
                    this.vulnerable = true;
                this.hit = false;
            }
        }
    }

    getOffsets() {
        switch (this.state) {
            default: 
                this.offsetxBB = 21;
                this.offsetyBB = 10;
                this.widthBB = 32;
                this.heightBB = 60;
        }
    }

    checkEntityInteractions(dist, TICK) {
        let self = this;
        this.game.entities.forEach(function (entity) {
            let states = [];
            if (entity instanceof AbstractPlayer) {
                /*
                const dest = { x: entity.BB.left + entity.BB.width / 2, y: entity.BB.top + entity.BB.height / 2 };
                const init = { x: self.BB.left + self.BB.width / 2, y: self.BB.top + self.BB.height / 2 };
                const distX = dest.x - init.x;
                const distY = dest.y - init.y;
                const dist = Math.sqrt(distX * distX + distY * distY);
                if (self.state == self.states.idle) {

                }
                if (states.length > 1 && Math.random() > 0.25) {
                    //states.pop();
                }
                if (states.length > 0) {
                    //let state = states.pop();
                    //self.state = state;
                }
                let playerInVB = entity.BB && self.VB.collide(entity.BB);
                let playerAtkInVB = entity.HB != null && self.VB.collide(entity.HB);
                if (playerInVB || playerAtkInVB || self.aggro) {
                }*/
                //else {
                    /*if (self.state == self.state.attack1) {
                        self.velocity.x = 0;
                        self.velocity.y = 0;
                    }

                    if (self.state != self.states.idle1)
                        self.resetAnimationTimers(self.state);
                    self.state = self.states.idle1;*/
                //}
                if (entity.HB && self.BB.collide(entity.HB)) {
                    self.setDamagedState();
                }
            }


        });
        return dist;
    }

    resetAnimationTimers(action) {
        this.animations[action][0].elapsedTime = 0;
        this.animations[action][1].elapsedTime = 0;
    }

    loadAnimations() {
        for (let i = 0; i < 16; i++) {
            this.animations.push([]);
            for (let j = 0; j < 2; j++) {
                this.animations.push({});
            }
        }

        // idle
        this.animations[0][0] = new Animator(this.spritesheet, 6, 0, 80, 80, 4, 0.15, 0, true, true, false);
        this.animations[1][0] = new Animator(this.spritesheet, 326, 160, 80, 80, 5, 0.15, 0, true, false, false);
        this.animations[2][0] = new Animator(this.spritesheet, 6, 160, 80, 80, 4, 0.15, 0, true, true, false);
        this.animations[3][0] = new Animator(this.spritesheet, 326, 160, 80, 80, 5, 0.15, 0, false, false, false);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 80, 80, 80, 4, 0.15, 0, false, true, false);
        this.animations[1][1] = new Animator(this.spritesheet, 80, 240, 80, 80, 5, 0.15, 0, false, false, false);
        this.animations[2][1] = new Animator(this.spritesheet, 480, 240, 80, 80, 4, 0.15, 0, false, true, false);
        this.animations[3][1] = new Animator(this.spritesheet, 80, 240, 80, 80, 5, 0.15, 0, true, false, false);

        // fly forward
        this.animations[4][0] = new Animator(this.spritesheet, 166, 320, 80, 80, 4, 0.15, 0, true, false, false);
        this.animations[5][0] = new Animator(this.spritesheet, 6, 320, 80, 80, 3, 0.15, 0, false, true, false);
        this.animations[6][0] = new Animator(this.spritesheet, 166, 320, 80, 80, 4, 0.15, 0, false, false, false);
        this.animations[4][1] = new Animator(this.spritesheet, 0, 400, 80, 80, 4, 0.15, 0, false, false, false);
        this.animations[5][1] = new Animator(this.spritesheet, 240, 400, 80, 80, 3, 0.15, 0, false, true, false);
        this.animations[6][1] = new Animator(this.spritesheet, 0, 400, 80, 80, 4, 0.15, 0, true, false, false);

        // attack
        this.animations[7][0] = new Animator(this.spritesheet, 6, 480, 80, 80, 9, 0.15, 0, true, false, false);
        this.animations[8][0] = new Animator(this.spritesheet, 326, 480, 80, 80, 4, 0.15, 0, false, false, false);
        this.animations[7][1] = new Animator(this.spritesheet, 0, 560, 80, 80, 9, 0.15, 0, false, false, false);
        this.animations[8][1] = new Animator(this.spritesheet, 0, 560, 80, 80, 4, 0.15, 0, true, false, false);

        // death
        this.animations[9][0] = new Animator(this.spritesheet, 6, 640, 80, 80, 10, 0.15, 0, true, false, false);
        this.animations[9][1] = new Animator(this.spritesheet, 6, 720, 80, 80, 10, 0.15, 0, false, false, false);

        // teleport
        this.animations[10][0] = new Animator(this.spritesheet, 6, 0, 80, 80, 1, 0.75, 0, true, false, false);
        this.animations[10][1] = new Animator(this.spritesheet, 0, 80, 80, 80, 1, 0.75, 0, false, false, false);
        this.animations[11][0] = new Animator(this.spritesheet, 6, 0, 80, 80, 1, 0.30, 0, false, false, false);
        this.animations[11][1] = new Animator(this.spritesheet, 0, 80, 80, 80, 1, 0.30, 0, true, false, false);

        this.animations[12][0] = new Animator(this.spritesheet, 6, 800, 80, 80, 9, 0.07, 0, false, false, false);
        this.animations[12][1] = new Animator(this.spritesheet, 0, 880, 80, 80, 9, 0.07, 0, true, false, false);

        this.animations[13][0] = new Animator(this.spritesheet, 246, 1040, 80, 80, 2, 0.15, 0, true, false, false);
        this.animations[13][1] = new Animator(this.spritesheet, 0, 960, 80, 80, 2, 0.15, 0, false, false, false);
        this.animations[14][0] = new Animator(this.spritesheet, 6, 1040, 80, 80, 3, 0.15, 0, true, true, false);
        this.animations[14][1] = new Animator(this.spritesheet, 160, 960, 80, 80, 3, 0.15, 0, false, true, false);
        this.animations[15][0] = new Animator(this.spritesheet, 166, 1040, 80, 80, 2, 0.15, 0, false, false, false);
        this.animations[15][1] = new Animator(this.spritesheet, 0, 960, 80, 80, 2, 0.15, 0, true, false, false);
    }

    update() {
        let TICK = this.game.clockTick;
        this.checkCooldowns();
        let dist = {x: 0, y: 0};
        let self = this;
        dist = this.checkEntityInteractions(dist, TICK);
        if (this.phase == this.phases.avoid && !this.teleporting) {
            this.game.entities.forEach(function (entity) {
                if (entity instanceof AbstractPlayer) {
                    let ex = entity.BB.left + entity.BB.width / 2;
                    let ey = entity.BB.top + entity.BB.height / 2;
                    let distx = ex - self.center.x;
                    let disty = ey - self.center.y;
                    let dist = Math.sqrt(distx * distx + disty * disty);
                    if (dist < 60 * self.scale) {
                        self.activateTeleport();
                    }
                }
            })
        }
        if (this.phase == this.phases.fire_ring) {
            this.fireRing(6);
        }



        if (this.teleporting) {
            this.teleport();
        }
        else
            this.animations[this.state][this.direction].update(TICK);
        this.lastBB = this.BB;
    }

    activateTeleport() {
        let player = this.game.camera.player;
        let ex = player.BB.left + player.BB.width / 2;
        let ey = player.BB.top + player.BB.height / 2;
        this.teleporting = true;
        this.hit = false;
        this.vulnerable = false;
        this.teleportLocation.x = ex;
        this.teleportLocation.y = ey;
        this.disappearTime = .75;
    }

    teleport() {
        let TICK = this.game.clockTick;
        let BB = new BoundingBox(0, 0, 1, 1);
        this.BB = BB;
        this.disappearTime -= TICK;
        if (this.disappearTime <= 0) {
            let xOffset = this.center.x - this.x;
            let yOffset = this.center.y - this.y;
            let angle = Math.random() * 2 * Math.PI;
            let xFinal = Math.cos(angle) * 200 * this.scale;
            this.updateBoxes();
            if (this.left * PARAMS.BLOCKDIM > this.BB.left - 20 * this.scale)
                xFinal = Math.abs(xFinal) + this.center.x;
            else if (this.right * PARAMS.BLOCKDIM < this.BB.right + 20 * this.scale)
                xFinal = -Math.abs(xFinal) + this.center.x;
            else xFinal += this.center.x;
            let yFinal = Math.sin(angle) * 200 * this.scale;
            if ((this.h - this.bottom) * PARAMS.BLOCKDIM < this.BB.bottom + 20 * this.scale)
                yFinal = -Math.abs(yFinal) + this.center.y;
            else yFinal += this.center.y;
            if (xFinal - this.BB.width / 2 < this.left * PARAMS.BLOCKDIM)
                xFinal = this.left * PARAMS.BLOCKDIM + this.BB.width / 2;
            if (xFinal + this.BB.width / 2 > this.right * PARAMS.BLOCKDIM)
                xFinal = this.right * PARAMS.BLOCKDIM - this.BB.width / 2;
            if (yFinal - this.BB.height / 2 < (this.h - this.top) * PARAMS.BLOCKDIM)
                yFinal = (this.h - this.top) * PARAMS.BLOCKDIM - this.BB.height / 2;
            if (yFinal + this.BB.height / 2 > (this.h - this.bottom) * PARAMS.BLOCKDIM)
                yFinal = (this.h - this.bottom) * PARAMS.BLOCKDIM - this.BB.height / 2;
                //yFinal = this.h * PARAMS.BLOCKDIM - this.BB.height / 2;
            this.x = xFinal - xOffset;
            this.y = yFinal - yOffset;
            this.BB = BB;
            this.reappearTime = .3;
            this.disappearTime = 100;
        }
        else if (this.reappearTime > 0) {
            this.reappearTime -= TICK;
            this.updateBoxes();
            if (this.reappearTime < 0.15) {
                if (this.game.camera.player.x < this.center.x)
                this.direction = this.directions.left;
                if (this.game.camera.player.x > this.center.x)
                this.direction = this.directions.right;
            }
            if (this.reappearTime <= 0) {
                this.vulnerable = true;
                this.teleporting = false;
            }
            else this.BB = BB;
        }
     }

    fireRing(max) {
        let TICK = this.game.clockTick;
        let states = this.states;
        let dir = this.direction;
        let animation = this.animations[this.state][this.direction];
        let isDone = animation.isDone();
        let frame = animation.currentFrame();
        switch (this.state) {
            case states.idleto2:
                if (isDone) {
                    this.resetAnimationTimers(this.state);
                    this.state = states.throw;
                }
                break;
            case states.throw:
                if (isDone) {
                    this.fire = false;
                    this.resetAnimationTimers(this.state);
                    if (this.fireCircle.length == max)
                        this.state = this.states.idle1;
                }
                if (frame == 5 && !this.fire) {
                    this.fire = true;
                    let fireball = null;
                    if (dir == this.direction.left)
                        fireball = new FireballCircular(this.game, this, 
                            this.BB.left + this.BB.width / 2 - 8 * this.scale, 
                            this.BB.top + this.BB.height / 2, 
                            this.scale, this.direction);
                    else
                        fireball = new FireballCircular(this.game, this,
                            this.BB.left + this.BB.width / 2 + 8 * this.scale,
                            this.BB.top + this.BB.height / 2,
                            this.scale, this.direction);
                    this.fireCircle.push(fireball);
                    this.game.addEntity(fireball);
                }
                break;
            case states.idle1:
                if (this.BB.top + this.BB.height * 1.5 > (this.h - this.top) * PARAMS.BLOCKDIM) {
                    this.y -= this.velocity.r * TICK;
                    this.updateBoxes();
                }
                else {
                    this.y += (this.h - this.top) * PARAMS.BLOCKDIM - (this.BB.top + this.BB.height * 1.5);
                    this.updateBoxes();
                    this.state = states.raise;
                    this.fireCircle.forEach(fireball => fireball.stay = true);
                }
                break;
            case states.raise:
                if (isDone) {
                    this.resetAnimationTimers(this.state);
                    this.state = states.casting;
                    this.wait = .5;
                }
                break;
            case states.casting:
                if (this.wait <= 0) {
                    this.fireCircle.forEach(fireball => fireball.release = true);
                    this.fireCircle = [];
                    this.state = states.lower;
                }
                break;
            case states.lower:
                if (isDone) {
                    this.resetAnimationTimers(this.state);
                    this.state = states.idle1;
                    this.activateTeleport();
                    this.changePhase();
                    this.phaseCooldown = 0;
                }
                break;
        }
    }

    changePhase(phase) {
        let phases = this.phases;
        this.phase = phase;
        this.resetAnimationTimers(this.state);
        switch (phase) {
            case phases.avoid:
                this.state = this.states.idle1;
                break;
            case phases.fire_ring:
                this.phaseCooldown =  20;
                this.state = this.states.idleto2;
                this.fire = false;
                break;
        }
            
    }

    draw(ctx) {
        let TICK = this.game.clockTick;
        if (this.hit) {
            ctx.filter = "brightness(150000%)";
        }
        if (this.teleporting) {
            ctx.filter = "brightness(150000%)";
            if (this.disappearTime > 0 && this.disappearTime < 1) {
                this.tWidth -= 4000 * TICK;
                if (this.tWidth < 0) this.tWidth = 0;
                this.tHeight += 4000 * TICK;
                if (this.tHeight > 300 * this.scale) this.tHeight = 300 * this.scale;
            }
            else if (this.reappearTime > 0) {
                this.tWidth += 4000 * TICK;
                if (this.tWidth > 80 * this.scale) this.tWidth = 80 * this.scale;
                this.tHeight -= 4000 * TICK;
                if (this.tHeight < 80 * this.scale) this.tHeight = 80 * this.scale;
            }
            let w = 80 * this.scale - this.tWidth;
            let h = 80 * this.scale - this.tHeight;

            this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.ctx, 0, 0, 1);
            ctx.drawImage(this.canvas, this.x - this.game.camera.x + w / 2, this.y - this.game.camera.y + h / 2 , this.tWidth, this.tHeight);
            //ctx.drawImage(this.canvas, 0, 0, this.tWidth, this.tHeight);

            //this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            /*
            if (this.direction == this.directions.right)
                ctx.drawImage(this.spritesheet, 6, 0, 80, 80, this.x - this.game.camera.x + w / 2, this.y - this.game.camera.y + h / 2 , this.tWidth, this.tHeight);``
            if (this.direction == this.directions.left)
                ctx.drawImage(this.spritesheet, 0, 80, 80, 80, this.x - this.game.camera.x + w / 2, this.y - this.game.camera.y + h / 2 , this.tWidth, this.tHeight);
                */
        }
        else {
            this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            this.tWidth = 80 * this.scale;
            this.tHeight = 80 * this.scale;
        }
        ctx.filter = "none";
    }

    

}
