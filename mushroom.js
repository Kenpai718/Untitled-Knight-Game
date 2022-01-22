class Mushroom {
    constructor(game){
    
        this.game = game;
        
        // Front-Facing Animations! -----------------------------------------------------------------------------------------
        
        // Idle Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 664, 64, 23, 37, 4, 1, 127, 0, 1, 0);

        // Death Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 664, 214, 28, 37, 4, 1, 122, 0, 0, 0);

        // Damaged Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 644, 358, 43, 43, 4, 1, 107, 0, 1, 0);

        // Attack Animations - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 51, 506, 64, 50, 8, 1, 86, 0, 1, 0);

        // Move Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 62, 812, 26, 39, 8, 1, 124, 0, 1, 0);

        
        
        


        
        
        // Reverse-Facing Animations! -----------------------------------------------------------------------------------------

        // Idle Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 513, 64, 23, 37, 4, 1, -173, 0, 1, 0);

        // Death Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 508, 214, 28, 37, 4, 1, -178, 0, 0, 0);

        // Damaged Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 513, 358, 43, 43, 4, 1, -193, 0, 1, 0);

        // Attack Animations - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 485, 656, 64, 45, 4, 1, -214, 0, 1, 0);

        // Move Animation - Done
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/enemy/mushroom.png"), 1112, 962, 27, 39, 8, 1, -177, 0, 1, 0);

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