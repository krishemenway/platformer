/* globals define */
define(["grid", "weapons", "arsenal"], function(Grid, Weapons, Arsenal) {
	"use strict";

	return function player() {
		var sprite,
			spriteLoaded,
			spriteFacingLeftX = 0,
			spriteFacingRightX = 0,
			width,
			height,
			currentDirection,
			playerX = 0,
			playerY = 0,
			playerRunSpeed = 1500,
			playerJumpSpeed = 300,
			isJumping = false,
			friction = 0.92,
			gravity = 15,
			velocityX = 0,
			velocityY = 100,
			sceneProjectiles,
			lastSafePoint,
			team = "player",
			arsenal;

		var direction = {
			left: -1,
			right: 1
		};

		var self = {
			init: init,
			update: update,
			render: render,
			bottom: bottom,
			top: top,
			right: right,
			left: left,
			center: center,
			y: top,
			x: left,
			width: getWidth,
			height: getHeight,
			currentDirection: getCurrentDirection,
			team: getTeam
		};

		function center() { return left() + width / 2; }
		function right() { return left() + width; }
		function left() { return playerX; }
		function top() { return playerY; }
		function bottom() { return top() + height; }
		function getWidth() { return width; }
		function getHeight() { return height; }

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

		function getCurrentDirection() {
			return currentDirection;
		}

		function renderDebug(canvas) {
			canvas.fillStyle = "rgb(255,255,255)";
			canvas.fillText("Velocity X: " + parseInt(velocityX,10) + " Y:" + parseInt(velocityY, 10), 10, 72);
			canvas.fillText("IsJumping: " + isJumping, 10, 84);
			canvas.fillText("Weapon: " + arsenal.currentWeapon().name(), 10, 96);
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(spriteLoaded) {
				var spriteX = currentDirection === direction.left ? spriteFacingLeftX : spriteFacingRightX;
				canvas.drawImage(sprite, spriteX, 0, width, height, left() - canvasTopLeftX, top() - canvasTopLeftY, width, height);
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

		function getTeam() {
			return team;
		}

		function update(controller, timeSinceLastFrame) {

			if(controller.leftKeyIsPressed() && left() >= 5) {
				goLeft(timeSinceLastFrame);
			} else if(controller.rightKeyIsPressed()) {
				goRight(timeSinceLastFrame);
			}

			velocityX *= friction;
			velocityY += gravity + velocityY < 1500 ? gravity : 0;

			if(Grid.collidesWithGridOnBottom(self)) {
				velocityY = 0;
				isJumping = false;
			} else {
				playerY += velocityY * timeSinceLastFrame;
			}

			if((Grid.collidesWithGridOnRight(self) && velocityX >= 0) || (Grid.collidesWithGridOnLeft(self) && velocityX <= 0))
				velocityX = 0;

			if(controller.jumpKeyIsPressed()) {
				jump();
				playerY += velocityY * timeSinceLastFrame;
			}

			playerX += velocityX * timeSinceLastFrame;

			if(controller.fireKeyIsPressed())
				arsenal.currentWeapon().fire();

			if(controller.previousWeaponKeyIsPressed())
				arsenal.gotoPreviousWeapon();

			if(controller.nextWeaponKeyIsPressed())
				arsenal.gotoNextWeapon();

			cleanupProjectiles();

			if(playerY > 1000)
				resetPlayer();
		}

		function cleanupProjectiles() {
			if(arsenal.currentWeapon().timeSinceLastFired() > 4000) {
				sceneProjectiles.player = [];
			}
		}

		function resetPlayer() {
			playerX = lastSafePoint.x;
			playerY = lastSafePoint.y;
			velocityX = 0;
			velocityY = 0;
		}

		function initializeSprite(pathToSprite) {
			sprite = new Image();
			spriteLoaded = false;

			sprite.onload = function () {
				spriteLoaded = true;
				width = sprite.width / 2;
				height = sprite.height;
				spriteFacingRightX = 0;
				spriteFacingLeftX = width;
			};

			sprite.src = pathToSprite;
		}

		function init(playerData, projectiles) {
			playerX = playerData.initialX;
			playerY = playerData.initialY;

			lastSafePoint = {x: playerX, y: playerY};

			initializeSprite(playerData.spriteSource);
			setDirection(direction.right);
			sceneProjectiles = projectiles;

			arsenal = new Arsenal();
			arsenal.addWeapon(Weapons.getWeapon("straight", self));
			arsenal.addWeapon(Weapons.getWeapon("arc", self));
			arsenal.gotoWeaponSlot(0);
		}

		return self;
	};
});