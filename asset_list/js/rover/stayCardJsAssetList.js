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
                    controllerRoot + "rvGuestController.js",
                    controllerRoot + "rvContactInfoDatePickerCtrl.js",
                    controllerRoot + "rvAddLoyaltyProgramController.js",
                    controllerRoot + "rvGuestCardLoyaltyCtrl.js",
                    controllerRoot + "rvReservationRoomStatusCtrl.js",
                    controllerRoot + "rvContactInfoController.js",			
                    controllerRoot + "reservation/**/**.js",
                    controllerRoot + "cards/**/*.js",
                    controllerRoot + "cardsOutside/**/**.js",
                    
                    controllerRoot + "depositBalance/**/**.js",
                    controllerRoot + "earlyCheckout/**/**.js",
                    controllerRoot + "keys/**/**.js",
                    controllerRoot + "likes/**/**.js",
                    controllerRoot + "pay/**/**.js",
                    controllerRoot + "payment/**/**.js",
 
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
                    servicesRoot + "packages/**/**.js",
                    servicesRoot + "rvReservationSrv.js",
                    servicesRoot + "rvContactInfoSrv.js",
                    servicesRoot + "rvGuestCardLoyaltySrv.js",
                    servicesRoot + "rvSaveWakeupTimeSrv.js",
                    servicesRoot + "rvNewspaperPreferenceSrv.js",
                    servicesRoot + "rvLoyaltyProgramSrv.js",
                    servicesRoot + "bill/rvBillCardSrv.js",
                    servicesRoot + "guestcard/notes/rvGuestCardNotesSrv.js"
                ]
            };
	}
};