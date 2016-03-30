sntZestStation.controller('zsReservationDetailsCtrl', [
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
            if (current === 'zest_station.add_remove_guests'){
                $state.go('zest_station.reservation_details');
                
            } else if (current === 'zest_station.add_guest_first'){
                $state.go('zest_station.add_remove_guests');
                
            }  else if (current === 'zest_station.add_guest_last'){
                $state.go('zest_station.add_guest_first');
                
            } else {
                if ($state.lastAt === 'find-by-email'){
                    $state.go('zest_station.find_by_email');
                        
                } else if ($state.lastAt === 'find-by-confirmation'){
                    $state.go('zest_station.find_by_confirmation');
                    
                } else if ($state.lastAt === 'find-by-date'){
                    $state.go('zest_station.find_by_date');
                    
                }else if ($state.lastAt === 'find-by-no-of-nights'){
                    $state.go('zest_station.find_by_no_of_nights');
                    
                }
            }
            //$state.go ('zest_station.home');//go back to reservation search results
	});


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

        $scope.setAddGuestLast = function(){
            $scope.at = 'add-guest-last';
            $state.lastAt = 'add-guests';
            $scope.headingText = 'ENTER_LAST';
            setTimeout(function(){
                $scope.clearInputText();
            },50);
            
            
            $scope.hideNavBtns = false;
        };
        $scope.setAddGuestFirst = function(){
            $scope.at = 'add-guest-first';
            $state.lastAt = 'add-guests';
            $scope.headingText = 'ENTER_FIRST';
            setTimeout(function(){
                $scope.clearInputText();
            },50);
            $scope.hideNavBtns = false;
        };

        $scope.setAddRemoveScreen = function(){
            $scope.at = 'add-guests';
            $state.lastAt = 'reservation-details';
            $scope.addGuestsHeading = 'ADDTL_RESIDENTS';
            $scope.hideNavBtns = false;
        };
        $scope.formatCurrency = function(amt){
            return parseFloat(amt).toFixed(2);
         };

        $scope.goToHome = function(){
            $state.go ('zest_station.home');  
        };
        $scope.init = function(r){
            //$scope.inputFocus();
            var current=$state.current.name;
            $scope.selectedReservation = $state.selectedReservation;
            
            if (current === 'zest_station.early_checkin_unavailable' || 
                current === 'zest_station.early_checkin_nav' ||
                current === 'zest_station.early_checkin_prepaid') {
                    $scope.standardCheckinTime = $scope.zestStationData.check_in_time.hour+':'+$scope.zestStationData.check_in_time.minute+' '+$scope.zestStationData.check_in_time.primetime+'.';
            }
            
            if (current === 'zest_station.add_remove_guests'){
                $scope.setAddRemoveScreen();
                
            } else if (current === 'zest_station.add_guest_first'){
                $scope.setAddGuestFirst();
                
            }  else if (current === 'zest_station.add_guest_last'){
                $scope.setAddGuestLast();
                
            }  else if (current === 'zest_station.early_checkin_prepaid'){
                $state.earlyCheckinPurchased = true;
                $scope.is_early_prepaid = $state.is_early_prepaid;
                $scope.reservation_in_early_checkin_window = $state.reservation_in_early_checkin_window;
                
            } else {
                $scope.selectedReservation.reservation_details = {};
                $scope.hotel_settings = $scope.zestStationData;
                $scope.hotel_terms_and_conditions = $scope.zestStationData.hotel_terms_and_conditions;
                //fetch the idle timer settings
                $scope.currencySymbol = $scope.zestStationData.currencySymbol;
                
                var conf = $scope.selectedReservation.confirmation_number;
                if ($state.qr_code){
                    conf = $scope.selectedReservation.confirmation_num;
                }
                $scope.invokeApi(zsTabletSrv.fetchReservationDetails, {
                    'id': conf
                }, $scope.onSuccessFetchReservationDetails);
            }
            
            
            setDetailsHeight();
            $timeout(function() {
                    refreshScroller();
            }, 600);
            
        };
        $scope.checkinLater = function(){
            $state.go('zest_station.early_checkin_unavailable');
        };
        $scope.removeGuest = function(i){//where i is the index in $scope.selectedReservation.guest_details
            if ($state.selectedReservation.guest_details.length > 1){
                var guests = [];
                for (var x = 0; x < $state.selectedReservation.guest_details.length; x++){
                    if (i !== x){
                        guests.push($state.selectedReservation.guest_details[x]);
                    }
                }
                $state.selectedReservation.guest_details = guests;
            }
        };
        
        $scope.clearInputText = function(){
            $scope.input.inputTextValue = '';
        };
        
        $scope.addAGuest = function(){
            $state.go('zest_station.add_guest_first');
        };
        $scope.goToNext = function(){
            var current=$state.current.name;
            if (current === 'zest_station.add_guest_first'){
                
                $state.input.addguest_first = $scope.input.inputTextValue;
                $scope.clearInputText();
                //$scope.addGuestToReservation($scope.input.addguest_first,$scope.input.addguest_last);
                
                $state.go('zest_station.add_guest_last');
            } else if (current === 'zest_station.add_guest_last'){
                
                $state.input.addguest_last = $scope.input.inputTextValue;
                $scope.clearInputText();
                $scope.addGuestToReservation($state.input.addguest_first,$state.input.addguest_last);
                
                $state.go('zest_station.add_remove_guests');
            } else if (current === 'zest_station.add_remove_guests'){
                $state.go('zest_station.reservation_details');
            }
        };
        $scope.addGuestToReservation = function(){
            var first = $state.input.addguest_first,
            last = $state.input.addguest_last;
            $state.selectedReservation.guest_details.push({
                last_name: last,
                first_name: first
            });
        };
        
            $scope.clearInputText = function(){
                if ($scope.input){
                    $scope.input.inputTextValue = '';
                } else {
                    $scope.input = {
                        inputTextValue: ""
                    };
                    $scope.$digest();
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
            $scope.getRateTypeText = function(){
                if($scope.zestStationData.isHourlyRateOn){
                    return 'HOURLY_RATE';
                }else{
                    return 'AVG_DAILY';
                }
            };
            $scope.getModeText = function(){
                if($scope.zestStationData.isHourlyRateOn){
                    return 'HOURS';
                }else{
                    return 'DAY_NIGHTS';
                }
            };
            $scope.getTotalNightsOrHours = function(){
                if($scope.zestStationData.isHourlyRateOn){
                    return $scope.selectedReservation.total_hours;
                }else{
                    return $scope.selectedReservation.total_nights;
                }
            };
            
            $scope.initRoomError = function(){
                $state.go('zest_station.room_error');  
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
            
            $scope.beginEarlyCheckin = function(response){
                console.log('start early check-in ...response:',response);
                $state.reservation_in_early_checkin_window = response.reservation_in_early_checkin_window;
                var inUpsellWindow = response.reservation_in_early_checkin_window,
                        is_room_ready = response.is_room_ready;
                console.log('inUpsellWindow: ',inUpsellWindow);
                $scope.earlyCheckinOfferId = response.early_checkin_offer_id;
                if (response.early_checkin_charge === null){
                    $scope.selectedReservation.earlyCheckinCharge = '0';
                    $scope.selectedReservation.earlyCheckinChargeSymbol = $scope.zestStationData.currencySymbol;
                } else {
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
                                $state.go('zest_station.early_checkin_unavailable');
                           }
                       }
                        
                    } else {
                        if (inUpsellWindow && is_room_ready){
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
                    response.is_early_prepaid = response.offer_eci_bypass;
                    
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


            $scope.onSuccessFetchReservationDetails = function(data){
                    $scope.selectedReservation.reservation_details = data;
                    //$scope.input.lastEmailValue = data.reservation_card;
                    
                    var info = data.data.reservation_card;
                    var nites, avgDailyRate, packageRate, taxes, subtotal, deposits, balanceDue;
                    nites = parseInt(info.total_nights);
                    $scope.selectedReservation.total_nights = nites;
                    $scope.selectedReservation.total_hours = info.no_of_hours;
                    avgDailyRate = parseFloat(info.avg_daily_rate).toFixed(2);
                    
                    deposits = parseFloat(info.deposit_attributes.deposit_paid).toFixed(2);
                    
                    if (info.deposit_attributes.packages){
                        packageRate = parseFloat(info.deposit_attributes.packages).toFixed(2);
                    } else {
                        packageRate = 0;
                    }
                    
                    taxes = parseFloat(info.deposit_attributes.fees).toFixed(2);
                    
                    subtotal = parseFloat(info.deposit_attributes.sub_total).toFixed(2);
                    
                    balanceDue = parseFloat(info.deposit_attributes.outstanding_stay_total).toFixed(2);
                    
                    
                  
                  
                  //comma format
                  avgDailyRate = zsUtilitySrv.CommaFormatted((parseFloat(avgDailyRate))+'');
                  packageRate  = zsUtilitySrv.CommaFormatted((parseFloat(packageRate))+'');
                  taxes        = zsUtilitySrv.CommaFormatted((parseFloat(taxes))+'');
                  subtotal = zsUtilitySrv.CommaFormatted((parseFloat(subtotal))+'');
                  deposits = zsUtilitySrv.CommaFormatted((parseFloat(deposits))+'');
                  balanceDue = zsUtilitySrv.CommaFormatted((parseFloat(balanceDue))+'');
                  
                  
                  //in-view elements
                  $scope.selectedReservation.reservation_details.daily_rate  = zsUtilitySrv.getFloat(avgDailyRate);
                  
                  $scope.selectedReservation.reservation_details.package_price = zsUtilitySrv.getFloat(packageRate);
                  
                  $scope.selectedReservation.reservation_details.taxes = zsUtilitySrv.getFloat(taxes);
                  
                  $scope.selectedReservation.reservation_details.sub_total = zsUtilitySrv.getFloat(subtotal);
                  
                  $scope.selectedReservation.reservation_details.deposits = zsUtilitySrv.getFloat(deposits);
                  
                  $scope.selectedReservation.reservation_details.balance = zsUtilitySrv.getFloat(balanceDue);
                 
                 
                    $scope.checkIfSupressed();
                 //reservation_addons?reservation_id=1646512
                 var fetchCompleted = function(addonData){
                     $scope.$emit('hideLoader');
                     $scope.selectedReservation.addons = addonData.existing_packages;
                     
                     var items = $scope.selectedReservation.addons.length;
                     for (var i=0; i < items; i++){
                         if (i === (items-1)){
                             $scope.selectedReservation.addons[i].isLastAddon = true;
                         } else {
                             $scope.selectedReservation.addons[i].isLastAddon = false;
                         }
                     }
                     refreshScroller();
                     
                 };
                  $scope.invokeApi(zsTabletSrv.fetchAddonDetails, {
                            'id':info.reservation_id
                        }, fetchCompleted);
                 
                    $scope.$emit('hideLoader');
            };


            $scope.checkIfSupressed = function(){
                //if selected rate is supressed, set flag;
                $scope.is_rates_suppressed = false;
                if ($scope.selectedReservation){
                    if ($scope.selectedReservation.reservation_details){
                        if ($scope.selectedReservation.reservation_details.data){
                            var rateData = $scope.selectedReservation.reservation_details.data;
                            if (rateData.reservation_card.is_rates_suppressed === 'true'){
                                $scope.is_rates_suppressed = true;
                                /*
                                 * Since the rate is supressed, the balance will need to be set to 0.00 unless a different requirement for the hotel exists
                                 * Yotel / Zoku currently set to 0.00 balance in Reservation details as of Sprint 38
                                 */
                                $scope.selectedReservation.reservation_details.balance = 0.00;

                            }
                        }
                    }
                }
            };


            $scope.addRemoveGuests = function(){
              $state.go('zest_station.add_remove_guests');
            };




 		$scope.setScroller('details');

 		var setDetailsHeight = function(){
 			if($('#textual').length) {
		        var $contentHeight = ($('#content').outerHeight()),
		            $h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
		            $h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
		            $h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
		            $headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
		            $textualHeight = parseFloat($contentHeight-$headingsHeight);		
		       		$('#textual').css('max-height', $textualHeight + 'px');
   		 	}
 		};
        var refreshScroller = function(){
        	$scope.refreshScroller('details');
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
                $scope.init();
	}();
        
        

}]);