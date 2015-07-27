admin.controller('ADLinkExistingUserCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	BaseCtrl.call(this, $scope);
	$scope.data = {};
	$scope.hotelId = $stateParams.id;
   /**
    * To Activate/Inactivate user
    * @param {string} user id
    * @param {string} current status of the user
    * @param {num} current index of user
    */
	$scope.linkExistingUser = function(){
		var data = $scope.data;
		var successCallback = function(data){
			$scope.$emit('hideLoader');
			$state.go('admin.users', { id: $stateParams.id });
		};
		$scope.invokeApi(ADUserSrv.linkExistingUser, data , successCallback);
	};

}]);