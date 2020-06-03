(function() {

	var width = window.screen.width;
	var height = window.screen.height;
	var scaling = window.devicePixelRatio;

	width = width * 0.966 * scaling;
	height = height * 0.79 * scaling;

	$("#bodyDiv").width(width + "px");
	$("#bodyDiv").height(height + "px");

})
