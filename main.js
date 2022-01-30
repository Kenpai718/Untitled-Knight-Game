const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//queue downloads
//main character
ASSET_MANAGER.queueDownload("./sprites/knight/knightLeft.png");
ASSET_MANAGER.queueDownload("./sprites/knight/knightRight.png");
ASSET_MANAGER.queueDownload("./sprites/projectile/arrow.png");

//enemies
ASSET_MANAGER.queueDownload("./sprites/enemy/wizard.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/skeleton.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/goblin.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/mushroom.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/flyingeye.png");

//environment
ASSET_MANAGER.queueDownload("./sprites/environment/dark_castle_tileset.png");
ASSET_MANAGER.queueDownload("./sprites/environment/moonlit_sky.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
