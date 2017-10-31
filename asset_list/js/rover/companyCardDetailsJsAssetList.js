module.exports = {
	getList : function() {
		var roverRoot 		= 'rover/',
		companycardDetailsJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [
				roverRoot + "controllers/companycard/details/**/*.js",
				roverRoot + "controllers/companycard/activityLog/*.js",
				roverRoot + "controllers/arTransactions/*.js",
				roverRoot + "controllers/arTransactions/**/*.js",
				roverRoot + "controllers/cardsOutside/rvCompanyCardArTransactionsCtrl.js",
				roverRoot + "controllers/roverPayment/rvCardOptionsCtrl.js",
				roverRoot + "services/rvCompanyCardSrv.js",
				roverRoot + "services/companycard/rvCompanyCardNotesSrv.js",
				roverRoot + "services/payment/rvPaymentSrv.js",
				roverRoot + "services/rvReservationSrv.js",
				roverRoot + "services/accounts/rvAccountsArTransactionsSrv.js",
				roverRoot + "services/postCharge/rvPostChargeSrvV2.js",
				'rover/services/payment/rvPaymentSrv.js',
				'rover/services/accounts/rvAccountsTransactionSrv.js',
				'rover/controllers/contractStartCalendarCtrl.js',
				'rover/controllers/contractEndCalendarCtrl.js',
				'rover/controllers/cardsOutside/rvArTransactionsPayCreditsController.js',
				'rover/controllers/cardsOutside/rvArTransactionsDatePickerController.js',
				'rover/controllers/contractedNightsCtrl.js',
				'rover/controllers/rvCommissionsDatePickerController.js'
			]
		};
		return companycardDetailsJsAssets;
	}
};