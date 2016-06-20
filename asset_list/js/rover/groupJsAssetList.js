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
				roverRoot + "controllers/billFormat/rvBillFormatPopupController.js",
				servicesRoot + "group/**/*.js",
				servicesRoot + "reservation/rvReservationSummarySrv.js",
				servicesRoot + "reservation/RVReservationAddonsSrv.js",
				servicesRoot + "depositBalance/rvDepositBalanceSrv.js",
				servicesRoot + "bill/rvBillCardSrv.js",
				servicesRoot + "rvReservationSrv.js",
				servicesRoot + "payment/rvPaymentSrv.js",
				servicesRoot + "accounts/**/*.js"
			]
		};
		return groupJsAssets;
	}
};