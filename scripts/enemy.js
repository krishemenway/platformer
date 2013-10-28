
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
			enemySpeed = 350,
			spriteLoaded,
			shouldPace,
			paceDistance,
			currentDirection;

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


		function update(timeSinceLastFrame) {
			pace(timeSinceLastFrame);
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(spriteLoaded) {
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

		function init(enemyData) {
			initializeSprite(enemyData.spriteSource);
			setDirection(direction.left);
			shouldPace = enemyData.pace || false;
			paceDistance = enemyData.paceDistance || 200;
			x = paceApex = enemyData.initialX;
			y = enemyData.initialY;
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
