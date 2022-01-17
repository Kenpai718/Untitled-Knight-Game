class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.addEntity(new Knight(this.game));
    };

    update() {

    };

    draw(ctx) {

    };
}
