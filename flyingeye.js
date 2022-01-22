class FlyingEye {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/flyingeye.png");
        this.animations = [];
        this.loadAnimations();
        this.states = {idle: 0, attack1: 1, attack2: 2, attack3: 3, hit: 4, dead: 5};
        this.directions = {right: 0, left: 1};
        this.state = this.states.idle;
        this.dir = this.directions.right;
        this.phase = Math.floor(Math.random() * 6);
        this.elapsedTime = 0;
        this.projectile = false;
        this.scale = 2;
    }

    loadAnimations() {
        for (let i = 0; i < 6; i++) {
            this.animations.push([]);
            for(let j = 0; j < 2; j++) {
                this.animations.push([]);
            }
        }

        // idle
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 150, 150, 8, 0.15, 0, false, true, false);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 150, 150, 150, 8, 0.15, 0, true, true, false);

        // attack 1
        this.animations[1][0] = new Animator(this.spritesheet, 0, 300, 150, 150, 8, 0.15, 0, false, false, false);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 450, 150, 150, 8, 0.15, 0, true, false, false);

        // attack 2
        this.animations[2][0] = new Animator(this.spritesheet, 0, 600, 150, 150, 8, 0.15, 0, false, false, false);
        this.animations[2][1] = new Animator(this.spritesheet, 0, 750, 150, 150, 8, 0.15, 0, true, false, false);

        // attack 3
        this.animations[3][0] = new Animator(this.spritesheet, 0, 900, 150, 150, 6, 0.15, 0, false, false, false);
        this.animations[3][1] = new Animator(this.spritesheet, 0, 1050, 150, 150, 6, 0.15, 0, true, false, false);

        // get hit
        this.animations[4][0] = new Animator(this.spritesheet, 0, 1200, 150, 150, 4, 0.15, 0, false, false, false);
        this.animations[4][1] = new Animator(this.spritesheet, 0, 1350, 150, 150, 4, 0.15, 0, true, false, false);

        // dead
        this.animations[5][0] = new Animator(this.spritesheet, 0, 1500, 150, 150, 4, 0.15, 0, false, false, false);
        this.animations[5][1] = new Animator(this.spritesheet, 0, 1650, 150, 150, 4, 0.15, 0, true, false, false);

    }

    update() {

    }

    draw(ctx) {
        switch (this.phase) {
            case 0:
                this.state = this.states.idle;
                break;
            case 1:
                this.state = this.states.attack1;
                break;
            case 2:
                this.state = this.states.attack2;
                break;
            case 3:
                this.state = this.states.attack3;
                break;
            case 4:
                this.state = this.states.hit;
                break;
            case 5:
                this.state = this.states.dead;
                break;
        }
        this.phase = -1;
        this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        if (this.state == this.states.idle) {
            this.elapsedTime += this.game.clockTick;
            if (this.elapsedTime >= 4) {
                this.elapsedTime = 0;
                this.animations[this.state][this.dir].elapsedTime = this.elapsedTime = 0;
                this.phase = Math.floor(Math.random() * 6);
                this.projectile = false;
            }
        }
        else if (this.state == this.states.attack3) {
            if (this.animations[this.state][this.dir].currentFrame() == 3 && !this.projectile) {
                if (this.dir == this.directions.right)
                    this.game.addEntity(new FlyingEyeProjectile(this.game, this.x+ 70*this.scale, this.y + 53 * this.scale, this.dir, this.scale));
                else
                    this.game.addEntity(new FlyingEyeProjectile(this.game, this.x+ 32*this.scale, this.y + 53 * this.scale, this.dir, this.scale));
                this.projectile = true;
            }
            if (this.animations[this.state][this.dir].isDone()) {
                this.animations[this.state][this.dir].elapsedTime = this.elapsedTime = 0;
                this.phase = Math.floor(Math.random() * 6);
                this.projectile = false;
            }
        }
        else if (this.state <= this.states.dead) {
            if (this.animations[this.state][this.dir].isDone()) {
                this.animations[this.state][this.dir].elapsedTime = this.elapsedTime = 0;
                this.phase = Math.floor(Math.random() * 6);
                this.projectile = false;
            }
            
        }
    }
}
class FlyingEyeProjectile {
    constructor(game, x, y, dir, scale) {
        Object.assign(this, {game, x, y, dir, scale});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/flyingeye.png");
        this.animations = [];
        this.loadAnimations();

        this.states = {move: 0, destroy: 1};
        this.directions = {right:0, left:1};
        this.state = this.states.move;
        this.elapsedTime = 0;

    }

    loadAnimations() {
        for (let i = 0; i < 2; i++) {
            this.animations.push([]);
            for(let j = 0; j < 2; j++) {
                this.animations.push([]);
            }
        }

        this.animations[0][0] = new Animator(this.spritesheet, 384, 1800, 48, 48, 3, 0.15, 0, false, true, false);
        this.animations[0][1] = new Animator(this.spritesheet, 240, 1800, 48, 48, 3, 0.15, 0, true, true, false);

        this.animations[1][0] = new Animator(this.spritesheet, 528, 1800, 48, 48, 4, 0.15, 0, false, false, false);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 1800, 48, 48, 4, 0.15, 0, true, false, false);

    }

    update() {
        const speed = 2;
        if (this.state == this.states.move) {
            if (this.dir == this.directions.right) {
                this.x += speed;
            }
            else {
                this.x -= speed;
            }
        }
    }

    draw(ctx) {
        this.elapsedTime += this.game.clockTick;
        this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        if (this.state == this.states.move && this.elapsedTime >=2) {
            this.state = this.states.destroy;
        }
        else {
            if (this.animations[this.state][this.dir].isDone())
                this.removeFromWorld = true;
        }
    }
}