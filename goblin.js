class Goblin {
    constructor(game){
    
        this.game = game;
        

        // Reverse-Facing Animations

        // Attack Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 1081, 655, 88, 46, 8, 0.06, -238, 0, 1, 0);
        
        // Damaged Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 504, 364, 42, 37, 4, 0.12, -192, 0, 1, 0); 
        
        // Death Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 491, 212, 52, 39, 4, 0.1, -202, 0, 0, 0);

        // Idle Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 509, 65, 33, 36, 4, 0.14, -183, 0, 1, 0); // 0.14

        // Move Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);

        // Move Animation - Run on Hard mode?
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 1106, 963, 38, 38, 8, 0.07, -188, 0, 1, 0);

        
        
        
        
        // Front-Facing Animations Complete! -----------------------------------------------------------------------------------------
        
        // Attack Animations
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 31, 505, 88, 46, 8, 0.06, 62, 0, 1, 0);
        
        // Damaged Animation
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 654, 364, 42, 37, 4, 0.12, 108, 0, 1, 0);
        
        // Death Animation
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 657, 212, 52, 39, 4, 0.1, 98, 0, 0, 0); //0.1

        // Idle Animation
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 658, 65, 33, 36, 4, 0.14, 117, 0, 1, 0);

        // Move Animation
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

        // Move Animation - Run on Hard mode?
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"), 56, 813, 38, 38, 8, 0.07, 112, 0, 1, 0); //0.07
        
        

    };

    loadAnimations() {

    };

    update() {
    
    };

    draw(ctx) {
        //ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png"),0,0);
        this.animator.drawFrame(this.game.clockTick, ctx, 0, 0,7)
    };

    // idle animation
    idle(ctx) {

    };

    die(ctx) {

    };

    Damaged(ctx) {

    };
    
    attack(ctx) {

    };

    // movement animation
    move(ctx) {

    };


};