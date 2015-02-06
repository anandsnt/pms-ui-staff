admin.controller('adAnalyticSetupCtrl',['$scope','adAnalyticSetupSrv','$state','$filter','$stateParams',function($scope,adAnalyticSetupSrv,$state,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;

  BaseCtrl.call(this, $scope);

  
  $scope.fetchAnalyticSetup = function(){
  	
    var fetchAnalyticSetupSuccessCallback = function(data) {
         $scope.isLoading = false;
        $scope.$emit('hideLoader');
        
        
  };
  $scope.emailDatas =[];
  $scope.invokeApi(adAnalyticSetupSrv.fetchSetup, {},fetchAnalyticSetupSuccessCallback);

  };
  // $scope.fetchAnalyticSetup();
  
  $scope.saveAnalyticSetup = function(){
    
    var saveAnalyticSetupSuccessCallback = function(data) {
         $scope.isLoading = false;
        $scope.$emit('hideLoader');
        
        
  };
  
  $scope.invokeApi(adAnalyticSetupSrv.saveSetup, {},saveAnalyticSetupSuccessCallback);

  };

  }]);