class HealthBar {
    constructor(game, agent) {
        Object.assign(this, { game, agent });

        //show healthbar for a certain amount of time after taking damage
        this.show = true;
        this.isPlayer = this.agent instanceof AbstractPlayer;
        this.showElapsed = 0; //time spent showing healthbar
        this.maxShowTime = 5; //max time to show the healthbar
        this.fadeTime = 3; //time it takes to fade out the healthbar
        this.myOpacity = 100; //opacity 
        this.currHP = this.agent.hp; //current agent hp

    };

    update() {

    };

    draw(ctx) {
        this.setShowAndFade();
        ctx.filter = "opacity(" + this.myOpacity + "%)";
        
        if (this.show) {
            var box = this.agent.BB;
            //var x = this.agent.x;
            //var y = this.agent.y;
            var widthRatio = (3 / 2);
            var widthDivisor = 3;

            var newX = box.x - this.game.camera.x;
            var newY = box.y - this.game.camera.y;
            var width;

            //set healthbar width for player because it's BB changes frequently
            if (this.isPlayer) {
                width = this.agent.width / widthDivisor;
            } else { //set width to size of bounding box
                width = (this.agent.BB.width);
            }

            var height = 10;
            var offsetX = (width / (widthDivisor * widthRatio));
            var offsetY = 30;
            var ratio = this.agent.hp / this.agent.max_hp;

            if (this.agent.hp < this.agent.max_hp) {
                ctx.strokeStyle = "Black"; //border
                //transparent gray as hp fill
                ctx.fillStyle = rgba(41, 41, 41, 0.5);
                ctx.fillRect(newX - offsetX, newY - offsetY, width, height);
                //hp ratio color
                ctx.fillStyle = ratio < PARAMS.LOW_HP ? "Red" : ratio < PARAMS.MID_HP ? "Yellow" : "Green";
                ctx.fillRect(newX - offsetX, newY - offsetY, width * ratio, height);
                ctx.strokeRect(newX - offsetX, newY - offsetY, width, height);
            }
        }

        ctx.filter = "none";

    };

    /**
     * Set visibility of healthbar
     * Show for certain duration after taking damage
     */
    setShowAndFade() {
        if (this.currHP == this.agent.hp) {
            this.showElapsed += this.game.clockTick;
        } else {
            this.showElapsed = 0;
            this.myOpacity = 100;
        }

        if (this.showElapsed > this.maxShowTime) {
            if (this.myOpacity > 0) this.myOpacity -= 1;
        }
        this.show = (this.showElapsed < this.maxShowTime + this.fadeTime);
        this.currHP = this.agent.hp;
    }

    drawDebug(ctx) {
        var box = this.agent.BB;
        //var x = this.agent.x;
        //var y = this.agent.y;
        var widthRatio = (3 / 2);
        var widthDivisor = 4;

        var newX = box.x - this.game.camera.x;
        var newY = box.y - this.game.camera.y;

        var width = (this.agent.BB.width * this.agent.scale);
        var height = 10;
        var offsetX = (width / (widthDivisor * widthRatio));
        var offsetY = 30;
        var ratio = this.agent.hp / this.agent.max_hp;
        let yBuffer = 12;

        //speed 
        let velX = (this.agent.velocity.x).toFixed(2);
        let velY = (this.agent.velocity.y).toFixed(2);
        //canvas cordinates
        let cordX = (this.agent.x).toFixed(2);
        let cordY = (this.agent.y).toFixed(2);
        //game cordinates as seen by levels
        let levelWidth = this.game.camera.levelW;
        let levelHeight = this.game.camera.levelH;
        let blockX = Math.round(this.agent.x / PARAMS.BLOCKDIM);
        let blockY = Math.round(levelHeight - (this.agent.y / PARAMS.BLOCKDIM));


        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.strokeStyle = "Black";
        ctx.fillStyle = ratio < PARAMS.LOW_HP ? "Red" : ratio < PARAMS.MID_HP ? "Yellow" : "SpringGreen";

        //print info specific to the agent object above the healthbar for debugging
        ctx.fillText(this.agent.name, newX - offsetX, newY - (yBuffer * 6) - offsetY);
        ctx.fillText("HP:" + this.agent.hp + "/" + this.agent.max_hp, newX - offsetX, newY - (yBuffer * 5) - offsetY);
        ctx.fillText("Canvas Cords:[x:" + cordX + ",y:" + cordY + "]", newX - offsetX, newY - (yBuffer * 4) - offsetY);
        ctx.fillText("Game Cords:  [x:" + blockX + ",y:" + blockY + "]", newX - offsetX, newY - (yBuffer * 3) - offsetY);
        ctx.fillText("Velocity:    {x:" + velX + ",y:" + velY + "}", newX - offsetX, newY - (yBuffer * 2) - offsetY);


        (this.agent.vulnerable) ? ctx.fillStyle = "GhostWhite" : ctx.fillStyle = "DimGray";
        ctx.font = PARAMS.DEFAULT_FONT;
        ctx.fillText("Vulnerable:" + this.agent.vulnerable, newX - offsetX, newY - (yBuffer * 1) - offsetY)
    }
};
