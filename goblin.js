class Goblin {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");
        this.animations = []; // [state][direction]
        this.HB_Offsetx = []; // Offsets for Hitbox
        this.HB_Offsety = []; // Offsets for Hitbox
        this.tick = 0;
        this.scale = 2.5;//2.5 - regular size
        this.width = 33 * this.scale;
        this.height = 36 * this.scale;

        this.HB = 1;
        this.updateBB();

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4};
        this.directions = {left: 0, right: 1 };

        //testing goblin animations - sceneManager
        this.test = new Skeleton(this.game, 400, 927)
        this.game.addEntity(this.test);

        this.loadAnimations();
        this.loadHB_Offset();

    };

    viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x + this.HB_Offsetx[this.state][this.direction],
            this.y + this.HB_Offsety[this.state][this.direction],
            19 * this.scale, 34 * this.scale);
        // This is Bounding Box, leaving alone for now
        ctx.strokeStyle = "Orange";
        if (this.HB != null) ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
    
    loadHB_Offset() { // Probably will remove in for constant hixbox. Right now seems all this is now not needed

        // Creates HB offset 
        let numDir = 2;
        let numStates = 5;
        for (var i = 0; i < numStates; i++) { //defines action
            this.HB_Offsetx.push([]);
            this.HB_Offsety.push([]);
            for (var j = 0; j < numDir; j++){ //defines directon: left = 0, right = 1
                this.HB_Offsetx[i].push([]);
                this.HB_Offsety[i].push([]);
            }
        }

        // Forgeting to remove this line caused me to debug my life away for a good 30 mins ;-;
        // Not to self, dont be dumb
        //this.HB_Offset[this.state][this.direction];

        // Idle Animation
        this.HB_Offsetx[0][0] = 4 * this.scale;
        this.HB_Offsety[0][0] = 2 * this.scale;
        this.HB_Offsetx[0][1] = 4 * this.scale;
        this.HB_Offsety[0][1] = 2 * this.scale;

        // Damaged Animation
        this.HB_Offsetx[1][0] = 4 * this.scale;
        this.HB_Offsety[1][0] = 2 * this.scale;
        this.HB_Offsetx[1][1] = 4 * this.scale;
        this.HB_Offsety[1][1] = 2 * this.scale;

        // Death Animation
        this.HB_Offsetx[2][0] = 4 * this.scale;
        this.HB_Offsety[2][0] = 2 * this.scale;
        this.HB_Offsetx[2][1] = 4 * this.scale;
        this.HB_Offsety[2][1] = 2 * this.scale;

        // Attack Animation
        this.HB_Offsetx[3][0] = 4 * this.scale;
        this.HB_Offsety[3][0] = 2 * this.scale;
        this.HB_Offsetx[3][1] = 4 * this.scale;
        this.HB_Offsety[3][1] = 2 * this.scale;

        // Move Animation
        this.HB_Offsetx[4][0] = 4 * this.scale;
        this.HB_Offsety[4][0] = 2 * this.scale;
        this.HB_Offsetx[4][1] = 4 * this.scale;
        this.HB_Offsety[4][1] = 2 * this.scale;

    };
    


    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

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
        this.animations[0][0] = new Animator(this.spritesheet, 509, 65, 33, 36, 4, 0.14, -183, 0, 1, 0); //0.14 Animation Speed (changed to 1 for now)
        this.animations[0][1] = new Animator(this.spritesheet, 658, 65, 33, 36, 4, 0.14, 117, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 504, 364, 42, 37, 4, 1, -192, 0, 1, 0); //0.12 Animation Speed
        this.animations[1][1] = new Animator(this.spritesheet, 654, 364, 42, 37, 4, 1, 108, 0, 1, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 491, 212, 74, 39, 4, 1, -230, 0, 1, 0); // 0.1 Animation Speed
        this.animations[2][1] = new Animator(this.spritesheet, 640, 212, 74, 39, 4, 1, 82, 0, 1, 0);

        // Death Animation - OG just in case
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 491, 212, 52, 39, 4, 0.1, -202, 0, 0, 0);
        // Death Animation
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 657, 212, 52, 39, 4, 0.1, 98, 0, 0, 0);

        // Attack Animation
        this.animations[3][0] = new Animator(this.spritesheet, 1081, 655, 88, 46, 8, 1, -238, 0, 1, 0); //0.06 Animation Speed
        this.animations[3][1] = new Animator(this.spritesheet, 31, 505, 88, 46, 8, 1, 62, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 1, -188, 0, 1, 0); //0.1 Animation Speed
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 1, 112, 0, 1, 0);

    };



    draw(ctx) {

        // State and Direction Variables for Testing
        this.state = 2;
        this.direction = 0;

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
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };

};