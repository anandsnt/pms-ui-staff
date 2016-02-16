module.exports = {	
	getList : function() {
		var roverRoot 	= 'rover/',
		rateMgrJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [		
				roverRoot + "controllers/rateManager/**/*.js",
				roverRoot + "services/rateManager/**/*.js"
			]
		};
		return rateMgrJsAssets;
	}
};