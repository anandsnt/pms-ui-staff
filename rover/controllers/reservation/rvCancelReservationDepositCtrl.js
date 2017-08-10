sntRover.controller('RVCancelReservationDepositController', ['$rootScope', '$scope', 'ngDialog', '$stateParams', '$state', 'RVReservationCardSrv', 'RVPaymentSrv', '$timeout', '$filter', 'RVNightlyDiarySrv',
	function($rootScope, $scope, ngDialog, $stateParams, $state, RVReservationCardSrv, RVPaymentSrv, $timeout, $filter, RVNightlyDiarySrv) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = "";

		$scope.cancellationData = {
			reason: ""
		};

		$scope.DailogeState.isCancelled = false ;

		$scope.completeCancellationProcess = function() {

			if ($scope.DailogeState.isCancelled) {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id || $scope.reservationData.reservationId,
					"confirmationId": $stateParams.confirmationId || $scope.reservationData.confirmNum,
					"isrefresh": false
				});
			}
			$scope.closeDialog();
		};

		var cancelReservation = function(with_deposit_refund) {

			var onCancelSuccess = function(data) {
				// OnCancelsuccess NgDialog shows sendcancelation as well as printcancelation pop up
				// Since RVCancelReservation and RVCancelReservationDepositController do the same above,
				// its functions are written in parent controller.Ie reservationActionsController
				$scope.DailogeState.isCancelled = true ;

				var params = RVNightlyDiarySrv.getCache();

				if (typeof params !== 'undefined') {
					params.currentSelectedReservationId = "";
	                params.currentSelectedRoomId = "";
	                params.currentSelectedReservation = "";
				}
                

                RVNightlyDiarySrv.updateCache(params);

				$scope.$emit('hideLoader');
			};

			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id || $scope.reservationData.reservationId,
				application: "ROVER"
			};

			cancellationParameters.with_deposit_refund = with_deposit_refund;
			$scope.invokeApi(RVReservationCardSrv.cancelReservation, cancellationParameters, onCancelSuccess);
		};

		$scope.proceedWithDepositRefund = function() {
			var	with_deposit_refund = true;

			cancelReservation(with_deposit_refund);
		};

		$scope.proceedWithOutDepositRefund = function() {
			var	with_deposit_refund = false;

			cancelReservation(with_deposit_refund);
		};

		$scope.closeDialog = function() {
			ngDialog.close();
		};

}]);