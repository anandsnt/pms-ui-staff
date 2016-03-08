module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		    comapnycardDetailsJsAssets = {
                minifiedFiles: [],
                nonMinifiedFiles: [			
                    controllerRoot + "bill/**/*.js",
                    controllerRoot + 'roverPayment/rvCardOptionsCtrl.js',
                    controllerRoot + 'rvSaveNewCardPromptCtrl.js',
                    
                    servicesRoot + "bill/**/*.js",
                    servicesRoot + 'rvReservationSrv.js',
                    servicesRoot + 'rvCompanyCardSearchSrv.js',
                    servicesRoot + 'payment/rvPaymentSrv.js',
                    servicesRoot + 'payment/rvGuestPaymentSrv.js'
                ]
		};
		return comapnycardDetailsJsAssets;
	}
};