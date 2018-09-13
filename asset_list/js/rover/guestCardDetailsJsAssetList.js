module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',            
			servicesRoot 	= 'rover/services/';
            
            return {  
                minifiedFiles: [                    
                ],
                nonMinifiedFiles: [                    
                    controllerRoot + "guests/rvGuestCardDetailsCtrl.js",
                    controllerRoot + "guests/rvGuestCardActivityLogCtrl.js",                    
                    controllerRoot + "rvContactInfoDatePickerCtrl.js",
                    controllerRoot + "rvAddLoyaltyProgramController.js",
                    controllerRoot + "rvGuestCardLoyaltyCtrl.js",                    
                    controllerRoot + "rvContactInfoController.js",
                    controllerRoot + "cards/**/*.js",                    
                    controllerRoot + "likes/**/**.js",
                    controllerRoot + "pay/**/**.js",
                    controllerRoot + "payment/**/**.js",                    
                    controllerRoot + "roverPayment/**/**.js", 
                    controllerRoot + "guestCardBaseCtrl.js",
                    controllerRoot + 'guests/rvGuestCardStatisticsCtrl.js',
                    
                    servicesRoot + "payment/**/**.js",
                    servicesRoot + "likes/rvLikesSrv.js",                    
                    servicesRoot + "rvContactInfoSrv.js",
                    servicesRoot + "rvGuestCardLoyaltySrv.js",                                        
                    servicesRoot + "rvLoyaltyProgramSrv.js",                    
                    servicesRoot + "guestcard/notes/rvGuestCardNotesSrv.js",
                    servicesRoot + "rvCCAuthorizationSrv.js",                    
                    servicesRoot + "rvCompanyCardSrv.js",
                    servicesRoot + "guestcard/rvGuestCardSrv.js",

                    // Eliminate all spec files
                    '!**/*.spec.js'
                ]
            };
	}
};
