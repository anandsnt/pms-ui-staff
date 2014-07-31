
sntRover.controller('RVdashboardController',['$scope', 'ngDialog', 'RVDashboardSrv', 'RVSearchSrv', 'dashBoarddata','$rootScope', '$filter', '$state',  
                  function($scope, ngDialog, RVDashboardSrv, RVSearchSrv, dashBoarddata,$rootScope, $filter, $state){
	
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
		
        //TODO: Add conditionally redirecting from API results
        $state.go('rover.dashboard.housekeeping');

        //TODO: delete the code below and use the function
        //$state.go('rover.dashboard.manager');

        //reddirectToDefaultDashboard();

   };

   $scope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
        $scope.errorMessage = 'Sorry the feature you are looking for is not implemented yet, or some  errors are occured!!!';
   });

   var reddirectToDefaultDashboard = function(){
        var defaultDashboardMappedWithStates = {
          'FRONT_DESK': 'rover.dashboard.frontdesk',
          'MANAGER': 'rover.dashboard.manager',
        }
        if($rootScope.default_dashboard in defaultDashboardMappedWithStates){
            $state.go(defaultDashboardMappedWithStates[$rootScope.default_dashboard]);
        }
        else{

        }
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
    * function to handle click on backbutton in the header section
    * will broadcast an event, the logic of backbutto should be handled there
    */              
	 $scope.headerBackButtonClicked = function(){
        $scope.$broadcast("HeaderBackButtonClicked");
    }


    /**
    * successcall back of late checkout click button's webserive call
    */
    var successCallbackOfLateCheckoutFetch = function(data){
        $scope.$emit('hideLoader');
        $scope.$broadcast("updateDashboardSearchDataFromExternal", data);

        // we have to show the seach results area
        $scope.$broadcast("showSearchResultsArea", true);
        // we are hiding the dashboard
        $scope.$broadcast("showDashboardArea", false);

        //setting the backbutton & showing the caption
        $scope.$emit("UpdateSearchBackbuttonCaption", "Dashboard");

        //updating type
        var lateCheckoutType = "LATE_CHECKOUT";
        $scope.$broadcast("updateDashboardSearchTypeFromExternal", lateCheckoutType);

        //updating the heading
        $scope.$emit( "UpdateHeading", "DASHBOARD_SEARCH_LATECHECKOUT");
    };


    /**
    * function to execute on clicking latecheckout button
    */
    $scope.clickedOnHeaderLateCheckoutIcon = function(event){
        event.preventDefault();
        var data = {};
        data.is_late_checkout_only = true;      
        $scope.invokeApi(RVSearchSrv.fetch, data, successCallbackOfLateCheckoutFetch);
    };    
}]);

    