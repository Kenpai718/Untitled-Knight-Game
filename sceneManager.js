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
        this.player = new Knight(this.game, 0, 300);
        this.game.addEntity(this.player);

        //this.loadLevel1();
        this.loadPrototypeLevel();
        
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


    //demo of entities for prototshowcase
    loadPrototypeLevel() {
        //ground
        let bg = new Background(this.game);
        let ground = new Ground(this.game, 0, this.game.surfaceHeight - 64, this.game.surfaceWidth, PARAMS.BLOCKWIDTH);
        let plat = new Platform(this.game, 70, this.game.surfaceHeight - 340, 500, PARAMS.BLOCKWIDTH);
        let plat2 = new Platform(this.game, this.game.surfaceWidth - 570, this.game.surfaceHeight - 340, 500, PARAMS.BLOCKWIDTH);
        let plat3 = new Platform(this.game, this.game.surfaceWidth - 1150, this.game.surfaceHeight - 520, 375, PARAMS.BLOCKWIDTH);

        //show animations
        let skel = new Skeleton(this.game, 190, 927);
        let gob = new Goblin(this.game, 1065, 565 - 90);
        let mush = new Mushroom(this.game, 1505, 740 - 90);
        let wiz = new Wizard(this.game, 50, 75);
        let eye = new FlyingEye(this.game, 1570, 45);
        

        //add entities
        this.game.addEntity(ground);

        this.game.addEntity(plat);
        this.game.addEntity(plat2);
        this.game.addEntity(plat3);

        //enemies
        this.game.addEntity(skel);
        this.game.addEntity(gob);
        this.game.addEntity(mush);
        this.game.addEntity(wiz);
        this.game.addEntity(eye);

        //background always last
        this.game.addEntity(bg);
    }

    loadLevel1() {
        let bg = new Background(this.game);
        let ground = new Ground(this.game, 0, this.game.surfaceHeight - 64, this.game.surfaceWidth, PARAMS.BLOCKWIDTH);

        this.game.addEntity(ground);
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
