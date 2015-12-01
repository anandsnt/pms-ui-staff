module.exports = {	
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		availabilityJsAssets 	= [
			jsLibRoot + "highcharts.js",
			jsLibRoot + "angular-highcharts.js",			
			roverRoot + "controllers/availability/**/*.js",
			roverRoot + "services/availability/**/*.js"
		];
		return availabilityJsAssets;
	}
};