

sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");


    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/Row_nyc/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/Row_nyc/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/Row_nyc/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/landing/Row_nyc/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/checkoutlater/partials/Row_nyc/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/Row_nyc/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/checkinSuccess.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/arrivalDetails.html',
	 	title: 'Arrival Details - Check-in'
	 });


	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/checkoutnow/partials/Row_nyc/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/checkoutnow/partials/Row_nyc/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });
	  // pre checkin states

    $stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/preCheckin/partials/Row_nyc/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });

    $stateProvider.state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/earlyCheckinOptions.html',
	 	controller : 'earlyCheckinOptionsController',
	 	title: 'Early Check-in'
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:time/:charge/:id',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/earlyCheckinFinal.html',
	 	controller : 'earlyCheckinFinalController',
	 	title: 'Early Check-in'
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/lateArrivalDetails.html',
	 	controller : 'checkinArrivalDetailsController',
	    title: 'Early Check-in'
	 }).state('depositPayment', {
	 	url: '/depositPayment',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/gwDepositPayment.html',
	 	controller : 'checkinDepositPaymentController',
	    title: 'Pay Deposit'
	 });

	 $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/checkoutnow/partials/Row_nyc/externalVerification.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 }).state('externalVerificationError', {
	 	url: '/verificationError',
	 	templateUrl: '/assets/checkoutnow/partials/Fontainebleau/externalVerificationError.html',
	 	controller:'verificationErrorController',
	 	title: 'External verification Error'
	 });

	
	 $stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/preCheckin/partials/noOption.html',
	 	title: 'Feature not available'
	});

 	$stateProvider.state('externalCheckinVerification', {
		url: '/externalCheckinVerification',
		templateUrl: '/assets/checkin/partials/Row_nyc/gwExternalCheckin.html',
		controller: 'externalCheckinVerificationViewController',
		title: 'External Check in verification'
	}).state('guestCheckinTurnedOff',{
	 	url: '/guestCheckinTurnedOff',
	 	templateUrl: '/assets/checkin/partials/Row_nyc/gwExternalCheckInTurnedOff.html',
	 	title: 'Check-in'
	 });

	 
}]);
