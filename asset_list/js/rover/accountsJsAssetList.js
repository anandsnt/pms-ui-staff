module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					controllerRoot + 'groups/activity/**/*.js',
					controllerRoot + 'accounts/**/*.js',
					controllerRoot + 'depositBalance/rvDepositBalanceAccountsCtrl.js',
					controllerRoot + 'roverPayment/rvCardOptionsCtrl.js',
					controllerRoot + "billFormat/rvBillFormatPopupController.js",
					servicesRoot + 'accounts/**/*.js',
					servicesRoot + 'group/**/*.js',
					servicesRoot + "reservation/rvReservationSummarySrv.js",
					servicesRoot + "payment/rvPaymentSrv.js",
					servicesRoot + "rvReservationSrv.js",
					servicesRoot + "depositBalance/rvDepositBalanceSrv.js",
					servicesRoot + "bill/rvBillCardSrv.js",

				]
			};
		return assetsForScreen;
	}
};