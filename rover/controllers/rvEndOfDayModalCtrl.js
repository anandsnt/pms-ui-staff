sntRover.controller('RVEndOfDayModalController', ['$scope','ngDialog','$rootScope','$filter', function($scope,ngDialog,$rootScope,$filter){

BaseCtrl.call(this, $scope);
$scope.userName = '';
$scope.password ='';
$scope.errorMessage='';
$scope.isLoggedIn = false;
$scope.startProcess = false;
$scope.startProcessEnabled = true;
$scope.businessDate = $rootScope.businessDate;
$scope.nextBusinessDate = tzIndependentDate($rootScope.businessDate);
$scope.nextBusinessDate.setDate($scope.nextBusinessDate.getDate()+1);
$scope.nextBusinessDate = $filter('date')($scope.nextBusinessDate, 'yyyy-MM-dd');


/*
 * cancel click action
 */
$scope.cancelClicked = function(){
   ngDialog.close();
};

$scope.login = function(){
	$scope.isLoggedIn = true;
};
$scope.startEndOfDayProcess = function(){
	$scope.startProcess = true;
};

$scope.continueClicked = function(){
	$scope.startProcessEnabled = false;
	$scope.startProcess = false;
};

// $scope.updateSettings = function(){
// 	var updateUserInfoSuccessCallback = function(data){
// 		$scope.cancelClicked();
// 	    $scope.$emit('hideLoader');
// 	};
// 	var updateUserInfoFailureCallback = function(data){
// 		 $scope.errorMessage=data;
// 	    $scope.$emit('hideLoader');
// 	};
// 	$scope.invokeApi(RVSettingsSrv.updateUserInfo,{'new_password' :$scope.newPassword},updateUserInfoSuccessCallback,updateUserInfoFailureCallback);  
// 	};

}]);