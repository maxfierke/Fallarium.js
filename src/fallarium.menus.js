var FallariumMainMenuStage = function(game, context) {
	this.game = game;
	var context = context;

	return {
		create: function() {
			this.game.world.bounds.x = 0;
			this.game.world.bounds.y = 0;
			this.game.world.bounds.width = context.width;
			this.game.world.bounds.height = context.height;
			this.playbutton = this.add.button(this.game.world.centerX, this.game.world.centerY-40,'play',this.playClicked,this,1,0,2);
			this.playbutton.anchor.setTo(0.5,0.5);
			this.tweenplay = this.game.add.tween(this.playbutton).to({y:300},1000, context.Phaser.Easing.Sinusoidal.InOut,true,0,100,true);
			this.arrows = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY+180,'arrow');
			this.arrows.anchor.setTo(0.5,0.5);
			this.arrows.scale.setTo(0.6,0.6);
			this.titleimage = this.add.sprite(this.game.world.centerX,0,'title');
			this.titleimage.anchor.setTo(0.5,0);
		},

		playClicked: function() {
			context.score = 0;
			this.game.state.start('Game');
		},
	};
};

var FallariumLoseStage = function (game, context) {
	var context = context;

	return {
		create: function() {
			this.game.world.bounds.x = 0;
			this.game.world.bounds.y = 0;
			this.game.world.bounds.width = context.width;
			this.game.world.bounds.height = context.height;
			this.lose = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'lose');
			this.lose.anchor.setTo(0.5,0.5);
			this.playbutton = this.add.button(this.game.world.centerX, 40, 'play',this.playClicked,this,1,0,2);
			this.playbutton.anchor.setTo(0.5,0.5);
			this.tweenplay = this.game.add.tween(this.playbutton).to({y:50},1000,context.Phaser.Easing.Sinusoidal.InOut,true,0,100,true);
			this.scoretextmain = this.add.text(this.game.world.centerX,450, context.score,{ font: "40px Arial", fill: "#fff", align: "center" })
			this.scoretextmain.anchor.setTo(0.5,0.5);
		},
		playClicked: function() {
			context.score = 0;
			this.game.state.start('Game');
		},
	}
}

var FallariumWinStage = function(game, context) {
	var context = context;

	return {
		create: function(){
			this.game.world.bounds.x = 0;
			this.game.world.bounds.y = 0;
			this.game.world.bounds.width = context.width;
			this.game.world.bounds.height = context.height;
			this.winimage = this.game.add.sprite(0,0,'win');
			this.playbutton = this.add.button(this.game.world.centerX, 500, 'play',this.playclicked,this,1,0,2);
			this.playbutton.anchor.setTo(0.5,0.5);
			this.tweenplay = this.game.add.tween(this.playbutton).to({y:550},1000,context.Phaser.Easing.Sinusoidal.InOut,true,0,100,true);
		},
		playClicked: function() {
			context.score = 0;
			this.game.state.start('Game');
		},
	};
};

