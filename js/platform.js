
function platform(height, width) {
	var p = {};
	
	p.height = height;
	p.width = width;
	
	p.image = new Image();
	p.image_path = "images/platform_" + p.height + "_" + p.width + ".png";
	p.image_loaded = false;
	
	return p;
}