class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //add scene manager as an entity to game engine
        
        //game status
        this.title = false;
        this.gameOver = false;

        //testing goblin animations
        //this.test = new Skeleton(this.game, 400, 927)
        //this.game.addEntity(this.test);

        //main character
        this.player = new Knight(this.game, 0, 777);
        this.game.addEntity(this.player);

        this.loadLevel1();
        
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

    loadLevel1() {
        let bg = new Background(this.game);
        let platform = new Ground(this.game, 0, this.game.surfaceHeight - 64, this.game.surfaceWidth, PARAMS.BLOCKWIDTH);

        this.game.addEntity(platform);
        this.game.addEntity(bg);
    }

    //keyboard input
    viewDebug(ctx) {;
        // left debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.left ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(10, this.game.surfaceHeight - 40, 30, 30);
        ctx.fillText("A", 20, this.game.surfaceHeight - 20);

        // down debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.down ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("S", 60, this.game.surfaceHeight - 20);

        // up debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.up ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight -80, 30, 30);
        ctx.fillText("W", 60, this.game.surfaceHeight - 60);

        // right debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.right  ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(90, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("D", 100, this.game.surfaceHeight - 20);

        // jump debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.jump  ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(130, this.game.surfaceHeight -40, 50, 30);
        ctx.fillText("SPACE", 140, this.game.surfaceHeight - 20);

		// roll debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.roll ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(130, this.game.surfaceHeight - 80, 50, 30);
		ctx.fillText("LSHIFT", 140, this.game.surfaceHeight - 60);  

        // attack debug
    
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.attack  ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(190, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("ATK", 195, this.game.surfaceHeight - 20);
	}
}
