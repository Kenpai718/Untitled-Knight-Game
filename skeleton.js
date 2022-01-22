class Skeleton {

    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png");
        this.animations = []; // [state][direction] 
        this.loadAnimations();
        this.tick = 0;

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4, block: 5};
        this.directions = {left: 0, right: 1 };

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
        this.animations[0][0] = new Animator(this.spritesheet, 495, 50, 45, 51, 4, 1, -195, 0, 1, 0);
        this.animations[0][1] = new Animator(this.spritesheet, 660, 50, 45, 51, 4, 1, 105, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 495, 348, 55, 53, 4, 1, -205, 0, 1, 0);
        this.animations[1][1] = new Animator(this.spritesheet, 650, 348, 55, 53, 4, 1, 95, 0, 1, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 492, 200, 56, 51, 4, 1, -206, 0, 0, 0);
        this.animations[2][1] = new Animator(this.spritesheet, 652, 200, 56, 51, 4, 1, 94, 0, 0, 0);

        // Attack Animations
        this.animations[3][0] = new Animator(this.spritesheet, 1103, 794, 95, 57, 8, 0.1, -245, 0, 1, 0);
        this.animations[3][1] = new Animator(this.spritesheet, 53, 794, 95, 57, 8, 0.1, 55, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 495, 650, 45, 51, 4, 1, -195, 0, 1, 0);
        this.animations[4][1] = new Animator(this.spritesheet, 660, 650, 45, 51, 4, 1, 105, 0, 1, 0);

        // Block Animation 
        this.animations[5][0] = new Animator(this.spritesheet, 491, 505, 40, 46, 4, 1, -190, 0, 1, 0);
        this.animations[5][1] = new Animator(this.spritesheet, 669, 505, 40, 46, 4, 1, 110, 0, 1, 0);


    };

    draw(ctx) {
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, 0, 0, 7)
    };

    update() {

    };

};