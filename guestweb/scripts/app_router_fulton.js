

snt.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/checkoutRoomVerification");

 //    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/Fulton/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/Fulton/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/Fulton/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/landing/Fulton/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/checkoutlater/partials/Fulton/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/Fulton/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/checkin/partials/Fulton/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/checkin/partials/Fulton/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/checkin/partials/Fulton/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/checkin/partials/Fulton/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Status - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/checkin/partials/Fulton/checkinSuccess.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/checkin/partials/Fulton/arrivalDetails.html',
	 	title: 'Arrival Details - Check-in'
	 });



	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/checkoutnow/partials/Fulton/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/checkoutnow/partials/Fulton/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });
	  // pre checkin states

    $stateProvider.state('preCheckinTripDetails', {
    	url: '/tripDetails',
	 	templateUrl: '/assets/preCheckin/partials/Fulton/noOption.html',
	 	title: 'Pre Check-in'
	}).state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/preCheckin/partials/Fulton/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });

	$stateProvider.state('externalVerification', {
    	url: '/externalVerification',
	 	templateUrl: '/assets/preCheckin/partials/noOption.html',
	 	title: 'External verification'
	});

}]);
