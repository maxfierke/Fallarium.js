var fallarium = (function () {

	var game;

	var context = {
		Phaser: undefined,
		score: 0,
		width: 800,
		height: 600,
		blockWidth: 30,
		blockHeight: 30,
		forceDownMaxTime: 500
	};

	var state = {
		preload: function () {
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		game.scale.refresh();

			this.preloadtext = this.add.text(game.world.centerX,game.world.centerY,"Loading..."+this.load.progress+"%",{ font: "20px Arial", fill: "#ff0044", align: "center" });
			this.preloadtext.anchor.setTo(0.5,0.5);

			this.load.image('logo','assets/logo.png');
			this.load.spritesheet('play','assets/play.png',100,80);
			this.load.image('pause','assets/Pause.png');
			this.load.image('reset','assets/refresh.png');
			this.load.image('lose','assets/lose.png');
			this.load.image('arrow','assets/arrow.png');
			this.load.image('title','assets/Title.png');
			this.load.image('win','assets/win.png');
			this.load.spritesheet('blocks','assets/blocks.png',30,30);
			this.load.image('bck','assets/Bck.png');

			this.load.script('psychedelix', 'src/filters/Psychedelix.js');
			this.load.script('hypnosis', 'src/filters/Hypnosis.js');
			this.load.script('gameStage', 'src/fallarium.game.js');
			this.load.script('menus', 'src/fallarium.menus.js');
			this.load.script('blockObj', 'src/fallarium.block.js');
		},
		create: function () {
			game.state.start('MainMenu');
		},
		update: function () {

		}
	};

	return {
		init: function (Phaser) {
			context.Phaser = Phaser;

			game = new Phaser.Game(context.width, context.height, Phaser.WEBGL, 'fallarium', state);

			mainMenuStage = new FallariumMainMenuStage(game, context);
			gameStage = new FallariumGameStage(game, context);
			loseStage = new FallariumLoseStage(game, context);
			winStage = new FallariumWinStage(game, context);

			game.state.add('MainMenu', mainMenuStage);
			game.state.add('Game', gameStage);
			game.state.add('Lose', loseStage);
			game.state.add('Win', winStage);
		}
	};
})();
