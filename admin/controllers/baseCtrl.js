function BaseCtrl($scope){

	$scope.fetchedCompleted = function(data){
		$scope.$emit('hideLoader');
	};

	$scope.fetchedFailed = function(errorMessage){
		$scope.$emit('hideLoader');
		if(typeof $scope.errorMessage !== 'undefined'){ 
			$scope.errorMessage = errorMessage;
		}
		else {
			$scope.$emit("showErrorMessage", [errorMessage]);
		}
	};


	$scope.executeApi = function(serviceApi, params, successCallback, failureCallback){
		$scope.$emit('showLoader');
		successCallback = (typeof successCallback ==='undefined') ? $scope.fetchedCompleted : successCallback;
		failureCallback = (typeof failureCallback ==='undefined') ? $scope.fetchedFailed : failureCallback;
		
		return serviceApi(params).then(successCallback, failureCallback);
		
	}
}