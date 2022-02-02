class HealthBar {
    constructor(game, agent) {
        Object.assign(this, { game, agent });

    };

    update() {
       
    };

    draw(ctx) {
        var box = this.agent.BB;
        //var x = this.agent.x;
        //var y = this.agent.y;
        var widthRatio = (3/2);
        var widthDivisor = 4;

        var x = box.x - this.game.camera.x;
        var y = box.y;
        var width = this.agent.width / widthDivisor;
        var height = 10;
        var offsetX = (width / (widthDivisor * widthRatio));
        var offsetY = 30;
        if (this.agent.hp <= this.agent.maxHP) {
            var ratio = this.agent.hp / this.agent.maxHP;
            ctx.strokeStyle = "Black";
            ctx.fillStyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
            ctx.fillRect(x - offsetX, y - offsetY, width * ratio, height);
            ctx.strokeRect(x - offsetX, y - offsetY, width, height);
        }

        if(PARAMS.DEBUG) {}
    };
};

class DamageScore {
    constructor(game, entity, score) {
        Object.assign(this, { game, entity, score });

        var box = this.entity.BB;
        this.x = box.x;
        this.y = box.y - 40;

        this.velocity = -32;
        this.elapsed = 0;
    };

    update() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 1) this.removeFromWorld = true;

        this.y += this.game.clockTick * this.velocity;
    };

    draw(ctx) {

        var offset = this.score < 10 ? 6 : 12;

        ctx.font = PARAMS.BIG_FONT;
        ctx.fillStyle = "Black";
        ctx.fillText(this.score, (this.x - offset + 1) - this.game.camera.x, this.y + 1);
        ctx.fillStyle = rgb(183, 3, 3);
        ctx.fillText(this.score, (this.x - offset) - this.game.camera.x, this.y);

        ctx.font = PARAMS.DEFAULT_FONT;
    };
};