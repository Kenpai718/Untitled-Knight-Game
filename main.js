const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//queue downloads
//main character
ASSET_MANAGER.queueDownload("./sprites/knight/knightLeft.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightRight.png");
ASSET_MANAGER.queueDownload("./sprites/projectile/arrow.png");
ASSET_MANAGER.queueDownload("./sprites/Hearts.png");

//enemies
ASSET_MANAGER.queueDownload("./sprites/enemy/wizard.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/skeleton.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/goblin.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/mushroom.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/flyingeye.png");

//environment
ASSET_MANAGER.queueDownload("./sprites/environment/dark_castle_tileset.png");
ASSET_MANAGER.queueDownload("./sprites/environment/moonlit_sky.png");

//other
ASSET_MANAGER.queueDownload("./sprites/vignette.png");

//music
ASSET_MANAGER.queueDownload("./sound/music/FE3H-Chasing-Daybreak.mp3");

//sfx
ASSET_MANAGER.queueDownload(SFX.ARROW_HIT);
ASSET_MANAGER.queueDownload(SFX.BOW_SHOT);
ASSET_MANAGER.queueDownload(SFX.ARROW_STICK);
ASSET_MANAGER.queueDownload(SFX.CLICK);
ASSET_MANAGER.queueDownload(SFX.ITEM_PICKUP);
ASSET_MANAGER.queueDownload(SFX.SLASH1);
ASSET_MANAGER.queueDownload(SFX.SLASH2);
ASSET_MANAGER.queueDownload(SFX.JUMP);
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



ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	//play music
	/**
	 * force play is a temporary method until a title screen is made
	 * It pings the webpage to play every few seconds until it can and
	 * sets the song to play on auto repeat
	*/
	ASSET_MANAGER.forcePlayMusic("./sound/music/FE3H-Chasing-Daybreak.mp3");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
