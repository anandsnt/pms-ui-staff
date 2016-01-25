module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
            sharedJs 		= 'shared/lib/js/',
			servicesRoot 	= 'rover/services/',
            allotmentJsAssets = {
                minifiedFiles: [
                      sharedJs + 'fullcalender/**/*.js' // FOR ROOM & RATES CALENDAR
                ],
                nonMinifiedFiles: [
                    'rover/filters/rangeFilter.js',
                    'rover/directives/delayTextbox/rvDelayTextBox.js',
                    'rover/directives/Autogrowing text field/autoGrowFieldDirective.js',
                    'rover/directives/checkBox/**/*.js',
                    'rover/directives/clearTextbox/**/*.js',

                    'rover/directives/fileRead/**/*.js',
                    'rover/directives/Outside Click handler/**/*.js',
                    'rover/directives/rateAutoComplete/*.js',
                    'rover/directives/selectBox/*.js',
                    'rover/directives/setTextboxValue/*.js',
                    'rover/directives/textArea/*.js',
                    'rover/directives/textBox/*.js',
                    'rover/directives/toggle/*.js',
                    'rover/directives/overbookingAlert/rvOverbookingCalendar.js', 
                    'rover/directives/fullCalendar/twoMonthCalendar.js', // FOR ROOM & RATES CALENDAR
                    'shared/directives/tooltip/qtipfc.js', // FOR ROOM & RATES CALENDAR
                    
                    sharedJs + 'jquery.qtip.min.js', // FOR ROOM & RATES CALENDAR
                    
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
                    servicesRoot + "bill/rvBillCardSrv.js"
                ]
            };
            return allotmentJsAssets;
	}
};