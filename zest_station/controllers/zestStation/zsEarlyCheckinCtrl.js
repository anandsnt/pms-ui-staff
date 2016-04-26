sntZestStation.controller('zsEarlyCheckinCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsPaymentSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
	'$timeout',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsPaymentSrv, zsUtilitySrv, $stateParams, $sce, $timeout) {

	BaseCtrl.call(this, $scope);
        sntZestStation.filter('unsafe', function($sce) {
                return function(val) {
                    return $sce.trustAsHtml(val);
                };
            });
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            var current=$state.current.name;
            
            console.log(current);
            
            if (current === 'zest_station.early_checkin_unavailable'){
                $state.go('zest_station.reservation_details');
            } 
            if (current === 'zest_station.early_checkin_prepaid'){
                $state.go('zest_station.reservation_details');
            } 
            if (current === 'zest_station.early_checkin_nav'){
                $state.go('zest_station.reservation_details');
            } 
            
            if (current === 'zest_station.add_remove_guests'){
                $state.go('zest_station.reservation_details');
            } 
	});

	$scope.isInCheckinMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKIN_MODE);
	};

	$scope.isInCheckoutMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKOUT_MODE);
	};

	$scope.isInPickupKeyMode = function() {
		return ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE);
	};

        $scope.goToHome = function(){
            $state.go ('zest_station.home');  
        };
        $scope.init = function(r){
            var current=$state.current.name;
            $scope.selectedReservation = $state.selectedReservation;
            
            if (current === 'zest_station.early_checkin_upsell'){
                $scope.onStartCheckinUpsell();
            } else if (current === 'zest_station.early_checkin_unavailable' || 
                current === 'zest_station.early_checkin_nav' ||
                current === 'zest_station.early_checkin_prepaid') {
                    $scope.standardCheckinTime = $scope.zestStationData.check_in_time.hour+':'+$scope.zestStationData.check_in_time.minute+' '+$scope.zestStationData.check_in_time.primetime+'.';
            }
            if (current === 'zest_station.early_checkin_prepaid'){
                //$state.earlyCheckinPurchased = true;
                $scope.is_early_prepaid = $state.is_early_prepaid;
                $scope.reservation_in_early_checkin_window = $state.reservation_in_early_checkin_window;
            } 
            
        };
        $scope.checkinLater = function(){
            $state.go('zest_station.early_checkin_unavailable');
        };
        
        
        
            
            
            $scope.assignRoomToReseravtion = function(){
                 var reservation_id = $scope.selectedReservation.id;
                        $scope.invokeApi(zsTabletSrv.assignGuestRoom, {
                         'reservation_id':reservation_id
                     }, $scope.roomAssignCallback, $scope.roomAssignCallback); 
            };
            $scope.roomAssignCallback = function(response){
                $scope.$emit('hideLoader');
                if (response.status && response.status === 'success'){
                    $scope.selectedReservation.room = response.data.room_number;
                    $scope.initTermsPage();
                   
                } else {
                    $scope.initRoomError();
                }
            };
            $scope.roomIsAssigned = function(){
              if ($scope.selectedReservation.room && (parseInt($scope.selectedReservation.room) === 0 || parseInt($scope.selectedReservation.room) > 0)){
                  return true;
              }
              return false;
            };
            
            $scope.roomIsReady = function(){
                if ($scope.selectedReservation.reservation_details.data){
                    if ($scope.selectedReservation.reservation_details.data.reservation_card.room_status === "READY"){
                        return true;
                    } else return false;
                } else return false;
            };
        
        
        $scope.goToTerms = function(){
            if (!$scope.roomIsAssigned()){
                $scope.assignRoomToReseravtion();
            } else if ($scope.roomIsAssigned() && $scope.roomIsReady()){
                  $scope.initTermsPage();
            } else if ($scope.roomIsAssigned() && !$scope.roomIsReady()){
                $scope.initRoomError();
            }
        };
        
        
        $scope.initRoomError = function(){
            $state.go('zest_station.room_error');  
        };
            
        $scope.beginEarlyCheckin = function(response){
            $state.reservation_in_early_checkin_window = response.reservation_in_early_checkin_window;
            var inUpsellWindow = response.reservation_in_early_checkin_window;

            $state.earlyCheckinOfferId = response.early_checkin_offer_id;

            if (response.early_checkin_charge !== null){
                $scope.selectedReservation.earlyCheckinCharge = response.early_checkin_charge;
            }


            if (!response.is_room_ready || !response.is_room_already_assigned){
                $scope.initRoomError();

            } else {
                if ($scope.reservationIncludesEarlyCheckin(response)){
                    
                            $scope.selectedReservation.earlyCheckinCharge = response.early_checkin_charge;
                            $state.earlyCheckinOfferId = response.early_checkin_offer_id;
                            $state.early_checkin_offer_id = response.early_checkin_offer_id;
                            $state.go('zest_station.early_checkin_prepaid');
                    
                } else {//room is assumed to be pre-assigned and ready at this point
                    
                    if (inUpsellWindow && response.early_checkin_charge !== null){
                        $state.earlyCheckinOfferId = response.early_checkin_offer_id;
                        if (response.is_early_checkin_bundled_by_addon){
                            $state.go('zest_station.early_checkin_prepaid');
                        } else {
                            $state.go('zest_station.early_checkin_nav');
                        }
                        
                    } else if (inUpsellWindow && response.early_checkin_charge === null){
                        //update reservation to show arrival time is now, so guest may be elligible for early check-in on-site
                        
                        //fetch the early checkin charge code so guest can check-in early after purchase
                        var onSuccess = function(response){
                          console.log('updated reservation time response: ',response);
                            $scope.selectedReservation.earlyCheckinCharge = response.early_checkin_charge;
                            $state.earlyCheckinOfferId = response.early_checkin_offer_id;
                            if (response.is_early_checkin_bundled_by_addon){
                                $state.go('zest_station.early_checkin_prepaid');
                            } else {
                                $state.go('zest_station.early_checkin_nav');
                            }
                            
                        };
                        $scope.updateReservationTime(onSuccess);
                        
                    } else {
                        $state.go('zest_station.early_checkin_unavailable');
                    }
                }
            }
        };
        
        $scope.onGeneralError = function(response){
            $scope.$emit('GENERAL_ERROR',response);
        };
        $scope.updateReservationTime = function(onsuccess){
            
                $scope.$emit('hideLoader');
                var today = new Date();
                var hours = today.getHours(),
                        min = today.getMinutes();
                console.log(hours+':'+min);
                        
                var currentTime = hours+':'+min;
                var params = {
                        "arrival_time": getFormattedTime(currentTime),
                        "reservation_id": $scope.selectedReservation.id
                };
                var options = {
                        params: params,
                        'successCallBack': onsuccess,
                        'failureCallBack': $scope.onGeneralError
                };
                $scope.callAPI(zsTabletSrv.updateReservationArrivalTime, options);
                
        };
        
        
        var getFormattedTime = function(timeToFormat) {
          //change format to 24 hours
          var timeHour = parseInt(timeToFormat.slice(0, 2));
          var timeMinute = timeToFormat.slice(3, 5);
          var primeTime = timeToFormat.slice(-2).toLowerCase();
          if (primeTime === 'pm' && timeHour < 12) {
            timeHour = timeHour + 12;
          } else if (primeTime === 'am' && timeHour === 12) {
            timeHour = timeHour - 12;
          }
          timeHour = (timeHour < 10) ? ("0" + timeHour) : timeHour;
          return timeHour + ":" + timeMinute;
        };
        
        
        
            
        $scope.earlyCheckinPurchaseResponse = function(response){
            console.log('early checkin purchase response: ',response);
            $state.earlyCheckinPurchased = true;
            $state.go('zest_station.reservation_details');//should now show the early checkin as an addon
        };

        $scope.acceptEarlyCheckinOffer = function(){
            console.log('accepting early checkin offer: ',$state.earlyCheckinOfferId)
            console.log('reservation id: ',$scope.selectedReservation.id)
           $scope.callAPI(zsPaymentSrv.acceptEarlyCheckinOffer, {
                params: {
                    reservation_id: $scope.selectedReservation.id,
                    early_checkin_offer_id: $state.earlyCheckinOfferId
                },
                'successCallBack':$scope.earlyCheckinPurchaseResponse,
                'failureCallBack':$scope.failureCallBack
            });

        };
            
        $scope.earlyCheckinActiveForReservation = function(data){//early check-in (room available)
                var early_checkin_free = data.offer_eci_bypass;
                
                console.log('--HOTEL--');
                console.log('early checkin active: ',data.early_checkin_on);
                console.log('early checkin available   : ',data.early_checkin_available);
                console.log('---------');
                console.log('--STATION--');
                console.log('early checkin active : ',$scope.zestStationData.offer_early_checkin);
                console.log('---------');
                console.log('--RESERVATION--');
                console.log('early Checkin Purchased: ',$state.earlyCheckinPurchased);
                console.log('in early window: ',data.reservation_in_early_checkin_window);
                console.log('has free early chkin   : ',early_checkin_free);
                console.log('---------');

                if (!data.early_checkin_available && //if no early checkin is available but early checkin flow is On, go to unavailable screen
                        $scope.zestStationData.offer_early_checkin && 
                        data.early_checkin_on){
                    $state.go('zest_station.early_checkin_unavailable');
                    return false;
                }
                    
                if (//if early checkin is not yet purchased and meets early upsell criteria..try to sell early checkin
                    $scope.zestStationData.offer_early_checkin && // hotel admin > station > checkin
                    data.early_checkin_available && //hotel admin > promos & upsell > early checkin upsell
                    data.early_checkin_on           //hotel admin > promos & upsell > early checkin upsell
                  ){
                    return true;//proceed to early checkin flow
                } else {
                    return false;//continue without early checkin offer
                }
        };
        $scope.reservationIncludesEarlyCheckin = function(data){
            if (!$scope.zestStationData.offer_early_checkin || 
                    !data.early_checkin_on || 
                    !data.early_checkin_available || 
                    !data.reservation_in_early_checkin_window){
                return false;
            }
            
            if (data.guest_arriving_today && data.offer_eci_bypass){
                console.info('selected reservation includes free early check-in!');
                return true;
            } else {
                console.info('selected reservation does Not include free early check-in.');
                return false;
            }
        };
        
        $scope.shouldGoToEarlyCheckInFlow = function(response){
            if (!response.reservation_in_early_checkin_window){
                return false;
            }
            
            if ($scope.earlyCheckinActiveForReservation(response) || 
                    $scope.reservationIncludesEarlyCheckin(response)){
                return true;
            } else return false;
        };
        
        
        $scope.onStartCheckinUpsell = function(){
            /*
             * Need to fetch the upsell details for Early Checkin
             * ** If early check-in is Active and they have not already purchased an early checkin
             * --then go through early checkin flow, otherwise continue to next screen (typically terms and conditions)
             * 
             */
            var onSuccessResponse = function(response){
                console.log(response);
                response.is_early_prepaid = false;

                if (response.offer_eci_bypass){//if bypass is true, early checkin may be part of their Rate
                    response.is_early_prepaid = false;
                }
                
                if (response.is_early_checkin_purchased || response.is_early_checkin_bundled_by_addon){//user probably purchased an early checkin from zest web, or through zest station
                     response.is_early_prepaid = true;                                         //or was bundled in an add-on (the add-on could be paid or free, so show prepaid either way)
                }
                
                $state.is_early_prepaid = response.is_early_prepaid;
                
                
                
                
                
                console.log('shouldGoToEarlyCheckInFlow: ',$scope.shouldGoToEarlyCheckInFlow(response));
                if (!$state.earlyCheckinPurchased && //meaning if they purchased it through zest station a minute ago...dont re-prompt the user
                        $scope.shouldGoToEarlyCheckInFlow(response)){
                        //fetch reservation info with upsell data from /guest_web/reservations/{res_id}.json
                        $scope.beginEarlyCheckin(response);
                } else {
                    $state.hotel_terms_and_conditions = $scope.hotel_terms_and_conditions;
                    $state.go('zest_station.terms_conditions');
                }
            };

            $scope.callAPI(zsTabletSrv.fetchUpsellDetails, {
                params: {
                    id: $scope.selectedReservation.id
                },
                'successCallBack':onSuccessResponse,
                'failureCallBack':$scope.failureCallBack
            });
        };
            
        $scope.initTermsPage = function(continueWithEarlyCheckin){
            if (continueWithEarlyCheckin){
                    $state.hotel_terms_and_conditions = $scope.hotel_terms_and_conditions;
                    $state.go('zest_station.terms_conditions');
            } else {
                $scope.onStartCheckinUpsell();
            }
        };

	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);
		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
                $scope.init();
	}();
}]);