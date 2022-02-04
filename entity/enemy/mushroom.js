class Mushroom {
    constructor(game, x, y){
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png");
        this.animations = []; // [state][direction]
        this.states = {idle: 0, death: 1, damaged: 2, attack: 3, move: 4};
        this.directions = {left: 0, right: 1 };
        this.scale = 3.5;
        this.state = this.states.idle;
        this.direction = this.directions.left;
        this.width = 150 * this.scale;
        this.height = 150 * this.scale;
        this.HB = null;
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 1500;
        this.collisions = {left: false, right: false, top: false, bottom: false};
        this.loadAnimations();
        this.updateDaBoxes();
    };

    updateHB() {
        this.getOffsets();
        this.lastHB = this.HB;
        this.HB = new BoundingBox(this.x + (30 * this.scale), this.y + this.offsetyBB, this.width - (60 * this.scale), this.heightBB);
    };

    updateDaBoxes() {
        this.getOffsets();
        this.AR = new BoundingBox(this.x + (30 * this.scale), this.y + this.offsetyBB, this.width - (60 * this.scale), this.heightBB);
        this.VB = new BoundingBox(this.x - (50 * this.scale), this.y, this.width + (100 * this.scale), this.height);
        this.BB = new BoundingBox(this.x + this.offsetxBB, this.y + this.offsetyBB, this.widthBB, this.heightBB);
    };

    getOffsets() {
        this.offsetxBB = 64 * this.scale;
        this.offsetyBB = 64 * this.scale;
        this.widthBB = 23 * this.scale;
        this.heightBB = 37 * this.scale;
    }

    loadAnimations() {
        let numDir = 2;
        let numStates = 5;
        for (var i = 0; i < numStates; i++) {
            this.animations.push([]);
            for (var j = 0; j < numDir; j++){
                this.animations[i].push([]);
            }
        }
        // Animations  [state][direction]

        // Idle Animation
        this.animations[this.states.idle][0] = new Animator(this.spritesheet, 0, 0, 150, 150, 4, 0.2, 0, true, true, false);
        this.animations[this.states.idle][1] = new Animator(this.spritesheet, 600, 0, 150, 150, 4, 0.2, 0, false, true, false);
        // Death
        this.animations[this.states.death][0] = new Animator(this.spritesheet, 0, 150, 150, 150, 4, 0.4, 0, true, true, false);
        this.animations[this.states.death][1] = new Animator(this.spritesheet, 600, 150, 150, 150, 4, 0.4, 0, false, true, false);
        //hurt
        this.animations[this.states.damaged][0] = new Animator(this.spritesheet, 0, 300, 150, 150, 4, 0.2, 0, true, true, false);
        this.animations[this.states.damaged][1] = new Animator(this.spritesheet, 600, 300, 150, 150, 4, 0.2, 0, false, true, false);
        //attack
        this.animations[this.states.attack][0] = new Animator(this.spritesheet, 0, 600, 150, 150, 8, 0.1, 0, true, true, false);
        this.animations[this.states.attack][1] = new Animator(this.spritesheet, 0, 450, 150, 150, 8, 0.1, 0, false, true, false);
        // walk
        this.animations[this.states.move][0] = new Animator(this.spritesheet, 0, 900, 150, 150, 8, 0.1, 0, true, true, false);
        this.animations[this.states.move][1] = new Animator(this.spritesheet, 0, 750, 150, 150, 8, 0.1, 0, false, true, false);
    };


    update() {
        const TICK = this.game.clockTick;
        const SCALER = 3;
        const MAX_WALK = 93.75 * SCALER;
        const ACC_WALK = 133.59375 * SCALER;
        const MAX_FALL = 270 * SCALER;

        this.velocity.y += this.fallAcc * TICK;
        if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
        this.updateDaBoxes();

        this.collisions = {left: false, right: false, top: false, bottom: false};
        let dist = { x : 0, y : 0};
        let that = this;
        let knightInSight = false;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (that.BB.top < entity.BB.top && that.BB.bottom > entity.BB.top) {
                    that.collisions.bottom = true;
                    dist.y = entity.BB.top - that.BB.bottom;
                }
                that.updateDaBoxes();
            }
            if (entity.BB && that.VB.collide(entity.BB) && entity instanceof Knight) {
                knightInSight = true;
                if (that.state != that.states.move) {
                    that.state = that.states.move;
                }
                that.direction = entity.BB.right < that.BB.left ? that.directions.left : that.directions.right;
            }
            if (entity.BB && that.AR.collide(entity.BB) && entity instanceof Knight) {
                if (that.state != that.states.attack) {
                    that.state = that.states.attack;
                    that.updateHB();
                }
                that.direction = entity.BB.right < that.BB.right ? that.directions.left : that.directions.right;
            }
        });
        this.y += dist.y;
        this.updateDaBoxes();
        if (this.collisions.bottom) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
            }
        }
        if (this.state != this.states.attack) {
            this.HB = null;
        }
        if (!knightInSight) {
            this.state = this.states.idle;
        }
    };

    draw(ctx) {
        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, this.scale);
        if (PARAMS.DEBUG) this.viewBoundingBox(ctx);
    };

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        ctx.strokeRect(this.VB.x - this.game.camera.x, this.VB.y, this.VB.width, this.VB.height);
        ctx.strokeRect(this.AR.x - this.game.camera.x, this.AR.y, this.AR.width, this.AR.height);
        ctx.strokeStyle = "Green";
        if (this.HB != null) ctx.strokeRect(this.HB.x - this.game.camera.x, this.HB.y, this.HB.width, this.HB.height);
    };

};
