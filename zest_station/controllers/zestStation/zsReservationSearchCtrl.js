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
		$scope.totalPages	= Math.ceil (data.total_count/$scope.PER_PAGE_RESULTS);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckinMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKIN_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckoutMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKOUT_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInPickupKeyMode = function() {
		return ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE);
	};

	/**
	 * [searchReservations description]
	 * @return {undefined}
	 */
        
	$scope.searchReservations = function() {
            console.log('run search reservation')
            var params = {
                //last_name 	: $scope.searchQuery,
                last_name       : $state.input.last,
                per_page 	: $scope.PER_PAGE_RESULTS,
                page 		: $scope.page
            };
            if ($state.lastAt === 'find-by-email'){
                params.email === $state.lastInput;
            }

            if ($scope.isInCheckinMode()) {
                    params.due_in = true;
            }

            else if ($scope.isInCheckoutMode()) {
                    params.due_out = true;
            }

            else if ($scope.isInPickupKeyMode()) {
                    params.due_in = true;
            }

            var options = {
                    params            : params,
                    successCallBack   : successCallBackOfSearchReservations
            };
            console.info('search with opts',options)
            $scope.callAPI(zsTabletSrv.fetchReservations, options);
	};
        
        
        


	/**
	 * [fetchNextReservationList description]
	 * @return {[type]} [description]
	 */
	$scope.fetchNextReservationList = function() {
		if ($scope.page < $scope.totalPages) {
			$scope.page++;
		}
		$scope.searchReservations();
	};

	/**
	 * [fetchPreviousReservationList description]
	 * @return {[type]} [description]
	 */
	$scope.fetchPreviousReservationList = function() {
		if ($scope.page > 1) {
			$scope.page--;
		}
		$scope.searchReservations();
	};

	/**
	 * wanted to show search results
	 * @return {Boolean}
	 */
	$scope.shouldShowSearchResults = function() {
		return true;
		//return ($scope.reservations.length > 0);
	};


        $scope.selectReservation = function(r){
            //pass reservation as a state param
            $state.selectedReservation = r;
            $state.go('zest_station.reservation_details');
        };

        
        $scope.init = function(){
          if ($state.search){
              $scope.searchReservations();
              $state.search = false;
          }
            
            
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
		$scope.totalPages 		= 0;
		$scope.PER_PAGE_RESULTS = 3;
                $scope.init();
	}();
        
        

}]);