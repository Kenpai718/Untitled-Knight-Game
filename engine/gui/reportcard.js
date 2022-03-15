/**
 * Reports all stats in game
 */
 class ReportCard {
    constructor(game) {
        this.game = game;
        this.reset();
        this.elapsed = 0;
        this.myReportBox = new SceneTextBox(this.game, 0, 0, "");
    }

    reset() {
        this.myDamageTaken = 0;
        this.myDamageDealt = 0;
        this.myEnemiesDefeated = 0;
        this.myDeathes = 0;
        this.myDiamondsEarned = 0;
        this.myDiamondsSpent = 0;

        //special stuff that needs to be reset on death
        this.mySecretsFound = 0;
        this.myLastSecretsFound = 0;
        this.myChestsOpened = 0;
        this.myLastChestsOpened = 0;
    }

    drawReportCard(ctx) {
        if(!this.myTotalChests) this.myTotalChests = this.countChests();
        if(!this.myTotalSecrets) this.myTotalSecrets = this.countSecrets();
        // let fontSize = 40;
        // let theLevelTime = this.game.camera.levelTimer;

        let labels = [
            "[REPORT CARD]",
            "--------------------------",
            this.game.camera.getLevelTimer() + " time taken",
            this.myEnemiesDefeated + " enemies defeated",
            Math.round(this.myDamageTaken) + " damage taken",
            Math.round(this.myDamageDealt) + " damage dealt",
            this.myDiamondsEarned + " diamonds earned",
            this.myDiamondsSpent + " diamonds spent",
            this.myDeathes + " times died",
            this.myChestsOpened + "/" + this.myTotalChests + " chests found",
            this.mySecretsFound + "/" + this.myTotalSecrets + "  secrets found",
        ];

        this.myReportBox.setMessage(labels, true);
        this.myReportBox.centerBottomMulti();
        this.myReportBox.draw(ctx);

    }

    /**
     * Save state of important report card info
     * These stuff need to be reset on death since
     * you can open chests and die, but they would still be counted
     * again since u have to reopen them.
     */
    saveLastReport() {
        this.myLastSecretsFound = this.mySecretsFound;
        this.myLastChestsOpened = this.myChestsOpened;
    }

    /**
     * When respawning rollback to last report card info
     */
    rollbackToLastReport() {
        this.mySecretsFound = this.myLastSecretsFound;
        this.myChestsOpened = this.myLastChestsOpened;
    }

    countChests() {
        let count = 0;
        let levels = this.game.camera.levels;
        for (let i = 0; i < levels.length; i++) {
            let level = levels[i];
            if (level.chests) {
                for (var j = 0; j < level.chests.length; j++) {
                    count++;
                }
            }
        }
        return count;
    }

    countSecrets() {
        let count = 0;
        let levels = this.game.camera.levels;
        for (let i = 0; i < levels.length; i++) {
            let level = levels[i];
            if (level.secrets) {
                for (var j = 0; j < level.secrets.length; j++) {
                    count++;
                }
            }
        }
        return count;
    }

}
