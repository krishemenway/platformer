/* globals define */
define(["startScreenState", "runningGameState", "exports"], function(startScreenState, RunningGameState, exports) {
	"use strict";

	var currentState,
		keysDown = {},
		controller = {},
		controls = {
			startKey: 13,
			leftKey: [65,37,100],
			rightKey: [68,39,102],
			fireKey: 32,
			jumpKey: [87,38,104]
		};

	function controlIsActivated(control) {
		if(typeof controls[control] === "number") {
			return controls[control] in keysDown;
		}

		for(var c = 0; c < controls[control].length; c++) {
			if(controls[control][c] in keysDown) {
				return true;
			}
		}

		return false;
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
