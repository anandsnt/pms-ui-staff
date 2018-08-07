module.exports = {
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		reportReactViewRoot = roverRoot + 'react/reports/',
		diaryViewRoot = roverRoot + 'react/diary/',
		reportJsAssets 	= {
			minifiedFiles: [],
			nonMinifiedFiles: [
				diaryViewRoot + "util.js",
				roverRoot + "services/reports/**/*.js",
				roverRoot + "factories/reports/**/*.js",
				roverRoot + "constants/reports/**/*.js",
				roverRoot + "controllers/reports/**/*.js",
				reportReactViewRoot + "**/*.js",
				'shared/directives/numbersOnly/numbersOnly.js',
				roverRoot + 'services/reservation/rvReservationBaseSearchSrv.js',

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return reportJsAssets;
	}
};
