/* globals define */
define(["weapons/weapon", "projectiles/oscillatingProjectile"], function(Weapon, OscillatingProjectile) {
	"use strict";

	var direction = {
		left: -1,
		right: 1
	};

	var DualArcWeapon = Weapon.extend({

		projectileVelocity: 900,

		createProjectiles: function() {
			this.sceneProjectiles[this.weaponOwner.team()].push(this.createProjectile(false));
			this.sceneProjectiles[this.weaponOwner.team()].push(this.createProjectile(true));
		},

		createProjectile: function(shouldReverse) {
			var initialX = (this.weaponOwner.currentDirection() === direction.left ? this.weaponOwner.left() : this.weaponOwner.right()) + 2,
				initialY = this.weaponOwner.top() + 30,
				projectileDirection = this.weaponOwner.currentDirection() === direction.left ? -1 : 1;

			return new OscillatingProjectile(initialX, initialY, 5, 5, this.projectileVelocity * projectileDirection, shouldReverse);
		},

		init: function(projectiles, owner) {
			this._super("dualArc", projectiles, owner);
		}
	});

	return DualArcWeapon;
});