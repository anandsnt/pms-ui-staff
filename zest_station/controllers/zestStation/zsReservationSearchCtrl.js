sntZestStation.controller('zsReservationSearchCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv','zsCheckoutSrv',
	'$stateParams',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv,zsCheckoutSrv, $stateParams) {

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
        
        var home = function(){$state.go ('zest_station.home');};
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            if ($scope.isInPickupKeyMode()){
                $scope.pickupNavBack();
            } else {
                home();
            }
            
            
	});
        $scope.pickupNavBack = function(){
            if ($scope.at === 'input-room'){
                $scope.backToLastNameInput();
            } else {
                home();
            }
        };
        $scope.backToLastNameInput = function(){
            if ($scope.pickupValues && $scope.pickupValues.last){
                $scope.input.inputTextValue = $scope.pickupValues.last;
                $scope.at = 'input-last';
                $scope.mode = "pickup-mode";
                $scope.headingText = "TYPE_LAST";
            }
        };

	/**
	 * success Call Back Of Search Reservations
	 * @return {[type]}
	 */
	var successCallBackOfSearchReservations = function(data) {
		$scope.reservations = data.results;
		$scope.totalPages	= Math.ceil (data.total_count/$scope.PER_PAGE_RESULTS);
                
            if ($scope.reservations.length === 0){
                // $scope.showRoomEnter = $scope.isInCheckoutMode() ?  true : false;
                $scope.mode = 'no-match';
                $scope.at = 'no-match';
                
                if ($scope.isInCheckinMode()){
                    $state.go('zest_station.find_reservation_no_match');
                }
            } else if ($scope.reservations.length === 1){
                $scope.selectReservation($scope.reservations[0]);
            } {
                $scope.mode = "reservations-list";
            }
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckinMode = function() {
		return ($state.mode === zsModeConstants.CHECKIN_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckoutMode = function() {
		return ($state.mode === zsModeConstants.CHECKOUT_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInPickupKeyMode = function() {
		return ($state.mode === zsModeConstants.PICKUP_KEY_MODE);
	};

	/**
	 * [searchReservations description]
	 * @return {undefined}
	 */
        
        $scope.getCheckInParams = function(){
            var params = {
                last_name           : $state.input.last,
                per_page            : $scope.PER_PAGE_RESULTS,
                page                : $scope.page
            };
            if ($state.lastAt === 'find-by-email'){
                params.email = $state.input.email;
            }
            if ($state.lastAt === 'find-by-date'){
                 params.departure_date  = $state.input.date;
            }
            if ($state.lastAt === 'find-by-confirmation'){
                 params.alt_confirmation_number = $state.input.confirmation;//alt_confirmation_number is to fetch both internal and external confirmation numbers
            }
            return params;
            
        };
        $scope.getCheckOutParams = function(){
           return {
                last_name           : $scope.reservationParams.last_name,
                room_no             : $scope.reservationParams.room_no,
                per_page            : $scope.PER_PAGE_RESULTS,
                page                : $scope.page
            };
        };
        
        
	$scope.searchReservations = function() {
            var params;
            if ($scope.isInCheckoutMode()){
                params = $scope.getCheckOutParams();
            } else if ($scope.isInCheckinMode()) {
                params = $scope.getCheckInParams();
            }
            
            //sets due_in or due_out
            params = $scope.setDueInOut(params);

            var options = {
                    params            : params,
                    successCallBack   : successCallBackOfSearchReservations
            };
            $scope.callAPI(zsTabletSrv.fetchReservations, options);
	};

	$scope.isSearchMode = function(){
		if($scope.isInCheckoutMode()){
			return ($scope.mode === 'search-mode' || $scope.mode ==='search-final-mode');
		} else if ($scope.isInCheckinMode()){
                    return false;
                } else{
			return true;
		}
	};

	var checkoutVerificationSuccess = function(data){
		$scope.$emit("hideLoader");
		$scope.zestStationData.reservationData = data;
		$state.go('zest_station.review_bill');

	};
	var checkoutVerificationCallBack = function(){
		$scope.mode = "no-match";
		$scope.showRoomEnter = true;
	};

	/*
	* 	There are two steps for checkout
	*	1.enter last name
	*	2.enter room number
	*/
	var goToNextForCheckout = function(){
		if($scope.mode === "search-mode" && !$scope.reEnteredNameInfo){
			$scope.reservationParams.last_name = angular.copy($scope.input.inputTextValue);
			$scope.input.inputTextValue = "";
			$scope.headingText = "Next, Type your room number";
			$scope.mode = "search-final-mode";
		}
		else{
                    if ($scope.reEnteredNameInfo){
			$scope.reservationParams.last_name = angular.copy($scope.input.inputTextValue);
                    } else if ($scope.reEnteredRoomInfo){
                        $scope.reservationParams.room_no = angular.copy($scope.input.inputTextValue);
                    } else {
			$scope.reservationParams.room_no = angular.copy($scope.input.inputTextValue);
                    }
                    var options = {
                        params: 			{"last_name":$scope.reservationParams.last_name,"room_no":$scope.reservationParams.room_no},
                        successCallBack: 	checkoutVerificationSuccess,
                        failureCallBack:    checkoutVerificationCallBack
                    };
                       $scope.fetchReservations(options);
		};
                
	};
        
        
        $scope.fetchReservations = function(options){
            //depending on the mode, will fetch reservations for check-out or pickup key
            $scope.callAPI(zsCheckoutSrv.findReservation, options);
        };

	$scope.goToNext =  function(){
            if($scope.isInCheckoutMode()){
                    goToNextForCheckout();
            } else if ($scope.isInPickupKeyMode() && $scope.at === 'input-last'){
                    $scope.goToNextForPickup();
            } else if ($scope.at === 're-input-last'){
                $scope.pickupValues.last = $scope.input.inputTextValue;
                $state.input.last = $scope.input.inputTextValue;
                $scope.pickupValues.room = $state.input.room;
                
                var options = $scope.getPickupKeyOptions();
                $scope.fetchReservations(options);
            } else if ($scope.at === 're-input-room'){
                $scope.pickupValues.room = $scope.input.inputTextValue;
                $state.input.room = $scope.input.inputTextValue;
                $scope.pickupValues.last = $state.input.last;
                
                var options = $scope.getPickupKeyOptions();
                $scope.fetchReservations(options);
            }else if ($scope.isInPickupKeyMode() && $scope.at === 'input-room'){
                $scope.pickupValues.room = $scope.input.inputTextValue;
                $state.input.room = $scope.input.inputTextValue;
                var options = $scope.getPickupKeyOptions();
                $scope.fetchReservations(options);
            }
	};
          
        $scope.initErrorScreen = function(){
                $scope.at = 'error';
                $scope.headingText = 'So Sorry.';
                $scope.subHeadingText = 'Something broke. \n\
                                            Our bad. Please reach out to a Sidekick.';
                $scope.modalBtn1 = 'Done';
                $scope.$emit('hideLoader');
                $state.go('zest_station.error');
        };
        $scope.getPickupKeyOptions = function(){
            var pickupSuccess = function(response){
                $state.selectedReservation = response;
                $state.go('zest_station.pickup_keys');
            };
            var pickupFail = function(response){
                console.log(response);
                if (response){
                    if (response[0] === 'Could not find the Reservation'){
                        $scope.pickupKeyNoMatch();
                        return;
                    }
                }
                    $scope.initErrorScreen();
            };
            var options = {
                params: 			{"last_name":$scope.pickupValues.last,"room_no":$scope.pickupValues.room},
                successCallBack:    pickupSuccess,
                failureCallBack:    pickupFail
            };
            return options;
        };
        $scope.pickupKeyNoMatch = function(){
            $scope.mode = 'no-match';
            $scope.at = 'no-match';
            $scope.lastAt = 'pick-up-room';
            $state.lastAt = 'pick-up-room';
            $state.go('zest_station.find_reservation_no_match');
        };
        $scope.pickupValues = {
          'last':'',
          'room':''
        };
        $scope.goToNextForPickup = function(){
            $scope.pickupValues.last = $scope.input.inputTextValue;
            $state.input.last = $scope.input.inputTextValue;
            $scope.at = 'input-room';
            $scope.input.inputTextValue = "";
            $scope.headingText = "Next, Type your room number";
        };
        
        $scope.reEnteredNameInfo = false;
        $scope.reEnteredRoomInfo = false;
	$scope.reEnterLastName = function(){
                $scope.reEnteredNameInfo = true;
                $scope.reEnteredRoomInfo = false;
		$scope.mode = "search-mode";
		$scope.input.inputTextValue = $scope.reservationParams.last_name;
	};
	$scope.reEnterRoomNumber = function(){
                $scope.reEnteredRoomInfo = true;
                $scope.reEnteredNameInfo = false;
		$scope.mode = "search-final-mode";
		$scope.input.inputTextValue = $scope.reservationParams.room_no;
	};

	$scope.talkToStaff = function(){
		$state.go('zest_station.speak_to_staff');
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
            console.log(r)
            if($scope.isInCheckoutMode()){
            	// $state.go('zest_station.review_bill',{"res_id":r.id});
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
            if ($scope.isInCheckoutMode()){
                $scope.mode = "search-mode";
                $scope.headingText = "TYPE_LAST";
            }
            if ($scope.isInPickupKeyMode()){
                console.info('last at: '+$state.lastAt);
                
                $scope.at = 'input-last';
                $scope.mode = "pickup-mode";
                $scope.headingText = "TYPE_LAST";
                console.info('pick up key mode init');
                if ($state.lastAt === 're-enter-last'){
                $scope.headingText = "TYPE_LAST";
                    
                    
                    $scope.input.inputTextValue = $state.input.last;
                    $scope.at = 're-input-last';
                } else if ($state.lastAt === 're-enter-room'){
                    $scope.headingText = "Next, Type your room number";
                    
                    $scope.input.inputTextValue = $state.input.room;
                    $scope.at = 're-input-room';
                }
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