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

        $scope.setScroller('res-details');

        var refreshScroller = function() {
            $scope.refreshScroller('res-details');
        };
		var getSelectedReservation = function() {
			  //the data is service will be reset after the process from zscheckInReservationSearchCtrl
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
		};
		var setSelectedReservation = function() {
			zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
		};

		var fetchReservationDetails = function() {
			var onSuccessFetchReservationDetails = function(data) {
				$scope.selectedReservation.reservation_details = data.data.reservation_card;
				if ($scope.isRateSuppressed()) {
					$scope.selectedReservation.reservation_details.balance = 0;
				}
				fetchAddons();
				setDisplayContentHeight();//utils function
				refreshScroller();
			};
                        
                        
                        $scope.callAPI(zsCheckinSrv.fetchReservationDetails, {
                            params: {
                                'id': $scope.selectedReservation.confirmation_number
                            },
                            'successCallBack': onSuccessFetchReservationDetails,
                            'failureCallBack': onSuccessFetchReservationDetails
                        });
                        
		};

		var fetchAddons = function() {
			var fetchCompleted = function(data) {
				$scope.selectedReservation.addons = data.existing_packages;
				//refreshScroller();
				setDisplayContentHeight();
			};
                        
                        
                        $scope.callAPI(zsCheckinSrv.fetchAddonDetails, {
                            params: {
                                'id': $scope.selectedReservation.reservation_details.reservation_id
                            },
                            'successCallBack': fetchCompleted,
                            'failureCallBack': fetchCompleted
                        });
		};

		$scope.isRateSuppressed = function() {
			if ($scope.selectedReservation.reservation_details.is_rates_suppressed === 'true') {
				return true;
			}
		};


		var init = function() {
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				var reservations = zsCheckinSrv.getCheckInReservations();
				if($scope.zestStationData.check_in_collect_nationality){
					$state.go('zest_station.collectNationality',{'guestId':$scope.selectedReservation.guest_details[0].id});
				}else if(reservations.length > 0){
					$state.go('zest_station.selectReservationForCheckIn');
				}
				else{
					$state.go('zest_station.checkInReservationSearch');
				}
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
                
                
                
        var shouldGoToEarlyCheckInFlow = function (response) {
            if (!response.reservation_in_early_checkin_window) {
                return false;
            }

            if (earlyCheckinActiveForReservation(response) ||
                    reservationIncludesEarlyCheckin(response)) {
                return true;
            } else
                return false;
        };

        var earlyCheckinActiveForReservation = function (data) {//early check-in (room available)
            var early_checkin_free = data.offer_eci_bypass;

            console.log('--HOTEL--');
            console.log('early checkin active: ', data.early_checkin_on);
            console.log('early checkin available   : ', data.early_checkin_available);
            console.log('---------');
            console.log('--STATION--');
            console.log('early checkin active : ', $scope.zestStationData.offer_early_checkin);
            console.log('---------');
            console.log('--RESERVATION--');
            console.log('early Checkin Purchased: ', $state.earlyCheckinPurchased);
            console.log('in early window: ', data.reservation_in_early_checkin_window);
            console.log('has free early chkin   : ', early_checkin_free);
            console.log('---------');

            if (!data.early_checkin_available && //if no early checkin is available but early checkin flow is On, go to unavailable screen
                    $scope.zestStationData.offer_early_checkin &&
                    data.early_checkin_on) {
                $state.go('zest_station.early_checkin_unavailable');
                return false;
            }

            if (//if early checkin is not yet purchased and meets early upsell criteria..try to sell early checkin
                    $scope.zestStationData.offer_early_checkin && // hotel admin > station > checkin
                    data.early_checkin_available && //hotel admin > promos & upsell > early checkin upsell
                    data.early_checkin_on           //hotel admin > promos & upsell > early checkin upsell
                    ) {
                return true;//proceed to early checkin flow
            } else {
                return false;//continue without early checkin offer
            }
        };
        
        var reservationIncludesEarlyCheckin = function (data) {
            if (!$scope.zestStationData.offer_early_checkin ||
                    !data.early_checkin_on ||
                    !data.early_checkin_available ||
                    !data.reservation_in_early_checkin_window) {
                return false;
            }

            console.log('data.offer_eci_free_vip: ', data.offer_eci_free_vip);
            console.log('data.offer_eci_bypass: ', data.offer_eci_bypass);
            console.log('data.free_eci_for_vips: ', data.free_eci_for_vips);

            //data.offer_eci_free_vip - later story s54+ ~ offer free ECI when reservation has vip code & matches a free ECI vip code (admin section to be added)
            //for now, using toggle switch - if free_eci_for_vips is enabled, and guest is VIP, then they get free ECI :)
            if (data.guest_arriving_today && (data.offer_eci_bypass || (data.free_eci_for_vips && data.is_vip))) {
                var freeForVip = '';
                if (data.free_eci_for_vips && data.is_vip) {
                    freeForVip = ' [ for vip guest ]';
                }
                ;
                console.info('selected reservation includes free early check-in! ' + freeForVip);
                return true;
            } else {
                console.info('selected reservation does Not include free early check-in.');
                return false;
            }
        };
                
		var generalError = function(response) {
                    console.warn(response);
			$scope.$emit('GENERAL_ERROR');
		};
                
                var fetchEarlyCheckinSettings = function(onSuccessCallback){
                    console.info(': fetchEarlyCheckinSettings :')
                    
                     var onSuccessResponse = function (response) {
                        console.info(': fetchEarlyCheckinSettings => onSuccessResponse :',response)
                        onSuccessCallback(response);
                    };
                    
                    
                    $scope.callAPI(zsCheckinSrv.fetchUpsellDetails, {
                        params: {
                            id: $scope.selectedReservation.id
                        },
                        'successCallBack': onSuccessResponse,
                        'failureCallBack': generalError
                    });
                };
                
                
                var beginEarlyCheckin = function(response){
                    var params = {
                        'early_checkin_data':''
                    };
                    if (response){
                        //from early checkin controller, will parse back into an object to use data
                        params.early_checkin_data = JSON.stringify(response);
                        params.early_charge_symbol = $scope.selectedReservation.earlyCheckinChargeSymbol;
                    }
                    console.info('sending stateparams: ',params);
                    $state.go('zest_station.earlyCheckin',params);
                };
                        
		var initTermsPage = function() {
			console.log($scope.zestStationData);
                        console.info('$scope.selectedReservation: ',$scope.selectedReservation)
			var stateParams = {
				'guest_id': $scope.selectedReservation.guest_details[0].id,
				'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
				'deposit_amount': $scope.selectedReservation.reservation_details.deposit_amount,
				'room_no': $scope.selectedReservation.reservation_details.room_number,//this changed from room_no, to room_number
				'room_status': $scope.selectedReservation.reservation_details.room_status,
				'payment_type_id': $scope.selectedReservation.reservation_details.payment_type,
				'guest_email': $scope.selectedReservation.guest_details[0].email,
				'guest_email_blacklisted': $scope.selectedReservation.guest_details[0].is_email_blacklisted,
				'first_name': $scope.selectedReservation.guest_details[0].first_name,
				'balance_amount' : $scope.selectedReservation.reservation_details.balance_amount,
				'confirmation_number' : $scope.selectedReservation.confirmation_number,
				'pre_auth_amount_at_checkin' : $scope.selectedReservation.reservation_details.pre_auth_amount_at_checkin,
				'authorize_cc_at_checkin' : $scope.selectedReservation.reservation_details.authorize_cc_at_checkin
			}
			$state.go('zest_station.checkInTerms', stateParams);
		};

		var initRoomError = function() {
			$state.go('zest_station.checkinRoomError');
		};


		var assignRoomToReseravtion = function() {
			var reservation_id = $scope.selectedReservation.id;
			console.info('::assigning room to reservation::', reservation_id);
                        
                        
                        $scope.callAPI(zsCheckinSrv.assignGuestRoom, {
                            params: {
                                    'reservation_id': reservation_id
                            },
                            'successCallBack': roomAssignCallback,
                            'failureCallBack': roomAssignCallback
                        });
		};
		var roomAssignCallback = function(response) {
			if (response.status && response.status === 'success') {
				$scope.selectedReservation.room = response.data.room_number;
				routeToNext();
			} else {
				initRoomError();
			}
		};
                
                var fetchedEarlyCheckinSettingsCallback = function(response){
                    console.info(': fetchedEarlyCheckinSettingsCallback :',response)
                    if (!$stateParams.earlyCheckinPurchased && // if they purchased it through zest station a minute ago...dont re-prompt the user
                            shouldGoToEarlyCheckInFlow(response)) {
                        //fetch reservation info with upsell data from /guest_web/reservations/{res_id}.json
                        return true;
                    } else return false;
                };
                
                var continueRouting = function(settings){
                    console.info(': continueRouting :',settings)
                    var goToEarlyCheckin = fetchedEarlyCheckinSettingsCallback(settings);
                    console.info('*goToCheckin: ',goToEarlyCheckin)
                    if (goToEarlyCheckin){
                        beginEarlyCheckin(settings);

                    } else {
			            // terms and condition skip is done in terms and conditions page
                       initTermsPage();
                    } 
                };
                var routeToNext = function(){
                    console.info(': routeToNext :');
                    //in order to route to the next screen, check if we should go through early checkin,
                    //also check terms and conditions (bypass) setting,
                    //first fetch fresh early checkin settings, and continue from there
                    fetchEarlyCheckinSettings(continueRouting);
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


                //
                //scope methods below here
                //
                
		$scope.onNextFromDetails = function() {
                    var roomAssigned = roomIsAssigned(),
				roomReady = roomIsReady();
                        console.log('$scope.selectedReservation: ', $scope.selectedReservation);
			console.log($scope.selectedReservation.reservation_details.reservation_id);
			console.info('roomAssigned: ', roomAssigned, ', roomReady: ', roomReady);
                        
			if (!roomIsAssigned()) {
                                console.info('assigning room');
				assignRoomToReseravtion(); //assigns room, if success- goes to terms

			} else if (roomIsAssigned() && roomIsReady()) {
                                console.info('room is assigned and ready, continuing');
				routeToNext();

			} else if (roomIsAssigned() && !roomIsReady()) {
                                console.info('room assigned but not ready, show room error');
				initRoomError();

			}

		};
	}
]);