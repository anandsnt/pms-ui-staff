

snt.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/checkOutOptions");

	$stateProvider.state('checkoutBalance', {
        url: '/checkoutBalance',
        controller: 'checkOutBalanceController',
       	templateUrl: '/assets/checkoutnow/partials/Yotel/checkoutBalance.html',
	    title: 'Balance - Checkout Now'
    })
    .state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/checkoutnow/partials/Yotel/checkOutStatus.html',
		title: 'Status - Checkout Now'
    }).state('checkOutConfirmation', {
        url: '/checkOutConfirmation',
       	controller: 'checkOutConfirmationController',
       	templateUrl: '/assets/checkoutnow/partials/Yotel/checkoutConfirmation.html',
		title: 'Confirm - Checkout Now'
    }).state('checkOutOptions', {
	 	templateUrl: '/assets/landing/Yotel/landing.html',
	 	controller: 'checkOutLandingController',
	 	title: 'Checkout'
	 }).state('checkOutLaterOptions', {
		templateUrl: '/assets/checkoutlater/partials/Yotel/checkOutLater.html',
	 	controller: 'checkOutLaterController',
		title: 'Checkout Later'
	});








	// $routeProvider.when('/', {
	// 	templateUrl: '/assets/landing/Yotel/landing.html',
	// 	controller: 'checkOutLandingController',
	// 	title: 'Checkout'
	// });


	// //checkout now routings

	// $routeProvider.when('/checkoutBalance', {
	// 	templateUrl: '/assets/checkoutnow/partials/Yotel/checkoutBalance.html',
	// 	controller: 'checkOutBalanceController',
	// 	title: 'Balance - Checkout Now'
	// });

	// $routeProvider.when('/checkOutNow', {
	// 	templateUrl: '/assets/checkoutnow/partials/Yotel/checkoutConfirmation.html',
	// 	controller: 'checkOutConfirmationController',
	// 	title: 'Confirm - Checkout Now'
	// });

	// $routeProvider.when('/checkOutNowSuccess', {
	// 	templateUrl: '/assets/checkoutnow/partials/Yotel/checkOutStatus.html',
	// 	controller: 'checkOutStatusController',
	// 	title: 'Status - Checkout Now'
	// });

	// //checkout later routings

	// $routeProvider.when('/checkOutLater', {
	// 	templateUrl: '/assets/checkoutlater/partials/Yotel/checkOutLater.html',
	// 	controller: 'checkOutLaterController',
	// 	title: 'Checkout Later'
	// });

	// $routeProvider.when('/checkOutLaterSuccess/:id', {
	// 	templateUrl: '/assets/checkoutlater/partials/Yotel/checkOutLaterSuccess.html',
	// 	controller: 'checkOutLaterSuccessController',
	// 	title: 'Status - Checkout Later'
	// })


	// // error routings

	// $routeProvider.when('/authFailed', {
	// 	templateUrl: '/assets/shared/authenticationFailedView.html',
	// 	title: 'Login Failed'
	// });
	// $routeProvider.when('/serverError', {
	// 	templateUrl: '/assets/shared/serverErrorView.html',
	// 	title: 'Server Unreachable'
	// });

	// //check in routings

	// $routeProvider.when('/checkinConfirmation', {
	// 	templateUrl: '/assets/checkin/partials/checkInConfirmation.html',
	// 	controller : 'checkInConfirmationViewController',
	// 	title: 'Check In'
	// });

	// // $routeProvider.when('/checkinDatePicker', {
	// // 	templateUrl: '/assets/checkin/partials/Yotel/checkinDatePicker.html',
	// // 	controller : 'checkinDatePickerController',
	// // 	title: 'Pick Date - Check In'
	// // });

	// $routeProvider.when('/checkinKeys', {
	// 	templateUrl: '/assets/checkin/partials/checkInKeys.html',
	// 	controller : 'checkInKeysController',
	// 	title: 'Keys - Check In'
	// });

	// $routeProvider.when('/checkinReservationDetails', {
	// 	templateUrl: '/assets/checkin/partials/checkInReservationDetails.html',
	// 	controller : 'checkInReservationDetails',
	// 	title: 'Details - Check In'
	// });

	// $routeProvider.when('/checkinUpgrade', {
	// 	templateUrl: '/assets/checkin/partials/checkinUpgradeRoom.html',
	//     controller : 'checkinUpgradeRoomContorller',
	//     title: 'Upgrade - Check In'
	// });

	// $routeProvider.when('/checkinSuccess', {
	// 	templateUrl: '/assets/checkin/partials/checkinSuccess.html',
	//     title: 'Status - Check In'
	// });


	// $routeProvider.otherwise({
	// 	redirectTo: '/'
	// });




}]);