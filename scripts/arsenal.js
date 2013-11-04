/* globals define */
define(function() {
	return function arsenal() {
		var lastSwitchedWeaponTime = new Date().getTime(),
			weaponSwitchSpeed = 500,
			currentWeaponIndex,
			weaponSlots = [],
			maxWeaponSlotSize = 5;

		var self = {
			currentWeapon: getCurrentWeapon,
			gotoNextWeapon: gotoNextWeapon,
			gotoPreviousWeapon: gotoPreviousWeapon,
			gotoWeaponSlot: gotoWeaponSlot,
			addWeapon: addWeapon
		};

		function addWeapon(weapon) {
			for(var w = 0; w < maxWeaponSlotSize; w++){
				if(weaponSlots[w] == undefined) {
					weaponSlots[w] = weapon;
					return;
				}
			}
		}

		function getCurrentWeapon() {
			return weaponSlots[currentWeaponIndex];
		}

		function gotoNextWeapon() {
			if(!canSwitchWeapon())
				return;

			for(var w = currentWeaponIndex + 1; w <= weaponSlots.length; w++) {
				var slotNumber = w >= weaponSlots.length ? w - weaponSlots.length : w;
				if(weaponSlots[slotNumber] != undefined) {
					gotoWeaponSlot(slotNumber);
					return;
				}
			}
		}

		function gotoPreviousWeapon() {
			if(!canSwitchWeapon())
				return;

			for(var w = currentWeaponIndex - 1; w >= currentWeaponIndex - weaponSlots.length; w--) {
				var slotNumber = w < 0 ? weaponSlots.length + w : w;

				if(weaponSlots[slotNumber] != undefined) {
					gotoWeaponSlot(slotNumber);
					return;
				}
			}
		}

		function gotoWeaponSlot(slot) {
			currentWeaponIndex = slot;
			lastSwitchedWeaponTime = new Date().getTime();
		}

		function canSwitchWeapon() {
			return new Date().getTime() > lastSwitchedWeaponTime + weaponSwitchSpeed;
		}

		return self;
	};
});