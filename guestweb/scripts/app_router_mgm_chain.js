
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // External verification

    $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/partials/mgm_chain/gwExternal.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 });


    //room and cc verification 

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/partials/mgm_chain/gwRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/partials/mgm_chain/gwCcEntry.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/partials/mgm_chain/gwBill.html',
	    title: 'Balance - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl:  '/assets/partials/mgm_chain/gwCheckout.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/partials/mgm_chain/gwCheckoutoptions.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/partials/mgm_chain/gwLatecheckoutoptions.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/partials/mgm_chain/gwLateCheckoutfinal.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/partials/mgm_chain/gwCheckin.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/partials/mgm_chain/gwCheckinDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/partials/mgm_chain/gwRoomUpgrades.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/partials/mgm_chain/gwCheckinFinal.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/partials/mgm_chain/gwAlreadyCheckedIn.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/partials/mgm_chain/gwArrivalTime.html',
	 	title: 'Arrival Details - Check-in'
	 }).state('guestDetails', {
	 	url: '/guestDetails',
	 	templateUrl: '/assets/partials/mgm_chain/gwGuestDetail.html',
	 	controller : 'guestDetailsController',
	    title: 'Guest Details'
	 });
	 // state('birthDateDetails', {
	 // 	url: '/birthDateDetails',
	 // 	templateUrl: '/assets/partials/mgm_chain/gwBirthDataDetails.html',
	 // 	controller : 'birthDateDetailsController',
	 //    title: 'Birthdate'
	 // }).state('promptGuestDetails', {
	 // 	url: '/promptGuestDetails',
	 // 	templateUrl: '/assets/partials/mgm_chain/gwPromptGuestDetails.html',
	 // 	controller : 'guestDetailsController',
	 //    title: 'Guest Details'
	 // }).state('guestNotEligible', {
	 // 	url: '/guestNotEligible',
	 // 	templateUrl: '/assets/partials/mgm_chain/gwGuestNotEligible.html',
	 //    title: 'Guest Details'
	 // });
	 

	// pre checkin states

    $stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/partials/mgm_chain/gwPreCheckinFinal.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });

	$stateProvider.state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/partials/mgm_chain/gwEarlyCheckinOptions.html',
	 	controller : 'earlyCheckinOptionsController',
	 	title: 'Early Check-in'
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:time/:charge/:id',
	 	templateUrl: '/assets/partials/mgm_chain/gwEarlyCheckinFinal.html',
	 	controller : 'earlyCheckinFinalController',
	 	title: 'Early Check-in'
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/partials/mgm_chain/gwLateArrivalTime.html',
	 	controller : 'checkinArrivalDetailsController',
	    title: 'Early Check-in'
	 });

	 $stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/partials/common_templates/gwNoOption.html',
	 	title: 'Feature not available'
	});

}]);
