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
			playerJump = 250,
			playerFallRate = 300,
			fireRate = 400,
			isJumping = false,
			jumpDuration = 50,
			lastJumpTime = new Date().getTime(),
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
				velocity: 900 * projectileDirection
			};
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(spriteLoaded) {
				canvas.drawImage(sprite, currentDirection, 0, width, height, left() - canvasTopLeftX, top(), width, height);
			}

			if(window.debug) {
				canvas.fillText("Can Jump: " + playerCanJump, 10, 150);
				canvas.fillText("Is Jumping: " + isJumping, 10, 175);
			}
		}

		function getIsJumping() {
			return isJumping;
		}

		function setCanJump(canJump) {
			playerCanJump = canJump;

			if(!playerCanJump) {
				isJumping = false;
			}
		}

		function jump(timeSinceLastFrame) {
			playerY -= playerJump * timeSinceLastFrame;
		}

		function update(controller, timeSinceLastFrame) {
			if(controller.jumpKeyIsPressed() && playerCanJump) {
				lastJumpTime = new Date().getTime();
				isJumping = true;
			}

			if(isJumping && lastJumpTime + jumpDuration < new Date().getTime()) {
				playerCanJump = false;
				isJumping = false;
			}

			if(isJumping) {
				jump(timeSinceLastFrame);
			}
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
			playerIsJumping: getIsJumping,
			createNewProjectile: createNewProjectile,
			fireRate: fireRate,
			setCanJump: setCanJump
		};
	};
});