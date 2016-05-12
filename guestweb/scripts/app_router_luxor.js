
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // External verification

    $stateProvider.state('externalVerification', {
	 	url: '/externalVerification',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwExternal.html',
	 	controller : 'externalVerificationViewController',
	 	title: 'External verification'
	 });


    //room and cc verification 

	 $stateProvider.state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwRoomVerification.html',
	 	controller : 'checkoutRoomVerificationViewController',
	 	title: 'Room verification'
	 }).state('ccVerification', {
	 	url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwCcEntry.html',
	 	controller : 'ccVerificationViewController',
	 	title: 'CC verification'
	 });

    // checkout now states

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/common_templates/partials/MGM/gwBill.html',
	    title: 'Balance - Check-out Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl:  '/assets/common_templates/partials/MGM/gwCheckout.html',
		title: 'Confirm - Check-out Now'
    });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
    	url: '/checkOutOptions',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwCheckoutoptions.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Check-out'
	 }).state('checkOutLaterOptions', {
	 	url: '/checkOutLaterOptions',
		templateUrl: '/assets/common_templates/partials/MGM/gwLatecheckoutoptions.html',
	 	controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/common_templates/partials/MGM/Luxor/gwLateCheckoutfinal.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });

	// checkin states

	$stateProvider.state('checkinConfirmation', {
	 	url: '/checkinConfirmation',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwCheckin.html',
	 	controller : 'checkInConfirmationViewController',
	 	title: 'Check-in'
	 }).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwCheckinDetails.html',
	 	controller : 'checkInReservationDetails',
	 	title: 'Details - Check-in'
	 }).state('checkinUpgrade', {
	 	url: '/checkinUpgrade',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwRoomUpgrades.html',
	 	controller : 'checkinUpgradeRoomController',
	    title: 'Upgrade - Check-in'
	 }).state('checkinKeys', {
	 	url: '/checkinKeys',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwCheckinFinal.html',
	 	controller : 'checkInKeysController',
	 	title: 'Keys - Check-in'
	 }).state('checkinSuccess', {
	 	url: '/checkinSuccess',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwAlreadyCheckedIn.html',
	 	title: 'Status - Check-in'
	 }).state('checkinArrival', {
	 	url: '/checkinArrival',
	 	controller:'checkinArrivalDetailsController',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwArrivalTime.html',
	 	title: 'Arrival Details - Check-in'
	 }).state('guestDetails', {
	 	url: '/guestDetails',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwGuestDetail.html',
	 	controller : 'guestDetailsController',
	    title: 'Guest Details'
	 });
	 // state('birthDateDetails', {
	 // 	url: '/birthDateDetails',
	 // 	templateUrl: '/assets/common_templates/partials/MGM/gwBirthDataDetails.html',
	 // 	controller : 'birthDateDetailsController',
	 //    title: 'Birthdate'
	 // }).state('promptGuestDetails', {
	 // 	url: '/promptGuestDetails',
	 // 	templateUrl: '/assets/common_templates/partials/MGM/gwPromptGuestDetails.html',
	 // 	controller : 'guestDetailsController',
	 //    title: 'Guest Details'
	 // }).state('guestNotEligible', {
	 // 	url: '/guestNotEligible',
	 // 	templateUrl: '/assets/common_templates/partials/MGM/gwGuestNotEligible.html',
	 //    title: 'Guest Details'
	 // });
	 

	// pre checkin states

    $stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/common_templates/partials/MGM/gwPreCheckinFinal.html',
		controller : 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	 });

	$stateProvider.state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwEarlyCheckinOptions.html',
	 	controller : 'earlyCheckinOptionsController',
	 	title: 'Early Check-in'
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:time/:charge/:id',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwEarlyCheckinFinal.html',
	 	controller : 'earlyCheckinFinalController',
	 	title: 'Early Check-in'
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwLateArrivalTime.html',
	 	controller : 'checkinArrivalDetailsController',
	    title: 'Early Check-in'
	 });

	 $stateProvider.state('noOptionAvailable', {
    	url: '/noOptionAvailable',
	 	templateUrl: '/assets/common_templates/partials/gwNoOption.html',
	 	title: 'Feature not available'
	});
	 $stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/common_templates/partials/MGM/Luxor/gwCheckoutfinal.html',
		title: 'Status - Check-out Now'
   	 });

   	$stateProvider.state('externalCheckinVerification', {
		url: '/externalCheckinVerification',
		templateUrl: '/assets/common_templates/partials/MGM/gwExternalCheckin.html',
		controller: 'externalCheckinVerificationViewController',
		title: 'External Check in verification'
	}).state('guestCheckinTurnedOff',{
	 	url: '/guestCheckinTurnedOff',
	 	templateUrl: '/assets/common_templates/partials/MGM/gwExternalCheckInTurnedOff.html',
	 	title: 'Check-in'
	 }).state('guestCheckinEarly', {
		url: '/guestCheckinEarly/:date',
		templateUrl: '/assets/common_templates/partials/MGM/gwEarlyToCheckin.html',
		controller: 'earlyToCheckinCtrl',
		title: 'Check-in'
	}).state('guestCheckinLate', {
		url: '/guestCheckinLate',
		templateUrl: '/assets/common_templates/partials/MGM/gwLateToCheckin.html',
		title: 'Check-in'
	}).state('birthDateDetails', {
		url: '/birthDateDetails',
		templateUrl: '/assets/common_templates/partials/MGM/gwBirthDataDetails.html',
		controller: 'birthDateDetailsController',
		title: 'Birthdate'
	}).state('promptGuestDetails', {
		url: '/promptGuestDetails',
		templateUrl: '/assets/common_templates/partials/MGM/gwPromptGuestDetails.html',
		controller: 'guestDetailsController',
		title: 'Guest Details'
	}).state('guestNotEligible', {
		url: '/guestNotEligible',
		templateUrl: '/assets/common_templates/partials/MGM/gwGuestNotEligible.html',
		title: 'Guest Details'
	});


	$stateProvider.state('checkinCcVerification', {
		url: '/checkinCcVerification',
		templateUrl: '/assets/common_templates/partials/MGM/gwCheckinCCAddition.html',
		controller: 'checkinCcVerificationController',
		title: 'CC verification'
	}).state('emailAddition', {
		url: '/emailAddition/:isFrom',
		templateUrl: '/assets/common_templates/partials/MGM/gwEmailEntry.html',
		controller: 'emailEntryController',
		title: 'E-mail entry'
	}).state('mobileNumberAddition', {
		url: '/mobileNumberAddition',
		templateUrl: '/assets/common_templates/partials/MGM/gwPhoneNumberUpdate.html',
		controller: 'mobileEntryController',
		title: 'Phone number entry'
	}).state('mobileNumberOptions', {
		url: '/mobileNumberOptions',
		templateUrl: '/assets/common_templates/partials/MGM/gwMobielNUmberOptions.html',
		controller: 'mobileOptionsController',
		title: 'Phone number entry'
	});

	//checkin now states
	$stateProvider.state('guestCheckinOptions', {
		url: '/guestCheckinOptions',
		templateUrl: '/assets/common_templates/partials/MGM/gwCheckinOptions.html',
		controller: 'checkinOptionsController',
		title: 'Checkin options'
	}).state('earlyCheckinReady', {
		url: '/earlyCheckinReady',
		controller:'earlyCheckinReadyController',
		templateUrl: '/assets/common_templates/partials/MGM/gwEarlyCheckinReady.html',
		title: 'Early Check in ready'
	}).state('roomNotReady', {
		url: '/roomNotReady',
		templateUrl: '/assets/common_templates/partials/MGM/gwCheckinNowCommon.html',
		controller: 'roomNotReadyController',
		title: 'Room unavailable'
	}).state('roomAssignFailed', {
		url: '/roomAssignFailed',
		templateUrl: '/assets/common_templates/partials/MGM/gwCheckinNowCommon.html',
		controller: 'roomAssignFailedController',
		title: 'Room Assign Failed'
	}).state('eciOffroomAssignFailed', {
		url: '/eciOffroomAssignFailed',
		templateUrl: '/assets/common_templates/partials/MGM/gwCheckinNowCommon.html',
		controller: 'eciOffRoomAssignmentFailedController',
		title: 'Room Assign Failed'
	}).state('eciOffRoomNotReady', {
		url: '/eciOffRoomNotReady',
		templateUrl: '/assets/common_templates/partials/MGM/gwCheckinNowCommon.html',
		controller: 'eciOffRoomNotReadyController',
		title: 'Room unavailable'
	});
}]);
