

sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/partials/palms/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/partials/palms/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/partials/palms/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/landing/Palms_spa/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/partials/palms/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/partials/palms/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/partials/palms/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/partials/palms/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });


    // pre checkin states

    $stateProvider.state('preCheckinTripDetails', {
    	url: '/tripDetails',
	 	templateUrl: '/assets/partials/palms/preCheckinTripDetails.html',
	 	controller : 'preCheckinTripDetailsController',
	 	title: 'Trip Details'
	 }).state('preCheckinStayDetails', {
	 	url: '/stayDetails',
		templateUrl: '/assets/partials/palms/preCheckinStayDetails.html',
		controller : 'preCheckinStayDetailsController',
		title: 'Stay Details'
	}).state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/partials/palms/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 }).state('preCheckinComleted', {
		url: '/preCheckinComleted',
		templateUrl: '/assets/partials/palms/preCheckinCompleted.html',
		title: 'Status - Pre Check-In'
	 });

	 $stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/partials/palms/noOption.html',
	 	title: 'Feature not available'
	});

}]);
