sntRover.controller('rvRoomAlreadySelectedCtrl',['$scope','$state',
	function($scope, $state){

	BaseCtrl.call(this, $scope);

	$scope.clickedCloseButton = function(){

		$scope.closeDialog();
		$scope.goToNextView();
	};

	$scope.clickedCloseButtonAlreadySelected = function(){
		$scope.getRooms(true);
		$scope.closeDialog();
	};


}]);