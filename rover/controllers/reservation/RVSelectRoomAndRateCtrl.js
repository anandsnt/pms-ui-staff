sntRover.controller('RVSelectRoomAndRateCtrl', [
	'$rootScope', '$scope', 'sortOrder', 'areReservationAddonsAvailable', '$stateParams',
	function($rootScope, $scope, sortOrder, areReservationAddonsAvailable, $stateParams) {


		$scope.stateCheck = {
			activeMode: $stateParams.view && $stateParams.view === "CALENDAR" ? "CALENDAR" : "ROOM_RATE",
			calendarState: {
				showOnlyAvailableRooms: true,
				searchWithRestrictions: true,
				calendarType: "BEST_AVAILABLE",
				roomDetails: {},
				preferredType: ""
			}
		};

		$scope.availabilityTables = {};

		// ****************** PRIVATE *********************** //
		// 
		// 
		// 	
		// 
		// 
		// ****************** PRIVATE *********************** //

		var getTabRoomDetails = function(roomIndex) {
				var currentRoomTypeId = parseInt($scope.reservationData.tabs[roomIndex].roomTypeId, 10) || "",
					firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
						roomTypeId: currentRoomTypeId
					})),
					lastIndex = _.lastIndexOf($scope.reservationData.rooms, _.last(_.where($scope.reservationData.rooms, {
						roomTypeId: currentRoomTypeId
					})));

				return {
					roomTypeId: currentRoomTypeId,
					firstIndex: firstIndex,
					lastIndex: lastIndex
				};
			},
			getCurrentRoomDetails = function() {
				return getTabRoomDetails($scope.activeRoom);
			},
			initialize = function() {
				$scope.activeRoom = $scope.viewState.currentTab;
				$scope.stateCheck.roomDetails = getCurrentRoomDetails();
				// activate room type default view based on reservation settings
				if ($scope.otherData.defaultRateDisplayName === 'Recommended') {
					$scope.activeCriteria = "RECOMMENDED";
				} else if ($scope.otherData.defaultRateDisplayName === 'By Rate') {
					$scope.activeCriteria = "RATE";
				} else {
					// By default RoomType
					$scope.activeCriteria = "ROOM_TYPE";
				}
				// preferredType
				$scope.stateCheck.preferredType = $scope.reservationData.tabs[$scope.activeRoom].roomTypeId;
			};

		// ****************** PUBLIC *********************** //
		// 
		// 
		// 
		// 
		// 
		// ****************** PUBLIC *********************** //



		// ROOM RATE VIEW HANDLERS


		// CALENDAR VIEW HANDLERS

		$scope.toggleSearchWithRestrictions = function() {
			$scope.stateCheck.calendarState.searchWithRestrictions = !$scope.stateCheck.calendarState.searchWithRestrictions;
			$scope.$broadcast('availableRateFiltersUpdated');
		};

		$scope.toggleShowOnlyAvailable = function() {
			$scope.stateCheck.calendarState.showOnlyAvailableRooms = !$scope.stateCheck.calendarState.showOnlyAvailableRooms;
			$scope.$broadcast('availableRateFiltersUpdated');
		};

		$scope.toggleCalendar = function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode === "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
			$scope.heading = $scope.stateCheck.activeMode === "ROOM_RATE" ? "Rooms & Rates" : " Rate Calendar";
			$scope.setHeadingTitle($scope.heading);
			$("#rooms-and-rates-header .switch-button").toggleClass("on");
		};

		initialize();

	}
]);