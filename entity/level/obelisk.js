// Note : the obelisk is halfway in the ground on purpose
// Obelisk will act as a button. When activated the bricks associated to the obelisk will be removed from the world.
class Obelisk extends AbstractInteractable {
    constructor(game, x, y, brickX, brickY, brickWidth, brickHeight) {
        super(game, x, y);
        this.bricks = new Brick(this.game, brickX, this.game.camera.level.height - brickY - 1, brickWidth, brickHeight);
        this.game.addEntity(this.bricks);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/Obelisk_full.png");
        this.states = { idle: 0, notIdle: 1 };
        this.state = this.states.idle;
        this.width = 190;
        this.height = 380;
        this.x *= PARAMS.BLOCKDIM;
        this.y *= PARAMS.BLOCKDIM;
        this.activated = false;
        this.playSound = false;
        this.loadAnimations();
        this.updateBB();
    };

    update() {
        if (!this.activated) {
            var self = this;
            //activate from player approaching
            this.game.entities.forEach(function (entity) {
                if (entity instanceof AbstractPlayer) {
                    let playerNear = entity.BB && self.BB.collide(entity.BB);
                    let playerInteract = playerNear && self.game.up;
                    let playerHit = entity.HB && self.BB.collide(entity.HB);
                    if (playerHit || playerInteract) {
                        ASSET_MANAGER.playAsset(SFX.CLICK)
                        self.setActivated();
                    }
                }
            });

            //activate from an array
            this.game.projectiles.forEach(function (entity) {
                if (entity instanceof Arrow) {
                    if (entity.BB && self.BB.collide(entity.BB)) {
                        entity.hit = true;
                        entity.removeFromWorld = true;
                        ASSET_MANAGER.playAsset(SFX.CLICK)
                        ASSET_MANAGER.playAsset(SFX.ARROW_HIT);
                        self.setActivated();
                    }
                }
            });
        } else if (this.animations[this.states.notIdle].isDone()) {
            this.removeBlocks();

        }

        if (this.playSound) {
            this.playSound = false;
            ASSET_MANAGER.playAsset(SFX.OBELISK_ON);
        }
        this.animations[this.state].update(this.game.clockTick);
    };

    setActivated() {
        this.state = this.states.notIdle;
        this.activated = true;
        this.playSound = true;
    }

    removeBlocks() {
        this.state = this.states.idle;
        this.bricks.removeFromWorld = true;
    }


    draw(ctx) {
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
    };

    loadAnimations() {
        this.animations = [];
        this.animations[this.states.idle] = new Animator(this.spritesheet, 0, 380, 190, 380, 14, 0.1, 0, false, true, false);
        this.animations[this.states.notIdle] = new Animator(this.spritesheet, 0, 0, 190, 380, 14, 0.13, 0, false, false, false);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y + PARAMS.BLOCKDIM * 2, PARAMS.BLOCKDIM * 2, PARAMS.BLOCKDIM * 2);
    };
}
