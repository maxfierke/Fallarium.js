var fallarium = (function () {

	var game;

	var state = {
		preload: function () {

		},
		create: function () {

		},
		update: function () {

		}
	};

	return {
		init: function (Phaser, width, height) {
			game = new Phaser.Game(width, height, Phaser.AUTO, 'fallarium', state);
		}
	}
})();
