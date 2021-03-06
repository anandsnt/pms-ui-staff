sntRover.controller('RVCancelReservationDepositController', ['$rootScope', '$scope', 'ngDialog', '$stateParams', '$state', 'RVReservationCardSrv', 'RVPaymentSrv', '$timeout', 'RVNightlyDiarySrv',
	function($rootScope, $scope, ngDialog, $stateParams, $state, RVReservationCardSrv, RVPaymentSrv, $timeout, RVNightlyDiarySrv) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = "";

		$scope.cancellationData = {
			reason: "",
			locale: $scope.languageData.selected_language_code
		};

		$scope.DailogeState.isCancelled = false ;

		$scope.completeCancellationProcess = function() {
			if ($scope.DailogeState.isCancelled) {
				if ($state.current.name === 'rover.reservation.staycard.reservationcard.reservationdetails') {
					$stateParams.isrefresh = true;
					$state.reload($state.current.name);					
				} else {
					// CICO-58191
					$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
						id: $scope.reservationData.reservationId || $scope.reservationData.reservation_card.reservation_id,
						confirmationId: $scope.reservationData.confirmNum || $scope.reservationData.reservation_card.confirmation_num,
						isrefresh: true
					});
				}
				
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
