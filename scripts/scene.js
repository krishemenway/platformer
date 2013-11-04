/* globals define */
define(["player", "enemy", "grid", "weapons"], function(Player, Enemy, Grid, Weapons) {
	"use strict";

	return function scene(sceneData) {
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
			projectiles = {
				player: [],
				enemy: []
			},
			renderOrder = [];

		function updateProjectileList(timeSinceLastFrame, setOfProjectiles) {
			setOfProjectiles.forEach(function(projectile) {
				projectile.update(timeSinceLastFrame);
			});
		}

		function updateProjectiles(timeSinceLastFrame) {
			updateProjectileList(timeSinceLastFrame, projectiles.player);
			updateProjectileList(timeSinceLastFrame, projectiles.enemy);
		}

		function updateEnemies(timeSinceLastFrame) {
			for(var e = 0; e < enemies.length; e++) {
				enemies[e].update(timeSinceLastFrame);
			}
		}

		function updatePlayer(controller, timeSinceLastFrame) {
			player.update(controller, timeSinceLastFrame);
		}

		function update(controller, timeSinceLastFrame) {
			canvasTopLeftX = Math.min(Math.max(player.center() - gameWidth / 2, 0), lastTopLeftX);
			canvasTopLeftY = 0;

			updateProjectiles(timeSinceLastFrame);
			updatePlayer(controller, timeSinceLastFrame);
			updateEnemies(timeSinceLastFrame);
		}

		function renderProjectileList(canvas, setOfProjectiles) {
			for(var p = 0; p < setOfProjectiles.length; p++) {
				setOfProjectiles[p].render(canvas, canvasTopLeftX, canvasTopLeftY);
			}
		}

		function renderProjectiles(canvas) {
			renderProjectileList(canvas, projectiles.player);
			renderProjectileList(canvas, projectiles.enemy);
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
				if(enemies[e] === null)
					continue;

				enemies[e].render(canvas, canvasTopLeftX, canvasTopLeftY);
			}
		}

		function renderDebug(canvas) {
			canvas.font="12px Arial";
			canvas.fillStyle = "rgb(255,255,255)";

			var debugStatements = [
				"Player X:" + parseInt(player.left(),10),
				"Player Y:" + parseInt(player.top(),10),
				"Canvas TopLeft X: " + parseInt(canvasTopLeftX,10) + ", Y: " + parseInt(canvasTopLeftY,10),
				"Player Projectiles: " + projectiles.player.length,
				"Enemy Projectiles: " + projectiles.enemy.length
			];

			for(var d = 0; d < debugStatements.length; d++) {
				canvas.fillText(debugStatements[d], 10, d * 12 + 12);
			}
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
				initializeGrid();
			};

			background.src = backgroundSource;
		}

		function initializePlayer(playerData) {
			player = new Player();
			player.init(playerData, projectiles);
		}

		function initializeEnemies(enemyData) {
			if(!enemyData)
				return;

			for(var e = 0; e < enemyData.length; e++) {
				var enemy = new Enemy();
				enemy.init(enemyData[e], player, projectiles);
				enemies.push(enemy);
			}
		}

		function initializeGrid() {
			Grid.init(sceneData.grid, sceneWidth, gameWidth, gameHeight, sceneData.gridSize);
		}

		function initializeWeapons() {
			Weapons.init(projectiles);
		}

		function init() {
			initializeBackground(sceneData.background);
			initializeWeapons();
			initializePlayer(sceneData.playerData);
			initializeEnemies(sceneData.enemies);

			renderOrder = [renderBackground, renderProjectiles, renderPlayer, renderEnemies];

			if(window.debug) {
				renderOrder.push(renderDebug);
			}

			if(window.showGrid) {
				renderOrder.push(function(canvas) {
					Grid.render(canvas, canvasTopLeftX, canvasTopLeftY);
				});
			}
		}

		return {
			update: update,
			render: render,
			init: init
		};

	};
});