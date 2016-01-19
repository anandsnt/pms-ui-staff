

sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/partials/eden/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/partials/eden/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/partials/eden/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/partials/eden/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/partials/eden/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/partials/eden/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/partials/eden/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/partials/eden/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/partials/eden/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/partials/eden/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/partials/eden/checkinSuccess.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/partials/eden/arrivalDetails.html',
	 	title: 'Arrival Details - Check-in'
	 });


	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/partials/eden/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/partials/eden/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

	// pre checkin states

    $stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/partials/eden/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });


    $stateProvider.state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/partials/eden/earlyCheckinOptions.html',
	 	controller : 'earlyCheckinOptionsController',
	 	title: 'Early Check-in'
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:time/:charge/:id',
	 	templateUrl: '/assets/partials/eden/earlyCheckinFinal.html',
	 	controller : 'earlyCheckinFinalController',
	 	title: 'Early Check-in'
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/partials/eden/lateArrivalDetails.html',
	 	controller : 'checkinArrivalDetailsController',
	    title: 'Early Check-in'
	 });

	 $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/partials/eden/externalVerification.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 }).state('externalVerificationError', {
	 	url: '/verificationError',
	 	templateUrl: '/assets/partials/eden/externalVerificationError.html',
	 	controller:'verificationErrorController',
	 	title: 'External verification Error'
	 });




	$stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/partials/eden/noOption.html',
	 	title: 'Feature not available'
	});

}]);