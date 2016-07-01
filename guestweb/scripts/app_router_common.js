
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // External verification

    $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/common_templates/partials/checkout/gwExternal.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 });


    //room and cc verification 

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/common_templates/partials/checkout/gwRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/common_templates/partials/checkout/gwCcEntry.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/common_templates/partials/checkout/gwBill.html',
	    title: 'Balance - Check-out Now'
    }).state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/common_templates/partials/checkout/gwCheckoutfinal.html',
		title: 'Status - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl:  '/assets/common_templates/partials/checkout/gwCheckout.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/common_templates/partials/checkout/gwCheckoutoptions.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/common_templates/partials/checkout/gwLatecheckoutoptions.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/common_templates/partials/checkout/gwLateCheckoutfinal.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwCheckin.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwCheckinDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwRoomUpgrades.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwCheckinFinal.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwAlreadyCheckedIn.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwArrivalTime.html',
	 	title: 'Arrival Details - Check-in'
	 }).state('guestDetails', {
	 	url: '/guestDetails',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwGuestDetail.html',
	 	controller : 'guestDetailsController',
	    title: 'Guest Details'
	 })
	 

	// pre checkin states

    $stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/common_templates/partials/checkin/gwPreCheckinFinal.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 }).state('checkinCcVerification', {
		url: '/checkinCcVerification',
		templateUrl: '/assets/common_templates/partials/checkin/gwCheckinCCAddition.html',
		controller: 'checkinCcVerificationController',
		title: 'CC verification'
	});

	$stateProvider.state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwEarlyCheckinOptions.html',
	 	controller : 'earlyCheckinOptionsController',
	 	title: 'Early Check-in'
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:time/:charge/:id',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwEarlyCheckinFinal.html',
	 	controller : 'earlyCheckinFinalController',
	 	title: 'Early Check-in'
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwLateArrivalTime.html',
	 	controller : 'checkinArrivalDetailsController',
	    title: 'Early Check-in'
	 }).state('depositPayment', {
	 	url: '/depositPayment',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwDepositPayment.html',
	 	controller : 'checkinDepositPaymentController',
	    title: 'Pay Deposit'
	 });

	 $stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/common_templates/partials/gwNoOption.html',
	 	title: 'Feature not available'
	});

	$stateProvider.state('externalCheckinVerification', {
		url: '/externalCheckinVerification',
		templateUrl: '/assets/common_templates/partials/checkin/gwExternalCheckin.html',
		controller: 'externalCheckinVerificationViewController',
		title: 'External Check in verification'
	}).state('guestCheckinTurnedOff',{
	 	url: '/guestCheckinTurnedOff',
	 	templateUrl: '/assets/common_templates/partials/checkin/gwExternalCheckInTurnedOff.html',
	 	title: 'Check-in'
	 }).state('guestCheckinEarly', {
		url: '/guestCheckinEarly/:date',
		templateUrl: '/assets/common_templates/partials/checkin/gwEarlyToCheckin.html',
		controller: 'earlyToCheckinCtrl',
		title: 'Check-in'
	}).state('guestCheckinLate', {
		url: '/guestCheckinLate',
		templateUrl: '/assets/common_templates/partials/checkin/gwLateToCheckin.html',
		title: 'Check-in'
	});

	$stateProvider.state('selectNoOfkeys',{
		url:'/selectNoOfkeys',
		templateUrl: '/assets/common_templates/partials/checkin/gwNoOfKeysEntry.html',
		controller: 'selectNoOfkeysController',
		title: 'Select No of Keys'
	})
}]);
