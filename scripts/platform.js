/* globals define */
define(function() {
	"use strict";

	return function platform(platformData) {

		var height = platformData.h, 
			width = platformData.w,
			top = platformData.y,
			right = platformData.x + platformData.w,
			bottom = platformData.y + platformData.h,
			left = platformData.x;

		function collidesWithVertically(objectTop, objectRight, objectBottom, objectLeft) {
			return objectTop <= top && objectBottom >= top && objectRight >= left && objectLeft <= right;
		}

		return {
			collidesWithVertically: collidesWithVertically
		};

	};
});
