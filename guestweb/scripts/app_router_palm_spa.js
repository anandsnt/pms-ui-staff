

snt.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
    $urlRouterProvider.otherwise("/checkoutRoomVerification");

    // checkout now states
    
	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/Palms_spa/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/Palms_spa/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/Palms_spa/checkoutConfirmation.html',
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
		templateUrl: '/assets/checkoutlater/partials/Palms_spa/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/Palms_spa/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/preCheckin/partials/noOption.html',
	 	title: 'Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/preCheckin/partials/noOption.html',
	 	title: 'Check-in'
	 });
	 
	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/checkoutnow/partials/Palms_spa/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/checkoutnow/partials/Palms_spa/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });


    // pre checkin states

    $stateProvider.state('preCheckinTripDetails', {
    	url: '/tripDetails',
	 	templateUrl: '/assets/preCheckin/partials/preCheckinTripDetails.html',
	 	controller : 'preCheckinTripDetailsController',
	 	title: 'Trip Details'
	 }).state('preCheckinStayDetails', {
	 	url: '/stayDetails',
		templateUrl: '/assets/preCheckin/partials/preCheckinStayDetails.html',
		controller : 'preCheckinStayDetailsController',
		title: 'Stay Details'
	}).state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/preCheckin/partials/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 }).state('preCheckinComleted', {
		url: '/preCheckinComleted',
		templateUrl: '/assets/preCheckin/partials/preCheckinCompleted.html',
		title: 'Status - Pre Check-In'
	 });

	 $stateProvider.state('externalVerification', {
    	url: '/externalVerification',
	 	templateUrl: '/assets/preCheckin/partials/noOption.html',
	 	title: 'External verification'
	 });


}]);
