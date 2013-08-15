
require(["game", "player", "platform"], function(game, player, platform) {
	var canvas = document.getElementById("game");
	var g = new game(canvas);
	g.initialize();
});
