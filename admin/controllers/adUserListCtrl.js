admin.controller('ADUserListCtrl',['$scope','$rootScope', '$q' ,'$state','$stateParams', 'ADUserSrv', 'ngTableParams','$filter',  function($scope, $rootScope, $q, $state, $stateParams, ADUserSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
	$scope.hotel_id = $stateParams.id;
	$scope.isAdminSnt = false;
   /**
    * To check whether logged in user is sntadmin or hoteladmin
    */	
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
	}
   /**
    * To fetch the list of users
    */
	$scope.listUsers = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			
		    // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.users.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.users.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.users, params.orderBy()) :
		                                $scope.data.users;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
			
		};
		$scope.invokeApi(ADUserSrv.fetch, {} , successCallbackFetch);	
	};
	
   /**
    * Invoking function to list users
    */
	$scope.listUsers(); 
   /**
    * To Activate/Inactivate user
    * @param {string} user id 
    * @param {string} current status of the user
    * @param {num} current index
    */ 
	$scope.activateInactivate = function(userId, currentStatus, index){
		var nextStatus = (currentStatus == "true" ? "inactivate" : "activate");
		var data = {
			"activity": nextStatus,
			"id": userId
		};
		var successCallbackActivateInactivate = function(data){
			$scope.data.users[index].is_active = (currentStatus == "true" ? "false" : "true");
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
			"id": userId
		};
		var successDelete = function(){
			$scope.$emit('hideLoader');
			$scope.data.users.splice(index, 1);
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