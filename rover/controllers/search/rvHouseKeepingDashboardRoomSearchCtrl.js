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
	  	};




	  	function $_postProcessRooms() {
	  		var _roomCopy;

	  		if (!!$_roomList && !!$_roomList.rooms && $_roomList.rooms.length) {
	  			// empty all
	  			$scope.rooms = [];

	  			// load first 13;
	  			for (var i = 0; i < 13; i++) {
	  				_roomCopy = angular.copy( $_roomList.rooms[i] );
	  				$scope.rooms.push( _roomCopy );
	  			};

	  			// load the rest after a small delay
	  			$timeout(function() {

	  				// load the rest
	  				for (var i = 13, j = $_roomList.rooms.length; i < j; i++) {
	  					_roomCopy = angular.copy( $_roomList.rooms[i] );
	  					$scope.rooms.push( _roomCopy );
	  				};

	  				refreshScroller();

	  				$scope.$emit('hideLoader');
	  			}, 150);
	  		} else {
	  			console.log('oops no rooms');
	  			$scope.$emit('hideLoader');
	  		}
	  	};





	  	$scope.loadNextPage = function() {
	  		if ($scope.disableNextBtn) {
	  			return;
	  		};

	  		$_page++;
	  		$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
	  			key: !!$scope.query ? $scope.query : '',
	  			businessDate: $rootScope.businessDate,
	  			page: $_page,
	  			perPage: $_perPage
	  		}, $_fetchRoomListCallback);
	  	};

	  	$scope.loadPrevPage = function() {
	  		if ($scope.disablePrevBtn) {
	  			return;
	  		};

	  		$_page--;
	  		$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
	  			key: !!$scope.query ? $scope.query : '',
	  			businessDate: $rootScope.businessDate,
	  			page: $_page,
	  			perPage: $_perPage
	  		}, $_fetchRoomListCallback);
	  	};





	  	//Fetch the roomlist if necessary
		var fetchRooms = function() {
			if ( $scope.rooms && $scope.rooms.length == 0 ) {
				$scope.$emit('showLoader');

				RVHkRoomStatusSrv.fetchRoomList({
					key: $scope.query,
					businessDate: $rootScope.businessDate,
					page: $_page,
					perPage: $_perPage
				}).then(function(data) {
					$_fetchRoomListCallback(data);
				}, function() {
					$scope.$emit('hideLoader');
				});
			}
		};
		fetchRooms();





		$scope.filterByQuery = function() {
			var unMatched = 0,
				len = 0,
				i = 0,
				timer = null,
				delayedRequest = function() {
					if ( !!timer ) {
						$timeout.cancel(timer);
						timer = null;
					}

					if ( $scope.query !== $_lastQuery ) {
						$_lastQuery = $scope.query;

						$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
							key: $scope.query,
							businessDate: $rootScope.businessDate,
							page: $_page,
							perPage: $_perPage
						}, $_fetchRoomListCallback);
					};
				};

			refreshScroller();
			for (len = $scope.rooms.length; i < len; i++) {
				var room = $scope.rooms[i]
				var roomNo = room.room_no.toUpperCase();

				// user cleared search
				if (!$scope.query) {
					$_postProcessRooms();
					break;
					return;
				};

				// show all rooms
				room.display_room = true;

				if ((roomNo).indexOf($scope.query.toUpperCase()) === 0) {
					room.display_room = true;

					unMatched--;
				} else {
					room.display_room = false;

					unMatched++;

					if ( unMatched === len ) {
						$_page = 1;

						// search in server
						if ( !!timer ) {
							$timeout.cancel(timer);
							timer = null;
							timer = $timeout(delayedRequest, 1000);
						} else {
							timer = $timeout(delayedRequest, 1000);
						};
					};
				};
			};
		};




	   	/**
	   	* function to execute on clicking clear icon button
	   	*/
	    $scope.clearResults = function(){
		  	$scope.query = "";
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
					$scope.showSearchResultsArea = false;
					$scope.$emit("showDashboardArea", true);
					$scope.$emit("UpdateHeading", 'DASHBOARD_HOUSEKEEPING_HEADING');	
				}
			}, 100);
			
		};
}]);