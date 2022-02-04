class HealthBar {
    constructor(game, agent) {
        Object.assign(this, { game, agent });

    };

    update() {

    };

    draw(ctx) {
        var box = this.agent.BB;
        //var x = this.agent.x;
        //var y = this.agent.y;
        var widthRatio = (3 / 2);
        var widthDivisor = 4;

        var newX = box.x - this.game.camera.x;
        var newY = box.y - this.game.camera.y;
        var width = this.agent.width / widthDivisor;
        var height = 10;
        var offsetX = (width / (widthDivisor * widthRatio));
        var offsetY = 30;
        var ratio = this.agent.hp / this.agent.max_hp;

        if (this.agent.hp < this.agent.max_hp) {
            ctx.strokeStyle = "Black"; //border
            //transparent gray as hp fill
            ctx.fillStyle = rgba(41,41,41, 0.5); 
            ctx.fillRect(newX - offsetX, newY - offsetY, width, height);
            //hp ratio color
            ctx.fillStyle = ratio < PARAMS.LOW_HP ? "Red" : ratio < PARAMS.MID_HP ? "Yellow" : "Green"; 
            ctx.fillRect(newX - offsetX, newY - offsetY, width * ratio, height); 
            ctx.strokeRect(newX - offsetX, newY - offsetY, width, height);
        }

        if (PARAMS.DEBUG) { //show info about the agent object
            let yBuffer = 12;

            let velX = (this.agent.velocity.x).toFixed(2);
            let velY = (this.agent.velocity.y).toFixed(2);
            let cordX = (this.agent.x).toFixed(2);
            let cordY = (this.agent.y).toFixed(2);ctx.font = PARAMS.DEFAULT_FONT;
            ctx.strokeStyle = "Black";
            ctx.fillStyle = ratio < PARAMS.LOW_HP ? "Red" : ratio < PARAMS.MID_HP ? "Yellow" : "SpringGreen";

            //print info specific to the agent object above the healthbar for debugging
            ctx.fillText(this.agent.name, newX, newY - (yBuffer * 5) - offsetY);
            ctx.fillText("HP: " + this.agent.hp + "/" + this.agent.max_hp, newX, newY - (yBuffer * 4) - offsetY);
            ctx.fillText("Cords: [x:" + cordX + ", y:" + cordY + "]", newX, newY - (yBuffer * 3) - offsetY);
            ctx.fillText("Velocity: {x: " + velX + ", y: " + velY + "}", newX, newY - (yBuffer * 2) - offsetY);


            (this.agent.vulnerable) ? ctx.fillStyle = "GhostWhite" : ctx.fillStyle = "DimGray";
            ctx.font = PARAMS.DEFAULT_FONT;
            ctx.fillText("Vulnerable: " + this.agent.vulnerable, newX, newY - (yBuffer * 1) - offsetY)
        }
        
    };
};
