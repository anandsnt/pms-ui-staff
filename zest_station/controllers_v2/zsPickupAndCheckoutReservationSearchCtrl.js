sntZestStation.controller('zsPickupAndCheckoutReservationSearchCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckoutSrv',
	'$stateParams',
	'$timeout',
	'zsCheckinSrv',
	'zsGeneralSrv',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckoutSrv, $stateParams, $timeout, zsCheckinSrv, zsGeneralSrv) {


		//This controller is used for searching reservation using last name
		//and room number

		/** MODES in the screen
		 *   1.LAST_NAME_ENTRY --> enter last name
		 *   2.ROOM_NUMBER_ENTRY --> enter room number
		 *   3.NO_MATCH --> no reservation found
		 **/

		BaseCtrl.call(this, $scope);

		var focuInputField = function(elementId) {
			$timeout(function() {
				if (!$scope.isIpad) {
					document.getElementById(elementId).focus();
				} else {
					$scope.callBlurEventForIpad();
				}
			}, 300);

		};
		var debugWithReservation = function(){
			//use this to quickly go through last name + room number and debug keys faster
			//just replace the below params for whichever reservation you want to use
			$scope.reservationParams = {
				"last_name": "mike",
				"room_no": "102"
			};
			setTimeout(function(){
				$scope.lastNameEntered();
			},300);

			setTimeout(function(){
				$scope.roomNumberEntered();
			},500);
		};
		var init = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				if (!$scope.zestStationData.checkout_keycard_lookup || $stateParams.mode === 'PICKUP_KEY') {
					$state.go('zest_station.home');
				} else {
					$state.go('zest_station.checkoutSearchOptions');
				};
			});
			if ($stateParams.mode === 'PICKUP_KEY'){
				$scope.setScreenIcon('key');
			} else {
				$scope.setScreenIcon('checkout');
			}
			//starting mode
			$scope.mode = "LAST_NAME_ENTRY";
			//debugWithReservation();//debugging, comment out before deploying
		};
		init();

		$scope.alreadyCheckedOutActions = function() {
			$scope.$emit('EJECT_KEYCARD');
			$state.go('zest_station.home');
		};

		var generalFailureActions = function() {
			$scope.mode = 'NO_MATCH';
			$scope.callBlurEventForIpad();
		};

		var fetchReservationDetailsForCheckingIn = function(reservation_id){
			
		var goToCheckinFlow = function(response) {
				zsCheckinSrv.setSelectedCheckInReservation(response.results);
				var primaryGuest = _.find(response.results[0].guest_details, function(guest_detail) {
					return guest_detail.is_primary === true;
				});

				if ($scope.zestStationData.check_in_collect_nationality) {
					$state.go('zest_station.collectNationality', {
						'guestId': primaryGuest.id,
						'first_name': primaryGuest.first_name,
						'pickup_key_mode': 'manual'
					});
				} else {
					$state.go('zest_station.checkInReservationDetails', {
						'first_name': primaryGuest.first_name,
						'pickup_key_mode': 'manual'
					});
				}
			};

			var options = {
				params: {'reservation_id':reservation_id},
				successCallBack: goToCheckinFlow,
				failureCallBack: generalFailureActions
			};
			$scope.callAPI(zsGeneralSrv.fetchCheckinReservationDetails, options);
		};

		var searchReservation = function() {
			var checkoutVerificationSuccess = function(data) {
				if (data.is_checked_out) {
					$scope.alreadyCheckedOut = true;
				} else if (!!$stateParams.mode && $stateParams.mode === 'PICKUP_KEY' && data.is_checked_in) {
					var stateParams = {
						'reservation_id': data.reservation_id,
						'room_no': $scope.reservationParams.room_no,
						"first_name": data.first_name
					};
					$state.go('zest_station.pickUpKeyDispense', stateParams);
				} else if (!!$stateParams.mode && $stateParams.mode === 'PICKUP_KEY' && !data.is_checked_in){
					if(data.guest_arriving_today){
						//go to Checkin flow -- CICO-32703
						fetchReservationDetailsForCheckingIn(data.reservation_id);
					}
					else{
						generalFailureActions();
					}
				} else {
					//checkout is allowed only if guest is departing 
					//on the bussiness day
					if(data.is_departing_today){
						var stateParams = {
							"from": "searchByName",
							"reservation_id": data.reservation_id,
							"email": data.email,
							"guest_detail_id": data.guest_detail_id,
							"has_cc": data.has_cc,
							"first_name": data.first_name,
							"last_name": data.last_name,
							"days_of_stay": data.days_of_stay,
							"hours_of_stay": data.hours_of_stay
							};
						$state.go('zest_station.checkoutReservationBill', stateParams);
					}
					else{
						generalFailureActions();
					}
					
				}
			};
			
			var params = {
				"last_name": $scope.reservationParams.last_name,
				"room_no": $scope.reservationParams.room_no + ''.replace(/\-/g, '') //adding '' to for non-str values
			};
			if ($stateParams.mode === 'PICKUP_KEY'){
				params.is_checked_in = true;
			}

			var options = {
				params: params,
				successCallBack: checkoutVerificationSuccess,
				failureCallBack: generalFailureActions
			};
			$scope.callAPI(zsCheckoutSrv.findReservation, options);
		};

		var roomNumberEntered = false;
		$scope.lastNameEntered = function() {
			//if room is already entered, no need to enter again
			if (roomNumberEntered) {
				if ($scope.reservationParams.room_no.length > 0){
					searchReservation();	
				}
				
			} else {
				if ($scope.reservationParams.last_name.length > 0) {
					$scope.mode = "ROOM_NUMBER_ENTRY";
					focuInputField("room-number");
				} else {
					return;
				};
			};
			$scope.resetTime();
		};

		$scope.roomNumberEntered = function() {
			roomNumberEntered = true;
			($scope.reservationParams.room_no.length > 0) ? searchReservation(): "";
			$scope.resetTime();
		};

		$scope.reEnterText = function(type) {
			if (type === "room") {
				$scope.mode = "ROOM_NUMBER_ENTRY";
				focuInputField("room-number");
			} else {
				$scope.mode = "LAST_NAME_ENTRY";
				focuInputField("last-name");
			}
		};

		$scope.talkToStaff = function() {
			$state.go('zest_station.speakToStaff');
		};
		/************* Fontainbleu specific ******************/

		$scope.tower = {
			'selected': ''
		};
		$scope.changedTheSelectedTower = function() {
			$scope.reservationParams.room_no = $scope.tower.selected;
		};
		var setTowers = function() {
			$scope.towerList = [];
			_.each($scope.zestStationData.towers, function(value, key) {
				$scope.towerList.push({
					name: key,
					value: value
				});
			});
			$scope.reservationParams.room_no = $scope.towerList[0].value;
			$scope.tower.selected = $scope.towerList[0].value;
		};

		// $scope.zestStationData.towers will be valid only for hotels that has
		// and will be supplied in api only then
		$scope.showTowers = (typeof $scope.zestStationData.towers !== 'undefined' && $scope.zestStationData.towers.length > 0);
		$scope.showTowers ? setTowers() : "";
	}
]);