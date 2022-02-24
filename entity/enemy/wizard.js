class Wizard extends AbstractEnemy {
    constructor(game, x, y, left, right, top, bottom, h) {
        super(game, x, y, false, STATS.WIZARD.NAME, STATS.WIZARD.MAX_HP, STATS.WIZARD.WIDTH, STATS.WIZARD.HEIGHT, STATS.WIZARD.SCALE, STATS.WIZARD.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/wizard.png");
        this.h = h;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.bossActive = true;
        this.animations = [];
        this.loadAnimations();
        this.tick = 0;
        this.states = {
            idle1: 0, idleto2: 1, idle2: 2, idleto1: 3,
            stoptofly: 4, fly: 5, flytostop: 6, attack: 7, atoidle: 8, dead: 9,
            disappear: 10, reappear: 11,
        };
        this.state = this.states.idle1;
        this.directions = { right: 0, left: 1 };
        this.direction = this.directions.right;
        this.phase = Math.floor(Math.random() * 4);
        this.updateBoxes();
        this.damagedCooldown = 0;
        this.hit = false;
        this.phases = {avoid: 0};
        this.phase = this.phases.avoid;
        this.teleporting = false;
        this.teleportLocation = {x: 0, y: 0};
        var self = this;
        this.healthbar.draw = function(ctx) {
            var width = self.game.surfaceWidth * .55;
            var height = PARAMS.BLOCKDIM / 2;
            var offsetX = (self.game.surfaceWidth - width) / 2;
            var offsetY = PARAMS.BLOCKDIM
            var ratio = this.agent.hp / this.agent.max_hp;
            ctx.strokeStyle = "Black"; //border
            //transparent gray as hp fill
            ctx.fillStyle = rgba(41, 41, 41, 0.5);
            ctx.fillRect(offsetX, offsetY, width, height);
            //hp ratio color
            ctx.fillStyle = ratio < PARAMS.LOW_HP ? "Red" : ratio < PARAMS.MID_HP ? "Yellow" : "Green";
            ctx.fillRect(offsetX, offsetY, width * ratio, height);
            ctx.strokeRect(offsetX, offsetY, width, height);
        }
        this.drawHealth = function(ctx) {
            this.healthbar.draw(ctx);
        }
    }

    // use after any change to this.x or this.y
    updateBoxes() {
        this.lastBB = this.BB;
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
            this.state = this.states.disappear;
        }
    }

    checkCooldowns() {
        let TICK = this.game.clockTick;
        // flying eye hit cooldown
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
        for (let i = 0; i < 12; i++) {
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

        this.animations[10][0] = new Animator(this.spritesheet, 6, 1000, 80, 80, 5, 0.15, 0, true, false, false);
        this.animations[10][1] = new Animator(this.spritesheet, 0, 1000, 80, 80, 5, 0.15, 0, false, false, false);
        this.animations[11][0] = new Animator(this.spritesheet, 6, 1000, 80, 80, 5, 0.15, 0, false, false, false);
        this.animations[11][1] = new Animator(this.spritesheet, 0, 1000, 80, 80, 5, 0.15, 0, true, false, false);
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
                    if (dist < 50 * self.scale) {
                        self.teleporting = true;
                        self.hit = false;
                        self.vulnerable = false;
                        self.state = self.states.disappear;
                        self.teleportLocation.x = ex;
                        self.teleportLocation.y = ey;
                    }
                }
            })
        }
        if (this.teleporting) {
            this.teleport();
        }
        
    }

    teleport() {
        let isDone = this.animations[this.state][this.direction].isDone();
        if (this.state == this.states.disappear && isDone) {
            let xOffset = this.center.x - this.x;
            let yOffset = this.center.y - this.y;
            let angle = Math.random() * 2 * Math.PI;
            let xFinal = Math.cos(angle) * 200 * this.scale;
            if (this.left * PARAMS.BLOCKDIM > this.BB.left - 20 * this.scale)
                xFinal = Math.abs(xFinal) + this.center.x;
            else if (this.right * PARAMS.BLOCKDIM < this.BB.right + 20 * this.scale)
                xFinal = -Math.abs(xFinal) + this.center.x;
            else xFinal += this.center.x;;
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
            this.updateBoxes();
            this.resetAnimationTimers(this.state);
            this.state = this.states.reappear;
            this.resetAnimationTimers(this.state);
        }
        else if (this.state == this.states.reappear && isDone) {
            if (this.game.camera.player.x < this.center.x)
                this.direction = this.directions.left;
            if (this.game.camera.player.x > this.center.x)
                this.direction = this.directions.right;
            this.resetAnimationTimers(this.state);
            this.state = this.states.idle1;
            this.vulnerable = true;
            this.teleporting = false;
        }
     }

    draw(ctx) {
        if (this.hit) {
            ctx.filter = "brightness(150000%)";
        }
        if (this.state == this.states.disappear) {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.BB.left - this.game.camera.x, this.BB.top - this.game.camera.y, this.BB.width, this.BB.height);
        }
        if (this.state == this.states.reappear) {
            ctx.fillStyle = "green";
            ctx.fillRect(this.BB.left - this.game.camera.x, this.BB.top - this.game.camera.y, this.BB.width, this.BB.height);
        }
        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        ctx.filter = "none";
    }

    

}