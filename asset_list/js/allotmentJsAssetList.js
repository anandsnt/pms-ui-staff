module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		allotmentJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/allotments/**/*.js",
				roverRoot + "services/allotments/**/*.js"
			]
		};
		return allotmentJsAssets;
	}
};