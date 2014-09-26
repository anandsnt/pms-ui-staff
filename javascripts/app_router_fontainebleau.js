

snt.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
    $urlRouterProvider.otherwise("/checkoutRoomVerification");

    // checkout now states
    
	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/Fontainebleau/checkoutBalance.html',
	    title: 'Balance - Checkout Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/Fontainebleau/checkOutStatus.html',
		title: 'Status - Checkout Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/Fontainebleau/checkoutConfirmation.html',
		title: 'Confirm - Checkout Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/landing/Fontainebleau/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Checkout'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/checkoutlater/partials/Fontainebleau/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Checkout Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/Fontainebleau/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Checkout Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/checkin/partials/Fontainebleau/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check In'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/checkin/partials/Fontainebleau/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check In'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/checkin/partials/Fontainebleau/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check In'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/checkin/partials/Fontainebleau/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check In'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/checkin/partials/Fontainebleau/checkinSuccess.html',
	 	title: 'Status - Check In'
	 });


	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/checkoutnow/partials/Yotel/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/checkoutnow/partials/Yotel/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

}]);
