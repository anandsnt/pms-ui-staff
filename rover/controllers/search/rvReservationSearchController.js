sntRover.controller('rvReservationSearchController',['$scope', '$rootScope', '$state', '$stateParams', '$filter',  'searchResultdata', '$vault', function($scope, $rootScope, $state, $stateParams, $filter, searchResultdata, $vault){

	/*
	* Controller class for search,
	* will be updating the heading
	*/

	var that = this;
  BaseCtrl.call(this, $scope);
  
  //changing the header
	$scope.heading = 'SEARCH_TITLE';
	//updating the left side menu
	$scope.$emit("updateRoverLeftMenu","search");
	
	//setting search back button caption
	$scope.$emit("UpdateSearchBackbuttonCaption", ""); 

  var headingDict = {
      'DUEIN': 'DASHBOARD_SEARCH_CHECKINGIN',
      'DUEOUT': 'DASHBOARD_SEARCH_CHECKINGOUT',
      'INHOUSE': 'DASHBOARD_SEARCH_INHOUSE',
      'LATE_CHECKOUT': 'DASHBOARD_SEARCH_LATECHECKOUT',
      'VIP': 'DASHBOARD_SEARCH_VIP',
      'NORMAL_SEARCH': 'SEARCH_NORMAL'
  }
  if ($stateParams.type in headingDict){
      heading = headingDict[$stateParams.type];
      $rootScope.setPrevState = {
        title: $filter( 'translate' )( headingDict[$stateParams.type] ),
        name: 'rover.dashboard'
      };
  } else {
      heading = headingDict['NORMAL_SEARCH'];
  }

  // saving/reseting search params to $vault
  $vault.set('searchType', !!$stateParams.type ? $stateParams.type : '');



    
  $scope.heading = heading;

	// setting the scroller for view
	var scrollerOptions = {
    click: true,
    preventDefault: false,
    probeType: 2,
    scrollEndCallback: function() {
      $vault.set( 'result_showing_area', this.y );
    }
  };

  // we are returning to this screen
  if ( $rootScope.isReturning() ) {
    scrollerOptions.scrollToPrevLoc = !!$vault.get('result_showing_area') ? $vault.get('result_showing_area') : 0;
  };

  // finally
  $scope.setScroller('result_showing_area', scrollerOptions);

  	//click function on search area, mainly for closing the drawer
  	$scope.clickedOnSearchArea = function($event){
        $scope.$emit("closeDrawer");
  	}; 

  	$scope.$on("$viewContentLoaded", function(event){
  		setTimeout(function(){
  			$scope.$apply(function(){
	  			//we are showing the search results area
				$scope.$broadcast("showSearchResultsArea", true);
				//we are showing the data in search results area
				if(typeof searchResultdata !== 'undefined'){
					$scope.$broadcast("updateDataFromOutside", searchResultdata);
				}
  			});
 
  		}, 100);
 		
  	});	

	$scope.$on("SearchResultsCleared", function(event, data){
		$scope.heading = headingDict['NORMAL_SEARCH'];
	});	
}]);