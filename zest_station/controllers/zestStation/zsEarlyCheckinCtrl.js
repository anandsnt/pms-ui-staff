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
            
            console.log(current)
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
            //$scope.inputFocus();
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
                $state.earlyCheckinPurchased = true;
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
            console.log('goToTerms');
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
            var inUpsellWindow = response.reservation_in_early_checkin_window,
                    is_room_ready = response.is_room_ready;

            $scope.earlyCheckinOfferId = response.early_checkin_offer_id;

            if (response.early_checkin_charge !== null){
                $scope.selectedReservation.earlyCheckinCharge = response.early_checkin_charge;
            }


            if (!response.is_room_ready || !response.is_room_already_assigned){
                $scope.initRoomError();

            } else {

                if ($scope.reservationIncludesEarlyCheckin(response)){
                   if (response.is_early_prepaid){
                       $state.is_early_prepaid = true;
                        $state.go('zest_station.early_checkin_prepaid');

                   } else {
                       $state.is_early_prepaid = false;
                       if (inUpsellWindow){
                            $state.go('zest_station.early_checkin_prepaid');
                       }
                   }

                } else {
                    if (inUpsellWindow && is_room_ready && response.early_checkin_charge !== null){
                        $state.go('zest_station.early_checkin_nav');
                    } else {
                        $state.go('zest_station.early_checkin_unavailable');
                    }
                }
            }
        };
            
        $scope.earlyCheckinPurchaseResponse = function(response){
            console.log('early checkin purchase response: ',response);
            $state.earlyCheckinPurchased = true;
            $state.go('zest_station.reservation_details');//should now show the early checkin as an addon
        };

        $scope.acceptEarlyCheckinOffer = function(){
            console.log('accepting early checkin offer: ',$scope.earlyCheckinOfferId)
            console.log('reservation id: ',$scope.selectedReservation.id)
           $scope.callAPI(zsPaymentSrv.acceptEarlyCheckinOffer, {
                params: {
                    reservation_id: $scope.selectedReservation.id,
                    early_checkin_offer_id: $scope.earlyCheckinOfferId
                },
                'successCallBack':$scope.earlyCheckinPurchaseResponse,
                'failureCallBack':$scope.failureCallBack
            });

        };
            
        $scope.earlyCheckinActiveForReservation = function(data){//early check-in (room available)
                $scope.zestStationData.early_checkin_free = data.offer_eci_bypass;
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
                console.log('has free early chkin   : ',$scope.zestStationData.early_checkin_free);
                console.log('---------');

                if (!$state.earlyCheckinPurchased && (//if early checkin is not yet purchased and meets early upsell criteria..try to sell early checkin
                    $scope.zestStationData.offer_early_checkin && // hotel admin > station > checkin
                    data.early_checkin_available && //hotel admin > promos & upsell > early checkin upsell
                    data.early_checkin_on //hotel admin > promos & upsell > early checkin upsell
                  )){
                    return true;//proceed to early checkin flow
                } else {
                    return false;//continue without early checkin offer
                }
        };
        $scope.reservationIncludesEarlyCheckin = function(data){
            if (data.guest_arriving_today && data.offer_eci_bypass){
                console.info('selected reservation includes free early check-in!');
                return true;
            } else {
                console.info('selected reservation does Not include free early check-in.');
                return false;
            }
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
                //debugging prepaid;
                //response.offer_eci_bypass = true;
                response.is_early_prepaid = false;

                if (response.offer_eci_bypass){
                    if (response.early_checkin_charge !== null && response.early_checkin_offer_id !== null){
                        response.is_early_prepaid = true;
                    } else {
                        response.is_early_prepaid = false;
                    }
                }

                if (!$state.earlyCheckinPurchased &&
                    (
                        $scope.earlyCheckinActiveForReservation(response) || 
                        $scope.reservationIncludesEarlyCheckin(response))
                     ){
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
            
        $scope.initTermsPage = function(){
            $scope.onStartCheckinUpsell();
        };

	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);
		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
                $scope.init();
	}();
}]);