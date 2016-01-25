module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardDetailsJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [			
				roverRoot + "controllers/companycard/details/**/*.js",
				roverRoot + "controllers/bill/rvBillingInformationPopupCtrl.js",
				roverRoot + "controllers/bill/rvRouteDetailsCtrl.js",
				roverRoot + "controllers/cardsOutside/rvCompanyCardArTransactionsCtrl.js",
				roverRoot + "services/rvCompanyCardSrv.js",
				roverRoot + "services/bill/rvBillingInfoSrv.js",
				'rover/services/bill/rvBillCardSrv.js',
				'rover/controllers/bill/rvRoutesAddPaymentCtrl.js',
				'rover/controllers/roverPayment/rvCardOptionsCtrl.js',
				'rover/services/rvReservationSrv.js',
				'rover/services/payment/rvPaymentSrv.js',
				'rover/services/payment/rvGuestPaymentSrv.js',

 				'rover/directives/delayTextbox/rvDelayTextBox.js',
				'rover/directives/Autogrowing text field/autoGrowFieldDirective.js',

				'rover/directives/checkBox/**/*.js',
				'rover/directives/clearTextbox/**/*.js',

				'rover/directives/fileRead/**/*.js',
				'rover/directives/Outside Click handler/**/*.js',
				'rover/directives/autocomplete/*.js',
				'rover/directives/rateAutoComplete/*.js',
				'rover/directives/selectBox/*.js',
				'rover/directives/setTextboxValue/*.js',
				'rover/directives/textArea/*.js',
				'rover/directives/textBox/*.js',
				'rover/directives/toggle/*.js',
			]
		};
		return comapnycardDetailsJsAssets;
	}
};