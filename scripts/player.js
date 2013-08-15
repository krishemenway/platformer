
define([], function() {
	return function player(player_is_on_platform) {
		var speed = 256, // movement in pixels per second
			left_image,
			right_image,
			me = this,
			jump_speed = 700,
			jump_time = 2000, // in milliseconds
			is_jumping = false,
			image_loaded = false,
			image,
			x = 0,
			y = 0;
		
		var height = function() {
			if(image_loaded) {
				return parseInt(image.height);
			}
			
			return 0;
		};
		
		var width = function() {
			if(image_loaded) {
				return parseInt(image.width);
			}
			
			return 0;
		};

		var build_image_path = function(facing) {
			return "images/robot-" + facing + ".png";
		};

		var has_image_loaded = function() {
			return image_loaded;
		};

		var get_x = function() {
			return x;
		};

		var get_y = function() {
			return y;
		};
		
		var jump = function() {
			is_jumping = true;
			setTimeout(function() {
				is_jumping = false;
			}, 350);
		};

		var can_jump = function() {
			return player_is_on_platform();
		};

		var handleJump = function(modifier) {
			console.log(can_jump());
			if(can_jump()) {
				jump();
			}
		
			if(is_jumping) {
				y -= jump_speed * modifier;
			}
		};

		var handleDuck = function(modifier) {
			//y += modifier;
		};

		var goLeft = function(modifier) {
			image = left_image;
			if(x - modifier * speed > 0) {
				x -= modifier * speed;
			}
		};

		var goRight = function(modifier) {
			image = right_image;
			x += modifier * speed;
		};

		var fall = function(amountToFall) {
			var on_platform = player_is_on_platform();

			if(!on_platform) {
				y += amountToFall;
			} else {
				y = on_platform;
			}

		};

		var get_image = function() {
			return image;
		};

		var initialize = function() {
			left_image = new Image();
			left_image.src = build_image_path("left");

			right_image = new Image();
			right_image.src = build_image_path("right");

			image = right_image;
			image.onload = function () {
				image_loaded = true;
			};
		};

		me.x = get_x;
		me.y = get_y;
		me.width = width;
		me.height = height;
		me.image = image;
		me.speed = speed;
		me.fall = fall;
		me.goLeft = goLeft;
		me.goRight = goRight;
		me.get_image = get_image;
		me.has_image_loaded = has_image_loaded;
		me.handleDuck = handleDuck;
		me.handleJump = handleJump;
		me.initialize = initialize;
	};
});