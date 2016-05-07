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


		/**********************************************************************************************
		 **			Please note that, not all the stateparams passed to this state will not be used in this state, 
         **      	however we will have to pass this so as to pass again to future states which will use these.
		 **      	
		 **			Expected state params -----> none    
		 **      	Exit function -> goToSignaturePage                              
		 **                                                                       
		 ***********************************************************************************************/

		/** MODES in the screen
		 *   1.RESERVATION_DETAILS --> view details 
		 *   2. --> Add / Remove Guests// placeholder
		 **/

		BaseCtrl.call(this, $scope);
		var getSelectedReservation = function() {
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
			//Deleting reservation details from zsCheckinSrv
			zsCheckinSrv.setSelectedCheckInReservation([]);
		};
		var setSelectedReservation = function() {
			zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
		};

		var fetchReservationDetails = function() {
			var onSuccessFetchReservationDetails = function(data) {
				$scope.selectedReservation.reservation_details = data.data.reservation_card;
				if (isRateSuppressed()) {
					$scope.selectedReservation.reservation_details.balance = 0;
				}
				fetchAddons();
			};
			$scope.invokeApi(zsCheckinSrv.fetchReservationDetails, {
				'id': $scope.selectedReservation.confirmation_number
			}, onSuccessFetchReservationDetails);
		};

		var fetchAddons = function() {
			var fetchCompleted = function(data) {
				$scope.selectedReservation.addons = data.existing_packages;
				//refreshScroller();
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(zsCheckinSrv.fetchAddonDetails, {
				'id': $scope.selectedReservation.reservation_details.reservation_id
			}, fetchCompleted);
		};

		var isRateSuppressed = function() {
			if ($scope.selectedReservation.reservation_details.is_rates_suppressed === 'true') {
				return true;
			}
		};


		var init = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
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
			getSelectedReservation();
			fetchReservationDetails();
		};
		init();

		$scope.addRemove = function() {
			setSelectedReservation();
			$state.go('zest_station.add_remove_guests');
		};

		//will need to check for ECI & Terms bypass, happy path for now


		var goToSignaturePage = function() {
			var stateParams = {
				'email': $scope.selectedReservation.guest_details[0].email,
				'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
				'room_no': $scope.selectedReservation.reservation_details.room_no,
				'first_name': $scope.selectedReservation.guest_details[0].first_name
			}
			$state.go('zest_station.checkInSignature', stateParams);
		};
		var initTermsPage = function() {
			console.log($scope.zestStationData);
			var bypassTerms = !$scope.zestStationData.kiosk_display_terms_and_condition;
			if (bypassTerms) { //add early check-in check here
				/*
				 * to be done:
				 *  -check for skipe CC 
				 *  -force deposit
				 */
				goToSignaturePage();

			} else {
				var stateParams = {
					'guest_id': $scope.selectedReservation.guest_details[0].id,
					'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
					'deposit_amount': $scope.selectedReservation.reservation_details.deposit_amount,
					'room_no': $scope.selectedReservation.reservation_details.room_no,
					'room_status': $scope.selectedReservation.reservation_details.room_status,
					'payment_type_id': $scope.selectedReservation.reservation_details.payment_type,
					'guest_email': $scope.selectedReservation.guest_details[0].email,
					'guest_email_blacklisted': $scope.selectedReservation.guest_details[0].is_email_blacklisted,
					'first_name': $scope.selectedReservation.guest_details[0].first_name
				}
				$state.go('zest_station.checkInTerms', stateParams);
			}
		};

		var initRoomError = function() {
			$state.go('zest_station.checkinRoomError');
		};


		var assignRoomToReseravtion = function() {
			var reservation_id = $scope.selectedReservation.id;
			console.info('::assigning room to reservation::', reservation_id);

			$scope.invokeApi(zsCheckinSrv.assignGuestRoom, {
				'reservation_id': reservation_id
			}, roomAssignCallback, roomAssignCallback);
		};
		var roomAssignCallback = function(response) {
			$scope.$emit('hideLoader');
			if (response.status && response.status === 'success') {
				$scope.selectedReservation.room = response.data.room_number;
				console.info('::room has been assigned: ', $scope.selectedReservation.room);
				initTermsPage();

			} else {
				initRoomError();
			}
		};


		var roomIsAssigned = function() {
			console.log('::reservation current room :: [ ', $scope.selectedReservation.room, ' ]');
			if ($scope.selectedReservation.room && (parseInt($scope.selectedReservation.room) === 0 || parseInt($scope.selectedReservation.room) > 0)) {
				return true;
			}
			return false;
		};

		var roomIsReady = function() {
			if ($scope.selectedReservation.reservation_details) {
				if ($scope.selectedReservation.reservation_details.room_status === "READY") {
					return true;
				} else return false;
			} else return false;
		};


		$scope.goToTerms = function() {
			console.log('$scope.selectedReservation: ', $scope.selectedReservation)
			console.log($scope.selectedReservation.reservation_details.reservation_id);

			var roomAssigned = roomIsAssigned(),
				roomReady = roomIsReady();
			console.info('roomAssigned: ', roomAssigned, ', roomReady: ', roomReady);

			if (!roomIsAssigned()) {
				assignRoomToReseravtion(); //assigns room, if success- goes to terms

			} else if (roomIsAssigned() && roomIsReady()) {
				initTermsPage();

			} else if (roomIsAssigned() && !roomIsReady()) {
				initRoomError();

			}

		};
	}
]);