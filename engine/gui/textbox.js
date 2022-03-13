/**
 * Constructs a textbox for the game
 * Dynamically makes the width and height based on passed in lines of text
 * It is expected that the passed in text is already spliced in an array where
 * each index is a new line string.
 */
class TextBox {
    constructor(game, x, y, text, lineBuffer = 5, theBoxColor, useTimer, timerDuration = 8) {
        Object.assign(this, { game, x, y, text, lineBuffer });
        this.fontSize = 15;


        if (theBoxColor === undefined || theBoxColor === null) this.boxColor = "BlueViolet"; //default box color
        else this.boxColor = theBoxColor; //passed in box color
        this.borderColor = "Azure";
        this.textColor = "GhostWhite";

        //time based showing
        (useTimer === undefined || useTimer === null) ? this.useTimer = false : this.useTimer = useTimer;
        (timerDuration === undefined || timerDuration === null) ? this.myMaxTime = 0 : this.myMaxTime = timerDuration;
        this.myTimer = 0;

        //field to draw the textbox or not. It should be set by the class using the textbox
        this.show = false;

        //logic to handle fading out
        this.myFadeTime = 0;
        this.myOpacity = 0;
        this.doFade = false;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.createTextBox(this.canvas, this.ctx, text);
    };

    updateCords(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        if (this.useTimer && this.show) {
            const TICK = this.game.clockTick;
            this.myTimer += TICK;

            if (this.myTimer >= this.myMaxTime) {
                this.show = false;
            }
        }
    };

    /**
     * Sets a new message to be shown
     * Sets the duration of how long to show the message for
     * Note: this.useTimer has to be true for the in-class text timer
     * @param {} theNewMsg 
     * @param {*} theShowDuration 
     */
    updateMessage(theNewMsg, theShowDuration) {

        if (theNewMsg != this.text) {
            this.text = theNewMsg;
            this.show = true;
            this.myTimer = 0;
            this.myMaxTime = theShowDuration;
            this.createTextBox(this.canvas, this.ctx, this.text);
        }
    }

    draw(ctx) {
        if (this.show) {
            this.doFade = true;
            this.myOpacity = 100;
        }

        //no longer showing start doing a fade out
        if (!this.show && this.doFade) {
            if (this.myOpacity > 0) {
                this.myOpacity -= 2;
            } else {
                this.myOpacity = 0;
                this.doFade = false;
            }
        }

        ctx.filter = "opacity(" + this.myOpacity + "%)";
        ctx.drawImage(this.canvas, this.x - this.game.camera.x - this.canvas.width / 3,
            this.y - this.game.camera.y - this.canvas.height * 1.2);
        ctx.filter = "none";

    };


    /**
     * Constructs a textbox to draw onto the canvas
     */
    createTextBox(canvas, ctx, theText) {
        //ctx.font = PARAMS.DEFAULT_FONT;
        ctx.font = this.fontSize + 'px "Press Start 2P"';
        if (theText instanceof Array) this.buildMultiLineBox(canvas, ctx, theText);
        else if (isString(theText)) this.buildSingleLineBox(canvas, ctx, theText);
        else throw "Cannot draw textbox because text is not a string or a string in an array!";
        ctx.font = PARAMS.DEFAULT_FONT;
    }

    buildMultiLineBox(canvas, ctx, theText) {
        let maxLen = 0;
        let totalLines = theText.length;

        //if its one line build from a one line textbox
        if (totalLines <= 1) {
            let line = theText[0];
            this.buildSingleLineBox(canvas, ctx, line);
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
            let yBuffer = this.fontSize / 2;
            let boxWidth = (this.fontSize * maxLen) + xBuffer;
            let boxHeight = ((this.fontSize + this.lineBuffer) * totalLines) + (yBuffer * 2);
            canvas.width = boxWidth + 4;
            canvas.height = boxHeight + 4;

            ctx.fillStyle = this.boxColor;
            ctx.strokeStyle = this.borderColor;

            //let myBoxX = (this.x - this.game.camera.x) - (boxWidth / 3);
            //let myBoxY = (this.y - this.game.camera.y) - (boxHeight * 1.2);
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
            ctx.strokeRect(1, 1, boxWidth, boxHeight);

            // console.log("is a string", maxLen, totalLines);
            //console.log(myBoxX, myBoxY, boxWidth, boxHeight);

            //write the text line by line
            ctx.fillStyle = this.textColor;
            ctx.align = "center";
            ctx.font = this.fontSize + 'px "Press Start 2P"';
            for (let i = 0; i < totalLines; i++) {
                let line = new String(theText[i]);
                let textX = (xBuffer / 2);
                let textY = (this.fontSize * i) + this.fontSize + (yBuffer * 2);

                ctx.fillText(line, textX, textY + (i * this.lineBuffer));
            }
            ctx.align = "left";
        }
    }

    buildSingleLineBox(canvas, ctx, theText) {
        let maxLen = theText.length;
        let totalLines = 1;

        //make the text box
        ctx.fillStyle = this.boxColor;
        ctx.strokeStyle = this.borderColor;

        //draw the text box
        //width = line length, height = num lines
        let xBuffer = 30; //buffer between box width and text
        let yBuffer = this.fontSize / 2;
        let boxWidth = (this.fontSize * maxLen) + xBuffer;
        let boxHeight = ((this.fontSize + this.lineBuffer) * totalLines) + (yBuffer * 2);
        canvas.width = boxWidth + 4;
        canvas.height = boxHeight + 4;

        ctx.fillStyle = this.boxColor;
        ctx.strokeStyle = this.borderColor;

        //let myBoxX = (this.x - this.game.camera.x) - (boxWidth / 3);
        //let myBoxY = (this.y - this.game.camera.y) - (boxHeight * 1.5);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, boxWidth, boxHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(1, 1, boxWidth, boxHeight);

        // console.log("is a string", maxLen, totalLines);
        //console.log(myBoxX, myBoxY, boxWidth, boxHeight);

        //write the text
        ctx.fillStyle = this.textColor;
        ctx.align = "center";
        ctx.font = this.fontSize + 'px "Press Start 2P"';
        let textX = (xBuffer / 2);
        let textY = this.fontSize + (yBuffer * 2);
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
    constructor(game, x, y, text, fontSize = 20, lineBuffer = 5) {
        Object.assign(this, { game, x, y, text, fontSize, lineBuffer });

        this.boxColor = "BlueViolet";
        this.borderColor = "Azure";
        this.textColor = "GhostWhite";

        //field to draw the textbox or not. It should be set by the class using the textbox
        this.show = false;

        //logic to handle fading out
        this.myFadeTime = 0;
        this.myOpacity = 100;
        this.doFade = false;
        this.maxLength = 0;
    };

    /**
    * change message and visibility
    * @param {*} theText
    * @param {*} theIsVisible
    */
    setMessage(theText, theIsVisible) {
        this.maxLength = 0;
        this.text = theText;
        this.show = theIsVisible;
        if (theText instanceof Array) for (var i = 0; i < theText.length; i++) this.maxLength = Math.max(this.maxLength, theText[i].length);
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
            let yBuffer = this.fontSize / 2;
            let boxWidth = (this.fontSize * maxLen) + xBuffer;
            let boxHeight = ((this.fontSize + this.lineBuffer) * totalLines) + (yBuffer * 2);
            let myBoxX = this.x;
            let myBoxY = this.y;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
            ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

            //write the text line by line
            ctx.fillStyle = this.textColor;
            ctx.align = "center";
            for (let i = 0; i < totalLines; i++) {
                let line = new String(theText[i]);
                let textX = myBoxX + (xBuffer / 2);
                let textY = myBoxY + (this.fontSize * i) + this.fontSize + (yBuffer * 2);
                ctx.fillText(line, textX, textY + (i * this.lineBuffer));
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
        let yBuffer = 30;
        let boxWidth = (this.fontSize * maxLen) + xBuffer;
        let boxHeight = this.fontSize + yBuffer;
        let myBoxX = this.x;
        let myBoxY = this.y;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);


        // console.log("is a string", maxLen, totalLines);
        //console.log(myBoxX, myBoxY, boxWidth, boxHeight);

        //write the text
        ctx.fillStyle = this.textColor;
        ctx.align = "center";
        let textX = myBoxX + (xBuffer / 2);
        let textY = myBoxY + (this.fontSize) + (yBuffer / 2);
        ctx.fillText(theText, textX, textY);
        ctx.align = "left";
    }




    //methods to position it

    centerTop() {
        this.x = (this.game.surfaceWidth / 2) - ((this.fontSize * this.text.length) / 2);
        this.y = 150;
    }

    centerTopMulti() {
        this.x = (this.game.surfaceWidth / 2) - ((this.fontSize * this.maxLength) / 2);
        this.y = 50;
    }

    centerBottomSingle() {
        this.x = (this.game.surfaceWidth / 2) - ((this.fontSize * this.text.length) / 2);
        this.y = (this.game.surfaceHeight) - (this.fontSize * 6);
    }

    centerBottomMulti() {
        this.x = (this.game.surfaceWidth / 2) - ((this.fontSize * this.maxLength) / 2);
        this.y = (this.game.surfaceHeight - (this.text.length * (this.fontSize + this.lineBuffer)) - (this.fontSize * 3));
    }

    drawDebug() {

    }
}
