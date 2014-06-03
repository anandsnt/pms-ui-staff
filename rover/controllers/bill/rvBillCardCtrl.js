sntRover.controller('RVbillCardController',['$scope','$state','RVBillCardSrv','reservationBillData', function($scope,$state, RVBillCardSrv, reservationBillData){
	
	BaseCtrl.call(this, $scope);
	$scope.reservationBillData = reservationBillData;
	$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
	$scope.incomingRoutingArrayCount = $scope.reservationBillData.routing_array.length;
	 
}]);