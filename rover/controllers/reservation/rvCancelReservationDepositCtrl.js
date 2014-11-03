sntRover.controller('RVCancelReservationDepositController', ['$rootScope', '$scope','ngDialog','$stateParams','$state','RVReservationCardSrv',
	function($rootScope, $scope,ngDialog,$stateParams,$state,RVReservationCardSrv) {

		BaseCtrl.call(this, $scope);
		$scope.cancellationData = {};
		$scope.cancellationData.reason = "";
		$scope.errorMessage = "";


		var cancelReservation = function(cancellationParameters) {
			var onCancelSuccess = function(data) {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id,
					"confirmationId": $stateParams.confirmationId,
					"isrefresh": false
				});
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			}
			$scope.invokeApi(RVReservationCardSrv.cancelReservation, cancellationParameters, onCancelSuccess);
		}

		$scope.proceedWithDepositRefund = function(){
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id,
				with_deposit_refund:true
			};
			cancelReservation(cancellationParameters);
		};

		$scope.proceedWithOutDepositRefund = function(){
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id,
				with_deposit_refund:false
			};
			cancelReservation(cancellationParameters);
		};

		$scope.closeDialog = function(){
			ngDialog.close();
		};

}]);