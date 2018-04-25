module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + 'postCharge/*.js',
				servicesRoot + "postCharge/*.js",
				servicesRoot + "bill/rvBillCardSrv.js",
				servicesRoot + "accounts/rvAccountsTransactionSrv.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return groupJsAssets;
	}
};
