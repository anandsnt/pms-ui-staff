

sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/partials/fontainebleau/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/partials/fontainebleau/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/partials/fontainebleau/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/partials/fontainebleau/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/partials/fontainebleau/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/partials/fontainebleau/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });


	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/partials/fontainebleau/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/partials/fontainebleau/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });


    // pre checkin states

    $stateProvider.state('preCheckinTripDetails', {
    	url: '/tripDetails',
	 	templateUrl: '/assets/partials/fontainebleau/preCheckinTripDetails.html',
	 	controller : 'preCheckinTripDetailsController',
	 	title: 'Trip Details'
	 }).state('preCheckinStayDetails', {
	 	url: '/stayDetails',
		templateUrl: '/assets/partials/fontainebleau/preCheckinStayDetails.html',
		controller : 'preCheckinStayDetailsController',
		title: 'Stay Details'
	}).state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/partials/fontainebleau/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 }).state('preCheckinComleted', {
		url: '/preCheckinComleted',
		templateUrl: '/assets/partials/fontainebleau/preCheckinCompleted.html',
		title: 'Status - Pre Check-In'
	 });


	 $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/partials/fontainebleau/externalVerification.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 }).state('externalVerificationError', {
	 	url: '/verificationError',
	 	templateUrl: '/assets/partials/fontainebleau/externalVerificationError.html',
	 	controller:'verificationErrorController',
	 	title: 'External verification Error'
	 });

	 $stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/partials/fontainebleau/noOption.html',
	 	title: 'Feature not available'
	});



}]);
