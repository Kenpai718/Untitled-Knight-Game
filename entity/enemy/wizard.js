class Wizard extends AbstractEntity {
    constructor(game, x, y) {
        super(game, x, y);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/wizard.png");
        this.animations = [];
        this.loadAnimations();
        this.tick = 0;
        this.states = {
            idle1: 0, idleto2: 1, idle2: 2, idleto1: 3,
            stoptofly: 4, fly: 5, flytostop: 6, attack: 7, atoidle: 8, dead: 9
        };
        this.state = this.states.attack;
        this.directions = { right: 0, left: 1 };
        this.dir = this.directions.right;
        this.scale = 3;
        this.phase = Math.floor(Math.random() * 4);
        this.updateBoxes();
    }

    // use after any change to this.x or this.y
    updateBoxes() {
        this.lastBB = this.BB;
        this.getOffsets();
        this.AR = new BoundingBox(this.x + (40 * this.scale), this.y + this.offsetyBB, this.width - (80 * this.scale), this.heightBB);
        this.VB = new BoundingBox(this.x - (80 * this.scale), this.y, this.width + (160 * this.scale), this.height);
        this.BB = new BoundingBox(this.x + this.offsetxBB, this.y + this.offsetyBB, this.widthBB, this.heightBB);
    };

    getDamageValue() {

    }

    setDamagedState() {

    }

    getOffsets() {
        switch (this.state) {
            default: 
                this.offsetxBB = 0;
                this.offsetyBB = 0;
                this.widthBB = 80;
                this.heightBB = 80;
        }
    }

    loadAnimations() {
        for (let i = 0; i < 10; i++) {
            this.animations.push([]);
            for (let j = 0; j < 2; j++) {
                this.animations.push({});
            }
        }

        // idle
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 80, 80, 4, 0.15, 0, true, true, false);
        this.animations[1][0] = new Animator(this.spritesheet, 320, 160, 80, 80, 5, 0.15, 0, true, false, false);
        this.animations[2][0] = new Animator(this.spritesheet, 0, 160, 80, 80, 4, 0.15, 0, true, true, false);
        this.animations[3][0] = new Animator(this.spritesheet, 320, 160, 80, 80, 5, 0.15, 0, false, false, false);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 80, 80, 80, 4, 0.15, 0, false, true, false);
        this.animations[1][1] = new Animator(this.spritesheet, 80, 240, 80, 80, 5, 0.15, 0, false, false, false);
        this.animations[2][1] = new Animator(this.spritesheet, 480, 240, 80, 80, 4, 0.15, 0, false, true, false);
        this.animations[3][1] = new Animator(this.spritesheet, 80, 240, 80, 80, 5, 0.15, 0, true, false, false);

        // fly forward
        this.animations[4][0] = new Animator(this.spritesheet, 160, 320, 80, 80, 4, 0.15, 0, true, false, false);
        this.animations[5][0] = new Animator(this.spritesheet, 0, 320, 80, 80, 3, 0.15, 0, false, true, false);
        this.animations[6][0] = new Animator(this.spritesheet, 160, 320, 80, 80, 4, 0.15, 0, false, false, false);
        this.animations[4][1] = new Animator(this.spritesheet, 0, 400, 80, 80, 4, 0.15, 0, false, false, false);
        this.animations[5][1] = new Animator(this.spritesheet, 240, 400, 80, 80, 3, 0.15, 0, false, true, false);
        this.animations[6][1] = new Animator(this.spritesheet, 0, 400, 80, 80, 4, 0.15, 0, true, false, false);

        // attack
        this.animations[7][0] = new Animator(this.spritesheet, 0, 480, 80, 80, 9, 0.15, 0, true, false, false);
        this.animations[8][0] = new Animator(this.spritesheet, 320, 480, 80, 80, 4, 0.15, 0, false, false, false);
        this.animations[7][1] = new Animator(this.spritesheet, 0, 560, 80, 80, 9, 0.15, 0, false, false, false);
        this.animations[8][1] = new Animator(this.spritesheet, 0, 560, 80, 80, 4, 0.15, 0, true, false, false);

        // death
        this.animations[9][0] = new Animator(this.spritesheet, 0, 640, 80, 80, 10, 0.15, 0, true, false, false);
        this.animations[9][1] = new Animator(this.spritesheet, 0, 720, 80, 80, 10, 0.15, 0, false, false, false);
    }

    update() {
    }

    draw(ctx) {
        switch (this.phase) {
            case 0:
                this.state = this.states.idle1;
                break;
            case 1:
                this.state = this.states.stoptofly;
                break;
            case 2:
                this.state = this.states.attack;
                break;
            case 3:
                this.state= this.states.dead;
                break;
        }
        this.phase = -1;

        if (this.state < this.states.stoptofly)
            this.idle(ctx);
        else if (this.state < this.states.attack) 
            this.forward(ctx);
        else if (this.screen < this.states.dead)
            this.attack(ctx);
        else {
            this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[this.state][this.dir].isDone()) {
                this.animations[this.state][this.dir].elapsedTime = 0;
                this.phase = Math.floor(Math.random()*4);
            }
        }
    }

    // idle animation example
    idle(ctx) {
        this.tick += this.game.clockTick;
        if (this.state == this.states.idle1) {
            this.animations[0][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.tick > 4) {
                this.tick = 0;
                this.state = this.states.idleto2;
                this.animations[0][this.dir].elapsedTime = 0;
            }
        }
        if (this.state == this.states.idleto2) {
            this.animations[1][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[1][this.dir].isDone()) {
                this.state = this.states.idle2;
                this.tick = 0;
                this.animations[1][this.dir].elapsedTime = 0;
            }
        }
        if (this.state == this.states.idle2) {
            this.animations[2][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.tick > 4) {
                this.tick = 0;
                this.state = this.states.idleto1;
                this.animations[2][this.dir].elapsedTime = 0;
            }
        }
        if (this.state == this.states.idleto1) {
            this.animations[3][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[3][this.dir].isDone()) {
                this.state = this.states.idle1;
                this.tick = 0;
                this.phase = Math.floor(Math.random() * 4);
                this.animations[3][this.dir].elapsedTime = 0;
            }
        }
    }

    // flying forward animation example
    forward(ctx) {
        this.tick += this.game.clockTick;
        if (this.state == this.states.stoptofly) {
            this.animations[4][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[4][this.dir].isDone()) {
                this.state = this.states.fly;
                this.tick = 0;
                this.animations[4][this.dir].elapsedTime = 0;
            }
        }
        if (this.state == this.states.fly) {
            this.animations[5][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.tick > 4) {
                this.tick = 0;
                this.state = this.states.flytostop;
                this.animations[5][this.dir].elapsedTime = 0;
            }
        }
        if (this.state == this.states.flytostop) {
            this.animations[6][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[6][this.dir].isDone()) {
                this.state = this.states.idle1;
                this.tick = 0;
                this.animations[6][this.dir].elapsedTime = 0;
                this.phase = Math.floor(Math.random() * 4);
            }
        }
    }

    attack(ctx) {
        if (this.state == this.states.attack) {
            this.animations[7][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[7][this.dir].isDone()) {
                this.state = this.states.atoidle;
                this.animations[7][this.dir].elapsedTime = 0;
            }
        }
        if (this.state == this.states.atoidle) {
            this.animations[8][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.animations[8][this.dir].isDone()) {
                this.state = this.states.idle1;
                this.phase = Math.floor(Math.random() * 4);
                this.animations[8][this.dir].elapsedTime = 0;
            }
        }
    }

}