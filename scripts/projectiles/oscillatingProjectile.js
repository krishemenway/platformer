/* globals define */

define(["projectiles/projectile"], function(Projectile) {
	"use strict";

	var OscillatingProjectile = Projectile.extend({

		originalY: 0,
		life: 0,
		reverse: false,

		moveProjectile: function(timeSinceLastFrame) {
			this.x += this.velocity * timeSinceLastFrame;
			this.life += (this.reverse ? -1 : 1) * this.velocity * timeSinceLastFrame;
			this.y = this.originalY + 50 * Math.sin(this.life * Math.PI / 180);
		},

		init: function(initialX, initialY, width, height, initialVelocity, reverseDirection) {
			this._super(initialX, initialY, width, height, initialVelocity);
			this.originalY = initialY;
			this.reverse = reverseDirection || false;
		}
	});

	return OscillatingProjectile;
});