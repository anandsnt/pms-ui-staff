sntZestStation.controller('zsReservationSearchCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'$stateParams',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, $stateParams) {

	BaseCtrl.call(this, $scope);

	$scope.reservationParams = {
		"last_name":"",
		"email":"",
		"room_no":""
	};
	$scope.input = {};
	
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
        if ($scope.reservations.length === 0){
        	$scope.showRoomEnter = $scope.isInCheckoutMode() ?  true : false;
            $scope.mode= 'no-match';
        }else{
        	$scope.mode = "reservations-list";
        }
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
            console.log('run search reservation: '+$state.lastAt)
            var params = {
                email           : $scope.reservationParams.email,
                last_name       : $scope.reservationParams.last_name,
                room_no         : $scope.reservationParams.room_no,
                per_page 	: $scope.PER_PAGE_RESULTS,
                page 		: $scope.page
            };
            
            if ($state.lastAt !== 'find-by-email'){
                delete params.email;
            }
            
            //sets due_in or due_out
            params = $scope.setDueInOut(params);

            var options = {
                    params            : params,
                    successCallBack   : successCallBackOfSearchReservations
            };
            console.info('search with opts',options)
            $scope.callAPI(zsTabletSrv.fetchReservations, options);
	};

	$scope.isSearchMode = function(){
		if($scope.isInCheckoutMode()){
			return ($scope.mode === 'search-mode' || $scope.mode ==='search-final-mode');
		}
		else{
			return true;
		}
	};

	$scope.goToNext =  function(){
		/*
		* 	There are two steps for checkout
		*	1.enter last name
		*	2.enter room number
		*/
		if($scope.isInCheckoutMode()){
			if($scope.mode === "search-mode"){
				$scope.reservationParams.last_name = angular.copy($scope.input.inputTextValue);
				$scope.input.inputTextValue = "";
				$scope.headingText = "Next, Type your room number";
				$scope.mode = "search-final-mode";
			}
			else{
				$scope.reservationParams.room_no = angular.copy($scope.input.inputTextValue);
				$scope.searchReservations();
			}
		}
	};

	$scope.reEnterLastName = function(){
		$scope.mode = "search-mode";
		$scope.input.inputTextValue = $scope.reservationParams.last_name;
	};
	$scope.reEnterRoomNumber = function(){
		$scope.mode = "search-final-mode";
		$scope.input.inputTextValue = $scope.reservationParams.room_no;
	};
        
    $scope.setDueInOut = function(params){
        if ($scope.isInCheckinMode()) {
                params.due_in = true;
        }

        else if ($scope.isInCheckoutMode()) {
                params.due_in = true; // need to change to due_out
        }

        else if ($scope.isInPickupKeyMode()) {
                params.due_in = true;
        }
        return params;
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
            if($scope.isInCheckoutMode()){
            	$state.go('zest_station.reservation_details',{"mode":zsModeConstants.CHECKOUT_MODE});
            }
            else{
            	$state.go('zest_station.reservation_details');
            }
            
        };

        
        $scope.init = function(){
          if ($state.search){
              $scope.searchReservations();
              $state.search = false;
          }
            
          $scope.mode = "search-mode";
          $scope.headingText = "Type your Last Name";
            
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