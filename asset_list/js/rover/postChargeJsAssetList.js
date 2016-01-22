module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + 'postCharge/**/*.js',
				servicesRoot + "postCharge/**/*.js",
				servicesRoot + "bill/rvBillCardSrv.js",
				'rover/directives/delayTextbox/rvDelayTextBox.js',
				servicesRoot + "accounts/rvAccountsTransactionSrv.js"
			]
		};
		return groupJsAssets;
	}
};