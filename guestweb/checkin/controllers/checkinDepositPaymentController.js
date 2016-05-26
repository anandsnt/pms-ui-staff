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

	    var payment_method_id = "";
		var payment_method_used = "";
		var deposit_amount = "";
		var card_type ="";


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

			var params = {
				"bill_number": 1,
				"payment_type": payment_method_used,
				"amount": deposit_amount,
				"payment_type_id": payment_method_id
			};
			(payment_method_used === "CC")? params.credit_card_type = card_type : "";

			//submit payment
			guestDetailsService.submitPayment(params).then(function(response) {
				$scope.isLoading = false;
				onSucess(response);
			}, function() {
				$scope.isLoading = false;
				onFailure();
			});
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
			if (!!response.deposit_policy && parseInt(response.deposit_amount, 10) > 0) {
				checkForAdminMessageSetup();
				if(!!response.payment_method_used){
					$scope.noPaymentMethod = false;
					payment_method_used = response.payment_method_used;
					payment_method_id = response.payment_method_id;
					deposit_amount = response.deposit_amount;
					card_type = !!response.card_type ? response.card_type.toUpperCase() :"";
					$scope.depositAmount = response.currency_symbol+response.deposit_amount;
				}
				else{
					$scope.noPaymentMethod = true;
				}
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
		
		//check if reservation has deposit else got to precheckin
		guestDetailsService.fetchDepositDetails().then(function(response) {
			onDepositFetchSuccess(response);
		}, function() {
			$rootScope.netWorkError = true;
			$scope.isLoading = false;
		});
		
	};

	var dependencies = [
		'$scope', 'guestDetailsService', '$state', '$rootScope', '$stateParams', 'sntGuestWebSrv',
		checkinDepositPaymentController
	];

	sntGuestWeb.controller('checkinDepositPaymentController', dependencies);
})();