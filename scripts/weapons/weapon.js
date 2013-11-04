/* globals define,Class */
define(["projectiles/projectile", "class"], function(Projectile) {
	"use strict";

	var direction = {
		left: -1,
		right: 1
	};

	var Weapon = Class.extend({

		lastFiredTime: new Date().getTime(),
		fireRate: 400,
		weaponName: undefined,
		sceneProjectiles: undefined,
		weaponOwner: undefined,

		createProjectiles: function() {
			this.sceneProjectiles[this.weaponOwner.team()].push(this.createProjectile());
		},

		createProjectile: function() {

			var initialX = (this.weaponOwner.currentDirection() === direction.left ? this.weaponOwner.left() : this.weaponOwner.right()) + 2,
				initialY = this.weaponOwner.top() + 30,
				projectileDirection = this.weaponOwner.currentDirection() === direction.left ? -1 : 1;

			return new Projectile(initialX, initialY, 5, 5, 900 * projectileDirection);
		},

		name: function() {
			return this.weaponName;
		},

		fire: function() {
			if(new Date().getTime() <= this.lastFiredTime + this.fireRate)
				return;

			this.lastFiredTime = new Date().getTime();
			this.createProjectiles();
		},

		timeSinceLastFired: function() {
			return new Date().getTime() - this.lastFiredTime;
		},

		init: function(weaponType, projectiles, owner) {
			this.weaponOwner = owner;
			this.sceneProjectiles = projectiles;
			this.weaponName = weaponType;
		}
	});

	return Weapon;
});