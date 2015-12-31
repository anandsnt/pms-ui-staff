
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // checkout now states
    $stateProvider.state('guestwebRoot', {
        url: '/guestwebRoot',
        controller: 'homeController'
     //    resolve: {
     //        //to tackle from coming admin app to rover
     //        hotelData: [
     //            function() {
     //            	var deferred = $q.defer();
     //            		setTimeout(function(){
     //            			deferred.resolve({
					//   "is_external_verification": "true",
					//   "business_date": "2015-09-15",
					//   "currency_symbol": "€",
					//   "date_format": {
					//     "id": 1,
					//     "value": "DD-MM-YYYY"
					//   },
					//   "hotel_logo": "https://c9fb255204921bbf6f41-821329d308ba0768463def967ad6e6e5.ssl.cf2.rackcdn.com/THREE/GHLD/hotels/80/template_logos/original/template_logo20151124110214.png?1448384541",
					//   "mli_merchat_id": "TESTSTAYNTOUCH01",
					//   "room_verification_instruction": "If there are less than 4 digits, please add a 0 in front of the room number",
					//   "payment_gateway": "MLI",
					//   "hotel_identifier": "grand",
					//   "hotel_phone": "123-123-1234",
					//   "hotel_theme": "guestweb_camby"
					// });
     //            		}, 12);
                    
					// return deferred.promise;
     //            }
     //        ]
      //  }	
    });

	$stateProvider.state('guestwebRoot.checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('guestwebRoot.checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('guestwebRoot.checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('guestwebRoot.checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/landing/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('guestwebRoot.checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/checkoutlater/partials/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('guestwebRoot.checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('guestwebRoot.checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/checkin/partials/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('guestwebRoot.checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/checkin/partials/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('guestwebRoot.checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/checkin/partials/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('guestwebRoot.checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/checkin/partials/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('guestwebRoot.checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/checkin/partials/checkinSuccess.html',
	 	title: 'Status - Check-in'
	 }).state('guestwebRoot.checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/checkin/partials/arrivalDetails.html',
	 	title: 'Arrival Details - Check-in'
	 });


	 //room verification

	 $stateProvider.state('guestwebRoot.checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/checkoutnow/partials/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('guestwebRoot.ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/checkoutnow/partials/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

	// pre checkin states

    $stateProvider.state('guestwebRoot.preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/preCheckin/partials/CARLYLE/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });

	// zest web states

    $stateProvider.state('guestwebRoot.resetPassword', {
    	url: '/resetPassword',
	 	templateUrl: '/assets/zest/partials/resetPassword.html',
	 	controller : 'resetPasswordController',
	 	title: 'Reset Password'
	});

	$stateProvider.state('guestwebRoot.emailVerification', {
    	url: '/emailVerification',
	 	templateUrl: '/assets/zest/partials/emailVerificationStatus.html',
	 	controller : 'emailVerificationStatusController',
	 	title: 'Email Verification'
	});


	$stateProvider.state('guestwebRoot.noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/preCheckin/partials/noOption.html',
	 	title: 'Feature not available'
	});

}]);
