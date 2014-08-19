sntRover.controller('RVCancelReservation', ['$rootScope', '$scope', '$stateParams', 'RVPaymentSrv', '$timeout',
	function($rootScope, $scope, $stateParams, RVPaymentSrv, $timeout) {

		BaseCtrl.call(this, $scope);

		$scope.cancellationData = {
			selectedCard: -1,
			viewCardsList: false
		}

		$scope.setScroller('cardsList');

		var refreshCardsList = function() {
			$timeout(function() {
				$scope.refreshScroller('cardsList');
			}, 300)
		}

		var onFetchPaymentsSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.paymentData = data;
			if ($scope.paymentData.existing_payments.length > 0) {
				$scope.ngDialogData.cards = true;
				$scope.cancellationData.viewCardsList = true;
				refreshCardsList();
			}
			$scope.ngDialogData.state = 'PENALTY';
		}

		$scope.applyPenalty = function() {
			var reservationId = $stateParams.id;
			$scope.invokeApi(RVPaymentSrv.getPaymentList, reservationId, onFetchPaymentsSuccess);
		}

		$scope.cancelReservation = function() {
			console.log('cancel Reservation');
		}

		$scope.chargePenalty = function() {
			/**
			 * TODO : 	1.	Make calls to the appropriate API
			 * 			2.	Handle cancellation success
			 * 			3.	Handle cancellation failure
			 */
			console.log("Implementation of chargePenalty is pending!....");
		}



	}
]);