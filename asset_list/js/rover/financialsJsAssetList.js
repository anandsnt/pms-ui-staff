module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		allotmentJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/financials/**/*.js",
				roverRoot + "services/financials/**/*.js",
				roverRoot + "services/accounts/*.js",
				roverRoot + "controllers/companycard/details/*.js",
				roverRoot + "services/rvContactInfoSrv.js",
			]
		};
		return allotmentJsAssets;
	}
};