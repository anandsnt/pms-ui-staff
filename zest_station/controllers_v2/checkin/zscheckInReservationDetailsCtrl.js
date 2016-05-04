sntZestStation.controller('zsCheckInReservationDetailsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckinSrv',
	'$stateParams',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv, $stateParams) {


		//This controller is used for viewing reservation details 
                //add / removing additional guests and transitioning to 
                //early checkin upsell or terms and conditions

		/** MODES in the screen
		*   1.RESERVATION_DETAILS --> view details 
                *   2. --> Add / Remove Guests// placeholder
		**/

		BaseCtrl.call(this, $scope);
		var getSelectedReservations = function(){
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservations();
			//Deleting reservation details from zsCheckinSrv
			zsCheckinSrv.setSelectedCheckInReservations([]);
		};

		var fetchReservationDetails = function(){
			var onSuccessFetchReservationDetails = function(data){
				$scope.selectedReservation.reservation_details =data.data.reservation_card;
				if(isRateSuppressed()){
					$scope.selectedReservation.reservation_details.balance = 0;
				}
				fetchAddons();
			};
			$scope.invokeApi(zsCheckinSrv.fetchReservationDetails, {
				'id': $scope.selectedReservation.confirmation_number
			}, onSuccessFetchReservationDetails);
		};

		var fetchAddons = function(){
			var fetchCompleted = function(data){
				$scope.selectedReservation.addons = data.existing_packages;
				//refreshScroller();
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(zsCheckinSrv.fetchAddonDetails, {
				'id':$scope.selectedReservation.reservation_details.reservation_id
			}, fetchCompleted);
		};

		var isRateSuppressed = function(){
			if ($scope.selectedReservation.reservation_details.is_rates_suppressed === 'true'){
			return true;
			}
		};
		var init = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.checkInReservationSearch');
				//what needs to be passed back to re-init search results
                //  if more than 1 reservation was found? else go back to input 2nd screen (confirmation, no of nites, etc..)
			});
			//starting mode
			$scope.mode = "RESERVATION_DETAILS";
			getSelectedReservations();
			fetchReservationDetails();
		};
		init();

		$scope.addRemove = function() {
			$state.go('zest_station.add_remove_guests');
		};
                
                //will need to check for ECI & Terms bypass, happy path for now
		$scope.goToTerms = function() {
                    console.log('$scope.selectedReservation: ',$scope.selectedReservation)
			$state.go('zest_station.checkInTerms',{
                            'id': $scope.selectedReservation.reservation_details.reservation_id,
                            'deposit_amount':$scope.selectedReservation.reservation_details.deposit_amount,
                            'room_no':$scope.selectedReservation.reservation_details.room_no,
                            'room_status':$scope.selectedReservation.reservation_details.room_status,
                            'payment_type_id':$scope.selectedReservation.reservation_details.payment_type,
                            'guest_email':$scope.selectedReservation.guest_details[0].email,
                            'guest_email_blacklisted':$scope.selectedReservation.guest_details[0].is_email_blacklisted,
                        });
		};
	}
]);