class Chest extends AbstractBackFeature {
    constructor(game, x, y, direction) {

        super(game, x, y);
        //Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");

        // Items in chest
        this.arrowStorage = 0; // 0 until player interacts with chest
        this.potionStorage = 0;

        // Scale sizes
        this.scale = 5; // 4
        // this.width = 21 * this.scale;
        // this.height = 12 * this.scale;
        this.width = 1.5;
        this.height = 1;

        // Update settings
        this.timerGUI = 0;
        this.timerGUI2 = 0;

        // Mapping animations and states
        this.states = { closed: 0, opened: 1 };
        this.directions = { left : 0, right : 1};
        this.animations = []; // [state][direction]

        this.state = 0;
        this.direction = direction;
        this.opened = false;
        this.collected = false;


        // When Debug box is true, select boundary box to display
        this.displayBoundingbox = true;

        // Other
        this.loadAnimations();
        this.updateBB();
    };

    updateBB() {
        this.lastBoundingBox = this.BB;
        this.BB = new BoundingBox(this.x * PARAMS.BLOCKDIM, this.y * PARAMS.BLOCKDIM, this.width * PARAMS.BLOCKDIM, this.height * PARAMS.BLOCKDIM)
    };

    viewBoundingBox(ctx) {
        // This is the Bounding Box, defines space where chest is and can be opened
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, this.width, this.height);
    };

    update() {

        // If Chest is hit by player, change to Opened state
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.HB && that.BB.collide(entity.HB) && entity instanceof AbstractPlayer && that.state != 1) {
                that.state = 1;
                that.opened = true;

                // varaibles needed for GUI to display amount
                that.potionStorage = 1 + Math.floor(Math.random() * 3);      // Gives random amount of hp potions 1-3
                that.arrowStorage = 1 + Math.floor(Math.random() * 15);     // Gives random amount of arrows 1-15

                entity.myInventory.potions += that.potionStorage;
                entity.myInventory.arrows += that.arrowStorage;

                that.timerGUI = that.timerGUI2 + 1;
            }
        }); // Allows timer to start when open, used for fade effect
        if (that.opened && that.timerGUI2 < 5)
            that.timerGUI2 += that.game.clockTick * 3;
    };

    loadAnimations() {

        let numStates = 2;
        let numDir = 2;
        for (var i = 0; i < numStates; i++) { //defines state
            this.animations.push([]);
            for (var j = 0; j < numDir; j++) {
                this.animations[i].push([]);
            }
        }

        // Animations  [state]

        // Closed state
        this.animations[0][0] = new Animator(this.spritesheet, 19, 147, 21, 12, 1, 0, 0, 0, 0, 0);
        // Opened state
        this.animations[1][0] = new Animator(this.spritesheet, 51, 147, 21, 12, 1, 0, 0, 0, 0, 0);
        this.animations[0][1] = new Animator(this.spritesheet, 120, 147, 21, 12, 1, 0, 0, 0, 0, 0);
        // Opened state
        this.animations[1][1] = new Animator(this.spritesheet, 83, 147, 21, 12, 1, 0, 0, 0, 0, 0);

    };



    draw(ctx) {

        switch (this.state) {
            case 0: // Closed chest
                if (this.direction == this.directions.left) {
                    ctx.drawImage(this.spritesheet, 19, 147, 21, 12, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.width * PARAMS.BLOCKDIM, this.height * PARAMS.BLOCKDIM);
                } else {
                    ctx.drawImage(this.spritesheet, 120, 147, 21, 12, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.width * PARAMS.BLOCKDIM, this.height * PARAMS.BLOCKDIM);
                }
                break;
            case 1: // Opened chest
                if (this.direction == this.directions.left) {
                    ctx.drawImage(this.spritesheet, 51, 147, 21, 12, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.width * PARAMS.BLOCKDIM, this.height * PARAMS.BLOCKDIM);
                } else {
                    ctx.drawImage(this.spritesheet, 83, 147, 21, 12, this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.width * PARAMS.BLOCKDIM, this.height * PARAMS.BLOCKDIM);
                }
                break;
        }

        // Once opened, Chest will display # of earned items from the chest
        // After a few seconds this display will fade and disappear after 10 seconds
        let that = this;
        if (that.opened) {
            ctx.font = PARAMS.BIG_FONT;
            let tempColor = ctx.fillStyle;
            ctx.fillStyle = "White"

            if (that.timerGUI2 >= 5) // Fading effect for chest GUI
                ctx.globalAlpha = 0;
            else
                ctx.globalAlpha = that.timerGUI / that.timerGUI2;


            ctx.fillText("🏹 x" + that.arrowStorage, that.x * PARAMS.BLOCKDIM - this.game.camera.x, that.y * PARAMS.BLOCKDIM - 5 - this.game.camera.y);
            ctx.fillText("⚗️ x" + that.potionStorage, that.x * PARAMS.BLOCKDIM - this.game.camera.x, that.y * PARAMS.BLOCKDIM - 40 - this.game.camera.y);


            ctx.font = PARAMS.DEFAULT_FONT;
            ctx.fillStyle = tempColor;
            ctx.globalAlpha = 1;
        }
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.x * PARAMS.BLOCKDIM - this.game.camera.x, this.y * PARAMS.BLOCKDIM - this.game.camera.y, this.width * PARAMS.BLOCKDIM, this.height * PARAMS.BLOCKDIM);

        //     ctx.fillStyle = "White"
        //     ctx.fillText("Chest", this.x - this.game.camera.x, this.y - this.game.camera.y + 20);
        //     ctx.fillText("Contents: ", this.x - this.game.camera.x, this.y - this.game.camera.y + 10);
    }


};


// Money money money moneyyyy...
