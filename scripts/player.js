/* globals define */
define([], function() {
	"use strict";

	return function player() {
		var sprite,
			spriteLoaded,
			width,
			height,
			currentDirection,
			playerX,
			playerY,
			playerSpeed = 350,
			playerJump = 500,
			playerFallRate = 150,
			fireRate = 400,
			jumpDuration = 500,
			jumpKeyLastPressed = new Date(),
			playerCanJump = false;

		var direction = {
			left: 50,
			right: 0
		};

		function center() {
			return left() + width / 2;
		}

		function right() {
			return left() + width;
		}

		function left() {
			return playerX;
		}

		function top() {
			return playerY;
		}

		function bottom() {
			return top() + height;
		}

		function goLeft(timeSinceLastFrame) {
			setDirection(direction.left);
			playerX -= timeSinceLastFrame * playerSpeed;
		}

		function goRight(timeSinceLastFrame) {
			setDirection(direction.right);
			playerX += timeSinceLastFrame * playerSpeed;
		}

		function setDirection(direction) {
			currentDirection = direction;
		}

		function fall(timeSinceLastFrame) {
			playerY += timeSinceLastFrame * playerFallRate;
		}

		function createNewProjectile() {
			var initialX = (currentDirection === direction.left ? left() : right()) + 2,
				initialY = top() + 30,
				projectileDirection = currentDirection === direction.left ? -1 : 1;

			return {
				projectileX: initialX,
				projectileY: initialY,
				velocity: 500 * projectileDirection
			};
		}

		function render(canvas, sceneWidth, sceneHeight, gameWidth, gameHeight) {
			if(spriteLoaded) {

				var x = 0;

				if(center() > sceneWidth - gameWidth / 2) {
					x = sceneWidth - playerX;
				} else if(center() <= gameWidth / 2) {
					x = playerX;
				} else {
					x = gameWidth / 2 - width / 2;
				}

				if(window.debug) {
					canvas.fillStyle = "rgb(255,0,0)";
					canvas.fillRect(gameWidth / 2,0,1,10000);
				}

				canvas.drawImage(sprite, currentDirection, 0, width, height, x, playerY, width, height);
			}
		}

		function setCanJump(canJump) {
			playerCanJump = canJump;
		}

		function jump(timeSinceLastFrame) {
			playerY += playerJump * timeSinceLastFrame;
		}

		function update(controller, timeSinceLastFrame) {

			// if(controller.jumpKeyPressed() && new Date().getTime() > jumpKeyLastPressed + jumpDuration) {
			// 	jumpKeyLastPressed = new Date().getTime();
			// 	isJumping = true;
			// }
		}

		function setPosition(newPlayerX, newPlayerY) {
			playerX = newPlayerX;
			playerY = newPlayerY;
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

		function init(playerData) {
			initializeSprite(playerData.playerSprite);
			setDirection(direction.right);
			setPosition(playerData.initialX, playerData.initialY);
		}

		return {
			init: init,
			update: update,
			render: render,
			setPosition: setPosition,
			fall: fall,
			goRight: goRight,
			goLeft: goLeft,
			playerBottom: bottom,
			playerTop: top,
			playerRight: right,
			playerLeft: left,
			playerCenter: center,
			createNewProjectile: createNewProjectile,
			fireRate: fireRate
		};
	};
});