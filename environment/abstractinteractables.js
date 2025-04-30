class AbstractInteractable {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
    };

    update() {};
    drawDebug() {};
};
