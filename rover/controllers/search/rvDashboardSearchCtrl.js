sntRover.controller('rvDashboardSearchController',['$scope', '$state', '$stateParams', '$filter',  function($scope, $state, $stateParams, $filter){

	/*
	* Controller class for dashboard search,
	* will be updating the heading, update data from external source...
	*/

	var that = this;
  	BaseCtrl.call(this, $scope);

  	//changing the header
	$scope.$emit("UpdateHeading", 'DASHBOARD_MANAGER_HEADING');

	//setting the scroller for view
	var scrollerOptions = { click: true, preventDefault: false };
  	$scope.setScroller('result_showing_area', scrollerOptions);


  	//click function on search area, mainly for closing the drawer
  	$scope.clickedOnSearchArea = function($event){
        $scope.$emit("closeDrawer");
        if(getParentWithSelector($event, document.getElementsByClassName("no-content")[0])){
            backToDashboard();
        }
  	};

    /**
    * function used to back onto dashboard screen
    */
    var backToDashboard = function(){
        //setting the backbutton & showing the caption
        $scope.$emit("UpdateBackbuttonCaption", "");
        //we need to show the dashboard & hide search area
        $scope.$emit("showDashboardArea", true);
        $scope.$broadcast("showSearchResultsArea", false);
        //also need to clear results present in that & type 
        $scope.$broadcast("updateReservationTypeFromOutside", '');
        $scope.$broadcast("updateDataFromOutside", []);  
    }

    /**
    * recievable function to handle backbutton click on header area
    * will backto dashboard
    */
    $scope.$on("HeaderBackButtonClicked", function(event){
        backToDashboard();        
    });


    /**
    * When leaving this, we need to reset the back button text
    */
    $scope.$on('$stateChangeSuccess', function(event){
        //setting the backbutton & showing the caption
        $scope.$emit("UpdateBackbuttonCaption", "");        
    });   

    /**
    * on what action taken, on search results clearing
    */
    $scope.$on("SearchResultsCleared", function(event){
        backToDashboard();
    });
}]);