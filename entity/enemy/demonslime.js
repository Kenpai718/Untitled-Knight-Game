class DemonSlime extends AbstractBoss {
    constructor(game, x, y, guard) {
        super(game, x, y, guard, STATS.DEMON_SLIME.NAME, STATS.DEMON_SLIME.MAX_HP, STATS.DEMON_SLIME.WIDTH, STATS.DEMON_SLIME.HEIGHT, STATS.DEMON_SLIME.SCALE, STATS.DEMON_SLIME.PHYSICS);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/demon_slime.png");
        // states, direcetions and phases
        this.states = { slimeIdle: 0, slimeMove: 1, slimeDamaged: 2, slimeDie1: 3, slimeDie2: 4, demonSpawn: 5, demonIdle: 6, demonMove: 7, demonDamaged: 8, demonSlash: 9, demonJump: 10, demonBreath: 11, demonShoot: 12, death: 13, demonRebirth: 14 };
        this.directions = { left: 1, right: 0 };
        this.phases = { slime: 0, easy: 1, normal: 2, hard: 3, legendary: 4 };
        this.state = this.states.slimeIdle;
        this.direction = this.directions.right;
        this.phase = this.phases.slime;
        // variables to control behavior
        this.runAwayDirection = this.directions.left;
        this.currentAttack = null;
        this.canAttack = true;
        this.vulnerable = true;
        this.canBeHit = true;
        this.runAway = false;
        this.damagedCooldown = 0;
        this.attackCooldown = 0;
        this.attackMaxCooldown = 2.5;
        this.attackFrame = 0;
        this.stopBugFromHappening = false;

        this.hue = 0; //changed during legendary phase
        this.legendary_hue = -160; //super saiyan blue

        this.loadAnimations();
        this.updateBoxes();
        this.lastBB = this.BB;
        this.fallAcc = 500;
        this.projectileTick = 0;
        this.projectileSpawnTime = 0.5;
        this.projectileScale = 2;

        this.myLevelMusic = this.game.camera.myMusic; //save current level music once the boss music stars
        this.myBossMusic = MUSIC.SIGNORA;
    };


    /**
     * Spawn some weaker slimes
     */
    loadEvent() {
        let enemies = [];
        let x = randomInt(5) + 1; //spawn up to 5 slimes
        let spawnx = this.direction == this.directions.right ? this.BB.right : this.BB.left;
        let spawny = this.BB.top - (this.BB.top / 1.5);
        for (var i = 0; i < x; i++) {
            //let enemy = new FlyingEye(this.game, spawnx, spawny, true);
            let enemy = new Slime(this.game, spawnx, spawny, false);
            enemy.aggro = true;
            enemies.push(enemy);
        }
        this.event = new Event(this.game, [], [], enemies, true, false);
        this.game.addEntity(this.event);
    };

    getOffsets() {
        if (this.phase != this.phases.slime) {
            this.offsetX = 100 * this.scale;
            this.offsetY = 72 * this.scale;
            this.width = (STATS.DEMON_SLIME.WIDTH * this.scale) / 3.7;
            this.height = (STATS.DEMON_SLIME.HEIGHT * this.scale) / 1.845;
        } else {
            this.offsetX = 135 * this.scale;
            this.offsetY = 135 * this.scale;
            this.width = 25 * this.scale;
            this.height = 25 * this.scale;
        }
    };

    updateHB() {
        this.getOffsets();
        if (this.phase != this.phases.slime) {
            if (this.direction == this.directions.left && this.state == this.states.demonSlash) this.HB = new BoundingBox(this.x + this.offsetX - (85 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
            else if (this.direction == this.directions.right && this.state == this.states.demonSlash) this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
            else if (this.state == this.states.demonRebirth) this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.width, this.BB.height);
            else if (this.state == this.states.demonJump) this.HB = new BoundingBox(this.x + this.offsetX - (75 * this.scale), this.y + this.offsetY, this.width + (150 * this.scale), this.height);
            else if (this.direction == this.directions.left && this.state == this.states.demonBreath) this.HB = new BoundingBox(this.x + this.offsetX - (90 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (90 * this.scale)), this.height);
            else if (this.direction == this.directions.right && this.state == this.states.demonBreath) this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (90 * this.scale)), this.height);
            else if (this.direction == this.directions.left && this.state == this.states.demonShoot) this.HB = new BoundingBox(this.x + this.offsetX - (100 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (100 * this.scale)), this.height);
            else if (this.direction == this.directions.right && this.state == this.states.demonShoot) this.HB = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (100 * this.scale)), this.height);
        } else {
            this.HB = new BoundingBox(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }

    updateBoxes() {
        this.lastBB = this.BB;
        this.getOffsets();
        if (this.phase != this.phases.slime) {
            this.VB = new BoundingBox(this.x + this.offsetX - (500 * this.scale), this.y + this.offsetY, this.width + (1000 * this.scale), this.height);
            this.BB = new BoundingBox(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
            if (this.direction == this.directions.left) {
                this.AR1 = new BoundingBox(this.x + this.offsetX - (40 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (40 * this.scale)), this.height);
                this.AR2 = new BoundingBox(this.x + this.offsetX - (85 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
                this.AR3 = new BoundingBox(this.x + this.offsetX - (300 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (300 * this.scale)), this.height);
            } else {
                this.AR1 = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (40 * this.scale)), this.height);
                this.AR2 = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (85 * this.scale)), this.height);
                this.AR3 = new BoundingBox(this.BB.left, this.BB.top, this.BB.right - (this.x + this.offsetX - (300 * this.scale)), this.height);
            }
        } else {
            this.VB = new BoundingBox(this.x + this.offsetX - (150 * this.scale), this.y + this.offsetY - this.height, this.width + (300 * this.scale), this.height * 2);
            this.BB = new BoundingBox(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
            if (this.direction == this.directions.left) this.AR1 = new BoundingBox(this.x + this.offsetX - (40 * this.scale), this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (40 * this.scale)), this.height);
            else this.AR1 = new BoundingBox(this.x + this.offsetX, this.y + this.offsetY, this.BB.right - (this.x + this.offsetX - (40 * this.scale)), this.height);
        }

    };

    drawDebug(ctx) {
        super.drawDebug(ctx);
        ctx.strokeStyle = "magenta";
        if (this.AR1) this.drawBB(ctx, this.AR1);
        ctx.strokeStyle = "cyan";
        if (this.AR2) this.drawBB(ctx, this.AR2);
        ctx.strokeStyle = "yellow";
        if (this.AR3) this.drawBB(ctx, this.AR3);
    }

    drawBB(ctx, BB) {
        ctx.strokeRect(BB.left - this.game.camera.x, BB.top - this.game.camera.y, BB.width, BB.height);
    }

    loadAnimations() {
        this.animations = [];
        for (var i = 0; i < 15; i++) {
            this.animations.push([]);
            for (var j = 0; j < 2; j++) {
                this.animations[i].push([]);
            }
        }
        this.animations[this.states.slimeIdle][this.directions.left] = new Animator(this.spritesheet, 0, 1600, 288, 160, 6, 0.1, 0, false, true, false);
        this.animations[this.states.slimeIdle][this.directions.right] = new Animator(this.spritesheet, 4608, 3040, 288, 160, 6, 0.1, 0, true, true, false);

        this.animations[this.states.slimeMove][this.directions.left] = new Animator(this.spritesheet, 0, 1760, 288, 160, 8, 0.1, 0, false, true, false);
        this.animations[this.states.slimeMove][this.directions.right] = new Animator(this.spritesheet, 4032, 3200, 288, 160, 8, 0.1, 0, true, true, false);

        this.animations[this.states.slimeDamaged][this.directions.left] = new Animator(this.spritesheet, 0, 1920, 288, 160, 6, 0.1, 0, false, false, false);
        this.animations[this.states.slimeDamaged][this.directions.right] = new Animator(this.spritesheet, 4608, 3360, 288, 160, 6, 0.1, 0, true, false, false);

        this.animations[this.states.slimeDie1][this.directions.left] = new Animator(this.spritesheet, 0, 2080, 288, 160, 9, 0.1, 0, false, false, false);
        this.animations[this.states.slimeDie1][this.directions.right] = new Animator(this.spritesheet, 3744, 3520, 288, 160, 9, 0.1, 0, true, false, false);

        this.animations[this.states.slimeDie2][this.directions.left] = new Animator(this.spritesheet, 0, 2240, 288, 160, 4, 0.1, 0, false, false, false);
        this.animations[this.states.slimeDie2][this.directions.right] = new Animator(this.spritesheet, 5184, 3680, 288, 160, 4, 0.1, 0, true, false, false);

        this.animations[this.states.demonSpawn][this.directions.left] = new Animator(this.spritesheet, 0, 2400, 288, 160, 19, 0.15, 0, false, false, false);
        this.animations[this.states.demonSpawn][this.directions.right] = new Animator(this.spritesheet, 864, 3840, 288, 160, 19, 0.15, 0, true, false, false);

        this.animations[this.states.demonIdle][this.directions.left] = new Animator(this.spritesheet, 0, 0, 288, 160, 6, 0.1, 0, false, true, false);
        this.animations[this.states.demonIdle][this.directions.right] = new Animator(this.spritesheet, 4608, 800, 288, 160, 6, 0.1, 0, true, true, false);

        this.animations[this.states.demonMove][this.directions.left] = new Animator(this.spritesheet, 0, 160, 288, 160, 12, 0.1, 0, false, true, false);
        this.animations[this.states.demonMove][this.directions.right] = new Animator(this.spritesheet, 2880, 960, 288, 160, 12, 0.1, 0, true, true, false);

        this.animations[this.states.demonDamaged][this.directions.left] = new Animator(this.spritesheet, 0, 480, 288, 160, 5, 0.09, 0, false, false, false);
        this.animations[this.states.demonDamaged][this.directions.right] = new Animator(this.spritesheet, 4896, 1280, 288, 160, 5, 0.09, 0, true, false, false);

        this.animations[this.states.demonSlash][this.directions.left] = new Animator(this.spritesheet, 0, 320, 288, 160, 15, 0.1, 0, false, false, false);
        this.animations[this.states.demonSlash][this.directions.right] = new Animator(this.spritesheet, 2016, 1120, 288, 160, 15, 0.1, 0, true, false, false);

        this.animations[this.states.demonJump][this.directions.left] = new Animator(this.spritesheet, 0, 2560, 288, 160, 18, 0.1, 0, false, false, false);
        this.animations[this.states.demonJump][this.directions.right] = new Animator(this.spritesheet, 1152, 4000, 288, 160, 18, 0.1, 0, true, false, false);

        this.animations[this.states.demonBreath][this.directions.left] = new Animator(this.spritesheet, 0, 2720, 288, 160, 21, 0.1, 0, false, false, false);
        this.animations[this.states.demonBreath][this.directions.right] = new Animator(this.spritesheet, 288, 4160, 288, 160, 21, 0.1, 0, true, false, false);

        this.animations[this.states.demonShoot][this.directions.left] = new Animator(this.spritesheet, 0, 2880, 288, 160, 18, 0.1, 0, false, true, false);
        this.animations[this.states.demonShoot][this.directions.right] = new Animator(this.spritesheet, 1152, 4320, 288, 160, 18, 0.1, 0, true, true, false);

        this.animations[this.states.death][this.directions.left] = new Animator(this.spritesheet, 0, 640, 288, 160, 22, 0.07, 0, false, false, false);
        this.animations[this.states.death][this.directions.right] = new Animator(this.spritesheet, 0, 1440, 288, 160, 22, 0.07, 0, true, false, false);

        this.animations[this.states.demonRebirth][this.directions.left] = new Animator(this.spritesheet, 0, 640, 288, 160, 22, 0.07, 0, true, false, false);
        this.animations[this.states.demonRebirth][this.directions.right] = new Animator(this.spritesheet, 0, 1440, 288, 160, 22, 0.07, 0, false, false, false);
    };

    /**
     * Stop the current level music and play boss music
     */
    cueBossMusic() {
        MUSIC_MANAGER.pauseBackgroundMusic(); //stop the background music for you know what :)
        MUSIC_MANAGER.autoRepeat(this.myBossMusic); //OH LAWD HE COMIN
        MUSIC_MANAGER.playAsset(this.myBossMusic);  //...why do I hear boss music?
    }

    /**
     * Stop whatever background music is playing and replay the level music
     */
    resetLevelMusic() {
        MUSIC_MANAGER.pauseBackgroundMusic();
        MUSIC_MANAGER.autoRepeat(this.myLevelMusic);
        MUSIC_MANAGER.playAsset(this.myLevelMusic);
    }

    update() {
        const TICK = this.game.clockTick;
        if (this.dead && this.phase != this.phases.slime) {
            super.setDead();
            if (this.animations[this.state][this.direction].isDone()) {
                this.resetLevelMusic();
            }
        } else if (this.hp <= (this.max_hp / 10) * 2 && this.phase == this.phases.slime || this.state == this.states.demonSpawn) { // transition from slime to demon
            this.dead = false;
            if (this.animations[this.states.demonSpawn][this.direction].isDone()) {
                this.state = this.states.demonIdle;
                this.phase = this.phases.easy;
                this.max_hp *= 4;
                super.healSelf(this.max_hp - this.hp);
                this.vulnerable = true;
                this.canBeHit = true;
            } else if (this.animations[this.states.slimeDie2][this.direction].isDone()) {
                this.state = this.states.demonSpawn;
                this.regen();
            } else if (this.animations[this.states.slimeDie1][this.direction].isDone()) {
                this.state = this.states.slimeDie2;
                this.cueBossMusic();
                this.activeBoss = true;
                this.hp = 0;
            } else {
                this.velocity.x = 0;
                this.state = this.states.slimeDie1;
                this.hp = 0;
            }
        } else {
            if (this.phase != this.phases.slime && this.phase != this.phases.legendary) { // determine phase by health
                if (this.hp < (this.max_hp / 7.5) * 1) { //at 25% hp it transforms
                    this.phase = this.phases.legendary;
                    this.state = this.states.demonRebirth;
                    this.attackMaxCooldown = 1.3;
                    this.legend_hp_start = this.hp; //previous hp used to calculate heal amount to half hp
                    this.legendary_healed = false;  //boolean to control if healed to half yet
                } else if (this.hp < (this.max_hp / 10) * 5) {
                    this.phase = this.phases.hard;
                    this.attackMaxCooldown = 1.7;
                } else if (this.hp < (this.max_hp / 10) * 9) {
                    this.phase = this.phases.normal;
                    this.attackMaxCooldown = 2.2;
                }
            } else if (this.phase == this.phases.legendary && this.animations[this.states.demonRebirth][this.direction].isDone()) {
                this.state = this.states.demonIdle;
            }
            this.velocity.y += 1500 * TICK;
            if (this.velocity.y >= this.myMaxFall) this.velocity.y = this.myMaxFall;
            if (this.velocity.y <= -this.myMaxFall) this.velocity.y = -this.myMaxFall;
            if (this.velocity.x >= this.myMaxSpeed) this.velocity.x = this.myMaxSpeed;
            if (this.velocity.x <= -this.myMaxSpeed) this.velocity.x = -this.myMaxSpeed;
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            let dist = { x: 0, y: 0 }; // the displacement needed between entities
            dist = super.checkEnvironmentCollisions(dist); // check if colliding with environment and adjust entity accordingly
            this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
            this.checkEntityInteractions(); // handles phase behavior
            this.checkCooldowns(TICK); //check and reset the cooldowns of its actions
            this.checkHB(); // handle hitbox timing for each attack
            this.setIdleAction(); // set what the demonslime does when no ones around
            super.setAggro(this.playerInSight); // aggro gui
            super.updateVelocity(); // update velocity based on collisions
            super.checkInDeathZone(); // die if out of map
        }
        this.animations[this.state][this.direction].update(TICK);

        /*
        * LEGENDARY PHASE SPECIAL STUFF
        * color change while in legendary phase and also heals self to half hp
        * change the hue over time note; -180 = blue and -22 = hot red
        */
        if (this.phase == this.phases.legendary) {
            //transition hue to the blue phase
            if (this.hue > this.legendary_hue && !this.dead) {
                this.hue--;
                //regenerate hp to half while transforming
                if (this.hp < (this.max_hp / 2)) {
                    this.regen();
                }
            }

            //once in blue phase show the healing score
            if (this.hue == this.legendary_hue && !this.legendary_healed) {
                if (this.hp < (this.max_hp / 2)) this.hp = Math.round((this.max_hp / 2));
                this.legendary_healed = true;
                ASSET_MANAGER.playAsset(SFX.HEAL);
                console.log((this.max_hp / 2) - this.legend_hp_start);
                this.game.addEntityToFront(new Score(this.game, this, (this.max_hp / 2) - this.legend_hp_start, PARAMS.HEAL_ID, false));
            }

            //dead revert to previous hue over time
            if (this.hue < 0 && this.dead) {
                if (this.hue < 0) {
                    this.hue++;
                }
            }
        }
    };

    draw(ctx) {
        if (this.dead) {
            if (this.phase == this.phases.legendary) {
                ctx.filter = "hue-rotate(" + this.hue + "deg)";
                super.drawWithFadeOut(ctx, this.animations[this.state][this.direction]);
                ctx.filter = "none"
            } else {
                super.drawWithFadeOut(ctx, this.animations[this.state][this.direction]);
            }

        } else {
            //if legendary draw it as a different color
            if (this.phase == this.phases.legendary) {
                ctx.filter = "hue-rotate(" + this.hue + "deg)";
                this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
                ctx.filter = "none"
            }
            else this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        }
    };

    setIdleAction() {
        if (!this.playerInSight && !this.aggro) {
            this.state = this.phase == this.phases.slime ? this.states.slimeIdle : this.states.demonIdle;
            this.velocity.x = 0;
        }
    };

    checkHB() {
        if (this.isAttacking()) {
            this.attackFrame = this.animations[this.state][this.direction].currentFrame();
            if (this.state == this.states.slimeMove) {
                if (this.attackFrame >= 3 && this.attackFrame <= 5) this.updateHB();
            } else if (this.state == this.states.demonJump) {
                if (this.attackFrame >= 12 && this.attackFrame <= 15) this.updateHB();
            } else if (this.state == this.states.demonSlash) {
                if (this.attackFrame >= 10 && this.attackFrame <= 12) this.updateHB();
            } else if (this.state == this.states.demonBreath) {
                if (this.attackFrame >= 6 && this.attackFrame <= 16) this.updateHB();
            } else if (this.state == this.states.demonRebirth) {
                if (this.attackFrame >= 13 && this.attackFrame <= 20) this.updateHB();
            } else if (this.state == this.states.demonSpawn || this.state == this.states.demonShoot) {
                this.updateHB();
            }
        } else {
            this.HB = null;
        }
    };

    //rising hp healthbar as it heals
    regen() {
        if (this.hp < this.max_hp) {
            this.hp += 2;
            if (this.hp > this.max_hp) this.hp = this.max_hp;
        }
    }

    isAttacking() {
        return (this.state == this.states.slimeMove || this.state == this.states.demonSpawn || this.state == this.states.demonSlash || this.state == this.states.demonBreath || this.state == this.states.demonShoot || this.state == this.states.demonJump || this.state == this.states.demonRebirth);
    };

    checkEntityInteractions() {
        this.playerInSight = false;
        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {
                // set damaged state if hit
                if (entity.HB && self.BB.collide(entity.HB)) {
                    self.setDamagedState();
                }
                // handles attacks based on current phase
                if (entity.BB && self.canBeHit && self.phase != self.phases.slime) {
                    if (self.phase == self.phases.easy && self.AR1.collide(entity.BB)) {
                        self.velocity.x = 0;
                        if (self.canAttack || (self.currentAttack && !self.animations[self.currentAttack][self.direction].isDone())) {
                            self.canAttack = false;
                            self.runAway = true;
                            self.state = self.currentAttack ? self.currentAttack : self.states.demonSlash;
                            self.currentAttack = self.state;
                        }
                    } else if (self.phase == self.phases.normal && self.AR2.collide(entity.BB)) {
                        self.velocity.x = 0;
                        if (self.canAttack || (self.currentAttack && !self.animations[self.currentAttack][self.direction].isDone())) {
                            self.canAttack = false;
                            self.runAway = true;
                            self.state = self.currentAttack ? self.currentAttack : randomInt(2) == 0 ? self.states.demonJump : self.states.demonBreath;
                            self.currentAttack = self.state;
                        }
                    } else if (self.phase == self.phases.hard && self.AR1.collide(entity.BB)) {
                        self.velocity.x = 0;
                        if (self.canAttack || (self.currentAttack && !self.animations[self.currentAttack][self.direction].isDone())) {
                            if (self.canAttack == true) self.resetAnimationTimers(self.states.demonRebirth);
                            self.canAttack = false;
                            self.runAway = true;
                            self.state = self.currentAttack ? self.currentAttack : self.states.demonSlash;
                            self.currentAttack = self.state;
                        }
                    } else if (self.phase == self.phases.legendary && self.AR3.collide(entity.BB)) {
                        self.velocity.x = 0;
                        if (self.canAttack || (self.currentAttack && !self.animations[self.currentAttack][self.direction].isDone())) {
                            if (self.canAttack == true) self.resetAnimationTimers(self.states.demonRebirth);
                            self.canAttack = false;
                            self.runAway = true;
                            //60% chance to attack demon jump or 40% demon shoot
                            self.state = self.currentAttack ? self.currentAttack : randomInt(11) <= 6 ? self.states.demonJump : self.states.demonShoot;

                            //self.state = self.states.demonShoot;;
                            if (self.state == self.states.demonShoot) {
                                self.checkDirection(entity);
                                self.shootProjectile();
                            }

                            self.currentAttack = self.state;

                        }
                    }
                }
                // handles movement based on phase
                if ((entity.BB && self.VB.collide(entity.BB)) || self.aggro) {
                    self.playerInSight = true;
                    self.aggro = true;
                    if (!self.AR1.collide(entity.BB) && self.canAttack && self.canBeHit) {
                        self.direction = entity.BB.left < self.BB.left ? self.directions.left : self.directions.right;
                        if (self.phase == self.phases.slime) {
                            self.state = self.states.slimeMove;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed / 12 : -self.myMaxSpeed / 12;
                        } else if (self.phase == self.phases.easy) {
                            self.state = self.states.demonMove;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed / 7.5 : -self.myMaxSpeed / 7.5;
                        } else if (self.phase == self.phases.normal) {
                            self.state = self.states.demonMove;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed / 6 : -self.myMaxSpeed / 6;
                        } else if (self.phase >= self.phases.hard) {
                            self.state = self.states.demonRebirth;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed / 3 : -self.myMaxSpeed / 3;

                            //prevent it from becoming a smooth criminal
                            //switch to walking state after the rebirth dash has finished
                            if (self.checkAnimationDone(self.state)) {
                                self.state = self.states.demonMove;
                            }
                        }
                    }
                }
            }
        });
    };

    /**
     * Checks position of player and checks direction to match
     * @param {*} player 
     */
    checkDirection(player) {
        if (player.BB.x > this.BB.x) this.direction = this.directions.right;
        else this.direction = this.directions.left;
    }

    /**
     * Fireball projectile
     */
    shootProjectile() {
        const TICK = this.game.clockTick;
        this.projectileTick += TICK;

        if (this.projectileTick > this.projectileSpawnTime) { //shoot a projectile every few seconds
            //console.log("slime projectile fired");
            this.projectileTick = 0;
            this.projectileSpawnTime = 0.5 + randomInt(2); //randomize the shooting interval from 0.5 to 1.5
            if (this.direction == this.directions.right)
                this.game.addEntity(new SlimeProjectile(this.game, this.BB.left + (this.width), this.BB.top - 10, this.direction, this.projectileScale, STATS.DEMON_SLIME.PROJECTILE));
            else
                this.game.addEntity(new SlimeProjectile(this.game, this.BB.left - (this.width), this.BB.top - 10, this.direction, this.projectileScale, STATS.DEMON_SLIME.PROJECTILE));
        }
    }

    checkCooldowns(TICK) {
        // handles cooldowns based on attacks
        if (!this.canAttack) {
            // handles movement for the jump attack
            if (this.state == this.states.demonJump) {
                this.attackFrame = this.animations[this.state][this.direction].currentFrame();
                if (this.attackFrame >= 6 && this.attackFrame <= 11) {
                    if (this.phase != this.phases.legendary) {
                        this.velocity.x = this.direction == this.directions.right ? this.myMaxSpeed / 3 : -this.myMaxSpeed / 3;
                    } else {
                        this.velocity.x = this.direction == this.directions.right ? this.myMaxSpeed : -this.myMaxSpeed;
                    }
                } else {
                    this.velocity.x = 0;
                }
            }
            // handles demon shoot attack
            if (!this.event && this.state == this.states.demonShoot) {
                this.loadEvent();
            } else if (this.event && this.event.finished) {
                this.state = this.states.demonIdle;
                this.attackCooldown += TICK;
            }
            // handles run away movement based on phase
            if (this.checkAnimationDone(this.currentAttack)) {
                // fixes bug where first player attack doesn't do damage
                if (!this.stopBugFromHappening) {
                    this.stopBugFromHappening = true;
                    this.vulnerable = true;
                    this.canBeHit = true;
                }
                if (this.phase < this.phases.hard && this.canBeHit) { // run away after attack
                    this.state = this.states.demonMove;
                    this.direction = this.runAwayDirection;
                    this.velocity.x = this.direction == this.directions.right ? this.myMaxSpeed / 7.5 : -this.myMaxSpeed / 7.5;
                    this.attackCooldown += TICK;
                } else if (this.phase < this.phases.hard) { // keep the timer going if hit while running away
                    this.attackCooldown += TICK;
                } else if (this.phase >= this.phases.hard) { // run away with rebirth attack if phase is hard
                    if (this.currentAttack != this.states.demonRebirth) {
                        this.state = this.states.demonRebirth;
                        this.direction = this.runAwayDirection;
                        this.velocity.x = this.direction == this.directions.right ? this.myMaxSpeed / 3 : -this.myMaxSpeed / 3;
                    }
                }
            }
            // handles behavior after rebirth run away
            if (this.checkAnimationDone(this.states.demonRebirth)) {
                this.state = this.states.demonIdle;
                this.direction = this.direction == this.directions.right ? this.directions.left : this.directions.right;
                this.velocity.x = 0;
                this.runAway = false;
                this.attackCooldown += TICK;
            }
            // resets everything once the cooldown is over
            if (this.attackCooldown >= this.attackMaxCooldown) {
                this.runAwayDirection = this.runAwayDirection == this.directions.left ? this.directions.right : this.directions.left;
                this.attackFrame = 0;
                this.attackCooldown = 0;
                this.canAttack = true;
                this.runAway = false;
                this.vulnerable = true;
                this.canBeHit = true;
                this.stopBugFromHappening = false;
                if (this.event) {
                    this.event = null;
                    this.hp -= 10;
                }
                this.resetAnimationTimers(this.currentAttack);
                this.resetAnimationTimers(this.states.demonRebirth);
                this.currentAttack = null;
            }
        }
        // handles damaged animation
        if (!this.canBeHit) {
            this.damagedCooldown += TICK;
            // only set damaged if in slime phase, idle, or moving
            if (this.state == this.states.demonIdle || this.state == this.states.demonMove || this.phase == this.phases.slime) {
                this.state = this.phase == this.phases.slime ? this.states.slimeDamaged : this.states.demonDamaged;
            }
            // once damaged animation is over, set animation to idle
            if ((this.checkAnimationDone(this.states.demonDamaged) || this.checkAnimationDone(this.states.slimeDamaged)) && !this.vulnerable) this.state = this.phase == this.phases.slime ? this.states.slimeIdle : this.states.demonIdle;
            // resets everything one the cooldown is over
            if (this.damagedCooldown >= 0.5) {
                this.resetAnimationTimers(this.states.slimeDamaged);
                this.resetAnimationTimers(this.states.demonDamaged);
                this.state = this.phase == this.phases.slime ? this.states.slimeIdle : this.states.demonIdle;
                this.damagedCooldown = 0;
                this.canBeHit = true;
                this.vulnerable = true;
            }
        }
    };

    resetAnimationTimers(action) {
        this.animations[action][this.directions.left].elapsedTime = 0;
        this.animations[action][this.directions.right].elapsedTime = 0;
    };

    checkAnimationDone(action) {
        return (this.animations[action][this.directions.left].isDone() || this.animations[action][this.directions.right].isDone());
    };

    setDamagedState() {
        if (this.canBeHit && (this.state == this.states.demonIdle || this.state == this.states.demonMove || this.state == this.states.demonShoot || this.phase == this.phases.slime)) {
            this.vulnerable = false;
            this.canBeHit = false;
            this.velocity.x = 0;
        }
    };

    getDamageValue() {
        var damage = 0;
        switch (this.state) {
            case this.states.demonShoot:
            case this.states.slimeMove:
                damage = 5;
                break;
            case this.states.demonSpawn:
            case this.states.demonRebirth:
                damage = 7;
                break;
            case this.states.demonSlash:
            case this.states.demonBreath:
                damage = 15;
                break;
            case this.states.demonJump:
                damage = 30;
                break;
        }
        return damage;
    };
};

class Slime extends DemonSlime {
    constructor(game, x, y, guard) {
        super(game, x, y, guard);

        //overiding demon slime behavior to be a basic slime
        this.max_hp = 30;
        this.hp = this.max_hp;
        this.name = "Slime";
        this.states.death = this.states.slimeDie1;
        this.width = PARAMS.BLOCKDIM;
        this.height = PARAMS.BLOCKDIM;

        this.projectileScale = 0.5;
        this.projectileTick = 0;
        this.projectileSpawnTime = 2; //projectile every 2 seconds
        this.projectileScale = 0.7;
    }

    update() {
        const TICK = this.game.clockTick;
        if (this.dead) {
            super.setDead();
        } else { // transition from slime to demon
            this.velocity.y += 1500 * TICK;
            if (this.velocity.y >= this.myMaxFall) this.velocity.y = this.myMaxFall;
            if (this.velocity.y <= -this.myMaxFall) this.velocity.y = -this.myMaxFall;
            if (this.velocity.x >= this.myMaxSpeed) this.velocity.x = this.myMaxSpeed;
            if (this.velocity.x <= -this.myMaxSpeed) this.velocity.x = -this.myMaxSpeed;
            this.x += this.velocity.x * TICK;
            this.y += this.velocity.y * TICK;
            this.updateBoxes();

            let dist = { x: 0, y: 0 }; // the displacement needed between entities
            dist = super.checkEnvironmentCollisions(dist); // check if colliding with environment and adjust entity accordingly
            this.updatePositionAndVelocity(dist); //set where entity is based on interactions/collisions put on dist
            this.checkEntityInteractions(); // handles phase behavior
            this.checkCooldowns(TICK); //check and reset the cooldowns of its actions
            this.checkHB(); // handle hitbox timing for each attack
            this.setIdleAction(); // set what the demonslime does when no ones around
            super.setAggro(this.playerInSight); // aggro gui
            super.updateVelocity(); // update velocity based on collisions
            super.checkInDeathZone(); // die if out of map
        }
        this.animations[this.state][this.direction].update(TICK);

    };

    checkEntityInteractions() {
        this.playerInSight = false;
        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {
                // set damaged state if hit
                if (entity.HB && self.BB.collide(entity.HB)) {
                    self.setDamagedState();
                }
                // handles movement based on phase
                if ((entity.BB && self.VB.collide(entity.BB)) || self.aggro) {
                    self.playerInSight = true;
                    self.aggro = true;
                    if (!self.AR1.collide(entity.BB) && self.canAttack && self.canBeHit) {
                        self.direction = entity.BB.left < self.BB.left ? self.directions.left : self.directions.right;
                        //player not in range move towards player
                        if (self.phase == self.phases.slime) {
                            self.state = self.states.slimeMove;
                            self.velocity.x = self.direction == self.directions.right ? self.myMaxSpeed / 12 : -self.myMaxSpeed / 12;

                            //shoot a projectile when not in range
                            self.shootProjectile();
                        }
                    }
                }
            }
        });
    };

    /**
 * Fireball projectile
 */
    shootProjectile() {
        const TICK = this.game.clockTick;
        this.projectileTick += TICK;

        if (this.projectileTick > this.projectileSpawnTime) { //shoot a projectile every few seconds
            console.log("slime projectile fired");
            this.projectileTick = 0;
            this.projectileSpawnTime = 2 + randomInt(4); //randomize the shooting interval from 2 to 5s
            if (this.direction == this.directions.right)
                this.game.addEntity(new SlimeProjectile(this.game, this.BB.left + (this.width), this.BB.top - 10, this.direction, this.projectileScale, STATS.SLIME.PROJECTILE));
            else
                this.game.addEntity(new SlimeProjectile(this.game, this.BB.left - (this.width), this.BB.top - 10, this.direction, this.projectileScale, STATS.SLIME.PROJECTILE));
        }
    }


}