sntRover.controller('RVEndOfDayModalController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv){

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
	
	var loginSuccess = function(){
		$scope.$emit('hideLoader');
		$scope.isLoggedIn = true;
	}
	var data = {"email":$scope.email,"password":$scope.password};

	$scope.invokeApi(RVEndOfDayModalSrv.login,data,loginSuccess);  
	
};
$scope.startEndOfDayProcess = function(){
	$scope.startProcess = true;
};

$scope.continueClicked = function(){
	$scope.startProcessEnabled = false;
	$scope.startProcess = false;

	var startProcessSuccess = function(){
		$scope.$emit('hideLoader');
		ngDialog.close();
		//reload app
	};
	var startProcessFailure = function(){
		$scope.$emit('hideLoader');
		$scope.errorMessage = ["Failed"];
		$scope.startProcessEnabled = true;

	};
	$scope.invokeApi(RVEndOfDayModalSrv.startProcess,{},startProcessSuccess,startProcessFailure); 
};

}]);