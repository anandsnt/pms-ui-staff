admin.controller('adRoomListCtrl', ['$scope','adRoomSrv', function($scope, adRoomSrv){
	/*
	* Controller class for Room List
	*/

	$scope.errorMessage = '';

	
	//inheriting from base controller
	BaseCtrl.call(this, $scope);
	


	var fetchSuccessOfRoomList = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	var fetchFailedOfRoomList = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	
	$scope.invokeApi(adRoomSrv.fetchRoomList, {}, fetchSuccessOfRoomList, fetchFailedOfRoomList);	


}]);