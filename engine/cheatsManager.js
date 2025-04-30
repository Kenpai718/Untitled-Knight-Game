/**
 * Library of cheat codes
 */
class CheatsManager {
        constructor(sceneManager) {
                this.game = sceneManager;
        }

        teleportPlayer(x, y) {
                console.log("teleported: ",x,y);
                this.game.setPlayerLocation(x,y);

        }

        giveDiamonds(amount) {
                console.log("added " + amount + " diamonds");
                this.game.getPlayer().myInventory.addDiamonds(amount);
        }

        givePotions(amount) {
                console.log("added " + amount + " diamonds");
                this.game.getPlayer().myInventory.addPotions(amount)
        }

        giveArrows(amount) {
                console.log("added " + amount + " arrows");
                this.game.getPlayer().myInventory.addArrows(amount)
        }

        allUpgrades() {
                console.log("Inventory upgraded to max");
                let player = this.game.getPlayer();
                let inventory = player.myInventory;
                inventory.healthUpgrade = 4;
                inventory.attackUpgrade = 4;
                inventory.arrowUpgrade = 4;
                inventory.armorUpgrade = 3;

                this.game.heartsbar.addHeart();
                this.game.heartsbar.addHeart();
                this.game.heartsbar.addHeart();
                this.game.heartsbar.addHeart();
        }

        changeLevel(levelNumber) {
                console.log("Loading LVL " + levelNumber);
                this.game.loadLevel(idNumber, false);
        }

        activateBerserk() {
                console.log("not implemented yet");
        }

        spawn(entity) {
                console.log("not implemented yet");
        }
}

/**
 * List of possible cheats
 */
function displayCheats() {
        console.log("Teleport: cheats.teleport(x,y)");
        console.log("Diamonds: cheats.giveDiamond(amount)");
        console.log("Arrows: cheats.giveArrows(amount)");
        console.log("Potions: cheats.givePotions(amount)");
        console.log("All Upgrades: cheats.allUpgrades()");
        console.log("Change Map: cheats.changeLevel(lvlID)");
        console.log("Berserk: cheats.allUpgrades()");
        console.log("Spawn: cheats.spawn(entity)")

}
