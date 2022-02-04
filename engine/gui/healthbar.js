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
        var widthRatio = (3 / 2);
        var widthDivisor = 4;

        var x = box.x - this.game.camera.x;
        var y = box.y - this.game.camera.y;
        var width = this.agent.width / widthDivisor;
        var height = 10;
        var offsetX = (width / (widthDivisor * widthRatio));
        var offsetY = 30;
        if (this.agent.hp < this.agent.max_hp) {
            var ratio = this.agent.hp / this.agent.max_hp;
            ctx.strokeStyle = "Black";
            ctx.fillStyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
            ctx.fillRect(x - offsetX, y - offsetY, width * ratio, height);
            ctx.strokeRect(x - offsetX, y - offsetY, width, height);
        }

        if (PARAMS.DEBUG) {
            ctx.fillStyle = "white";
            ctx.fillText("HP: " + this.agent.hp + "/" + this.agent.max_hp, x, y - 40);
            ctx.fillText("Vulnerable = " + this.agent.canTakeDamage(), x, y - 50);
        }
    };
};
