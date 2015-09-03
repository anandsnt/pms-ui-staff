admin.controller('adZestAddonSetupCtrl',['$scope','adZestAddonSetupSrv','$state','$filter','$stateParams',function($scope,adZestAddonSetupSrv,$state,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;

  BaseCtrl.call(this, $scope);

  var startWatching = function(){
    $scope.$watch('addonSetup.is_zest_addon_actions_enabled', function(newValue, oldValue){
        if(!$scope.addonSetup.is_zest_addon_actions_enabled){
           $scope.addonSetup.is_zest_display_purchased_addons = false;
           $scope.addonSetup.is_zest_allow_cancellation_of_addons = false;
           $scope.addonSetup.is_zest_enable_purchase = false;
        }
   });
  };


  $scope.fetchAddonSetup = function(){

    var fetchAddonSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.addonSetup = data;
        startWatching();
  };
  $scope.invokeApi(adZestAddonSetupSrv.fetchSetup, {},fetchAddonSetupSuccessCallback);

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