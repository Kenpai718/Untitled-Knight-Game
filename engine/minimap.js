
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
        this.getBoxDim();

        this.colors = {
            ground: "dimgray",
            trap: "orange",
            moveable: "magenta",
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
            diamonds: "cyan",
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
        //lower opacity if the player is under the minimap
        let player = this.game.camera.player;

        ctx.filter = "Opacity(60%)";
        ctx.strokeStyle = "White";
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        this.loadEnvironmentScene(ctx);
        this.traceEntities(ctx);

        ctx.filter = "none";

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
        ctx.fillStyle = this.colors.moveable;
        if (this.level.moveable) {
            for (var i = 0; i < this.level.moveable.length; i++) {
                let moveable = this.level.moveable[i];
                let myX = moveable.x * PARAMS.SCALE;
                let myY = moveable.y * PARAMS.SCALE;
                let myW = moveable.width * PARAMS.SCALE;
                let myH = moveable.height * PARAMS.SCALE;

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

        //door
        ctx.fillStyle = this.colors.diamonds;
        if (this.level.diamonds) {
            for (var i = 0; i < this.level.diamonds.length; i++) {
                let door = this.level.diamonds[i];
                let myX = door.x * PARAMS.SCALE;
                let myY = door.y * PARAMS.SCALE;
                let myW = door.w * PARAMS.SCALE;
                let myH = door.h * PARAMS.SCALE;

                ctx.fillRect(this.x + myX, this.y - myY + (this.h + 3) * PARAMS.SCALE, 1 * PARAMS.SCALE, 1 * PARAMS.SCALE);
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
        //ctx.fillText("Minimap", miniX, miniY - 10);
        ctx.fillStyle = rgba(41, 41, 41, 0.5);
        ctx.fillRect(this.x, this.y, this.miniW, this.miniH);
        ctx.strokeStyle = "GhostWhite";
        ctx.strokeRect(this.x, this.y, this.miniW, this.miniH);
    }

    getBoxDim() {
        this.miniW = (this.w * PARAMS.SCALE) + this.xOffset;
        this.miniH = (this.h * PARAMS.SCALE) + this.yOffset;

        this.BB = new BoundingBox(this.x, this.y, this.miniW, this.miniH);
    }

    update() {

    };
};
