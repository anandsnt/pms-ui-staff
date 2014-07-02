sntRover.controller('reservationListController',['$scope', function($scope){
	BaseCtrl.call(this, $scope);
	$scope.setScroller('resultListing');
	
	
	 //update left nav bar
	$scope.$emit("updateRoverLeftMenu","");
	
	$scope.$on('RESERVATIONLISTUPDATED', function(event) {
		setTimeout(function(){
			$scope.refreshScroller('resultListing');
			}, 
		500);
		
	});
}]);