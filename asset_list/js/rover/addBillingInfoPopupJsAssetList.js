module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardDetailsJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [			
				roverRoot + "controllers/bill/rvBillingInformationPopupCtrl.js",
				roverRoot + "controllers/bill/rvRouteDetailsCtrl.js",
				'rover/controllers/bill/rvRoutesAddPaymentCtrl.js',
				'rover/controllers/roverPayment/rvCardOptionsCtrl.js',
				'rover/controllers/rvSaveNewCardPromptCtrl.js',

				roverRoot + "services/bill/rvBillingInfoSrv.js",
				'rover/services/bill/rvBillCardSrv.js',
				'rover/services/rvReservationSrv.js',
				'rover/services/payment/rvPaymentSrv.js',
				'rover/services/payment/rvGuestPaymentSrv.js'
			]
		};
		return comapnycardDetailsJsAssets;
	}
};