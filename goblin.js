class Goblin {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");
        this.animations = []; // [state][direction]
        this.loadAnimations();
        this.tick = 0;

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4};
        this.directions = {left: 0, right: 1 };

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
        this.animations[2][0] = new Animator(this.spritesheet, 491, 212, 52, 39, 4, 0.1, -202, 0, 0, 0);
        this.animations[2][1] = new Animator(this.spritesheet, 657, 212, 52, 39, 4, 0.1, 98, 0, 0, 0);

        // Attack Animation
        this.animations[3][0] = new Animator(this.spritesheet, 1081, 655, 88, 46, 8, 0.06, -238, 0, 1, 0);
        this.animations[3][1] = new Animator(this.spritesheet, 31, 505, 88, 46, 8, 0.06, 62, 0, 1, 0);
        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);
        

    };

    draw(ctx) {
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, 0, 0, 7)
    };

    update() {

    };
};