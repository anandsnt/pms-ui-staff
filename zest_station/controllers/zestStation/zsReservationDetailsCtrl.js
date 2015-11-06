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
            console.info('called go back')	
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




        $scope.init = function(r){
            $scope.selectedReservation = $state.selectedReservation;
            $scope.selectedReservation.reservation_details = {};
               console.info('$scope.zestStationData: ',$scope.zestStationData)
            $scope.hotel_settings = $scope.zestStationData;
            $scope.hotel_terms_and_conditions = $scope.zestStationData.hotel_terms_and_conditions;
            //fetch the idle timer settings
            $scope.currencySymbol = $scope.zestStationData.currencySymbol;
            
            
            
            
            
            $scope.invokeApi(zsTabletSrv.fetchReservationDetails, {
                'id': $scope.selectedReservation.confirmation_number
            }, $scope.onSuccessFetchReservationDetails);
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