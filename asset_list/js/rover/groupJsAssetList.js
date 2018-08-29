module.exports = {
	getList : function() {
		var roverRoot 		= 'rover/',
			servicesRoot 	= 'rover/services/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [
				roverRoot + "controllers/groups/**/*.js",
				roverRoot + "controllers/accounts/**/*.js",
				roverRoot + "filters/rangeFilter.js",
				roverRoot + "controllers/depositBalance/rvDepositBalanceAccountsCtrl.js",
				roverRoot + "controllers/roverPayment/rvCardOptionsCtrl.js",
				roverRoot + "controllers/billFormat/rvBillFormatPopupController.js",
				servicesRoot + "group/**/*.js",
				servicesRoot + "reservation/rvReservationSummarySrv.js",
				servicesRoot + "reservation/RVReservationAddonsSrv.js",
				servicesRoot + "depositBalance/rvDepositBalanceSrv.js",
				servicesRoot + "bill/rvBillCardSrv.js",
				servicesRoot + "rvReservationSrv.js",
				servicesRoot + "payment/rvPaymentSrv.js",
				servicesRoot + "accounts/**/*.js",
				roverRoot + "services/reservation/rvReservationBaseSearchSrv.js",
				servicesRoot + "rvContactInfoSrv.js",
				servicesRoot + "actionTasks/rvActionTasksSrv.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return groupJsAssets;
	}
};
