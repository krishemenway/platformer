/* globals define */
define(["exports"], function(exports) {
	"use strict";

	var startGame,
		startGameImage,
		startGameImageWidth = 0,
		startGameImageHeight = 0,
		startGameImageLoaded;

	function render(canvas) {
		if(startGameImageLoaded) {
			canvas.drawImage(startGameImage, 0, 0, startGameImageWidth, startGameImageHeight);
		}
	}

	function update(controller, timeSinceLastFrame) {
		if(controller.startKeyIsPressed()) {
			startGame();
		}
	}

	function init(startGameFunction) {
		startGame = startGameFunction;

		startGameImage = new Image();

		startGameImage.onload = function() {
			startGameImageLoaded = true;
			startGameImageHeight = startGameImage.height;
			startGameImageWidth = startGameImage.width;
		};

		startGameImage.src = "images/startscreen.jpg";
	}

	exports.init = init;
	exports.render = render;
	exports.update = update;
});