
sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv','dashBoarddata','$rootScope', function($scope,RVDashboardSrv,dashBoarddata,$rootScope){

 
 	$scope.dashboardData = dashBoarddata.dashboardData;
 	$scope.userDetails   = dashBoarddata.userDetails;
	$scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
 	$scope.currencySymbol=dashBoarddata.userDetails.currency_code;	

  $rootScope.adminRole = dashBoarddata.userDetails.user_role;

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

    