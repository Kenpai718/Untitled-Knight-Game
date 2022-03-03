class AbstractBoss extends AbstractEnemy {
    constructor(game, x, y, onGuard, name, max_hp, width, height, scale, physics) {
        super(game, x, y, onGuard, name, max_hp, width, height, scale, physics);

        this.healthbar = new HealthBar(game, this, true);
        this.active = false;

        let self = this;   
    }
}