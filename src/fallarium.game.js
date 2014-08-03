var FallariumGameStage = function (game, context) {
	this.currentlevel;

	var context = context;
	var oldsquares = new Array();
	var squaresinrow = new Array();
	var change_rot_time = 0;
	var force_down = 0;
	var slide_time = 0;
	var KEYLEFT;
	var KEYRIGHT;
	var KEYUP;
	var KEYDOWN;

	return {
		create: function() {
			this.bck = this.game.add.sprite(0,0,'bck');
			this.game.world.x = 0;
			this.game.world.y = 0;
			this.game.world.bounds.x = 21;
			this.game.world.bounds.y = 0;
			this.game.world.bounds.width = 280;
			this.game.world.bounds.height = 590;
			this.logo = this.game.add.sprite(295,30,'logo');
			this.focusblock = new FallariumBlock(this.game, context, this.game.world.centerX,-40,this.chooseBlock(),this.chooseColor(),1);
			this.nextblocktype = this.chooseBlock();
			this.nextblockcolor = this.chooseColor();
			this.nextblock = new FallariumBlock(this.game, context, 330, 271,this.nextblocktype,this.nextblockcolor,0.7);

			KEYRIGHT = this.game.input.keyboard.addKey(context.Phaser.Keyboard.RIGHT);
			KEYLEFT = this.game.input.keyboard.addKey(context.Phaser.Keyboard.LEFT);
			KEYUP = this.game.input.keyboard.addKey(context.Phaser.Keyboard.UP);
			KEYDOWN = this.game.input.keyboard.addKey(context.Phaser.Keyboard.DOWN);

			this.scoretext = this.add.text(344,355,"SCORE",{ font: "15px Arial", fill: "#ff0044", align: "center" });
			this.scoretext.anchor.setTo(0.5,0.5);
			this.scoretextmain = this.add.text(344,370," "+context.score+" ",{ font: "15px Arial", fill: "#fff", align: "center" })
			this.resetbutton = this.add.sprite(320,520,'reset');
			this.pausebutton = this.add.sprite(320,460,'pause');
			this.pausebutton.inputEnabled = true;
			this.resetbutton.inputEnabled = true;
			this.pausebutton.events.onInputDown.add(this.onPauseButtonDown,this.pausebutton);
			this.resetbutton.events.onInputDown.add(this.onResetButtonDown,this.resetbutton);
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
			if (this.game.time.now > force_down) {
				if (!this.focusblock.wallCollide(oldsquares,'down')) {
					this.focusblock.move('down');
				} else {
					for (var i = 0; i < 4; i++) {
						oldsquares.push(this.focusblock.squares[i]);
					}
					this.focusblock = new FallariumBlock(this.game, context, this.game.world.centerX,-40,this.nextblocktype,this.nextblockcolor,1);
					this.nextblocktype = this.chooseBlock();
					this.nextblockcolor = this.chooseColor();

					for (var i = 0; i < 4; i++) {
						this.nextblock.squares[i].destroy();
					}
					this.nextblock = new FallariumBlock(this.game, context, 330, 271,this.nextblocktype,this.nextblockcolor,0.7);
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
		}
	};
};
