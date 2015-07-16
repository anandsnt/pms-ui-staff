admin.controller('ADiBeaconDetailsCtrl',['$scope','$stateParams','$rootScope','$state','beaconTypes','triggerTypes','beaconNeighbours','adiBeaconSettingsSrv','defaultBeaconDetails','beaconDetails',function($scope,$stateParams,$rootScope,$state,beaconTypes,triggerTypes,beaconNeighbours,adiBeaconSettingsSrv,defaultBeaconDetails,beaconDetails){

  $scope.init = function(){
    BaseCtrl.call(this, $scope);
    $scope.$emit('hideLoader');
    $scope.addmode = ($stateParams.action === "add")? true : false;
    if(!$scope.addmode){
      $scope.beaconId = $stateParams.action;
      $scope.isBeaconLinked = beaconDetails.is_linked;
    }
    else{
      $scope.isBeaconLinked = false;
    };
    $scope.displayMessage = $scope.addmode ? "Add new iBeacon" :"Edit iBeacon";
    $scope.isIpad = navigator.userAgent.match(/iPad/i) !== null && window.cordova;
    $scope.errorMessage = "";
    $scope.successMessage = "";

    $scope.beaconTypes = beaconTypes.results;
    $scope.triggerTypes = triggerTypes.results;
    $scope.beaconNeighbours = beaconNeighbours.results;
    $scope.data ={};
    $scope.data.status = false;
    $scope.data.description ="";
    $scope.data.title ="";
    $scope.fileName = "Choose file...";
  };
  $scope.init();

if(!$scope.addmode){
  $scope.data = beaconDetails;
   angular.forEach($scope.beaconNeighbours, function(beaconNeighbour, index) {
                if (beaconNeighbour.beacon_id ===$scope.beaconId) {
                  $scope.beaconNeighbours.splice(index,1);
                }
  });
 }
 else{
  $scope.data.proximity_id = defaultBeaconDetails.proximity_id;
  $scope.data.major_id = defaultBeaconDetails.major_id;
  $scope.data.minor_id = defaultBeaconDetails.minor_id;
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
    else if($scope.data.message.length>0){
      $scope.data.status = ! $scope.data.status;
    }


  };

  $scope.linkiBeacon =  function(){
    var successfullyLinked = function(data){
      $scope.isBeaconLinked = true;
      if(!$scope.addmode){
        $scope.linkBeacon();
      }else{
        $scope.$emit('hideLoader');
        $scope.successMessage = data.RVSuccess;
      }

      $scope.$apply();

    };
    var failedLinkage = function(data){
      $scope.$emit('hideLoader');
      $scope.errorMessage = [data.RVError];
      $scope.$apply();
      $scope.isBeaconLinked = false;
    };
    var args = [];

    args.push({
      "NewEstimoteID":{
      "proximityUUID": $scope.data.proximity_id,
      "majorID":$scope.data.major_id,
      "minorID":$scope.data.minor_id
      }

    });
    var options = {
      "successCallBack": successfullyLinked,
      "failureCallBack": failedLinkage,
      "arguments": args
    };
    $scope.$emit('showLoader');
    try{
      sntapp.iBeaconLinker.linkiBeacon(options);
    }
    catch(er){
      var error = {};
      error.RVError = er;
      failedLinkage(error);
    };
  };

  $scope.saveBeacon = function(){

      var updateData ={};
      var updateBeaconSuccess = function(data){
        if(!$scope.addmode){
          $scope.$emit('hideLoader');
          else$state.go('admin.ibeaconSettings');
        }else{
          $scope.beaconId = data.id;
          $scope.linkBeacon();
        }

      };
      var updateBeaconFailure = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
      };
      //unset title and description in case beacon is not promotion else unset message
      if($scope.data.type !=='PROMOTION'){
          $scope.data.title = "";
          $scope.data.description = "";
      }
      else{
          $scope.data.message = "";
      };
      var BeaconId = $scope.data.proximity_id+"-"+$scope.data.major_id+"-"+$scope.data.minor_id;
      if($scope.addmode){
        var unwantedKeys = ["major_id","minor_id","proximity_id"];
        updateData= dclone($scope.data, unwantedKeys);
        updateData.uuid = BeaconId;
        $scope.invokeApi(adiBeaconSettingsSrv.addBeaconDetails,updateData,updateBeaconSuccess,updateBeaconFailure);
      }
      else{
        updateData.id = $stateParams.action;
        var unwantedKeys = ["picture","majorid","minorid"];
        updateData.data= dclone($scope.data, unwantedKeys);
        updateData.data.uuid = BeaconId;
        // Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not
        if($scope.data.picture.indexOf("data:")!== -1){
          updateData.data.picture = $scope.data.picture;
        }

        $scope.invokeApi(adiBeaconSettingsSrv.updateBeaconDetails,updateData,updateBeaconSuccess,updateBeaconFailure);
      }
  };

  $scope.linkBeacon = function(){
    var linkBeaconSuccess = function(){
        $scope.$emit('hideLoader');
        if($scope.addmode){
          $state.go('admin.ibeaconSettings');
        }else{
          $scope.successMessage = data.RVSuccess;
        }
    }
    var linkBeaconFailure = function(){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    }
    var data = {};
    data.id = $scope.beaconId;
    data.is_linked = $scope.isBeaconLinked;
    $scope.invokeApi(adiBeaconSettingsSrv.setLink,data,linkBeaconSuccess,linkBeaconFailure);
  }

}]);