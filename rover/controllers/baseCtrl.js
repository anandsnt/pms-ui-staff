function BaseCtrl($scope){	

    
	$scope.fetchedCompleted = function(data){
		$scope.$emit('hideLoader');
	};

	$scope.clearErrorMessage = function(){
		$scope.errorMessage = '';
		$scope.successMessage = '';
	};
	$scope.clearErrorMessage();
	$scope.showErrorMessage = function(errorMessage){
		
	};

	$scope.fetchedFailed = function(errorMessage){
		$scope.$emit('hideLoader');
		if($scope.hasOwnProperty("errorMessage")){ 	
			$scope.errorMessage = errorMessage;
			$scope.successMessage = '';
		}
		else {
			$scope.$emit("showErrorMessage", errorMessage);
		}
	};


	$scope.invokeApi = function(serviceApi, params, successCallback, failureCallback, loaderType){
		//loaderType options are "BLOCKER", "NONE"
		if(typeof loaderType === 'undefined')
			loaderType = 'BLOCKER';
		if(loaderType.toUpperCase() == 'BLOCKER')
			$scope.$emit('showLoader');

		successCallback = (typeof successCallback ==='undefined') ? $scope.fetchedCompleted : successCallback;
		failureCallback = (typeof failureCallback ==='undefined') ? $scope.fetchedFailed : failureCallback;
		
		return serviceApi(params).then(successCallback, failureCallback);
		
	};


}