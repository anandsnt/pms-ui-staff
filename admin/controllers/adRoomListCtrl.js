admin.controller('adRoomListCtrl', ['$scope','ADRoomSrv', 'ngTableParams', '$filter', function($scope, ADRoomSrv, ngTableParams, $filter){
	/*
	* Controller class for Room List
	*/

	$scope.errorMessage = '';
	//inheriting from base table controller
	ADBaseTableCtrl.call(this, $scope, ngTableParams);


	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			//No expanded rate view
			$scope.currentClickedElement = -1;
			$scope.totalCount = parseInt(data.total_count);
			$scope.totalPage = Math.ceil($scope.totalCount/$scope.displyCount);
			$scope.numberOfRoomsConfigured = data.number_of_rooms_configured;
			$scope.totalNumberOfConfigurableRooms = data.total_number_of_rooms;
			$scope.is_add_available = data.is_add_available;
			$scope.data = data.rooms;

			$scope.currentPage = params.page();
        	params.total($scope.totalCount);
            $defer.resolve($scope.data);

		};
		$scope.invokeApi(ADRoomSrv.fetchRoomList, getParams, fetchSuccessOfItemList);
	};


	$scope.loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        sorting: {
		            name: 'asc' // initial sorting
		        }
		    }, {
		        total: 0, // length of data
		        getData: $scope.fetchTableData
		    }
		);
	};
	$scope.deleteRoom = function(index, room_id){
			var successCallBack = function(){
			$scope.$emit('hideLoader');
			$scope.data.splice(index, 1);
			$scope.tableParams.page(1);
		};
	$scope.invokeApi(ADRoomSrv.deleteRoom, {'room_id': room_id}, successCallBack);
	};
	$scope.loadTable();
}]);