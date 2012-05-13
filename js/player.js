
var player = {
	speed: 256, // movement in pixels per second
	jump_force: 700,
	
	facing: "right",
	
	x: 0,
	y: 0,
	
	height: function() {
		if(player.image_loaded) {
			return parseInt(player.image.height);
		}
		
		return 0;
	},
	
	width: function() {
		if(player.image_loaded) {
			return parseInt(player.image.width);
		}
		
		return 0;
	},
	
	_offscreen_max: 0,
	
	get_offscreen_max: function(gameHeight) {
		if(player._offscreen_max == 0) {
			player._offscreen_max = gameHeight - player.height(); //+ player.height()
		}
		
		return player._offscreen_max;
	},
	
	image_loaded: false,
	image: new Image(),
	image_path: "images/robot-right.png",
	
	initialize: function() {
		player.image.src = player.image_path;
		
		player.image.onload = function () {
			player.image_loaded = true;
		};
	}
};