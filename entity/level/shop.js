class Shop {
    constructor(game, shop_keeper) {
        Object.assign(this, { game, shop_keeper });
        this.width = 900;
        this.height = 800;

        this.x = 1920 / 2 - this.width / 2;
        this.y = 1080 / 2 - this.height / 2 - 50;

        this.diamond_sprite = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.distract_sprite = ASSET_MANAGER.getAsset("./sprites/environment/distraction.png");
        this.armor_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/armor.png");
        this.attack_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/attack.png");
        this.interactables = ASSET_MANAGER.getAsset("./sprites/GUI/interactables.png");
        this.health_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/Hearts.png");
        this.arrow_sprite = ASSET_MANAGER.getAsset("./sprites/projectile/arrowupgrades.png");


        // GUI objects
        this.diamond = [];
        this.button = [];
        this.progressbutton = [];
        this.progressbutton2 = [];
        this.maxed = false;
        this.exitButtonColor = 'rgba(190, 0, 0, 0.8)';
        this.distract;

        // Button highlight
        this.highlightB1 = false;
        this.highlightB2 = false;
        this.highlightB3 = false;
        this.highlightB4 = false;
        this.highlightB5 = false;
        this.highlightB6 = false;
        this.highlighted = false;

        // GUI icons and cost
        // this.health = [];
        // this.healthCost = [20, 40, 60, 80, "MAX"];
        // this.attack = [];
        // this.attackCost = [25, 50, 75, 100, "MAX"];
        // this.arrow = [];
        // this.arrowCost = [30, 60, 90, 120, "MAX"];
        // this.arrowPackCost = [10, 10, 10, 10, 10];
        // this.armor = [];
        // this.armorCost = [60, 90, 120, "MAX"];
        //economy inflation
        this.health = [];
        this.healthCost = [25, 50, 75, 100, "MAX"];
        this.potionCost = 15;
        this.attack = [];
        this.attackCost = [75, 125, 175, 275, "MAX"];
        this.arrow = [];
        this.arrowCost = [50, 100, 150, 250, "MAX"];
        this.arrowPackCost = [10, 10, 10, 10, 10];
        this.armor = [];
        this.armorCost = [75, 125, 200, "MAX"];

        // animations speeds
        this.timer = 0;

        this.purchases = {
            arrow_pack: ["You got 10 more arrows!"],
            potion: ["You got a... health potion...?", "Wizard: ... :)"],
            heart_upgrade: "Dunununaaah! You suddenly feel refreshed!",
            attack_upgrade: "Your blade was enchanted! It feels sharper.",
            arrow_upgrade: "...and +10 arrows on the house!",
            armor_upgrade: "You got some new drip!"
        };


        // Object Parameters
        this.buttonwidth = 330;
        this.buttonheight = 130;
        this.buttonscale = 0.5;
        this.customPurchaseHeight = -10; // Set to 0 for correct placement for horizontal lines

        this.myTextBox = new SceneTextBox(this.game, (this.game.surfaceWidth / 2), this.y, "");
        this.myTextBox.show = true;
        this.messageTimer = 0;
        this.maxTimer = 6.5;
        this.defaultMsg = "Wizard: So, what would you like?";
        this.currentMessage = this.defaultMsg;

        // Load Items
        this.loadAnimations();
        this.updateBoxes();
    };



    update() {

        if (this.shop_keeper.showText && this.currentMessage == this.lastMessage && this.currentMessage != this.defaultMsg) {
            this.messageTimer += this.game.clockTick;

            if (this.messageTimer > this.maxTimer) {
                this.messageTimer = 0;
                this.currentMessage = this.defaultMsg;
                this.purchased = false;
            }
        }

        this.timer += this.game.clockTick * 1;




        // Purchasing (clicked button in shop)
        let self = this;
        this.game.entities.forEach(function (entity) {
            let mouseBB = new BoundingBox(self.game.mouse.x, self.game.mouse.y, 1, 1);

            if (self.game.click) ASSET_MANAGER.playAsset(SFX.CLICK);

            // Exit button interaction
            if (mouseBB.collide(self.ExitBB)) {
                self.exitButtonColor = "Red"
                if (self.game.click)
                    SHOP_ACTIVE = false;
            }
            else self.exitButtonColor = 'rgba(190, 0, 0, 0.8)';

            if (entity instanceof AbstractPlayer) {

                if (mouseBB.collide(self.ButtonBB1)) {
                    //console.log("Button 1 : Arrow Pack");

                    if (entity.myInventory.diamonds >= self.arrowPackCost[entity.myInventory.arrowUpgrade]) {
                        self.highlightB1 = true;

                        if (self.game.click) {
                            let cost = self.arrowPackCost[entity.myInventory.arrowUpgrade];
                            self.doTransaction(cost);
                            entity.myInventory.arrows += 10;
                            ASSET_MANAGER.playAsset(SFX.NEW_ITEM);
                            self.currentMessage = self.purchases.arrow_pack;
                            self.messageTimer = 0;

                        }
                    }

                }
                else if (mouseBB.collide(self.ButtonBB2)) {
                    //console.log("Button 2 : Health Potion");

                    if (entity.myInventory.diamonds >= self.potionCost) {
                        self.highlightB2 = true;

                        if (self.game.click) {
                            let cost = self.potionCost;
                            self.doTransaction(cost);

                            entity.myInventory.potions += 1;
                            ASSET_MANAGER.playAsset(SFX.NEW_ITEM);
                            self.currentMessage = self.purchases.potion;
                            self.messageTimer = 0;

                            self.purchased = true;
                        }
                    }
                }
                else if (mouseBB.collide(self.ButtonBB3)) {
                    //console.log("Button 3 : Health Upgrade");

                    if (entity.myInventory.diamonds >= self.healthCost[entity.myInventory.healthUpgrade]) {
                        self.highlightB3 = true;

                        if (self.game.click) {
                            let cost = self.healthCost[entity.myInventory.healthUpgrade];
                            self.doTransaction(cost);
                            entity.myInventory.healthUpgrade += 1;

                            //add hearts to heartbar and player
                            let player_hearts = self.game.camera.heartsbar;
                            player_hearts.addHeart();
                            ASSET_MANAGER.playAsset(SFX.NEW_HEART);
                            self.currentMessage = self.purchases.heart_upgrade;
                            self.messageTimer = 0;

                            self.purchased = true;
                        }
                    }
                }
                else if (mouseBB.collide(self.ButtonBB4)) {
                    //console.log("Button 4 : Attack Upgrade");

                    if (entity.myInventory.diamonds >= self.attackCost[entity.myInventory.attackUpgrade]) {
                        self.highlightB4 = true;

                        if (self.game.click) {
                            let cost = self.attackCost[entity.myInventory.attackUpgrade];
                            self.doTransaction(cost);
                            entity.myInventory.attackUpgrade += 1;
                            ASSET_MANAGER.playAsset(SFX.ENCHANTMENT);
                            self.currentMessage = self.purchases.attack_upgrade;
                            self.messageTimer = 0;

                            self.purchased = true;
                        }
                    }
                }
                else if (mouseBB.collide(self.ButtonBB5)) {
                    //console.log("Button 5 : Arrow Upgrade");

                    if (entity.myInventory.diamonds >= self.arrowCost[entity.myInventory.arrowUpgrade]) {
                        self.highlightB5 = true;

                        if (self.game.click) {
                            let cost = self.arrowCost[entity.myInventory.arrowUpgrade];
                            self.doTransaction(cost);
                            entity.myInventory.arrowUpgrade += 1;
                            entity.myInventory.arrows += 10;
                            //entity.myInventory.arrows = Math.floor(entity.myInventory.arrows/2);
                            ASSET_MANAGER.playAsset(SFX.NEW_ITEM);
                            self.currentMessage = self.purchases.arrow_upgrade;
                            self.messageTimer = 0;

                            self.purchased = true;
                        }
                    }
                }
                else if (mouseBB.collide(self.ButtonBB6)) {
                    //console.log("Button 6 : Armor Upgrade");

                    if (entity.myInventory.diamonds >= self.armorCost[entity.myInventory.armorUpgrade]) {
                        self.highlightB6 = true;

                        if (self.game.click) {
                            let cost = self.armorCost[entity.myInventory.armorUpgrade];
                            self.doTransaction(cost);
                            entity.myInventory.armorUpgrade += 1;
                            ASSET_MANAGER.playAsset(SFX.ANVIL);
                            self.currentMessage = self.purchases.armor_upgrade;
                            self.messageTimer = 0;

                            self.purchased = true;
                        }
                    }
                }
                else {
                    self.highlightB1 = false;
                    self.highlightB2 = false;
                    self.highlightB3 = false;
                    self.highlightB4 = false;
                    self.highlightB5 = false;
                    self.highlightB6 = false;
                }

                if (entity.myInventory.healthUpgrade >= 4 &&
                    entity.myInventory.attackUpgrade >= 4 &&
                    entity.myInventory.arrowUpgrade >= 4 &&
                    entity.myInventory.armorUpgrade >= 3 &&
                    self.maxed == false && entity.myInventory.maxxed == false) {
                    self.maxed = true;
                    entity.myInventory.maxxed = true;
                    ASSET_MANAGER.playAsset(SFX.DISTRACT);
                }

            }

            self.game.click = false;
        });

        this.updateAnimations();

        if (this.shop_keeper.showText) {
            this.setShopMessage();
            this.lastMessage = this.currentMessage;
        }

    };

    doTransaction(cost) {
        if (isInt(cost)) {
            this.game.camera.player.myInventory.diamonds -= cost;
            this.game.myReportCard.myDiamondsSpent += cost;
        }
        //console.log(cost);
    }

    setShopMessage() {

        let scene = this.game.camera;
        let message;

        if (this.maxed) { //maxed the shop
            if (this.currentMessage == this.purchases.arrow_pack || this.currentMessage == this.purchases.potion) {
                message = this.currentMessage;
            } else {
                message = "Wizard: (Chuckles) I'm in danger.";
            }
        } else if (scene.player.myInventory.diamonds < 10) {
            message = "Wizard: well uh... this is awkward.";
        } else {
            //highlighted buttons
            if (this.isHighlighted() && !this.purchased) {
                if (this.highlightB1) {
                    message = ["Wizard: 10 of the finest arrows here", "to snipe your enemies from afar!"]; // Arrow Pack
                }
                else if (this.highlightB2) {
                    message = ["Wizard: You want a potion?", "It'll heal you for 50HP."] // Health Potion
                }
                else if (this.highlightB3) {
                    message = "Wizard: You look tired. Want a massage?" // Max-Health Upgrade
                }
                else if (this.highlightB4) {
                    message = ["Wizard: You have a fine blade...", "but I can make it even stronger!"];
                }
                else if (this.highlightB5) {
                    message = ["Wizard: If you want to be the king of snipers", "then you'll need some stronger arrows!", "I'll even throw in 10 extra arrows if you upgrade now!"] // Arrow Upgrade
                }
                else if (this.highlightB6) {
                    message = ["Wizard: If you want more protection", "then I can improve your armor."] // Armor Upgrade
                } else {
                    message = "...";
                }

            } else { //bought something
                switch (this.currentMessage) {
                    case this.purchases.heart_upgrade:
                        message = [];
                        if (scene.player.myInventory.healthUpgrade == scene.player.myInventory.maxUpgrade) {
                            message.push("You feel like its impossible to get any healthier than this.");
                        } else { message.push(this.currentMessage); }
                        message.push("Your Max-HP increased to " + scene.player.max_hp + "!");
                        break;
                    case this.purchases.attack_upgrade:
                        message = [];
                        if (scene.player.myInventory.attackUpgrade == scene.player.myInventory.maxUpgrade) {
                            message.push("You feel like you can cut a mountain in half with one swing!");
                        } else { message.push(this.currentMessage); }
                        message.push("Your melee damage increased by x" + scene.player.getAttackBonus() + "!");
                        break;
                    case this.purchases.armor_upgrade:

                        message = [];
                        let armor = "";
                        if (scene.player.myInventory.armorUpgrade == 3) {
                            message.push("You feel like nothing can't stop you.");
                        } else {
                            if (scene.player.myInventory.armorUpgrade == 1) armor = "GOLD armor acquired!"
                            else if (scene.player.myInventory.armorUpgrade == 2) armor = "DIAMOND armor acquired!"
                            else if ((scene.player.myInventory.armorUpgrade == 3)) armor = "NETHERITE armor acquired!"
                        }
                        message.push(this.currentMessage + " " + armor);
                        message.push("Your incoming damage will be reduced by x" + scene.player.getDefenseBonus() + "!");
                        break;
                    case this.purchases.arrow_upgrade:
                        message = [];
                        if (scene.player.myInventory.arrowUpgrade == scene.player.myInventory.maxUpgrade) {
                            message.push("\"Sogege Soge Soge Sogeking〜♪\"");
                        }
                        let arrow = "";
                        if (scene.player.myInventory.arrowUpgrade == 1) arrow = "Arrow upgraded from STONE to IRON!"
                        else if (scene.player.myInventory.arrowUpgrade == 2) arrow = "Arrow upgraded from IRON to GOLD!"
                        else if ((scene.player.myInventory.arrowUpgrade == 3)) arrow = "Arrow upgraded from GOLD to DIAMOND!"
                        else if ((scene.player.myInventory.arrowUpgrade == 4)) arrow = "Arrow upgraded from DIAMOND to NETHERITE!"
                        message.push(arrow);
                        let newDmg = (this.game.camera.player.myInventory.arrowUpgrade * 2) + 10;
                        message.push("Your arrows will now fly faster and now do " + newDmg + " damage!");
                        break;
                    default:
                        message = this.currentMessage;
                }
            }

        }
        this.myTextBox.setMessage(message, true);
        this.currentMessage = message;
        if (message instanceof Array) this.myTextBox.centerBottomMulti();
        else this.myTextBox.centerBottomSingle();

    }

    isHighlighted() {
        return (this.highlightB1 || this.highlightB2 || this.highlightB3 || this.highlightB4 || this.highlightB5 || this.highlightB6);
    }

    updateAnimations() {
        const TICK = this.game.clockTick;
        this.myAnimations.forEach(anims => {
            anims.forEach(anim => {
                if (anim instanceof Animator) anim.update(TICK);
            })
        });

        if (this.maxed) this.distract.update(TICK);
    }

    loadAnimations() {

        this.armor[0] = new Animator(this.armor_sprite, 0, 0, 252, 63, 1, 0, 0, false, false, false);
        this.armor[1] = new Animator(this.armor_sprite, 0, 64, 252, 63, 1, 0, 0, false, false, false);
        this.armor[2] = new Animator(this.armor_sprite, 0, 128, 252, 63, 1, 0, 0, false, false, false);
        this.armor[3] = new Animator(this.armor_sprite, 0, 192, 252, 63, 1, 0, 0, false, false, false);

        this.diamond[0] = new Animator(this.diamond_sprite, 19, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[1] = new Animator(this.diamond_sprite, 35, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[2] = new Animator(this.diamond_sprite, 51, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[3] = new Animator(this.diamond_sprite, 67, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[4] = new Animator(this.diamond_sprite, 83, 84, 10, 8, 1, 0, 0, false, false, false);
        this.diamond[5] = new Animator(this.diamond_sprite, 99, 84, 10, 8, 1, 0, 0, false, false, false);

        this.health[0] = new Animator(this.health_sprite, PARAMS.HEART_DIM * 4, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.health[1] = new Animator(this.health_sprite, PARAMS.HEART_DIM * 3, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.health[2] = new Animator(this.health_sprite, PARAMS.HEART_DIM * 2, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.health[3] = new Animator(this.health_sprite, PARAMS.HEART_DIM, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);
        this.health[4] = new Animator(this.health_sprite, 0, 0, PARAMS.HEART_DIM, PARAMS.HEART_DIM, 1, 1, 0, false, false, false);

        this.arrow[0] = new Animator(this.arrow_sprite, 0, 46, 43, 34, 1, 0, 0, false, false, false);
        this.arrow[1] = new Animator(this.arrow_sprite, 43, 46, 43, 34, 1, 0, 0, false, false, false);
        this.arrow[2] = new Animator(this.arrow_sprite, 86, 46, 43, 34, 1, 0, 0, false, false, false);
        this.arrow[3] = new Animator(this.arrow_sprite, 130, 46, 43, 34, 1, 0, 0, false, false, false);

        this.attack[0] = new Animator(this.attack_sprite, 0, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[1] = new Animator(this.attack_sprite, 45, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[2] = new Animator(this.attack_sprite, 90, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[3] = new Animator(this.attack_sprite, 135, 0, 45, 45, 1, 0, 0, false, false, false);
        this.attack[4] = new Animator(this.attack_sprite, 180, 0, 45, 45, 1, 0, 0, false, false, false);

        this.button[0] = new Animator(this.interactables, 0, 0, 330, 130, 1, 0, 0, false, false, false);
        this.button[1] = new Animator(this.interactables, 0, 130, 330, 130, 1, 0, 0, false, false, false);
        this.button[2] = new Animator(this.interactables, 0, 260, 330, 130, 1, 0, 0, false, false, false);
        this.button[3] = new Animator(this.interactables, 0, 390, 330, 130, 1, 0, 0, false, false, false);
        this.button[4] = new Animator(this.interactables, 0, 520, 330, 130, 1, 0, 0, false, false, false);
        this.button[5] = new Animator(this.interactables, 0, 650, 330, 130, 1, 0, 0, false, false, false);

        this.progressbutton[0] = new Animator(this.interactables, 533, 73, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[1] = new Animator(this.interactables, 533, 146, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[2] = new Animator(this.interactables, 533, 219, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[3] = new Animator(this.interactables, 533, 292, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[4] = new Animator(this.interactables, 533, 365, 216, 71, 1, 0, 0, false, false, false);

        this.progressbutton2[0] = new Animator(this.interactables, 575, 511, 174, 71, 1, 0, 0, false, false, false);
        this.progressbutton2[1] = new Animator(this.interactables, 575, 584, 174, 71, 1, 0, 0, false, false, false);
        this.progressbutton2[2] = new Animator(this.interactables, 575, 657, 174, 71, 1, 0, 0, false, false, false);
        this.progressbutton2[3] = new Animator(this.interactables, 575, 730, 174, 71, 1, 0, 0, false, false, false);

        this.distract = new Animator(this.distract_sprite, 1, 0, 70, 70, 26, .08, 0, false, false, false);

        this.myAnimations = [this.armor, this.diamond, this.health, this.arrow, this.attack, this.button, this.progressbutton, this.progressbutton2];

    };

    draw(ctx) {

        let timerFont = ctx.font;
        let timerFill = ctx.fillStyle;

        // Shop Border and lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        /* Horizonal Lines across shop
        ctx.strokeStyle = 'rgba(50, 0, 107, 0.2)';
        ctx.strokeRect(this.x, this.y + this.height / 7 * 1, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 2, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 3, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 4, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 5, this.width, 0);
        ctx.strokeRect(this.x, this.y + this.height / 7 * 6, this.width, 0);
        */



        ctx.strokeStyle = 'rgba(50, 0, 107, 1)';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x - 1, this.y + 1, this.width + 1, this.height + 1);

        // Item text
        ctx.fillStyle = "white";
        ctx.font = ctx.font.replace(/\d+px/, "35px");
        ctx.fillText("Wizard's Shop", this.x + this.width / 4 + 8, this.y + + this.height / 7 * .5);

        ctx.font = ctx.font.replace(/\d+px/, "20px");
        ctx.fillText("Arrow Pack", this.x + 10, this.y + this.height / 7 * 1.3);
        ctx.fillText("Health Potion", this.x + 10, this.y + this.height / 7 * 2.3);
        ctx.fillText("Max-Health Upgrade", this.x + 10, this.y + this.height / 7 * 3.3);
        ctx.fillText("Attack Upgrade", this.x + 10, this.y + this.height / 7 * 4.3);
        ctx.fillText("Arrow Upgrade", this.x + 10, this.y + this.height / 7 * 5.3);
        ctx.fillText("Armor Upgrade", this.x + 10, this.y + this.height / 7 * 6.3);


        // Shop Icons
        ctx.font = ctx.font.replace(/\d+px/, "25px");
        ctx.fillText("🏹 x" + 10, this.x + 10, this.y + this.height / 7 * 1.75);
        ctx.fillText("⚗️ x" + 1, this.x + 10, this.y + this.height / 7 * 2.75);
        ctx.fillText("󠀠󠀠󠀠❤️ x1", this.x + 10, this.y + this.height / 7 * 3.75);


        // Item Animations
        this.health[Math.floor(this.timer / .5) % 5].drawFrame(this.game.clockTick, ctx, this.x + 5 + 8, this.y + this.height / 7 * 3.55, 1.7);
        this.attack[Math.floor(this.timer / .35) % 5].drawFrame(this.game.clockTick, ctx, this.x + 5 + 10, this.y + this.height / 7 * 4.3, 1.6);
        this.arrow[Math.floor(this.timer / 1) % 4].drawFrame(this.game.clockTick, ctx, this.x + 5 + 10, this.y + this.height / 7 * 5.4, 1.8);
        this.armor[Math.floor(this.timer / 1) % 4].drawFrame(this.game.clockTick, ctx, this.x + 5, this.y + this.height / 7 * 6.45, 1);

        if (this.maxed) {
            this.distract.drawFrame(this.game.clockTick, ctx, 1220, 161, 1);
        }

        this.buyButtonHighlight(ctx);
        this.manageButtons(ctx);
        this.manageProgress(ctx);
        this.manageExitButton(ctx);


        ctx.fillStyle = timerFill;
        ctx.font = timerFont;

        this.myTextBox.draw(ctx);
    };

    buyButtonHighlight(ctx) {

        /*  Style 2
            ctx.fillRect(this.x + this.width /6 * 5 - 25, this.y + this.height / 7 * 2.23 - 5, 330 * this.buttonscale - 10, 130 * this.buttonscale  + 10);
            ctx.fillRect(this.x + this.width /6 * 5 - 35, this.y + this.height / 7 * 2.23 + 5, 330 * this.buttonscale + 10, 130 * this.buttonscale - 10);
            ctx.fillRect(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 2.23, 330 * this.buttonscale, 130 * this.buttonscale);

            Style 3
            ctx.fillRect(this.x + this.width /6 * 5 - 20, this.y + this.height / 7 * 3.23 + 5, 330 * this.buttonscale - 15, 130 * this.buttonscale);
            ctx.fillRect(this.x + this.width /6 * 5 - 25, this.y + this.height / 7 * 3.23 + 10, 330 * this.buttonscale, 130 * this.buttonscale - 15);
            ctx.fillRect(this.x + this.width /6 * 5 - 25, this.y + this.height / 7 * 3.23 + 10, 330 * this.buttonscale - 5, 130 * this.buttonscale - 10);
            ctx.fillRect(this.x + this.width /6 * 5 - 20, this.y + this.height / 7 * 3.23 + 5, 330 * this.buttonscale - 10, 130 * this.buttonscale - 5);d
        */

        let timerFill = ctx.fillStyle;
        ctx.fillStyle = "white";


        if (this.highlightB1) {
            ctx.fillRect(this.ButtonBB1.x, this.ButtonBB1.y, this.ButtonBB1.width, this.ButtonBB1.height - 1); // Arrow Pack
        }
        else if (this.highlightB2) {
            ctx.fillRect(this.ButtonBB2.x, this.ButtonBB2.y, this.ButtonBB1.width, this.ButtonBB1.height - 1); // Health Potion
        }
        else if (this.highlightB3) {
            ctx.fillRect(this.ButtonBB3.x, this.ButtonBB3.y + 1, this.ButtonBB1.width, this.ButtonBB1.height - 1); // Max-Health Upgrade
        }
        else if (this.highlightB4) {
            ctx.fillRect(this.ButtonBB4.x, this.ButtonBB4.y + 1, this.ButtonBB1.width, this.ButtonBB1.height - 1); // Attack Upgrade
        }
        else if (this.highlightB5) {
            ctx.fillRect(this.ButtonBB5.x, this.ButtonBB5.y, this.ButtonBB1.width, this.ButtonBB1.height - 1); // Arrow Upgrade
        }
        else if (this.highlightB6) {
            ctx.fillRect(this.ButtonBB6.x, this.ButtonBB6.y, this.ButtonBB1.width, this.ButtonBB1.height); // Armor Upgrade
        }

        ctx.fillStyle = timerFill;

    };

    manageExitButton(ctx) {

        let timerFill = ctx.fillStyle;
        ctx.fillStyle = this.exitButtonColor;
        ctx.fillRect(this.x + this.width - 60, this.y + 20, 40, 40);
        ctx.fillStyle = "white";
        ctx.fillText("󠀠󠀠󠀠x", this.x + this.width - 60 + 8.8, this.y + 51);
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + this.width - 60, this.y + 20, 5, 5);
        ctx.fillRect(this.x + this.width - 60 + 35, this.y + 20, 5, 5);
        ctx.fillRect(this.x + this.width - 60, this.y + 20 + 35, 5, 5);
        ctx.fillRect(this.x + this.width - 60 + 35, this.y + 20 + 35, 5, 5);

        ctx.fillStyle = timerFill;
    };

    manageProgress(ctx) {

        // Purchasing
        let self = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {

                self.progressbutton[entity.myInventory.healthUpgrade].drawFrame(self.game.clockTick, ctx, self.x + self.width / 6 * 4, self.y + self.height / 7 * 3.36 + self.customPurchaseHeight, 0.5);
                self.progressbutton[entity.myInventory.attackUpgrade].drawFrame(self.game.clockTick, ctx, self.x + self.width / 6 * 4, self.y + self.height / 7 * 4.36 + self.customPurchaseHeight, 0.5);
                self.progressbutton[entity.myInventory.arrowUpgrade].drawFrame(self.game.clockTick, ctx, self.x + self.width / 6 * 4, self.y + self.height / 7 * 5.36 + self.customPurchaseHeight, 0.5);
                self.progressbutton2[entity.myInventory.armorUpgrade].drawFrame(self.game.clockTick, ctx, self.x + self.width / 6 * 4 + 10, self.y + self.height / 7 * 6.36 + self.customPurchaseHeight, 0.5);

            }
        });
    };

    manageButtons(ctx) {

        let timerFilter = ctx.filter;

        // determine if player is able to purchase an item
        let self = this;

        let item1 = false;
        let item2 = false;
        let item3 = false;
        let item4 = false;
        let item5 = false;
        let item6 = false;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {

                if (entity.myInventory.diamonds >= self.arrowPackCost[entity.myInventory.arrowUpgrade])  // Arrow pack
                    item1 = true;
                if (entity.myInventory.diamonds >= self.potionCost)                                                   // Health potion
                    item2 = true;
                if (entity.myInventory.diamonds >= self.healthCost[entity.myInventory.healthUpgrade])  // Max Health potion
                    item3 = true;
                if (entity.myInventory.diamonds >= self.attackCost[entity.myInventory.attackUpgrade])  // Attack Upgrade
                    item4 = true;
                if (entity.myInventory.diamonds >= self.arrowCost[entity.myInventory.arrowUpgrade])  // Arrow Upgrade
                    item5 = true;
                if (entity.myInventory.diamonds >= self.armorCost[entity.myInventory.armorUpgrade])  // Armor Upgrade
                    item6 = true;
            }
        });

        // buttons
        if (!item1) {
            ctx.filter = "grayscale(1)";
        }
        this.button[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.ButtonBB1.x, this.ButtonBB1.y, this.buttonscale);
        ctx.filter = timerFilter;

        if (!item2) {
            ctx.filter = "grayscale(1)";
        }
        this.button[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.ButtonBB2.x, this.ButtonBB2.y, this.buttonscale);
        ctx.filter = timerFilter;

        if (!item3) {
            ctx.filter = "grayscale(1)";
        }
        this.button[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.ButtonBB3.x, this.ButtonBB3.y, this.buttonscale);
        ctx.filter = timerFilter;

        if (!item4) {
            ctx.filter = "grayscale(1)";
        }
        this.button[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.ButtonBB4.x, this.ButtonBB4.y, this.buttonscale);
        ctx.filter = timerFilter;

        if (!item5) {
            ctx.filter = "grayscale(1)";
        }
        this.button[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.ButtonBB5.x, this.ButtonBB5.y, this.buttonscale);
        ctx.filter = timerFilter;

        if (!item6) {
            ctx.filter = "grayscale(1)";
        }
        this.button[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.ButtonBB6.x, this.ButtonBB6.y, this.buttonscale);
        ctx.filter = timerFilter;


        // buttton purchasing cost text
        this.game.entities.forEach(function (entity) {
            if (entity instanceof AbstractPlayer) {

                // Shop Icons
                ctx.font = ctx.font.replace(/\d+px/, "25px");
                ctx.fillText("󠀠󠀠󠀠  x" + self.arrowPackCost[entity.myInventory.arrowUpgrade], self.x + self.width / 6 * 5 - 24, self.y + self.height / 7 * 1.63 + self.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + self.potionCost, self.x + self.width / 6 * 5 - 24, self.y + self.height / 7 * 2.63 + self.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + self.healthCost[entity.myInventory.healthUpgrade], self.x + self.width / 6 * 5 - 24, self.y + self.height / 7 * 3.63 + self.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + self.attackCost[entity.myInventory.attackUpgrade], self.x + self.width / 6 * 5 - 24, self.y + self.height / 7 * 4.63 + self.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + self.arrowCost[entity.myInventory.arrowUpgrade], self.x + self.width / 6 * 5 - 24, self.y + self.height / 7 * 5.63 + self.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + self.armorCost[entity.myInventory.armorUpgrade], self.x + self.width / 6 * 5 - 24, self.y + self.height / 7 * 6.63 + self.customPurchaseHeight);

            }
        });

        // displays diamond on button - grey if player doesnt have enough diamond for purchase
        if (!item1) {
            ctx.filter = "grayscale(1)";
        }
        this.diamond[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.x + this.width / 6 * 5 - 19, this.y + this.height / 7 * 1.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = timerFilter;

        if (!item2) {
            ctx.filter = "grayscale(1)";
        }
        this.diamond[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.x + this.width / 6 * 5 - 19, this.y + this.height / 7 * 2.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = timerFilter;

        if (!item3) {
            ctx.filter = "grayscale(1)";
        }
        this.diamond[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.x + this.width / 6 * 5 - 19, this.y + this.height / 7 * 3.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = timerFilter;

        if (!item4) {
            ctx.filter = "grayscale(1)";
        }
        this.diamond[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.x + this.width / 6 * 5 - 19, this.y + this.height / 7 * 4.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = timerFilter;

        if (!item5) {
            ctx.filter = "grayscale(1)";
        }
        this.diamond[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.x + this.width / 6 * 5 - 19, this.y + this.height / 7 * 5.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = timerFilter;

        if (!item6) {
            ctx.filter = "grayscale(1)";
        }
        this.diamond[Math.floor(this.timer / .125) % 6].drawFrame(this.game.clockTick, ctx, this.x + this.width / 6 * 5 - 19, this.y + this.height / 7 * 6.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = timerFilter;

    };

    updateBoxes() {

        this.ButtonBB1 = new BoundingBox(this.x + this.width / 6 * 5 - 30, this.y + this.height / 7 * 1.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB2 = new BoundingBox(this.x + this.width / 6 * 5 - 30, this.y + this.height / 7 * 2.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB3 = new BoundingBox(this.x + this.width / 6 * 5 - 30, this.y + this.height / 7 * 3.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB4 = new BoundingBox(this.x + this.width / 6 * 5 - 30, this.y + this.height / 7 * 4.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB5 = new BoundingBox(this.x + this.width / 6 * 5 - 30, this.y + this.height / 7 * 5.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB6 = new BoundingBox(this.x + this.width / 6 * 5 - 30, this.y + this.height / 7 * 6.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ExitBB = new BoundingBox(this.x + this.width - 60, this.y + 20, 40, 40);

    };

    drawDebug(ctx) {
        let timerStyle = ctx.strokeStyle;
        ctx.strokeStyle = "Red";
        ctx.strokeRect(this.ButtonBB1.x, this.ButtonBB1.y, this.ButtonBB1.width, this.ButtonBB1.height);
        ctx.strokeRect(this.ButtonBB2.x, this.ButtonBB2.y, this.ButtonBB2.width, this.ButtonBB2.height);
        ctx.strokeRect(this.ButtonBB3.x, this.ButtonBB3.y, this.ButtonBB3.width, this.ButtonBB3.height);
        ctx.strokeRect(this.ButtonBB4.x, this.ButtonBB4.y, this.ButtonBB4.width, this.ButtonBB4.height);
        ctx.strokeRect(this.ButtonBB5.x, this.ButtonBB5.y, this.ButtonBB5.width, this.ButtonBB5.height);
        ctx.strokeRect(this.ButtonBB6.x, this.ButtonBB6.y, this.ButtonBB6.width, this.ButtonBB6.height);

        ctx.strokeRect(this.game.mouse.x, this.game.mouse.y, 5, 5);

        ctx.strokeStyle = "White";
        ctx.strokeRect(this.ExitBB.x, this.ExitBB.y, this.ExitBB.width, this.ExitBB.height);

        ctx.strokeStyle = timerStyle;
    };
};
