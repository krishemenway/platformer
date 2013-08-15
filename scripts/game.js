
define(["platform", "player"], function(platform, player) {
	return function game(canvas) {

		var game = this,
			backgrounds = {},
			current_current_player,
			platforms = {},
			backgroundLoaded = false,
			currentCanvas,
			currentCanvasContext,
			currentBackground,
			then = new Date(),
			gameHeight,
			gameWidth,
			gameX = 0,
			gameY = 0,
			gravity = 400,
			keysDown = {},
			mainInterval = undefined,
			clippingRadial = 8;

		var addBackground = function(name, background_path) {
			var background = new Image();
			background.onload = function () {
				backgroundLoaded = true;
			};
			background.src = background_path;
			backgrounds[name] = background;
		};

		var setBackground = function(name) {
			currentBackground = backgrounds[name];
		};

		addEventListener("keydown", function (e) {
			keysDown[e.keyCode] = true;
		}, false);

		addEventListener("keyup", function (e) {
			delete keysDown[e.keyCode];
		}, false);

		var update = function (modifier) {
			var difference = current_player.speed * modifier;
			
			if (current_player.x + current_player.width() + difference > gameX + (gameWidth * 3 / 5)) {
				gameX += difference;
			}
			
			if (current_player.x - difference <= gameX + (gameWidth * 2 / 5)) {
				if(gameX - difference >= 0) {
					gameX -= difference;
				} else {
					gameX = 0;
				}
			}
			
			// current_player holding up
			if (38 in keysDown) {
				current_player.handleJump(modifier);
			}
			
			// current_player holding down
			if (40 in keysDown) {
				current_player.handleDuck(modifier);
			}
			
			// current_player holding left
			if (37 in keysDown) {
				current_player.goLeft(modifier);
			}
			
			// current_player holding right
			if (39 in keysDown) {
				current_player.goRight(modifier);
			}
			
			if (!player_is_on_platform(platforms)){
				current_player.fall(gravity * modifier);
			}
		};

		var player_is_on_platform = function() {
			var playerY = Math.round(current_player.y());
			var playerHeight = current_player.height();

			for(platformKey in platforms) {
				var platform = platforms[platformKey];
				
				if(platform.y > playerY - clippingRadial + playerHeight 
				   && platform.y < playerY + clippingRadial + playerHeight) {
					return platform.y;
				}
			}

			if(playerY > gameHeight + playerHeight)
				return gameHeight - playerHeight;

			return 0;
		}

		var render = function (modifier) {
			if (backgroundLoaded) {
				currentCanvasContext.drawImage(currentBackground, 0, 0, currentBackground.width, currentBackground.height, 0, 0, currentBackground.width, currentBackground.height);
			}
			
			for(platformkey in platforms) {
				var platform = platforms[platformkey];
				currentCanvasContext.drawImage(platform.image, platform.x, platform.y);
			}

			if (current_player.has_image_loaded()) {
				currentCanvasContext.drawImage(current_player.get_image(), current_player.x(), current_player.y());
			}
		};

		var main = function() {
			var now = new Date();

			update((now - then) / 1000);
			render();
			
			then = now;
		};

		game.initialize = function() {
			current_player = new player(player_is_on_platform);
			current_player.initialize();

			currentCanvasContext = canvas.getContext("2d");
			
			addBackground("level_1", "images/level_1.jpg");
			platforms["first"] = new platform(0, 360, 400, 500);
			
			gameWidth = parseInt(canvas.width, 10);
			gameHeight = parseInt(canvas.height, 10);
			
			setBackground("level_1");

			mainInterval = setInterval(main, 1);
		}

		return game;
	};
});
