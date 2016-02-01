
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/guestwebRoot");

     // checkout now states
    $stateProvider.state('guestwebRoot', {
        url: '/guestwebRoot/:mode/:reservationId',
        controller: 'homeController',
        resolve: {
            reservationAndhotelData: ['sntGuestWebSrv', '$stateParams', function(sntGuestWebSrv, $stateParams) {

                 var absUrl = window.location.href;
                 var apiUrl = "";
                 // if the guestweb is accessed normaly, ie invoked using
                 // the mail sent from the hotel admin
                 if(absUrl.indexOf("/guest_web/home/index?guest_web_token=") !== -1){
                      var offset= absUrl.indexOf("?");
                      var remainingURl  = absUrl.substring(offset,absUrl.length);
                      var startingUrl  = absUrl.substring(0,offset);
                      apiUrl = startingUrl+"_data"+remainingURl;

                 }
                 //invoked when forgot password or email verification is
                 //requested from the zest apps
                 else if(absUrl.indexOf("/guest_web/home/user_activation")!==-1){
                    var offset= absUrl.indexOf("?");
                    var remainingURl  = absUrl.substring(offset,absUrl.length);
                    var startingUrl  = absUrl.substring(0,offset);
                    apiUrl = startingUrl+".json"+remainingURl;
                 }
                 // direct URL checkin - accessing URLS set in hotel admin for checkin
                 else if(absUrl.indexOf("checkin") !== -1){
                    //to strip away state URLS
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0,absUrl.indexOf("#")) : absUrl;
                    var urlComponents     = absUrl.split('/');;
                    var application       = urlComponents[urlComponents.length-3];
                    var url_suffix        = urlComponents[urlComponents.length-1];
                    var hotel_identifier  = urlComponents[urlComponents.length-2];
                    apiUrl            = "/guest_web/home/checkin_verification_data?hotel_identifier="+hotel_identifier+"&application="+application+"&url_suffix="+url_suffix;
                 }
                // direct URL checkout - accessing URLS set in hotel admin for checkin
                 else{
                    //to strip away state URLS
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0,absUrl.indexOf("#")) : absUrl;
                    var urlComponents     = absUrl.split('/');;
                    var url_suffix        = urlComponents[urlComponents.length-1];
                    apiUrl                = "/guest_web/home/checkout_verification_data?hotel_identifier="+url_suffix;
                 }

            	
            	return sntGuestWebSrv.fetchHotelDetailsFromUrl(apiUrl);
            
   			 }]
		}
	});

    // External verification

    $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/partials/checkout/gwExternal.html',
	 	controller : 'gwExternalCheckoutVerificationCtrl',
	 	title: 'External Checkout verification'
	 });


 //    //room and cc verification 

	//  $stateProvider.state('checkoutRoomVerification', {
	//  	url: '/checkoutRoomVerification',
	//  	templateUrl: '/assets/common_templates/partials/checkout/gwRoomVerification.html',
	//  	controller : 'checkoutRoomVerificationViewController',
	//  	title: 'Room verification'
	//  }).state('ccVerification', {
	//  	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	//  	templateUrl: '/assets/common_templates/partials/checkout/gwCcEntry.html',
	//  	controller : 'ccVerificationViewController',
	//  	title: 'CC verification'
	//  });

 //    // checkout now states

	// $stateProvider.state('checkoutBalance', {
 //        url: '/checkoutBalance',
 //        controller: 'checkOutBalanceController',
 //       	templateUrl: '/assets/common_templates/partials/checkout/gwBill.html',
	//     title: 'Balance - Check-out Now'
 //    })
 //    .state('checkOutStatus', {
 //        url: '/checkOutStatus',
 //       	controller: 'checkOutStatusController',
 //       	templateUrl: '/assets/common_templates/partials/checkout/gwCheckoutfinal.html',
	// 	title: 'Status - Check-out Now'
 //    }).state('checkOutConfirmation', {
 //        url: '/checkOutConfirmation',
 //       	controller: 'checkOutConfirmationController',
 //       	templateUrl:  '/assets/common_templates/partials/checkout/gwCheckout.html',
	// 	title: 'Confirm - Check-out Now'
 //    });

 //    // late checkout states

 //    $stateProvider.state('checkOutOptions', {
 //    	url: '/checkOutOptions',
	//  	templateUrl: '/assets/common_templates/partials/checkout/gwCheckoutoptions.html',
	//  	controller: 'checkOutLandingController',
	//  	title: 'Check-out'
	//  }).state('checkOutLaterOptions', {
	//  	url: '/checkOutLaterOptions',
	// 	templateUrl: '/assets/common_templates/partials/checkout/gwLatecheckoutoptions.html',
	//  	controller: 'checkOutLaterController',
	// 	title: 'Check-out Later'
	// }).state('checkOutLaterSuccess', {
	// 	url: '/checkOutLaterOptions/:id',
	// 	templateUrl: '/assets/common_templates/partials/checkout/gwLateCheckoutfinal.html',
	// 	controller: 'checkOutLaterSuccessController',
	// 	title: 'Status - Check-out Later'
	//  });

	// // checkin states

	// $stateProvider.state('checkinConfirmation', {
	//  	url: '/checkinConfirmation',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwCheckin.html',
	//  	controller : 'checkInConfirmationViewController',
	//  	title: 'Check-in'
	//  }).state('checkinReservationDetails', {
	//  	url: '/checkinReservationDetails',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwCheckinDetails.html',
	//  	controller : 'checkInReservationDetails',
	//  	title: 'Details - Check-in'
	//  }).state('checkinUpgrade', {
	//  	url: '/checkinUpgrade',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwRoomUpgrades.html',
	//  	controller : 'checkinUpgradeRoomController',
	//     title: 'Upgrade - Check-in'
	//  }).state('checkinKeys', {
	//  	url: '/checkinKeys',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwCheckinFinal.html',
	//  	controller : 'checkInKeysController',
	//  	title: 'Keys - Check-in'
	//  }).state('checkinSuccess', {
	//  	url: '/checkinSuccess',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwAlreadyCheckedIn.html',
	//  	title: 'Status - Check-in'
	//  }).state('checkinArrival', {
	//  	url: '/checkinArrival',
	//  	controller:'checkinArrivalDetailsController',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwArrivalTime.html',
	//  	title: 'Arrival Details - Check-in'
	//  }).state('guestDetails', {
	//  	url: '/guestDetails',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwGuestDetail.html',
	//  	controller : 'guestDetailsController',
	//     title: 'Guest Details'
	//  })
	 

	// // pre checkin states

 //    $stateProvider.state('preCheckinStatus', {
	// 	url: '/preCheckinStatus',
	// 	templateUrl: '/assets/common_templates/partials/checkin/gwPreCheckinFinal.html',
	// 	controller : 'preCheckinStatusController',
	// 	title: 'Status - Pre Check-In'
	//  });

	// $stateProvider.state('earlyCheckinOptions', {
	//  	url: '/earlyCheckinOptions/:time/:charge/:id',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwEarlyCheckinOptions.html',
	//  	controller : 'earlyCheckinOptionsController',
	//  	title: 'Early Check-in'
	//  }).state('earlyCheckinFinal', {
	//  	url: '/earlyCheckinFinal/:time/:charge/:id',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwEarlyCheckinFinal.html',
	//  	controller : 'earlyCheckinFinalController',
	//  	title: 'Early Check-in'
	//  }).state('laterArrival', {
	//  	url: '/laterArrival/:time/:isearlycheckin',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwLateArrivalTime.html',
	//  	controller : 'checkinArrivalDetailsController',
	//     title: 'Early Check-in'
	//  });

	//  $stateProvider.state('noOptionAvailable', {
 //    	url: '/noOptionAvailable',
	//  	templateUrl: '/assets/partials/gwNoOption.html',
	//  	title: 'Feature not available'
	// });

}]);
