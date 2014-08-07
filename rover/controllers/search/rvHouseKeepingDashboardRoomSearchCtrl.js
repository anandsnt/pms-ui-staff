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
		$scope.showPickup = false;
		$scope.showInspected = false;
		$scope.isSearchResultsShowing = false;

		$scope.showQueued = false;

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

		var afterFetch = function(data) {
			$scope.noScroll = true;


			// making unique copies of array
			// slicing same array not good.
			// say thanks to underscore.js
			var smallPart = _.compact( data.rooms );
			var restPart  = _.compact( data.rooms );

			// smaller part consisit of enogh rooms
			// that will fill in the screen
			smallPart = smallPart.slice( 0, 13 );
			restPart  = restPart.slice( 13 );

			// first load the small part
			$scope.rooms = smallPart;

			// load the rest after a small delay
			$timeout(function() {

				// push the rest of the rooms into $scope.rooms
				// remember slicing is only happening on the Ctrl and not on Srv
				$scope.rooms.push.apply( $scope.rooms, restPart );

				// finally hide the loaded
				// in almost every case this will not block UX
				$scope.$emit( 'hideLoader' );

				refreshScroller();
			// execute this after this much time
			// as the animation is in progress
			}, 200);
		};

		/**
		* function used for refreshing the scroller
		*/
		var refreshScroller = function(){  
			$scope.refreshScroller('result_showing_area');
		};

		var fetchRooms = function() {

			//Fetch the roomlist if necessary
			if ( $scope.rooms.length == 0) {
				$scope.$emit('showLoader');

				RVHkRoomStatusSrv.fetch()
					.then(function(data) {
						$scope.showPickup = data.use_pickup;
						$scope.showInspected = data.use_inspected;
						$scope.showQueued = data.is_queue_rooms_on;
						for(var i = 0; i < data.rooms.length; i++){
							data.rooms[i].display_room = false;
						}
						afterFetch( data );
					}, function() {
						$scope.$emit('hideLoader');
					});	
			}
		};

		fetchRooms();

		var queryFilterFunction = function(){
			// since no filer we will have to
			// loop through all rooms			
			$scope.$apply(function(){
				var isAnyMatchFound = false;
				for (var i = 0, j = $scope.rooms.length; i < j; i++) {
					var room = $scope.rooms[i]
					var roomNo = room.room_no.toUpperCase();


					// now match the room no and
					// and show hide as required
					// must match first occurance of the search query

					if ( $scope.query.toUpperCase().trim() !== '' && (roomNo).indexOf($scope.query.toUpperCase()) === 0 ) {
						room.display_room = true;

						isAnyMatchFound = true;						
					} else {
						room.display_room = false;
					}
				}
				if(isAnyMatchFound){
					$scope.isSearchResultsShowing = true;
				}
				else{
					$scope.isSearchResultsShowing = false;					
				}
				// refresh scroll when all ok
				refreshScroller();	
			});		
		}
		/**
		*  Filter Function for filtering our the room list
		*/
		$scope.filterByQuery = function() {

			//in order to reduce the number of processing room list procceesing, 
			// (ui hangs for a while if room length cross some hundreds) 			
			if($scope.queryFunctionProccessing){
				if($scope.query.trim().length == 0){
					$scope.clearResults();
				}
				else if($scope.showSearchResultsArea == false){
					$scope.focusedOnQueryBox();
				}
				clearTimeout($scope.queryFunctionProccessing);
				$scope.queryFunctionProccessing = setTimeout(function(){
					queryFilterFunction();
				}, 300);
			}
			else{
				$scope.queryFunctionProccessing = setTimeout(function(){
					queryFilterFunction();
				}, 300);
			}

		};

	   	/**
	   	* function to execute on clicking clear icon button
	   	*/
	    $scope.clearResults = function(){
		  	$scope.query = "";
		  	$scope.$emit("showDashboardArea", true);
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
		}
		/**
		* when focusedout on query box, we need to hide the search results area
		* and need to show the dashboard area only if there is no data displaying
		*/
		$scope.focusedOutOnQueryBox = function(){
			if(!$scope.isSearchResultsShowing){
				$scope.showSearchResultsArea = false;
				$scope.$emit("showDashboardArea", true);
			}
		};
}]);