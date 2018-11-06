sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/noOptionAvailable");

    // External verification

    $stateProvider.state('externalVerification', {
        url: '/externalVerification',
        templateUrl: '/assets/common_templates/partials/IHG/gwExternal.html',
        controller: 'externalVerificationViewController',
        title: 'External verification'
    });


    // room and cc verification 

    $stateProvider.state('checkoutRoomVerification', {
        url: '/checkoutRoomVerification',
        templateUrl: '/assets/common_templates/partials/IHG/gwRoomVerification.html',
        controller: 'checkoutRoomVerificationViewController',
        title: 'Room verification'
    }).state('ccVerification', {
        url: '/ccVerification/:fee/:message/:isFromCheckoutNow',
        templateUrl: '/assets/common_templates/partials/IHG/gwCcEntry.html',
        controller: 'ccVerificationViewController',
        title: 'CC verification'
    });

    // checkout now states

    $stateProvider.state('checkoutBalance', {
            url: '/checkoutBalance',
            controller: 'checkOutBalanceController',
            templateUrl: '/assets/common_templates/partials/IHG/gwBill.html',
            title: 'Balance - Check-out Now'
        }).state('checkOutStatus', {
            url: '/checkOutStatus',
            controller: 'checkOutStatusController',
            templateUrl: '/assets/common_templates/partials/IHG/gwCheckoutfinal.html',
            title: 'Status - Check-out Now'
        })
        .state('checkOutConfirmation', {
            url: '/checkOutConfirmation',
            controller: 'checkOutConfirmationController',
            templateUrl: '/assets/common_templates/partials/IHG/gwCheckout.html',
            title: 'Confirm - Check-out Now'
        });

    // late checkout states

    $stateProvider.state('checkOutOptions', {
        url: '/checkOutOptions',
        templateUrl: '/assets/common_templates/partials/IHG/gwCheckoutoptions.html',
        controller: 'checkOutLandingController',
        title: 'Check-out'
    }).state('checkOutLaterOptions', {
        url: '/checkOutLaterOptions',
        templateUrl: '/assets/common_templates/partials/IHG/gwLatecheckoutoptions.html',
        controller: 'checkOutLaterController',
        title: 'Check-out Later'
    }).
    state('checkOutLaterSuccess', {
        url: '/checkOutLaterOptions/:id',
        templateUrl: '/assets/common_templates/partials/IHG/gwLateCheckoutfinal.html',
        controller: 'checkOutLaterSuccessController',
        title: 'Status - Check-out Later'
    });

    // checkin states

    $stateProvider.state('checkinConfirmation', {
        url: '/checkinConfirmation',
        templateUrl: '/assets/common_templates/partials/IHG/gwCheckin.html',
        controller: 'checkInConfirmationViewController',
        title: 'Check-in'
    }).state('checkinReservationDetails', {
        url: '/checkinReservationDetails',
        templateUrl: '/assets/common_templates/partials/IHG/gwCheckinDetails.html',
        controller: 'checkInReservationDetails',
        title: 'Details - Check-in'
    }).
    state('checkinUpgrade', {
        url: '/checkinUpgrade',
        templateUrl: '/assets/common_templates/partials/IHG/gwRoomUpgrades.html',
        controller: 'checkinUpgradeRoomController',
        title: 'Upgrade - Check-in'
    }).
    state('checkinKeys', {
            url: '/checkinKeys',
            templateUrl: '/assets/common_templates/partials/IHG/gwNewCheckinFinal.html',
            controller: 'checkInKeysController',
            title: 'Keys - Check-in'
        })
        .state('checkinSuccess', {
            url: '/checkinSuccess',
            templateUrl: '/assets/common_templates/partials/IHG/gwAlreadyCheckedIn.html',
            title: 'Status - Check-in'
        })
        .state('checkinArrival', {
            url: '/checkinArrival',
            controller: 'checkinArrivalDetailsController',
            templateUrl: '/assets/common_templates/partials/IHG/gwArrivalTime.html',
            title: 'Arrival Details - Check-in'
        })
        .state('guestDetails', {
            url: '/guestDetails',
            templateUrl: '/assets/common_templates/partials/IHG/gwGuestDetail.html',
            controller: 'guestDetailsController',
            title: 'Guest Details'
        });

    // pre checkin states

    $stateProvider.state('preCheckinStatus', {
        url: '/preCheckinStatus',
        templateUrl: '/assets/common_templates/partials/IHG/gwNewPrecheckinFinal.html',
        controller: 'preCheckinStatusController',
        title: 'Status - Pre Check-In'
    }).state('checkinCcVerification', {
        url: '/checkinCcVerification',
        templateUrl: '/assets/common_templates/partials/IHG/gwCheckinCCAddition.html',
        controller: 'checkinCcVerificationController',
        title: 'CC verification'
    });

    $stateProvider.state('earlyCheckinOptions', {
            url: '/earlyCheckinOptions/:time/:charge/:id',
            templateUrl: '/assets/common_templates/partials/IHG/gwEarlyCheckinOptions.html',
            controller: 'earlyCheckinOptionsController',
            title: 'Early Check-in'
        }).state('earlyCheckinFinal', {
            url: '/earlyCheckinFinal/:time/:charge/:id',
            templateUrl: '/assets/common_templates/partials/IHG/gwEarlyCheckinFinal.html',
            controller: 'earlyCheckinFinalController',
            title: 'Early Check-in'
        })
        .state('laterArrival', {
            url: '/laterArrival/:time/:isearlycheckin',
            templateUrl: '/assets/common_templates/partials/IHG/gwLateArrivalTime.html',
            controller: 'checkinArrivalDetailsController',
            title: 'Early Check-in'
        })
        .state('depositPayment', {
            url: '/depositPayment',
            templateUrl: '/assets/common_templates/partials/IHG/gwDepositPayment.html',
            controller: 'checkinDepositPaymentController',
            title: 'Pay Deposit'
        });

    $stateProvider.state('noOptionAvailable', {
        url: '/noOptionAvailable',
        templateUrl: '/assets/common_templates/partials/gwNoOption.html',
        title: 'Feature not available'
    });

    $stateProvider.state('externalCheckinVerification', {
            url: '/externalCheckinVerification',
            templateUrl: '/assets/common_templates/partials/IHG/gwExternalCheckin.html',
            controller: 'externalCheckinVerificationViewController',
            title: 'External Check in verification'
        }).state('guestCheckinTurnedOff', {
            url: '/guestCheckinTurnedOff',
            templateUrl: '/assets/common_templates/partials/IHG/gwExternalCheckInTurnedOff.html',
            title: 'Check-in'
        })
        .state('guestCheckinEarly', {
            url: '/guestCheckinEarly/:date',
            templateUrl: '/assets/common_templates/partials/IHG/gwEarlyToCheckin.html',
            controller: 'earlyToCheckinCtrl',
            title: 'Check-in'
        })
        .state('guestCheckinLate', {
            url: '/guestCheckinLate',
            templateUrl: '/assets/common_templates/partials/IHG/gwLateToCheckin.html',
            title: 'Check-in',
            controller: 'lateToCheckinController'
        });

    $stateProvider.state('emailAddition', {
            url: '/emailAddition/:isFrom',
            templateUrl: '/assets/common_templates/partials/IHG/gwEmailEntry.html',
            controller: 'emailEntryController',
            title: 'E-mail entry'
        })
        .state('mobileNumberAddition', {
            url: '/mobileNumberAddition',
            templateUrl: '/assets/common_templates/partials/IHG/gwPhoneNumberUpdate.html',
            controller: 'mobileEntryController',
            title: 'Phone number entry'
        })
        .state('mobileNumberOptions', {
            url: '/mobileNumberOptions',
            templateUrl: '/assets/common_templates/partials/IHG/gwMobielNUmberOptions.html',
            controller: 'mobileOptionsController',
            title: 'Phone number entry'
        });

    // Addon state
    $stateProvider.state('offerAddonOptions', {
        url: '/addonOptions/:isFrom',
        templateUrl: '/assets/common_templates/partials/IHG/gwOfferAddonOptions.html',
        controller: 'offerAddonOptionsController',
        title: 'Addons'
    });
}]);