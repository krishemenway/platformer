/* globals define,$ */
define(["scene", "snack"], function(Scene) {
	"use strict";

	return function runningGameState() {

		var scenes,
			scenePaths = ["scenes/scene1.json"],
			currentScene;

		function update(controller, timeSinceLastFrame) {
			if(currentScene)
				currentScene.update(controller, timeSinceLastFrame);
		}

		function render(canvas) {
			if(currentScene)
				currentScene.render(canvas);
		}

		function setScene(sceneNumber) {
			currentScene = scenes[sceneNumber];
			currentScene.init();
		}

		function loadScene(error, response) {
			scenes.push(new Scene(snack.parseJSON(response)));

			if(scenes.length === 1)
				setScene(0);
		}

		function initializeScenes() {
			scenes = [];

			scenePaths.forEach(function(scenePath) {
				snack.request({url: "scenes/scene1.json"}, loadScene);
			});
		}

		function init() {
			initializeScenes();
		}

		return {
			init: init,
			update: update,
			render: render
		};
	};
});
