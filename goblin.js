class Goblin {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");
        this.animations = []; // [state][direction]
        this.tick = 0;
        this.scale = 2.5;//2.5 - regular size
        this.width = 33 * this.scale;
        this.height = 36 * this.scale;
        this.alert = false; // enemy is near or got hit


        this.state = 0;
        this.direction = 0;
        this.seconds = 0;
        this.doRandom = 0;
        
        this.HB = 1;
        this.updateBB();

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4, run: 5};
        this.directions = {left: 0, right: 1 };

        //physics
        this.groundLevel = 777; //temporary until a real ground is implemented

        this.loadAnimations();
    };

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x + 4 * this.scale,
            this.y + 2 * this.scale,
            19 * this.scale, 34 * this.scale);
        // This is Bounding Box, leaving alone for now
        ctx.strokeStyle = "Orange";
        if (this.HB != null) ctx.strokeRect(this.x, this.y, this.width, this.height);
    };


    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() { // physics

        this.seconds += this.game.clockTick;
        
        //Do something random if 'not hit' and player isnt in sight 
        if(!this.alert){
            if(this.seconds >= this.doRandom){
                this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                this.direction = Math.floor(Math.random() * 2);
                this.action = Math.floor(Math.random() * 6);
                if(this.action <= 1) {
                    this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                    this.state = 4;
                }
                else {
                    this.state = 0;
                }
            }
        }
        else if (this.alert) {

        }
        

        if(this.state == 4){
            if(this.direction == 0)     this.x += -1;//-1
            else                        this.x += 1;//1
        }
        if(this.state == 5){
            if(this.direction == 0)     this.x += -2.5;//-2.5
            else                        this.x += 2.5;//2.5
        }
        
    };

    loadAnimations() {

        let numDir = 2;
        let numStates = 6;
        for (var i = 0; i < numStates; i++) { //defines action
            this.animations.push([]);
            for (var j = 0; j < numDir; j++){ //defines directon: left = 0, right = 1
                this.animations[i].push([]);
            }
        }

        // Animations  [state][direction]

        // Idle Animation
        this.animations[0][0] = new Animator(this.spritesheet, 509, 65, 33, 36, 4, 0.14, -183, 0, 1, 0); //0.14 Animation Speed (changed to 1 for now)
        this.animations[0][1] = new Animator(this.spritesheet, 658, 65, 33, 36, 4, 0.14, 117, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 504, 364, 42, 37, 4, 0.12, -192, 0, 0, 0); //0.12 Animation Speed
        this.animations[1][1] = new Animator(this.spritesheet, 654, 364, 42, 37, 4, 0.12, 108, 0, 0, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 491, 212, 74, 39, 4, 0.1, -230, 0, 0, 0); // 0.1 Animation Speed
        this.animations[2][1] = new Animator(this.spritesheet, 640, 212, 74, 39, 4, 0.1, 82, 0, 0, 0);

        // Attack Animation
        this.animations[3][0] = new Animator(this.spritesheet, 1081, 655, 88, 46, 8, 0.06, -238, 0, 1, 0); //0.06 Animation Speed
        this.animations[3][1] = new Animator(this.spritesheet, 31, 505, 88, 46, 8, 0.06, 62, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.2, -188, 0, 1, 0); //0.1 Animation Speed
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.2, 112, 0, 1, 0);

        // Move Animation
        this.animations[5][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0); //0.1 Animation Speed
        this.animations[5][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

    };



    draw(ctx) {

        switch(this.state) { // Prefecting Refections... Might just remove anyways.
            case 0: // Idle
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x -16, this.y, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case 1: // Damaged
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 25, this.y -2, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 13, this.y -2, this.scale);
                break;
            case 2: // Death
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-50, this.y-4, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-40, this.y-4, this.scale);
                break;
            case 3: // Attack
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-83, this.y-25, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-70, this.y-25, this.scale);
                break;
            case 4: // Move
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-20, this.y-5, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
                break;
            case 5: // Run
            if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-20, this.y-5, this.scale);
            else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
            break;
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };

};