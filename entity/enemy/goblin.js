class Goblin {
    constructor(game, x, y){
        
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemy/goblin.png");
        
        // Mob sizes
        this.scale = 2.5; // 2.5
        this.width = 33 * this.scale;
        this.height = 36 * this.scale;

        // Update settings
        this.tick = 0;
        this.seconds = 0;
        this.doRandom = 0;
        this.alert = false; // enemy is near or got hit

        // Mapping animations and mob states
        this.states = {idle: 0, damaged: 1, death: 2, attack: 3, move: 4, run: 5};
        this.directions = {left: 0, right: 1 };
        this.animations = []; // [state][direction]

        this.state = 0;
        this.direction = 0;

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
        this.updateAB();
        this.updateHB();
        this.updateVB();
    };

    updateHB() {
        this.lastHitBox = this.HB;
        this.HB = new BoundingBox(this.x + 4 * this.scale, this.y + 2 * this.scale, 19 * this.scale, 34 * this.scale + 1)
    }

    updateAB() {
        this.lastAttackbox = this.AB;
        if (this.direction == 0)    this.AB = new BoundingBox(this.x-71, this.y-24, this.attackwidth, 46 * this.scale)
        else                        this.AB = new BoundingBox(this.x-84, this.y-24, this.attackwidth, 46 * this.scale)
    }

    updateVB() {
        this.lastVisionbox = this.VB;
        this.VB = new BoundingBox(this.x + 32 - this.visionwidth/2, this.y, this.visionwidth, this.height + 1)
    }

    viewBoundingBox(ctx) { 
        if(this.displayHitbox) {        // This is the Hitbox, defines space where mob can be hit
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.x + 4 * this.scale, this.y + 2 * this.scale, 19 * this.scale, 34 * this.scale + 1);
        }
        if(this.displayAttackbox) {     // This is Attack Box, defines mob attack area
            ctx.strokeStyle = "Orange";
            this.attackwidth = 89 * this.scale;
            if (this.direction == 0)    ctx.strokeRect(this.x-71, this.y-24, this.attackwidth, 46 * this.scale);
            else                        ctx.strokeRect(this.x-84, this.y-24, this.attackwidth, 46 * this.scale);
        }
        if(this.displayVisionbox) {      // This is Vision Box, allows mob to see player when it collides with player's hitbox
            this.visionwidth = 1400;
            ctx.strokeStyle = "Yellow";
            ctx.strokeRect(this.x + 32 - this.visionwidth/2, this.y, this.visionwidth, this.height + 1);
        }
    };

    update() { // physics

        this.seconds += this.game.clockTick;

        // TODO: Detect if taken damaged or player in range
        //if(this.VB.collide(player.BB))
        
        //Do something random if 'not hit' and player isnt in sight 
        if(!this.alert){
            if(this.seconds >= this.doRandom){
                this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                //this.direction = Math.floor(Math.random() * 2);
                this.action = Math.floor(Math.random() * 6);
                if(this.action <= 1) {
                    this.doRandom = this.seconds + Math.floor(Math.random() * 3);
                    this.state = 3;//4
                }
                else {
                    this.state = 3;//0
                }
            }
        }
        else if (this.alert) {

        }
        

        if(this.state == 4){
            if(this.direction == 0)     this.x += -1;//-1
            else                        this.x += 1;//1
        }
        if(this.state == 5){
            if(this.direction == 0)     this.x += -2.5;//-2.5
            else                        this.x += 2.5;//2.5
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
        this.animations[0][0] = new Animator(this.spritesheet, 509, 65, 33, 36, 4, 0.14, -183, 0, 1, 0);    // 0.14 Animation Speed 
        this.animations[0][1] = new Animator(this.spritesheet, 658, 65, 33, 36, 4, 0.14, 117, 0, 1, 0);

        // Damaged Animation
        this.animations[1][0] = new Animator(this.spritesheet, 504, 364, 42, 37, 4, 0.12, -192, 0, 0, 0);   // 0.12 Animation Speed
        this.animations[1][1] = new Animator(this.spritesheet, 654, 364, 42, 37, 4, 0.12, 108, 0, 0, 0);

        // Death Animation
        this.animations[2][0] = new Animator(this.spritesheet, 491, 212, 74, 39, 4, 0.1, -230, 0, 0, 0);    // 0.1 Animation Speed
        this.animations[2][1] = new Animator(this.spritesheet, 640, 212, 74, 39, 4, 0.1, 82, 0, 0, 0);

        // Attack Animation
        this.animations[3][0] = new Animator(this.spritesheet, 1081, 655, 88, 46, 8, 0.06, -238, 0, 1, 0);  // 0.06 Animation Speed
        this.animations[3][1] = new Animator(this.spritesheet, 31, 505, 88, 46, 8, 0.06, 62, 0, 1, 0);

        // Move Animation
        this.animations[4][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.2, -188, 0, 1, 0);   // 0.1 Animation Speed
        this.animations[4][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.2, 112, 0, 1, 0);

        // Move Animation
        this.animations[5][0] = new Animator(this.spritesheet, 1106, 963, 38, 38, 8, 0.1, -188, 0, 1, 0);   // 0.1 Animation Speed
        this.animations[5][1] = new Animator(this.spritesheet, 56, 813, 38, 38, 8, 0.1, 112, 0, 1, 0);

    };



    draw(ctx) {

        switch(this.state) { // Prefecting Refections... Might just remove anyways.
            case 0: // Idle
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x -16, this.y, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case 1: // Damaged
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 25, this.y -2, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - 13, this.y -2, this.scale);
                break;
            case 2: // Death
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-50, this.y-4, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-40, this.y-4, this.scale);
                break;
            case 3: // Attack
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-83, this.y-25, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-70, this.y-25, this.scale);
                break;
            case 4: // Move
                if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-20, this.y-5, this.scale);
                else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
                break;
            case 5: // Run
            if(this.direction == 1)     this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-20, this.y-5, this.scale);
            else                        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x-8, this.y-5, this.scale);
            break;
        }
    };

    drawDebug(ctx) {
        this.viewBoundingBox(ctx);
    }

};