
sntRover.controller('RVdashboardController',['$scope', 'ngDialog', 'RVDashboardSrv','dashBoarddata','$rootScope', '$filter', '$state',  
                  function($scope, ngDialog, RVDashboardSrv,dashBoarddata,$rootScope, $filter, $state){
	
    //setting the heading of the screen
    $scope.heading = 'DASHBOARD_HEADING';
	
	BaseCtrl.call(this, $scope);
	
    $scope.init =  function(){
		
       
       
		
          //setting the heading of the screen
        $scope.heading = "DASHBOARD_HEADING";

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
      		$scope.greetingsMessage = 'GREETING_MORNING';
      	}
      	else if (time >= 12 && time < 16){
      		$scope.greetingsMessage = 'GREETING_AFTERNOON';
      	}
      	else{
      		$scope.greetingsMessage = 'GREETING_EVENING';
      	}
      	//ADDED Time out since translation not working without time out
        setTimeout(function(){
        	var title = $filter('translate')('SHOWING_DASHBOARD_TITLE');
        	console.log("jjjjjjjjjjjjjjjjj")
			$scope.setTitle(title);
        }, 2000);
		
        	

   };
   $scope.init();
   
   $scope.gotosearch = function(){
   	$state.go("rover.search");
   	// rover.search({type:'DUEIN'});
   };
   
   
	
}]);

    