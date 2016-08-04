admin.controller('ADServiceProviderUserListCtrl',['$scope','$rootScope', '$q' ,'$state','$stateParams', 'ADServiceProviderSrv', 'ngTableParams','$filter',  function($scope, $rootScope, $q, $state, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
	ADBaseTableCtrl.call(this, $scope, ngTableParams); 
	var init = function(){
	$scope.serviceProviderId = $stateParams.id;
	$scope.serviceProviderName = $stateParams.name;
	loadTable();
	};
	  
   /**
    * To fetch the list of users
    */
	var fetchTableData = function($defer, params){
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


	var loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        sorting: {
		            name: 'asc' // initial sorting
		        }
		    }, {
		        total: 0, // length of data
		        getData: fetchTableData
		    }
		);
	};
	
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
		$scope.invokeApi(ADServiceProviderSrv.activateInactivate, data , successCallbackActivateInactivate);
	};
   /**
    * To delete user
    * @param {int} index of the selected user
    * @param {string} user id
    */
	$scope.deleteUser = function(userId, index){
		var data = {
			"id": userId
		};
		var successDelete = function(){
			$scope.data.splice(index,1);
			$scope.$emit('hideLoader');			
		};
		$scope.invokeApi(ADServiceProviderSrv.deleteUser, data, successDelete );
	};

	init();
}]);