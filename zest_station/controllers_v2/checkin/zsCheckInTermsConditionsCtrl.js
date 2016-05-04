sntZestStation.controller('zsCheckInTermsConditionsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'zsEventConstants',
	'zsCheckinSrv',
	'$stateParams',
	function($scope, $rootScope, $state, $stateParams, zsEventConstants, zsCheckinSrv, $stateParams) {


		//This controller is used for viewing reservation details 
                //add / removing additional guests and transitioning to 
                //early checkin upsell or terms and conditions

		/** MODES in the screen
		*   1.coming from RESERVATION_DETAILS --> now at terms and conditions 
                *   2. --> check reservation for deposit needed & if switch is active
                *   
		**/

		BaseCtrl.call(this, $scope);
		var init = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.zscheckInReservationDetailsCtrl');
			});
			//starting mode
			$scope.mode = "TERMS_CONDITIONS";
			
		};
		init();

		$scope.agreeTerms = function() {
                    $state.go('zest_station.checkInDeposit',{
                        'payment_type_id': $stateParams.payment_type_id,
                        'deposit_amount': $stateParams.deposit_amount,
                        'id': $stateParams.id,
                        'mode': 'DEPOSIT'
                    });
		};
	}
]);