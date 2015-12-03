module.exports = {	
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		rateMgrJsAssets = {
			minifiedFiles: [
				jsLibRoot + "highcharts.min.js"
			],
			nonMinifiedFiles: [	
				jsLibRoot + "angular-highcharts.js",			
				roverRoot + "controllers/rateManager/**/*.js",
				roverRoot + "services/rateManager/**/*.js"
			]
		};
		return rateMgrJsAssets;
	}
};