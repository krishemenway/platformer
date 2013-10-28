/* globals define */
define(["scene"], function(Scene) {
	"use strict";

	return function runningGameState() {

		var scenes,
			currentScene;

		function update(controller, timeSinceLastFrame) {
			currentScene.update(controller, timeSinceLastFrame);
		}

		function render(canvas) {
			currentScene.render(canvas);
		}

		function setScene(sceneNumber) {
			currentScene = scenes[sceneNumber];
			currentScene.init({
				background: "/images/level_1.jpg",
				playerData: {initialX: 30, initialY: 80, playerSprite: "/images/robot.png"},
				platformData: [{x: 0, y: 380, w: 1600, h: 100}],
				enemies: [
					{initialX: 800, initialY: 250, spriteSource: "/images/enemy.png", pace: true, paceDistance: 100},
					{initialX: 400, initialY: 250, spriteSource: "/images/enemy.png", pace: true, paceDistance: 100},
					{initialX: 1300, initialY: 250, spriteSource: "/images/enemy.png", pace: true, paceDistance: 100}
				]
			});
		}

		function initializeScenes() {
			scenes = [
				new Scene()
			];
		}

		function init() {
			initializeScenes();
			setScene(0);
		}

		return {
			init: init,
			update: update,
			render: render
		};
	};
});
