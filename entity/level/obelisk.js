// Note : the obelisk is halfway in the ground on purpose
// Obelisk will act as a button. When activated the bricks associated to the obelisk will be removed from the world.
class Obelisk extends AbstractInteractable {
    constructor(game, x, y, brickX, brickY, brickWidth, brickHeight, initial = true, repeat = false) {
        super(game, x, y);
        
        this.initial = initial; // defaults bricks to appear or be hidden
        this.repeat = repeat; // Allows for the Obelisk to spawn / despawn blocks more than once 
        this.bricks = new Brick(this.game, brickX, this.game.camera.level.height - brickY - 1, brickWidth, brickHeight);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/Obelisk_full.png");
        this.states = { idle: 0, notIdle: 1 };
        this.state = this.states.idle;
        this.width = 190;
        this.height = 380;
        this.x *= PARAMS.BLOCKDIM;
        this.y *= PARAMS.BLOCKDIM;
        this.playSound = false;

        if(this.initial) this.game.addEntity(this.bricks);
        
        this.timer = 0;
        this.settimer = false;

        this.playOnce = false;

        this.loadAnimations();
        this.updateBB();
    };

    update() {

        if(this.settimer){
            this.timer += this.game.clockTick;
        }

        if(this.state == this.states.idle && this.settimer == false ){
            var self = this;
            //activate from player approaching
            this.game.entities.forEach(function (entity) {
                if (entity instanceof AbstractPlayer) {
                    let playerNear = entity.BB && self.BB.collide(entity.BB);
                    let playerInteract = playerNear && self.game.up;
                    let playerHit = entity.HB && self.BB.collide(entity.HB);
                    if (playerHit || playerInteract) {
                        ASSET_MANAGER.playAsset(SFX.CLICK)
                        if(!self.playOnce) self.setActivated();
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
                        if(!self.playOnce) self.setActivated();
                    }
                }
            });
        } else if ( this.timer > 0.13*14 && this.initial){ // this.animations[this.states.notIdle].isDone()
            this.switchstate();

            this.bricks.removeFromWorld = true;

        } else if( this.timer > 0.13*14 && !this.initial){
            this.switchstate();

            this.bricks.removeFromWorld = false;
            this.game.addEntity(this.bricks);
            
        }
        

        if (this.playSound && !this.playOnce) {

            if(!this.repeat) {
                this.playOnce = true;
            }

            this.playSound = false;
            ASSET_MANAGER.playAsset(SFX.OBELISK_ON);
        }
        this.animations[this.state].update(this.game.clockTick);
    };

    setActivated() {
        this.settimer = true;
        this.state = this.states.notIdle;
        this.playSound = true;
    }

    switchstate(){
        if(this.repeat) this.initial = !this.initial;
        
        this.state = this.states.idle;
        this.settimer = false;
        this.timer = 0;
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
        this.animations[this.states.idle] = new Animator(this.spritesheet, 11, 380, 190, 380, 14, 0.1, 0, false, true, false);
        this.animations[this.states.notIdle] = new Animator(this.spritesheet, 11, 0, 190, 380, 14, 0.13, 0, false, true, false);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y + PARAMS.BLOCKDIM * 2, PARAMS.BLOCKDIM * 2, PARAMS.BLOCKDIM * 2);
    };
}
