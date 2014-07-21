sntRover.controller('RVmanagerDashboardController',['$scope', 'RVSearchSrv', function($scope, RVSearchSrv){
	
	//inheriting some useful things
	BaseCtrl.call(this, $scope);

	//scroller related settings
	var scrollerOptions = {click: true, preventDefault: false};
  	$scope.setScroller('dashboard_scroller', scrollerOptions);

  	$scope.showSearch = false; //variable used to hide/show search area
  	
  	/*
  	* a recievable function hide/show search area.
  	* when showing the search bar, we will hide dashboard & vice versa
  	* param1 {event}, javascript event
  	* param2 {boolean}, value to determine whether search should be visible
  	*/
  	$scope.$on("showHideSearch", function(event, showSearch){
  		event.stopPropagation();
  		$scope.showSearch = showSearch;
  		$scope.refreshScroller('dashboard_scroller');
  	});


  	/*
  	* function to exceute on clicking the guest today buttons
  	* we will call the webservice with given type and
  	* will update search results and show search area
  	*/
  	$scope.clickedOnGuestsToday = function(event, type) {
  		if(type == "LATE_CHECKOUT"){
        	dataDict.is_late_checkout_only = true;
        }
        else{
      		dataDict.status = type;
        }
  	}

}]);