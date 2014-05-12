snt.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/assets/landing/Galleria/landing.html',
		controller: 'checkOutLandingController',
		title: 'Checkout'
	});


	//checkout now routings

	$routeProvider.when('/checkoutBalance', {
		templateUrl: '/assets/checkoutnow/partials/Galleria/checkoutBalance.html',
		controller: 'checkOutBalanceController',
		title: 'Balance - Checkout Now'
	});

	$routeProvider.when('/checkOutNow', {
		templateUrl: '/assets/checkoutnow/partials/Galleria/checkoutConfirmation.html',
		controller: 'checkOutConfirmationController',
		title: 'Confirm - Checkout Now'
	});

	$routeProvider.when('/checkOutNowSuccess', {
		templateUrl: '/assets/checkoutnow/partials/Galleria/checkOutStatus.html',
		controller: 'checkOutStatusController',
		title: 'Status - Checkout Now'
	});

	//checkout later routings

	$routeProvider.when('/checkOutLater', {
		templateUrl: '/assets/checkoutlater/partials/Galleria/checkOutLater.html',
		controller: 'checkOutLaterController',
		title: 'Checkout Later'
	});

	$routeProvider.when('/checkOutLaterSuccess/:id', {
		templateUrl: '/assets/checkoutlater/partials/Galleria/checkOutLaterSuccess.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Checkout Later'
	})


	// error routings

	$routeProvider.when('/authFailed', {
		templateUrl: '/assets/shared/authenticationFailedView.html',
		title: 'Login Failed'
	});
	$routeProvider.when('/serverError', {
		templateUrl: '/assets/shared/serverErrorView.html',
		title: 'Server Unreachable'
	});

	//check in routings

	$routeProvider.when('/checkinConfirmation', {
		templateUrl: '/assets/checkin/partials/Galleria/checkInConfirmation.html',
		controller : 'checkInConfirmationViewController',
		title: 'Check In'
	});

	// $routeProvider.when('/checkinDatePicker', {
	// 	templateUrl: '/assets/checkin/partials/Yotel/checkinDatePicker.html',
	// 	controller : 'checkinDatePickerController',
	// 	title: 'Pick Date - Check In'
	// });

	$routeProvider.when('/checkinKeys', {
		templateUrl: '/assets/checkin/partials/Galleria/checkInKeys.html',
		controller : 'checkInKeysController',
		title: 'Keys - Check In'
	});

	$routeProvider.when('/checkinReservationDetails', {
		templateUrl: '/assets/checkin/partials/Galleria/checkInReservationDetails.html',
		controller : 'checkInReservationDetails',
		title: 'Details - Check In'
	});

	$routeProvider.when('/checkinUpgrade', {
		templateUrl: '/assets/checkin/partials/Galleria/checkinUpgradeRoom.html',
	    controller : 'checkinUpgradeRoomContorller',
	    title: 'Upgrade - Check In'
	});

	$routeProvider.when('/checkinSuccess', {
		templateUrl: '/assets/checkin/partials/Galleria/checkinSuccess.html',
	    title: 'Status - Check In'
	});


	$routeProvider.otherwise({
		redirectTo: '/'
	});




}]);