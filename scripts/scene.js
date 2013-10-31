/* globals define */
define(["player", "platform", "enemy"], function(Player, Platform, Enemy) {
	"use strict";

	return function scene(sceneData) {
		var background,
			backgroundLoaded,
			gridSize = 50,
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
			projectiles = {
				player: [],
				enemy: []
			},
			renderOrder = [],
			grid = [];

		function platformsCollidesWithShape(objectTop, objectRight, objectBottom, objectLeft) {
			var p;

			for(p = 0; p <= platforms.length - 1; p++) {
				if(platforms[p].collidesWithVertically(objectTop, objectRight, objectBottom, objectLeft)) {
					return true;
				}
			}

			return false;
		}

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
				var enemy = enemies[e];

				if(enemy === null)
					continue;

				if(!platformsCollidesWithShape(enemy.enemyTop(), enemy.enemyRight(), enemy.enemyBottom(), enemy.enemyLeft())) {
					enemy.fall(timeSinceLastFrame);
				}

				enemy.update(timeSinceLastFrame);
			}
		}

		function updatePlayer(controller, timeSinceLastFrame) {
			player.update(controller, timeSinceLastFrame);
		}

		function update(controller, timeSinceLastFrame) {
			canvasTopLeftX = Math.min(Math.max(player.playerCenter() - gameWidth / 2, 0), lastTopLeftX);
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

		function renderGridHorizontalLines(canvas, firstGridPointY) {
			for(var gy = firstGridPointY; gy <= canvasTopLeftY + gameHeight; gy += gridSize) {
				canvas.fillRect(0, gy - canvasTopLeftY, gameWidth, 1);
			}
		}

		function renderGridVerticalLines(canvas, firstGridPointX) {
			for(var gx = firstGridPointX; gx <= canvasTopLeftX + gameWidth; gx += gridSize) {
				canvas.fillRect(gx - canvasTopLeftX, 0, 1, gameHeight);
			}
		}

		function renderCollisionGrid(canvas, firstGridPointX, firstGridPointY) {
			var gridCellIndexX = 0;
			var gridCellIndexY = 0;

			canvas.fillStyle = "rgba(255,0,0,.5)";
			for(var gx = firstGridPointX; gx <= firstGridPointX + gameWidth; gx += gridSize) {
				gridCellIndexX = Math.floor(gx / gridSize);
				gridCellIndexY = Math.floor(firstGridPointY / gridSize);

				for(var gy = firstGridPointY; gy <= firstGridPointY + gameHeight; gy += gridSize) {
					gridCellIndexY = Math.floor(gy / gridSize);

					if(grid[gridCellIndexY] && grid[gridCellIndexY][gridCellIndexX] && grid[gridCellIndexY][gridCellIndexX] === 1) {
						canvas.fillRect(gx - canvasTopLeftX, gy - canvasTopLeftY, gridSize, gridSize);
					}
				}
			}
		}

		function renderGrid(canvas) {
			var firstGridPointY = Math.floor(canvasTopLeftY / gridSize) * gridSize;
			var firstGridPointX = Math.floor(canvasTopLeftX / gridSize) * gridSize;

			renderGridHorizontalLines(canvas, firstGridPointY);
			renderGridVerticalLines(canvas, firstGridPointX);
			renderCollisionGrid(canvas, firstGridPointX, firstGridPointY);
		}

		function renderDebug(canvas) {
			canvas.font="12px Arial";
			canvas.fillStyle = "rgb(0,0,0)";

			var debugStatements = [
				"Player X:" + parseInt(player.playerLeft(),10),
				"Player Y:" + parseInt(player.playerTop(),10),
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
				initializeGrid(sceneData.grid);
			};

			background.src = backgroundSource;
		}

		function initializePlayer(playerData) {
			player = new Player();
			player.init(playerData, projectiles, platforms);
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

		function initializePlatforms(platformData) {
			if(!platformData)
				return;

			platformData.forEach(function(platform) {
				platforms.push(new Platform(platform));
			});
		}

		function initializeGrid(gridCells) {
			var gridCellPerRow = Math.floor(sceneWidth / gridSize);

			if(gridCells.length % gridCellPerRow !== 0)
				throw "Invalid Grid Given, Length of grid array was " + gridCells.length + " and expected array with multipler of " + gridCellPerRow;

			for (var g = 0; g < gridCells.length; g += gridCellPerRow)
			    grid.push( gridCells.slice(g, g + gridCellPerRow) );

			console.log(grid);
		}

		function init() {
			initializeBackground(sceneData.background);
			initializePlatforms(sceneData.platformData);
			initializePlayer(sceneData.playerData);
			initializeEnemies(sceneData.enemies);

			renderOrder = [renderBackground, renderProjectiles, renderPlayer, renderEnemies];

			if(window.debug) {
				renderOrder.push(renderDebug);
			}

			if(window.showGrid) {
				renderOrder.push(renderGrid);
			}
		}

		return {
			update: update,
			render: render,
			init: init
		};

	};
});