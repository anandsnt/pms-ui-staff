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

/*
 * cancel click action
 */
$scope.cancelClicked = function(){
   ngDialog.close();
};
/*
 * verify credentials
 */
$scope.login = function(){
	
	var loginSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.isLoggedIn = true;
		// verify if hotel time is past midnight or not
		$scope.isTimePastMidnight = (data.is_show_warning ==="true") ? false: true;
	}	
	var data = {"password":$scope.password};

	$scope.invokeApi(RVEndOfDayModalSrv.login,data,loginSuccess);  
	
};
$scope.startEndOfDayProcess = function(){
	$scope.startProcess = true;

};

$scope.yesClick = function(){
	$scope.isTimePastMidnight = true
}

$scope.continueClicked = function(){
	
	$scope.startProcessEnabled = false;
	
// explicitly handled error callback to set $scope.startProcessEnabled
	var startProcessFailure = function(data){
		$scope.$emit('hideLoader');
		$scope.startProcess = false;
		$scope.errorMessage = data;
		$scope.startProcessEnabled = true;
		$rootScope.isCurrentUserChangingBussinessDate = false;

	};
	var startProcessSuccess = function(data){
		$scope.$emit('hideLoader');
		$rootScope.businessDate = data.hotel_business_date;
		$rootScope.$broadcast("bussinessDateChanged",$rootScope.businessDate);
		$rootScope.isCurrentUserChangingBussinessDate = false;
		$state.go('rover.dashboard', {}, {reload: true});
		ngDialog.close();
	}
	$rootScope.isCurrentUserChangingBussinessDate = true;
	$scope.invokeApi(RVEndOfDayModalSrv.startProcess,{},startProcessSuccess,startProcessFailure); 
};

}]);