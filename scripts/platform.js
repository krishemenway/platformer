
define([], function platform() {
	return function platform(x, y, height, width) {
		var p = this;
		
		p.height = height;
		p.width = width;
		
		p.y = y;
		p.x = x;
		
		p.image = new Image();
		p.image_path = "images/platform_" + p.height + "_" + p.width + ".png";
		p.image_loaded = false;
	};
});
