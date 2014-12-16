sntRover.controller('rvHouseKeepingDashboardRoomSearchCtrl', [
	'$scope', 
	'$rootScope',
	'$timeout',
	'$state',
	'$filter',
	'RVHkRoomStatusSrv',
	function($scope, $rootScope, $timeout, $state, $filter, RVHkRoomStatusSrv){

		BaseCtrl.call(this, $scope);
		$scope.query = '';
		$scope.isSearchResultsShowing = false;

		$scope.rooms = [];

		//whether we need to show the search results area
		$scope.showSearchResultsArea = false;

		$scope.queryFunctionProccessing = null;
		//inorder to hide/show searhc results area from outide we can use this
		$scope.$on("showSearchResultsArea", function(event, showSearchResultsArea){
			$scope.showSearchResultsArea = showSearchResultsArea;
		});

		//setting the scroller for view
		var scrollerOptions = { click: true, preventDefault: false };
	  	$scope.setScroller('result_showing_area', scrollerOptions);

	  	var refreshScroller = function(){  
			$scope.refreshScroller('result_showing_area');
		};




	  	// internal variables
	  	var $_roomList,
	  		$_page = 1,
	  		$_perPage = 50,
	  		$_defaultPage = 0,
	  		$_lastQuery = '';

	  	// inital page related properties
	  	$scope.resultFrom = $_page,
	  	$scope.resultUpto = $_perPage,
	  	$scope.totalCount = 0;
	  	$scope.disablePrevBtn = true;
	  	$scope.disableNextBtn = true;




	  function $_fetchRoomListCallback(data) {
	  	if ( !!data ) {
	  		$_roomList = data;
	  	};

	  	$scope.totalCount = $_roomList.total_count;

	  	if ( $_page === 1 ) {
	  		$scope.resultFrom = 1;
	  		$scope.resultUpto = $scope.totalCount < $_perPage ? $scope.totalCount : $_perPage;
	  		$scope.disablePrevBtn = true;
	  		$scope.disableNextBtn = $scope.totalCount > $_perPage ? false : true;
	  	} else {
	  		$scope.resultFrom = $_perPage * ($_page - 1) + 1;
	  		$scope.resultUpto = ($scope.resultFrom + $_perPage - 1) < $scope.totalCount ? ($scope.resultFrom + $_perPage - 1) : $scope.totalCount;
	  		$scope.disablePrevBtn = false;
	  		$scope.disableNextBtn = $scope.resultUpto === $scope.totalCount ? true : false;
	  	}

	  	
  		$timeout(function() {
  			$_postProcessRooms();
  		}, 10);

	  	RVHkRoomStatusSrv.currentFilters.page = $_page;
	  };




	  	function $_postProcessRooms() {
			var _roomCopy     = {},
				_totalLen     = !!$_roomList && !!$_roomList.rooms ? $_roomList.rooms.length : 0,
				_processCount = 0,
				_minCount     = 13;

			var _hideLoader = function() {
					refreshScroller();
					$scope.$emit( 'hideLoader' );
				},
				_firstInsert = function(count) {
					for (var i = 0; i < count; i++) {
						_roomCopy = angular.copy( $_roomList.rooms[i] );
						$scope.rooms.push( _roomCopy );
					};

					if ( _totalLen < _minCount ) {
						_hideLoader();
					};
				},
				_secondInsert = function(startCount) {
					for (var i = startCount; i < _totalLen; i++) {
						_roomCopy = angular.copy( $_roomList.rooms[i] );
						$scope.rooms.push( _roomCopy );
					};

					_hideLoader();
				};

			$scope.rooms = [];

			if ( _totalLen ) {
				_processCount = Math.min(_totalLen, _minCount);

				// load first 13 a small delay (necessary) - for filters to work properly
				$timeout(_firstInsert.bind(null, _processCount), 10);

				// load the rest after a small delay - DOM can process it all
				if ( _totalLen > _minCount ) {
					$timeout(_secondInsert.bind(null, _processCount), 30);
				};
			} else {
				_hideLoader();
			}
		};





	  	$scope.loadNextPage = function() {
			if ( $scope.disableNextBtn ) {
				return;
			};

			$_page++;
			RVHkRoomStatusSrv.currentFilters.page = $_page;

			$_callRoomsApi();
		};

	  	$scope.loadPrevPage = function() {
			if ($scope.disablePrevBtn) {
				return;
			};

			$_page--;
			RVHkRoomStatusSrv.currentFilters.page = $_page;

			$_callRoomsApi();
		};





		function $_callRoomsApi() {
			$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomListPost, {
				businessDate : $rootScope.businessDate,
			}, $_fetchRoomListCallback);
		};






		var $_filterByQuery = function(forced) {
			var _makeCall = function() {
					RVHkRoomStatusSrv.currentFilters.query = $scope.query;

					$_resetPageCounts();

					$timeout(function() {
						$_callRoomsApi();
						$_lastQuery = $scope.query;
					}, 10);
				};

			if ( $rootScope.isSingleDigitSearch ) {
				if (forced || $scope.query != $_lastQuery) {
					_makeCall();
				};
			} else {
				if ( forced ||
						($scope.query.length <= 2 && $scope.query.length < $_lastQuery.length) ||
						($scope.query.length > 2 && $scope.query != $_lastQuery)
				) {
					_makeCall();
				};
			};
		};

		$scope.filterByQuery = _.throttle($_filterByQuery, 1000, { leading: false });

		$scope.clearResults = function() {
			$scope.query = '';
			$scope.rooms = [];
			$scope.$emit("showDashboardArea", true);
		  	 //we are setting the header accrdoing to house keeping dashboard
   			$scope.$emit("UpdateHeading", 'DASHBOARD_HOUSEKEEPING_HEADING');
		  	$scope.showSearchResultsArea = false;
		  	$scope.isSearchResultsShowing = false;
		  	if($scope.queryFunctionProccessing){
		  		clearTimeout($scope.queryFunctionProccessing);
		  		$scope.queryFunctionProccessing = null;
		  	}
		};

		function $_resetPageCounts () {
			$_page = $_defaultPage;
			RVHkRoomStatusSrv.currentFilters.page = $_page;
		};



		/**
		* when focused on query box, we need to show the search results area
		* and need to hide the dashboard area
		*/
		$scope.focusedOnQueryBox = function(){
			$scope.showSearchResultsArea = true;
			refreshScroller();
			$scope.$emit("showDashboardArea", false);
			$scope.$emit("UpdateHeading", 'MENU_ROOM_STATUS');	
		}
		/**
		* when focusedout on query box, we need to hide the search results area
		* and need to show the dashboard area only if there is no data displaying
		*/
		$scope.focusedOutOnQueryBox = function(){

			$timeout(function() {
				if(!$scope.isSearchResultsShowing && $scope.query.length ===0){
					$scope.query = "";
					$scope.rooms = [];
					$scope.showSearchResultsArea = false;
					$scope.$emit("showDashboardArea", true);
					$scope.$emit("UpdateHeading", 'DASHBOARD_HOUSEKEEPING_HEADING');	
				}
			}, 100);
			
		};
}]);