sntGuestWeb.config(['$stateProvider', function($stateProvider) {

	// External checkout verification
	$stateProvider.state('externalCheckoutVerification', {
		url: '/externalCheckoutVerification',
		templateUrl: '/assets/partials/checkout/gwExternal.html',
		controller: 'GwExternalCheckoutVerificationController',
		data: {
			pageTitle: 'External Checkout verification'
		}
	}).state('checkoutRoomVerification', {
	 	url: '/checkoutRoomVerification',
	 	templateUrl: '/assets/partials/checkout/gwRoomVerification.html',
	 	controller : 'GwRoomVerificationController',
	 	data: {
			pageTitle: 'Room verification'
		}
	 }).state('ccAddition', {
	 	url: '/ccAddition/:fee/:message/:isFromCheckoutNow/:time/:ap/:amount',
	 	templateUrl: '/assets/partials/checkout/gwCcEntry.html',
	 	controller : 'GwCCAdditionController',
	 	data: {
			pageTitle: 'CC Addition'
		}
	 }).state('checkOutOptions', {
		url: '/checkOutOptions',
		templateUrl: '/assets/partials/checkout/gwCheckoutoptions.html',
		controller: 'GwCheckOutOptionsController',
		data: {
			pageTitle: 'Check-out options'
		}
	}).state('checkOutConfirmation', {
		url: '/checkOutConfirmation',
		controller: 'GwCheckoutNowInitialController',
		templateUrl: '/assets/partials/checkout/gwCheckout.html',
		data: {
			pageTitle: 'Confirm - Check-out Now'
		}
	}).state('checkoutBalance', {
		url: '/checkoutBalance',
		controller: 'GwCheckoutReviewBillController',
		templateUrl: '/assets/partials/checkout/gwBill.html',
		data: {
			pageTitle: 'Balance - Check-out Now'
		}
	}).state('checkOutFinal', {
		url: '/checkOutFinal',
		controller: 'GwCheckoutFinalController',
		templateUrl: '/assets/partials/checkout/gwCheckoutfinal.html',
		data: {
			pageTitle: 'Status - Check-out Now'
		}
	}).state('checkOutLaterOptions', {
		url: '/checkOutLaterOptions',
		templateUrl: '/assets/partials/checkout/gwLatecheckoutoptions.html',
		controller: 'GwCheckoutLaterController',
		data: {
			pageTitle: 'Check-out Later'
		}
	}).state('checkOutLaterFinal', {
		url: '/checkOutLaterFinal/:time/:ap/:amount',
		templateUrl: '/assets/partials/checkout/gwLateCheckoutfinal.html',
		controller: 'gwLateCheckoutFinalController',
		data: {
			pageTitle: 'Status - Check-out Later'
		}
	}).state('alreadyCheckedOut',{
		url: '/alreadyCheckedOut',
		templateUrl: '/assets/partials/checkout/gwAlreadyCheckedOut.html',
		controller: 'gwAlreadyCheckedOutController',
		data: {
			pageTitle: 'Status - Check-out'
		}
	})
}]);