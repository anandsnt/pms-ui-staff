
sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv','dashBoarddata','$rootScope', function($scope,RVDashboardSrv,dashBoarddata,$rootScope){



   $scope.init =  function(){

         	BaseCtrl.call(this, $scope);

            //setting the heading of the screen
          $scope.heading = "Dashboard";

          $scope.dashboardData = dashBoarddata.dashboardData;
          $scope.userDetails   = dashBoarddata.userDetails;
          $scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
          $scope.currencySymbol=dashBoarddata.userDetails.currency_code;  
          $rootScope.adminRole = dashBoarddata.userDetails.user_role;

          //update left nav bar
          $scope.$emit("updateRoverLeftMenu","dashboard");
          $scope.$emit("closeDrawer");
          
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

    