sntZestStation.controller('zsReservationSearchCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'$stateParams',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, $stateParams) {

	BaseCtrl.call(this, $scope);
	
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
		$state.go ('zest_station.home');
	});

	/**
	 * success Call Back Of Search Reservations
	 * @return {[type]}
	 */
	var successCallBackOfSearchReservations = function(data) {
		$scope.reservations = data.results;
		$scope.totalResults	= data.total_count;
	};

	/**
	 * [searchReservations description]
	 * @return {undefined}
	 */
	$scope.searchReservations = function() {
		var mode = $stateParams.mode;
        
        var params = {
            //last_name 	: $scope.searchQuery,
            per_page 	: $scope.PER_PAGE_RESULTS,
            page 		: $scope.page
        };

        if (mode === zsModeConstants.CHECKIN_MODE) {
        	params.due_in = true;
        }

        else if (mode === zsModeConstants.CHECKOUT_MODE) {
        	params.due_out = true;
        }

        else if (mode === zsModeConstants.PICKUP_KEY_MODE) {
        	params.due_in = true;
        }

        var options = {
          	params            : params,
          	successCallBack   : successCallBackOfSearchReservations
        };

        $scope.callAPI(zsTabletSrv.fetchReservations, options);
	};


	/**
	 * [fetchNextReservationList description]
	 * @return {[type]} [description]
	 */
	$scope.fetchNextReservationList = function() {
		$scope.page++; //TODO: Correct logic
		$scope.searchReservations();
	};

	/**
	 * [fetchPreviousReservationList description]
	 * @return {[type]} [description]
	 */
	$scope.fetchPreviousReservationList = function() {
		$scope.page--; //TODO: Correct logic
		$scope.searchReservations();
	};

	/**
	 * wanted to show search results
	 * @return {Boolean}
	 */
	$scope.shouldShowSearchResults = function() {
		return ($scope.reservations.length > 0);
	};

	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);

		$scope.reservations = [];

		//pagination
		$scope.page 			= 1;
		$scope.totalResults 	= 0;
		$scope.PER_PAGE_RESULTS = 3;
	}();

}]);