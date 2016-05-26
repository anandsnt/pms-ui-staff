sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/noOptionAvailable");
	// External verification

	$stateProvider.state('externalVerification', {
		url: '/externalVerification',
		templateUrl: '/assets/checkoutnow/partials/MGM/externalVerification.html',
		controller: 'externalVerificationViewController',
		title: 'External verification'
	});

	// checkout now states

	$stateProvider.state('checkoutBalance', {
			url: '/checkoutBalance',
			controller: 'checkOutBalanceController',
			templateUrl: '/assets/checkoutnow/partials/MGM/checkoutBalance.html',
			title: 'Balance - Check-out Now'
		})
		.state('checkOutStatus', {
			url: '/checkOutStatus',
			controller: 'checkOutStatusController',
			templateUrl: '/assets/checkoutnow/partials/MGM/checkOutStatus.html',
			title: 'Status - Check-out Now'
		}).state('checkOutConfirmation', {
			url: '/checkOutConfirmation',
			controller: 'checkOutConfirmationController',
			templateUrl: '/assets/checkoutnow/partials/MGM/checkoutConfirmation.html',
			title: 'Confirm - Check-out Now'
		});

	// late checkout states

	$stateProvider.state('checkOutOptions', {
		url: '/checkOutOptions',
		templateUrl: '/assets/landing/MGM/landing.html',
		controller: 'checkOutLandingController',
		title: 'Check-out'
	}).state('checkOutLaterOptions', {
		url: '/checkOutLaterOptions',
		templateUrl: '/assets/checkoutlater/partials/MGM/checkOutLater.html',
		controller: 'checkOutLaterController',
		title: 'Check-out Later'
	}).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/checkoutlater/partials/MGM/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	});

	// checkin states

	$stateProvider.state('checkinConfirmation', {
		url: '/checkinConfirmation',
		templateUrl: '/assets/checkin/partials/MGM/checkInConfirmation.html',
		controller: 'checkInConfirmationViewController',
		title: 'Check-in'
	}).state('checkinReservationDetails', {
		url: '/checkinReservationDetails',
		templateUrl: '/assets/checkin/partials/MGM/checkInReservationDetails.html',
		controller: 'checkInReservationDetails',
		title: 'Details - Check-in'
	}).state('checkinUpgrade', {
		url: '/checkinUpgrade',
		templateUrl: '/assets/checkin/partials/MGM/checkinUpgradeRoom.html',
		controller: 'checkinUpgradeRoomController',
		title: 'Upgrade - Check-in'
	}).state('checkinKeys', {
		url: '/checkinKeys',
		templateUrl: '/assets/checkin/partials/MGM/checkInKeys.html',
		controller: 'checkInKeysController',
		title: 'Keys - Check-in'
	}).state('checkinSuccess', {
		url: '/checkinSuccess',
		templateUrl: '/assets/checkin/partials/checkinSuccess.html',
		title: 'Status - Check-in'
	}).state('checkinArrival', {
		url: '/checkinArrival',
		controller: 'checkinArrivalDetailsController',
		templateUrl: '/assets/checkin/partials/MGM/arrivalDetails.html',
		title: 'Arrival Details - Check-in'
	}).state('guestDetails', {
		url: '/guestDetails',
		templateUrl: '/assets/checkin/partials/MGM/guestDetails.html',
		controller: 'guestDetailsController',
		title: 'Guest Details'
	}).state('birthDateDetails', {
		url: '/birthDateDetails',
		templateUrl: '/assets/checkin/partials/MGM/birthDataDetails.html',
		controller: 'birthDateDetailsController',
		title: 'Birthdate'
	}).state('promptGuestDetails', {
		url: '/promptGuestDetails',
		templateUrl: '/assets/checkin/partials/MGM/promptGuestDetails.html',
		controller: 'guestDetailsController',
		title: 'Guest Details'
	}).state('guestNotEligible', {
		url: '/guestNotEligible',
		templateUrl: '/assets/checkin/partials/MGM/guestNotEligible.html',
		title: 'Guest Details'
	});
	//room verification

	$stateProvider.state('checkoutRoomVerification', {
		url: '/checkoutRoomVerification',
		templateUrl: '/assets/checkoutnow/partials/MGM/checkoutRoomVerification.html',
		controller: 'checkoutRoomVerificationViewController',
		title: 'Room verification'
	}).state('ccVerification', {
		url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
		templateUrl: '/assets/checkoutnow/partials/MGM/ccVerification.html',
		controller: 'ccVerificationViewController',
		title: 'CC verification'
	});

	// pre checkin states

	$stateProvider.state('preCheckinStatus', {
		url: '/preCheckinStatus',
		templateUrl: '/assets/preCheckin/partials/MGM/preCheckinStatus.html',
		controller: 'preCheckinStatusController',
		title: 'Status - Pre Check-In'
	});

	$stateProvider.state('earlyCheckinOptions', {
		url: '/earlyCheckinOptions/:time/:charge/:id/:isFromCheckinNow/:roomAssignedFromZestWeb',
		templateUrl: '/assets/checkin/partials/MGM/earlyCheckinOptions.html',
		controller: 'earlyCheckinOptionsController',
		title: 'Early Check-in'
	}).state('earlyCheckinFinal', {
		url: '/earlyCheckinFinal/:time/:charge/:id/:isFromCheckinNow',
		templateUrl: '/assets/checkin/partials/MGM/earlyCheckinFinal.html',
		controller: 'earlyCheckinFinalController',
		title: 'Early Check-in'
	}).state('laterArrival', {
		url: '/laterArrival/:time/:isearlycheckin',
		templateUrl: '/assets/checkin/partials/MGM/lateArrivalDetails.html',
		controller: 'checkinArrivalDetailsController',
		title: 'Early Check-in'
	});



	$stateProvider.state('noOptionAvailable', {
		url: '/noOptionAvailable',
		templateUrl: '/assets/preCheckin/partials/noOption.html',
		title: 'Feature not available'
	});


	$stateProvider.state('externalCheckinVerification', {
		url: '/externalCheckinVerification',
		templateUrl: '/assets/checkin/partials/MGM/externalCheckinLanding.html',
		controller: 'externalCheckinVerificationViewController',
		title: 'External verification'
	}).state('guestCheckinTurnedOff', {
		url: '/guestCheckinTurnedOff',
		templateUrl: '/assets/checkin/partials/MGM/guestCheckinTurnedOff.html',
		title: 'Check-in'
	}).state('guestCheckinEarly', {
		url: '/guestCheckinEarly/:date',
		templateUrl: '/assets/checkin/partials/MGM/earlyToCheckin.html',
		controller: 'earlyToCheckinCtrl',
		title: 'Check-in'
	}).state('guestCheckinLate', {
		url: '/guestCheckinLate',
		templateUrl: '/assets/checkin/partials/MGM/lateToCheckin.html',
		title: 'Check-in'
	});

	$stateProvider.state('checkinCcVerification', {
		url: '/checkinCcVerification',
		templateUrl: '/assets/checkin/partials/MGM/checkinCCAddition.html',
		controller: 'checkinCcVerificationController',
		title: 'CC verification'
	}).state('emailAddition', {
		url: '/emailAddition/:isFrom',
		templateUrl: '/assets/checkin/partials/MGM/emailEntryPage.html',
		controller: 'emailEntryController',
		title: 'E-mail entry'
	}).state('mobileNumberAddition', {
		url: '/mobileNumberAddition',
		templateUrl: '/assets/checkin/partials/MGM/mobileNumberEntry.html',
		controller: 'mobileEntryController',
		title: 'Phone number entry'
	}).state('mobileNumberOptions', {
		url: '/mobileNumberOptions',
		templateUrl: '/assets/checkin/partials/MGM/mobileNumberOptions.html',
		controller: 'mobileOptionsController',
		title: 'Phone number entry'
	}).state('guestCheckinOptions', {
		url: '/guestCheckinOptions',
		templateUrl: '/assets/checkin/partials/MGM/guestCheckinOptions.html',
		controller: 'checkinOptionsController',
		title: 'Checkin options'
	}).state('earlyCheckinReady', {
		url: '/earlyCheckinReady',
		controller:'earlyCheckinReadyController',
		templateUrl: '/assets/checkin/partials/MGM/earlyCheckinReady.html',
		title: 'Early Check in ready'
	}).state('roomNotReady', {
		url: '/roomNotReady',
		templateUrl: '/assets/checkin/partials/MGM/roomNotReady.html',
		controller: 'roomNotReadyController',
		title: 'Room unavailable'
	}).state('roomAssignFailed', {
		url: '/roomAssignFailed',
		templateUrl: '/assets/checkin/partials/MGM/roomAssignFailed.html',
		controller: 'roomAssignFailedController',
		title: 'Room Assign Failed'
	}).state('roomNotToSell', {
		url: '/roomNotToSell',
		templateUrl: '/assets/checkin/partials/MGM/roomNotToSell.html',
		controller: 'roomNotToSellController',
		title: 'Room Assign Failed'
	}).state('eciOffroomAssignFailed', {
		url: '/eciOffroomAssignFailed',
		templateUrl: '/assets/checkin/partials/MGM/roomAssignFailed.html',
		controller: 'eciOffRoomAssignmentFailedController',
		title: 'Room Assign Failed'
	}).state('eciOffRoomNotReady', {
		url: '/eciOffRoomNotReady',
		templateUrl: '/assets/checkin/partials/MGM/roomNotReady.html',
		controller: 'eciOffRoomNotReadyController',
		title: 'Room unavailable'
	});
}]);