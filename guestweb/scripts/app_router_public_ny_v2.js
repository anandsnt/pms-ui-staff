
sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // External verification

    $stateProvider.state('externalVerification', {url: '/externalVerification', 
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwExternal.html',
        controller: 'externalVerificationViewController',
        title: 'External verification'
    });


    // room and cc verification 

    $stateProvider.state('checkoutRoomVerification', {url: '/checkoutRoomVerification',
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwRoomVerification.html',
        controller: 'checkoutRoomVerificationViewController',
        title: 'Room verification'
    }).state('ccVerification', {
        url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
        templateUrl: '/assets/common_templates/partials/checkout/gwCcEntry.html',
        controller: 'ccVerificationViewController',
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
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwCheckoutfinal.html',
        title: 'Status - Check-out Now'
    })
	.state('checkOutConfirmation', {
    url: '/checkOutConfirmation',
    controller: 'checkOutConfirmationController',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwCheckout.html',
    title: 'Confirm - Check-out Now'
});

    // late checkout states

    $stateProvider.state('checkOutOptions', {url: '/checkOutOptions',
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwCheckoutoptions.html',
        controller: 'checkOutLandingController',
        title: 'Check-out'
    }).state('checkOutLaterOptions', {
        url: '/checkOutLaterOptions',
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwLatecheckoutoptions.html',
        controller: 'checkOutLaterController',
        title: 'Check-out Later'
    }).
	state('checkOutLaterSuccess', {
    url: '/checkOutLaterOptions/:id',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwLateCheckoutfinal.html',
    controller: 'checkOutLaterSuccessController',
    title: 'Status - Check-out Later'
});

	// checkin states

	$stateProvider.state('checkinConfirmation', {
    url: '/checkinConfirmation',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwCheckin.html',
    controller: 'checkInConfirmationViewController',
    title: 'Check-in'
}).state('checkinReservationDetails', {
    url: '/checkinReservationDetails',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwCheckinDetails.html',
    controller: 'checkInReservationDetails',
    title: 'Details - Check-in'
}).
state('checkinUpgrade', {
    url: '/checkinUpgrade',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwRoomUpgrades.html',
    controller: 'checkinUpgradeRoomController',
    title: 'Upgrade - Check-in'
}).
state('checkinKeys', {
    url: '/checkinKeys',
    templateUrl: '/assets/common_templates/partials/checkin/gwNewCheckinFinal.html',
    controller: 'checkInKeysController',
    title: 'Keys - Check-in'
})
.state('checkinSuccess', {
    url: '/checkinSuccess',
    templateUrl: '/assets/common_templates/partials/checkin/gwAlreadyCheckedIn.html',
    title: 'Status - Check-in'
})
.state('checkinArrival', {
    url: '/checkinArrival',
    controller: 'checkinArrivalDetailsController',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwArrivalTime.html',
    title: 'Arrival Details - Check-in'
})
.state('guestDetails', {
    url: '/guestDetails',
    templateUrl: '/assets/common_templates/partials/checkin/gwGuestDetail.html',
    controller: 'guestDetailsController',
    title: 'Guest Details'
});

	// pre checkin states

    $stateProvider.state('preCheckinStatus', {
        url: '/preCheckinStatus',
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwNewPrecheckinFinal.html',
        controller: 'preCheckinStatusController',
        title: 'Status - Pre Check-In'
    }).state('checkinCcVerification', {
        url: '/checkinCcVerification',
        templateUrl: '/assets/common_templates/partials/checkin/gwCheckinCCAddition.html',
        controller: 'checkinCcVerificationController',
        title: 'CC verification'
    });

	$stateProvider.state('earlyCheckinOptions', {
    url: '/earlyCheckinOptions/:time/:charge/:id',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwEarlyCheckinOptions.html',
    controller: 'earlyCheckinOptionsController',
    title: 'Early Check-in'
}).state('earlyCheckinFinal', {
    url: '/earlyCheckinFinal/:time/:charge/:id',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwEarlyCheckinFinal.html',
    controller: 'earlyCheckinFinalController',
    title: 'Early Check-in'
})
.state('laterArrival', {
    url: '/laterArrival/:time/:isearlycheckin',
    templateUrl: '/assets/common_templates/partials/public_ny_v2/gwLateArrivalTime.html',
    controller: 'checkinArrivalDetailsController',
    title: 'Early Check-in'
})
.state('depositPayment', {
    url: '/depositPayment',
    templateUrl: '/assets/common_templates/partials/checkin/gwDepositPayment.html',
    controller: 'checkinDepositPaymentController',
    title: 'Pay Deposit'
});

    $stateProvider.state('noOptionAvailable', {url: '/noOptionAvailable',
        templateUrl: '/assets/common_templates/partials/gwNoOption.html',
        title: 'Feature not available'});

    $stateProvider.state('externalCheckinVerification', {
        url: '/externalCheckinVerification',
        templateUrl: '/assets/common_templates/partials/public_ny_v2/gwExternalCheckin.html',
        controller: 'externalCheckinVerificationViewController',
        title: 'External Check in verification'
    }).state('guestCheckinTurnedOff', {
        url: '/guestCheckinTurnedOff',
        templateUrl: '/assets/common_templates/partials/checkin/gwExternalCheckInTurnedOff.html',
        title: 'Check-in'
    })
	.state('guestCheckinEarly', {
    url: '/guestCheckinEarly/:date',
    templateUrl: '/assets/common_templates/partials/checkin/gwEarlyToCheckin.html',
    controller: 'earlyToCheckinCtrl',
    title: 'Check-in'
})
.state('guestCheckinLate', {
    url: '/guestCheckinLate',
    templateUrl: '/assets/common_templates/partials/checkin/gwLateToCheckin.html',
    title: 'Check-in'
});

    $stateProvider.state('emailAddition', {
        url: '/emailAddition/:isFrom',
        templateUrl: '/assets/common_templates/partials/checkin/gwEmailEntry.html',
        controller: 'emailEntryController',
        title: 'E-mail entry'
    })
.state('mobileNumberAddition', {
    url: '/mobileNumberAddition',
    templateUrl: '/assets/common_templates/partials/checkin/gwPhoneNumberUpdate.html',
    controller: 'mobileEntryController',
    title: 'Phone number entry'
})
.state('mobileNumberOptions', {
    url: '/mobileNumberOptions',
    templateUrl: '/assets/common_templates/partials/checkin/gwMobielNUmberOptions.html',
    controller: 'mobileOptionsController',
    title: 'Phone number entry'
});
}]);