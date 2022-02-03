
class HeartBar {
    constructor(game, player) {
        Object.assign(this, { game, player });

        //status of the hearts
        this.hp_per_heart = 10;
        this.max_hearts = this.player.max_hp / this.hp_per_heart;
        this.current_hearts = this.max_hearts;

        this.myHearts = [];
        this.scale = PARAMS.GUI_SCALE;
        this.x = 0;
        this.y = 5;

        //setup heart gui
        for (let i = 0; i < this.max_hearts; i++) {
            let heart = new HeartContainer(this.game, PARAMS.HEART_DIM * i, 5, this.scale, this.hp_per_heart);
            this.myHearts.push(heart);
        }
    };

    update() {
        let hp_diff = this.player.max_hp - this.player.hp;
        this.setHearts(hp_diff);
    };

    /**
     * Passs in how much damage the knight has taken to update the health
     * bar GUI
     * @param {*} damage 
     */
    setHearts(damage) {
        let dmg = damage;
        let self = this;
        //go through array in reverse since the damage is drawn at the end
        this.myHearts.slice().reverse().forEach(function (heart) {
            //set status of each individual heart
            if (heart instanceof HeartContainer) {
                heart.setStatus(dmg);
                if(dmg >= 0) {
                    dmg -= heart.hp;
                }
            }
        });
    };

    draw(ctx) {
        for (let i = 0; i < this.max_hearts; i++) {
            this.myHearts[i].draw(ctx);
        }
    };

}

class HeartContainer {
    constructor(game, x, y, scale, hp) {
        Object.assign(this, { game, x, y, scale, hp });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Hearts.png");

        this.states = { full: 0, threefourth: 1, half: 2, quarter: 3, empty: 4 };
        this.status = this.states.full;

        this.animations = [];
        this.loadAnimations();

    };

    setStatus(damage) {
        if(damage >= this.hp) {
            this.status = this.states.empty;
        } else if(damage >= (this.hp * .75)) {
            this.status = this.states.threefourth;
        } else if (damage >= (this.hp * .5)) {
            this.status = this.states.half;
        } else if (damage >= (this.hp * .25)) {
            this.status = this.states.quarter;
        } else if (damage <= 0) {
            this.status = this.states.full;
        }
    }


    loadAnimations() {
        this.animations[this.states.full] = new Animator(this.spritesheet, 0, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.animations[this.states.threefourth] = new Animator(this.spritesheet, PARAMS.HEART_DIM, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.animations[this.states.half] = new Animator(this.spritesheet, PARAMS.HEART_DIM * 2, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.animations[this.states.quarter] = new Animator(this.spritesheet, PARAMS.HEART_DIM * 3, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.animations[this.states.empty] = new Animator(this.spritesheet, PARAMS.HEART_DIM * 4, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
    };

    draw(ctx) {

        this.animations[this.status].drawFrame(this.game.clockTick, ctx, (this.x * this.scale) + 5, this.y + 5, this.scale);
    };
};