/* globals define */
define(["weapons/weapon", "weapons/arcWeapon", "weapons/dualArcWeapon"], function(Weapon, ArcWeapon, DualArcWeapon) {
	var sceneProjectiles,
		weapons = {
			straight: straight,
			arc: arc,
			dualArc: dualArc
		};

	function straight(weaponOwner) {
		return new Weapon("straight", sceneProjectiles, weaponOwner);
	}

	function arc(weaponOwner) {
		return new ArcWeapon(sceneProjectiles, weaponOwner);
	}

	function dualArc(weaponOwner) {
		return new DualArcWeapon(sceneProjectiles, weaponOwner);
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