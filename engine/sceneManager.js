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
        this.transition = false;
        this.gameOver = false;

        this.levelH = 0;
        this.levelW = 0;
        //how many kills needed to pass the level
        this.killCount = 0;
        this.killsRequired = 0;

        //levels array to load levels by calling levels[0], levels[1], etc
        this.makeTextBox();
        this.currentLevel = 1; // CHANGE TO 1 BEFORE SUBMISSION
        this.setupAllLevels();
        this.loadTitle();
    };

    loadTitle() {
        this.title = true;
        this.levelState = [];
        this.game.addEntity(new Background(this.game));
        var x = (this.game.surfaceWidth / 2) - ((40 * 10) / 2);
        var y = (this.game.surfaceHeight / 2) - 40;
        this.startGameBB = new BoundingBox(x, y, 40 * 10, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 8) / 2);
        y = (this.game.surfaceHeight / 2) + 40;
        this.controlsBB = new BoundingBox(x, y, 40 * 8, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 7) / 2);
        y = (this.game.surfaceHeight / 2) + 40 * 3;
        this.creditsBB = new BoundingBox(x, y, 40 * 7, -40);

        //text boxes for the title screen
        let controlInfo =
            ["Controls:",
                "A: Left",
                "D: Right",
                "S: Crouch",
                "W: Interact",
                "E: Heal/Use-Potion",
                "SPACE: Jump",
                "P/Left-Click: Melee Attack",
                "O/Right-Click: Shoot Arrow",
            ];
        let creditInfo =
            ["Developed by:",
                "Kenneth Ahrens",
                "Andre Larson",
                "Embert Pezzali",
                "David Shcherbina",
                "",
                "Special Thanks to Chris Marriot"
            ]

        let creditX = 860;
        let creditY = 1100;
        let controlX = 870;
        let controlY = 1220;
        this.myControlBox = new SceneTextBox(this.game, controlX, controlY, controlInfo);
        this.myCreditBox = new SceneTextBox(this.game, creditX, creditY, creditInfo);
    };


    /**
     * Transition Screen
     */
    loadTransition() {
        this.transition = true;
        this.clearEntities();
        this.game.addEntity(new Background(this.game));
        var x = (this.game.surfaceWidth / 2) - ((40 * 10) / 2);
        var y = (this.game.surfaceHeight / 2) - 40;
        this.nextLevelBB = new BoundingBox(x, y, 40 * 10, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 13) / 2);
        y = (this.game.surfaceHeight / 2) + 40;
        this.restartLevelBB = new BoundingBox(x, y, 40 * 13, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 14) / 2);
        y = (this.game.surfaceHeight / 2) + 40 * 3;
        this.returnToMenuBB = new BoundingBox(x, y, 40 * 14, -40);
    };

    /**
     * MUST BE CALLED BEFORE LOADING A LEVEL!!!
     * Initialize all levels into levels array
     */
    setupAllLevels() {
        var self = this;
        let levelZero = testLevel;
        let levelOne = level1_1;
        let levelTwo = level1_2;
        let levelThree = level1_3;
        this.levels = [levelZero, levelOne, levelTwo, levelThree];
    }

    /**
     * Draws textbox to the canvas
     * @param {*} ctx
     */
    drawTextBox(ctx) {
        //initialize textbox here because this method could be called before constructor is done
        //had problems where it was null and draw method was called...
        if (this.myTextBox == null) {
            this.makeTextBox();
        }
        this.myTextBox.draw(ctx);

    }

    /**
     * Initializes the main textbox of the canvas
     */
    makeTextBox() {
        this.defaultTextX = (this.game.surfaceWidth / 2);
        this.defaultTextY = 150;
        this.myTextBox = new SceneTextBox(this.game, this.defaultTextX, this.defaultTextY, "Placeholder message");
        this.myTextBox.centerTop();
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
        // save the state of the enemies and interactables for the current level
        if (!this.title && !this.restart && !this.transition) {
            this.levelState[this.currentLevel] = { enemies: [...this.game.enemies], interactables: [...this.game.interactables], killCount: this.killCount };
        } else {
            this.title = false;
            this.restart = false;
            this.transition = false;
        }
        this.clearEntities();
        if (number < 0 || number > this.levels.length - 1) {
            throw "Invalid load level number";
        } else {
            console.log("Loading level " + number);
            this.killCount = !this.levelState[number] ? 0 : this.levelState[number].killCount;
            this.currentLevel = number;
            let lvlData = this.levels[number];
            if (usedDoor) {
                this.loadScene(lvlData, doorExitX, doorExitY);
            } else {
                this.loadScene(lvlData, lvlData.player.x, lvlData.player.y);
            }
        }
    }

    /**
     * Clear the entities list
     */
    clearEntities() {
        this.clearLayer(this.game.background1);
        this.clearLayer(this.game.background2);
        this.clearLayer(this.game.interactables);
        this.clearLayer(this.game.foreground1);
        this.clearLayer(this.game.foreground2);
        this.clearLayer(this.game.enemies);
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
        if (!this.title && !this.transition) {
            //debug key toggle, flip state of debug checkbox
            if (this.game.debug) {
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
            if (this.y < this.player.y - this.game.surfaceHeight * 3 / 16 && this.y + this.game.surfaceHeight < this.level.height * PARAMS.BLOCKDIM) this.y = this.player.y - this.game.surfaceHeight * 3 / 16;
            else if (this.y > this.player.y - this.game.surfaceHeight * 1 / 16 && this.y > 0) this.y = this.player.y - this.game.surfaceHeight * 1 / 16;
            if (this.y < 0) this.y = 0;
            else if (this.y + this.game.surfaceHeight > this.level.height * PARAMS.BLOCKDIM) this.y = this.level.height * PARAMS.BLOCKDIM - this.game.surfaceHeight;

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        } else if (this.title) {
            this.textColor = 0;
            if (this.game.mouse) {
                if (this.startGameBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 1;
                } else if (this.controlsBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 2;
                } else if (this.creditsBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 3;
                }
            }
            if (this.game.click) {
                ASSET_MANAGER.playAsset(SFX.CLICK);
                if (this.startGameBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.game.attack = false;
                    this.loadLevel(this.currentLevel, false);
                } else if (this.controlsBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.credits = false;
                    this.controls = !this.controls;
                } else if (this.creditsBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.controls = false;
                    this.credits = !this.credits;
                }
                this.game.click = null;
            }
        } else if (this.transition) {
            this.textColor = 0;
            if (this.game.mouse) {
                if (this.nextLevelBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 1;
                } else if (this.restartLevelBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 2;
                } else if (this.returnToMenuBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 3;
                }
            }
            if (this.game.click) {
                ASSET_MANAGER.playAsset(SFX.CLICK);
                if (this.nextLevelBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    // load next level code goes here when level 2 is added
                } else if (this.restartLevelBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.currentLevel = 1;
                    this.levelState = [];
                    this.loadLevel(this.currentLevel, false);
                } else if (this.returnToMenuBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.currentLevel = 1;
                    this.levelState = [];
                    this.title = true;
                }
                this.game.click = null;
            }
        }
    };

    updateGUI() {
        this.vignette.update();
        this.heartsbar.update();
        this.inventory.update();
        this.myTextBox.update();
    };

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("volume").value;
        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    drawGUI(ctx) {
        ctx.fillStyle = "White";
        this.vignette.draw(ctx);
        this.inventory.draw(ctx);
        this.heartsbar.draw(ctx);
        this.drawTextBox(ctx);
    };


    draw(ctx) {
        if (!this.title && !this.transition) {
            //current level
            ctx.font = PARAMS.BIG_FONT; //this is size 20 font
            ctx.fillStyle = "White";

            //labels on top right
            //level label
            let levelLabel = "Level:" + this.level.label;
            let offset = getRightTextOffset(levelLabel, 20);
            ctx.fillText(levelLabel, this.game.surfaceWidth - offset, 30);
            //quota label
            let quotaLabel = "Kill Quota:" + this.killCount + "/" + this.killsRequired;
            offset = getRightTextOffset(quotaLabel, 20);
            if (this.killCount >= this.killsRequired) ctx.fillStyle = "SpringGreen";
            ctx.fillText(quotaLabel, this.game.surfaceWidth - offset, 65);

            //draw gui like hearts, inventory etc
            this.drawGUI(ctx);

            if (PARAMS.DEBUG) {
                this.viewDebug(ctx);
                this.minimap.draw(ctx);
            }
        } else if (this.title) {
            var fontSize = 60;
            var titleFont = fontSize + 'px "Press Start 2P"';
            ctx.font = "Bold" + titleFont;
            ctx.fillStyle = "White";
            let gameTitle = "Untitled Knight Game";

            ctx.font = titleFont;
            ctx.fillText(gameTitle, (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2), fontSize * 3);
            ctx.font = '40px "Press Start 2P"';
            ctx.fillStyle = this.textColor == 1 ? "SpringGreen" : "White";
            ctx.fillText("Start Game", this.startGameBB.x, this.startGameBB.y);
            ctx.fillStyle = this.textColor == 2 ? "Grey" : "White";
            ctx.fillText("Controls", this.controlsBB.x, this.controlsBB.y);
            ctx.fillStyle = this.textColor == 3 ? "Grey" : "White";
            ctx.fillText("Credits", this.creditsBB.x, this.creditsBB.y);
            ctx.strokeStyle = "Red";

            if (this.controls) {
                this.myControlBox.show = true;
                this.myControlBox.draw(ctx);
            }
            if (this.credits) {
                this.myCreditBox.show = true;
                this.myCreditBox.draw(ctx);
            }
        } else if (this.transition) {
            var fontSize = 60;
            ctx.font = fontSize + 'px "Press Start 2P"';
            ctx.fillStyle = "White";
            let gameTitle = "Level Complete!";
            ctx.fillText("Level Complete!", (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2), fontSize * 3);
            ctx.font = '40px "Press Start 2P"';
            ctx.fillStyle = "Grey";
            ctx.fillText("Next Level", this.nextLevelBB.x, this.nextLevelBB.y);
            ctx.fillStyle = this.textColor == 2 ? "Grey" : "White";
            ctx.fillText("Restart Level", this.restartLevelBB.x, this.restartLevelBB.y);
            ctx.fillStyle = this.textColor == 3 ? "Grey" : "White";
            ctx.fillText("Return To Menu", this.returnToMenuBB.x, this.returnToMenuBB.y);
        }
    };

    /**
     * How many kills left for the level
     * @param {*} count 
     */
    updateKillQuota(count) {
        this.remainingKills = count;
    };

    /**
     * Reads a level json and builds the level to the canvas
     * based on passed in info.
     * @param {} scene JSON object from levels.js
     * @param {*} spawnX player's spawn x
     * @param {*} spawnY player's spawn y
     */
    loadScene(scene, spawnX, spawnY) {
        //error checking for required level objects data
        if (scene.ID === undefined) throw ("Level must have an ID number that represents its index in levels array.");
        if (scene.label === undefined) throw ("Level must have an label like \'1-1\'");
        if (scene.width === undefined) throw ("Level must have a level width in terms of blockdim. EX: 1 = 82 pixels");
        if (scene.height === undefined) throw ("Level must have a level height in terms of blockdim. EX: 1 = 82 pixels");
        if (scene.player === undefined) throw ("Level must have a player with x and y cordinates.");


        //initialize scene and player
        this.level = scene;
        this.levelH = scene.height;
        this.levelW = scene.width;
        let h = scene.height;
        this.game.addEntity(new Background(this.game));
        this.makePlayer(spawnX, h - spawnY);

        //turn off textbox and only set it up when needed
        if(this.myTextBox) this.myTextBox.setMessage("", false);

        //make a minimap for the level
        this.setupMinimap();

        //play music
        if (scene.music) { //level music when not on title
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.autoRepeat(scene.music);
            ASSET_MANAGER.playAsset(scene.music);
        } else if (!scene.music) { //no music set play default music
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.autoRepeat(this.defaultMusic);
            ASSET_MANAGER.playAsset(this.defaultMusic);
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

        if (this.level.signs) {
            for (var i = 0; i < this.level.signs.length; i++) {
                let sign = this.level.signs[i];
                this.game.addEntity(new Sign(this.game, sign.x, h - sign.y, sign.text, sign.title));
            }
        }

        //npc
        if (this.level.npcs) {
            for (var i = 0; i < this.level.npcs.length; i++) {
                let npc = this.level.npcs[i];
                let e = new NPC(this.game, 0, 0);
                this.positionEntity(e, npc.x, h - npc.y);
                this.game.addEntity(e);
            }
        }

        // if the level being loaded hasnt been saved, load enemies and interactables like normal
        // ANY NEW ENEMIES MUST BE ADDED HERE
        if (!this.levelState[this.currentLevel]) {
            if (this.level.chests) {
                for (var i = 0; i < this.level.chests.length; i++) {
                    let chest = this.level.chests[i];
                    this.game.addEntity(new Chest(this.game, chest.x, h - chest.y - 1, chest.direction));
                }
            }
            if (this.level.obelisks) {
                for (var i = 0; i < this.level.obelisks.length; i++) {
                    let obelisk = this.level.obelisks[i];
                    this.game.addEntity(new Obelisk(this.game, obelisk.x, h - obelisk.y - 1 - 3, obelisk.brickX, obelisk.brickY, obelisk.brickWidth, obelisk.brickHeight));
                }
            }
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
            if (this.level.doors) {
                for (var i = 0; i < this.level.doors.length; i++) {
                    let door = this.level.doors[i];
                    this.game.addEntity(new Door(this.game, door.x, h - door.y - 1, door.killQuota, door.exitLocation, door.transition));

                    //update the kill requirement for the level based on the max door
                    this.killsRequired = Math.max(door.killQuota, this.killsRequired);
                }
            }
        } else { // load the enemies and interactables from their previous state
            this.game.enemies = [...this.levelState[this.currentLevel].enemies];
            this.game.enemies.forEach(enemy => enemy.removeFromWorld = false);
            this.game.interactables = [...this.levelState[this.currentLevel].interactables];
            var that = this;
            this.game.interactables.forEach(interactable => {
                // if obelisk, add associated blocks as well
                if (interactable instanceof Obelisk) {
                    interactable.bricks.removeFromWorld = false;
                    that.game.addEntity(interactable.bricks);
                }
                interactable.removeFromWorld = false
            });
        }
        //load backgroound assets
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
        if (this.level.backgroundWalls) {
            for (var i = 0; i < this.level.backgroundWalls.length; i++) {
                let bw = this.level.backgroundWalls[i];
                this.game.addEntity(new BackgroundWalls(this.game, bw.x, h - bw.y - 1, bw.width, bw.height));
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
        ctx.fillText("ATK", 223, this.game.surfaceHeight - 20);

        // shoot debug

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.shootButton ? "Red" : "SpringGreen";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(270, this.game.surfaceHeight - 40, 60, 30);
        ctx.fillText("Shoot", 275, this.game.surfaceHeight - 20);
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
            npc: "green",
            chest: "yellow",
            door: "SpringGreen",
            sign: "bisque",
            obelisk: "DarkSlateBlue"
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
            if (entity instanceof AbstractPlayer) {
                ctx.fillStyle = this.colors.player;
                this.drawEntity(ctx, entity);
            } else if (entity instanceof NPC) {
                ctx.fillStyle = this.colors.npc;
                this.drawEntity(ctx, entity);
            }
        }

        let myEnemies = this.game.enemies;
        for (var i = 0; i < myEnemies.length; i++) {
            let entity = myEnemies[i];
            if (entity instanceof AbstractEnemy) {
                ctx.fillStyle = this.colors.enemy;
                this.drawEntity(ctx, entity);
            }
        }
    }

    /**
     * Draws a smaller scale of an entity on the minimap
     * @param {} ctx
     * @param {*} entity
     */
    drawEntity(ctx, entity) {
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

        if (this.level.obelisks) {
            for (var i = 0; i < this.level.obelisks.length; i++) {
                let obelisk = this.level.obelisks[i];
                let myX = obelisk.brickX * PARAMS.SCALE;
                let myY = obelisk.brickY * PARAMS.SCALE;
                let myW = obelisk.brickWidth * PARAMS.SCALE;
                let myH = obelisk.brickHeight * PARAMS.SCALE;

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

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3 + 1 / 2) * PARAMS.SCALE, myW, myH);
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

        //sign
        ctx.fillStyle = this.colors.sign;
        if (this.level.signs) {
            for (var i = 0; i < this.level.signs.length; i++) {
                let sign = this.level.signs[i];
                let myX = sign.x * PARAMS.SCALE;
                let myY = sign.y * PARAMS.SCALE;
                let myW = PARAMS.SCALE / 2;
                let myH = PARAMS.SCALE;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 4) * PARAMS.SCALE, myW, myH);
            }
        }

        //obelisk
        ctx.fillStyle = this.colors.obelisk;
        if (this.level.obelisks) {
            for (var i = 0; i < this.level.obelisks.length; i++) {
                let obelisk = this.level.obelisks[i];
                let myX = obelisk.x * PARAMS.SCALE;
                let myY = obelisk.y * PARAMS.SCALE;
                let myW = PARAMS.SCALE / 2;
                let myH = PARAMS.SCALE;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 1) * PARAMS.SCALE, 3 * myW, 3 * myH);
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
