/* globals define */

define(function() {
	"use strict";

	return function projectile(initialX, initialY, width, height, velocity) {

		var x = 0,
			y = 0,
			isDestroyed = false;

		function collidesWith(top, right, bottom, left) {
			return x + width > left && x < right && y + height > top && y <= bottom;
		}

		function destroy() {
			isDestroyed = true;
		}

		function render(canvas, canvasTopLeftX, canvasTopLeftY) {
			if(!isDestroyed) {
				canvas.fillStyle = "rgb(255,255,255)";

				canvas.beginPath();
				canvas.arc(x - canvasTopLeftX, y - canvasTopLeftY, width, 0, 2 * Math.PI, false);
				canvas.fill();
			}
		}

		function update(timeSinceLastFrame) {
			if(!isDestroyed) {
				x += velocity * timeSinceLastFrame;
			}
		}

		function init() {
			x = initialX;
			y = initialY;
		}

		init();

		return {
			render: render,
			update: update,
			collidesWith: collidesWith,
			destroy: destroy
		};

	};
});