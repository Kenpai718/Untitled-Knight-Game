class Goblin {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");
        this.animations = []; // [state][direction]
        this.tick = 0;
        this.scale = 2.5;

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4};
        this.directions = {left: 0, right: 1 };
        
        console.log("Current Goblin State: " + this.state);
        console.log("Current Goblin Direction: " + this.direction);

        //testing goblin animations - sceneManager
        this.test = new Skeleton(this.game, 400, 927)
        this.game.addEntity(this.test);

        this.loadAnimations();

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
        this.animations[0][0] = new Animator(this.spritesheet, 509, 65, 33, 36, 4, 0.14, -183, 0, 1, 0);
        this.animations[0][1] = new Animator(this.spritesheet, 658, 65, 33, 36, 4, 0.14, 117, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 504, 364, 42, 37, 4, 0.12, -192, 0, 1, 0);
        this.animations[1][1] = new Animator(this.spritesheet, 654, 364, 42, 37, 4, 0.12, 108, 0, 1, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 491, 212, 74, 39, 4, 0.1, -230, 0, 1, 0); // 0.1
        this.animations[2][1] = new Animator(this.spritesheet, 640, 212, 74, 39, 4, 0.1, 82, 0, 1, 0);

        // Death Animation - OG just in case
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 491, 212, 52, 39, 4, 0.1, -202, 0, 0, 0);
        // Death Animation
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 657, 212, 52, 39, 4, 0.1, 98, 0, 0, 0);

        // Attack Animation
        this.animations[3][0] = new Animator(this.spritesheet, 1081, 655, 88, 46, 8, 0.06, -238, 0, 1, 0);
        this.animations[3][1] = new Animator(this.spritesheet, 31, 505, 88, 46, 8, 0.06, 62, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

    };



    draw(ctx) {

        // State and Direction Variables for Testing
        this.state = 3;
        this.direction = 0;

        switch(this.state) { // Prefecting Refections... Might just remove anyways.
            case 0: // Idle
                this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case 1: // Damaged
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 10, this.y -2, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 12, this.y -2, this.scale);
                break;
            case 2: // Death
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-50, this.y-4, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-40, this.y-4, this.scale);
                break;
            case 3: // Attack
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-68, this.y-25, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-70, this.y-25, this.scale);
                break;
            case 4: // Move
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-5, this.y-5, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
                break;
        }

    };

    update() {

    };
};