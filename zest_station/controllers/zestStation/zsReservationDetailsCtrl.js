sntZestStation.controller('zsReservationDetailsCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce) {

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
            $scope.headingText = 'Enter the Guests Last Name';
            setTimeout(function(){
                $scope.clearInputText();
            },50)
            
            
            $scope.hideNavBtns = false;
        };
        $scope.setAddGuestFirst = function(){
            $scope.at = 'add-guest-first';
            $state.lastAt = 'add-guests';
            $scope.headingText = 'Enter the Guests First Name';
            setTimeout(function(){
                $scope.clearInputText();
            },50)
            $scope.hideNavBtns = false;
        };

        $scope.setAddRemoveScreen = function(){
            $scope.at = 'add-guests';
            $state.lastAt = 'reservation-details';
            $scope.addGuestsHeading = 'Additional Guests';
            $scope.hideNavBtns = false;
        };
        $scope.formatCurrency = function(amt){
            return parseFloat(amt).toFixed(2);
         };


        $scope.init = function(r){
            var current=$state.current.name;
            console.info('current: ',current);
            $scope.selectedReservation = $state.selectedReservation;
            if (current === 'zest_station.add_remove_guests'){
                $scope.setAddRemoveScreen();
                
            } else if (current === 'zest_station.add_guest_first'){
                $scope.setAddGuestFirst();
                
            }  else if (current === 'zest_station.add_guest_last'){
                $scope.setAddGuestLast();
                
            } else {
                $scope.selectedReservation.reservation_details = {};
                   console.info('$scope.zestStationData: ',$scope.zestStationData)
                $scope.hotel_settings = $scope.zestStationData;
                $scope.hotel_terms_and_conditions = $scope.zestStationData.hotel_terms_and_conditions;
                //fetch the idle timer settings
                $scope.currencySymbol = $scope.zestStationData.currencySymbol;

                $scope.invokeApi(zsTabletSrv.fetchReservationDetails, {
                    'id': $scope.selectedReservation.confirmation_number
                }, $scope.onSuccessFetchReservationDetails);
            }
            
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
            console.warn($state.selectedReservation)
            $state.selectedReservation.guest_details.push({
                last_name: last,
                first_name: first
            });
            console.info({
                last_name: last,
                first_name: first
            }, 'added')
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
        
            $scope.goToTerms = function(){
                $state.hotel_terms_and_conditions = $scope.hotel_terms_and_conditions;
                $state.go('zest_station.terms_conditions');
            };


            $scope.onSuccessFetchReservationDetails = function(data){
                    $scope.selectedReservation.reservation_details = data;
                    //$scope.input.lastEmailValue = data.reservation_card;
                    
                    var info = data.data.reservation_card;
                    var nites, avgDailyRate, packageRate, taxes, subtotal, deposits, balanceDue;
                    nites = parseInt(info.total_nights);
                    $scope.selectedReservation.total_nights = nites;
                    avgDailyRate = parseFloat(info.deposit_attributes.room_cost).toFixed(2);
                    
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
              console.info('add remove guests')  ;
              $state.go('zest_station.add_remove_guests');
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