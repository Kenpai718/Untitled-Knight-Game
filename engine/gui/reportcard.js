/**
 * Reports all stats in game
 */
 class ReportCard {
    constructor(game) {
        this.game = game;

        this.reset();

        this.elapsed = 0;

        //not sure how to do this in terms of the canvas so I hard coded in the spot
        let boxX = 865;
        let boxY = 1270;
        this.myReportBox = new SceneTextBox(this.game, boxX, boxY, "");
    }

    reset() {
        this.myDamageTaken = 0;
        this.myDamageDealt = 0;
        this.myEnemiesDefeated = 0;
        this.myDeathes = 0;
        this.myDiamondsEarned = 0;
        this.myDiamondsSpent = 0;
        this.mySecretsFound = 0;
        this.myChestsOpened = 0;
    }

    drawReportCard(ctx) {
        if(!this.myTotalChests) this.myTotalChests = this.countChests();
        let fontSize = 40;

        let theLevelTime = this.game.camera.levelTimer;

        let labels = [
            "[REPORT CARD]",
            "--------------------------",
            this.game.camera.getLevelTimer() + " time taken",
            this.myEnemiesDefeated + " enemies defeated",
            Math.round(this.myDamageTaken) + " damage taken",
            Math.round(this.myDamageDealt) + " damage dealt",
            this.myDiamondsEarned + " diamonds earned",
            this.myDiamondsSpent + " diamonds spent",
            this.mySecretsFound + " secrets found",
            this.myChestsOpened + "/" + this.myTotalChests + " chests found",
            this.myDeathes + " times died",
        ];

        this.myReportBox.setMessage(labels, true);
        this.myReportBox.centerBottomMulti();
        this.myReportBox.draw(ctx);

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

}
