/* globals define */
define(["startScreenState", "runningGameState", "exports"], function(startScreenState, RunningGameState, exports) {
	"use strict";

	var currentState,
		keysDown = {},
		controller = {},
		controls = {
			enterKey: 13,
			leftKey: 37,
			rightKey: 39,
			fireKey: 32,
			jumpKey: 38
		};

	function controlIsActivated(control) {
		return controls[control] in keysDown;
	}

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	function update(timeSinceLastFrame) {
		currentState.update(controller, timeSinceLastFrame);
	}

	function render(canvas) {
		currentState.render(canvas);
	}

	function initializeControls() {
		for(var control in controls) {
			(function(ctrl) {
				controller[ctrl + "IsPressed"] = function() {
					return controlIsActivated(ctrl);
				};
			})(control);
		}
	}

	function initializeRunningGame() {
		currentState = new RunningGameState();
		currentState.init();
	}

	function initializeStartScreen() {
		startScreenState.init(startGame);
		currentState = startScreenState;
	}

	function startGame() {
		initializeRunningGame();
	}

	function init() {
		initializeStartScreen();
		initializeControls();
	}

	exports.init = init;
	exports.render = render;
	exports.update = update;
});
