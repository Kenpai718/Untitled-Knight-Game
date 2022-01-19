class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //add scene manager as an entity to game engine
        
        //game status
        this.title = false;
        this.gameOver = false;

        //main character
        this.player = new Knight(this.game);
        this.game.addEntity(this.player);

        
    };

    update() {
        //console.log("scene manager updated");
        PARAMS.DEBUG = document.getElementById("debug").checked;
    };

    draw(ctx) {

        if(PARAMS.DEBUG) {
            //console.log("debug");
            this.viewDebug(ctx);
        }
    };

    //keyboard input
    viewDebug(ctx) {;
        // left debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.keys[this.player.left] ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        console.log(this.game.surfaceHeight);
        ctx.strokeRect(10, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("A", 20, this.game.surfaceHeight - 20);

        // down debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.keys[this.player.down] ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("S", 60, this.game.surfaceHeight - 20);

        // up debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.keys[this.player.up]  ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight -80, 30, 30);
        ctx.fillText("W", 60, this.game.surfaceHeight - 60);

        // right debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.keys[this.player.right]  ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(90, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("D", 100, this.game.surfaceHeight - 20);

        // jump debug
        ctx.strokeStyle= "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.keys[this.player.jump]  ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(130, this.game.surfaceHeight -40, 50, 30);
        ctx.fillText("SPACE", 140, this.game.surfaceHeight - 20);

		// roll debug
		ctx.strokeStyle= "black";
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.keys[this.player.roll]  ? "Red" : "Black";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(130, this.game.surfaceHeight - 80, 50, 30);
		ctx.fillText("LSHIFT", 140, this.game.surfaceHeight - 60);  

        // attack debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.keys[this.player.attack]  ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(190, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("P", 200, this.game.surfaceHeight - 20);
	}
}
