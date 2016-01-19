
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");
    // External verification

    $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/partials/mgm_aria/externalVerification.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 });

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/partials/mgm_aria/checkoutBalance.html',
	    title: 'Balance - Check-out Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/partials/mgm_aria/checkOutStatus.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/partials/mgm_aria/checkoutConfirmation.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/partials/mgm_aria/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/partials/mgm_aria/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/partials/mgm_aria/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/partials/mgm_aria/checkInConfirmation.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/partials/mgm_aria/checkInReservationDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/partials/mgm_aria/checkinUpgradeRoom.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/partials/mgm_aria/checkInKeys.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/checkin/partials/checkinSuccess.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/partials/mgm_aria/arrivalDetails.html',
	 	title: 'Arrival Details - Check-in'
	 }).state('guestDetails', {
	 	url: '/guestDetails',
	 	templateUrl: '/assets/partials/mgm_aria/guestDetails.html',
	 	controller : 'guestDetailsController',
	    title: 'Guest Details'
	 }).state('birthDateDetails', {
	 	url: '/birthDateDetails',
	 	templateUrl: '/assets/partials/mgm_aria/birthDataDetails.html',
	 	controller : 'birthDateDetailsController',
	    title: 'Birthdate'
	 }).state('promptGuestDetails', {
	 	url: '/promptGuestDetails',
	 	templateUrl: '/assets/partials/mgm_aria/promptGuestDetails.html',
	 	controller : 'guestDetailsController',
	    title: 'Guest Details'
	 }).state('guestNotEligible', {
	 	url: '/guestNotEligible',
	 	templateUrl: '/assets/partials/mgm_aria/guestNotEligible.html',
	    title: 'Guest Details'
	 });
	 //room verification

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/partials/mgm_aria/checkoutRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/partials/mgm_aria/ccVerification.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

	// pre checkin states

    $stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/partials/mgm_aria/preCheckinStatus.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });

	$stateProvider.state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/partials/mgm_aria/earlyCheckinOptions.html',
	 	controller : 'earlyCheckinOptionsController',
	 	title: 'Early Check-in'
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:time/:charge/:id',
	 	templateUrl: '/assets/partials/mgm_aria/earlyCheckinFinal.html',
	 	controller : 'earlyCheckinFinalController',
	 	title: 'Early Check-in'
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/partials/mgm_aria/lateArrivalDetails.html',
	 	controller : 'checkinArrivalDetailsController',
	    title: 'Early Check-in'
	 });



	$stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/partials/mgm_aria/noOption.html',
	 	title: 'Feature not available'
	});


	$stateProvider.state('externalCheckinVerification', {
	 	url: '/externalCheckinVerification',
	 	templateUrl: '/assets/partials/mgm_aria/externalCheckinLanding.html',
	 	controller : 'externalCheckinVerificationViewController',
	 	title: 'External verification'
	 }).state('guestCheckinTurnedOff', {
	 	url: '/guestCheckinTurnedOff',
	 	templateUrl: '/assets/partials/mgm_aria/guestCheckinTurnedOff.html',
	    title: 'Check-in'
	 }).state('guestCheckinEarly', {
	 	url: '/guestCheckinEarly/:date',
	 	templateUrl: '/assets/partials/mgm_aria/earlyToCheckin.html',
	 	controller : 'earlyToCheckinCtrl',
	    title: 'Check-in'
	 }).state('guestCheckinLate', {
	 	url: '/guestCheckinLate',
	 	templateUrl: '/assets/partials/mgm_aria/lateToCheckin.html',
	    title: 'Check-in'
	 });

	 $stateProvider.state('checkinCcVerification', {
	 	url: '/checkinCcVerification',
	 	templateUrl: '/assets/partials/mgm_aria/checkinCCAddition.html',
	 	controller : 'checkinCcVerificationController',
	 	title: 'CC verification'
	 }).state('emailAddition', {
	 	url: '/emailAddition',
	 	templateUrl: '/assets/partials/mgm_aria/emailEntryPage.html',
	 	controller : 'emailEntryController',
	 	title: 'E-mail entry'
	 });
	
	


}]);
