/* globals define */
define(["grid", "weapon"], function(Grid, Weapon) {
	"use strict";

	return function enemy() {
		var x = 0,
			y = 0,
			paceApex,
			width = 0,
			height = 0,
			sprite,
			spriteFacingLeftX,
			spriteFacingRightX,
			fallRate = 300,
			enemySpeed = 150,
			spriteLoaded,
			shouldPace,
			paceDistance,
			isJumping = false,
			velocityY = 0,
			currentDirection,
			shouldAutoFire = false,
			sightDistance = 150,
			destroyed,
			currentPlayer,
			sceneProjectiles,
			collision,
			currentWeapon,
			team = "enemy";

		var direction = {
			left: -1,
			right: 1
		};

		var self = {
			init: init,
			update: update,
			render: render,
			fall: fall,
			left: left,
			top: top,
			right: right,
			bottom: bottom,
			isDestroyed: isDestroyed,
			currentDirection: getCurrentDirection,
			team: getTeam
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

		function getTeam() {
			return team;
		}

		function isDestroyed() {
			return destroyed;
		}

		function playerIsWithinSightVertically() {
			return currentPlayer.bottom() > top() && currentPlayer.top() < bottom();
		}

		function playerIsInSightOnRight() {
			return currentPlayer.left() <= right() + sightDistance && currentPlayer.left() > right();
		}

		function playerIsInSightOnLeft() {
			return currentPlayer.right() >= left() - sightDistance && currentPlayer.right() < left();
		}

		function playerIsWithinSight() {
			if(currentDirection === direction.left) {
				return playerIsInSightOnLeft() && playerIsWithinSightVertically();
			} else {
				return playerIsInSightOnRight() && playerIsWithinSightVertically();
			}
		}

		function getCurrentDirection() {
			return currentDirection;
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

		function isCollidingWithPlayerProjectile() {
			for(var p = 0; p < sceneProjectiles.player.length; p++) {
				var projectile = sceneProjectiles.player[p];

				if(projectile.collidesWith(top(), right(), bottom(), left())) {
					projectile.destroy();
					return true;
				}
			}

			return false;
		}

		function update(timeSinceLastFrame) {
			if(isDestroyed())
				return;

			if(isCollidingWithPlayerProjectile()) {
				destroyed = true;
				return;
			}

			if(Grid.collidesWithGridOnBottom(self)) {
				velocityY = 0;
				isJumping = false;
			} else {
				fall(timeSinceLastFrame);
			}

			if(playerIsWithinSight() || shouldAutoFire) {
				currentWeapon.fire();
			} else {
				pace(timeSinceLastFrame);
			}
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(spriteLoaded && !destroyed) {
				var spriteX = currentDirection === direction.left ? spriteFacingLeftX : spriteFacingRightX,
					spriteY = 0;
				canvas.drawImage(sprite, spriteX, spriteY, width, height, left() - canvasTopLeftX, top() - canvasTopLeftY, width, height);
			}
		}

		function initializeSprite(pathToSprite) {
			sprite = new Image();
			spriteLoaded = false;

			sprite.onload = function () {
				spriteLoaded = true;
				width = sprite.width / 2;
				height = sprite.height;
				spriteFacingLeftX = width;
				spriteFacingRightX = 0;
			};

			sprite.src = pathToSprite;
		}

		function init(enemyData, player, projectiles, collisionDetectors) {
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
			collision = collisionDetectors;
			currentWeapon = new Weapon("default", sceneProjectiles, self);
		}

		return self;
	};
});
