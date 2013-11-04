/* globals define */
define(["weapon"], function(Weapon) {
	var sceneProjectiles,
		weapons = {
			straight: straight,
			arc: arc
		};

	function straight(weaponOwner) {
		return new Weapon("straight", sceneProjectiles, weaponOwner);
	}

	function arc(weaponOwner) {
		return new Weapon("arc", sceneProjectiles, weaponOwner);
	}

	function getWeapon(type, weaponOwner) {
		return weapons[type](weaponOwner);
	}

	function init(projectiles) {
		sceneProjectiles = projectiles;
	}

	return {
		init: init,
		getWeapon: getWeapon
	};
});