sntRover.controller('RVfrontDeskDashboardController',['$scope', '$rootScope', 'statistics', function($scope, $rootScope, statistics){
	//inheriting some useful things
	BaseCtrl.call(this, $scope);
    var that = this;
  $scope.statistics = statistics;
	//scroller related settings
	var scrollerOptions = {click: true, preventDefault: false};
  	$scope.setScroller('dashboard_scroller', scrollerOptions);

  	$scope.showDashboard = true; //variable used to hide/show dabshboard
    //changing the header
    $scope.$emit("UpdateHeading", 'DASHBOARD_FRONTDESK_HEADING');

    // we are hiding the search results area
    $scope.$broadcast("showSearchResultsArea", false);

    $scope.tomorrow = tzIndependentDate ($rootScope.businessDate);
    $scope.tomorrow.setDate ($scope.tomorrow.getDate() + 1);
    $scope.dayAfterTomorrow = tzIndependentDate ($scope.tomorrow);
    $scope.dayAfterTomorrow.setDate ($scope.tomorrow.getDate() + 1);

  	/*
  	*    a recievable function hide/show search area.
  	*    when showing the search bar, we will hide dashboard & vice versa
  	*    param1 {event}, javascript event
  	*    param2 {boolean}, value to determine whether dashboard should be visible
  	*/
  	$scope.$on("showDashboardArea", function(event, showDashboard){
  		$scope.showDashboard = showDashboard;
  		$scope.refreshScroller('dashboard_scroller');
  	});

    /**
    *   recievalble function to update dashboard reservatin search results
    *   intended for checkin, inhouse, checkout (departed), vip buttons handling.
    *   @param {Object} javascript event
    *   @param {array of Objects} data search results
    */
    $scope.$on("updateDashboardSearchDataFromExternal", function(event, data){
        $scope.$broadcast("updateDataFromOutside", data);
        $scope.$broadcast("showSearchResultsArea", true);
    });

    /**
    *   recievalble function to update dashboard reservatin search result's type
    *   intended for checkin, inhouse, checkout (departed), vip buttons search result handling.
    *   @param {Object} javascript event
    *   @param {array of Objects} data search results
    */
    $scope.$on("updateDashboardSearchTypeFromExternal", function(event, type){
        $scope.$broadcast("updateReservationTypeFromOutside", type);
    });

    //show Latecheckout icon
    $scope.shouldShowLateCheckout = true;
    $scope.shouldShowQueuedRooms  = true;
    //scroller is not appearing after coming back from other screens
    setTimeout(function(){
      $scope.refreshScroller('dashboard_scroller');
    }, 500);
}]);