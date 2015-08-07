admin.controller('ADExternalPmsConnectivityCtrl',['$scope','$rootScope','$state','ADExternalPmsConnectivitySrv',  function($scope,$rootScope,$state,ADExternalPmsConnectivitySrv){


	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 8);
	$scope.successMessage = "";
  $scope.errorMessage = "";
    $scope.externalPmsConnectivityData = {};
   /*
    * Success callback of render
    * @param {object} pms connectivity details
    */
    $scope.successCallbackRender = function(data){
    	$scope.$emit('hideLoader');
    	$scope.externalPmsConnectivityData = data;
    };
   /**
    * Render external connectivity screen
    */
	$scope.renderExternalPmsConnectivity = function(){
		$scope.invokeApi(ADExternalPmsConnectivitySrv.getExternalPmsConnectivityDetails, {} , $scope.successCallbackRender);
	};
	//To render screen
	$scope.renderExternalPmsConnectivity();
   /*
    * To handle success call back of test connectivity
    */
	$scope.successCallbackConnectionTest = function(){
		$scope.$emit('hideLoader');
		$scope.errorMessage = "";
		//Success message to show connection valid
		$scope.successMessage = "Connection Valid";
	};
  $scope.failureCallbackConnectionTest = function(){
    $scope.$emit('hideLoader');
    $scope.successMessage = "";
    //Failure message to show connection invalid
    $scope.errorMessage = ["Invalid"];
  };
   /*
    * Function to test connectivity details
    */
    $scope.testConnectivity = function(){
   		$scope.invokeApi(ADExternalPmsConnectivitySrv.testConnectivity, $scope.externalPmsConnectivityData , $scope.successCallbackConnectionTest, $scope.failureCallbackConnectionTest);
    };

    $scope.successCallbackSave = function(){
      $scope.$emit('hideLoader');
      $scope.successMessage = "";
      $scope.errorMessage = "";
    };
   /*
    * Function to save connectivity
    */
    $scope.saveConnectivity = function(){
    	$scope.successMessage = "";
      $scope.errorMessage = "";
    	$scope.invokeApi(ADExternalPmsConnectivitySrv.saveConnectivity, $scope.externalPmsConnectivityData , $scope.successCallbackSave);
    };

}]);