admin.controller('ADLinkExistingUserCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	BaseCtrl.call(this, $scope);
	$scope.data = {};
	$scope.hotel_id = $stateParams.id;
   /**
    *   Failure callback function
    *   @param {String} errorMessage from server
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
	$scope.linkExistingUser = function(){
		var data = $scope.data;
		var successCallback = function(data){
			$scope.$emit('hideLoader');
			
		};
		$scope.invokeApi(ADUserSrv.linkExistingUser, data , successCallback, $scope.failureCallback);
	};	

}]);