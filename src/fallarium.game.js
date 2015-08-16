var FallariumGameStage = function (game, context) {
	this.currentlevel;
	this.boardLayer;

	var Phaser = context.Phaser;
	var bgfilter;
	var oldsquares = new Array();
	var squaresinrow = new Array();
	var change_rot_time = 0;
	var scaleMorph = null;
	var rotMorph = null;
	var next_morph = 0;
	var force_down = 0;
	var slide_time = 0;
	var KEYLEFT;
	var KEYRIGHT;
	var KEYUP;
	var KEYDOWN;

	return {
		create: function() {
			this.background = game.add.image(0, 0);
			this.background.width = context.width;
			this.background.height = context.height;

			bgfilter = game.add.filter('Psychedelix', context.width, context.height, 0.5);
			bgfilter2 = game.add.filter('Hypnosis', context.width, context.height, 0.5);
			bgfilter.alpha = 0.5;
			bgfilter2.alpha = 0.5;

			this.boardLayer = game.add.group();
			this.detailsLayer = game.add.group();

			this.game.world.filters = [bgfilter];
			this.boardLayer.x = Math.floor(this.game.world.width / 8);
			this.boardLayer.y = 0;
			this.boardLayer.boardWidth = 280;
			this.boardLayer.boardHeight = 590;
			this.boardLayer.centerX = Math.floor(this.boardLayer.x + (this.boardLayer.boardWidth / 2));
			this.boardLayer.centerY = Math.floor(this.boardLayer.y + (this.boardLayer.boardHeight / 2));
			this.boardLayer.pivot.x = 10;
			this.boardLayer.pivot.y = 10;

			//this.boardLayer.filters = [bgfilter2];

			this.bck = this.boardLayer.add(new Phaser.Sprite(this.game, this.boardLayer.x, this.boardLayer.y, 'bck'));
			this.bck.alpha = 0.6;
			this.bck.collideWorldBounds = true;

			this.game.world.bounds.x = this.boardLayer.x + 21;
			this.game.world.bounds.y = this.boardLayer.y + 0;
			this.game.world.bounds.width = this.boardLayer.x + this.boardLayer.boardWidth;
			this.game.world.bounds.height = this.boardLayer.y + this.boardLayer.boardHeight;

			this.logo = this.detailsLayer.add(new Phaser.Sprite(this.game, 295, 30, 'logo'));

			this.focusblock = new FallariumBlock(this.game, this.boardLayer, context, this.boardLayer.centerX, this.boardLayer.y-40, this.chooseBlock(), this.chooseColor(), 1);
			this.nextblocktype = this.chooseBlock();
			this.nextblockcolor = this.chooseColor();
			this.nextblock = new FallariumBlock(this.game, this.boardLayer, context, this.boardLayer.x + 330, this.boardLayer.y + 271, this.nextblocktype, this.nextblockcolor, 0.7);

			KEYRIGHT = this.game.input.keyboard.addKey(context.Phaser.Keyboard.RIGHT);
			KEYLEFT = this.game.input.keyboard.addKey(context.Phaser.Keyboard.LEFT);
			KEYUP = this.game.input.keyboard.addKey(context.Phaser.Keyboard.UP);
			KEYDOWN = this.game.input.keyboard.addKey(context.Phaser.Keyboard.DOWN);

			this.scoretext = this.detailsLayer.add(new Phaser.Text(this.game, 344, 355, "SCORE", { font: "15px Arial", fill: "#ff0044", align: "center" }));
			this.scoretext.anchor.setTo(0.5, 0.5);
			this.scoretextmain = this.detailsLayer.add(new Phaser.Text(this.game, 344, 370, context.score.toString(), { font: "15px Arial", fill: "#fff", align: "center" }));
			this.resetbutton = this.detailsLayer.add(new Phaser.Sprite(this.game, 320, 520, 'reset'));
			this.pausebutton = this.detailsLayer.add(new Phaser.Sprite(this.game, 320, 460, 'pause'));
			this.pausebutton.inputEnabled = true;
			this.resetbutton.inputEnabled = true;
			this.pausebutton.events.onInputDown.add(this.onPauseButtonDown, this.pausebutton);
			this.resetbutton.events.onInputDown.add(this.onResetButtonDown, this.resetbutton);
			oldsquares.length = 0;
			squaresinrow.length = 0;
			context.score = 0;
		},
		onPauseButtonDown: function() {
			if (!this.game.paused) {
				this.game.paused = true;
			} else {
				this.game.paused = false;
			}
		},
		onResetButtonDown: function() {
			this.game.state.start('MainMenu');
		},
		chooseBlock: function() {
			var x = Math.floor(Math.random() * 7);

			switch (x) {
				case 0: return 'o';
				case 1: return 't';
				case 2: return 'l';
				case 3: return 'j';
				case 4: return 'i';
				case 5: return 's';
				case 6: return 'z';
			}
		},
		chooseColor: function() {
			return Math.floor(Math.random() * 5);
		},
		checkCompletedLines: function() {
			for(var i = 0; i < 20; i++) {
				squaresinrow[i] = 0;
			}
			var top = this.game.world.bounds.height - 19 * context.blockHeight - context.blockHeight / 2;
			var num_rows, rows;

			for (var i = 0; i < oldsquares.length; i++) {
				row = (oldsquares[i].y - top) / context.blockHeight;
				squaresinrow[row]++;
			}

			for (var i = 0; i < 20; i++) {
				if (squaresinrow[i] == 9){
					context.score += 100;

					for (var j = 0; j < oldsquares.length; j++) {
						if ((oldsquares[j].y - top) / context.blockHeight == i) {
							oldsquares[j].destroy();
							oldsquares.splice(j,1);
							j--;
						}
					}
				}
			}

			for (var i = 0; i < oldsquares.length; i++) {
				for (var j = 0; j < 20; j++) {
					if (squaresinrow[j] == 9) {
						row = (oldsquares[i].y - top) / context.blockHeight;
						if (row < j) {
							oldsquares[i].y += context.blockHeight;
						}
					}
				}
			}
		},
		update: function() {
			bgfilter.update();
			bgfilter2.update();

			if (this.game.time.now > force_down) {
				if (!this.focusblock.wallCollide(oldsquares,'down')) {
					this.focusblock.move('down');
				} else {
					for (var i = 0; i < 4; i++) {
						oldsquares.push(this.focusblock.squares[i]);
					}
					this.focusblock = new FallariumBlock(this.game, this.boardLayer, context, this.boardLayer.centerX, this.boardLayer.y-40, this.nextblocktype, this.nextblockcolor, 1);
					this.nextblocktype = this.chooseBlock();
					this.nextblockcolor = this.chooseColor();

					for (var i = 0; i < 4; i++) {
						this.nextblock.squares[i].destroy();
					}
					this.nextblock = new FallariumBlock(this.game, this.boardLayer, context, this.boardLayer.x + 330, this.boardLayer.y + 271, this.nextblocktype, this.nextblockcolor, 0.7);
					if (this.focusblock.wallCollide(oldsquares,'down')) {
						this.game.state.start('Lose');
					}
				}

				this.checkCompletedLines();
				this.scoretextmain.setText(context.score);

				if (context.score > 1900) {
					this.game.state.start('Win');
				}

				force_down = this.game.time.now + context.forceDownMaxTime;
			}

			if (KEYRIGHT.isDown) {
				if (this.game.time.now > change_rot_time) {
					if (!this.focusblock.wallCollide(oldsquares,'right')) {
						this.focusblock.move('right');
					}
					change_rot_time = this.game.time.now + 100;
				}
			}

			if (KEYLEFT.isDown) {
				if (this.game.time.now > change_rot_time) {
					if (!this.focusblock.wallCollide(oldsquares,'left')) {
						this.focusblock.move('left');
					}
					change_rot_time = this.game.time.now + 100;
				}
			}

			if(KEYUP.isDown){
				if (this.game.time.now > change_rot_time) {
					if (!this.focusblock.rotateCollide(oldsquares)) {
						this.focusblock.rotate();
					}
					change_rot_time = this.game.time.now + 100;
				}
			}

			if (KEYDOWN.isDown){
				context.forceDownMaxTime = 50;
			} else {
				context.forceDownMaxTime = 500;
			}


			if (this.game.time.now > next_morph) { // Time for the next morph set?

				var sign = parseInt(Math.random() * 10) % 2 ? -1 : 1;
				var scaleFactor = (sign * Math.random()) * (1.2 - 0.9) + 0.9;

				if (scaleMorph === null || (scaleMorph && !scaleMorph.isRunning)) { // Did the last scale tween finish yet?
					//scaleMorph = this.game.add.tween(this.boardLayer.scale).to({x: scaleFactor, y: scaleFactor}, Math.random() * 5000, Phaser.Easing.Back.InOut, true, Math.random() * 100);
				}

				if (rotMorph === null || (rotMorph && !rotMorph.isRunning)) { // Did the last rotate tween finish yet?
					rotMorph = this.game.add.tween(this.boardLayer).to({rotation: this.boardLayer.angle * (sign * Math.random() * 360 * (0.10 - 0.02) + 0.02)}, Math.random() * 13000, Phaser.Easing.Linear.None, true, Math.random() * 100);
				}

				next_morph = this.game.time.now + 1000;
			}
		},
		render: function () {

		}
	};
};
