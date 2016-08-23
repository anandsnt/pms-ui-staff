
sntRover.controller('RVroomAssignmentController',[
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVRoomAssignmentSrv',
	'$filter',
	'RVReservationCardSrv',
	'roomsList',
	'roomPreferences',
	'roomUpgrades',
	'$timeout',
	'ngDialog',
	'RVSearchSrv',
	'rvPermissionSrv',
	function($scope, $rootScope, $state, $stateParams, RVRoomAssignmentSrv, $filter, RVReservationCardSrv, roomsList, roomPreferences, roomUpgrades, $timeout, ngDialog, RVSearchSrv, rvPermissionSrv){

	// set a back button on header
	$rootScope.setPrevState = {
		title: $filter('translate')('STAY_CARD'),
		callback: 'backToStayCard',
		scope: $scope
	};

	BaseCtrl.call(this, $scope);

	// do we need to call the the room assigning API with forcefully assign to true
	// currently used for group reservation
	var wanted_to_forcefully_assign = false;
	var isOnlineRoomMove = "";
	var isKeySystemAvailable = false;

	var oldRoomType = '';
	var selectedRoomObject = null;
	$scope.errorMessage = '';
	$scope.searchText = '';
	var title = $filter('translate')('ROOM_ASSIGNMENT_TITLE');
	$scope.setTitle(title);

	setTimeout(function(){
				$scope.refreshScroller('roomlist');
				$scope.refreshScroller('filterlist');
				},
			3000);
	$timeout(function() {
    	roomUpgrades.length ===0 ? "":$scope.$broadcast('roomUpgradesLoaded', roomUpgrades);
		$scope.$broadcast('roomFeaturesLoaded', $scope.roomFeatures);
	});

	/*To fix the unassign button flasing issue during checkin
	*/
	$scope.roomAssgnment = {};
	$scope.roomAssgnment.inProgress = false;
	$scope.roomTransfer = {};
	$scope.isRoomLockedForThisReservation = $stateParams.cannot_move_room;
	/**
	* function to to get the rooms based on the selected room type
	*/
	$scope.getRooms = function(){
		$scope.searchText = '';
		var currentSelectedRoomType = $scope.roomType;
		$scope.filteredRooms = [];;//Emptying rooms on search
		$scope.rooms = [];//CICO-23077

		angular.forEach($scope.allRooms, function(value, key) {
			if(value.room_type_code === currentSelectedRoomType){
				$scope.filteredRooms.push(value);
				$scope.rooms.push(value);
			}
		});
		$scope.setSelectedFiltersList();
		$scope.setRoomsListWithPredefinedFilters();
		$scope.applyFilterToRooms();
		setTimeout(function(){
			$scope.refreshScroller('roomlist');
			},
		1000);

	};

	$scope.getCurrentRoomType = function(){
		for (var i = 0; i < $scope.roomTypes.length; i++) {
			if($scope.roomTypes[i].type === $scope.roomType)
			{
				return $scope.roomTypes[i];
			}
		};
	};

	$scope.searchRoom = function(){
		var allAllowedRooms = [];
		allAllowedRooms = angular.copy($scope.allRooms);

		$scope.searchText = $scope.searchText.toUpperCase();


		if($scope.searchText !== ''){
				var isRoomSearchAllowed = false;
				if(($rootScope.isSingleDigitSearch && $scope.searchText.length >=1) || (!$rootScope.isSingleDigitSearch && $scope.searchText.length >=3)){
					$scope.filteredRooms = [];
					isRoomSearchAllowed = true;
				}
			} else {
				$scope.filteredRooms = [];
			}

		angular.forEach(allAllowedRooms, function(value, key) {
				if(isRoomSearchAllowed){
					if(value.room_number.indexOf($scope.searchText) !== -1){
						$scope.filteredRooms.push(value);
					}
				}

			else {
				if(value.room_type_code === $scope.roomType){
					$scope.filteredRooms.push(value);
				}
				$scope.setSelectedFiltersList();
				$scope.setRoomsListWithPredefinedFilters();
				$scope.applyFilterToRooms();
			}

		});
		setTimeout(function(){
			$scope.refreshScroller('roomlist');
			},
		1000);
	};

	$scope.moveInHouseRooms = function(){
		$scope.selectedRoomType = $scope.getCurrentRoomType();
		var successCallbackMoveInHouseRooms = function(response){
			$scope.roomTransfer.newRoomRate = response.data.new_rate_amount;
			$scope.roomTransfer.oldRoomRate = response.data.old_rate_amount;
			$scope.$emit('hideLoader');

			if($scope.roomTransfer.newRoomRate !== $scope.roomTransfer.oldRoomRate){
				$scope.roomTransfer.newRoomType = $scope.selectedRoomType.description;
				$scope.roomTransfer.isNewRoomType = true;
			}
			else{
				$scope.roomTransfer.newRoomType = $scope.selectedRoomType.description;
				$scope.roomTransfer.isNewRoomType = false;
			}
			ngDialog.open({
	          template: '/assets/partials/roomAssignment/rvRoomTransferConfirmation.html',
	          controller: 'rvRoomTransferConfirmationCtrl',
	          scope: $scope
        	});
		};
		var errorCallbackMoveInHouseRooms = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		params.room_type_id = $scope.selectedRoomType.id;
		params.room_number = $scope.roomTransfer.newRoomNumber;
		$scope.invokeApi(RVRoomAssignmentSrv.moveInHouseRooms, params, successCallbackMoveInHouseRooms, errorCallbackMoveInHouseRooms);

	};


	$scope.checkRoomTypeAvailability = function(roomObject){
		if($scope.isRoomLockedForThisReservation === "true" || roomObject.donot_move_room){
			ngDialog.open({
                template: '/assets/partials/roomAssignment/rvRoomLocked.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
		} else {
			var availabilityCount = _.findWhere($scope.roomTypes, {"id": roomObject.room_type_id}).availability;
			var currentRoomType = $scope.getCurrentRoomType();
			var isAvailablityExist = (availabilityCount > 0) ? true : false;
			var isOverBookPermission = rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');
			$scope.currentRoomObject = roomObject;
			if (currentRoomType.type == oldRoomType) {
	   			$scope.showMaximumOccupancyDialog(roomObject);
			} else {
			    if (!isAvailablityExist) {
			        if (isOverBookPermission) {
			            ngDialog.open({
			                template: '/assets/partials/roomAssignment/rvOverBookRoom.html',
			                controller: 'RVOverBookRoomDialogController',
			                className: 'ngdialog-theme-default',
			                scope: $scope
			            });

			        } else {
			            ngDialog.open({
			                template: '/assets/partials/roomAssignment/rvRoomTypeNotAvailable.html',
			                className: 'ngdialog-theme-default',
			                scope: $scope
			            });
			        }
			    } else {
			        $scope.showMaximumOccupancyDialog(roomObject);
			    }

			}
		}
		////showMaximumOccupancyDialog()
	};

	/**
	* function to check occupancy for the reservation
	*/
	$scope.showMaximumOccupancyDialog = function(roomObject){


			var reservationStatus = $scope.reservationData.reservation_card.reservation_status;

			var showOccupancyMessage = false;
				if(roomObject.room_max_occupancy != null && $scope.reservation_occupancy != null){
						if(roomObject.room_max_occupancy < $scope.reservation_occupancy){
							showOccupancyMessage = true;
							$scope.max_occupancy = roomObject.room_max_occupancy;
					}
				}else if(roomObject.room_type_max_occupancy != null && $scope.reservation_occupancy != null){
						if(roomObject.room_type_max_occupancy < $scope.reservation_occupancy){
							showOccupancyMessage = true;
							$scope.max_occupancy = roomObject.room_type_max_occupancy;
						}
				}

			$scope.assignedRoom = roomObject;
			if($scope.assignedRoom.is_upgrade_room === "true"){
	        	var selectedRoomIndex = '';
				angular.forEach(roomUpgrades.upsell_data, function(value, key) {
					if($scope.assignedRoom.room_number === value.upgrade_room_number){
						selectedRoomIndex = key;
					}
				});
				$scope.$broadcast('UPGRADE_ROOM_SELECTED_FROM_ROOM_ASSIGNMENT', selectedRoomIndex);
	        } else {

				$scope.roomTransfer.newRoomNumber = roomObject.room_number;
				if(showOccupancyMessage){
					selectedRoomObject = roomObject;
			    	$scope.oldRoomType = oldRoomType;
					ngDialog.open({
		                  template: '/assets/partials/roomAssignment/rvMaximumOccupancyDialog.html',
		                  controller: 'rvMaximumOccupancyDialogController',
		                  className: 'ngdialog-theme-default',
		                  scope: $scope
		                });
				}else{
					if(reservationStatus === "CHECKEDIN"){
						$scope.moveInHouseRooms();
					}else{
						if(oldRoomType !== roomObject.room_type_code){

							$scope.oldRoomType = oldRoomType;
							$scope.openApplyChargeDialog();
						} else {
							$scope.roomTransfer.withoutRateChange = true;
							$scope.assignRoom();
						}
					}
				}


		}

	};

	$scope.$on('closeDialogWithError', function(event, error){
		ngDialog.close();
		openWantedToBorrowPopup(error);
	})

	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	var openWantedToBorrowPopup = function(dataToBorrowRoom) {
		$scope.passingParams = {
			"errorMessage": (typeof dataToBorrowRoom.errorMessage === "object")? dataToBorrowRoom.errorMessage[0] : dataToBorrowRoom.errorMessage,
			"upsell_amount" : dataToBorrowRoom.upsell_amount
		};
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvGroupRoomTypeNotConfigured.html',
			controller 	: 'rvBorrowRoomTypeCtrl',
			scope 		: $scope
        });
	};

	$scope.openApplyChargeDialog = function(){
		ngDialog.open({
	          template: '/assets/partials/roomAssignment/rvApplyRoomCharge.html',
	          controller: 'rvApplyRoomChargeCtrl',
	          className: 'ngdialog-theme-default',
	          scope: $scope
        });
	};

	$scope.occupancyDialogSuccess = function(){

		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
        if(reservationStatus === "CHECKEDIN"){
            	$scope.moveInHouseRooms();
       	}else{
    	    if(selectedRoomObject && (oldRoomType !== selectedRoomObject.room_type_code)){
				$scope.oldRoomType = oldRoomType;
				$scope.openApplyChargeDialog();
			} else {
				$scope.roomTransfer.withoutRateChange = true;
				$scope.assignRoom();
			}
			selectedRoomObject = null;
       	}

	};
	// update the room details to RVSearchSrv via RVSearchSrv.updateRoomDetails - params: confirmation, data
	var updateSearchCache = function() {

		// room related details
		var data = {
			'room': ''
		};

		RVSearchSrv.updateRoomDetails($scope.reservationData.reservation_card.confirmation_num, data);
	};

	/**
	* click function to unassing rooms
	*/
	$scope.unassignRoom = function(){
		if($scope.isRoomLockedForThisReservation === "true"){
			ngDialog.open({
                template: '/assets/partials/roomAssignment/rvRoomLocked.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
		} else {
			var params = {
				'reservationId' : parseInt($stateParams.reservation_id, 10)
			};

			//success call of un-assigningb rooms
			var successCallbackOfUnAssignRoom = function(data){
				$scope.$emit('hideLoader');
				$scope.reservationData.reservation_card.room_id = '';
				$scope.reservationData.reservation_card.room_number = '';

				$scope.reservationData.reservation_card.room_status = '';
				$scope.reservationData.reservation_card.fo_status = '';
				$scope.reservationData.reservation_card.room_ready_status = '';
				RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
				updateSearchCache();
				$scope.backToStayCard();

			};

			//failujre call of un-assigningb rooms
			var failureCallBackOfUnAssignRoom = function(errorMessage){

				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			};

			$scope.invokeApi(RVRoomAssignmentSrv.UnAssignRoom, params, successCallbackOfUnAssignRoom, failureCallBackOfUnAssignRoom);


		}
	};

	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	var openRoomAlreadyChoosedPopup = function() {
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvRoomHasAutoAssigned.html',
			controller 	: 'rvRoomAlreadySelectedCtrl',
			className 	: 'ngdialog-theme-default',
			scope 		: $scope
        });
	};

	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	$scope.roomAssignedByOpera = "";
	var openPopupForErrorMessageShowing = function(errorMessage) {
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvRoomAssignmentShowErrorMessage.html',
			controller 	: 'rvRoomAlreadySelectedCtrl',
			className 	: 'ngdialog-theme-default',
			scope 		: $scope,
			data  		: JSON.stringify(errorMessage)
        });
	};

	/**
	 * [successCallbackAssignRoom description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */

	var successCallbackAssignRoom = function(data){
		var dataToUpdate 		= {},
			assignedRoom 		= $scope.assignedRoom,
			selectedRoomType 	= $scope.selectedRoomType,
			reservationData 	= $scope.reservationData.reservation_card;
		isOnlineRoomMove    = data.is_online_move_allowed;
		isKeySystemAvailable = (typeof data.is_online_move_allowed !== 'undefined') ? true : false;


		_.extend (dataToUpdate,
		{
			room_id 			: assignedRoom.room_id,
			room_status 		: assignedRoom.room_status,
			fo_status 			: assignedRoom.fo_status,
			room_ready_status	: assignedRoom.room_ready_status,
			is_upsell_available	: (data.is_upsell_available) ? "true" : "false"  // CICO-7904 and CICO-9628 : update the upsell availability to staycard
		});

		if (typeof $scope.selectedRoomType !== 'undefined') {
			_.extend (dataToUpdate,
			{
				room_type_description 	: selectedRoomType.description,
				room_type_code 			: selectedRoomType.type
			});
		}

		if(data.is_room_auto_assigned && !$scope.isStandAlone) {
			$scope.roomAssignedByOpera 	= data.room; //Shahul: I don't know who named this variable, What the...
			dataToUpdate.room_number 	= data.room;
			openRoomAlreadyChoosedPopup ();
		}
		else {
                    /*
                    var useAdvancedQueFlow = $rootScope.advanced_queue_flow_enabled;
                    if (useAdvancedQueFlow && ($scope.putGuestInQueue || $rootScope.putGuestInQueue)){
                        $rootScope.$emit('putInQueueAdvanced');
                        $scope.backToStayCard();
                        return;
                    }
                    */

			if($scope.clickedButton === "checkinButton") {
				$state.go('rover.reservation.staycard.billcard',
					{
						"reservationId": reservationData.reservation_id,
						"clickedButton": "checkinButton"
					});
			}
			else {
				$scope.backToStayCard();
			}
			dataToUpdate.room_number = assignedRoom.room_number;
		}

		//updating in the central data model
		_.extend($scope.reservationData.reservation_card, dataToUpdate);

		RVReservationCardSrv
			.updateResrvationForConfirmationNumber(reservationData.confirmation_num, $scope.reservationData);

		//Yes, its over
		$scope.roomAssgnment.inProgress = false;
	};


	/**
	 * [errorCallbackAssignRoom description]
	 * @param  {[type]} error [description]
	 * @return {[type]}       [description]
	 */
	var errorCallbackAssignRoom = function(error){
		$scope.roomAssgnment.inProgress = false;
		//since we are expecting some custom http error status in the response
		//and we are using that to differentiate among errors
		if(error.hasOwnProperty ('httpStatus')) {
			switch (error.httpStatus) {
				case 470:
						wanted_to_forcefully_assign = true;
						$timeout(openWantedToBorrowPopup.bind(null, error), 500);
				 	break;
				default:
					break;
			}
		}
		else {
				if (!$rootScope.isStandAlone) {
					$timeout(openRoomAlreadyChoosedPopup, 400);
				}
				else {
					var errorMessagePopup = {
						error: error.toString()
					};
					$timeout(openPopupForErrorMessageShowing.bind(null, errorMessagePopup), 500);
				}
		}

	};

	/**
	 * function to assign the new room for the reservation
	 * @return undefined [description]
	 */
	$scope.assignRoom = function() {

		$scope.roomAssgnment.inProgress = true;

		//API params
		var params = {};
		params.reservation_id 		= parseInt($stateParams.reservation_id, 10);
		params.room_number 			= $scope.assignedRoom.room_number;
		params.without_rate_change 	= $scope.roomTransfer.withoutRateChange;
		params.new_rate_amount 		= $scope.roomTransfer.newRoomRateChange;

		//CICO-17082 - As per design pattern
		params.forcefully_assign_room = wanted_to_forcefully_assign;

		wanted_to_forcefully_assign = false;
		//yes. ALL set. Go!
		var options = {
            params: 			params,
            successCallBack: 	successCallbackAssignRoom,
            failureCallBack: 	errorCallbackAssignRoom
        };
        $scope.callAPI(RVRoomAssignmentSrv.assignRoom, options);
	};



        $scope.goToStayCardFromAddToQueue = false;
        if (!$rootScope.reservationRoomWatch){//alternative to $destroy, this is an init-once method
            $rootScope.reservationRoomWatch = 1;

            $rootScope.$on('putGuestInQueue',function(){
                $scope.goToStayCardFromAddToQueue = true;
                $rootScope.goToStayCardFromAddToQueue = true;

            });
        }


	$scope.goToNextView = function(){
		if($scope.clickedButton === "checkinButton"){
			$scope.$emit('hideLoader');
			$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
                } else {

			$scope.$emit('hideLoader');
			$scope.backToStayCard();
		}
	};

	/**
	* setting the scroll options for the room list
	*/
	var scrollerOptions = { preventDefault: false};
  	$scope.setScroller('roomlist', scrollerOptions);
  	$scope.setScroller('filterlist', scrollerOptions);

	/**
	* Listener to update the room list when the filters changes
	*/
	$scope.$on('roomFeaturesUpdated', function(event, data){
			$scope.roomFeatures = data;
			$scope.setSelectedFiltersList();
			$scope.applyFilterToRooms();
			setTimeout(function(){
				$scope.refreshScroller('roomlist');
				},
			1000);
	});
	/**
	* Listener to update the reservation details on upgrade selection
	*/
	$scope.$on('upgradeSelected', function(event, data){
			$scope.upgradeRoomClicked(data);
	});

	$scope.upgradeRoomClicked = function(data){
		$scope.reservationData.reservation_card.room_id = data.room_id;
		$scope.reservationData.reservation_card.room_number = data.room_no;
		$scope.reservationData.reservation_card.room_type_description = data.room_type_name;
		$scope.reservationData.reservation_card.room_type_code = data.room_type_code;
		$scope.reservationData.reservation_card.room_status = "READY";
		$scope.reservationData.reservation_card.fo_status = "VACANT";
		$scope.reservationData.reservation_card.room_ready_status = "INSPECTED";
		// CICO-7904 and CICO-9628 : update the upsell availability to staycard
		$scope.reservationData.reservation_card.is_upsell_available = data.is_upsell_available?"true":"false";
		RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
		if($scope.clickedButton === "checkinButton"){
			$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
		} else {
			$scope.backToStayCard();
		}
	}

	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {id:$scope.reservationData.reservation_card.reservation_id, confirmationId:$scope.reservationData.reservation_card.confirmation_num ,isrefresh: false, isOnlineRoomMove: isOnlineRoomMove, isKeySystemAvailable: isKeySystemAvailable});
	};
	/**
	* function to show and hide the filters view
	*/
	$scope.toggleFiltersView = function(){
		$scope.isFiltersVisible = !$scope.isFiltersVisible;
		setTimeout(function(){
				$scope.refreshScroller('filterlist');
				},
			1000);
	};
	/**
	* function to set the color coding for the room number based on the room status
	*/
	$scope.getRoomStatusClass = function(){
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
		var roomReadyStatus = $scope.reservationData.reservation_card.room_ready_status;
		var foStatus = $scope.reservationData.reservation_card.fo_status;
		var checkinInspectedOnly = $scope.reservationData.reservation_card.checkin_inspected_only;
		return getMappedRoomStatusColor(reservationStatus, roomReadyStatus, foStatus, checkinInspectedOnly);
	};

	$scope.getNotReadyRoomTag = function(room){
		if(!room.is_in_future) {
			if(room.room_ready_status === "PICKUP" || room.room_ready_status === "CLEAN"){
				return room.room_ready_status;
			}else{
				return room.fo_status;
			}
		} else {
			return "";
		}
	};

	$scope.getRoomStatusClassForRoom = function(room){

		if(room.is_oos === "true"){
			return "room-grey";
		}
		var reservationRoomStatusClass = "";
		//CICO-9063 no need to show the color coding if future reservation
		if($scope.reservationData.reservation_card.reservation_status === 'RESERVED'){
			return reservationRoomStatusClass;
		}

		var roomReadyStatus = room.room_ready_status;
		var foStatus = room.fo_status;
		var checkinInspectedOnly = room.checkin_inspected_only;
	    if(roomReadyStatus!==''){
				if(foStatus === 'VACANT'){
					switch(roomReadyStatus) {

						case "INSPECTED":
							reservationRoomStatusClass = ' room-green';
							break;
						case "CLEAN":
							if (checkinInspectedOnly === "true") {
								reservationRoomStatusClass = ' room-orange';
								break;
							} else {
								reservationRoomStatusClass = ' room-green';
								break;
							}
							break;
						case "PICKUP":
							reservationRoomStatusClass = " room-orange";
							break;

						case "DIRTY":
							reservationRoomStatusClass = " room-red";
							break;

		        }

				} else {
					reservationRoomStatusClass = "room-red";
				}

			}

		return reservationRoomStatusClass;
	};
	/**
	* function to change text according to the number of nights
	*/
	$scope.setNightsText = function(){
		return ($scope.reservationData.reservation_card.total_nights === 1)?$filter('translate')('NIGHT_LABEL'):$filter('translate')('NIGHTS_LABEL');
	};
	/**
	* function to decide whether or not to show the upgrades
	*/
	$scope.isUpsellAvailable = function(){
		var showUpgrade = false;
		if(($scope.reservationData.reservation_card.is_upsell_available === 'true') && ($scope.reservationData.reservation_card.reservation_status === 'RESERVED' || $scope.reservationData.reservation_card.reservation_status === 'CHECKING_IN')){
			showUpgrade = true;
		}
		return showUpgrade;
	};
	/**
	* function to add the predefined filters to the filterlist
	*/
	$scope.addPredefinedFilters = function(){
		var group = {};
		group.group_name = "predefined";
		group.multiple_allowed = true;
		group.items = [];
		//CICO-9063 we should not show Not Ready and Due Out filter if future reservation
		if($scope.reservationData.reservation_card.reservation_status !== 'RESERVED'){
			var item1 = {};
			item1.id = -100;
			item1.name = $filter('translate')('INCLUDE_NOTREADY_LABEL');
			item1.selected = false;
			var item2 = {};
			item2.id = -101;
			item2.name = $filter('translate')('INCLUDE_DUEOUT_LABEL');
			item2.selected = false;
		}

		var item3 = {};
		item3.id = -102;
		item3.name = $filter('translate')('INCLUDE_PREASSIGNED_LABEL');
		item3.selected = false;
		var item4 = {};
		item4.id = -103;
		item4.name = $filter('translate')('INCLUDE_CLEAN_LABEL');
		item4.selected = false;
		//CICO-9063 we should not show Not Ready and Due Out filter if future reservation
		if($scope.reservationData.reservation_card.reservation_status !== 'RESERVED'){
			group.items.push(item1);
			group.items.push(item2);
		}
		group.items.push(item3);
		if($scope.rooms.length > 0 && $scope.rooms[0].checkin_inspected_only === "true"){
			group.items.push(item4);
		}
		$scope.roomFeatures.splice(0, 0, group);
	};

	/**
	* function to prepare the filtered room list
	*/
	$scope.applyFilterToRooms = function(){
		$scope.filteredRooms = [];
		var roomsWithInitialFilters = [],
		roomIdsInSelectedFloor,
		rooms =$scope.rooms,
		selectedPredefinedFiltersList = $scope.selectedPredefinedFiltersList,
		selectedFiltersList = $scope.selectedFiltersList;

		//calculating room ids of selected floors in case any floor is selected.
		if($scope.floorFilterData && !$scope.floorFilterData.isNoFloorSelected){
				roomIdsInSelectedFloor= $scope.getRoomIdsInSelectedFloor();
			};

		//Iterating each room for filter.
		rooms.forEach(function(room){
			var isRoomIncluded = false;
			//Checking whether the room is to be displyed.
			if(room.room_status === "READY" && room.fo_status === "VACANT" && !room.is_preassigned){
				if(room.checkin_inspected_only === "true" && room.room_ready_status === "INSPECTED"){
					isRoomIncluded = true;
				}else if(room.checkin_inspected_only === "false"){
					isRoomIncluded = true;
				};
			};

			// CICO-9063, CICO-30640 show rooms regardless of hk status (excluded ooo) for future reservations.
			if($scope.reservationData.reservation_card.reservation_status === 'RESERVED' && !room.is_preassigned){
				isRoomIncluded = true;
			}

			// Checking whether any of  predefined Filter condition satisfies
			selectedPredefinedFiltersList.forEach(function(filter){
				if(room.room_features.indexOf(filter)!== -1){
					isRoomIncluded = true;
				};
			});
			// Checking whether any of Filter condition satisfies
			selectedFiltersList.forEach(function(filter){
				if(room.room_features.indexOf(filter)!== -1){
					isRoomIncluded =isRoomIncluded&&true;
				}else{
					isRoomIncluded =isRoomIncluded&&false;
				};
			});
			//Checking Whether the Room to be displyed.
			if(isRoomIncluded){
				//If floor filter applied, checking whether the room belongs to selected Floor.
				if($scope.floorFilterData &&!$scope.floorFilterData.isNoFloorSelected){
					if(roomIdsInSelectedFloor.indexOf(room.room_id) !== -1){
						$scope.filteredRooms.push(room);
						};
				}else{
				// If No floor filter applied,Directly pushed.
					$scope.filteredRooms.push(room);
				};
			};

		});
	};
	/**
	* function to prepare the array of room ids of selected floors.
	*/
	$scope.getRoomIdsInSelectedFloor = function(){
		var roomsInSelectedFloor = [];
		$scope.floors.forEach(function(element){
					if(element.id === parseInt($scope.floorFilterData.selectedFloorId)){
							roomsInSelectedFloor = element.room_ids;
						}
					});
		return roomsInSelectedFloor;
	};
	/**
	* function to prepare the array of selected filters' ids
	*/
	$scope.setSelectedFiltersList = function(){
		$scope.selectedFiltersList = [];
		$scope.selectedPredefinedFiltersList = [];
		var length = $scope.roomFeatures[0].items.length,
		roomFeatures = $scope.roomFeatures;

		for(var j = 0; j < length; j++){
			if($scope.roomFeatures[0].items[j].selected){
				$scope.selectedPredefinedFiltersList.push(roomFeatures[0].items[j].id);
			};
		};

		for(var i = 1; i < roomFeatures.length; i++){
			for(var j = 0; j < roomFeatures[i].items.length; j++){
				if(roomFeatures[i].items[j].selected){
					$scope.selectedFiltersList.push(roomFeatures[i].items[j].id);
				};
			};
		};
	};
	/**
	* function to return the rooms list status
	*/
	$scope.isRoomListEmpty = function(){
		return ($scope.filteredRooms.length === 0);
	};
	/**
	* function to add ids for predefined filters checking the corresponding status
	*/
	$scope.setRoomsListWithPredefinedFilters = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_status === "NOTREADY" && $scope.rooms[i].fo_status === "VACANT" && $scope.rooms[i].room_ready_status !== "CLEAN" && $scope.rooms[i].room_ready_status !== "INSPECTED") {
				$scope.rooms[i].room_features.push(-100);
			}
			if($scope.rooms[i].fo_status === "DUEOUT")
			{
				$scope.rooms[i].room_features.push(-101);
			}
			if($scope.rooms[i].is_preassigned) {
				$scope.rooms[i].room_features.push(-102);
			}
			if($scope.rooms[i].fo_status === "VACANT" && $scope.rooms[i].room_ready_status === "CLEAN" && $scope.rooms[i].checkin_inspected_only === "true")
			{
				$scope.rooms[i].room_features.push(-103);
			}
		}
	};
	$scope.init = function(){

		$scope.roomTypes = roomPreferences.room_types;
		$scope.roomFeatures = roomPreferences.room_features;
		$scope.allRooms = roomsList.rooms;//$scope.allRooms - CICO-23077
		$scope.rooms = [];//CICO-23077

		angular.forEach($scope.allRooms, function(value, key) {
			if(value.room_type_code === $stateParams.room_type){
				$scope.rooms.push(value);
			}
		});
		$scope.floors = roomPreferences.floors.floor_details;
		$scope.reservationData = $scope.$parent.reservation;
		$scope.addPredefinedFilters();
		$scope.setSelectedFiltersList();
		$scope.reservation_occupancy = roomsList.reservation_occupancy;
		$scope.setRoomsListWithPredefinedFilters();
		$scope.applyFilterToRooms();
		$scope.clickedButton = $stateParams.clickedButton;
		$scope.assignedRoom = "";
		oldRoomType = $scope.roomType = $stateParams.room_type;
		$scope.isStandAlone = $rootScope.isStandAlone;
		$scope.isFiltersVisible = false;
		$scope.$emit('HeaderChanged', $filter('translate')('ROOM_ASSIGNMENT_TITLE'));
		$scope.roomTransfer.oldRoomNumber = $scope.reservationData.reservation_card.room_number;
		$scope.roomTransfer.oldRoomType = $scope.reservationData.reservation_card.room_type_description;
	};
	$scope.init();
	/**
	* function to handle floor filter.
	*/
	$scope.applyFloorFilter = function(floorFilterData){
		$scope.floorFilterData =floorFilterData;
		$scope.setSelectedFiltersList();
		$scope.applyFilterToRooms();
	};
	/**
	* function to determine whether to show unassignroom
	*/
	$scope.showUnAssignRoom = function() {
		var r_data = $scope.reservationData.reservation_card;
		return (r_data.reservation_status.indexOf(['CHECKING_IN', 'RESERVED']) &&
			!!r_data.room_number &&
			// $rootScope.isStandAlone &&	// CICO-31323: add unassing in connected hotel
			!$scope.roomAssgnment.inProgress &&
			!r_data.is_hourly_reservation &&
			r_data.reservation_status !== "CHECKEDIN");
	};

	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	$scope.displayRoomAssignementError = function(errorMessage) {
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvRoomAssignmentShowErrorMessage.html',
			className 	: 'ngdialog-theme-default',
			scope       : $scope,
			data        : JSON.stringify({
                                error: errorMessage
                          })
        });
	};

	$scope.clickedCancelButton = function(){
		$scope.getRooms(true);
		$scope.closeDialog();
	};

}]);