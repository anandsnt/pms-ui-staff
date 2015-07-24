sntRover.controller('RVEndOfDayModalController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv','$state', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv,$state){

BaseCtrl.call(this, $scope);
$scope.userName = '';
$scope.password ='';
$scope.errorMessage='';
$scope.isLoggedIn = false;
$scope.startProcess = false;
$scope.startProcessEnabled = true;
$scope.businessDate = $filter('date')($rootScope.businessDate, $rootScope.dateFormat);
$scope.nextBusinessDate = tzIndependentDate($rootScope.businessDate);
$scope.nextBusinessDate.setDate($scope.nextBusinessDate.getDate()+1);
$scope.nextBusinessDate = $filter('date')($scope.nextBusinessDate, $rootScope.dateFormat);
$scope.isTimePastMidnight = true;
$rootScope.isCurrentUserChangingBussinessDate = true;
/*
 * cancel click action
 */
$scope.cancelClicked = function(){
   $rootScope.isCurrentUserChangingBussinessDate = false;
   ngDialog.close();
};
/*
 * verify credentials
 */
$scope.login = function(){
	$rootScope.$broadcast('showLoader');
	var loginSuccess = function(data){
		$rootScope.$broadcast('hideLoader');
		$scope.isLoggedIn = true;
		// verify if hotel time is past midnight or not
		$scope.isTimePastMidnight = (data.is_show_warning ==="true") ? false: true;
	}
	var loginFailure = function(data){
		$rootScope.$broadcast('hideLoader');
		$scope.errorMessage = data;
	}
	var data = {"password":$scope.password};

	$scope.invokeApi(RVEndOfDayModalSrv.login,data,loginSuccess,loginFailure);

};
$scope.startEndOfDayProcess = function(){
	$scope.startProcess = true;

};

$scope.yesClick = function(){
	$scope.isTimePastMidnight = true
}

$scope.continueClicked = function(){

	$scope.startProcessEnabled = false;
	$rootScope.$broadcast('showLoader');
// explicitly handled error callback to set $scope.startProcessEnabled
	var startProcessFailure = function(data){
		$rootScope.$broadcast('hideLoader');
		$scope.startProcess = false;
		$scope.errorMessage = data;
		$scope.startProcessEnabled = true;
	};
	var startProcessSuccess = function(data){
		$rootScope.$broadcast('hideLoader');
		$rootScope.isBussinessDateChanging = true;
		ngDialog.close();
	}
	$scope.invokeApi(RVEndOfDayModalSrv.startProcess,{},startProcessSuccess,startProcessFailure);
};

}]);