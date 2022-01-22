class Skeleton {
    constructor(game){
    
        this.game = game;
        
        // Front-Facing Animations! -----------------------------------------------------------------------------------------
        
        // Idle Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 660, 50, 45, 51, 4, 1, 105, 0, 1, 0);

        // Death Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 652, 200, 56, 51, 4, 1, 94, 0, 0, 0);

        // Damaged Animation - Done 
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 650, 348, 55, 53, 4, 1, 95, 0, 1, 0);

        // Block Animation - Done 
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 669, 505, 40, 46, 4, 1, 110, 0, 1, 0);

        // Move Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 660, 650, 45, 51, 4, 1, 105, 0, 1, 0);

        // Attack Animations - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 53, 794, 95, 57, 8, 0.1, 55, 0, 1, 0);

        

        
        
        


        
        
        // Reverse-Facing Animations! -----------------------------------------------------------------------------------------

        // Idle Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 495, 50, 45, 51, 4, 1, -195, 0, 1, 0);

        // Death Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 492, 200, 56, 51, 4, 1, -206, 0, 0, 0);

        // Damaged Animation - Done 
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 495, 348, 55, 53, 4, 1, -205, 0, 1, 0);

        // Block Animation - Done 
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 491, 505, 40, 46, 4, 1, -190, 0, 1, 0);

        // Move Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 495, 650, 45, 51, 4, 1, -195, 0, 1, 0);

        // Attack Animations - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png"), 1103, 794, 95, 57, 8, 0.1, -245, 0, 1, 0);

    };

    loadAnimations() {

    };

    update() {
    
    };

    draw(ctx) {
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