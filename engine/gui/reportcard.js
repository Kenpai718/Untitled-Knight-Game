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
        let boxY = 1210;
        this.myReportBox = new SceneTextBox(this.game, boxX, boxY, "");
    }

    reset() {
        this.myDamageTaken = 0;
        this.myDamageDealt = 0;
        this.myEnemiesDefeated = 0;
        this.myDeathes = 0;
        this.myDiamondsEarned = 0;
        this.mySecretsFound = 0;
    }

    drawReportCard(ctx) {
        let fontSize = 40;

        let theLevelTime = this.game.camera.levelTimer;

        let labels = [
            "[REPORT CARD]",
            "--------------------------",
            this.game.camera.getLevelTimer() + " to complete!",
            this.myEnemiesDefeated + " enemies defeated",
            Math.round(this.myDamageTaken) + " damage taken",
            Math.round(this.myDamageDealt) + " damage dealt",
            this.myDiamondsEarned + " diamonds earned",
            this.mySecretsFound + " secrets found",
            this.myDeathes + " times died",
        ];

        this.myReportBox.setMessage(labels, true);
        this.myReportBox.draw(ctx);

    }

}