angular.module('sntRover')
.controller('rvNightlyDiaryRightFilterBarController',
	[   '$scope',
		'RVNightlyDiaryRightFilterBarSrv',
		'RVNightlyDiarySrv',
		'ngDialog',
		function(
			$scope,
			RVNightlyDiaryRightFilterBarSrv,
			RVNightlyDiarySrv,
			ngDialog
		) {

			BaseCtrl.call(this, $scope);

			/*
			 * Initiate controller
			 */
			var initiate = function() {
				if (_.isEmpty($scope.diaryData.filterList)) {
					var successCallBackFetchRoomTypeAndFloorList = function(data) {

						$scope.$emit('hideLoader');
						$scope.diaryData.selectedRoomCount = 0;
						$scope.diaryData.selectedFloorCount = 0;
						$scope.diaryData.filterList.roomType = data.rooms;
						$scope.diaryData.filterList.floorList = data.floors;
					};

					$scope.invokeApi(RVNightlyDiaryRightFilterBarSrv.fetchRoomTypeAndFloorList, {}, successCallBackFetchRoomTypeAndFloorList);
				}
			};

			/*
			 * To toggle room selection
			 */
			$scope.toggleRoomSelection = function(index) {
				$scope.diaryData.filterList.roomType[index].isSelected = !$scope.diaryData.filterList.roomType[index].isSelected;
				if ($scope.diaryData.filterList.roomType[index].isSelected) {
					$scope.diaryData.selectedRoomCount++;
				} else {
					$scope.diaryData.selectedRoomCount--;
				}
			};

			/*
			 * To toggle floor selection
			 */
			$scope.toggleFloorSelection = function(index) {
				$scope.diaryData.filterList.floorList[index].isSelected = !$scope.diaryData.filterList.floorList[index].isSelected;
				if ($scope.diaryData.filterList.floorList[index].isSelected) {
					$scope.diaryData.selectedFloorCount++;
				} else {
					$scope.diaryData.selectedFloorCount--;
				}
			};

			/*
			 * 	Method to apply common filter - 
			 *	to filter entire room/reservations view.
			 */
			$scope.applyCommonFilter = function() {
				var selectedRoomTypes = [],
					selectedFloors = [];

				/*
				 * Creating an array of selected room types to apply filter.
				 */
				var getSelectedRoomTypes = function(roomTypes) {
					roomTypes.forEach(function(roomtype) {
						if (roomtype.isSelected) {
							selectedRoomTypes.push(roomtype.id);
						}
					});
					return selectedRoomTypes;
				};

				/*
				 * Creating an array of selected floors to apply filter.
				 */
				var getSelectedFloors = function(floorList) {
					floorList.forEach(function(floor) {
						if (floor.isSelected) {
							selectedFloors.push(floor.id);
						}
					});
					return selectedFloors;
				};

				$scope.diaryData.selectedRoomTypes = getSelectedRoomTypes($scope.diaryData.filterList.roomType);
				$scope.diaryData.selectedFloors = getSelectedFloors($scope.diaryData.filterList.floorList);
				$scope.$emit('REFRESH_DIARY_SCREEN');
			};

			/*
			 *	Method to reset room type, floor filters
			 *	to filter entire room/reservations view.
			 */
			var resetCommonFilters = function() {
				var roomTypes = $scope.diaryData.filterList.roomType,
					floorList = $scope.diaryData.filterList.floorList;

				if (roomTypes && roomTypes.length > 0) {
					roomTypes.forEach(function(roomtype) {
						roomtype.isSelected = false;
					});
				}

				if (floorList && floorList.length > 0) {
					floorList.forEach(function(floor) {
						floor.isSelected = false;
					});
				}

				$scope.diaryData.selectedRoomTypes = [];
				$scope.diaryData.selectedFloors = [];
				$scope.diaryData.selectedFloorCount = 0;
				$scope.diaryData.selectedRoomCount = 0;
			};

			$scope.addListener('RESET_RIGHT_FILTER_BAR', function() {
				resetCommonFilters();
			});

			/*
			 *	Method to clear room type, floor filters
			 *	to filter entire room/reservations view.
			 */
			$scope.clearCommonFilter = function() {
				resetCommonFilters();
			};

			// Show/Hide right filter based on screen width and filter type
			$scope.isShowRightFilter = function() {
				return (screen.width >= 1600 || $scope.diaryData.rightFilter === 'RESERVATION_FILTER') ? 'visible' : '';
			};

			/**
             *  Retrieve Available Rooms
             *  @param {Object} - [selected reservation Item]
             */
            var retrieveAvailableRooms = function() {

				var filterData = $scope.diaryData.roomAssignmentFilters,
					selectedItem = {};
				
				if (filterData.type === 'MOVE_ROOM') {
					selectedItem = $scope.currentSelectedReservation;
					$scope.diaryData.selectedUnassignedReservation = {};
					if (screen.width < 1600) {
						$scope.$emit('TOGGLE_FILTER_TOP', 'RESERVATION_FILTER');
					}
				}
				else if (filterData.type === 'ASSIGN_ROOM') {
					selectedItem = $scope.diaryData.selectedUnassignedReservation;
				}

                var successCallBack = function(data) {
                    $scope.errorMessage = '';
                    var roomCount = data.rooms.length;

                    if ( roomCount === 0 ) {
                        ngDialog.open({
                            template: '/assets/partials/nightlyDiary/rvNightlyDiaryNoAvailableRooms.html',
                            className: '',
                            scope: $scope,
                            data: {
                                warningMessage: 'No Available Rooms'
                            }
                        });
                        if (screen.width < 1600 && filterData.type === 'ASSIGN_ROOM' && filterData.count > 0) {
							$scope.$emit('TOGGLE_FILTER_TOP', 'RESERVATION_FILTER');
						}
                    }
                    else {
                        var newData = {
                            availableRoomList: data.rooms,
                            fromDate: selectedItem.arrival_date,
                            nights: (selectedItem.no_of_nights || selectedItem.number_of_nights),
                            reservationId: (selectedItem.reservation_id || selectedItem.id),
                            reservationStatus: selectedItem.status,
                            roomTypeId: filterData.roomTypeId,
                            type: filterData.type,
                            reservationOccupancy: data.reservation_occupancy
                        };
                        console.log(newData);
                        $scope.$emit('SHOW_ASSIGN_ROOM_SLOTS', newData );

						if (screen.width < 1600 && filterData.type === 'ASSIGN_ROOM') {
							$scope.$emit('TOGGLE_FILTER_TOP', 'UNASSIGNED_RESERVATION');
						}
                    }
                },
                failureCallBackMethod = function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                    if (errorMessage[0] === "Suite Room Type Assigned") {
                        ngDialog.open({
                            template: '/assets/partials/nightlyDiary/rvNightlyDiarySuiteRooms.html',
                            className: '',
                            scope: $scope
                        });
                    }
                },
                postData = {
                    'reservation_id': (selectedItem.reservation_id || selectedItem.id),
                    'selected_room_type_ids': [filterData.roomTypeId],
                    'selected_room_features': filterData.roomFeatureIds,
                    'floor_id': filterData.floorId,
                    'is_from_diary': true
                },
                options = {
                    params: postData,
                    successCallBack: successCallBack,
                    failureCallBack: failureCallBackMethod
                };

                $scope.callAPI(RVNightlyDiarySrv.retrieveAvailableRooms, options );
            };

            // Handle validation popup close.
            $scope.closeDialogAndRefresh = function() {
                if ($scope.diaryData.isAssignRoomViewActive) {
                    $scope.$emit("RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY");
                }
                ngDialog.close();
            };

			// Clear Room Features
			var clearRoomFeaturesList = function() {
				var roomFeatures = $scope.diaryData.roomAssignmentFilters.room_features;

				_.each(roomFeatures, function(feature) {
					_.each(feature.items, function(item) {
						item.selected = false;
					});
				});

				$scope.diaryData.roomAssignmentFilters.roomFeatureIds = [];
				$scope.diaryData.roomAssignmentFilters.count = 0;
			};

			// Clear Room Features
			var fetchIdFromRoomFeaturesList = function() {
				var roomFeatures = $scope.diaryData.roomAssignmentFilters.room_features,
					roomFeatureIds = [];

				_.each(roomFeatures, function(feature) {
					_.each(feature.items, function(item) {
						if ( item.selected ) {
							roomFeatureIds.push(item.id);
						}
					});
				});

				$scope.diaryData.roomAssignmentFilters.roomFeatureIds = roomFeatureIds;
				$scope.diaryData.roomAssignmentFilters.count = roomFeatureIds.length;
			};

			/**
			 * function to handle the filter selection
			 */
			$scope.setSelectionForFeature = function(group, feature) {
				var roomFeatures = $scope.diaryData.roomAssignmentFilters.room_features;

				if (!roomFeatures[group].multiple_allowed) {
					for (var i = 0; i < roomFeatures[group].items.length; i++) {
						if (feature !== i) {
							roomFeatures[group].items[i].selected = false;
						}
					}
				}
				roomFeatures[group].items[feature].selected = !roomFeatures[group].items[feature].selected;
				fetchIdFromRoomFeaturesList();
			};

			// CICO-65277: Claer All Guest preferences corresponding to a seletced Reservation.
			$scope.clearGuestPreferenceFilter = function() {
                $scope.diaryData.roomAssignmentFilters.floorId = '';
                clearRoomFeaturesList();
			};

			// CICO-65277 : Apply Guest preferences corresponding to a seletced Reservation.
			$scope.applyGuestPreferenceFilter = function() {
				retrieveAvailableRooms();
			};

			/*  
             *  Guest preference filter message
             */
            $scope.addListener('APPLY_GUEST_PREFERENCE_FILTER', function () {
                fetchIdFromRoomFeaturesList();
				retrieveAvailableRooms();
            });

			initiate();
}]);
