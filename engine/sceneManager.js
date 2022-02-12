/**
 * Controls GUI elements and placing entities onto the canvas by loading them
 * from a level file. Also used as the game's camera that follows the player.
 */
class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //add scene manager as an entity to game engine
        this.x = 0;
        this.y = 0;
        this.defaultMusic = MUSIC.CHASING_DAYBREAK;


        //game status
        this.title = false;
        this.gameOver = false;

        this.levelH = 0;
        this.levelW = 0;

        //levels array to load levels by calling levels[0], levels[1], etc
        this.currentLevel = 0;
        this.setupAllLevels();
        this.loadLevel(this.currentLevel, false);
    };

    /**
     * MUST BE CALLED BEFORE LOADING A LEVEL!!!
     * Initialize all levels into levels array
     */
    setupAllLevels() {
        var self = this;
        // let levelZero = function() {self.loadScene(testLevel)};
        // let levelOne = function() {self.loadScene(level1_1)};
        // let levelTwo = function() {self.loadScene(level1_2)};
        // let levelThree = function() {self.loadScene(level1_3)};
        let levelZero = testLevel;
        let levelOne = level1_1;
        let levelTwo = level1_2;
        let levelThree = level1_3;
        this.levels = [levelZero, levelOne, levelTwo, levelThree];
    }

    /**
     * MAKE SURE THIS IS CALLED BEFORE LOADING IN A LEVELS COMPONENTS!!!
     * This instantiates a player and places them appropriately on a level.
     *
     * @param theX x of Player
     * @param theY y of Player
    */
    makePlayer(theX, theY) {
        let spawnX = theX * PARAMS.BLOCKDIM;
        let spawnY = theY * PARAMS.BLOCKDIM;

        this.player = new Knight(this.game, 0, 0);
        this.player.x = spawnX - this.player.BB.left;
        this.player.y = spawnY - this.player.BB.bottom;
        //this.player.updateBB();
        this.inventory = this.player.myInventory;
        this.heartsbar = new HeartBar(this.game, this.player);
        this.vignette = new Vignette(this.game);
        this.game.addEntity(this.player);
    }

    /**
     * Loads a valid level
     * Throws an error if that level has not been made yet
     * @param {*} number level number found in levels array
     * @param {*} usedDoor true/false if a door was used to load the leel
     * @param {*} doorExitX x spawn location if a door was used
     * @param {*} doorExitY y spawn location if a door was used
     */
    loadLevel(number, usedDoor, doorExitX, doorExitY) {
        this.clearEntities();
        if (number < 0 || number > this.levels.length - 1) {
            throw "Invalid load level number";
        } else {
            console.log("Loading level " + number);
            let lvlData = this.levels[number];
            if (usedDoor) {
                //console.log("Entering door to Level#" + number + "| Exit Location = (x:" + doorExitX + ", Y:" + doorExitY + ")")
                this.loadScene(lvlData, doorExitX, doorExitY);
            } else {
                this.loadScene(lvlData, lvlData.player.x, lvlData.player.y);
            }

            this.currentLevel = number;
        }
    }

    /**
     * Clear the entities list
     */
    clearEntities() {
        this.clearLayer(this.game.background1);
        this.clearLayer(this.game.background2);
        this.clearLayer(this.game.foreground1);
        this.clearLayer(this.game.foreground2);
        this.clearLayer(this.game.entities);
        this.clearLayer(this.game.projectiles);
        this.clearLayer(this.game.information);
    };

    /**
     * Clear a layer from entities list
     * @param {} layer
     */
    clearLayer(layer) {
        layer.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    }

    /**
     * Update the camera and gui elements
     */
    update() {
        //debug key toggle, flip state of debug checkbox
        if(this.game.debug) {
            this.game.debug = false;
            document.getElementById("debug").checked = !document.getElementById("debug").checked;
        }
        PARAMS.DEBUG = document.getElementById("debug").checked;
        this.updateAudio();
        this.updateGUI();

        if (this.player.BB.left < 0) this.player.x -= this.player.BB.left;
        else if (this.player.BB.right > this.level.width * PARAMS.BLOCKDIM) this.player.x -= this.player.BB.right - this.level.width * PARAMS.BLOCKDIM;
        if (this.x < this.player.x - this.game.surfaceWidth * 9 / 16 && this.x + this.game.surfaceWidth < this.level.width * PARAMS.BLOCKDIM) this.x = this.player.x - this.game.surfaceWidth * 9 / 16;
        else if (this.x > this.player.x - this.game.surfaceWidth * 7 / 16 && this.x > 0) this.x = this.player.x - this.game.surfaceWidth * 7 / 16;

        if (this.x < 0) this.x = 0;
        else if (this.x + this.game.surfaceWidth > this.level.width * PARAMS.BLOCKDIM) this.x = this.level.width * PARAMS.BLOCKDIM - this.game.surfaceWidth;
        //if (this.y > this.player.y - this.game.surfaceHeight * 1 / 16) this.y = this.player.y - this.game.surfaceHeight * 1 / 16;
        //else if (this.y < this.player.y - this.game.surfaceHeight * 3 / 16 && this.y < 0) this.y = this.player.y - this.game.surfaceHeight * 3 / 16;
        if (this.y < this.player.y - this.game.surfaceHeight * 3 / 16 && this.y + this.game.surfaceHeight < this.level.height * PARAMS.BLOCKDIM) this.y = this.player.y - this.game.surfaceHeight * 3 / 16;
        else if (this.y > this.player.y - this.game.surfaceHeight * 1 / 16 && this.y > 0) this.y = this.player.y - this.game.surfaceHeight * 1 / 16;
        if (this.y < 0) this.y = 0;
        else if (this.y + this.game.surfaceHeight > this.level.height * PARAMS.BLOCKDIM) this.y = this.level.height * PARAMS.BLOCKDIM - this.game.surfaceHeight;

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

        //current level
        ctx.font = PARAMS.BIG_FONT;
        let xOffset;
        (this.level.label.length <= 4) ? xOffset = this.level.label.length * 70 : xOffset = this.level.label.length * 31;
        ctx.fillText("Level:" + this.level.label, this.game.surfaceWidth - xOffset, 30);


        if (PARAMS.DEBUG) {
            this.viewDebug(ctx);
            this.minimap.draw(ctx);
        }
    };

    /**
     * Reads a level json and builds the level to the canvas
     * based on passed in info.
     * @param {} scene JSON object from levels.js
     * @param {*} spawnX player's spawn x
     * @param {*} spawnY player's spawn y
     */
    loadScene(scene, spawnX, spawnY) {
        //initialize scene and player
        this.level = scene;
        this.levelH = scene.height;
        this.levelW = scene.width;
        let h = scene.height;
        this.game.addEntity(new Background(this.game));
        this.makePlayer(spawnX, h - spawnY);

        //make a minimap for the level
        this.setupMinimap();

        //play music
        if (scene.music && !this.title) { //level music when not on title
            ASSET_MANAGER.pauseBackgroundMusic();
            //ASSET_MANAGER.playAsset(scene.music);
            ASSET_MANAGER.forcePlayMusic(scene.music);
        } else if (!scene.music) { //no music set play default music
            ASSET_MANAGER.pauseBackgroundMusic();
            //ASSET_MANAGER.playAsset(this.defaultMusic);
            ASSET_MANAGER.forcePlayMusic(this.defaultMusic);
        }

        //play an entrance sound effect upon loading a level
        ASSET_MANAGER.playAsset(SFX.DOOR_ENTER);


        //load environment entities
        if (this.level.ground) {
            for (var i = 0; i < this.level.ground.length; i++) {
                let ground = this.level.ground[i];
                this.game.addEntity(new Ground(this.game, ground.x, h - ground.y - 1, ground.width, 1, ground.type));
            }
        }
        if (this.level.bricks) {
            for (var i = 0; i < this.level.bricks.length; i++) {
                let bricks = this.level.bricks[i];
                this.game.addEntity(new Brick(this.game, bricks.x, h - bricks.y - 1, bricks.width, bricks.height));
            }
        }
        if (this.level.platforms) {
            for (var i = 0; i < this.level.platforms.length; i++) {
                let platforms = this.level.platforms[i];
                this.game.addEntity(new Platform(this.game, platforms.x, h - platforms.y - 1, platforms.width, platforms.height));
            }
        }
        if (this.level.walls) {
            for (var i = 0; i < this.level.walls.length; i++) {
                let walls = this.level.walls[i];
                this.game.addEntity(new Walls(this.game, walls.x, h - walls.y - 1, 1, walls.height, walls.type));
            }
        }

        if (this.level.chests) {
            for (var i = 0; i < this.level.chests.length; i++) {
                let chest = this.level.chests[i];
                this.game.addEntity(new Chest(this.game, chest.x, h - chest.y - 1, chest.direction));
            }
        }

        //load enemy entities
        if (this.level.shrooms) {
            for (var i = 0; i < scene.shrooms.length; i++) {
                let shroom = scene.shrooms[i];
                let e = new Mushroom(this.game, 0, 0);
                this.positionEntity(e, shroom.x, h - shroom.y);
                this.game.addEntity(e);
            }
        }
        if (this.level.goblins) {
            for (var i = 0; i < scene.goblins.length; i++) {
                let goblin = scene.goblins[i];
                let e = new Goblin(this.game, 0, 0);
                this.positionEntity(e, goblin.x, h - goblin.y);
                this.game.addEntity(e);
            }
        }
        if (this.level.skeletons) {
            for (var i = 0; i < scene.skeletons.length; i++) {
                let skeleton = scene.skeletons[i];
                let e = new Skeleton(this.game, 0, 0);
                this.positionEntity(e, skeleton.x, h - skeleton.y);
                this.game.addEntity(e);
            }
        }

        //load backgroound assets
        if (this.level.backgroundWalls) {
            for (var i = 0; i < this.level.backgroundWalls.length; i++) {
                let bw = this.level.backgroundWalls[i];
                this.game.addEntity(new BackgroundWalls(this.game, bw.x, h - bw.y - 1, bw.width, bw.height));
            }
        }
        if (this.level.torches) {
            for (var i = 0; i < this.level.torches.length; i++) {
                let torch = this.level.torches[i];
                this.game.addEntity(new Torch(this.game, torch.x, h - torch.y - 1));
            }
        }
        if (this.level.windows) {
            for (var i = 0; i < this.level.windows.length; i++) {
                let w = this.level.windows[i];
                this.game.addEntity(new Window(this.game, w.x, h - w.y - 1, w.width, w.height));
            }
        }
        if (this.level.banners) {
            for (var i = 0; i < this.level.banners.length; i++) {
                let banner = this.level.banners[i];
                this.game.addEntity(new Banner(this.game, banner.x, h - banner.y - 1));
            }
        }

        if (this.level.spikes) {
            for (var i = 0; i < this.level.spikes.length; i++) {
                let spike = this.level.spikes[i];
                this.game.addEntity(new Spike(this.game, spike.x, h - spike.y - 1, spike.width, 0.5));
            }
        }
        if (this.level.doors) {
            for (var i = 0; i < this.level.doors.length; i++) {
                let door = this.level.doors[i];
                this.game.addEntity(new Door(this.game, door.x, h - door.y - 1, door.canEnter, door.exitLocation));
            }
        }
        if (this.level.columns) {
            for (var i = 0; i < this.level.columns.length; i++) {
                let column = this.level.columns[i];
                this.game.addEntity(new Column(this.game, column.x, h - column.y - 1, column.height));
            }
        }
        if (this.level.supports) {
            for (var i = 0; i < this.level.supports.length; i++) {
                let support = this.level.supports[i];
                this.game.addEntity(new Support(this.game, support.x * PARAMS.BLOCKDIM, (h - support.y - 1) * PARAMS.BLOCKDIM, support.width * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.chains) {
            for (var i = 0; i < this.level.chains.length; i++) {
                let chain = this.level.chains[i];
                this.game.addEntity(new Chain(this.game, chain.x * PARAMS.BLOCKDIM, (h - chain.y - 1) * PARAMS.BLOCKDIM));
            }
        }
        if (this.level.ceilingChains) {
            for (var i = 0; i < this.level.ceilingChains.length; i++) {
                let ceilingChain = this.level.ceilingChains[i];
                this.game.addEntity(new CeilingChain(this.game, ceilingChain.x * PARAMS.BLOCKDIM, (h - ceilingChain.y - 1) * PARAMS.BLOCKDIM, ceilingChain.height));
            }
        }

    }

    /**
     * Position an entity based through BB and block dimensions
     * @param {} entity
     * @param {*} x
     * @param {*} y
     */
    positionEntity(entity, x, y) {
        entity.x = x * PARAMS.BLOCKDIM - entity.BB.left;
        entity.y = y * PARAMS.BLOCKDIM - entity.BB.bottom;
        entity.updateBoxes();
    }

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

    /**
     * Initialize a minimap
     */
    setupMinimap() {
        let x = (this.game.surfaceWidth) - (this.levelW * PARAMS.SCALE);
        this.minimap = new Minimap(this.game, x - 100, 40, this.level);

    }
};

/**
 *  Draws a minimap based on current level
 *  x, y are minimap cordinates
 *  level parameter must contain the level's json information
 *  such as w, h which are level dimensions in terms of blockdims so 1 = blockdim width
 */
class Minimap {
    constructor(game, x, y, level) {
        this.xOffset = PARAMS.SCALE * 10;
        this.yOffset = PARAMS.SCALE * 4

        this.game = game;
        this.x = x;
        this.y = y;
        this.level = level;
        this.w = this.level.width;
        this.h = this.level.height;

        this.colors = {
            ground: "dimgray",
            brick: "silver",
            wall: "maroon",
            platform: "purple",
            spike: "orange",
            player: "blue",
            enemy: "red",
            chest: "yellow",
            door: "SpringGreen",
        }


    };

    /**
     * Builds a box of same length and width of level to a smaller scale
     * Makes a represntation of the level and entities
     * 
     * Minimap will be slightly transparent so it does obstruct the game.
     *
     * @param {*} ctx
     */
    draw(ctx) {
        ctx.globalAlpha = 0.7;
        this.buildMinimapBox(ctx);
        this.loadEnvironmentScene(ctx);
        this.traceEntities(ctx);
        ctx.globalAlpha = 1;

    }

    /**Track current entity positions and draws them to canvas */
    traceEntities(ctx) {
        let myEntities = this.game.entities;
        for (var i = 0; i < myEntities.length; i++) {
            let entity = myEntities[i];

            (entity instanceof AbstractPlayer) ? ctx.fillStyle = this.colors.player : ctx.fillStyle = this.colors.enemy;

            let convertX = entity.BB.left / PARAMS.BLOCKDIM;
            let convertY = entity.BB.top / PARAMS.BLOCKDIM;
            let convertW = entity.BB.width / PARAMS.BLOCKDIM;
            let convertH = entity.BB.height / PARAMS.BLOCKDIM;

            let myX = convertX * PARAMS.SCALE;
            let myY = convertY * PARAMS.SCALE;
            let myW = convertW * PARAMS.SCALE;
            let myH = convertH * PARAMS.SCALE;

            ctx.fillRect(this.x + myX, this.y + myY + 4 * PARAMS.SCALE, myW, myH);
        }
    }


    /**
     * Draws the level at a smaller scale onto the minimap
     * @param {} ctx
     */
    loadEnvironmentScene(ctx) {
        /* build environment blocks */
        //ground
        ctx.fillStyle = this.colors.ground;
        if (this.level.ground) {
            for (var i = 0; i < this.level.ground.length; i++) {
                let ground = this.level.ground[i];
                let myX = ground.x * PARAMS.SCALE;
                let myY = ground.y * PARAMS.SCALE;
                let myW = ground.width * PARAMS.SCALE;
                let myH = ground.height * PARAMS.SCALE;

                //ctx.fillRect(this.x + myX, this.y + (this.h - myY + 3/2 * PARAMS.SCALE), myW, myH);
                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, myW, myH);
            }
        }

        //wall
        ctx.fillStyle = this.colors.wall;
        if (this.level.walls) {
            for (var i = 0; i < this.level.walls.length; i++) {
                let wall = this.level.walls[i];
                let myX = wall.x * PARAMS.SCALE;
                let myY = wall.y * PARAMS.SCALE;
                let myW = PARAMS.SCALE;
                let myH = wall.height * PARAMS.SCALE;

                //ctx.fillRect(this.x + myX, this.y + (this.h - myY + 3/2 * PARAMS.SCALE), myW, myH);
                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, myW, myH);
            }
        }

        //brick
        ctx.fillStyle = this.colors.brick;
        if (this.level.bricks) {
            for (var i = 0; i < this.level.bricks.length; i++) {
                let brick = this.level.bricks[i];
                let myX = brick.x * PARAMS.SCALE;
                let myY = brick.y * PARAMS.SCALE;
                let myW = brick.width * PARAMS.SCALE;
                let myH = brick.height * PARAMS.SCALE;

                //ctx.fillRect(this.x + myX, this.y + (this.h - myY + 3/2 * PARAMS.SCALE), myW, myH);
                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, myW, myH);
            }
        }

        //spike
        ctx.fillStyle = this.colors.spike;
        if (this.level.spikes) {
            for (var i = 0; i < this.level.spikes.length; i++) {
                let spike = this.level.spikes[i];
                let myX = spike.x * PARAMS.SCALE;
                let myY = spike.y * PARAMS.SCALE;
                let myW = spike.width * PARAMS.SCALE;
                let myH = PARAMS.SCALE / 2;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3 + 1/2) * PARAMS.SCALE, myW, myH);
            }
        }

        //platform
        ctx.fillStyle = this.colors.platform;
        if (this.level.platforms) {
            for (var i = 0; i < this.level.platforms.length; i++) {
                let platform = this.level.platforms[i];
                let myX = platform.x * PARAMS.SCALE;
                let myY = platform.y * PARAMS.SCALE;
                let myW = platform.width * PARAMS.SCALE;
                let myH = platform.height * PARAMS.SCALE;

                //ctx.fillRect(this.x + myX, this.y + (this.h - myY + 3/2 * PARAMS.SCALE), myW, myH);
                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, myW, myH);
            }
        }

        //door
        ctx.fillStyle = this.colors.door;
        if (this.level.doors) {
            for (var i = 0; i < this.level.doors.length; i++) {
                let door = this.level.doors[i];
                let myX = door.x * PARAMS.SCALE;
                let myY = door.y * PARAMS.SCALE;
                let myW = door.w * PARAMS.SCALE;
                let myH = door.h * PARAMS.SCALE;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, 2 * PARAMS.SCALE, 3 * PARAMS.SCALE);
            }
        }

        //chest
        ctx.fillStyle = this.colors.chest;
        if (this.level.chests) {
            for (var i = 0; i < this.level.chests.length; i++) {
                let chest = this.level.chests[i];
                let myX = chest.x * PARAMS.SCALE;
                let myY = chest.y * PARAMS.SCALE;
                let myW = PARAMS.SCALE;
                let myH = PARAMS.SCALE;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, myW, myH);
            }
        }

    }

    /**
     * Build a minimap
     * @param {} ctx
     */
     buildMinimapBox(ctx) {
        //ctx.fillStyle = "SpringGreen";
        let miniX = this.x;
        let miniY = this.y;
        let miniW = (this.w * PARAMS.SCALE) + this.xOffset;
        let miniH = (this.h * PARAMS.SCALE) + this.yOffset;

        //ctx.fillText("Minimap", miniX, miniY - 10);
        ctx.fillStyle = rgba(41, 41, 41, 0.5);
        ctx.fillRect(miniX, miniY, miniW, miniH);
        ctx.strokeStyle = "GhostWhite";
        ctx.strokeRect(miniX, miniY, miniW, miniH);
    }

    update() {

    };
};
