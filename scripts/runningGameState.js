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
				platformData: [{x: 0, y: 380, w: 1600, h: 100}]
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

	// 	var difference = currentPlayer.speed * timeSinceLastFrame;
		
	// 	if (currentPlayer.x + currentPlayer.width() + difference > gameX + (gameWidth * 3 / 5)) {
	// 		gameX += difference;
	// 	}
		
	// 	if (currentPlayer.x - difference <= gameX + (gameWidth * 2 / 5)) {
	// 		if(gameX - difference >= 0) {
	// 			gameX -= difference;
	// 		} else {
	// 			gameX = 0;
	// 		}
	// 	}
		
	// 	// currentPlayer holding up
	// 	if (38 in keysDown) {
	// 		currentPlayer.handleJump(timeSinceLastFrame);
	// 	}
		
	// 	// currentPlayer holding down
	// 	if (40 in keysDown) {
	// 		currentPlayer.handleDuck(timeSinceLastFrame);
	// 	}
		
	// 	// currentPlayer holding left
	// 	if (37 in keysDown) {
	// 		currentPlayer.goLeft(timeSinceLastFrame);
	// 	}
		
	// 	// currentPlayer holding right
	// 	if (39 in keysDown) {
	// 		currentPlayer.goRight(timeSinceLastFrame);
	// 	}
		
	// 	if (!playerIsOnAPlatform(platforms)){
	// 		currentPlayer.fall(gravity * timeSinceLastFrame);
	// 	}
	// }

	// function playerIsOnAPlatform() {
	// 	var playerY = Math.round(currentPlayer.y());
	// 	var playerHeight = currentPlayer.height();

	// 	for(var platformKey in platforms) {
	// 		var platform = platforms[platformKey];
			
	// 		if(platform.y > playerY - clippingRadial + playerHeight && platform.y < playerY + clippingRadial + playerHeight) {
	// 			return platform.y;
	// 		}
	// 	}

	// 	if(playerY > gameHeight + playerHeight)
	// 		return gameHeight - playerHeight;

	// 	return 0;




	