module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
            sharedJs 		= 'shared/lib/js/',
			servicesRoot 	= 'rover/services/';
            
            return {  
                minifiedFiles: [                    
                ],
                nonMinifiedFiles: [
                    'rover/filters/rangeFilter.js',
                    controllerRoot + "guests/rvGuestCardDetailsCtrl.js",                    
                    controllerRoot + "rvContactInfoDatePickerCtrl.js",
                    controllerRoot + "rvAddLoyaltyProgramController.js",
                    controllerRoot + "rvGuestCardLoyaltyCtrl.js",                    
                    controllerRoot + "rvContactInfoController.js",
                    controllerRoot + "cards/**/*.js",
                    controllerRoot + "cardsOutside/**/**.js",
                    controllerRoot + "likes/**/**.js",
                    controllerRoot + "pay/**/**.js",
                    controllerRoot + "payment/**/**.js",                    
                    controllerRoot + "roverPayment/**/**.js",                   

                    
                    servicesRoot + "payment/**/**.js",
                    servicesRoot + "likes/rvLikesSrv.js",                    
                    servicesRoot + "rvContactInfoSrv.js",
                    servicesRoot + "rvGuestCardLoyaltySrv.js",                    
                    servicesRoot + "rvNewspaperPreferenceSrv.js",
                    servicesRoot + "rvLoyaltyProgramSrv.js",                    
                    servicesRoot + "guestcard/notes/rvGuestCardNotesSrv.js",
                    servicesRoot + "rvCCAuthorizationSrv.js",                    
                    servicesRoot + "rvCompanyCardSrv.js"
                ]
            };
	}
};