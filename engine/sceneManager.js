class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //add scene manager as an entity to game engine
        this.x = 0;
        this.y = 0;
        //game status
        this.title = false;
        this.gameOver = false;

        //levels array to load levels by calling levels[0], levels[1], etc
        this.currentLevel = 1;
        this.setupAllLevels();
        this.loadLevel(this.currentLevel);
    };

    setupAllLevels() {
        var self = this;
        let levelZero = function() {self.loadPrototypeLevel()};
        let levelOne = function() {self.loadLevel1()};
        let levelTwo = function() {self.loadLevel2()};
        this.levels = [levelZero, levelOne, levelTwo];

    }

    /*
    * Make sure this is called before a level is made
    */
    makePlayer(x, y) {
        this.player = new Knight(this.game, x, y);
        this.inventory = this.player.myInventory;
        this.heartsbar = new HeartBar(this.game, this.player);
        this.vignette = new Vignette(this.game);
        this.game.addEntity(this.player);
    }

    loadLevel(number) {
        this.clearEntities();
        if(number < 0 || number > this.levels.length - 1) {
            throw "Invalid load level number";
        } else {
            console.log("Loading level " + number);
            this.levels[number]();
        }
    }

    clearEntities() {
        this.clearLayer(this.game.background1);
        this.clearLayer(this.game.background2);
        this.clearLayer(this.game.foreground1);
        this.clearLayer(this.game.foreground2);
        this.clearLayer(this.game.entities);
        this.clearLayer(this.game.projectiles);
    };

    clearLayer(layer) {
        layer.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    }

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        this.updateAudio();
        this.updateGUI();


        if (this.player.BB.left < 0) this.player.x -= this.player.BB.left;
        else if (this.player.BB.right > this.level.width * PARAMS.BLOCKDIM) this.player.x -= this.player.BB.right - this.level.width * PARAMS.BLOCKDIM;
        if (this.x < this.player.x - this.game.surfaceWidth * 9 / 16 && this.x + this.game.surfaceWidth < this.level.width * PARAMS.BLOCKDIM) this.x = this.player.x - this.game.surfaceWidth * 9 / 16;
        else if (this.x > this.player.x - this.game.surfaceWidth * 7 / 16 && this.x > 0) this.x = this.player.x - this.game.surfaceWidth * 7 / 16;
        if (this.y > this.player.y - this.game.surfaceHeight * 1 / 16) this.y = this.player.y - this.game.surfaceHeight * 1 / 16;
        else if (this.y < this.player.y - this.game.surfaceHeight * 3 / 16 && this.y < 0) this.y = this.player.y - this.game.surfaceHeight * 3 / 16;

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    };

    updateGUI() {
        this.vignette.update();
        this.heartsbar.update();
        this.inventory.update();
    }

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("volume").value;
        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    draw(ctx) {
        //gui
        ctx.fillStyle = "White";
        this.vignette.draw(ctx);
        this.inventory.draw(ctx);
        this.heartsbar.draw(ctx);


        if (PARAMS.DEBUG) {
            this.viewDebug(ctx);
        }
    };


    //demo of entities for prototshowcase
    loadPrototypeLevel() {
        this.makePlayer(0, 500);
        //ground
        let bg = new Background(this.game);
        let ground = new Ground(this.game, 0, 12 * PARAMS.BLOCKDIM, this.game.surfaceWidth, PARAMS.BLOCKDIM);
        let plat = new Brick(this.game, 70, this.game.surfaceHeight - 340, PARAMS.BLOCKDIM * 4, PARAMS.BLOCKDIM);
        let plat2 = new Platform(this.game, this.game.surfaceWidth - 570, this.game.surfaceHeight - 340, PARAMS.BLOCKDIM * 4, PARAMS.BLOCKDIM);
        let plat3 = new Platform(this.game, this.game.surfaceWidth - 1150, 10 * PARAMS.BLOCKDIM, PARAMS.BLOCKDIM * 4, PARAMS.BLOCKDIM);

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
    };

    loadLevel1() {
        this.makePlayer(0, 500);
        let bg = new Background(this.game);
        this.level = level1_1;
        this.x = 0;
        this.y = 0;
        if (this.level.ground) {
            for (var i = 0; i < this.level.ground.length; i++) {
                let ground = this.level.ground[i];
                this.game.addEntity(new Ground(this.game, ground.x * PARAMS.BLOCKDIM, ground.y * PARAMS.BLOCKDIM, ground.width * PARAMS.BLOCKDIM, PARAMS.BLOCKDIM, ground.type));
            }
        }
        if (this.level.bricks) {
            for (var i = 0; i < this.level.bricks.length; i++) {
                let bricks = this.level.bricks[i];
                this.game.addEntity(new Brick(this.game, bricks.x * PARAMS.BLOCKDIM, bricks.y * PARAMS.BLOCKDIM, bricks.width * PARAMS.BLOCKDIM, bricks.height * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.walls) {
            for (var i = 0; i < this.level.walls.length; i++) {
                let walls = this.level.walls[i];
                this.game.addEntity(new Walls(this.game, walls.x * PARAMS.BLOCKDIM, walls.y * PARAMS.BLOCKDIM, PARAMS.BLOCKDIM, walls.height * PARAMS.BLOCKDIM, walls.type));
            }
        }
        if (this.level.shrooms) {
            for (var i = 0; i < this.level.shrooms.length; i++) {
                let shroom = this.level.shrooms[i];
                this.game.addEntity(new Mushroom(this.game, shroom.x * PARAMS.BLOCKDIM, shroom.y * PARAMS.BLOCKDIM));
            }
        }
        // The following must be last
        if (this.level.torches) {
            for (var i = 0; i < this.level.torches.length; i++) {
                let torch = this.level.torches[i];
                this.game.addEntity(new Torch(this.game, torch.x * PARAMS.BLOCKDIM, torch.y * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.doors) {
            for (var i = 0; i < this.level.doors.length; i++) {
                let door = this.level.doors[i];
                this.game.addEntity(new Door(this.game, door.x * PARAMS.BLOCKDIM, door.y * PARAMS.BLOCKDIM, door.canEnter));
            }
        }
        if (this.level.backgroundWalls) {
            for (var i = 0; i < this.level.backgroundWalls.length; i++) {
                let bw = this.level.backgroundWalls[i];
                this.game.addEntity(new BackgroundWalls(this.game, bw.x * PARAMS.BLOCKDIM, bw.y * PARAMS.BLOCKDIM, bw.width * PARAMS.BLOCKDIM, bw.height * PARAMS.BLOCKDIM));
            }
        }
        this.game.addEntity(bg);
    };

    loadLevel2() {
        this.makePlayer(0, 500);
        let bg = new Background(this.game);
        this.level = level1_2;
        this.x = 0;
        this.y = 0;
        if (this.level.ground) {
            for (var i = 0; i < this.level.ground.length; i++) {
                let ground = this.level.ground[i];
                this.game.addEntity(new Ground(this.game, ground.x * PARAMS.BLOCKDIM, ground.y * PARAMS.BLOCKDIM, ground.width * PARAMS.BLOCKDIM, PARAMS.BLOCKDIM, ground.type));
            }
        }
        if (this.level.bricks) {
            for (var i = 0; i < this.level.bricks.length; i++) {
                let bricks = this.level.bricks[i];
                this.game.addEntity(new Brick(this.game, bricks.x * PARAMS.BLOCKDIM, bricks.y * PARAMS.BLOCKDIM, bricks.width * PARAMS.BLOCKDIM, bricks.height * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.walls) {
            for (var i = 0; i < this.level.walls.length; i++) {
                let walls = this.level.walls[i];
                this.game.addEntity(new Walls(this.game, walls.x * PARAMS.BLOCKDIM, walls.y * PARAMS.BLOCKDIM, PARAMS.BLOCKDIM, walls.height * PARAMS.BLOCKDIM, walls.type));
            }
        }
        if (this.level.shrooms) {
            for (var i = 0; i < this.level.shrooms.length; i++) {
                let shroom = this.level.shrooms[i];
                this.game.addEntity(new Mushroom(this.game, shroom.x * PARAMS.BLOCKDIM, shroom.y * PARAMS.BLOCKDIM));
            }
        }
        // The following must be last
        if (this.level.torches) {
            for (var i = 0; i < this.level.torches.length; i++) {
                let torch = this.level.torches[i];
                this.game.addEntity(new Torch(this.game, torch.x * PARAMS.BLOCKDIM, torch.y * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.windows) {
            for (var i = 0; i < this.level.windows.length; i++) {
                let w = this.level.windows[i];
                this.game.addEntity(new Window(this.game, w.x * PARAMS.BLOCKDIM, w.y * PARAMS.BLOCKDIM, w.width * PARAMS.BLOCKDIM, w.height * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.banners) {
            for (var i = 0; i < this.level.banners.length; i++) {
                let banner = this.level.banners[i];
                this.game.addEntity(new Banner(this.game, banner.x * PARAMS.BLOCKDIM, banner.y * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.columns) {
            for (var i = 0; i < this.level.columns.length; i++) {
                let column = this.level.columns[i];
                this.game.addEntity(new Column(this.game, column.x * PARAMS.BLOCKDIM, column.y * PARAMS.BLOCKDIM, column.height * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.supports) {
            for (var i = 0; i < this.level.supports.length; i++) {
                let support = this.level.supports[i];
                this.game.addEntity(new Support(this.game, support.x * PARAMS.BLOCKDIM, support.y * PARAMS.BLOCKDIM, support.width * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.chains) {
            for (var i = 0; i < this.level.chains.length; i++) {
                let chain = this.level.chains[i];
                this.game.addEntity(new Chain(this.game, chain.x * PARAMS.BLOCKDIM, chain.y * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.doors) {
            for (var i = 0; i < this.level.doors.length; i++) {
                let door = this.level.doors[i];
                this.game.addEntity(new Door(this.game, door.x * PARAMS.BLOCKDIM, door.y * PARAMS.BLOCKDIM, door.canEnter));
            }
        }
        if (this.level.backgroundWalls) {
            for (var i = 0; i < this.level.backgroundWalls.length; i++) {
                let bw = this.level.backgroundWalls[i];
                this.game.addEntity(new BackgroundWalls(this.game, bw.x * PARAMS.BLOCKDIM, bw.y * PARAMS.BLOCKDIM, bw.width * PARAMS.BLOCKDIM, bw.height * PARAMS.BLOCKDIM));
            }
        }
        this.game.addEntity(bg);
    };

    //keyboard input
    viewDebug(ctx) {

        ctx.font = PARAMS.DEFAULT_FONT;

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
        ctx.strokeRect(50, this.game.surfaceHeight - 40, 30, 30);
        ctx.fillText("S", 60, this.game.surfaceHeight - 20);

        // up debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.up ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight - 80, 30, 30);
        ctx.fillText("W", 60, this.game.surfaceHeight - 60);

        // right debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.right ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(90, this.game.surfaceHeight - 40, 30, 30);
        ctx.fillText("D", 100, this.game.surfaceHeight - 20);

        // jump debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.jump ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(130, this.game.surfaceHeight - 40, 75, 30);
        ctx.fillText("SPACE", 140, this.game.surfaceHeight - 20);

        // roll debug
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.roll ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(130, this.game.surfaceHeight - 80, 75, 30);
        ctx.fillText("LSHIFT", 140, this.game.surfaceHeight - 60);

        // attack debug

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.attack ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(215, this.game.surfaceHeight - 40, 45, 30);
        ctx.fillText("ATK", 220, this.game.surfaceHeight - 20);
    };
};
