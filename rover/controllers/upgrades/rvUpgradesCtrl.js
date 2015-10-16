sntRover.controller('RVUpgradesController', ['$scope', '$rootScope', '$state', '$stateParams', 'RVUpgradesSrv', 'RVReservationCardSrv', '$sce', '$filter', 'ngDialog', '$timeout',
	function($scope, $rootScope, $state, $stateParams, RVUpgradesSrv, RVReservationCardSrv, $sce, $filter, ngDialog, $timeout) {

		BaseCtrl.call(this, $scope);

		$rootScope.setPrevState = {
			title: $filter('translate')('STAY_CARD'),
			//As per CICO-9832
			scope: $scope,
			callback: 'backToStayCard'
		};

		$scope.heading = 'Room Upgrades';
		$scope.setHeadingTitle($scope.heading);
                
                $scope.buttonText = {
                  noThanks: 'NO THANKS, proceed with Check In'  
                };
                
                $scope.initAdvQueCheck = function(){
                    var adv = $rootScope.advanced_queue_flow_enabled;
                    var viaQueue = $scope.$parent.reservation.check_in_via_queue;
                    $scope.buttonText.noThanks = 'No Thanks, proceed with Check In';

                    if (adv && viaQueue){
                        $scope.buttonText.noThanks = 'No thanks, proceed to queue';
                    }
                };
                $scope.initAdvQueCheck();
                if (typeof $scope.$parent === typeof {}){
                    $scope.$parent.myScrollOptions = {
                            'upgradesView': {
                                    scrollX: true,
                                    scrollY: false,
                                    scrollbars: true,
                                    snap: false,
                                    hideScrollbar: false,
                                    preventDefault: false
                            }
                    };
                }

		$scope.reservationData = $scope.$parent.reservation;
		$scope.upgradesList = [];
		$scope.headerData = {};
		$scope.upgradesDescriptionStatusArray = [];
		$scope.clickedButton = $stateParams.clickedButton;
		$scope.selectedUpgradeIndex = "";

		// CICO-17082, do we need to call the the room assigning API with forcefully assign to true
		// currently used for group reservation
		var wanted_to_forcefully_assign = false;

		/**
		 * function to get all available upgrades for the reservation
		 */
		$scope.getAllUpgrades = function() {
			var successCallbackgetAllUpgrades = function(data) {
				$scope.upgradesList = data.upsell_data;
				$scope.headerData = data.header_details;
				$scope.reservation_occupancy = $scope.headerData.reservation_occupancy;
				$scope.setUpgradesDescriptionInitialStatuses();
				$scope.$emit('hideLoader');
				setTimeout(function() {
                                            if (typeof $scope.$parent === typeof {}){
                                                if (typeof $scope.$parent.myScroll === typeof {}){
                                                    $scope.$parent.myScroll['upgradesView'].refresh();
                                                }
                                            }
					},
					3000);
			};
			var errorCallbackgetAllUpgrades = function(error) {
				$scope.$emit('hideLoader');
				$scope.$parent.errorMessage = error;
			};
			var params = {};
			params.reservation_id = $stateParams.reservation_id;
			$scope.invokeApi(RVUpgradesSrv.getAllUpgrades, params, successCallbackgetAllUpgrades, errorCallbackgetAllUpgrades);

		};
		$scope.getAllUpgrades();
		/**
		 * function to check occupancy for the reservation
		 */
		$scope.showMaximumOccupancyDialog = function(index) {
			var showOccupancyMessage = false;
			if ($scope.upgradesList[index].room_max_occupancy !== "" && $scope.reservation_occupancy !== null) {
				if (parseInt($scope.upgradesList[index].room_max_occupancy) < $scope.reservation_occupancy) {
					showOccupancyMessage = true;
					$scope.max_occupancy = parseInt($scope.upgradesList[index].room_max_occupancy);
				}
			} else if ($scope.upgradesList[index].room_type_max_occupancy !== "" && $scope.reservation_occupancy !== null) {
				if (parseInt($scope.upgradesList[index].room_type_max_occupancy) < $scope.reservation_occupancy) {
					showOccupancyMessage = true;
					$scope.max_occupancy = parseInt($scope.upgradesList[index].room_type_max_occupancy);
				}
			}

			$scope.selectedUpgradeIndex = index;
			if (showOccupancyMessage) {
				ngDialog.open({
					template: '/assets/partials/roomAssignment/rvMaximumOccupancyDialog.html',
					controller: 'rvMaximumOccupancyDialogController',
					className: 'ngdialog-theme-default',
					scope: $scope
				});
			} else {
				$scope.selectUpgrade();
			}


		};
		$scope.occupancyDialogSuccess = function() {
			$scope.selectUpgrade();
		};


		/**
		 * to open the room aleady chhosed popup
		 * @return undefined
		 */
		var openWantedToBorrowPopup = function() {
			ngDialog.open(
			{
				template 	: '/assets/partials/upgrades/rvGroupRoomTypeNotConfigured.html',
				scope 		: $scope
	        });
		};

		/**
		 * successcallback of select upgrade
		 * @param {Obejct} data [API response]
		 * @param {Object} [successCallBackParams]
		 * @return undefined
		 */
		var successCallbackselectUpgrade = function(data, successCallBackParams) {
			var selectedListItem 	= successCallBackParams.selectedListItem,
				resrvCardData 		= $scope.reservationData.reservation_card;

			_.extend( $scope.reservationData.reservation_card ,
			{
				room_number: 			selectedListItem.upgrade_room_number,
				room_type_description: 	selectedListItem.upgrade_room_type_name,
				room_type_code: 		selectedListItem.upgrade_room_type,
				room_status: 			"READY",
				fo_status: 				"VACANT",
				room_ready_status: 		"INSPECTED",

				// CICO-7904 and CICO-9628 : update the upsell availability to staycard
				is_upsell_available: 	(data.is_upsell_available ? "true" : "false")
			});

			RVReservationCardSrv
				.updateResrvationForConfirmationNumber(resrvCardData.confirmation_num, $scope.reservationData);

			if ($scope.clickedButton === "checkinButton") {
				$state.go('rover.reservation.staycard.billcard', {
					"reservationId": resrvCardData.reservation_id,
					"clickedButton": "checkinButton"
				});
			}

			else {
				$scope.backToStayCard();
			}

		};

		var failureCallBackSelectUpgrade = function(error) {
			//since we are expecting some custom http error status in the response
			//and we are using that to differentiate among errors
			if(error.hasOwnProperty ('httpStatus')) {
				switch (error.httpStatus) {
					case 470:
							wanted_to_forcefully_assign = true;
							openWantedToBorrowPopup ();
					 	break;
					default:
						break;
				}
			}
			else {
				$scope.errorMessage = error;
			}
		};

		/**
		 * [borrowFromOtherRoomType description]
		 * @return {[type]} [description]
		 */
		$scope.borrowFromOtherRoomType = function (){
			$scope.closeDialog ();
			$timeout(function(){
				$scope.selectUpgrade ();
			}, 300);
		};


		/*** THIS IS JUST REPEATATION OF rvUpgradesController.js's upgrade. I dont
		*** know why upgrade is in two file and two controller, WTH.
		***/
		/**
		 * When the user select a particular room updgrade, this funciton will fire
		 * @return undefined
		 */
		$scope.selectUpgrade = function() {
			var index 				= $scope.selectedUpgradeIndex,
				selectedListItem 	= $scope.upgradesList[index];

			var params = {};

			//CICO-17082
			params.forcefully_assign_room = wanted_to_forcefully_assign;
			wanted_to_forcefully_assign = false;

			params.reservation_id 	= parseInt($stateParams.reservation_id, 10);
			params.upsell_amount_id = parseInt(selectedListItem.upsell_amount_id, 10);
			params.room_no 			= selectedListItem.upgrade_room_number;

			//yes. ALL set. Go!
			var options = {
                params: 					params,
                successCallBack: 			successCallbackselectUpgrade,
                failureCallBack: 			failureCallBackSelectUpgrade,
                successCallBackParameters: 	{ selectedListItem: selectedListItem}
            };
            $scope.callAPI(RVUpgradesSrv.selectUpgrade, options);
		};

		/**
		 * function to show and hide the upgrades detail view
		 */
		$scope.toggleUpgradeDescriptionStatus = function(index) {
			$scope.upgradesDescriptionStatusArray[index] = !$scope.upgradesDescriptionStatusArray[index];
		};
		$scope.isDescriptionVisible = function(index) {
			return $scope.upgradesDescriptionStatusArray[index];
		};
		/**
	* function to set the initial display status for the upgrade details for all the upgrades
	  And also to set the upgrade description text as html
	*/
		$scope.setUpgradesDescriptionInitialStatuses = function() {
			$scope.upgradesDescriptionStatusArray = new Array($scope.upgradesList.length);
			for (var i = 0; i < $scope.upgradesDescriptionStatusArray.length; i++) {
				$scope.upgradesDescriptionStatusArray[i] = false;
				$scope.upgradesList[i].upgrade_room_description = $sce.trustAsHtml($scope.upgradesList[i].upgrade_room_description);
			}
		};
		/**
		 * function to go back to reservation details
		 */
		$scope.backToStayCard = function() {

			$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
				id: $scope.reservationData.reservation_card.reservation_id,
				confirmationId: $scope.reservationData.reservation_card.confirmation_num
			});

		};
		/**
		 * function to set the color coding for the room number based on the room status
		 */
		$scope.getTopbarRoomStatusClass = function() {
			var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
			var roomReadyStatus = $scope.reservationData.reservation_card.room_ready_status;
			var foStatus = $scope.reservationData.reservation_card.fo_status;
			var checkinInspectedOnly = $scope.reservationData.reservation_card.checkin_inspected_only;
			return getMappedRoomStatusColor(reservationStatus, roomReadyStatus, foStatus, checkinInspectedOnly);
		};
		/**
		 * function to change text according to the number of nights
		 */
		$scope.setNightsText = function() {
			return ($scope.reservationData.reservation_card.total_nights === 1) ? $filter('translate')('NIGHT_LABEL') : $filter('translate')('NIGHTS_LABEL');
		};
		/**
		 * function to calculate the width of the horizontal scroll view based on the no of upgrades
		 */
		$scope.getHorizontalScrollWidth = function() {
			return 465 * $scope.upgradesList.length;
		};
		$scope.goToCheckinScreen = function() {
			$state.go('rover.reservation.staycard.billcard', {
				"reservationId": $scope.reservationData.reservation_card.reservation_id,
				"clickedButton": "checkinButton"
			});
		};

		/**
		* In upgrades we would display rooms Inspected & vacant(color - green) or outof service (grey).
		*/
		$scope.getRoomStatusClass = function(room){
			var statusClass = "ready";
			if(room.is_oos === "true"){
				return "room-grey";
			}
			return statusClass;
		};

	}
]);