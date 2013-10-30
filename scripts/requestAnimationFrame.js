/* globals define,window */
define(function() {
	"use strict";

	return function() {
		var existingRaf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

		if(existingRaf)
			return existingRaf;
		else
			return function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	};
});