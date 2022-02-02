moveGroundedHorizontal() {
    this.velocity.x = 0;
    if (this.game.down || this.touchHole()) { //crouch
        this.action = this.states.crouch;
        //crouch left or right (move at half speed)
        if (this.game.right && !this.game.attack) { //run right
            this.facing = this.dir.right;
            this.action = this.states.crouch_walk; //crouch walk
            this.velocity.x += CROUCH_SPD;
        } else if (this.game.left && !this.game.attack) { //run left
            this.facing = this.dir.left;
            this.action = this.states.crouch_walk; //crouch walk
            this.velocity.x -= CROUCH_SPD;
        }
    } else if (this.game.right && !this.game.attack) { //run right
        this.facing = this.dir.right;
        this.action = this.states.run;
        this.velocity.x += MAX_RUN;
    } else if (this.game.left && !this.game.attack) { //run left
        this.facing = this.dir.left;
        this.action = this.states.run;
        this.velocity.x -= MAX_RUN;
    } else { //idle
        this.action = this.DEFAULT_ACTION;
    }
}

doJump() {

}
