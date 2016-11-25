angular.module('sntRover')
.controller('rvNightlyDiaryRoomNumberSearchController', 
	[	'$scope',
		'$rootScope',
		'$state',
		'$stateParams',
		'$filter',
		'RVNightlyDiaryRoomNumberSearchSrv',
		function(
			$scope,
			$rootScope,
			$state,
			$stateParams,
			$filter,
			RVNightlyDiaryRoomNumberSearchSrv
		) {
	
	BaseCtrl.call(this, $scope);
	
	var init = function() {
		$scope.diaryData.textInQueryBox = "";
		$scope.diaryData.showSearchResultsArea = false;
		$scope.diaryData.roomNumberSearchResults = [];
	}
	init();
	
	// Scroller options for search-results view.
	var scrollerOptions = {
		tap: true,
		preventDefault: false,
		deceleration: 0.0001,
		shrinkScrollbars: 'clip'
	};

	$scope.setScroller('result_showing_area', scrollerOptions);

	var refreshScroller = function() {
		$scope.refreshScroller('result_showing_area');
	};
	
	// clear query box on clicking close button
	$scope.clearResults = function() {
		$scope.diaryData.textInQueryBox = "";
		$scope.diaryData.showSearchResultsArea = false;
	};

	// success callback of fetching search results
	var successCallbackFunction = function(data) {
		$scope.$emit('hideLoader');
		$scope.diaryData.roomNumberSearchResults = data.rooms;
		refreshScroller();
	};
	// failure callback of fetching search results
	var failureCallbackFunction = function(error) {
		$scope.errorMessage = errorMessage;
	};

	/**
	 * function to perform filtering on search.
	 */
	var displayFilteredResults = function() {
		var params = {};
		params.query = $scope.diaryData.textInQueryBox.trim();
		$scope.invokeApi(RVNightlyDiaryRoomNumberSearchSrv.fetchRoomSearchResults, params, successCallbackFunction, failureCallbackFunction);
	};

	/**
	 * function to perform filtering data, on change-event of query box
	 */
	$scope.queryEntered = function() {
		if ($scope.diaryData.textInQueryBox === "" || $scope.diaryData.textInQueryBox.length < 2) {
			$scope.diaryData.showSearchResultsArea = false;
			$scope.diaryData.roomNumberSearchResults = [];
		}
		else {
			$scope.diaryData.showSearchResultsArea = true;
			displayFilteredResults();
		}
	};
}]);