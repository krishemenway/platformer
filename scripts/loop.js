
/* globals define */
define(["game", "requestAnimationFrame", "exports"], function(game, requestAnimationFrame, exports) {
	"use strict";

	var then = new Date(),
		now = new Date(),
		canvasElement,
		canvasContext,
		raf = requestAnimationFrame();

	function render() {
		game.render(canvasContext);
	}

	function update() {
		var timeSinceLastFrame = (now - then) / 1000;
		game.update(timeSinceLastFrame);
	}

	function gameLoop() {
		raf(gameLoop);
		now = new Date();

		update();
		render();
		
		then = now;
	}

	function init(canvas) {
		canvasElement = canvas;
		canvasContext = canvasElement.getContext("2d");

		var height = parseInt(canvas.height, 10);
		var width = parseInt(canvas.width, 10);

		game.init();
		gameLoop();
	}

	exports.init = init;
});
