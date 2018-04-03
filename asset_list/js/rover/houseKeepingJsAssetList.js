module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		houseKeepingJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [					
				roverRoot + "controllers/housekeeping/**/*.js",
				roverRoot + "controllers/workManagement/**/*.js",
				roverRoot + "services/housekeeping/**/*.js",
				roverRoot + "services/workManagement/**/*.js"
			]
		};
		return houseKeepingJsAssets;
	}
};