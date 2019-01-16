module.exports = {
	getList : function() {
		var roverRoot 		= 'rover/',
		reportJsAssets 	= {
			minifiedFiles: [],
			nonMinifiedFiles: [
				roverRoot + "services/reports/**/*.js",
				roverRoot + "controllers/reports/reportAnalytics/RVReportAnalyticsCtrl.js",
                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return reportJsAssets;
	}
};
