/**
 * Constructs a textbox for the game
 * Dynamically makes the width and height based on passed in lines of text
 * It is expected that the passed in text is already spliced in an array where
 * each index is a new line string.
 * 
 */
class TextBox {
    constructor(game, x, y, text) {
        Object.assign(this, { game, x, y, text});
        if(!(text instanceof Array)) throw Exception("Textbox text must be passed in as an array where each index is a line!");
        
        this.fontSize = DEFAULT_FONT_SIZE;
        this.boxColor = "BlueViolet";
        this.borderColor = "Azure";
        this.textColor = "GhostWhite";
    };

    update() {

    };

    draw(ctx) {
        this.drawTextBox(ctx);
    };


    /**
     * Constructs a textbox to draw onto the canvas
     */
    drawTextBox(ctx) {
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
        let xBuffer = 30; //buffer between box width and text
        let yBuffer = 10;
        let boxWidth = (this.fontSize * maxLen) + xBuffer;
        let boxHeight = ((this.fontSize * totalLines) * 2) + yBuffer;
        let myBoxX = (this.x - this.game.camera.x) - (boxWidth / 3);
        let myBoxY = (this.y - this.game.camera.y) - (boxHeight * 1.5);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(myBoxX, myBoxY, boxWidth, boxHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(myBoxX + 1, myBoxY + 1, boxWidth, boxHeight);

        //write the text
        ctx.fillStyle = this.textColor;
        ctx.align = "center";
        for (let i = 0; i < totalLines; i++) {
            let line = new String(this.text[i]);
            let textX = myBoxX + (xBuffer / 2);
            let textY = myBoxY + (this.fontSize * i) + (boxHeight / totalLines) + (yBuffer / 2);
            ctx.fillText(line, textX, textY + (i * 5));
        }
        ctx.align = "left";

    }

};

