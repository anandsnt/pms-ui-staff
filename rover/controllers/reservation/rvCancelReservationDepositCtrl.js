sntRover.controller('RVCancelReservationDepositController', ['$rootScope', '$scope','ngDialog','$stateParams',
	function($rootScope, $scope,ngDialog,$stateParams) {

		BaseCtrl.call(this, $scope);
		$scope.cancellationData = {};
		$scope.cancellationData.reason = "";

		var onCancelSuccess = function(data) {
			$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
				"id": $stateParams.id,
				"confirmationId": $stateParams.confirmationId,
				"isrefresh": false
			});
			$scope.closeDialog();
			$scope.$emit('hideLoader');
		};
		var onCancelFailure = function(data) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};

		$scope.proceedWithDepositRefund = function(){
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id
			};
			console.log(cancellationParameters);
			console.log($stateParams.confirmationId);
		};

		$scope.proceedWithOutDepositRefund = function(){
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id
			};
			console.log(cancellationParameters);
		};

		$scope.closeDialog = function(){
			ngDialog.close();
		};

}]);