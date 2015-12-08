module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/';
		allotmentJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [
				'rover/filters/rangeFilter.js',
				'rover/directives/delayTextbox/rvDelayTextBox.js',
				controllerRoot + "rvGuestController.js",				
				controllerRoot + "reservation/**/**.js",
				controllerRoot + "cards/**/*.js",
				controllerRoot + "cardsOutside/**/**.js",
				controllerRoot + "changeStayDates/**/**.js",
				controllerRoot + "companycard/details/**/**.js",
				controllerRoot + "depositBalance/**/**.js",
				controllerRoot + "earlyCheckout/**/**.js",
				controllerRoot + "keys/**/**.js",
				controllerRoot + "likes/**/**.js",
				controllerRoot + "pay/**/**.js",
				controllerRoot + "payment/**/**.js",
				controllerRoot + "allotments/**/**.js",
				controllerRoot + "groups/**/**.js",
				controllerRoot + "reservationCard/**/**.js",
				controllerRoot + "roverPayment/**/**.js",
				controllerRoot + "smartbands/**/**.js",
				servicesRoot + "reservation/**/**.js",
				servicesRoot + "smartBands/**/**.js",
				servicesRoot + "keys/**/**.js",
				servicesRoot + "payment/**/**.js",
				servicesRoot + "allotments/**/**.js",
				servicesRoot + "group/**/**.js",
				servicesRoot + "accounts/**/**.js",
				servicesRoot + "packages/**/**.js",
				servicesRoot + "rvCompanyCardSearchSrv.js",
				servicesRoot + "rvCompanyCardSrv.js",
				servicesRoot + "rvReservationSrv.js",
				servicesRoot + "rvContactInfoSrv.js",
				servicesRoot + "rvGuestCardLoyaltySrv.js",
			]
		};
		return allotmentJsAssets;
	}
};