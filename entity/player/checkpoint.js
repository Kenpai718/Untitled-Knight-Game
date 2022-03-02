class Checkpoint {
    constructor(game, x, y) {
        Object.assign( {game, x, y});

        this.myMsg = "Checkpoint saved at x:" + Math.round(this.x) + "y:" + Math.round(this.y);
        this.read = false;
        this.show = false;
        this.messageTimer = 0;
        
    }

    update() {
        if (this.read) {
            this.messageTimer += TICK;
            //display message for 4 seconds
            if (this.messageTimer >= 4) {
                this.messageTimer = 0;
                this.setMessage(false);
            }
        }

        if(this.show) 
    }

    setMessage(isOn) {
        if (isOn) {
            let scene = this.game.camera;
            scene.myTextBox.setMessage(this.myMsg, true);
        } else {
            let scene = this.game.camera;
            scene.myTextBox.show = false;
        }
    }
}