
/* globals define */
define(function() {
	"use strict";

	return function enemy() {
		var x = 0,
			y = 0,
			paceApex,
			width = 0,
			height = 0,
			sprite,
			fallRate = 300,
			enemySpeed = 150,
			spriteLoaded,
			shouldPace,
			paceDistance,
			currentDirection,
			fireRate = 2500,
			bulletSpeed = 300,
			lastFiredTime = new Date().getTime(),
			destroyed,
			currentPlayer,
			sceneProjectiles;

		var direction = {
			left: 50,
			right: 0
		};

		function top() {
			return y;
		}

		function left() {
			return x;
		}

		function bottom() {
			return top() + height;
		}

		function right() {
			return left() + width;
		}

		function setDirection(newDirection) {
			currentDirection = newDirection;
		}

		function goLeft(timeSinceLastFrame) {
			setDirection(direction.left);
			x -= timeSinceLastFrame * enemySpeed;
		}

		function goRight(timeSinceLastFrame) {
			setDirection(direction.right);
			x += timeSinceLastFrame * enemySpeed;
		}

		function fireWeapon() {
			var initialX = (currentDirection === direction.left ? left() : right()) + 2,
				initialY = top() + 50,
				projectileDirection = currentDirection === direction.left ? -1 : 1;

			var newProjectile = {
				projectileX: initialX,
				projectileY: initialY,
				velocity: bulletSpeed * projectileDirection
			};

			lastFiredTime = new Date().getTime();
			sceneProjectiles.enemy.push(newProjectile);
		}

		function fireIfReady() {
			if(new Date().getTime() >= lastFiredTime + fireRate) {
				fireWeapon();
			}
		}

		function playerIsWithinSightInDirection(facingDireciton) {
			if(facingDireciton === direction.left) {
				return currentPlayer.playerRight() >= left() - 150;
			} else {
				return currentPlayer.playerLeft() >= right() + 150;
			}
		}

		function pace(timeSinceLastFrame) {
			if(!shouldPace)
				return;

			if(currentDirection == direction.left && x < paceApex - paceDistance) {
				setDirection(direction.right);
			} else if(currentDirection == direction.right && x > paceApex + paceDistance) {
				setDirection(direction.left);
			}

			if(currentDirection == direction.left) {
				goLeft(timeSinceLastFrame);
			} else {
				goRight(timeSinceLastFrame);
			}
		}

		function fall(timeSinceLastFrame) {
			y += timeSinceLastFrame * fallRate;
		}

		function createNewProjectile() {
			var initialX = (currentDirection === direction.left ? left() : right()) + 2,
				initialY = top() + 30,
				projectileDirection = currentDirection === direction.left ? -1 : 1;

			return {
				projectileX: initialX,
				projectileY: initialY,
				velocity: 900 * projectileDirection
			};
		}

		function isCollidingWithPlayerProjectile() {
			for(var p = 0; p < sceneProjectiles.player.length; p++) {
				var projectile = sceneProjectiles.player[p];

				if(projectile === null)
					continue;

				if(projectile.projectileX + projectile.width > left() && projectile.projectileX < right()) {
					sceneProjectiles.player[p] = null;
					return true;
				}
			}

			return false;
		}

		function update(timeSinceLastFrame) {
			if(isCollidingWithPlayerProjectile()) {
				destroyed = true;
			}

			if(playerIsWithinSightInDirection(currentDirection)) {
				fireIfReady();
			} else {
				pace(timeSinceLastFrame);
			}
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(spriteLoaded && !destroyed) {
				canvas.drawImage(sprite, currentDirection, 0, width, height, left() - canvasTopLeftX, top() - canvasTopLeftY, width, height);
			}
		}

		function initializeSprite(pathToSprite) {
			sprite = new Image();
			spriteLoaded = false;

			sprite.onload = function () {
				spriteLoaded = true;
				width = sprite.width / 2;
				height = sprite.height;
			};

			sprite.src = pathToSprite;
		}

		function init(enemyData, player, projectiles) {
			initializeSprite(enemyData.spriteSource);
			setDirection(direction.left);
			shouldPace = enemyData.pace || false;
			paceDistance = enemyData.paceDistance || 200;
			x = paceApex = enemyData.initialX;
			y = enemyData.initialY;
			currentPlayer = player;
			sceneProjectiles = projectiles;
			destroyed = false;
		}

		return {
			init: init,
			update: update,
			render: render,
			fall: fall,
			enemyLeft: left,
			enemyTop: top,
			enemyRight: right,
			enemyBottom: bottom,
			createNewProjectile: createNewProjectile
		};
	};
});
