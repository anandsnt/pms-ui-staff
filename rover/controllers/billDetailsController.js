sntRover.controller('billDetailsController',['$scope','$stateParams','$location','$state', function($scope,$stateParams,$location,$state){
	
	$scope.billIndex = $stateParams.billNo-1;
	
	$scope.bill = $scope.data.bills[$scope.billIndex];
		
}]);
