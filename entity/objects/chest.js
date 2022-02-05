class Chest {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        
        // Mob sizes
        this.scale = 4; // 2.5
        this.width = 21 * this.scale;
        this.height = 12 * this.scale;

        // Update settings
        this.tick = 0;

        // Mapping animations and states
        this.states = {closed: 0, opened: 1};
        this.animations = []; // [state][direction]

        this.state = 0;

        // Boundary box.
        this.BB = null;

        // When Debug box is true, select boundary box to display
        this.displayBoundingbox = true;

        // Other
        this.loadAnimations();
        this.updateBB();
    };

    updateBB() {
        this.lastBoundingBox = this.BB;
        this.BB = new BoundingBox(this.x, this.y,this.width, this.height)
    };

    viewBoundingBox(ctx) { 
        if(this.displayBoundingbox) {        // This is the Bounding Box, defines space where chest is and can be opened
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.x, this.y,this.width, this.height);
        }
    };

    update() {

        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer) {
                that.state = 1;
            }
        });
        
        
    };

    loadAnimations() {

        let numStates = 2;
        for (var i = 0; i < numStates; i++) { //defines state
            this.animations.push([]);
        }

        // Animations  [state]

        // Idle Animation
        this.animations[0] = new Animator(this.spritesheet, 19, 147, 21, 12, 1, 0, 0, 0, 0, 0);    // 0.14 Animation Speed 
        this.animations[1] = new Animator(this.spritesheet, 51, 147, 21, 12, 1, 0, 0, 0, 0, 0);

    };



    draw(ctx) {

        switch(this.state) {
            case 0: // Closed chest
                this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case 1: // Opened chest
                this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }
    };

};