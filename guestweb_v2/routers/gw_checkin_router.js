sntGuestWeb.config(['$stateProvider', function($stateProvider) {

	$stateProvider.state('externalCheckinVerification', {
		url: '/externalCheckinVerification',
		templateUrl: '/assets/partials/checkin/gwExternalCheckin.html',
		controller: 'GwExternalCheckInVerificationController',
		data: {
			pageTitle: 'External Check in verification'
		}
	}).state('checkinReservationDetails', {
	 	url: '/checkinReservationDetails',
	 	templateUrl: '/assets/partials/checkin/gwCheckinDetails.html',
	 	controller : 'gwReservationDetailsController',
	 	data: {
			pageTitle:'Details - Check-in'
		}
	 }).state('roomUpgrade', {
	 	url: '/roomUpgrade',
	 	templateUrl: '/assets/partials/checkin/gwRoomUpgrades.html',
	 	controller : 'gwRoomUpgradeController',
	    data: {
	    	pageTitle: 'Room - Upgrade'
	    }
	 }).state('etaUpdation', {
	 	url: '/etaUpdation',
	 	templateUrl: '/assets/partials/checkin/gwArrivalTime.html',
	 	controller : 'gwETAUpdationController',
	    data: {
	    	pageTitle:'ETA Updation'
	    }
	 }).state('termsAndConditions', {
	 	url: '/termsAndConditions',
	 	templateUrl: '/assets/partials/checkin/gwTermsAndConditions.html',
	 	controller : 'gwTermsAndConditionsController',
	    data: {
	    	pageTitle: 'Terms & Conditions'
	    }
	 }).state('autoCheckinFinal', {
		url: '/autoCheckinFinal',
		templateUrl: '/assets/partials/checkin/gwAutoCheckinFinal.html',
		controller : 'gwAutoCheckinController',
		data: {
	    	pageTitle: 'Status - Pre Check-In'
	    }
	 }).state('checkinLanding', {
	 	url: '/checkinLanding',
	 	templateUrl: '/assets/partials/checkin/gwCheckin.html',
	 	controller : 'gwCheckinLandingCtrlController',
	 	data: {
	 		title: 'Check-in'
	 	}
	 }).state('externalCheckInTurnedOff',{
	 	url: '/externalCheckInTurnedOff',
	 	templateUrl: '/assets/partials/checkin/gwExternalCheckInTurnedOff.html',
	 	controller : 'gwExternalCheckInTurnedOffController',
	 	data: {
	 		title: 'Check-in'
	 	}
	 }).state('earlyCheckinOptions', {
	 	url: '/earlyCheckinOptions/:time/:charge/:id',
	 	templateUrl: '/assets/partials/checkin/gwEarlyCheckinOptions.html',
	 	controller : 'gwEarlyCheckinOptionsController',
	 	data: {
	 		title: 'Early Check-in'
	 	}
	 }).state('earlyCheckinFinal', {
	 	url: '/earlyCheckinFinal/:charge',
	 	templateUrl: '/assets/partials/checkin/gwEarlyCheckinFinal.html',
	 	controller : 'gwEarlyCheckinFinalController',
	 	data: {
	 		title: 'Early Check-in'
	 	}
	 }).state('laterArrival', {
	 	url: '/laterArrival/:time/:isearlycheckin',
	 	templateUrl: '/assets/partials/checkin/gwLateArrivalTime.html',
	 	controller : 'gwLateETAUpdationController',
	    data: {
	 		title: 'Early Check-in'
	 	}
	 }).state('updateGuestDetails', {
	 	url: '/updateGuestDetails',
	 	templateUrl: '/assets/partials/checkin/gwGuestDetail.html',
	 	controller : 'gwUpdateGuestDetailsController',
	    data: {
	 		title: 'Guest Details'
	 	}
	 }).state('alreadyCheckedIn', {
	 	url: '/alreadyCheckedIn',
	 	templateUrl: '/assets/partials/checkin/gwAlreadyCheckedIn.html',
	 	controller: 'gwAlreadyCheckedInController',
	 	data: {
	 		title:'Status - Check-in'
	 	}
	 }).state('checkinFinal', {
	 	url: '/checkinFinal',
	 	templateUrl: '/assets/partials/checkin/gwCheckinFinal.html',
	 	controller : 'gwCheckinFinalController',
	 	data: {
	 		title: 'Check-in: final'
	 	}
	 });

	 




	// // checkin states

	// $stateProvider.state('checkinConfirmation', {
	//  	url: '/checkinConfirmation',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwCheckin.html',
	//  	controller : 'checkInConfirmationViewController',
	//  	title: 'Check-in'
	//  }).state('checkinReservationDetails', {
	//  	url: '/checkinReservationDetails',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwCheckinDetails.html',
	//  	controller : 'checkInReservationDetails',
	//  	title: 'Details - Check-in'
	//  }).state('checkinUpgrade', {
	//  	url: '/checkinUpgrade',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwRoomUpgrades.html',
	//  	controller : 'checkinUpgradeRoomController',
	//     title: 'Upgrade - Check-in'
	//  }).state('checkinKeys', {
	//  	url: '/checkinKeys',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwCheckinFinal.html',
	//  	controller : 'checkInKeysController',
	//  	title: 'Keys - Check-in'
	//  }).state('checkinSuccess', {
	//  	url: '/checkinSuccess',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwAlreadyCheckedIn.html',
	//  	title: 'Status - Check-in'
	//  }).state('checkinArrival', {
	//  	url: '/checkinArrival',
	//  	controller:'checkinArrivalDetailsController',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwArrivalTime.html',
	//  	title: 'Arrival Details - Check-in'
	//  }).state('guestDetails', {
	//  	url: '/guestDetails',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwGuestDetail.html',
	//  	controller : 'guestDetailsController',
	//     title: 'Guest Details'
	//  })


	// // pre checkin states

	//    $stateProvider.state('preCheckinStatus', {
	// 	url: '/preCheckinStatus',
	// 	templateUrl: '/assets/common_templates/partials/checkin/gwPreCheckinFinal.html',
	// 	controller : 'preCheckinStatusController',
	// 	title: 'Status - Pre Check-In'
	//  });

	// $stateProvider.state('earlyCheckinOptions', {
	//  	url: '/earlyCheckinOptions/:time/:charge/:id',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwEarlyCheckinOptions.html',
	//  	controller : 'earlyCheckinOptionsController',
	//  	title: 'Early Check-in'
	//  }).state('earlyCheckinFinal', {
	//  	url: '/earlyCheckinFinal/:time/:charge/:id',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwEarlyCheckinFinal.html',
	//  	controller : 'earlyCheckinFinalController',
	//  	title: 'Early Check-in'
	//  }).state('laterArrival', {
	//  	url: '/laterArrival/:time/:isearlycheckin',
	//  	templateUrl: '/assets/common_templates/partials/checkin/gwLateArrivalTime.html',
	//  	controller : 'checkinArrivalDetailsController',
	//     title: 'Early Check-in'
	//  });

	//  $stateProvider.state('noOptionAvailable', {
	//    	url: '/noOptionAvailable',
	//  	templateUrl: '/assets/partials/gwNoOption.html',
	//  	title: 'Feature not available'
	// });

}]);