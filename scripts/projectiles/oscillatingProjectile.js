/* globals define */

define(["projectiles/projectile"], function(Projectile) {
	"use strict";

	var OscillatingProjectile = Projectile.extend({

		originalY: 0,
		life: 0,

		update: function(timeSinceLastFrame) {
			this.x += this.velocity * timeSinceLastFrame;
			this.life += this.velocity * timeSinceLastFrame;
			this.y = this.originalY + 50 * Math.sin(this.life * Math.PI / 180);
		},

		init: function(initialX, initialY, width, height, initialVelocity, initialLife) {
			this._super(initialX, initialY, width, height, initialVelocity);
			this.originalY = initialY;
			this.life = initialLife || 0;
		}
	});

	return OscillatingProjectile;
});