admin.controller('adZestAddonSetupCtrl',['$scope','adZestAddonSetupSrv','$state','$filter','$stateParams',function($scope,adZestAddonSetupSrv,$state,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;

  BaseCtrl.call(this, $scope);

  
  $scope.fetchAddonSetup = function(){
  	
    var fetchAddonSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.addonSetup = data;
        
  };
  $scope.invokeApi(adZestAddonSetupSrv.fetchSetup, {},fetchAnalyticSetupSuccessCallback);

  };
  $scope.fetchAddonSetup();
  
  $scope.saveAddonSetup = function(){
    
    var saveAddonSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        
        
  };
    
  $scope.invokeApi(adZestAddonSetupSrv.saveSetup, $scope.addonSetup,saveAddonSetupSuccessCallback);

  };

  }]);