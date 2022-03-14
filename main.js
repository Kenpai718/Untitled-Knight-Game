const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager(); //used for images and sfx
const MUSIC_MANAGER = new AssetManager(); //used strictly for music tracks

//queue downloads
//main character
ASSET_MANAGER.queueDownload("./sprites/knight/knightLeft.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightRight.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightLeft1.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightRight1.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightLeft2.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightRight2.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightLeft3.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightRight3.png");
ASSET_MANAGER.queueDownload("./sprites/knight/armorLeft.png");
ASSET_MANAGER.queueDownload("./sprites/knight/armorRight.png");
ASSET_MANAGER.queueDownload("./sprites/projectile/arrows.png");
ASSET_MANAGER.queueDownload("./sprites/projectile/arrowupgrades.png");
ASSET_MANAGER.queueDownload("./sprites/projectile/bladeBeam.png");

//enemies
ASSET_MANAGER.queueDownload("./sprites/enemy/wizard.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/ascended_wizard.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/skeleton.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/goblin.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/mushroom.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/flyingeye.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/demon_slime.png");

//environment
ASSET_MANAGER.queueDownload("./sprites/environment/dark_castle_tileset.png");
ASSET_MANAGER.queueDownload("./sprites/environment/moonlit_sky.png");
ASSET_MANAGER.queueDownload("./sprites/environment/moonlit_sky_2.png");
ASSET_MANAGER.queueDownload("./sprites/environment/Obelisk_full.png");
ASSET_MANAGER.queueDownload("./sprites/environment/distraction.png");
ASSET_MANAGER.queueDownload("./sprites/environment/portal.png");
ASSET_MANAGER.queueDownload("./sprites/environment/sign.png");

//other
ASSET_MANAGER.queueDownload("./sprites/GUI/Hearts.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/vignette.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/armor.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/bows.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/attack.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/interactables.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/crosshair.png");
ASSET_MANAGER.queueDownload("./sprites/GUI/game_over.png");

//music
MUSIC_MANAGER.queueDownload(MUSIC.CHASING_DAYBREAK);
MUSIC_MANAGER.queueDownload(MUSIC.FODLAN_WINDS);
MUSIC_MANAGER.queueDownload(MUSIC.BETWEEN_HEAVEN_AND_EARTH);
MUSIC_MANAGER.queueDownload(MUSIC.LONG_WAY);
MUSIC_MANAGER.queueDownload(MUSIC.TITLE);
MUSIC_MANAGER.queueDownload(MUSIC.SPLENDOUR);
MUSIC_MANAGER.queueDownload(MUSIC.SIGNORA);
MUSIC_MANAGER.queueDownload(MUSIC.COUNTERATTACK);
MUSIC_MANAGER.queueDownload(MUSIC.MEMORIES);
MUSIC_MANAGER.queueDownload(MUSIC.FOG);
MUSIC_MANAGER.queueDownload(MUSIC.VEILED_IN_BLACK);




//sfx
ASSET_MANAGER.queueDownload(SFX.ARROW_HIT);
ASSET_MANAGER.queueDownload(SFX.BOW_SHOT);
ASSET_MANAGER.queueDownload(SFX.ARROW_STICK);
ASSET_MANAGER.queueDownload(SFX.CLICK);
ASSET_MANAGER.queueDownload(SFX.SELECT);
ASSET_MANAGER.queueDownload(SFX.DISTRACT);
ASSET_MANAGER.queueDownload(SFX.ITEM_PICKUP);
ASSET_MANAGER.queueDownload(SFX.SLASH1);
ASSET_MANAGER.queueDownload(SFX.SLASH2);
ASSET_MANAGER.queueDownload(SFX.JUMP);
ASSET_MANAGER.queueDownload(SFX.JUMP2);
ASSET_MANAGER.queueDownload(SFX.DOUBLEJUMP);
ASSET_MANAGER.queueDownload(SFX.WALLJUMP);
ASSET_MANAGER.queueDownload(SFX.CRITICAL);
ASSET_MANAGER.queueDownload(SFX.DODGE);
ASSET_MANAGER.queueDownload(SFX.DAMAGED);
ASSET_MANAGER.queueDownload(SFX.HEAL);
ASSET_MANAGER.queueDownload(SFX.DRINK);
ASSET_MANAGER.queueDownload(SFX.HEARTBEAT);
ASSET_MANAGER.queueDownload(SFX.PLAYER_DEATH);
ASSET_MANAGER.queueDownload(SFX.PLAYER_GRUNT);
ASSET_MANAGER.queueDownload(SFX.PLAYER_GRUNT2);
ASSET_MANAGER.queueDownload(SFX.PLAYER_GRUNT3);
ASSET_MANAGER.queueDownload(SFX.SHIELD_BLOCK);
ASSET_MANAGER.queueDownload(SFX.DOOR_ENTER);
ASSET_MANAGER.queueDownload(SFX.CHEST_OPEN);
ASSET_MANAGER.queueDownload(SFX.OBELISK_ON);
ASSET_MANAGER.queueDownload(SFX.NEW_ITEM);
ASSET_MANAGER.queueDownload(SFX.NEW_HEART);
ASSET_MANAGER.queueDownload(SFX.ENCHANTMENT);
ASSET_MANAGER.queueDownload(SFX.ANVIL);
ASSET_MANAGER.queueDownload(SFX.BERSERK_ACTIVATE);
ASSET_MANAGER.queueDownload(SFX.RESPAWN);
ASSET_MANAGER.queueDownload(SFX.COMPLETE);
ASSET_MANAGER.queueDownload(SFX.TRIGGER);
ASSET_MANAGER.queueDownload(SFX.EVIL_LAUGH);
ASSET_MANAGER.queueDownload(SFX.SUPER_SAIYAN);
ASSET_MANAGER.queueDownload(SFX.COMPLETION);
//ASSET_MANAGER.queueDownload(SFX.CHECKPOINT);

// Leave this SFX to suffer at the bottom >:D
ASSET_MANAGER.queueDownload(SFX.PURCHASE);




ASSET_MANAGER.downloadAll(() => {
	MUSIC_MANAGER.downloadAll();
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	//play music
	/**
	 * force play is a temporary method until a title screen is made
	 * It pings the webpage to play every few seconds until it can and
	 * sets the song to play on auto repeat
	*/
	//ASSET_MANAGER.forcePlayMusic(MUSIC.CHASING_DAYBREAK);

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
