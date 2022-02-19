/**
 * Constructs a textbox for the game
 * Dynamically makes the width and height based on passed in lines of text
 * It is expected that the passed in text is already spliced in an array where
 * each index is a new line string.
 */
class TextBox {
    constructor(game, x, y, text) {
        Object.assign(this, { game, x, y, text });
        this.fontSize = 15;


        this.boxColor = "BlueViolet";
        this.borderColor = "Azure";
        this.textColor = "GhostWhite";

        //field to draw the textbox or not. It should be set by the class using the textbox
        this.show = false;

        //logic to handle fading out
        this.myFadeTime = 0;
        this.myOpacity = 100;
        this.doFade = false;


    };

    update() {

    };

    draw(ctx) {
        if (this.show) {
            this.drawTextBox(ctx, this.text);
            this.doFade = true;
            this.myOpacity = 100;
        }

        //no longer showing start doing a fade out
        if (!this.show && this.doFade) {
            if (this.myOpacity > 0) {
                this.myOpacity -= 2;
                ctx.filter = "opacity(" + this.myOpacity + "%)";
                this.drawTextBox(ctx, this.text);
                ctx.filter = "none";
            } else {
                this.myOpacity = 100;
                this.doFade = false;
            }
        }
    };


    /**
     * Constructs a textbox to draw onto the canvas
     */
    drawTextBox(ctx, theText) {
        //ctx.font = PARAMS.DEFAULT_FONT;
        ctx.font = this.fontSize + 'px "Press Start 2P"'
        if (theText instanceof Array) this.buildMultiLineBox(ctx, theText);
        else if (isString(theText)) this.buildSingleLineBox(ctx, theText);
        else throw "Cannot draw textbox because text is not a string or a string in an array!";
        ctx.font = PARAMS.DEFAULT_FONT;
    }

    buildMultiLineBox(ctx, theText) {
        let maxLen = 0;
        let totalLines = theText.length;

        //if its one line build from a one line textbox
        if (totalLines <= 1) {
            let line = theText[0];
            this.buildSingleLineBox(ctx, line);
        } else { //build multiple line textbox

            for (let i = 0; i < totalLines; i++) {
                let line = new String(theText[i]);
                if (line.length > maxLen) maxLen = line.length;
            }

            //make the text box
            ctx.fillStyle = this.boxColor;
            ctx.strokeStyle = this.borderColor;

            //draw the text box
            //width = line length, height = num lines
            let xBuffer = 30; //buffer between box width and text
            let yBuffer = 10;
            let boxWidth = (this.fontSize * maxLen) + xBuffer;
            let boxHeight = ((this.fontSize * totalLines) * 2) + yBuffer;
            let myBoxX = (this.x - this.game.camera.x) - (boxWidth / 3);
            let myBoxY = (this.y - this.game.camera.y) - (boxHeight * 1.2);
            ctx.globalAlpha = 0.5;
            ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
            ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

            // console.log("is a string", maxLen, totalLines);
            //console.log(myBoxX, myBoxY, boxWidth, boxHeight);

            //write the text line by line
            ctx.fillStyle = this.textColor;
            ctx.align = "center";
            for (let i = 0; i < totalLines; i++) {
                let line = new String(theText[i]);
                let textX = myBoxX + (xBuffer / 2);
                let textY = myBoxY + (this.fontSize * i) + (boxHeight / totalLines) + (yBuffer / 2);
                ctx.fillText(line, textX, textY + (i * 5));
            }
            ctx.align = "left";
        }
    }

    buildSingleLineBox(ctx, theText) {
        let maxLen = theText.length;
        let totalLines = 1;

        //make the text box
        ctx.fillStyle = this.boxColor;
        ctx.strokeStyle = this.borderColor;

        //draw the text box
        //width = line length, height = num lines
        let xBuffer = 30; //buffer between box width and text
        let yBuffer = 14;
        let boxWidth = (this.fontSize * maxLen) + xBuffer;
        let boxHeight = ((this.fontSize * totalLines) * 2) + yBuffer;
        let myBoxX = (this.x - this.game.camera.x) - (boxWidth / 3);
        let myBoxY = (this.y - this.game.camera.y) - (boxHeight * 1.5);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

        // console.log("is a string", maxLen, totalLines);
        console.log(myBoxX, myBoxY, boxWidth, boxHeight);

        //write the text
        ctx.fillStyle = this.textColor;
        ctx.align = "center";
        let textX = myBoxX + (xBuffer / 2);
        let textY = myBoxY + (this.fontSize) + (boxHeight / 5) + (yBuffer / 2);
        ctx.fillText(theText, textX, textY);
        ctx.align = "left";
    }

    drawDebug() {

    }

};

/**
 * Modified textbox for the scene manager to always draw on canvas
 * Dynamically makes the width and height based on passed in lines of text
 * It is expected that the passed in text is already spliced in an array where
 * each index is a new line string.
 */
class SceneTextBox {
    constructor(game, x, y, text) {
        Object.assign(this, { game, x, y, text });
        this.fontSize = 20;

        this.boxColor = "BlueViolet";
        this.borderColor = "Azure";
        this.textColor = "GhostWhite";

        //field to draw the textbox or not. It should be set by the class using the textbox
        this.show = false;

        //logic to handle fading out
        this.myFadeTime = 0;
        this.myOpacity = 100;
        this.doFade = false;

    };

    /**
    * change message and visibility
    * @param {*} theText 
    * @param {*} theIsVisible 
    */
    setMessage(theText, theIsVisible) {
        this.text = theText;
        this.show = theIsVisible;
    }

    /**
     * Put textbox in a new spot
     * @param {*} newX 
     * @param {*} newY 
     */
    setPos(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    /**
     * Move back to top screen
     */
    resetDefaultPos() {
        this.x = (this.game.surfaceWidth / 2);
        this.y = this.fontSize * 10;
    }

    update() {

    };

    //position it in center of the screen
    center() {
        this.resetDefaultPos();
        let myLen = getMaxStrLength(this.text);
        this.x = (this.defaultX) - ((myLen / 6) * this.fontSize);
    }

    draw(ctx) {
        if (this.show) {
            this.drawTextBox(ctx, this.text);
            this.doFade = true;
            this.myOpacity = 100;
        }

        //no longer showing start doing a fade out
        if (!this.show && this.doFade) {
            if (this.myOpacity > 0) {
                this.myOpacity--;
                ctx.filter = "opacity(" + this.myOpacity + "%)";
                this.drawTextBox(ctx, this.text);
                ctx.filter = "none";
            } else {
                this.myOpacity = 100;
                this.doFade = false;
            }
        }
    };


    /**
     * Constructs a textbox to draw onto the canvas
     */
    drawTextBox(ctx, theText) {
        //ctx.font = PARAMS.DEFAULT_FONT;
        ctx.font = this.fontSize + 'px "Press Start 2P"'
        if (theText instanceof Array) this.buildMultiLineBox(ctx, theText);
        else if (isString(theText)) this.buildSingleLineBox(ctx, theText);
        else throw "Cannot draw textbox because text is not a string or a string in an array!";
        ctx.font = PARAMS.DEFAULT_FONT;
    }

    /**
     * Builds line by line
     * @param {*} ctx 
     * @param {*} theText 
     */
    buildMultiLineBox(ctx, theText) {
        let maxLen = 0;
        let totalLines = theText.length;

        //if its one line build from a one line textbox
        if (totalLines <= 1) {
            let line = theText[0];
            this.buildSingleLineBox(ctx, line);
        } else { //build multiple line textbox

            for (let i = 0; i < totalLines; i++) {
                let line = new String(theText[i]);
                if (line.length > maxLen) maxLen = line.length;
            }

            //make the text box
            ctx.fillStyle = this.boxColor;
            ctx.strokeStyle = this.borderColor;

            //draw the text box
            //width = line length, height = num lines
            let xBuffer = 30; //buffer between box width and text
            let yBuffer = 10;
            let boxWidth = (this.fontSize * maxLen) + xBuffer;
            let boxHeight = ((this.fontSize * totalLines) * 2) + yBuffer;
            let myBoxX = (this.x) - (boxWidth / 3);
            let myBoxY = (this.y) - (boxHeight * 1.5);
            ctx.globalAlpha = 0.5;
            ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
            ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

            // console.log("is a string", maxLen, totalLines);
            //console.log(myBoxX, myBoxY, boxWidth, boxHeight);

            //write the text line by line
            ctx.fillStyle = this.textColor;
            ctx.align = "center";
            for (let i = 0; i < totalLines; i++) {
                let line = new String(theText[i]);
                let textX = myBoxX + (xBuffer / 2);
                let textY = myBoxY + (this.fontSize * i) + (boxHeight / totalLines) + (yBuffer / 2);
                ctx.fillText(line, textX, textY + (i * 5));
            }
            ctx.align = "left";
        }
    }

    /**
     * Build one line of textbox
     * @param {*} ctx 
     * @param {*} theText 
     */
    buildSingleLineBox(ctx, theText) {
        let maxLen = theText.length;
        let totalLines = 1;

        //make the text box
        ctx.fillStyle = this.boxColor;
        ctx.strokeStyle = this.borderColor;

        //draw the text box
        //width = line length, height = num lines
        let xBuffer = 30; //buffer between box width and text
        let yBuffer = 14;
        let boxWidth = (this.fontSize * maxLen) + xBuffer;
        let boxHeight = ((this.fontSize * totalLines) * 2) + yBuffer;
        let myBoxX = (this.x) - (boxWidth / 3);
        let myBoxY = (this.y) - (boxHeight * 1.5);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

        // console.log("is a string", maxLen, totalLines);
        console.log(myBoxX, myBoxY, boxWidth, boxHeight);

        //write the text
        ctx.fillStyle = this.textColor;
        ctx.align = "center";
        let textX = myBoxX + (xBuffer / 2);
        let textY = myBoxY + (this.fontSize) + (boxHeight / 5) + (yBuffer / 2);
        ctx.fillText(theText, textX, textY);
        ctx.align = "left";
    }


    //methods to position it
    
    centerTop() {
        this.x = (this.game.surfaceWidth / 2);
        this.y = 150;
    }

    centerBottom() {
        this.x = (this.game.surfaceWidth / 2);
        this.y = (this.game.surfaceHeight) - 100;
    }

    drawDebug() {

    }
}

