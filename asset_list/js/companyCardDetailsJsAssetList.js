module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardDetailsJsAssets = [			
			roverRoot + "controllers/companycard/details/**/*.js",
			roverRoot + "controllers/cardsOutside/rvCompanyCardArTransactionsCtrl.js",
			roverRoot + "services/rvCompanyCardSrv.js"
		];
		return comapnycardDetailsJsAssets;
	}
};