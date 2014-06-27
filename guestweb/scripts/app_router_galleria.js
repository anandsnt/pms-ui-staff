

snt.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
    $urlRouterProvider.otherwise("/checkoutRoomVerification");

    // checkout now states
    
	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/Galleria/checkoutBalance.html',
	    title: 'Balance - Checkout Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/Galleria/checkOutStatus.html',
		title: 'Status - Checkout Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/Galleria/checkoutConfirmation.html',
		title: 'Confirm - Checkout Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/landing/Galleria/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Checkout'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/checkoutlater/partials/Galleria/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Checkout Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/Galleria/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Checkout Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/checkin/partials/Galleria/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check In'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/checkin/partials/Galleria/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check In'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/checkin/partials/Galleria/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check In'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/checkin/partials/Galleria/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check In'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/checkin/partials/Galleria/checkinSuccess.html',
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
