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
			shouldAutoFire = false,
			fireRate = 2500,
			bulletSpeed = 300,
			sightDistance = 150,
			lastFiredTime = new Date().getTime(),
			projectileOffset = 50,
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

		function getProjectileX() {
			return (currentDirection === direction.left ? left() - 2 : right() + 2);
		}

		function getProjectileY() {
			return top() + projectileOffset;
		}

		function fireWeapon() {
			var initialX = getProjectileX(),
				initialY = getProjectileY(),
				projectileDirection = currentDirection === direction.left ? -1 : 1;

			var newProjectile = {
				projectileX: initialX,
				projectileY: initialY,
				width: 20,
				height: 3,
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

		function isDestroyed() {
			return destroyed;
		}

		function playerIsWithinSightVertically() {
			return currentPlayer.playerBottom() > top() && currentPlayer.playerTop() < bottom();
		}

		function playerIsInSightOnRight() {
			return currentPlayer.playerLeft() <= right() + sightDistance && currentPlayer.playerLeft() > right();
		}

		function playerIsInSightOnLeft() {
			return currentPlayer.playerRight() >= left() - sightDistance && currentPlayer.playerRight() < left();
		}

		function playerIsWithinSight() {
			if(currentDirection === direction.left) {
				return playerIsInSightOnLeft() && playerIsWithinSightVertically();
			} else {
				return playerIsInSightOnRight() && playerIsWithinSightVertically();
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

				if(projectile.projectileX + projectile.width > left() && projectile.projectileX < right()
					&& projectile.projectileY + projectile.height > top() && projectile.projectileY <= bottom()) {
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

			if(playerIsWithinSight() || shouldAutoFire) {
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
			shouldAutoFire = enemyData.shouldAutoFire || false;
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
			createNewProjectile: createNewProjectile,
			isDestroyed: isDestroyed
		};
	};
});
