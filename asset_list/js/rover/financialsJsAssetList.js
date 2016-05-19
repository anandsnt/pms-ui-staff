module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		allotmentJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/financials/**/*.js",
				roverRoot + "services/financials/**/*.js",
				roverRoot + "controllers/companycard/details/*.js"
			]
		};
		return allotmentJsAssets;
	}
};