module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardsearchJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [				
				roverRoot + "controllers/companycard/search/**/*.js",
				roverRoot + "controllers/rvSelectCardTypeCtrl.js",
				roverRoot + "controllers/payment/*.js",
				roverRoot + "controllers/roverPayment/*.js",
				roverRoot + "services/rvCompanyCardSearchSrv.js",
				roverRoot + "services/rvCompanyCardSrv.js",
				roverRoot + 'services/rvMergeCardsSrv.js',
				roverRoot + "controllers/rvMergeCardsCtrl.js",
				roverRoot + "controllers/billFormat/rvArBillFormatPopupController.js",
                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return comapnycardsearchJsAssets;
	}
};