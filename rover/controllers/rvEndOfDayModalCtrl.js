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
$scope.isTimePastMidnight = true;

/*
 * cancel click action
 */
$scope.cancelClicked = function(){
   ngDialog.close();
};

$scope.login = function(){
	
	var loginSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.isLoggedIn = true;
		// verify if hotel time is past midnight or not
		var currentHotelTime = data.current_hotel_time.substring(0, 2);
		$scope.isTimePastMidnight = parseInt(currentHotelTime) > 12 ? true: false;
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

	var startProcessFailure = function(data){
		$scope.$emit('hideLoader');
		$scope.errorMessage = data;
		$scope.startProcessEnabled = true;

	};
	var startProcessSuccess = function(data){
		$scope.$emit('hideLoader');
		$rootScope.businessDate = data.hotel_business_date;
		ngDialog.close();
	}
	
	$scope.invokeApi(RVEndOfDayModalSrv.startProcess,{},startProcessSuccess,startProcessFailure); 
};

}]);