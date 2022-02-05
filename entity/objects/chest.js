class Chest {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

        this.arrowStorage = 0; // Gives random amount of arrows 1-15
        this.healthStorage = 0; // Gives random amount of hp potions 1-3
        
        // Mob sizes
        this.scale = 4; // 4
        this.width = 21 * this.scale;
        this.height = 12 * this.scale;

        // Update settings
        this.tick = 0;
        this.timerGUI = 0;
        this.timerGUI2 = 0;

        // Mapping animations and states
        this.states = {closed: 0, opened: 1};
        this.animations = []; // [state][direction]

        this.state = 0;
        this.opened = false;

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



        // If Chest is hit by player, change to Opened state
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer && that.state != 1) {
                that.state = 1;
                //console.log(that.arrowStorage);
                //console.log(that.healthStorage);
                //console.log(that.healthStorage - that.healthStorage);
                //console.log(that.arrowStorage - that.arrowStorage);
                that.healthStorage = 1 + Math.floor(Math.random() * 3); // Gives random amount of hp potions 1-3
                that.arrowStorage = 1 + Math.floor(Math.random() * 15); // Gives random amount of arrows 1-15

                that.opened = true;
                that.timerGUI = that.timerGUI2 + 1;
            }
        });
        if(that.opened && that.timerGUI2 < 10 )
            that.timerGUI2 += that.game.clockTick;

    };

    loadAnimations() {

        let numStates = 2;
        for (var i = 0; i < numStates; i++) { //defines state
            this.animations.push([]);
        }

        // Animations  [state]

        // Closed state
        this.animations[0] = new Animator(this.spritesheet, 19, 147, 21, 12, 1, 0, 0, 0, 0, 0);
        
        // Opened state
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

        // Once opened, Chest will display # of earned items from the chest
        let that = this;
        if(that.opened) {
            ctx.font = PARAMS.BIG_FONT;
            let tempColor = ctx.fillStyle;
            ctx.fillStyle = "White"

            if(that.timerGUI2 >= 10)
                ctx.globalAlpha = 0;
            else
                ctx.globalAlpha = that.timerGUI / that.timerGUI2;
            
            
            ctx.fillText("🏹 x" + that.arrowStorage, that.x, that.y - 5);
            ctx.fillText("⚗️ x" + that.healthStorage, that.x, that.y - 40);
            
            
            ctx.font = PARAMS.DEFAULT_FONT;
            ctx.fillStyle = tempColor;
            ctx.globalAlpha = 1;
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }
    };

};