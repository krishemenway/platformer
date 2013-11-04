/* globals define */
define(["projectile"], function(Projectile) {
	"use strict";

	var direction = {
		left: -1,
		right: 1
	};

	return function weapon(weaponType, projectiles, firingObject) {

		var lastFiredTime = new Date().getTime(),
			fireRate = 400;

		function createProjectile() {

			var initialX = (firingObject.currentDirection() === direction.left ? firingObject.left() : firingObject.right()) + 2,
				initialY = firingObject.top() + 30,
				projectileDirection = firingObject.currentDirection() === direction.left ? -1 : 1;

			return new Projectile(initialX, initialY, 5, 5, 900 * projectileDirection);
		}

		function name() {
			return weaponType;
		}

		function fire() {
			if(new Date().getTime() <= lastFiredTime + fireRate)
				return;

			lastFiredTime = new Date().getTime();
			projectiles[firingObject.team()].push(createProjectile());
		}

		function timeSinceLastFired() {
			return new Date().getTime() - lastFiredTime;
		}

		return {
			name: name,
			fire: fire,
			timeSinceLastFired: timeSinceLastFired
		};
	};
});