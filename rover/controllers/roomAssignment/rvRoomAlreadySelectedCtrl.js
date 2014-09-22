sntRover.controller('rvRoomAlreadySelectedCtrl',['$scope','$state',  
	function($scope, $state){
	
	BaseCtrl.call(this, $scope);

	$scope.clickedCloseButton = function(){
		console.log("close button")
		$scope.closeDialog();
		$scope.assignRoom();
	};
	
	$scope.clickedCloseButtonAlreadySelected = function(){
		$scope.getRooms(true);
		$scope.closeDialog();
	};
	
	
}]);