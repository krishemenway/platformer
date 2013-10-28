/* globals define */
define(["player", "platform", "enemy"], function(Player, Platform, Enemy) {
	"use strict";

	return function scene() {
		var background,
			backgroundLoaded,
			sceneWidth = 0,
			sceneHeight = 0,
			gameWidth = 0,
			gameHeight = 0,
			lastTopLeftX,
			canvasTopLeftX = 0,
			canvasTopLeftY = 0,
			player,
			enemies = [],
			platforms = [],
			projectiles = [],
			lastFiredTime,
			renderOrder = [];

		function platformsCollidesWithShape(objectTop, objectRight, objectBottom, objectLeft) {
			var p;

			for(p = 0; p <= platforms.length - 1; p++) {
				if(platforms[p].collidesWithVertically(objectTop, objectRight, objectBottom, objectLeft)) {
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

		function updateEnemies(timeSinceLastFrame) {
			for(var e = 0; e < enemies.length; e++) {
				var enemy = enemies[e];

				if(!platformsCollidesWithShape(enemy.enemyTop(), enemy.enemyRight(), enemy.enemyBottom(), enemy.enemyLeft())) {
					enemy.fall(timeSinceLastFrame);
				}
				enemy.update(timeSinceLastFrame);
			}
		}

		function update(controller, timeSinceLastFrame) {
			canvasTopLeftX = Math.min(Math.max(player.playerCenter() - gameWidth / 2, 0), lastTopLeftX);
			canvasTopLeftY = 0;

			if(platformsCollidesWithShape(player.playerTop(), player.playerRight(), player.playerBottom(), player.playerLeft())) {
				player.setCanJump(true);
			} else if(!player.playerIsJumping()) {
				player.fall(timeSinceLastFrame);
				player.setCanJump(false);
			}

			player.update(controller, timeSinceLastFrame);

			if(controller.leftKeyIsPressed() && player.playerLeft() >= 5) {
				player.goLeft(timeSinceLastFrame);
			} else if(controller.rightKeyIsPressed() && player.playerRight() <= sceneWidth - 5) {
				player.goRight(timeSinceLastFrame);
			}

			if(controller.fireKeyIsPressed()) {
				fireWeapon();
			}

			updateEnemies(timeSinceLastFrame);
			updateProjectiles(timeSinceLastFrame);
		}

		function renderProjectiles(canvas) {

			for(var p = 0; p < projectiles.length; p++) {
				var projectile = projectiles[p];

				if(projectile.projectileX > canvasTopLeftX && projectile.projectileX <= canvasTopLeftX + gameWidth) {
					canvas.fillStyle = "rgb(35,35,35)";
					canvas.fillRect(projectile.projectileX - canvasTopLeftX, projectile.projectileY - canvasTopLeftY, 10,5);
				} else {
					projectiles.slice(p, 1);
				}
			}
		}

		function renderBackground(canvas) {
			if(backgroundLoaded) {
				canvas.drawImage(background, canvasTopLeftX, canvasTopLeftY, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
			}
		}

		function renderPlayer(canvas) {
			player.render(canvas, canvasTopLeftX, canvasTopLeftY);
		}

		function renderEnemies(canvas) {
			for(var e = 0; e < enemies.length; e++) {
				enemies[e].render(canvas, canvasTopLeftX, canvasTopLeftY);
			}
		}

		function renderDebug(canvas) {
			canvas.font="12px Arial";
			canvas.fillStyle = "rgb(0,0,0)";
			canvas.fillText("PlayerX: " + player.playerLeft(), 10, 25);
			canvas.fillText("PlayerY: " + player.playerTop(), 10, 50);
			canvas.fillText("CanvasTopLeftX: " + canvasTopLeftX, 10, 75);
			canvas.fillText("CanvasTopLeftY: " + canvasTopLeftY, 10, 100);
			canvas.fillText("ProjectileCount: " + projectiles.length, 10, 125);
		}

		function render(canvas) {
			if(!gameHeight || !gameWidth) {
				gameHeight = canvas.canvas.height;
				gameWidth = canvas.canvas.width;
			}

			renderOrder.forEach(function(render) {
				render(canvas);
			});
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

		function initializeEnemies(enemyData) {
			if(!enemyData)
				return;

			for(var e = 0; e < enemyData.length; e++) {
				var enemy = new Enemy();
				enemy.init(enemyData[e]);
				enemies.push(enemy);
			}
		}

		function initializePlatforms(platformData) {
			platformData.forEach(function(platform) {
				platforms.push(new Platform(platform));
			});
		}

		function init(sceneData) {
			initializeBackground(sceneData.background);
			initializePlayer(sceneData.playerData);
			initializeEnemies(sceneData.enemies);
			initializePlatforms(sceneData.platformData);

			renderOrder = [renderBackground, renderProjectiles, renderPlayer, renderEnemies];

			if(window.debug) {
				renderOrder.push(renderDebug);
			}
		}

		return {
			update: update,
			render: render,
			init: init
		};

	};
});