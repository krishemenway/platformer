/* globals define,snack */
define(["scene", "snack"], function(Scene) {
	"use strict";

	return function runningGameState() {

		var scenes,
			sceneCount = 1,
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

			for(var s = 1; s <= sceneCount; s++) {
				snack.request({url: "scenes/scene" + s + ".json"}, loadScene);
			}
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
