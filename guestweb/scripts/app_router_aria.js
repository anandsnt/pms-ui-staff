sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
        controller: 'checkOutStatusController',
        templateUrl: '/assets/common_templates/partials/MGM/Aria/gwCheckoutfinal.html',
        title: 'Status - Check-out Now'
    }).state('promptGuestDetails', {
        url: '/promptGuestDetails',
        templateUrl: '/assets/checkin/partials/MGM/promptGuestDetails.html',
        controller: 'guestDetailsController',
        title: 'Guest Details'
    }).state('guestNotEligible', {
        url: '/guestNotEligible',
        templateUrl: '/assets/checkin/partials/MGM/guestNotEligible.html',
        title: 'Guest Details'
    }).state('externalCheckinVerification', {
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
    }) state('checkinCcVerification', {
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
        controller: 'earlyCheckinReadyController',
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




// .state('checkOutStatus', {
//         url: '/checkOutStatus',
//        	controller: 'checkOutStatusController',
//        	templateUrl: '/assets/common_templates/partials/MGM/MandalayBay/gwCheckoutfinal.html',
// 		title: 'Status - Check-out Now'
//    	 })
