class Cheats {
        constructor(sceneManager) {
                this.game = sceneManager;
        }

        teleportPlayer(x, y) {
                console.log("teleport: ",x,y);

        }

        giveDiamonds(amount) {
                console.log("not ready yet");
        }

        changeMap(idNumber) {
                console.log("not ready yet");
        }

        allUpgrades() {
                console.log("not ready yet");
        }

        activateBerserk() {
                console.log("not ready yet");
        }

        spawn(entity) {
                console.log("not ready yet");
        }
}

/**
 * List of possible cheats
 */
function displayCheats() {
        console.log("Teleport: gameManager.cheats.teleport(x,y)");
        console.log("Diamonds: gameManager.cheats.giveDiamond(amount)");
        console.log("Change Map: gameManager.cheats.changeMap(idNum)");
        console.log("All Upgrades: gameManager.cheats.allUpgrades()");
        console.log("Berserk: gameManager.cheats.allUpgrades()");
        console.log("Spawn: gameManager.cheats.spawn(entity)")

}
