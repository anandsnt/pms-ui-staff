
sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv','dashBoarddata', function($scope,RVDashboardSrv,dashBoarddata){

 	$scope.dashboardData = dashBoarddata.dashboardData;
 	$scope.userDetails   = dashBoarddata.userDetails;
	$scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
 	$scope.currencySymbol=getCurrencySign(dashBoarddata.userDetails.currency_code);	



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
	
}]);

    