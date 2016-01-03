module.exports = {	
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		availabilityJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + "highcharts.min.js"
			],
			nonMinifiedFiles: [			
				jsLibRoot + "angular-highcharts.js",			
				roverRoot + "controllers/availability/**/*.js",
				roverRoot + "services/availability/**/*.js"
			]
		};
		return availabilityJsAssets;
	}
};