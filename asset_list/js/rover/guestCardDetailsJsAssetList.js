module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',            
			servicesRoot 	= 'rover/services/';
            
            return {  
                minifiedFiles: [                    
                ],
                nonMinifiedFiles: [                    
                    controllerRoot + "guests/rvGuestCardDetailsCtrl.js",                    
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
                    
                    servicesRoot + "payment/**/**.js",
                    servicesRoot + "likes/rvLikesSrv.js",                    
                    servicesRoot + "rvContactInfoSrv.js",
                    servicesRoot + "rvGuestCardLoyaltySrv.js",                                        
                    servicesRoot + "rvLoyaltyProgramSrv.js",                    
                    servicesRoot + "guestcard/notes/rvGuestCardNotesSrv.js",
                    servicesRoot + "rvCCAuthorizationSrv.js",                    
                    servicesRoot + "rvCompanyCardSrv.js",

                    // Eliminate all spec files
                    '!**/*.spec.js'
                ]
            };
	}
};
