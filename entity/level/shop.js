class Shop {
    constructor(game) {
        Object.assign(this,{game});
        this.width = 900;
        this.height = 800;

        this.x = 1920/2 - this.width / 2;
        this.y = 1080/2 - this.height / 2 - 50;

        this.diamond_sprite = ASSET_MANAGER.getAsset("./sprites/environment/dark_castle_tileset.png");
        this.distract_sprite = ASSET_MANAGER.getAsset("./sprites/environment/distraction.png");
        this.armor_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/armor.png");
        this.attack_sprite = ASSET_MANAGER.getAsset("./sprites/GUI/attack.png");
        this.interactables = ASSET_MANAGER.getAsset("./sprites/GUI/interactables.png");
        this.health_sprite = ASSET_MANAGER.getAsset("./sprites/Hearts.png");
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

        // GUI icons and cost
        this.health = [];
        this.healthCost = [20, 40, 60, 80, "MAX"];
        this.attack = [];
        this.attackCost = [25, 50, 75, 100, "MAX"];
        this.arrow = [];
        this.arrowCost = [30, 60, 90, 120, "MAX"];
        this.arrowPackCost = [10, 10, 10, 10, 10];
        this.armor = [];
        this.armorCost = [60, 90, 120, "MAX"];

        // animations speeds
        this.seconds = 0;
        this.secondsx2 = 0;
        this.secondsx4 = 0;
        this.temp = 0;
        this.tempx2 = 0;
        this.tempx4 = 0;

        // Object Parameters
        this.buttonwidth = 330;
        this.buttonheight = 130;
        this.buttonscale = 0.5;
        this.customPurchaseHeight = -10; // Set to 0 for correct placement for horizontal lines

        // Load Items
        this.loadAnimations();
        this.updateBoxes();
    };



    update(){

        this.temp += this.game.clockTick * 1;
        this.tempx2 += this.game.clockTick * 2;
        this.tempx4 += this.game.clockTick * 8;
        if(this.temp > 1){
            this.temp--;
            this.seconds += 1;
        }
        if(this.tempx2 > 1){
            this.tempx2--;
            this.secondsx2 += 1;
        }
        if(this.tempx4 > 1){
            this.tempx4--;
            this.secondsx4 += 1;
        }


        // Purchasing (clicked button in shop) 
        let that = this;
        this.game.entities.forEach(function (entity) {
            let mouseBB = new BoundingBox(that.game.mouse.x, that.game.mouse.y, 1, 1);
            
            if(that.game.click) ASSET_MANAGER.playAsset(SFX.CLICK);

            // Exit button interaction
            if(mouseBB.collide(that.ExitBB)){
                that.exitButtonColor = "Red"
                if(that.game.click)
                    SHOP_ACTIVE = false;
            }
            else that.exitButtonColor = 'rgba(190, 0, 0, 0.8)';

            if(entity instanceof AbstractPlayer) {

                if(mouseBB.collide(that.ButtonBB1)){
                    //console.log("Button 1 : Arrow Pack");

                    if(entity.myInventory.diamonds >= that.arrowPackCost[entity.myInventory.arrowUpgrade]){
                        that.highlightB1 = true; 

                        if(that.game.click){
                            entity.myInventory.diamonds -= that.arrowPackCost[entity.myInventory.arrowUpgrade];
                            entity.myInventory.arrows += 10;
                            ASSET_MANAGER.playAsset(SFX.NEW_ITEM);
                        }
                    }

                }
                else if(mouseBB.collide(that.ButtonBB2)){
                    //console.log("Button 2 : Health Potion");

                    if(entity.myInventory.diamonds >= 10){
                        that.highlightB2 = true; 

                        if(that.game.click){
                            entity.myInventory.diamonds -= 10;
                            entity.myInventory.potions += 1;
                            ASSET_MANAGER.playAsset(SFX.NEW_ITEM);
                        }
                    }
                }
                else if(mouseBB.collide(that.ButtonBB3)){
                    //console.log("Button 3 : Health Upgrade");

                    if(entity.myInventory.diamonds >= that.healthCost[entity.myInventory.healthUpgrade]){
                    that.highlightB3 = true; 

                        if(that.game.click){
                            entity.myInventory.diamonds -= that.healthCost[entity.myInventory.healthUpgrade];
                            entity.myInventory.healthUpgrade += 1;

                            //add hearts to heartbar and player
                            let player_hearts = that.game.camera.heartsbar;
                            player_hearts.addHeart();
                            ASSET_MANAGER.playAsset(SFX.NEW_HEART);
                        }
                    }
                }
                else if(mouseBB.collide(that.ButtonBB4)){
                    //console.log("Button 4 : Attack Upgrade");

                    if(entity.myInventory.diamonds >= that.attackCost[entity.myInventory.attackUpgrade]){
                        that.highlightB4 = true; 

                        if(that.game.click){
                            entity.myInventory.diamonds -= that.attackCost[entity.myInventory.attackUpgrade];
                            entity.myInventory.attackUpgrade += 1;
                            ASSET_MANAGER.playAsset(SFX.ENCHANTMENT);
                        }
                    }
                }
                else if(mouseBB.collide(that.ButtonBB5)){
                    //console.log("Button 5 : Arrow Upgrade");

                    if(entity.myInventory.diamonds >= that.arrowCost[entity.myInventory.arrowUpgrade]){
                        that.highlightB5 = true; 

                        if(that.game.click){
                            entity.myInventory.diamonds -= that.arrowCost[entity.myInventory.arrowUpgrade];
                            entity.myInventory.arrowUpgrade += 1;
                            entity.myInventory.arrows += 10;
                            //entity.myInventory.arrows = Math.floor(entity.myInventory.arrows/2); 
                            ASSET_MANAGER.playAsset(SFX.NEW_ITEM);
                        }
                    }
                }
                else if(mouseBB.collide(that.ButtonBB6)){
                    //console.log("Button 6 : Armor Upgrade");

                    if(entity.myInventory.diamonds >= that.armorCost[entity.myInventory.armorUpgrade]){
                        that.highlightB6 = true; 

                        if(that.game.click){
                            entity.myInventory.diamonds -= that.armorCost[entity.myInventory.armorUpgrade];
                            entity.myInventory.armorUpgrade += 1;
                            ASSET_MANAGER.playAsset(SFX.ANVIL);
                        }
                    }
                }
                else {
                    that.highlightB1 = false;
                    that.highlightB2 = false;
                    that.highlightB3 = false;
                    that.highlightB4 = false;
                    that.highlightB5 = false;
                    that.highlightB6 = false;
                }
                
                if( entity.myInventory.healthUpgrade >= 4 &&
                    entity.myInventory.attackUpgrade >= 4 &&
                    entity.myInventory.arrowUpgrade >= 4 &&
                    entity.myInventory.armorUpgrade >= 3 &&
                    that.maxed == false && entity.myInventory.maxxed == false) {
                        that.maxed = true;
                        entity.myInventory.maxxed = true;
                        ASSET_MANAGER.playAsset(SFX.DISTRACT);
                }

        }

            that.game.click = false;
        });

    };

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

        this.arrow[0] = new Animator(this.arrow_sprite, 0,     46, 43, 34, 1, 0, 0, false, false, false);
        this.arrow[1] = new Animator(this.arrow_sprite, 43,    46, 43, 34, 1, 0, 0, false, false, false);
        this.arrow[2] = new Animator(this.arrow_sprite, 86,    46, 43, 34, 1, 0, 0, false, false, false);
        this.arrow[3] = new Animator(this.arrow_sprite, 130,   46, 43, 34, 1, 0, 0, false, false, false);

        this.attack[0] = new Animator(this.attack_sprite, 36,     0, 36, 44, 1, 0, 0, false, false, false);
        this.attack[1] = new Animator(this.attack_sprite, 72,     0, 36, 44, 1, 0, 0, false, false, false);
        this.attack[2] = new Animator(this.attack_sprite, 108,    0, 36, 44, 1, 0, 0, false, false, false);
        this.attack[3] = new Animator(this.attack_sprite, 144,    0, 36, 44, 1, 0, 0, false, false, false);

        this.button[0] = new Animator(this.interactables, 0, 0,     330, 130, 1, 0, 0, false, false, false);
        this.button[1] = new Animator(this.interactables, 0, 130,   330, 130, 1, 0, 0, false, false, false);
        this.button[2] = new Animator(this.interactables, 0, 260,   330, 130, 1, 0, 0, false, false, false);
        this.button[3] = new Animator(this.interactables, 0, 390,   330, 130, 1, 0, 0, false, false, false);
        this.button[4] = new Animator(this.interactables, 0, 520,   330, 130, 1, 0, 0, false, false, false);
        this.button[5] = new Animator(this.interactables, 0, 650,   330, 130, 1, 0, 0, false, false, false);

        this.progressbutton[0] = new Animator(this.interactables, 533,   73, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[1] = new Animator(this.interactables, 533,   146, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[2] = new Animator(this.interactables, 533,   219, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[3] = new Animator(this.interactables, 533,   292, 216, 71, 1, 0, 0, false, false, false);
        this.progressbutton[4] = new Animator(this.interactables, 533,   365, 216, 71, 1, 0, 0, false, false, false);

        this.progressbutton2[0] = new Animator(this.interactables, 575,   511, 174, 71, 1, 0, 0, false, false, false);
        this.progressbutton2[1] = new Animator(this.interactables, 575,   584, 174, 71, 1, 0, 0, false, false, false);
        this.progressbutton2[2] = new Animator(this.interactables, 575,   657, 174, 71, 1, 0, 0, false, false, false);
        this.progressbutton2[3] = new Animator(this.interactables, 575,   730, 174, 71, 1, 0, 0, false, false, false);

        this.distract = new Animator(this.distract_sprite, 1, 0, 70, 70, 26, .08, 0, false, false, false);

    };

    draw(ctx) {

        let tempFont = ctx.font;
        let tempFill = ctx.fillStyle;

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
        ctx.strokeRect(this.x-1, this.y+1, this.width+1, this.height+1);

        // Item text
        ctx.fillStyle = "white";
        ctx.font = ctx.font.replace(/\d+px/, "35px");
        ctx.fillText("Wizard's Shop", this.x + this.width /4 + 8, this.y + + this.height / 7 * .5);

        ctx.font = ctx.font.replace(/\d+px/, "20px");
        ctx.fillText("Arrow Pack",      this.x + 10, this.y + this.height / 7 * 1.3);
        ctx.fillText("Health Potion",    this.x + 10, this.y + this.height / 7 * 2.3);
        ctx.fillText("Max-Health Upgrade",  this.x + 10, this.y + this.height / 7 * 3.3);
        ctx.fillText("Attack Upgrade",  this.x + 10, this.y + this.height / 7 * 4.3);
        ctx.fillText("Arrow Upgrade",   this.x + 10, this.y + this.height / 7 * 5.3);
        ctx.fillText("Armor Upgrade",   this.x + 10, this.y + this.height / 7 * 6.3);


        // Shop Icons
        ctx.font = ctx.font.replace(/\d+px/, "25px");
        ctx.fillText("🏹 x" + 10,   this.x + 10, this.y + this.height / 7 * 1.75);
        ctx.fillText("⚗️ x" + 1,    this.x + 10, this.y + this.height / 7 * 2.75);
        ctx.fillText("󠀠󠀠󠀠❤️ x1",       this.x + 10, this.y + this.height / 7 * 3.75);


        // Item Animations
        this.health[this.secondsx2%5].drawFrame(this.game.clockTick,    ctx, this.x + 5 + 8, this.y + this.height / 7 * 3.55, 1.7);
        this.attack[this.secondsx2%4].drawFrame(this.game.clockTick,       ctx, this.x + 5 + 10, this.y + this.height / 7 * 4.3, 1.6);
        this.arrow[this.seconds%4].drawFrame(this.game.clockTick,      ctx, this.x + 5 + 10, this.y + this.height / 7 * 5.4, 1.8);
        this.armor[this.seconds%4].drawFrame(this.game.clockTick,       ctx, this.x + 5, this.y + this.height / 7 * 6.45, 1);

        if(this.maxed){
            this.distract.drawFrame(this.game.clockTick, ctx, 1220, 161, 1);
        }

        this.buyButtonHighlight(ctx);
        this.manageButtons(ctx);
        this.manageProgress(ctx);
        this.manageExitButton(ctx);
        

        ctx.fillStyle = tempFill; 
        ctx.font = tempFont; 
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

        let tempFill = ctx.fillStyle;
        ctx.fillStyle = "white";

        if(this.highlightB1){
            ctx.fillRect(this.ButtonBB1.x, this.ButtonBB1.y, this.ButtonBB1.width, this.ButtonBB1.height -1);     
        }
        else if(this.highlightB2){
            ctx.fillRect(this.ButtonBB2.x, this.ButtonBB2.y, this.ButtonBB1.width, this.ButtonBB1.height -1);   
        }
        else if(this.highlightB3){
            ctx.fillRect(this.ButtonBB3.x, this.ButtonBB3.y, this.ButtonBB1.width, this.ButtonBB1.height -1);   
        }
        else if(this.highlightB4){
            ctx.fillRect(this.ButtonBB4.x, this.ButtonBB4.y, this.ButtonBB1.width, this.ButtonBB1.height -1);
        }
        else if(this.highlightB5){
            ctx.fillRect(this.ButtonBB5.x, this.ButtonBB5.y, this.ButtonBB1.width, this.ButtonBB1.height -1);
        }
        else if(this.highlightB6){
            ctx.fillRect(this.ButtonBB6.x, this.ButtonBB6.y, this.ButtonBB1.width, this.ButtonBB1.height);
        }

        ctx.fillStyle = tempFill;

    };

    manageExitButton(ctx) {

        let tempFill = ctx.fillStyle;
        ctx.fillStyle = this.exitButtonColor;
        ctx.fillRect(this.x + this.width - 60, this.y + 20, 40, 40);
        ctx.fillStyle = "white";
        ctx.fillText("󠀠󠀠󠀠x", this.x + this.width - 60 + 8.8, this.y + 51);
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + this.width - 60, this.y + 20, 5, 5);
        ctx.fillRect(this.x + this.width - 60 + 35, this.y + 20, 5, 5);
        ctx.fillRect(this.x + this.width - 60, this.y + 20 + 35, 5, 5);
        ctx.fillRect(this.x + this.width - 60 + 35, this.y + 20 + 35, 5, 5);

        ctx.fillStyle = tempFill;
    };

    manageProgress(ctx){

        // Purchasing
        let that = this;
        this.game.entities.forEach(function (entity) {
            if(entity instanceof AbstractPlayer){

                that.progressbutton[entity.myInventory.healthUpgrade].drawFrame(that.game.clockTick, ctx, that.x + that.width /6 * 4, that.y + that.height / 7 * 3.36 + that.customPurchaseHeight, 0.5);
                that.progressbutton[entity.myInventory.attackUpgrade].drawFrame(that.game.clockTick, ctx, that.x + that.width /6 * 4, that.y + that.height / 7 * 4.36 + that.customPurchaseHeight, 0.5);
                that.progressbutton[entity.myInventory.arrowUpgrade].drawFrame(that.game.clockTick, ctx, that.x + that.width /6 * 4, that.y + that.height / 7 * 5.36 + that.customPurchaseHeight, 0.5);
                that.progressbutton2[entity.myInventory.armorUpgrade].drawFrame(that.game.clockTick, ctx, that.x + that.width /6 * 4 + 10, that.y + that.height / 7 * 6.36 + that.customPurchaseHeight, 0.5);

            }
        });
    };

    manageButtons(ctx){

        let tempFilter = ctx.filter;
        
        // determine if player is able to purchase an item
        let that = this;

        let item1 = false;
        let item2 = false;
        let item3 = false;
        let item4 = false;
        let item5 = false;
        let item6 = false;
        this.game.entities.forEach(function (entity) {
            if(entity instanceof AbstractPlayer){
  
                if(entity.myInventory.diamonds >= that.arrowPackCost[entity.myInventory.arrowUpgrade])  // Arrow pack
                    item1 = true;
                if(entity.myInventory.diamonds >= 10)                                                   // Health potion
                    item2 = true;
                if(entity.myInventory.diamonds >= that.healthCost[entity.myInventory.healthUpgrade])  // Max Health potion
                    item3 = true;
                if(entity.myInventory.diamonds >= that.attackCost[entity.myInventory.attackUpgrade])  // Attack Upgrade
                    item4 = true;
                if(entity.myInventory.diamonds >= that.arrowCost[entity.myInventory.arrowUpgrade])  // Arrow Upgrade
                    item5 = true;
                if(entity.myInventory.diamonds >= that.armorCost[entity.myInventory.armorUpgrade])  // Armor Upgrade
                    item6 = true;
            }
        });

        // buttons
        if(!item1){
            ctx.filter = "grayscale(1)";
        }
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.ButtonBB1.x, this.ButtonBB1.y, this.buttonscale);
        ctx.filter = tempFilter;

        if(!item2){
            ctx.filter = "grayscale(1)";
        }    
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.ButtonBB2.x, this.ButtonBB2.y, this.buttonscale);
        ctx.filter = tempFilter; 

        if(!item3){
            ctx.filter = "grayscale(1)";
        }
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.ButtonBB3.x, this.ButtonBB3.y, this.buttonscale);
        ctx.filter = tempFilter;

        if(!item4){
            ctx.filter = "grayscale(1)";
        }
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.ButtonBB4.x, this.ButtonBB4.y, this.buttonscale);
        ctx.filter = tempFilter;

        if(!item5){
            ctx.filter = "grayscale(1)";
        }
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.ButtonBB5.x, this.ButtonBB5.y, this.buttonscale);
        ctx.filter = tempFilter;

        if(!item6){
            ctx.filter = "grayscale(1)";
        }
        this.button[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.ButtonBB6.x, this.ButtonBB6.y, this.buttonscale);
        ctx.filter = tempFilter;
        
        
        // buttton purchasing cost text
        this.game.entities.forEach(function (entity) {
            if(entity instanceof AbstractPlayer){

                // Shop Icons
                ctx.font = ctx.font.replace(/\d+px/, "25px");
                ctx.fillText("󠀠󠀠󠀠  x" + that.arrowPackCost[entity.myInventory.arrowUpgrade],           that.x + that.width /6 * 5 - 24, that.y + that.height / 7 * 1.63 + that.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + 10,                                                            that.x + that.width /6 * 5 - 24, that.y + that.height / 7 * 2.63 + that.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + that.healthCost[entity.myInventory.healthUpgrade],             that.x + that.width /6 * 5 - 24, that.y + that.height / 7 * 3.63 + that.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + that.attackCost[entity.myInventory.attackUpgrade],             that.x + that.width /6 * 5 - 24, that.y + that.height / 7 * 4.63 + that.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + that.arrowCost[entity.myInventory.arrowUpgrade],               that.x + that.width /6 * 5 - 24, that.y + that.height / 7 * 5.63 + that.customPurchaseHeight);
                ctx.fillText("󠀠󠀠󠀠  x" + that.armorCost[entity.myInventory.armorUpgrade],               that.x + that.width /6 * 5 - 24, that.y + that.height / 7 * 6.63 + that.customPurchaseHeight);

            }
        });

        // displays diamond on button - grey if player doesnt have enough diamond for purchase
        if(!item1){
            ctx.filter = "grayscale(1)";
        }
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 19, this.y + this.height / 7 * 1.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = tempFilter;
        
        if(!item2){
            ctx.filter = "grayscale(1)";
        }
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 19, this.y + this.height / 7 * 2.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = tempFilter;

        if(!item3){
            ctx.filter = "grayscale(1)";
        }
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 19, this.y + this.height / 7 * 3.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = tempFilter;

        if(!item4){
            ctx.filter = "grayscale(1)";
        }
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 19, this.y + this.height / 7 * 4.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = tempFilter;

        if(!item5){
            ctx.filter = "grayscale(1)";
        }
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 19, this.y + this.height / 7 * 5.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = tempFilter;

        if(!item6){
            ctx.filter = "grayscale(1)";
        }
        this.diamond[this.secondsx4%6].drawFrame(this.game.clockTick, ctx, this.x + this.width /6 * 5 - 19, this.y + this.height / 7 * 6.39 + this.customPurchaseHeight, 3.4);
        ctx.filter = tempFilter;

    };

    updateBoxes(){

        this.ButtonBB1 = new BoundingBox(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 1.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB2 = new BoundingBox(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 2.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB3 = new BoundingBox(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 3.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB4 = new BoundingBox(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 4.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB5 = new BoundingBox(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 5.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ButtonBB6 = new BoundingBox(this.x + this.width /6 * 5 - 30, this.y + this.height / 7 * 6.23 + this.customPurchaseHeight, this.buttonwidth * this.buttonscale, this.buttonheight * this.buttonscale);
        this.ExitBB = new BoundingBox(this.x + this.width - 60, this.y + 20, 40, 40);

    };

    drawDebug(ctx) {
        let tempStyle = ctx.strokeStyle;
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

        ctx.strokeStyle = tempStyle;
    };
};