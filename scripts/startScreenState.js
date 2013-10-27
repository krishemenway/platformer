/* globals define */
define(["exports"], function(exports) {
	"use strict";

	var startGame;

	function render(canvas) {
		canvas.fillStyle = "rgb(35,35,35)";
		canvas.fillRect(0,0,10000,10000);

		canvas.font="32px Arial";
		canvas.fillStyle = "rgb(0,0,0)";
		canvas.fillText("Press Enter to start", 50, 50);
	}

	function update(controller, timeSinceLastFrame) {
		if(controller.enterKeyIsPressed()) {
			startGame();
		}
	}

	function init(startGameFunction) {
		startGame = startGameFunction;
	}

	exports.init = init;
	exports.render = render;
	exports.update = update;
});