class AbstractBoss extends AbstractEnemy {
    constructor(game, x, y, onGuard, name, max_hp, width, height, scale, physics) {
        super(game, x, y, onGuard, name, max_hp, width, height, scale, physics);

        this.healthbar = new HealthBar(game, this, true);
        this.activeBoss = false;

        let self = this;   
    }

    healSelf(amount) {
        if (this.hp < this.max_hp) {
            let healed;

            if ((amount + this.hp) >= this.max_hp) {
                healed = this.max_hp - this.hp;
            } else {
                healed = amount;
            }

            healed = Math.round(100 * healed) / 100;

            this.hp += healed;
            ASSET_MANAGER.playAsset(SFX.HEAL);
            this.game.addEntityToFront(new Score(this.game, this, healed, PARAMS.HEAL_ID, false));
        }
    }

    healToHalf() {
        if (this.hp < this.max_hp) {
            let half_hp = (this.max_hp / 2);
            let heal_amount = half_hp;
            if(this.hp < half_hp) {
                heal_amount = half_hp - this.hp;
            }


            let healed = Math.round(100 * heal_amount) / 100;
            this.hp = half_hp;
            ASSET_MANAGER.playAsset(SFX.HEAL);
            this.game.addEntityToFront(new Score(this.game, this, healed, PARAMS.HEAL_ID, false));
        }
    }
}