class Mushroom {

    constructor(game, x, y, direction){
        
        Object.assign(this, {game, x, y, direction});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png");
        this.animations = []; // [state][direction]
        this.tick = 0;
        this.scale = 3.5;//3.5

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4};
        this.directions = {left: 0, right: 1 };

        this.loadAnimations();

    };

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x + 1 * this.scale, this.y - 10 * this.scale , 21 * this.scale, 36 * this.scale);
        // This is Bounding Box, leaving alone for now
        ctx.strokeStyle = "Orange";
        //if (this.HB != null)
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };

    loadAnimations() {

        let numDir = 2;
        let numStates = 5;
        for (var i = 0; i < numStates; i++) { //defines action
            this.animations.push([]);
            for (var j = 0; j < numDir; j++){ //defines directon: left = 0, right = 1
                this.animations[i].push([]);
            }
        }

        // Animations  [state][direction]

        // Idle Animation
        this.animations[0][0] = new Animator(this.spritesheet, 513, 64, 23, 37, 4, 0.4, -173, 0, 1, 0);//0.4
        this.animations[0][1] = new Animator(this.spritesheet, 664, 64, 23, 37, 4, 0.4, 127, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 513, 358, 43, 43, 4, 0.1, -193, 0, 1, 0);//0.1
        this.animations[1][1] = new Animator(this.spritesheet, 644, 358, 43, 43, 4, 0.1, 107, 0, 1, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 508, 214, 28, 37, 4, 0.1, -178, 0, 1, 0);//0.4
        this.animations[2][1] = new Animator(this.spritesheet, 664, 214, 28, 37, 4, 0.1, 122, 0, 1, 0);

        // Attack Animations
        this.animations[3][0] = new Animator(this.spritesheet, 1085, 656, 64, 45, 8, 0.1, -214, 0, 1, 0);//0.1
        this.animations[3][1] = new Animator(this.spritesheet, 51, 506, 64, 50, 8, 0.1, 86, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1112, 962, 27, 39, 8, 0.2, -177, 0, 1, 0);//0.2
        this.animations[4][1] = new Animator(this.spritesheet, 62, 812, 26, 39, 8, 0.2, 124, 0, 1, 0);
        
    };

    draw(ctx) {
        
        this.state = 0;
        this.direction = 0;

        switch(this.state) {
            case 0: // Idle
            if(this.direction == 1)
                    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-39, this.scale);
            else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-39, this.scale);
                break;
            case 1: // Damaged
            if(this.direction == 1)
                    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-70, this.y-21-39, this.scale);
            else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-21-39, this.scale);
                break;
            case 2: // Death
            if(this.direction == 1)
                    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-39, this.scale);
            else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-18, this.y-39, this.scale);
                break;
            case 3: // Attack
            if(this.direction == 1)
                    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-39, this.y-28-39, this.scale);
            else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-105, this.y-28-39, this.scale);
                break;
            case 4: // Move
            if(this.direction == 1)
                    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-7, this.y-5-39, this.scale);
            else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-4, this.y-5-39, this.scale);
                break;
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };

    update() {

    };

};