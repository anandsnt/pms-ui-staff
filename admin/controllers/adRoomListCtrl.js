admin.controller('adRoomListCtrl', ['$scope','ADRoomSrv', 'ngTableParams', '$filter', function($scope, ADRoomSrv, ngTableParams, $filter){
	/*
	* Controller class for Room List
	*/

	$scope.errorMessage = '';

	
	//inheriting from base controller
	BaseCtrl.call(this, $scope);
	


	var fetchSuccessOfRoomList = function(data){
		$scope.data = data;
		//applying sorting functionality in room list
		$scope.roomList = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.rooms.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.rooms.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.rooms, params.orderBy()) :
		                                $scope.data.rooms;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });		
		$scope.$emit('hideLoader');
	};
	
	var fetchFailedOfRoomList = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	
	$scope.invokeApi(ADRoomSrv.fetchRoomList, {}, fetchSuccessOfRoomList, fetchFailedOfRoomList);	


}]);