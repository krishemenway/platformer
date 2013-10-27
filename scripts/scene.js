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
			lastTopLeftX,
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

		function updateProjectiles(timeSinceLastFrame) {
			projectiles.forEach(function(projectile) {
				projectile.projectileX += projectile.velocity * timeSinceLastFrame;
			});
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

			updateProjectiles(timeSinceLastFrame);
		}

		function renderProjectiles(canvas, canvasTopLeftX, canvasTopLeftY) {

			for(var p = 0; p < projectiles.length; p++) {
				var projectile = projectiles[p];

				if(projectile.projectileX > canvasTopLeftX && projectile.projectileX <= canvasTopLeftX + gameWidth) {
					canvas.fillStyle = "rgb(35,35,35)";
					canvas.fillRect(projectile.projectileX - canvasTopLeftX, projectile.projectileY - canvasTopLeftY, 5, 2);
				} else {
					projectiles.slice(p, 1);
				}
			}
		}

		function render(canvas) {
			var canvasTopLeftX = player.playerCenter() - gameWidth / 2;
			canvasTopLeftX = canvasTopLeftX > 0 ? canvasTopLeftX : 0;

			if(canvasTopLeftX > lastTopLeftX) {
				canvasTopLeftX = lastTopLeftX;
			}

			var canvasTopLeftY = Math.max(Math.min(player.playerBottom() - gameHeight, 0), sceneHeight - gameHeight);

			if(!gameHeight || !gameWidth) {
				gameHeight = canvas.canvas.height;
				gameWidth = canvas.canvas.width;
			}

			if(backgroundLoaded) {
				canvas.drawImage(background, canvasTopLeftX, canvasTopLeftY, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
			}

			renderProjectiles(canvas, canvasTopLeftX, canvasTopLeftY);
			player.render(canvas, canvasTopLeftX, canvasTopLeftY);

			if(window.debug) {
				renderDebug(canvas, canvasTopLeftX, canvasTopLeftY);
			}
		}

		function renderDebug(canvas, canvasTopLeftX, canvasTopLeftY) {
			canvas.font="12px Arial";
			canvas.fillStyle = "rgb(0,0,0)";
			canvas.fillText("PlayerX: " + player.playerLeft(), 0, 25);
			canvas.fillText("PlayerY: " + player.playerTop(), 0, 50);
			canvas.fillText("CanvasTopLeftX: " + canvasTopLeftX, 0, 75);
			canvas.fillText("CanvasTopLeftY: " + canvasTopLeftY, 0, 100);
			canvas.fillText("ProjectileCount: " + projectiles.length, 0, 125);
		}

		function initializeBackground(backgroundSource) {
			background = new Image();
			backgroundLoaded = false;

			background.onload = function() {
				backgroundLoaded = true;
				sceneHeight = background.height;
				sceneWidth = background.width;
				lastTopLeftX = sceneWidth - gameWidth;
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