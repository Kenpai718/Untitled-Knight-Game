class Skeleton {

    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/skeleton.png");

        // AI timer
        this.tick = 0;
        this.seconds = 0;
        this.doRandom = 0;
        this.alert = false; // enemy is near or got hit

        // Mapping charater states for animations
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4, block: 5};
        this.directions = {left: 0, right: 1 };
        this.animations = []; // [state][direction] 
        
        this.state = 0;
        this.direction = 0;

        // Mob scaling sizes 
        this.scale = 2.5;
        this.height = 51 * this.scale;

        // Hit, Attack, and View boxes.
        this.HB = null;
        this.AB = null;
        this.VB = null;

        // When Debug box is true, select mob box to display
        this.displayHitbox = true;
        this.displayAttackbox = true;
        this.displayVisionbox = true;

        // Other
        this.loadAnimations();

    };

    updateHB() {
        this.lastHitBox = this.HB;
        this.HB = new BoundingBox(this.x + 14 * this.scale, this.y-37, 21 * this.scale, 51 * this.scale)
    }

    updateAB() {
        this.lastAttackbox = this.AB;
        if (this.direction == 0)    this.AB = new BoundingBox(this.x - 109, this.y-53, this.attackwidth, 57 * this.scale)
        else                        this.AB = new BoundingBox(this.x + 32, this.y-53, this.attackwidth, 57 * this.scale)
    }

    updateVB() {
        this.lastVisionbox = this.VB;
        this.VB = new BoundingBox(this.x + 62 - this.visionwidth/2, this.y-37, this.visionwidth, this.height)
    }

    viewBoundingBox(ctx) { 
        if(this.displayHitbox) {        // This is the Hitbox, defines space where mob can be hit
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.x + 14 * this.scale, this.y-37, 21 * this.scale, 51 * this.scale);
        }
        if(this.displayAttackbox) {     // This is Attack Box, defines mob attack area
            ctx.strokeStyle = "Orange";
            this.attackwidth = 200;
            if (this.direction == 0)    ctx.strokeRect(this.x - 109, this.y-53, this.attackwidth, 57 * this.scale);
            else                        ctx.strokeRect(this.x + 32, this.y-53, this.attackwidth, 57 * this.scale);
        }
        if(this.displayVisionbox) {      // This is Sight Box, allows mob to see player when it collides with player's hitbox
            this.visionwidth = 1200;
            ctx.strokeStyle = "Yellow";
            ctx.strokeRect(this.x + 62 - this.visionwidth/2, this.y-37, this.visionwidth, this.height);
        }
    };

    update() {

        this.seconds += this.game.clockTick;

        // TODO: Detect if taken damaged or player in range
        if(this.VB.collide(player.BB))
        
        //Idle Mode: Do something random if 'not hit' or player isnt in sight 
        if(!this.alert){
            if(this.seconds >= this.doRandom){
                
                //this.direction = Math.floor(Math.random() * 2);
                this.action = Math.floor(Math.random() * 6);
                if(this.action <= 1) {
                    this.doRandom = this.seconds + Math.floor(Math.random() * 5);
                    this.state = 3;//4
                }
                else {
                    this.doRandom = this.seconds + 7;
                    this.state = 3;//0
                }
            }
        }
        else if (this.alert) {
            
        }
        



        if(this.state == 4){
            if(this.direction == 0)     this.x += -0.3;//-0.4
            else                        this.x += 0.3;//0.4
        }
    };

    loadAnimations() {

        let numDir = 2;
        let numStates = 6;
        for (var i = 0; i < numStates; i++) { //defines action
            this.animations.push([]);
            for (var j = 0; j < numDir; j++){ //defines directon: left = 0, right = 1
                this.animations[i].push([]);
            }
        }

        // Animations  [state][direction]
        
        // Idle Animation
        this.animations[0][0] = new Animator(this.spritesheet, 495, 50, 45, 51, 4, 0.7, -195, 0, 1, 0); // 0.7
        this.animations[0][1] = new Animator(this.spritesheet, 660, 50, 45, 51, 4, 0.7, 105, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 495, 348, 55, 53, 4, 0.1, -205, 0, 1, 0); //0.1
        this.animations[1][1] = new Animator(this.spritesheet, 650, 348, 55, 53, 4, 0.1, 95, 0, 1, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 492, 200, 56, 51, 4, 0.1, -206, 0, 0, 0); //0.1
        this.animations[2][1] = new Animator(this.spritesheet, 652, 200, 56, 51, 4, 0.1, 94, 0, 0, 0);

        // Attack Animations
        this.animations[3][0] = new Animator(this.spritesheet, 1052, 944, 95, 57, 8, 0.1, -245, 0, 1, 0); // 0.1
        this.animations[3][1] = new Animator(this.spritesheet, 53, 794, 95, 57, 8, 0.1, 55, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 495, 650, 45, 51, 4, 0.3, -195, 0, 1, 0); // 0.3?
        this.animations[4][1] = new Animator(this.spritesheet, 660, 650, 45, 51, 4, 0.3, 105, 0, 1, 0);

        // Block Animation 
        this.animations[5][0] = new Animator(this.spritesheet, 491, 505, 40, 46, 4, 0.2, -190, 0, 1, 0); // 0.2
        this.animations[5][1] = new Animator(this.spritesheet, 669, 505, 40, 46, 4, 0.2, 110, 0, 1, 0);
    };

    draw(ctx) {
        
        switch(this.state) {
            case 0: // Idle
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x+10, this.y-37, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-37, this.scale);
                break;
            case 1: // Damaged
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-15, this.y-42, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-42, this.scale);
                break;
            case 2: // Death
                if(this.direction == 1) 
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-10, this.y-37, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-10, this.y-37, this.scale);
                break;
            case 3: // Attack
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-7, this.y-52, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-108, this.y-52, this.scale);
                break;
            case 4: // Move
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 10, this.y-37, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y-37, this.scale);
                break;
            case 5: // Block
                if(this.direction == 1)
                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 7, this.y-24, this.scale);
                else    this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x + 14, this.y-24, this.scale);
                break;
        }

        if (PARAMS.DEBUG) {
            this.viewBoundingBox(ctx);
        }

    };
};