class Wizard extends AbstractBoss {
    constructor(game, x, y, left, right, top, bottom) {
        // basic boss setup
        super(game, x, y, false, STATS.WIZARD.NAME, STATS.WIZARD.MAX_HP, STATS.WIZARD.WIDTH, STATS.WIZARD.HEIGHT, STATS.WIZARD.SCALE, STATS.WIZARD.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/wizard.png");
        this.activeBoss = true;
        this.animations = [];
        this.loadAnimations();
        this.updateBoxes();
        this.lastBB = this.BB;

        // dimension of the frame in spritesheet
        this.tWidth = 80 * this.scale;
        this.tHeight = 80 * this.scale;

        // radius velocity to allow defined radial path
        this.velocity.r = 300;

        /** battle phases */

        // attack phases
        this.phases = {no_attack: 0, fire_ring: 1};
        this.phase = this.phases.no_attack;

        // states/animation
        this.states = {
            idle1: 0, idleto2: 1, idle2: 2, idleto1: 3,
            stoptofly: 4, fly: 5, flytostop: 6, attack: 7, atoidle: 8, dead: 9,
            throw: 10, raise: 11, casting: 12, lower: 13,
        };
        this.state = this.states.idle1;

        // directions
        this.directions = { right: 0, left: 1 };
        this.direction = this.directions.left;

        // define special state booleans
        this.hit = false;
        this.avoid = true;

        // spawned attacks
        this.fireCircle = [];

        // timers for cooldown
        this.phaseCooldown = 5;
        this.damagedCooldown = 0;
        this.telportTimer = 0;
        this.appearTime = 0;
        this.disappearTime = 0;


        /** constructing teleportation information */
        
        this.teleporting = false;
        this.teleportLocation = {x: 0, y: 0};

        // canvas for teleportation
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 80;
        this.canvas.height = 80;

        // the relative bounding box to lock wizard's teleportation/movement defined in levels
        // use if to help keep wizard from going ob or too far above player (if attack isn't meant to do that of course)
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
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
        // allows teleport to activate upon hit
        if (this.avoid) {
            this.activateTeleport();
        }
    }

    checkCooldowns() {
        let TICK = this.game.clockTick;
        this.phaseCooldown -= TICK;
        // cooldown for to stop casting something
        if (this.state == this.states.casting) {
            this.wait -= TICK;
        }
        // phase phaseCooldown
        if(this.phaseCooldown <= 0 && !this.teleporting) {
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
        for (let i = 0; i < 14; i++) {
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

        // throw fireball
        this.animations[10][0] = new Animator(this.spritesheet, 6, 800, 80, 80, 9, 0.07, 0, false, false, false);
        this.animations[10][1] = new Animator(this.spritesheet, 0, 880, 80, 80, 9, 0.07, 0, true, false, false);

        // raise amulet
        this.animations[11][0] = new Animator(this.spritesheet, 246, 1040, 80, 80, 2, 0.15, 0, true, false, false);
        this.animations[11][1] = new Animator(this.spritesheet, 0, 960, 80, 80, 2, 0.15, 0, false, false, false);

        // casting
        this.animations[12][0] = new Animator(this.spritesheet, 6, 1040, 80, 80, 3, 0.15, 0, true, true, false);
        this.animations[12][1] = new Animator(this.spritesheet, 160, 960, 80, 80, 3, 0.15, 0, false, true, false);

        // lower amulet
        this.animations[13][0] = new Animator(this.spritesheet, 166, 1040, 80, 80, 2, 0.15, 0, false, false, false);
        this.animations[13][1] = new Animator(this.spritesheet, 0, 960, 80, 80, 2, 0.15, 0, true, false, false);
    }

    update() {
        let TICK = this.game.clockTick;
        this.checkCooldowns();
        let dist = {x: 0, y: 0};
        let self = this;
        dist = this.checkEntityInteractions(dist, TICK);
        // if avoiding player teleport when player is too close, if not teleporting already
        if (this.avoid && !this.teleporting) {
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

        // define all of the phases
        let phases = this.phases;
        switch (this.phase) {
            case phases.fire_ring:
                this.fireRing(6);
                break;
        }

        // allow teleport when activated
        if (this.teleporting) {
            this.teleport();
        }
        // does not update animation if teleporting, which allows current frame to be the frame to use when teleporting
        else this.animations[this.state][this.direction].update(TICK);
        
        this.lastBB = this.BB;
    }

    /**
     * activate teleport so that teleportations can be done
     */
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

    /**
     * logic for teleporting
     */
    teleport() {
        let TICK = this.game.clockTick;
        let BB = new BoundingBox(0, 0, 1, 1);
        this.BB = BB;
        this.disappearTime -= TICK;
        // teleports to a random location a certain distance from the player
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
            if (this.bottom * PARAMS.BLOCKDIM < this.BB.bottom + 20 * this.scale)
                yFinal = -Math.abs(yFinal) + this.center.y;
            else yFinal += this.center.y;
            if (xFinal - this.BB.width / 2 < this.left * PARAMS.BLOCKDIM)
                xFinal = this.left * PARAMS.BLOCKDIM + this.BB.width / 2;
            if (xFinal + this.BB.width / 2 > this.right * PARAMS.BLOCKDIM)
                xFinal = this.right * PARAMS.BLOCKDIM - this.BB.width / 2;
            if (yFinal - this.BB.height / 2 < this.top * PARAMS.BLOCKDIM)
                yFinal = this.top * PARAMS.BLOCKDIM - this.BB.height / 2;
            if (yFinal + this.BB.height / 2 > this.bottom * PARAMS.BLOCKDIM)
                yFinal = this.bottom * PARAMS.BLOCKDIM - this.BB.height / 2;
            this.x = xFinal - xOffset;
            this.y = yFinal - yOffset;
            this.BB = BB;
            this.reappearTime = .3;
            this.disappearTime = 100;
        }
        // appear where disappear determined
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

     /**
      * logic for the fire ring which creates a ring of fire to follow and then release
      * @param {*} max the max amount of fireballs to cast in the circle
      */
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
                        this.state = states.idle1;
                }
                if (frame == 5 && !this.fire) {
                    this.fire = true;
                    let fireball = null;
                    if (this.dir == this.direction.left)
                        fireball = new FireballCircular(this.game, this, 
                            this.center.x - 10 * this.scale, 
                            this.center.y - 4 * this.scale, 
                            this.scale, this.direction);
                    else
                        fireball = new FireballCircular(this.game, this,
                            this.center.x + 10 * this.scale,
                            this.center.y - 4 * this.scale,
                            this.scale, this.direction);
                    this.fireCircle.push(fireball);
                    this.game.addEntity(fireball);
                }
                break;
            case states.idle1:
                if (this.BB.top + this.BB.height * 1.5 > this.top * PARAMS.BLOCKDIM) {
                    this.y -= this.velocity.r * TICK;
                    this.updateBoxes();
                }
                else {
                    this.y += this.top * PARAMS.BLOCKDIM - (this.BB.top + this.BB.height * 1.5);
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
                    this.phaseCooldown = 0;
                }
                break;
        }
    }

    /**
     * changes the type of attack being done
     * @param {*} phase the current phase
     */
    changePhase(phase) {
        let phases = this.phases;
        this.phase = phase;
        this.resetAnimationTimers(this.state);
        switch (phase) {
            case phases.no_attack:
                this.avoid = true;
                this.phaseCooldown = 5;
                this.state = this.states.idle1;
                break;
            case phases.fire_ring:
                this.avoid = false;
                this.phaseCooldown = 10;
                this.state = this.states.idleto2;
                this.fire = false;
                break;
        }
            
    }

    draw(ctx) {
        let TICK = this.game.clockTick;
        // visuals of being hit
        if (this.hit) {
            ctx.filter = "brightness(150000%)";
        }
        // telport visuals
        if (this.teleporting) {
            this.ctx.filter = "brightness(150000%)";
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
        }
        // nonteleporting visuals
        else {
            this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            this.tWidth = 80 * this.scale;
            this.tHeight = 80 * this.scale;
        }
        ctx.filter = "none";
    }

    

}
