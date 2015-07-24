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
        $scope.data = data;

  };
  $scope.emailDatas =[];
  $scope.invokeApi(adAnalyticSetupSrv.fetchSetup, {},fetchAnalyticSetupSuccessCallback);

  };
  $scope.fetchAnalyticSetup();

  $scope.saveAnalyticSetup = function(){

    var saveAnalyticSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');


  };
  var unwantedKeys = ["available_trackers"];
  var saveData = dclone($scope.data, unwantedKeys);

  $scope.invokeApi(adAnalyticSetupSrv.saveSetup, saveData,saveAnalyticSetupSuccessCallback);

  };

  }]);