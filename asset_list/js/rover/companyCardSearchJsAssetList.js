module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardsearchJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [				
				roverRoot + "controllers/companycard/search/**/*.js",
				roverRoot + "controllers/rvSelectCardTypeCtrl.js",
				roverRoot + "services/rvCompanyCardSearchSrv.js",
				'rover/directives/Outside Click handler/**/*.js',
			]
		};
		return comapnycardsearchJsAssets;
	}
};