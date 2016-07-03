(function() {
	var outstandingBalanceDetailsController = function($scope, $state, $rootScope,guestDetailsService) {


		var init = function() {
			var params = {
				'reservation_id': $rootScope.reservationID
			};
			//TO DO ----
			/*******************************************/
			$rootScope.reservationID = 100214;
			$rootScope.accessToken = '3b9b81823405849e79e7a6eab35212b0';
			$rootScope.outStandingBalance = 100;
			$scope.paymentMethodDetails = {
				"payment_method_used": "CC",
				"payment_details": {
					"card_type_image": "images/mc.png",
					"card_number": "5454",
					"card_expiry": "12/17",
					"card_name": "Resheil",
					"id":30961
				}
			}
			/*******************************************/
			if ($scope.paymentMethodDetails.payment_method_used === "CC" 
			    && $scope.paymentMethodDetails.payment_details.id !== null) {
				$scope.cardPresent = true;
			} else {
				$scope.cardPresent = false;
			};
			$scope.mode = "PAYMENT_MODE";
		}();

		$scope.goToNextPage = function() {
			$rootScope.KeyCountAttemptedToSave = true;
			$state.go('preCheckinStatus');
		};

		$scope.changeCard = function() {
			$scope.mode = "CC_ENTRY_MODE";
		};

		$scope.payBalance = function(){
			$scope.isLoading = true;

			var params = {
				"bill_number": 1,
				"payment_type": "CC",
				"amount": $rootScope.outStandingBalance,
				"payment_type_id": $scope.paymentMethodDetails.payment_details.id
			};
			//submit payment
			guestDetailsService.submitPayment(params).then(function(response) {
				$scope.isLoading = false;
				$scope.paymentSuccess = true;
			}, function() {
				$scope.isLoading = false;
				$scope.paymentError = true;
			});
		};


		/********************** card entry ***************************/
		$scope.saveCard = function(){

		};
		$scope.cancelCardEntry = function(){
			$scope.mode = "PAYMENT_MODE";
		};

	};

	var dependencies = [
		'$scope', '$state', '$rootScope','guestDetailsService',
		outstandingBalanceDetailsController
	];

	sntGuestWeb.controller('outstandingBalanceDetailsController', dependencies);
})();