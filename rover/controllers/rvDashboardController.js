
sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv','dashBoarddata','$rootScope', '$filter', function($scope,RVDashboardSrv,dashBoarddata,$rootScope, $filter){
	
  //setting the heading of the screen
  $scope.heading = 'DASHBOARD_HEADING';

 	$scope.dashboardData = dashBoarddata.dashboardData;
 	$scope.userDetails   = dashBoarddata.userDetails;
	$scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
 	$scope.currencySymbol=dashBoarddata.userDetails.currency_code;	

  $rootScope.adminRole = dashBoarddata.userDetails.user_role;

   $scope.init =  function(){
		
         	BaseCtrl.call(this, $scope);
          $scope.$emit("updateIndex",0);
         	//Display greetings message based on current time
         	var d = new Date();
        	var time = d.getHours();
        	$scope.greetingsMessage = "";
        	if (time < 12){
        		$scope.greetingsMessage = 'GREETING_MORNING';
        	}
        	else if (time >= 12 && time < 16){
        		$scope.greetingsMessage = 'GREETING_AFTERNOON';
        	}
        	else{
        		$scope.greetingsMessage = 'GREETING_EVENING';
        	}
        	
        	

   };
   $scope.init();
   
   
	
}]);

    