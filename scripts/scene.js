/* globals define */
define(["player", "platform"], function(Player, Platform) {
	"use strict";

	return function scene() {
		var background,
			backgroundLoaded,
			sceneWidth = 0,
			sceneHeight = 0,
			gameWidth = 0,
			gameHeight = 0,
			player,
			enemies = [],
			platforms = [],
			projectiles = [],
			lastFiredTime;

		function playerCollidesWithPlatformVertically() {
			var p;

			for(p = 0; p <= platforms.length - 1; p++) {
				if(platforms[p].collidesWithVertically(player.playerTop(), player.playerRight(), player.playerBottom(), player.playerLeft())) {
					return true;
				}
			}

			return false;
		}

		function fireWeapon() {
			if(lastFiredTime === undefined || new Date().getTime() > lastFiredTime + player.fireRate) {
				var projectile = player.createNewProjectile();
				projectiles.push(projectile);
				lastFiredTime = new Date().getTime();
			}
		}

		function update(controller, timeSinceLastFrame) {
			player.update(controller, timeSinceLastFrame);

			if(!playerCollidesWithPlatformVertically()) {
				player.fall(timeSinceLastFrame);
			}

			if(controller.leftKeyIsPressed() && player.playerLeft() >= 5) {
				player.goLeft(timeSinceLastFrame);
			} else if(controller.rightKeyIsPressed() && player.playerRight() <= sceneWidth - 5) {
				player.goRight(timeSinceLastFrame);
			}

			if(controller.fireKeyIsPressed()) {
				fireWeapon();
			}

			projectiles.forEach(function(projectile) {
				projectile.projectileX += projectile.velocity * timeSinceLastFrame;
			});
		}

		function render(canvas) {
			if(!gameHeight || !gameWidth) {
				gameHeight = canvas.canvas.height;
				gameWidth = canvas.canvas.width;
			}

			if(backgroundLoaded) {
				var canvasTopLeftX = player.playerCenter() - gameWidth / 2;
				var lastCenterPoint = sceneWidth - gameWidth / 2;
				canvasTopLeftX = canvasTopLeftX > 0 ? canvasTopLeftX : 0;

				if(canvasTopLeftX > lastCenterPoint) {
					canvasTopLeftX = lastCenterPoint;
				}

				var canvasTopLeftY = Math.max(Math.min(player.playerBottom() - gameHeight, 0), sceneHeight - gameHeight);
				canvas.drawImage(background, canvasTopLeftX, canvasTopLeftY, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
			}

			if(window.debug) {
				renderDebug(canvas);
			}

			player.render(canvas, sceneWidth, sceneHeight, gameWidth, gameHeight);

			projectiles.forEach(function(projectile) {
				canvas.fillStyle = "rgb(35,35,35)";
				canvas.fillRect(projectile.projectileX, projectile.projectileY, 5, 2);
			});
		}

		function renderDebug(canvas) {


			canvas.font="12px Arial";
			canvas.fillStyle = "rgb(0,0,0)";
			canvas.fillText("PlayerX: " + player.playerLeft(), 0, 50);
			canvas.fillText("PlayerY: " + player.playerTop(), 0, 75);
			canvas.fillText("GameHeight: " + gameHeight, 0, 100);
			canvas.fillText("GameWidth: " + gameWidth, 0, 125);
			canvas.fillText("SceneWidth: " + sceneWidth, 0, 150);
			canvas.fillText("SceneHeight: " + sceneHeight, 0, 175);
		}

		function initializeBackground(backgroundSource) {
			background = new Image();
			backgroundLoaded = false;

			background.onload = function() {
				backgroundLoaded = true;
				sceneHeight = background.height;
				sceneWidth = background.width;
			};

			background.src = backgroundSource;
		}

		function initializePlayer(playerData) {
			player = new Player();
			player.init(playerData);
		}

		function initializeEnemies() {
			enemies = [];
		}

		function initializePlatforms(platformData) {
			platformData.forEach(function(platform) {
				platforms.push(new Platform(platform));
			});
		}

		function init(sceneData) {
			initializeBackground(sceneData.background);
			initializePlayer(sceneData.playerData);
			initializeEnemies();
			initializePlatforms(sceneData.platformData);
		}

		return {
			update: update,
			render: render,
			init: init
		};

	};
});