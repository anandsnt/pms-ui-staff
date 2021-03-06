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
				roverRoot + "controllers/billFormat/rvBillFormatPopupController.js",
				roverRoot + "controllers/billFormat/rvArBillFormatPopupController.js",
				roverRoot + "services/bill/**/*.js",
				roverRoot + "services/rvCompanyCardSrv.js",
				roverRoot + "controllers/paymentReceipt/**/*.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return allotmentJsAssets;
	}
};
