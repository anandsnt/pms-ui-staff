admin.controller('ADiBeaconDetailsCtrl',['$scope','$stateParams','$rootScope','$state','beaconTypes','triggerTypes','adiBeaconSettingsSrv',function($scope,$stateParams,$rootScope,$state,beaconTypes,triggerTypes,adiBeaconSettingsSrv){

  $scope.init = function(){
    BaseCtrl.call(this, $scope);
    $scope.addmode = ($stateParams.action === "add")? true : false;
    $scope.displayMessage = $scope.addmode ? "Add new iBeacon" :"Edit"+" "+$stateParams.action;
    $scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
    $scope.errorMessage = "";

    $scope.beaconTypes = beaconTypes.results;
    $scope.triggerTypes = triggerTypes.results;
    ////////////////////
    $scope.isIpad = true;
    ////////////////////  
    $scope.data ={};
    $scope.data.status = false;
    $scope.data.description ="";
    $scope.data.title ="";
  };
  $scope.init();


  if(!$scope.addmode){
    var fetchSuccessBeaconDetails = function(data){
      $scope.$emit('hideLoader');
      $scope.data = data;
    };

    var fetchBeaconDetails = function(data){
      $scope.$emit('hideLoader');
      $scope.errorMessage = data;
    };

    $scope.invokeApi(adiBeaconSettingsSrv.fetchBeaconDetails, {}, fetchSuccessBeaconDetails,fetchBeaconDetails);
  }

	/**
    *   Method to go back to previous state.
    */
  $scope.backClicked = function(){
    
    if($rootScope.previousStateParam){
      $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
    }
    else if($rootScope.previousState){
      $state.go($rootScope.previousState);
    }
    else 
    {
      $state.go('admin.dashboard', {menu : 0});
    }
  
  };

  /**
    *   Activate option is only available when description and title are filled.
    */

  $scope.toggleStatus = function(){

    if($scope.data.status){
      $scope.data.status = false;
    }
    else if($scope.data.description.length>0 && $scope.data.title.length>0){
      $scope.data.status = ! $scope.data.status;
    }
      
  };

}]);