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
  $scope.addonSetup = {};
  $scope.addonSetup.is_guest_actions_enabled = true;
  $scope.addonSetup.is_display_purchased_enabled = true;
  $scope.addonSetup.is_cancel_purchased_enabled = true;
  $scope.addonSetup.is_purchase_enabled = true;

  // $scope.invokeApi(adZestAddonSetupSrv.fetchSetup, {},fetchAnalyticSetupSuccessCallback);

  };
  $scope.fetchAddonSetup();
  
  $scope.saveAddonSetup = function(){
    
    var saveAddonSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        
        
  };
  // var unwantedKeys = ["available_trackers"];
  // var saveData = dclone($scope.data, unwantedKeys);
  
  $scope.invokeApi(adZestAddonSetupSrv.saveSetup, $scope.addonSetup,saveAddonSetupSuccessCallback);

  };

  }]);