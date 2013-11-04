/* globals define */

define(["class"], function() {
	"use strict";

	var Projectile = Class.extend({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		velocity: 0,
		isDestroyed: false,

		collidesWith: function(top, right, bottom, left) {
			return this.x + this.width > left && this.x < right && this.y + this.height > top && this.y <= bottom;
		},

		destroy: function() {
			this.isDestroyed = true;
		},

		render: function(canvas, canvasTopLeftX, canvasTopLeftY) {

			if(!this.isDestroyed) {
				canvas.fillStyle = "rgb(255,255,255)";

				canvas.beginPath();
				canvas.arc(this.x - canvasTopLeftX, this.y - canvasTopLeftY, this.width, 0, 2 * Math.PI, false);
				canvas.fill();
			}
		},

		moveProjectile: function(timeSinceLastFrame) {
			this.x += this.velocity * timeSinceLastFrame;
		},

		update: function(timeSinceLastFrame) {
			this.moveProjectile(timeSinceLastFrame);
		},

		init: function(initialX, initialY, width, height, initialVelocity) {
			this.x = initialX;
			this.y = initialY;
			this.velocity = initialVelocity;
			this.width = width;
			this.height = height;
		}
	});

	return Projectile;
});