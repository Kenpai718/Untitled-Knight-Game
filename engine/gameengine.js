// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {

    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.background1 = [];
        this.background2 = [];
        this.foreground1 = [];
        this.foreground2 = [];
        this.enemies = [];
        this.interactables = [];
        this.entities = [];
        this.events = [];
        this.projectiles = [];
        this.information = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        //check when user interacts with the game for the first time. It is needed to prevent multiple attempts to play music and bypass
        //browser restrictions!
        this.userInteracted = false; 

        this.myReportCard = new ReportCard(this);

        //controls
        this.left = null;   //A
        this.right = null;  //D
        this.down = null;   //S
        this.up = null;     //W
        this.jump = null;   //space
        this.attack = null; //left click
        this.roll = null;   //left shift
        this.shoot = null;  //right click
        this.shootButton = null; //O: shooting with keyboard
        this.heal = null;   //E
        this.debug = null;  //ctrl left

        //counter for an attack chain corresponding to attack presses
        this.comboCounter = 0;

        // this.keys = {};


        //height for debug
        this.surfaceWidth = null;
        this.surfaceHeight = null;

        // THE KILL SWITCH
        this.running = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;

        this.startInput();
        this.timer = new Timer();
    };

    start() {

        this.mouse = ({x: 1000, y: 0});

        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        var that = this;
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });


        //mouse was clicked
        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }

            this.click = getXandY(e);
            this.userInteracted = true;

            //set attack
            switch (e.which) {
                case 1:
                    //alert('Left Mouse button pressed.');
                    that.attack = true;
                    that.comboCounter += 1;
                    break;
                case 2:
                    //alert('Middle Mouse button pressed.');
                    break;
                case 3:
                    //alert('Right Mouse button pressed.');
                    break;

            }


        });

        //release mouse click
        this.ctx.canvas.addEventListener("mouseup", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }

            this.click = getXandY(e);

            switch (e.which) {
                case 1:
                    //alert('Left Mouse button release.');
                    break;
                case 2:
                    //alert('Middle Mouse button release.');
                    break;
                case 3:
                    //alert('Right Mouse button release.');
                    break;

            }


        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            if (this.options.prevent.scrolling) {
                e.preventDefault(); // Prevent Scrolling
            }
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            if (this.options.prevent.contextMenu) {
                e.preventDefault(); // Prevent Context Menu
            }
            this.rightclick = getXandY(e);
            this.shoot = true;
        });

        //keyboard press control logic
        this.ctx.canvas.addEventListener("keydown", function (e) {
            e.preventDefault(); //prevent scrolling from pressing a key
            switch (e.code) {
                case "Escape":
                    //no pause menu on title or transition screen
                    PAUSED = !PAUSED;
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                    break;
                case "KeyD":
                case "ArrowRight":
                    that.right = true;
                    break;
                case "KeyA":
                case "ArrowLeft":
                    that.left = true;
                    break;
                case "KeyS":
                case "ArrowDown":
                    that.down = true;
                    break;
                case "KeyW":
                case "ArrowUp":
                    that.up = true;
                    break;
                case "KeyP":
                    that.attack = true;
                    that.comboCounter += 1;
                    break;
                case "KeyO":
                    that.shoot = true;
                    that.shootButton = true;
                    break;
                case "ShiftLeft":
                    that.roll = true;
                    break;
                case "Space":
                    that.jump = true;
                    break;
                case "KeyE":
                    that.heal = true;
                    break;
                case "ControlLeft":
                case "ControlRight":
                    that.debug = true;
                    break;
            }
        }, false);

        //keyboard release control logic
        this.ctx.canvas.addEventListener("keyup", function (e) {
            switch (e.code) {
                case "KeyD":
                case "ArrowRight":
                    that.right = false;
                    break;
                case "KeyA":
                case "ArrowLeft":
                    that.left = false;
                    break;
                case "KeyS":
                case "ArrowDown":
                    that.down = false;
                    break;
                case "KeyW":
                case "ArrowUp":
                    that.up = false;
                    break;
                case "Space":
                    break;
            }
        }, false);
    };

    addEntity(entity) {
        const e = entity;
        if (e instanceof Arrow || e instanceof FlyingEyeProjectile || e instanceof BladeBeam)
            this.projectiles.push(e);
        else if (e instanceof AbstractEnemy)
            this.enemies.push(e);
        else if (e instanceof AbstractEntity)
            this.entities.push(e);
        else if (e instanceof Background)
            this.background1.push(e);
        else if (e instanceof BackgroundWalls)
            this.background2.push(e);
        else if (e instanceof AbstractInteractable)
            this.interactables.push(e);
        else if (e instanceof Event)
            this.events.push(e);
        else if (e instanceof AbstractBackFeature)
            this.foreground1.push(e);
        else if (e instanceof AbstractBarrier)
            this.foreground2.push(e);
        else
            this.information.push(e);
    };

    addEntityToFront(entity) {
        const e = entity;
        if (e instanceof Arrow || e instanceof FlyingEyeProjectile)
            this.projectiles.unshift(e);
        else if (e instanceof AbstractEnemy)
            this.enemies.unshift(e);
        else if (e instanceof AbstractEntity)
            this.entities.unshift(e);
        else if (e instanceof Background)
            this.background1.unshift(e);
        else if (e instanceof BackgroundWalls)
            this.background2.unshift(e);
        else if (e instanceof AbstractInteractable)
            this.interactables.unshift(e);
        else if (e instanceof Event)
            this.event.unshift(e);
        else if (e instanceof AbstractBackFeature)
            this.foreground1.unshift(e);
        else if (e instanceof AbstractBarrier)
            this.foreground2.unshift(e);
        else
            this.information.unshift(e);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        this.drawLayer(this.background1);
        this.drawLayer(this.background2);
        this.drawLayer(this.foreground1);
        this.drawLayer(this.interactables);
        this.drawLayer(this.enemies);
        this.drawLayer(this.entities);
        this.drawLayer(this.projectiles);
        this.drawLayer(this.foreground2);
        this.drawLayer(this.events);
        this.drawHealth();
        this.drawLayer(this.information);
        

        if (PARAMS.DEBUG) {
            this.drawDebug(this.foreground1);
            this.drawDebug(this.interactables);
            this.drawDebug(this.enemies);
            this.drawDebug(this.entities);
            this.drawDebug(this.foreground2);
            this.drawDebug(this.projectiles);
            this.drawDebug(this.events);
            this.drawDebug(this.information);

        }

        //update the camera (scene manager)
        this.camera.draw(this.ctx);

    };

    drawLayer(layer) {
        let camera = this.camera;
        let w = this.surfaceWidth;
        let h = this.surfaceHeight;
        for (let i = layer.length - 1; i >= 0; i--) {
            if (layer[i].w) {
                if (camera.x - w < (layer[i].x + layer[i].w) * PARAMS.BLOCKDIM && camera.x + w * 2 > layer[i].x * PARAMS.BLOCKDIM &&
                    camera.y - h < (layer[i].y + layer[i].h) * PARAMS.BLOCKDIM && camera.y + h * 2 > layer[i].y * PARAMS.BLOCKDIM)
                    layer[i].draw(this.ctx, this);
            }
            else if (layer[i].width) {
                if (layer[i] instanceof Shop)
                    layer[i].draw(this.ctx, this);
                else if (camera.x - w < layer[i].x + layer[i].width && camera.x + w * 2 > layer[i].x &&
                    camera.y - h < layer[i].y + layer[i].height && camera.y + h * 2 > layer[i].y)
                    layer[i].draw(this.ctx, this);
            }
            else if (layer[i].lower) {
                if (camera.x - w < (layer[i].lower.x + layer[i].upper.x) * layer[i].scale && camera.x + w * 2 > layer[i].lower.x * layer[i].scale &&
                    camera.y - h < (layer[i].lower.y + layer[i].upper.y) * layer[i].scale && camera.y + h * 2 > layer[i].lower.y * layer[i].scale)
                    layer[i].draw(this.ctx, this);
            }
            else
                layer[i].draw(this.ctx, this);
        }
    }

    drawDebug(layer) {
        for (let i = layer.length - 1; i >= 0; i--) {
            layer[i].drawDebug(this.ctx, this);
        }
    }

    drawHealth() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].drawHealth(this.ctx, this);
        }
    }

    update() {
        if (!PAUSED) {
            this.updateLayer(this.enemies);
            this.updateLayer(this.interactables);
            this.updateLayer(this.entities);
            this.updateLayer(this.projectiles);
            this.updateLayer(this.foreground1);
            this.updateLayer(this.foreground2);
            this.updateLayer(this.information);
            this.updateLayer(this.events);

            this.removeFromLayer(this.background1);
            this.removeFromLayer(this.background2);
            this.removeFromLayer(this.foreground1);
            this.removeFromLayer(this.interactables);
            this.removeFromLayer(this.foreground2);
            this.removeFromLayer(this.enemies);
            this.removeFromLayer(this.entities);
            this.removeFromLayer(this.projectiles);
            this.removeFromLayer(this.information);
            this.removeFromLayer(this.events);

            //update the camera (scene manager)
            this.camera.update();

        } else {
            //any updates you want to work when paused put here
            this.resetControls();
            //update the camera (scene manager)
            this.camera.update();
        }
    };

    resetControls() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    updateLayer(layer) {
        let entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];

            if (entity != undefined && !entity.removeFromWorld) {
                entity.update();
            }
        }
    }

    removeFromLayer(layer) {
        for (let i = layer.length - 1; i >= 0; --i) {
            if (layer[i].removeFromWorld) {
                layer.splice(i, 1);
            }
        }
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)
