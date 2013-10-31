/* globals define */
define([], function() {
	"use strict";

	return function player() {
		var sprite,
			spriteLoaded,
			width,
			height,
			currentDirection,
			playerX = 0,
			playerY = 0,
			playerRunSpeed = 1500,
			playerJumpSpeed = 350,
			fireRate = 400,
			lastFiredTime,
			isJumping = false,
			friction = .92,
			gravity = 15,
			velocityX = 0,
			velocityY = 100,
			sceneProjectiles,
			scenePlatforms;

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
			velocityX -= playerRunSpeed * timeSinceLastFrame;
		}

		function goRight(timeSinceLastFrame) {
			setDirection(direction.right);
			velocityX += playerRunSpeed * timeSinceLastFrame;
		}

		function setDirection(direction) {
			currentDirection = direction;
		}

		function fireWeapon() {
			var initialX = (currentDirection === direction.left ? left() : right()) + 2,
				initialY = top() + 30,
				projectileDirection = currentDirection === direction.left ? -1 : 1;

			var newProjectile = {
				projectileX: initialX,
				projectileY: initialY,
				height: 5,
				width: 10,
				velocity: 900 * projectileDirection
			};

			lastFiredTime = new Date().getTime();
			sceneProjectiles.player.push(newProjectile);
		}

		function renderDebug(canvas) {
			canvas.fillText("Velocity X: " + parseInt(velocityX,10) + " Y:" + parseInt(velocityY), 10, 72);
			canvas.fillText("IsJumping: " + isJumping, 10, 84);
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(spriteLoaded) {
				canvas.drawImage(sprite, currentDirection, 0, width, height, left() - canvasTopLeftX, top() - canvasTopLeftY, width, height);
			}

			if(window.debug) {
				renderDebug(canvas);
			}
		}

		function jump() {
			if(!isJumping) {
				isJumping = true;
				velocityY = -playerJumpSpeed;
			}
		}

		function fireIfReady() {
			if(lastFiredTime === undefined || new Date().getTime() > lastFiredTime + fireRate) {
				fireWeapon();
			}
		}

		function isStandingOnPlatform(timeSinceLastFrame) {
			return playerY + velocityY * timeSinceLastFrame > 293;
		}

		function update(controller, timeSinceLastFrame) {

			if(controller.leftKeyIsPressed() && left() >= 5) {
				goLeft(timeSinceLastFrame);
			} else if(controller.rightKeyIsPressed()) {
				goRight(timeSinceLastFrame);
			}

			if(controller.jumpKeyIsPressed()) {
				jump();
			}

			velocityX *= friction;
			velocityY += gravity + velocityY < 1500 ? gravity : 0;

			if(isStandingOnPlatform(timeSinceLastFrame)) {
				isJumping = false;
			} else {
				playerY += velocityY * timeSinceLastFrame;
			}
		    
		    if(playerX + velocityX * timeSinceLastFrame > 0) {
				playerX += velocityX * timeSinceLastFrame;
		    }

			if(controller.fireKeyIsPressed()) {
				fireIfReady();
			}

			cleanupProjectiles();
		}

		function cleanupProjectiles() {
			if(lastFiredTime + 4000 <= new Date().getTime()) {
				sceneProjectiles.player = [];
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

		function init(playerData, projectiles, platforms) {
			initializeSprite(playerData.playerSprite);
			setDirection(direction.right);
			setPosition(playerData.initialX, playerData.initialY);
			sceneProjectiles = projectiles;
			scenePlatforms = platforms;
		}

		return {
			init: init,
			update: update,
			render: render,
			setPosition: setPosition,
			playerBottom: bottom,
			playerTop: top,
			playerRight: right,
			playerLeft: left,
			playerCenter: center
		};
	};
});