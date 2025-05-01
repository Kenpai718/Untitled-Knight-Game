/**
 * Library of cheat codes
 */
class CheatsManager {
        constructor(sceneManager) {
                this.game = sceneManager;
        }

        teleportPlayer(x, y) {
                if(Number.isInteger(x) && Number.isInteger(y)) {
                        console.log("teleported: ",x,y);
                        this.game.setPlayerLocation(x,y);
                } else {
                        console.log("use integers for x and y, ie: (38, 5)")
                }


        }

        giveDiamonds(amount) {
                if(Number.isInteger(amount)) {
                        console.log("added " + amount + " diamonds");
                        this.game.getPlayer().myInventory.addDiamonds(amount);
                } else {
                        console.log("enter an integer amount")
                }
        }

        givePotions(amount) {
                if(Number.isInteger(amount)) {
                        console.log("added " + amount + " diamonds");
                        this.game.getPlayer().myInventory.addPotions(amount)
                } else {
                        console.log("enter an integer amount")
                }
        }

        giveArrows(amount) {
                if(Number.isInteger(amount)) {
                        console.log("added " + amount + " arrows");
                        this.game.getPlayer().myInventory.addArrows(amount)
                } else {
                        console.log("enter an integer amount")
                }
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
        
                if(Number.isInteger(levelNumber)) {
                        console.log("Loading LVL " + levelNumber);   
                        this.game.loadLevel(idNumber, false);
                } else {
                        console.log("enter a valid level number, EX: 0,1,2,...,6")
                }
        }

        toggleBerserkMode(state) {
                if(isBoolean(state)) {
                        console.log("Berserk toggled: " + state);
                        this.game.player.berserk = state;
                }

        }

        infiniteBerserkMode(state) {
                if(isBoolean(state)) {
                        console.log("Infinite Berserk toggled: " + state);
                        this.game.player.berserk = state;
                        if(state) this.game.player.maxBerserkTime = 9999999;
                        else this.game.player.maxBerserkTime = 10;  
                }

        }

        spawn(entity) {
                console.log("not implemented yet");
        }
}

/**
 * List of possible cheats
 */
function displayCheats() {
        console.log("Teleport: cheats.teleportPlayer(x,y)");
        console.log("Diamonds: cheats.giveDiamond(amount)");
        console.log("Arrows: cheats.giveArrows(amount)");
        console.log("Potions: cheats.givePotions(amount)");
        console.log("All Upgrades: cheats.allUpgrades()");
        console.log("Change Map: cheats.changeLevel(lvlID)");
        console.log("Berserk Mode: cheats.activateBerserkMode()");
        console.log("Infinite Berserk: cheats.infiniteBerserkMode()");
        console.log("Spawn: cheats.spawn(entity)")

}
