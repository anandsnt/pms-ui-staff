admin.controller('ADiBeaconDetailsCtrl',['$scope','$stateParams','$rootScope','$state','beaconTypes','triggerTypes','beaconNeighbours','adiBeaconSettingsSrv',function($scope,$stateParams,$rootScope,$state,beaconTypes,triggerTypes,beaconNeighbours,adiBeaconSettingsSrv){

  $scope.init = function(){
    BaseCtrl.call(this, $scope);
    $scope.addmode = ($stateParams.action === "add")? true : false;
    $scope.displayMessage = $scope.addmode ? "Add new iBeacon" :"Edit iBeacon";
    $scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
    $scope.errorMessage = "";

    $scope.beaconTypes = beaconTypes.results;
    $scope.triggerTypes = triggerTypes.results;
    $scope.beaconNeighbours = beaconNeighbours.results;
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
      $scope.data.neighbours = ["0","2"];
    };

    var fetchBeaconDetails = function(data){
      $scope.$emit('hideLoader');
      $scope.errorMessage = data;
    };

    $scope.invokeApi(adiBeaconSettingsSrv.fetchBeaconDetails, {"id":$stateParams.action}, fetchSuccessBeaconDetails,fetchBeaconDetails);
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
    else if($scope.data.description && $scope.data.title){
      if($scope.data.description.length>0 && $scope.data.title.length>0){
          $scope.data.status = ! $scope.data.status;
      }
    }
      
  };

  $scope.linkiBeacon =  function(){
    var successfullyLinked = function(){
      alert("successfullyLinked");
    };
    var failedLinkage = function(){
      alert("failedLinkage");
    };
    var args = [];
    args.push({
      "current_details":{"proximity_id":"XXXXXXXXX",
      "minor_id":"YYYYY",
      "major_id":"ZZZZZ"}
      
    });
    args.push({
      "new_details":{
      "proximity_id":"AAAAAAAA",
      "minor_id":"BBBBBB",
      "major_id":"CCCCC"
      }
     
    });
    var options = {
      "successCallBack": successfullyLinked,
      "failureCallBack": failedLinkage,
      "arguments": args
    };

    try{
      sntapp.iBeaconLinker.linkiBeacon(options);
    }
    catch(er){};
  };

  $scope.saveBeacon = function(){

      var updateData ={};
      var updateBeaconSuccess = function(){
        $scope.$emit('hideLoader');
        $state.go('admin.ibeaconSettings');
      };
      var updateBeaconFailure = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
      };
      if($scope.addmode){
        updateData = $scope.data;
        $scope.invokeApi(adiBeaconSettingsSrv.addBeaconDetails,updateData,updateBeaconSuccess,updateBeaconFailure);
      }
      else{
        updateData.id = $stateParams.action;
        var unwantedKeys = ["picture"];
        updateData.data= dclone($scope.data, unwantedKeys);
        // Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not
        if($scope.data.picture.indexOf("data:")!= -1){
          updateData.data.picture = $scope.data.picture;
        }

        $scope.invokeApi(adiBeaconSettingsSrv.updateBeaconDetails,updateData,updateBeaconSuccess,updateBeaconFailure);
      }
  };

}]);