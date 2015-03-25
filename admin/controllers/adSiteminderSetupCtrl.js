admin.controller('adSiteminderSetupCtrl',['$scope','adSiteminderSetupSrv','$state','$filter','$stateParams',function($scope,adSiteminderSetupSrv,$state,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;

  BaseCtrl.call(this, $scope);
  
  $scope.fetchSiteminderSetup = function(){
  	
    var fetchSiteminderSetupSuccessCallback = function(data) {
         $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.data = data;
        
  };
  $scope.emailDatas =[];
  $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {},fetchSiteminderSetupSuccessCallback);

  };
  $scope.fetchSiteminderSetup();
  
  $scope.saveSiteminderSetup = function(){
    
    var saveSiteminderSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
  };
  
    var saveSiteminderSetupFailureCallback = function(data) {
        $scope.isLoading = false;
        console.log('Siteminder Save Failed');
        $scope.$emit('hideLoader');
  };
  
  var unwantedKeys = ["available_trackers"];
  var saveData = dclone($scope.data, unwantedKeys);
  
  $scope.invokeApi(adSiteminderSetupSrv.saveSetup, saveData, saveSiteminderSetupSuccessCallback, saveSiteminderSetupFailureCallback);

  };
  
  $scope.testSiteminderSetup = function(){
    
    var testSiteminderSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        console.log('Siteminder Test Successful');
        console.log(data);
        $scope.$emit('hideLoader');
  };
    var testSiteminderSetupFailureCallback = function(data) {
        $scope.isLoading = false;
        console.log('Siteminder Test Failed');
        console.log(data);
        $scope.$emit('hideLoader');
  };
  var unwantedKeys = ["available_trackers"];
  var testData = dclone($scope.data, unwantedKeys);
  
  $scope.invokeApi(adSiteminderSetupSrv.testSetup, testData, testSiteminderSetupSuccessCallback, testSiteminderSetupFailureCallback);

  };

  }]);