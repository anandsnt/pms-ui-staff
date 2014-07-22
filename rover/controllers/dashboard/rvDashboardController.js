
sntRover.controller('RVdashboardController',['$scope', 'ngDialog', 'RVDashboardSrv', 'dashBoarddata','$rootScope', '$filter', '$state',  
                  function($scope, ngDialog, RVDashboardSrv, dashBoarddata,$rootScope, $filter, $state){
	
    console.log('in dashboard controlelr');
    //setting the heading of the screen
    $scope.heading = 'DASHBOARD_HEADING';

    //We are not showing the backbutton now, so setting as blank
    $scope.backButtonCaption = ''; //if it is not blank, backbutton will show, otherwise dont


    var that = this;
    $scope.shouldShowLateCheckout = true;
    BaseCtrl.call(this, $scope);
	
    var init =  function(){
	
       
		
          //setting the heading of the screen
        $scope.heading = "DASHBOARD_HEADING";

        $scope.dashboardData = dashBoarddata.dashboardData;
        $scope.userDetails   = dashBoarddata.userDetails;
        $scope.statisticsData = dashBoarddata.dashboardStatistics;
        $scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
        $scope.currencySymbol=dashBoarddata.userDetails.currency_code;  
        $rootScope.adminRole = dashBoarddata.userDetails.user_role;

        //update left nav bar
        $scope.$emit("updateRoverLeftMenu","dashboard");
        $scope.$emit("closeDrawer");
        var scrollerOptions = {click: true, preventDefault: false};
        $scope.setScroller('dashboard_scroller', scrollerOptions);
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
        	var title = "Showing Dashboard";	
           $scope.refreshScroller('dashboard_scroller');
			     $scope.setTitle(title);
        }, 2000);
		
        $state.go('rover.dashboard.manager');

   };

   init();
   
   $scope.gotosearch = function(){
   	$state.go("rover.search");
   	// rover.search({type:'DUEIN'});
   };


   /**
   * reciever function used to change the heading according to the current page
   * please be care to use the translation text as heading
   * param1 {object}, javascript event
   * param2 {String}, Heading to change
   */
   $scope.$on("UpdateHeading", function(event, data){
      event.stopPropagation();
      //chnaging the heading of the page
      $scope.heading = data;
   });

  /**
   * reciever function used to change the heading according to the current page
   * if there is any trnslation, please use that
   * param1 {object}, javascript event
   * param2 {String}, Backbutton's caption
   */
   $scope.$on("UpdateBackbuttonCaption", function(event, caption){
      event.stopPropagation();
      //chnaging the heading of the page
      $scope.backButtonCaption = caption; //if it is not blank, backbutton will show, otherwise dont
   });
      
    /**
    * function to handle click on backbutton in the header section
    * will broadcast an event, the logic of backbutto should be handled there
    */              
	$scope.headerBackButtonClicked = function(){
        $scope.$broadcast("HeaderBackButtonClicked");
    }
}]);

    