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
                console.log("not implemented yet");
        }

        changeMap(idNumber) {
                console.log("not implemented yet");
        }

        allUpgrades() {
                console.log("not implemented yet");
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
        console.log("Change Map: cheats.changeMap(idNum)");
        console.log("All Upgrades: cheats.allUpgrades()");
        console.log("Berserk: cheats.allUpgrades()");
        console.log("Spawn: cheats.spawn(entity)")

}
