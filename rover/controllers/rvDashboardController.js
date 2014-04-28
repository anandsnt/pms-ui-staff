sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv', function($scope,RVDashboardSrv){
	
	

   $scope.init =  function(){

   	BaseCtrl.call(this, $scope);
   	//Display greetings message based on current time
   	var d = new Date();
  	var time = d.getHours();
  	$scope.greetingsMessage = "";
  	if (time < 12){
  		$scope.greetingsMessage = "Good Morning";
  	}
  	else if (time >= 12 && time < 16){
  		$scope.greetingsMessage = "Good Afternoon";
  	}
  	else{
  		$scope.greetingsMessage = "Good Evening";
  	}

   };
   $scope.init();

	/*
   * fetch details
   */
	$scope.fetchData = function(){
		
		var fetchDashboardDetailsSuccessCallback = function(data){
			$scope.dashboardData = data.dashboardData;
			$scope.userDetails   = data.userDetails;
			$scope.lateCheckoutDetails = data.lateCheckoutDetails;
			$scope.currencySymbol=getCurrencySign(data.userDetails.currency_code);
			$scope.$emit('hideLoader');
		};
		var fetchDashboardDetailsFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(RVDashboardSrv.fetchDashboardDetails, {},fetchDashboardDetailsSuccessCallback,fetchDashboardDetailsFailureCallback);	
		
	};
	
	$scope.fetchData();
	
}]);

    