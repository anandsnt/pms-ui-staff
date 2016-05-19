sntZestStation.controller('zsCheckinEarlyCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	 'zsCheckinSrv',
	function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv) {

		/**********************************************************************************************
		**		Please note that, not all the stateparams passed to this state will not be used in this state, 
        **      however we will have to pass this so as to pass again to future states which will use these.
		**
        **      Expected state params -----> early_checkin_data (will be parsed back to object)    
        **      Exit function -> successCallBack                              
        **                                                                       
        ***********************************************************************************************/

		BaseCtrl.call(this, $scope);
                
		var init = function() {
                    console.log('init')
                    $scope.$emit('hideLoader');//need to fix why loader is still appearing after init/success call
                    console.info('init early checkin ctrl: ',$stateParams);
                    
                    var params = JSON.parse($stateParams.early_checkin_data);
                    var earlyCheckinChargeSymbol = $stateParams.early_charge_symbol;
                    
                    setEarlyParams(params,earlyCheckinChargeSymbol);
                    
		};
                
                var earlyCheckinOn = function(data){
                  //check 3 settings: 
                  //    hotel > promo upsell > early checkin active
                  //    hotel > promo upsell > early checkin available (limit not reached)
                  //    zest station > checkin > early checkin active
                    if (!data.early_checkin_on || !data.early_checkin_available || !$scope.zestStationData.offer_early_checkin){
                        return false;
                    } else return true;
                    
                };
                
                var setEarlyParams = function(response){
                    console.info('===============')
                    console.info('===============',response)
                    console.info('===============')
                    response.is_early_prepaid = false;
                    $scope.reservation_in_early_checkin_window = response.reservation_in_early_checkin_window;

                    if (response.offer_eci_bypass) {//if bypass is true, early checkin may be part of their Rate
                        response.is_early_prepaid = false;
                    }

                    if (response.is_early_checkin_purchased || response.is_early_checkin_bundled_by_addon) {//user probably purchased an early checkin from zest web, or through zest station
                        response.is_early_prepaid = true;                                         //or was bundled in an add-on (the add-on could be paid or free, so show prepaid either way)
                    }
                    console.log('is_early_prepaid: ',response.is_early_prepaid);
                    $scope.is_early_prepaid = response.is_early_prepaid;
                    $scope.standardCheckinTime = response.checkin_time;
                    $scope.early_checkin_charge
                };

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

			init();
		}();

	}
]);