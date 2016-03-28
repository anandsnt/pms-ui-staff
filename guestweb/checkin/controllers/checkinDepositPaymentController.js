/*
	email entry Ctrl where the email is added
*/

(function() {
	var checkinDepositPaymentController = function($scope, guestDetailsService, $state, $rootScope, $stateParams, sntGuestWebSrv) {

		var setMessage = function(cmsString, defaultString) {
			return cmsString.length > 0 ? cmsString : defaultString;
		};

		var checkForAdminMessageSetup = function() {
			var screenIdentifier1 = "DP-1"; //this value needs to set in admin(can be anything, but has to be same in both)
			var screenCMSDetails1 = sntGuestWebSrv.extractScreenDetails(screenIdentifier1);
			screenCMSDetails1.title = setMessage(screenCMSDetails1.screen_title, "Deposit");
			screenCMSDetails1.description = setMessage(screenCMSDetails1.item_description, "A deposit is required to check in");
			$scope.screenDetails = screenCMSDetails1;

			var screenIdentifier2 = "DP-2"; //this value needs to set in admin(can be anything, but has to be same in both)
			var screenCMSDetails2 = sntGuestWebSrv.extractScreenDetails(screenIdentifier2);
			screenCMSDetails2.title = setMessage(screenCMSDetails2.screen_title, "Deposit");
			screenCMSDetails2.description = setMessage(screenCMSDetails2.item_description, "There was a problem with the payment. Please contact a Sidekick");
			$scope.screenDetailsPaymentFailedMessage = screenCMSDetails2;

			var screenIdentifier3 = "DP-3"; //this value needs to set in admin(can be anything, but has to be same in both)
			var screenCMSDetails3 = sntGuestWebSrv.extractScreenDetails(screenIdentifier3);
			screenCMSDetails3.title = setMessage(screenCMSDetails3.screen_title, "Deposit");
			screenCMSDetails3.description = setMessage(screenCMSDetails3.item_description, "Your payment has been received.");
			$scope.screenDetailsPaymentSuccesMessage = screenCMSDetails3;

			var screenIdentifier4 = "DP-4"; //this value needs to set in admin(can be anything, but has to be same in both)
			var screenCMSDetails4 = sntGuestWebSrv.extractScreenDetails(screenIdentifier4);
			screenCMSDetails4.title = setMessage(screenCMSDetails4.screen_title, "Deposit");
			screenCMSDetails4.description = setMessage(screenCMSDetails4.item_description, "No payment method attached");
			$scope.screenDetailsNoPaymentMethodMessage = screenCMSDetails4;
		};


		//payment success
		var onSucess = function() {
			$scope.paymentSuccess = true;
			$scope.isLoading = false; 
			$scope.paymentSuccessContinueAction = function() {
				$scope.isLoading = false; 
				$rootScope.skipDeposit = true;
				$state.go('preCheckinStatus');
			};
		};
		//payment failed
		var onFailure = function() {
			$scope.isLoading = false; 
			$scope.paymentFailed = true;
			$scope.paymentFailedContinueAction = function() {
				cancelActions();
			};
		};
		//payment action
		$scope.payNow = function() {
			$scope.isLoading = true;
			onSucess();
		};
		$scope.cancelActions = function() {
			if ($rootScope.isExternalCheckin) {
				$state.go('externalCheckinVerification');
			} else {
				$state.go('checkinConfirmation');
			};
		};

		var onDepositFetchSuccess = function(response) {
			$scope.isLoading = false; 
			if (true) {
				checkForAdminMessageSetup();
				payment_method = "CC";
				$scope.noPaymentMethod = !!payment_method ? false :true;
			} else {
				//no deposit to pay
				$rootScope.skipDeposit = true;
				$state.go('preCheckinStatus');
			};
		};

		var onDepositFetchFailed = function() {
			$scope.netWorkError = true;
			$scope.isLoading = false; 
		};

		$scope.isLoading = true;
		

		guestDetailsService.fetchDepositDetails().then(function(response) {
			onDepositFetchSuccess();
		}, function() {
			$rootScope.netWorkError = true;
			$scope.isLoading = false;
		});
		//check if reservation has deposit else got to precheckin
		//
		

	};

	var dependencies = [
		'$scope', 'guestDetailsService', '$state', '$rootScope', '$stateParams', 'sntGuestWebSrv',
		checkinDepositPaymentController
	];

	sntGuestWeb.controller('checkinDepositPaymentController', dependencies);
})();