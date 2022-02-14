class Shop {
    constructor(game) {
        Object.assign(this,{game});
        this.width = 900;
        this.height = 800;
    };

    update(){
    };

    loadAnimations() {

        let numStates = 3;
        for (var i = 0; i < numStates; i++) { //defines action
            this.animations.push([]);
        }
        
    };

    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.globalAlpha = 1;
        ctx.fillRect(1920/2 - this.width/2, 1080/2 - this.height/2 - 50, this.width, this.height);
        ctx.globalAlpha = 1;
    };

    drawDebug(ctx) {
        ctx.strokeStyle = "White";
        ctx.strokeRect(1920/2 - this.width/2, 1080/2 - this.height/2 - 50, this.width, this.height);
    }


};