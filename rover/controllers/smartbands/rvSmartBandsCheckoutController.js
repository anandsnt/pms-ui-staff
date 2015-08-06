sntRover.controller('RVSmartBandsCheckoutController', ['$scope', '$state', '$stateParams', 'RVSmartBandSrv',
function($scope, $state, $stateParams, RVSmartBandSrv) {
	BaseCtrl.call(this, $scope);
	$scope.getBalanceSmartBandSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.remainingSmartBands = data.results;
	};
	$scope.showBalanceSmartBands = function(){
		var dataToApi = {
			'reservationId':$scope.reservation.reservation_card.reservation_id
		};
		$scope.invokeApi(RVSmartBandSrv.getBalanceSmartBands, dataToApi, $scope.getBalanceSmartBandSuccess);
	};
	$scope.showBalanceSmartBands();
	$scope.cashOutSmartBandSuccess = function(){
		var reservationId = $scope.reservation.reservation_card.reservation_id;
		$scope.$emit('hideLoader');
		$scope.closeDialog();
		$state.go("rover.reservation.staycard.billcard", {"reservationId" : reservationId, "clickedButton": $scope.clickedButton});
	};
	$scope.clickCreditToRoom = function(){
		var reservationId = $scope.reservation.reservation_card.reservation_id;
		$scope.invokeApi(RVSmartBandSrv.cashOutSmartBalance, reservationId, $scope.cashOutSmartBandSuccess);
	};

}]);
