class Sign extends AbstractBackFeature {
    constructor(game, x, y, text, title) {
        super(game, x, y);

        //if (!(text instanceof Array)) throw Exception("Sign text must be put into an array where each index is a line");

        this.scale = PARAMS.BLOCKDIM;
        this.text = text;
        this.title = title;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/sign.png");
        this.fontSize = DEFAULT_FONT_SIZE;
        this.showText = false;  //check if draw textbox
        this.read = false;      //check if player has read this sign before
        this.isReading = false; //check if player currently reading this sign

        this.updateBoxes();

        //text that hovers above the sign
        this.animationTime = 0;
        this.animationX = this.BB.x - this.scale / 4;
        this.animationY = this.BB.y - this.scale / 4;

        //textbox specific to this sign
        this.myTextBox = new TextBox(this.game, this.BB.x, this.BB.y, this.text, true);
        this.game.addEntityToFront(this.myTextBox);
        this.myHoverMsg = "Tap \'W\' to read";

    }

    updateBoxes() {
        this.BB = new BoundingBox(this.x * PARAMS.BLOCKDIM, this.y * PARAMS.BLOCKDIM, this.scale, this.scale);
    }

    update() {
        this.updateBoxes();

        //animate the text by bobbing it up and down every second, but only if player has not read sign
        if (!this.read) {
            this.animationTime += this.game.clockTick;
            if (this.animationTime < 0.5) {
                this.animationY += .05;
            } else if (this.animationTime < 1) {
                this.animationY -= .05;
            } else {
                this.animationTime = 0;
            }
        }
        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {
                /**
                 * Add the textbox to the scene manager when it is needed
                 * Set it to null when not needed
                 */
                let playerNearSign = entity.BB && self.BB.collide(entity.BB);
                //player pressed up to read sign
                if (playerNearSign && self.game.up) {
                    //mark player has read this sign
                    if (!self.read) {
                        ASSET_MANAGER.playAsset(SFX.SELECT);
                        self.read = true;
                    }
                    self.isReading = true;
                    self.showText = true;
                } else {
                    //player is next to the sign and reading it
                    if (playerNearSign && self.isReading) {
                        self.showText = true;
                    } else { //player no longer near sign and reading
                        self.isReading = false;
                        self.showText = false;
                    }
                    
                }
            }
        });

        //whether to draw the textbox or not
        this.myTextBox.show = this.showText;


    }



    draw(ctx) {
        ctx.font = PARAMS.DEFAULT_FONT;

        //draw the sign
        ctx.drawImage(this.spritesheet,
            (this.x * PARAMS.BLOCKDIM) - this.game.camera.x,
            (this.y * PARAMS.BLOCKDIM) - this.game.camera.y,
            this.scale,
            this.scale);

        //text hovering above sign
        //scene manager will handle drawing the textbox
        if (!this.showText) {
            this.read ? ctx.fillStyle = "Silver" : ctx.fillStyle = "SpringGreen";
    
            let titleOffset = (this.fontSize * this.title.length) / 4.5;
            let textOffset = (this.fontSize * this.myHoverMsg.length) / 9;
            ctx.fillText(this.title,
                (this.animationX) - this.game.camera.x - titleOffset,
                (this.animationY) - this.game.camera.y - (this.fontSize * 1.5));
            ctx.fillText(this.myHoverMsg,
                (this.animationX) - this.game.camera.x - textOffset,
                (this.animationY) - this.game.camera.y);

        }

        if (PARAMS.DEBUG) {
            this.drawDebug(ctx);
        }

    }


    drawTextBox(ctx) {
        let self = this;

        //check how many lines need to be drawn and maximum line length
        let maxLen = 0;
        let totalLines = this.text.length;
        for (let i = 0; i < totalLines; i++) {
            let line = new String(this.text[i]);
            if (line.length > maxLen) maxLen = line.length;
        }


        //make the text box
        ctx.fillStyle = this.boxColor;
        ctx.strokeStyle = this.borderColor;

        //draw the text box
        //width = line length, height = num lines
        let boxWidth = (this.fontSize * maxLen) * 1.5;
        let boxHeight = (this.fontSize * totalLines) * 2;
        let myBoxX = (this.BB.x - this.game.camera.x) - (boxWidth / 3);
        let myBoxY = (this.BB.y - this.game.camera.y) - (boxHeight * 1.5);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

        //write the text
        ctx.fillStyle = this.borderColor;
        ctx.align = "center";
        for (let i = 0; i < totalLines; i++) {
            let line = new String(this.text[i]);
            let textX = myBoxX + (boxWidth) / 6;
            let textY = myBoxY + (this.fontSize * i) + (boxHeight / totalLines);
            ctx.fillText(line, textX, textY + (i * 5));
        }
        ctx.align = "left";

    }





    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        if (this.BB) {
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.scale, this.scale);
        }
    }
}