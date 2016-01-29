module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
            sharedJs 		= 'shared/lib/js/',
			servicesRoot 	= 'rover/services/';
            
            return {
                minifiedFiles: [
                    sharedJs + 'jquery.qtip.min.js' // FOR ROOM & RATES CALENDAR  
                ],
                nonMinifiedFiles: [
                    'rover/filters/rangeFilter.js',
                    
                    sharedJs + 'fullcalender/**/*.js', // FOR ROOM & RATES CALENDAR
                    
                    controllerRoot + "rvGuestController.js",
                    controllerRoot + "rvContactInfoDatePickerCtrl.js",
                    controllerRoot + "rvAddLoyaltyProgramController.js",
                    controllerRoot + "rvGuestCardLoyaltyCtrl.js",
                    controllerRoot + "rvReservationRoomStatusCtrl.js",
                    controllerRoot + "rvContactInfoController.js",			
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
                    controllerRoot + "packages/rvReservationPackageController.js",
                    controllerRoot + "roverPayment/**/**.js",
                    controllerRoot + "smartbands/**/**.js",
                    controllerRoot + "validateCheckout/**/**.js",
                    controllerRoot + "validateCheckin/**/**.js",
                    servicesRoot + "validateCheckin/**/**.js",
                    servicesRoot + "housekeeping/rvHkRoomDetailsSrv.js",
                    servicesRoot + "actionTasks/rvActionTasksSrv.js",
                    servicesRoot + "depositBalance/rvDepositBalanceSrv.js",
                    servicesRoot + "reservation/**/**.js",
                    servicesRoot + "smartBands/**/**.js",
                    servicesRoot + "keys/**/**.js",
                    servicesRoot + "payment/**/**.js",
                    servicesRoot + "likes/rvLikesSrv.js",
                    servicesRoot + "allotments/**/**.js",
                    servicesRoot + "group/**/**.js",
                    servicesRoot + "accounts/**/**.js",
                    servicesRoot + "packages/**/**.js",
                    servicesRoot + "rvCompanyCardSearchSrv.js",
                    servicesRoot + "rvCompanyCardSrv.js",
                    servicesRoot + "rvReservationSrv.js",
                    servicesRoot + "rvContactInfoSrv.js",
                    servicesRoot + "rvGuestCardLoyaltySrv.js",
                    servicesRoot + "rvSaveWakeupTimeSrv.js",
                    servicesRoot + "rvNewspaperPreferenceSrv.js",
                    servicesRoot + "rvLoyaltyProgramSrv.js",
                    servicesRoot + "bill/rvBillCardSrv.js",
                    
                   'rover/directives/autocomplete/rvAutoCompleteDirective.js'
                ]
            };
	}
};