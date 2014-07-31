admin.controller('ADiBeaconDetailsCtrl',['$scope','$stateParams','$rootScope','$state','beaconTypes','triggerTypes','beaconNeighbours','adiBeaconSettingsSrv',function($scope,$stateParams,$rootScope,$state,beaconTypes,triggerTypes,beaconNeighbours,adiBeaconSettingsSrv){

  $scope.init = function(){
    BaseCtrl.call(this, $scope);
    $scope.addmode = ($stateParams.action === "add")? true : false;
    if(!$scope.addmode){
      $scope.beaconId = $stateParams.action;
    };
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

 var fetchFailedBeaconDetails = function(data){
    $scope.$emit('hideLoader');
    $scope.errorMessage = data;
  };

 if(!$scope.addmode){
    var fetchSuccessBeaconDetails = function(data){
      $scope.$emit('hideLoader');
      $scope.data = data;
      //remove the beacon being edited
      angular.forEach($scope.beaconNeighbours, function(beaconNeighbour, index) {
                if (beaconNeighbour.id ==$scope.beaconId) {
                  $scope.beaconNeighbours.splice(index,1);
                }
        });
    };

    $scope.invokeApi(adiBeaconSettingsSrv.fetchBeaconDetails, {"id":$stateParams.action}, fetchSuccessBeaconDetails,fetchFailedBeaconDetails);
  }
  else{
    var fetchSuccessBeaconDeafultDetails = function(data){
      $scope.$emit('hideLoader');
      $scope.data.proximity_id = data.proximity_id;
      $scope.data.major_id = data.major_id;
      $scope.data.minor_id = data.minor_id;
 
    };
    $scope.invokeApi(adiBeaconSettingsSrv.fetchBeaconDeafultDetails, {}, fetchSuccessBeaconDeafultDetails,fetchFailedBeaconDetails);
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
    var successfullyLinked = function(data){
      alert("successfullyLinked");
      alert(data);
    };
    var failedLinkage = function(data){
      alert("failedLinkage");
      alert(data);
    };
    var args = [];
/*    args.push({
      "CurrentEstimoteID":{
      "proximityUUID":"B9407F30-F5F8-466E-AFF9-25556B57FE6D",
      "majorID":"",
      "minorID":""}
      
    });*/
    args.push({
      "NewEstimoteID":{
      "proximityUUID":"d8d038ae-7eba-46bb-bca0-4cbc30b67590",
      "majorID":"29454",
      "minorID":"49790"
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
        if($scope.data.picture.indexOf("data:")!= -1){
          updateData.data.picture = $scope.data.picture;
        }

        $scope.invokeApi(adiBeaconSettingsSrv.updateBeaconDetails,updateData,updateBeaconSuccess,updateBeaconFailure);
      }
  };

}]);