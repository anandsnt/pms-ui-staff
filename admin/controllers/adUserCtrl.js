admin.controller('ADUserListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADUserSrv',  function($scope, $rootScope, $state, $stateParams, ADUserSrv){
	BaseCtrl.call(this, $scope);
	$scope.hotel_id = $stateParams.id;
	$scope.isAdminSnt = false;
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
	}
   /**
    * To fetch the list of users
    */
	$scope.ListCtrl = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		};
		$scope.invokeApi(ADUserSrv.fetch, {} , successCallbackFetch, $scope.failureCallback);	
	};
   /**
    * Invoking function to list users
    */
	$scope.ListCtrl();
   /**
    * To handle common success call back
    */
	$scope.successCallback = function(data){
		$scope.$emit('hideLoader');
	};
   /**
    * To handle common failure call back
    */ 	
	$scope.failureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
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
		$scope.invokeApi(ADUserSrv.activateInactivate, data , successCallbackActivateInactivate, $scope.failureCallback);
	};	
   /**
    * To delete user
    * @param {string} user id 
    */ 
	$scope.deleteUser = function(userId){
		var data = {
			"id": userId
		};
		$scope.invokeApi(ADUserSrv.deleteUser, data , $scope.successCallback, $scope.failureCallback);
	};	
	$scope.clickBack = function(){
		$state.go("admin.hoteldetails");
	};

}]);