admin.controller('ADServiceProviderUserListCtrl',['$scope','$rootScope', '$q' ,'$state','$stateParams', 'ADServiceProviderSrv', 'ngTableParams','$filter',  function($scope, $rootScope, $q, $state, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
	$scope.serviceProviderId = $stateParams.id;
	$scope.serviceProviderName = $stateParams.name;
	ADBaseTableCtrl.call(this, $scope, ngTableParams);   
   /**
    * To fetch the list of users
    */
	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		getParams.service_provider_id = $scope.serviceProviderId;
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.data = data.users;
			$scope.currentPage = params.page();
        	params.total(data.total_count);
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADServiceProviderSrv.fetch, getParams, successCallbackFetch);
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

	$scope.loadTable();
   /**
    * To Activate/Inactivate user
    * @param {string} user id
    * @param {string} current status of the user
    * @param {num} current index
    */
	$scope.activateInactivate = function(userId, currentStatus, index){
		var nextStatus = (currentStatus === "true" ? "inactivate" : "activate");
		var data = {
			"activity": nextStatus,
			"id": userId
		};
		var successCallbackActivateInactivate = function(data){
			$scope.data[index].is_active = (currentStatus === "true" ? "false" : "true");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADUserSrv.activateInactivate, data , successCallbackActivateInactivate);
	};
   /**
    * To delete user
    * @param {int} index of the selected user
    * @param {string} user id
    */
	$scope.deleteUser = function(index, userId){
		var data = {
			"id": userId,
			"index": index
		};
		var successDelete = function(){
			$scope.$emit('hideLoader');
			//To refresh the user list
			$scope.listUsers();
		};
		$scope.invokeApi(ADUserSrv.deleteUser, data, successDelete );
	};


	/**
    * Handle back action
    */
	$scope.clickBack = function(){
		$state.go("admin.hoteldetails");
	};

}]);