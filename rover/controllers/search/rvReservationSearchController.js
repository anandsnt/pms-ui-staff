sntRover.controller('rvReservationSearchController',['$scope', '$state', '$stateParams', '$filter',  function($scope, $state, $stateParams, $filter){

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



	//setting the scroller for view
	var scrollerOptions = { click: true, preventDefault: false };
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
  			});
 
  		}, 100);
 		
  	});	
}]);