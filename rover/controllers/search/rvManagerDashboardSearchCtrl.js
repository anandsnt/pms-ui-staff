sntRover.controller('rvManagerDashboardSearchController',['$scope', '$rootScope', '$state', '$stateParams', '$filter', '$vault',  function($scope, $rootScope, $state, $stateParams, $filter, $vault){
    
	/*
	* Controller class for dashboard search,
	* will be updating the heading, update data from external source...
	*/

	var that = this;
  	BaseCtrl.call( this, $scope, $vault, $rootScope.isReturning() );


	//setting the scroller for view
	var scrollerOptions = {
        click: true,
        preventDefault: false,
        probeType: 2
    };
  	$scope.setScroller('result_showing_area', scrollerOptions);
    $scope.$broadcast("showSearchResultsArea", false);

  	//click function on search area, mainly for closing the drawer
  	$scope.clickedOnSearchArea = function($event){
        $scope.$emit("closeDrawer");
        // if the click occured on find reservation, no result found, no one opted to late checkout,
        // need to back to dashboard
        if(getParentWithSelector($event, document.getElementsByClassName("no-content")[0])
            || getParentWithSelector($event, document.getElementsByClassName("no-content")[1])
            || getParentWithSelector($event, document.getElementsByClassName("no-content")[2])) {
            
            backToDashboard();
        }
  	};

    /**
    * function used to back onto dashboard screen
    */
    var backToDashboard = function(){
        //setting the backbutton & showing the caption
        $scope.$emit("UpdateSearchBackbuttonCaption", "");
        //we need to show the dashboard & hide search area
        $scope.$emit("showDashboardArea", true);
        $scope.$broadcast("showSearchResultsArea", false);
        //also need to clear results present in that & type 
        $scope.$broadcast("updateReservationTypeFromOutside", 'default');
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
        $scope.$emit("UpdateSearchBackbuttonCaption", "");        
    });   

    /**
    * on what action taken, on search results clearing
    */
    $scope.$on("SearchResultsCleared", function(event){
        backToDashboard();
    });
}]);