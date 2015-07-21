sntRover.controller('RVCancelReservationDepositController', ['$rootScope', '$scope','ngDialog','$stateParams','$state','RVReservationCardSrv','RVPaymentSrv','$timeout','$filter',
	function($rootScope, $scope,ngDialog,$stateParams,$state,RVReservationCardSrv,RVPaymentSrv,$timeout,$filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = "";

		$scope.cancellationData = {
			reason: ""
		};

		var cancelReservation = function(with_deposit_refund) {
			var onCancelSuccess = function(data) {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id || $scope.reservationData.reservationId,
					"confirmationId": $stateParams.confirmationId || $scope.reservationData.confirmNum,
					"isrefresh": false
				});
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			};

			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id || $scope.reservationData.reservationId
			};
			cancellationParameters.with_deposit_refund = with_deposit_refund;
			$scope.invokeApi(RVReservationCardSrv.cancelReservation, cancellationParameters, onCancelSuccess);
		};

		$scope.proceedWithDepositRefund = function(){
			var	with_deposit_refund = true;
			cancelReservation(with_deposit_refund);
		};

		$scope.proceedWithOutDepositRefund = function(){
			var	with_deposit_refund = false;
			cancelReservation(with_deposit_refund);
		};

		$scope.closeDialog = function(){
			ngDialog.close();
		};

}]);