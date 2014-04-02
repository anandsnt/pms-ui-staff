admin.controller('ADUserListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADUserSrv',  function($scope, $rootScope, $state, $stateParams, ADUserSrv){
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