module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardsearchJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [				
				roverRoot + "controllers/companycard/search/**/*.js",
				roverRoot + "controllers/rvSelectCardTypeCtrl.js",
				roverRoot + "services/rvCompanyCardSearchSrv.js",
				roverRoot + "services/rvCompanyCardSrv.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return comapnycardsearchJsAssets;
	}
};