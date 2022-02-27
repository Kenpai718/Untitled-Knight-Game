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
        this.velocity = { x: 0, y: 0 };
        this.anchor = { right: false, bottom: false };
        this.defaultMusic = MUSIC.CHASING_DAYBREAK;

        //game status
        this.title = false;
        this.transition = false;
        this.gameOver = false;
        this.usingLevelSelect = false;

        this.levelH = 0;
        this.levelW = 0;
        //how many kills needed to pass the level
        this.killCount = 0;
        this.killsRequired = 0;
        this.levelTimer = 0;

        //cooldown to prevent resetting immediately after getting to results screen
        this.bufferTimer = 0;
        this.maxBufferTime = 1;

        //levels array to load levels by calling levels[0], levels[1], etc
        this.makeTextBox();
        this.currentLevel = 1; // CHANGE TO 1 BEFORE SUBMISSION
        this.setupAllLevels();
        this.loadTitle();
        this.loadPaused();
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
        x = (this.game.surfaceWidth / 2) - ((40 * 12) / 2);
        y = (this.game.surfaceHeight / 2) + 40 * 6;
        this.levelSelectBB = new BoundingBox(x, y, 40 * 12, -40);

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
                "ESC: Pause Game",
            ];
        let creditInfo =
            ["Developed by:",
                "Kenneth Ahrens",
                "Andre Larson",
                "Embert Pezzali",
                "David Shcherbina",
                "",
                "TCSS 491: Computational Worlds",
                "Project started in Winter 2022",
                "Special Thanks to Chris Marriot!"
            ]

        let creditX = 860;
        let creditY = 1210;
        let controlX = 870;
        let controlY = 1270;
        this.myControlBox = new SceneTextBox(this.game, controlX, controlY, controlInfo);
        this.myCreditBox = new SceneTextBox(this.game, creditX, creditY, creditInfo);

        //load title animation
        this.loadTitleScene();
    };


    /**
     * Transition Screen
     */
    loadTransition() {
        this.bufferTimer = 0;
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

    loadPaused() {
        var x = (this.game.surfaceWidth / 2) - ((40 * 8) / 2);
        var y = (this.game.surfaceHeight / 2) - 40;
        this.controlsPauseBB = new BoundingBox(x, y, 40 * 8, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 8) / 2);
        y = (this.game.surfaceHeight / 2) + 40;
        this.restartPauseBB = new BoundingBox(x, y, 40 * 8, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 9) / 2);
        y = (this.game.surfaceHeight / 2) + 40 * 3;
        this.returnMenuPauseBB = new BoundingBox(x, y, 40 * 9, -40);
    }

    /**
     * MUST BE CALLED BEFORE LOADING A LEVEL!!!
     * Initialize all levels into levels array
     */
    setupAllLevels() {
        let levelZero = testLevel;
        let levelOne = level1_1;
        let levelTwo = level1_2;
        let levelThree = level1_3;
        let levelFour = level1_4;
        let boss1 = levelBoss1;
        this.levels = [levelZero, levelOne, levelTwo, levelThree, levelFour, boss1];
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

        this.game.roll = false;
        this.game.attack = false;
        this.game.jump = false;
        this.game.down = false;
        this.game.shoot = false;

        this.player = this.lastPlayer ? this.lastPlayer : new Knight(this.game, 0, 0);
        if (this.lastPlayer) {
            this.player.removeFromWorld = false;
            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
            this.player.x = 0;
            this.player.x = 0;
            this.player.action = this.player.states.idle;
            this.player.updateBB();
        }
        this.player.x = spawnX - this.player.BB.width - PARAMS.BLOCKDIM;
        this.player.y = spawnY - this.player.BB.height - PARAMS.BLOCKDIM;
        this.inventory = this.player.myInventory;
        this.heartsbar = new HeartBar(this.game, this.player);
        this.vignette = new Vignette(this.game);
        if (!this.lastPlayer) this.game.addEntity(this.player);
    };

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
            // save level state
            this.levelState[this.currentLevel] = {
                enemies: [...this.game.enemies], interactables: [...this.game.interactables],
                events: [...this.game.events], killCount: this.killCount
            };
            // save player state
            this.lastPlayer = this.player;
            // save initial player hp and inventory upon entering a level
            this.lastHP = this.player.hp;
            this.lastInventory = new Inventory(this.game);
            this.lastInventory.copyInventory(this.player.myInventory);
        } else {
            // if player dies reset their hp and inventory to what it was upon entering the level
            if (this.restart && this.lastPlayer) {
                this.player.hp = this.lastHP;
                this.player.myInventory = new Inventory(this.game)
                this.player.myInventory.copyInventory(this.lastInventory);
                this.player.dead = false;
            }
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
        this.clearLayer(this.game.events);
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
        //updates from outside canvas (debug or volume)
        this.updateAudio();
        PARAMS.AUTO_FOCUS = document.getElementById("mouse-focus").checked;
        PARAMS.DEBUG = document.getElementById("debug").checked;
        if (this.game.debug) {
            this.game.debug = false;
            document.getElementById("debug").checked = !document.getElementById("debug").checked;
        }

        //update game camera in terms of ints
        if (!this.title && !this.transition && !PAUSED) {
            this.updateGUI();
            this.BBCamera();

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        }

        //update related screen menus
        this.updateTitleScreen();
        this.updateResultScreen();
        this.updatePauseMenu();

        //update game timer
        if (!this.transition && !this.title && !PAUSED) this.levelTimer += this.game.clockTick;

        //debugging camera updates
        if (PARAMS.DEBUG) {
            /**
             * Debug tool
             * gives diamonds by toggling debug mode
             * use to test the shop!
             */
            if (this.currentLevel == 0) {
                this.player.myInventory.diamonds = 999;
            }
        }

    };

    updateTitleScreen() {
        if (this.title) {
            //keep attemping to play title music until the user clicks
            if (!MUSIC_MANAGER.isPlaying(MUSIC.TITLE)) {
                //console.log("attempting to play title music");
                if (this.game.userInteracted) {
                    MUSIC_MANAGER.pauseBackgroundMusic();
                    MUSIC_MANAGER.autoRepeat(MUSIC.TITLE);
                    MUSIC_MANAGER.playAsset(MUSIC.TITLE);
                }
            }

            //update menu buttons
            this.textColor = 0;
            if (this.game.mouse) {
                if (this.startGameBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 1;
                } else if (this.controlsBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 2;
                } else if (this.creditsBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 3;
                } else if (this.levelSelectBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 4;
                }
            }
            if (this.game.click) {
                if (this.startGameBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    ASSET_MANAGER.playAsset(SFX.SELECT);
                    this.game.myReportCard.reset();
                    this.game.attack = false;
                    this.loadLevel(this.currentLevel, false);
                } else if (this.controlsBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    this.credits = false;
                    this.controls = !this.controls;
                } else if (this.creditsBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    this.controls = false;
                    this.credits = !this.credits;
                } else if (this.levelSelectBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    //hide the button after you click it
                    if (!this.usingLevelSelect) {
                        ASSET_MANAGER.playAsset(SFX.CLICK);
                        ASSET_MANAGER.playAsset(SFX.SELECT);
                        this.loadLevelSelect();
                    }
                }
                this.game.click = null;
            }
        }
    }

    updatePauseMenu() {
        if (PAUSED) {
            this.textColor = 0;
            if (this.game.mouse) {
                if (this.controlsPauseBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 1;
                    //console.log("hovering pause");
                } else if (this.restartPauseBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    //console.log("hovering restart");
                    this.textColor = 2;
                } else if (this.returnMenuPauseBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    //console.log("hovering menu");
                    this.textColor = 3;
                }
            }
            if (this.game.click) {
                if (this.controlsPauseBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.SELECT);
                    this.controls = !this.controls;
                } else if (this.restartPauseBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.SELECT);
                    PAUSED = false;
                    this.loadLevel(this.currentLevel);
                } else if (this.returnMenuPauseBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.SELECT);
                    PAUSED = false;
                    this.returnToMenu();
                }
                this.game.click = null;
            }
        }
    }

    updateResultScreen() {
        if (this.transition) {
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

            this.bufferTimer += this.game.clockTick;
            if (this.game.click && this.bufferTimer > this.maxBufferTime) {
                if (this.nextLevelBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    // load next level code goes here when level 2 is added
                    this.game.myReportCard.reset();
                    this.levelTimer = 0;
                } else if (this.restartLevelBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    this.restartLevel();
                } else if (this.returnToMenuBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    this.returnToMenu();
                }
                this.game.click = null;
            }
        }
    }

    /**
     * Menu Options
     */
    returnToMenu() {
        this.usingLevelSelect = false;
        this.currentLevel = 1;
        this.levelState = [];
        this.lastPlayer = null;
        this.title = true;
        this.transition = false;
        this.controls = false;
        this.credits = false;
        this.myControlBox.show = false;
        this.myCreditBox.show = false;
        this.resetCamera();
        this.loadTitle();
    }

    restartLevel() {
        this.currentLevel = 1;
        this.levelState = [];
        this.lastPlayer = null;
        this.game.attack = false;
        this.loadLevel(this.currentLevel, false);
        this.game.myReportCard.reset();
    }

    loadLevelSelect() {
        this.usingLevelSelect = true;
        this.controls = false;
        this.credits = false;
        this.clearEntities();
        this.loadScene(levelLoader, levelLoader.player.x, levelLoader.player.y);
    }

    loadTitleScene() {
        this.clearEntities();
        this.loadScene(titleScene, titleScene.player.x, titleScene.player.y);
    }

    resetCamera() {
        this.x = 0;
        this.y = 0;
    }

    BBCamera() {
        let xToLeft = this.player.BB.left - this.player.x;
        let xtoRight = this.player.BB.right - this.player.x;
        if (this.player.BB.left < 0) this.player.x = 0 - this.player.offsetxBB;
        else if (this.player.BB.right > this.level.width * PARAMS.BLOCKDIM) this.player.x = (this.level.width * PARAMS.BLOCKDIM) - this.player.width;
        if (this.x + this.game.surfaceWidth * 9 / 16 < this.player.BB.left  && this.x + this.game.surfaceWidth < this.level.width * PARAMS.BLOCKDIM) this.x = this.player.BB.left - this.game.surfaceWidth * 9 / 16;
        else if (this.x > this.player.BB.right - this.game.surfaceWidth * 7 / 16 && this.x > 0) this.x = this.player.BB.right - this.game.surfaceWidth * 7 / 16;

        if (this.x < 0) this.x = 0;
        else if (this.x + this.game.surfaceWidth > this.level.width * PARAMS.BLOCKDIM) this.x = this.level.width * PARAMS.BLOCKDIM - this.game.surfaceWidth;
        if (this.y < this.player.y - this.game.surfaceHeight * 3 / 16 && this.y + this.game.surfaceHeight < this.level.height * PARAMS.BLOCKDIM) this.y = this.player.y - this.game.surfaceHeight * 3 / 16;
        else if (this.y > this.player.y - this.game.surfaceHeight * 1 / 16 && this.y > 0) this.y = this.player.y - this.game.surfaceHeight * 1 / 16;
        if (this.y < 0) this.y = 0;
        else if (this.y + this.game.surfaceHeight > this.level.height * PARAMS.BLOCKDIM) this.y = this.level.height * PARAMS.BLOCKDIM - this.game.surfaceHeight;
    }

    velCamera() {
        if (this.player.velocity.y >= 0) {
            this.scrollTime = 0;
        }
        if (this.x + this.game.surfaceWidth < this.player.BB.right) {
            this.x = this.player.BB.right - this.game.surfaceWidth * 10 / 16;
        }
        else if (this.x > this.player.BB.left) {
            this.x = this.player.BB.left - this.game.surfaceWidth * 6 / 16;
        }

        if (this.game.right && !this.game.left) {
            this.anchor.right = true;
        }
        if (this.game.left && !this.game.right) {
            this.anchor.right = false;
        }
        if (this.anchor.right) {
            if (this.x + this.game.surfaceWidth * 6 / 16 < this.player.BB.left) {
                if (this.player.facing == this.player.dir.right)
                    this.x += (this.player.velocity.x + Math.abs(this.player.velocity.x) * 3 / 4) * this.game.clockTick;
                else
                    this.x += (this.player.velocity.x + Math.abs(this.player.velocity.x) * 1 / 4) * this.game.clockTick;
            }
            else if (this.x + this.game.surfaceWidth * 6 / 16 < this.player.BB.right)
                this.x += this.player.velocity.x * this.game.clockTick;
        }
        else {
            if (this.x + this.game.surfaceWidth * 10 / 16 > this.player.BB.right) {
                if (this.player.facing == this.player.dir.left)
                    this.x += (this.player.velocity.x - Math.abs(this.player.velocity.x) * 3 / 4) * this.game.clockTick;
                else
                    this.x += (this.player.velocity.x - Math.abs(this.player.velocity.x) * 1 / 4) * this.game.clockTick;
            }
            else if (this.x + this.game.surfaceWidth * 10 / 16 > this.player.BB.left)
                this.x += this.player.velocity.x * this.game.clockTick;
        }

        if (this.x <= 0) {
            this.x = 0;
            this.anchor.right = true;
        }
        else if (this.x + this.game.surfaceWidth >= this.level.width * PARAMS.BLOCKDIM) {
            this.x = this.level.width * PARAMS.BLOCKDIM - this.game.surfaceWidth;
            this.anchor.right = false;
        }

        if (this.y + this.game.surfaceHeight < this.player.BB.bottom) {
            this.y = this.player.BB.bottom + this.game.surfaceWidth * 10 / 16;
        }
        else if (this.y > this.player.BB.top) {
            this.y = this.player.BB.bottom - this.game.surfaceWidth * 6 / 16;
        }

        if (this.player.velocity.y < 0) {
            this.scrollTime += this.game.clockTick;
            this.anchor.bottom = false;
        }
        if (this.player.velocity.y >= 450) {
            this.anchor.bottom = true;
        }

        if (this.anchor.bottom) {
            if (this.y + this.game.surfaceHeight * 4 / 16 < this.player.BB.top)
                this.y += (this.player.velocity.y + Math.abs(this.player.velocity.y) * 3 / 4) * this.game.clockTick;
            else if (this.y + this.game.surfaceHeight * 4 / 16 < this.player.BB.bottom)
                this.y += this.player.velocity.y * this.game.clockTick;
        }
        else {
            if (this.scrollTime > .15) {
                if (this.y + this.game.surfaceHeight * 12 / 16 > this.player.BB.bottom)
                    this.y += (this.player.velocity.y - Math.abs(this.player.velocity.y) * 6 / 4) * this.game.clockTick;
                else if (this.y + this.game.surfaceHeight * 12 / 16 > this.player.BB.top)
                    this.y += this.player.velocity.y * this.game.clockTick;
            }
        }

        if (this.y <= 0) {
            this.y = 0;
            this.anchor.bottom = true;
        }
        else if (this.y + this.game.surfaceHeight >= this.level.height * PARAMS.BLOCKDIM) {
            this.y = this.level.height * PARAMS.BLOCKDIM - this.game.surfaceHeight;
            this.anchor.bottom = false;
        }

        if (this.player.BB.left < 0) this.player.x -= this.player.BB.left;
        else if (this.player.BB.right > this.level.width * PARAMS.BLOCKDIM) {
            this.player.x -= this.player.BB.right - this.level.width * PARAMS.BLOCKDIM;
        }


    }

    updateGUI() {
        this.vignette.update();
        this.heartsbar.update();
        this.inventory.update();
        this.myTextBox.update();
    };

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("sfx-volume").value;
        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

        volume = document.getElementById("music-volume").value;
        MUSIC_MANAGER.muteAudio(mute);
        MUSIC_MANAGER.adjustVolume(volume)
    };

    drawHUD(ctx) {
        ctx.fillStyle = "White";
        this.vignette.draw(ctx);
        this.inventory.draw(ctx);
        this.heartsbar.draw(ctx);
        this.drawTextBox(ctx);
    };


    draw(ctx) {
        this.drawGameplayGUI(ctx);
        this.drawTitleGUI(ctx);
        this.drawResultsGUI(ctx);

    };

    drawGameplayGUI(ctx) {
        if (!this.title && !this.transition) {
            //current level
            ctx.font = PARAMS.BIG_FONT; //this is size 20 font
            ctx.fillStyle = "White";

            //labels on top right
            //level label
            let levelLabel = "Level:" + this.level.label;
            let offset = getRightTextOffset(levelLabel, 20);
            let yOffset = 35;
            ctx.fillText(levelLabel, this.game.surfaceWidth - offset, yOffset);
            //level timer label: converted to HH:MM:SS
            let currentTime = "Time:" + Math.round(this.levelTimer).toString().toHHMMSS();
            offset = getRightTextOffset(currentTime, 20);
            ctx.fillText(currentTime, this.game.surfaceWidth - offset, yOffset * 2);
            //quota label
            let quotaLabel = "Kill Quota:" + this.killCount + "/" + this.killsRequired;
            offset = getRightTextOffset(quotaLabel, 20);
            if (this.killCount >= this.killsRequired) ctx.fillStyle = "SpringGreen";
            ctx.fillText(quotaLabel, this.game.surfaceWidth - offset, yOffset * 3);

            //draw gui like hearts, inventory etc
            this.drawHUD(ctx);

            //pause screen
            if (PAUSED) {
                var fontSize = 60;
                ctx.font = fontSize + 'px "Press Start 2P"';

                let title = "PAUSED";
                ctx.fillStyle = "Orchid";
                ctx.fillText(title, (this.game.surfaceWidth / 2) - ((fontSize * title.length) / 2) + 5, fontSize * 7 + 5);
                ctx.fillStyle = "GhostWhite";
                ctx.fillText(title, (this.game.surfaceWidth / 2) - ((fontSize * title.length) / 2), fontSize * 7);

                buildButton(ctx, "Controls", this.controlsPauseBB, this.textColor == 1 || this.controls);
                buildButton(ctx, "Restart", this.restartPauseBB, this.textColor == 2);
                buildButton(ctx, "Main Menu", this.returnMenuPauseBB, this.textColor == 3);

                if (this.controls) {
                    this.myControlBox.show = true;
                    this.myControlBox.draw(ctx);
                } else { //so control and reportbox dont overlap
                    this.game.myReportCard.drawReportCard(ctx);
                }

            }

            if (PARAMS.DEBUG) {
                this.viewDebug(ctx);
                this.minimap.draw(ctx);
            }
        }
    }

    drawTitleGUI(ctx) {
        if (this.title) {
            var fontSize = 60;
            var titleFont = fontSize + 'px "Press Start 2P"';
            ctx.font = "Bold" + titleFont;
            ctx.fillStyle = "White";
            let gameTitle = "Untitled Knight Game";

            ctx.font = titleFont;
            ctx.fillStyle = "Orchid";
            ctx.fillText(gameTitle, (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2) + 5, fontSize * 3 + 5);
            ctx.fillStyle = "GhostWhite";
            ctx.fillText(gameTitle, (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2), fontSize * 3);
            buildTextButton(ctx, "Start Game", this.startGameBB, this.textColor == 1, "DeepPink");
            buildTextButton(ctx, "Controls", this.controlsBB, this.textColor == 2 || this.controls, "DeepSkyBlue");
            buildTextButton(ctx, "Credits", this.creditsBB, this.textColor == 3 || this.credits, "DeepSkyBlue");
            if (!this.usingLevelSelect) buildButton(ctx, "Level Select", this.levelSelectBB, this.textColor == 4);
            ctx.strokeStyle = "Red";

            if (this.controls) {
                this.myControlBox.show = true;
                this.myControlBox.draw(ctx);
            }
            if (this.credits) {
                this.myCreditBox.show = true;
                this.myCreditBox.draw(ctx);
            }

            if(PAUSED) {
                var fontSize = 60;
                ctx.font = fontSize + 'px "Press Start 2P"';

                let title = "PAUSED";
                ctx.fillStyle = "Orchid";
                ctx.fillText(title, (this.game.surfaceWidth / 2) - ((fontSize * title.length) / 2) + 5, fontSize * 7 + 5);
                ctx.fillStyle = "GhostWhite";
                ctx.fillText(title, (this.game.surfaceWidth / 2) - ((fontSize * title.length) / 2), fontSize * 7);
            }
        }
    }

    drawResultsGUI(ctx) {
        if (this.transition) {
            var fontSize = 60;
            ctx.font = fontSize + 'px "Press Start 2P"';
            ctx.fillStyle = "Orchid";
            let gameTitle = "Level Complete!";
            ctx.fillText("Level Complete!", (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2) + 5, fontSize * 3 + 5);
            ctx.fillStyle = "White";
            ctx.fillText("Level Complete!", (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2), fontSize * 3);
            ctx.font = '40px "Press Start 2P"';
            buildTextButton(ctx, "Next Level", this.nextLevelBB, false, "gray"); //set this once there is another level
            buildTextButton(ctx, "Restart Game", this.restartLevelBB, this.textColor == 2 && this.bufferTimer > this.maxBufferTime, "DeepSkyBlue");
            buildTextButton(ctx, "Return To Menu", this.returnToMenuBB, this.textColor == 3 && this.bufferTimer > this.maxBufferTime, "DeepSkyBlue");

            this.game.myReportCard.drawReportCard(ctx);
        }
    }

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
        if (this.myTextBox) this.myTextBox.setMessage("", false);

        //reset quota
        this.killsRequired = 0; //set by the door class later in this method
        this.remainingKills = 0;

        //make a minimap for the level
        this.setupMinimap();

        //play the music if it is not already playing
        if (!this.title) {
            if (scene.music && !MUSIC_MANAGER.isPlaying(scene.music)) {
                MUSIC_MANAGER.pauseBackgroundMusic();
                MUSIC_MANAGER.autoRepeat(scene.music);
                MUSIC_MANAGER.playAsset(scene.music);
            } else if (!scene.music && !MUSIC_MANAGER.isPlaying(this.defaultMusic)) { //no music set play default music
                MUSIC_MANAGER.pauseBackgroundMusic();
                MUSIC_MANAGER.autoRepeat(this.defaultMusic);
                MUSIC_MANAGER.playAsset(this.defaultMusic);
            }
        }

        let entities = [];
        this.loadEnvironment(h, entities, this.level);
        this.loadStaticEntities(h, entities, this.level);

        // if the level being loaded hasnt been saved, load enemies and interactables like normal
        // ANY NEW ENEMIES MUST BE ADDED HERE
        if (!this.levelState[this.currentLevel]) {
            this.loadDynamicEntities(h, entities, this.level);
            this.loadEnemies(h, entities, this.level);

            if (this.level.secrets) {
                for (var i = 0; i < this.level.secrets.length; i++) {
                    let secret = this.level.secrets[i];
                    let secrets = [];
                    this.loadEnvironment(h, secrets, secret);
                    this.game.addEntity(new Secret(this.game, secrets, false, secret.indicate));
                }
            }
            if (this.level.events) {
                for (var i = 0; i < this.level.events.length; i++) {
                    let event = this.level.events[i];
                    let space = [];
                    for (var j = 0; j < event.space.length; j++) {
                        let s = event.space[j];
                        space.push(new Barrier(this.game, s.x, h - s.y - 1, s.width, s.height));
                    }
                    let blocks = [];
                    let enemies = [];
                    this.loadEnvironment(h, blocks, event);
                    this.loadEnemies(h, enemies, event);
                    this.game.addEntity(new Event(this.game, space, blocks, enemies, false, false));
                }
            }
        } else { // load the enemies and interactables from their previous state
            this.game.enemies = [...this.levelState[this.currentLevel].enemies];
            this.game.enemies.forEach(enemy => enemy.removeFromWorld = false);
            this.game.events = [...this.levelState[this.currentLevel].events];
            this.game.events.forEach(events => events.removeFromWorld = false);
            this.game.interactables = [...this.levelState[this.currentLevel].interactables];
            var that = this;
            this.game.interactables.forEach(interactable => {
                // if obelisk, add associated blocks as well
                if (interactable instanceof Obelisk) {
                    interactable.bricks.removeFromWorld = false;
                    that.game.addEntity(interactable.bricks);
                } else if (interactable instanceof Door) {
                    that.killsRequired = Math.max(interactable.killQuota, that.killsRequired);
                }
                interactable.removeFromWorld = false
            });
        }
        this.loadBackground(h, entities, this.level);
        let self = this;
        entities.forEach(entity => self.game.addEntity(entity));

    }

    loadEnvironment(h, array, dict) {
        //load environment entities
        if (dict.ground) {
            for (var i = 0; i < dict.ground.length; i++) {
                let ground = dict.ground[i];
                array.push(new Ground(this.game, ground.x, h - ground.y - 1, ground.width, 1, ground.type));
            }
        }
        if (dict.trap) {
            for (var i = 0; i < dict.trap.length; i++) {
                let trap = dict.trap[i];
                array.push(new TrappedFloor(this.game, trap.x, h - trap.y - 1, trap.width, 1, trap.type, trap.percent, trap.rate));
            }
        }
        if (dict.bricks) {
            for (var i = 0; i < dict.bricks.length; i++) {
                let bricks = dict.bricks[i];
                array.push(new Brick(this.game, bricks.x, h - bricks.y - 1, bricks.width, bricks.height));
            }
        }
        if (dict.platforms) {
            for (var i = 0; i < dict.platforms.length; i++) {
                let platforms = dict.platforms[i];
                array.push(new Platform(this.game, platforms.x, h - platforms.y - 1, platforms.width, platforms.height));
            }
        }
        if (dict.walls) {
            for (var i = 0; i < dict.walls.length; i++) {
                let walls = dict.walls[i];
                array.push(new Walls(this.game, walls.x, h - walls.y - 1, 1, walls.height, walls.type));
            }
        }
        if (dict.blocks) {
            for (var i = 0; i < dict.blocks.length; i++) {
                let blocks = dict.blocks[i];
                array.push(new Block(this.game, blocks.x, h - blocks.y - 1, blocks.width, blocks.height));
            }
        }
    }

    loadStaticEntities(h, array, dict) {
        if (dict.signs) {
            for (var i = 0; i < dict.signs.length; i++) {
                let sign = dict.signs[i];
                array.push(new Sign(this.game, sign.x, h - sign.y, sign.text, sign.title));
            }
        }

        //npc
        if (dict.npcs) {
            for (var i = 0; i < dict.npcs.length; i++) {
                let npc = dict.npcs[i];
                let e = new NPC(this.game, 0, 0);
                this.positionEntity(e, npc.x, h - npc.y);
                array.push(e);
            }
        }
    }

    loadDynamicEntities(h, array, dict) {
        if (dict.chests) {
            for (var i = 0; i < dict.chests.length; i++) {
                let chest = dict.chests[i];
                array.push(new Chest(this.game, chest.x, h - chest.y - 1, chest.direction));
            }
        }
        if (dict.obelisks) {
            for (var i = 0; i < dict.obelisks.length; i++) {
                let obelisk = dict.obelisks[i];
                array.push(new Obelisk(this.game, obelisk.x, h - obelisk.y - 1 - 3, obelisk.brickX, obelisk.brickY, obelisk.brickWidth, obelisk.brickHeight));
            }
        }
        if (dict.doors) {
            for (var i = 0; i < dict.doors.length; i++) {
                let door = dict.doors[i];
                array.push(new Door(this.game, door.x, h - door.y - 1, door.killQuota, door.exitLocation, door.transition));

                //update the kill requirement for the level based on the max door
                this.killsRequired = Math.max(door.killQuota, this.killsRequired);
            }
        }
    }

    loadEnemies(h, array, dict) {
        if (dict.shrooms) {
            for (var i = 0; i < dict.shrooms.length; i++) {
                let shroom = dict.shrooms[i];
                let e = new Mushroom(this.game, 0, 0, shroom.guard);
                this.positionEntity(e, shroom.x, h - shroom.y);
                array.push(e);
            }
        }
        if (dict.goblins) {
            for (var i = 0; i < dict.goblins.length; i++) {
                let goblin = dict.goblins[i];
                let e = new Goblin(this.game, 0, 0, goblin.guard);
                this.positionEntity(e, goblin.x, h - goblin.y);
                array.push(e);
            }
        }
        if (dict.skeletons) {
            for (var i = 0; i < dict.skeletons.length; i++) {
                let skeleton = dict.skeletons[i];
                let e = new Skeleton(this.game, 0, 0, skeleton.guard);
                this.positionEntity(e, skeleton.x, h - skeleton.y);
                array.push(e);
            }
        }
        if (dict.demon) {
            let demon = dict.demon;
            let e = new DemonSlime(this.game, demon.x, h - demon.y, false);
            this.positionEntity(e, demon.x, h - demon.y);
            array.push(e);
        }
        if (dict.flyingeyes) {
            for (var i = 0; i < dict.flyingeyes.length; i++) {
                let flyingeye = dict.flyingeyes[i];
                let e = new FlyingEye(this.game, 0, 0, flyingeye.guard);
                this.positionEntity(e, flyingeye.x, h - flyingeye.y);
                array.push(e);
            }
        }
        if (dict.wizard) {
            let wizard = dict.wizard;
            let e = new Wizard(this.game, 0, 0, wizard.left, wizard.right, wizard.top, wizard.bottom, h);
            this.positionEntity(e, wizard.x, h - wizard.y);
            array.push(e);
        }
    }

    loadBackground(h, array, dict) {
        //load backgroound assets
        if (dict.torches) {
            for (var i = 0; i < dict.torches.length; i++) {
                let torch = dict.torches[i];
                array.push(new Torch(this.game, torch.x, h - torch.y - 1));
            }
        }
        if (dict.windows) {
            for (var i = 0; i < dict.windows.length; i++) {
                let w = dict.windows[i];
                array.push(new Window(this.game, w.x, h - w.y - 1, w.width, w.height));
            }
        }
        if (dict.banners) {
            for (var i = 0; i < dict.banners.length; i++) {
                let banner = dict.banners[i];
                array.push(new Banner(this.game, banner.x, h - banner.y - 1));
            }
        }

        if (dict.spikes) {
            for (var i = 0; i < dict.spikes.length; i++) {
                let spike = this.level.spikes[i];
                array.push(new Spike(this.game, spike.x, h - spike.y - 1, spike.width, 0.5));
            }
        }
        if (dict.columns) {
            for (var i = 0; i < dict.columns.length; i++) {
                let column = dict.columns[i];
                array.push(new Column(this.game, column.x, h - column.y - 1, column.height));
            }
        }
        if (dict.supports) {
            for (var i = 0; i < dict.supports.length; i++) {
                let support = dict.supports[i];
                array.push(new Support(this.game, support.x, (h - support.y - 1), support.width));
            }
        }
        if (dict.chains) {
            for (var i = 0; i < dict.chains.length; i++) {
                let chain = dict.chains[i];
                array.push(new Chain(this.game, chain.x, h - chain.y - 1));
            }
        }
        if (dict.ceilingChains) {
            for (var i = 0; i < dict.ceilingChains.length; i++) {
                let ceilingChain = dict.ceilingChains[i];
                array.push(new CeilingChain(this.game, ceilingChain.x, h - ceilingChain.y - 1, ceilingChain.height));
            }
        }
        if (dict.backgroundWalls) {
            for (var i = 0; i < dict.backgroundWalls.length; i++) {
                let bw = dict.backgroundWalls[i];
                array.push(new BackgroundWalls(this.game, bw.x, h - bw.y - 1, bw.width, bw.height));
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

    getLevelTimer() {
        return Math.round(this.levelTimer).toString().toHHMMSS();
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
            trap: "orange",
            brick: "silver",
            wall: "maroon",
            platform: "purple",
            spike: "orange",
            player: "blue",
            enemy: "red",
            projectile: "turquoise",
            npc: "green",
            chest: "yellow",
            door: "SpringGreen",
            sign: "bisque",
            obelisk: "DarkSlateBlue",
            obeliskBrick: "CornflowerBlue"
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
        //ctx.globalAlpha = 0.7;
        this.buildMinimapBox(ctx);
        this.loadEnvironmentScene(ctx);
        this.traceEntities(ctx);
        //ctx.globalAlpha = 1;

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

        let myProjectiles = this.game.projectiles;
        for (var i = 0; i < myProjectiles.length; i++) {
            let entity = myProjectiles[i];
            ctx.fillStyle = this.colors.projectile;
            this.drawEntity(ctx, entity);
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

        ctx.fillStyle = this.colors.trap;
        if (this.level.trap) {
            for (var i = 0; i < this.level.trap.length; i++) {
                let trap = this.level.trap[i];
                let myX = trap.x * PARAMS.SCALE;
                let myY = trap.y * PARAMS.SCALE;
                let myW = trap.width * PARAMS.SCALE;
                let myH = trap.height * PARAMS.SCALE;

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
                ctx.fillStyle = this.colors.obelisk;
                let obelisk = this.level.obelisks[i];
                //draw obelisk
                let myX = obelisk.x * PARAMS.SCALE;
                let myY = obelisk.y * PARAMS.SCALE;
                let myW = PARAMS.SCALE * 2;
                let myH = PARAMS.SCALE * 2;
                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 2) * PARAMS.SCALE, myW, myH);

                //draw obelisk bricks
                ctx.fillStyle = this.colors.obeliskBrick;
                myX = obelisk.brickX * PARAMS.SCALE;
                myY = obelisk.brickY * PARAMS.SCALE;
                myW = obelisk.brickWidth * PARAMS.SCALE;
                myH = obelisk.brickHeight * PARAMS.SCALE;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, myW, myH);
            }
        }
        let self = this;
        this.game.events.forEach(function (secret) {
            if (!secret.finished) {
                secret.space.forEach(function (s) {
                    let myX = s.x * PARAMS.SCALE;
                    let myY = (self.h - s.y - 4) * PARAMS.SCALE;
                    let myW = s.w * PARAMS.SCALE;
                    let myH = s.h * PARAMS.SCALE;

                    if (s instanceof Brick)
                        ctx.fillStyle = self.colors.brick;
                    ctx.fillRect(self.x + myX, self.y + self.h * PARAMS.SCALE - myY, myW, myH);

                });
            }
        });

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
