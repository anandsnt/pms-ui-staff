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
			console.log(data);
			$scope.totalCount = parseInt(data.number_of_rooms_configured);
			$scope.totalPage = Math.ceil($scope.totalCount/$scope.displyCount);
			$scope.total_number_of_rooms = data.total_number_of_rooms;

			$scope.is_add_available = data.is_add_available;
			$scope.data = data.rooms;
			//$scope.data = data.rooms;

			$scope.currentPage = params.page();
        	params.total($scope.totalCount);
            $defer.resolve($scope.data);

		};
		$scope.invokeApi(ADRoomSrv.fetchRoomList, getParams, fetchSuccessOfItemList);
	}


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
	}

	$scope.loadTable();
	


	/*var fetchSuccessOfRoomList = function(data){
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
	
	$scope.invokeApi(ADRoomSrv.fetchRoomList, {}, fetchSuccessOfRoomList, fetchFailedOfRoomList);	*/


}]);