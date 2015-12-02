module.exports = {	
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		rateMgrJsAssets 	= [
			jsLibRoot + "highcharts.js",
			jsLibRoot + "angular-highcharts.js",			
			roverRoot + "controllers/rateManager/**/*.js",
			roverRoot + "services/rateManager/**/*.js"
		];
		return rateMgrJsAssets;
	}
};