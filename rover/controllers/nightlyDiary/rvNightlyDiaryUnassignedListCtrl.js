angular.module('sntRover')
.controller('rvNightlyDiaryUnassignedListController',
    [   '$scope',
        '$rootScope',
        'RVNightlyDiarySrv',
        'ngDialog',
        function(
            $scope,
            $rootScope,
            RVNightlyDiarySrv,
            ngDialog
        ) {

        BaseCtrl.call(this, $scope);
        $scope.selectedItem = {};
        $scope.businessDate = $rootScope.businessDate;

        // Handle validation popup close.
        $scope.closeDialogAndRefresh = function() {
            $scope.selectedItem = {};
            if ($scope.diaryData.isAssignRoomViewActive) {
                $scope.$emit("RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY");
            }
            ngDialog.close();
        };

        /**
         *  Retrieve Available Rooms
         *  @param {Object} - [selected reservation Item]
         */
        var retrieveAvailableRooms = function( selectedItem ) {
            var successCallBack = function(data) {
                $scope.errorMessage = '';
                var roomCount = data.rooms.length;

                if ( roomCount === 0 ) {
                    ngDialog.open({
                        template: '/assets/partials/nightlyDiary/rvNightlyDiaryNoAvailableRooms.html',
                        className: '',
                        scope: $scope
                    });
                }
                else {
                    var newData = {
                        availableRoomList: data.rooms,
                        fromDate: $scope.selectedItem.arrival_date,
                        nights: $scope.selectedItem.no_of_nights,
                        reservationId: $scope.selectedItem.reservation_id,
                        roomTypeId: $scope.selectedItem.room_type_id,
                        type: 'ASSIGN_ROOM',
                        reservationOccupancy: data.reservation_occupancy
                    };

                    $scope.$emit('SHOW_ASSIGN_ROOM_SLOTS', newData );
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
                'reservation_id': $scope.selectedItem.reservation_id,
                'selected_room_type_ids': [$scope.selectedItem.room_type_id],
                'selected_room_features': [],
                // 'floor_id': '',
                'is_from_diary': true
            },
            options = {
                params: postData,
                successCallBack: successCallBack,
                failureCallBack: failureCallBackMethod
            };

            $scope.callAPI(RVNightlyDiarySrv.retrieveAvailableRooms, options );
        };

        var selectUnassignedListItem = function(item) {
            $scope.diaryData.isReservationSelected = true;
            $scope.diaryData.selectedUnassignedReservation = item;
            $scope.selectedItem = item;

            $scope.diaryData.roomAssignmentFilters = {};
            var successCallBack = function(responce) {
                $scope.diaryData.roomAssignmentFilters = responce.data;
                if (screen.width < 1600) {
                    $scope.$emit("TOGGLE_FILTER", 'RESERVATION_FILTER');
                }
            },
            postData = {
                'reservation_id': item.reservation_id
            },
            options = {
                params: postData,
                successCallBack: successCallBack
            };

            $scope.callAPI(RVNightlyDiarySrv.getPreferences, options );
        },
        unSelectUnassignedListItem = function() {
            $scope.selectedItem = {};
            $scope.diaryData.isReservationSelected = false;
            $scope.$emit("RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY");
        };

        /**
         *  Handle unassigned reservation items
         *  @param {int} - [index value of reservations]
         */
        $scope.clickedUnassignedItem = function( index ) {
            var item = $scope.diaryData.unassignedReservationList.reservations[index];

            if (item.reservation_id === $scope.selectedItem.reservation_id) {
                unSelectUnassignedListItem();
            }
            else {
                selectUnassignedListItem(item);
                
            }
        };

        $scope.addListener('SUCCESS_ROOM_ASSIGNMENT', function() {
            var unassignedReservationList = $scope.diaryData.unassignedReservationList.reservations;

            // Update unassigned reservation list...
            unassignedReservationList = _.reject( unassignedReservationList,
                function(obj) {
                    return obj.reservation_id === $scope.selectedItem.reservation_id; 
                }
            );

            $scope.diaryData.unassignedReservationList.reservations = [];
            $scope.diaryData.unassignedReservationList.reservations = unassignedReservationList;
            $scope.selectedItem = {};

            $scope.$emit('HIDE_ASSIGN_ROOM_SLOTS');
        });

        // Method to fetch Unassigned reservations list.
        var fetchUnassignedReservationList = function () {
            var successCallBackFetchList = function (data) {
                $scope.errorMessage = '';
                $scope.diaryData.unassignedReservationList = data;
            },
            postData = {
                'date': $scope.diaryData.arrivalDate
            },
            options = {
                params: postData,
                successCallBack: successCallBackFetchList
            };

            $scope.callAPI(RVNightlyDiarySrv.fetchUnassignedReservationList, options);
        };

        $scope.addListener('RESET_UNASSIGNED_LIST_SELECTION', function() {
            $scope.selectedItem = {};
        });

        $scope.addListener('FETCH_UNASSIGNED_LIST_DATA', function() {
            fetchUnassignedReservationList();
        });

        $scope.addListener('UNASSIGNED_LIST_DATE_CHANGED', function() {
            fetchUnassignedReservationList();
            if ($scope.diaryData.isAssignRoomViewActive) {
                unSelectUnassignedListItem();
            }
        });

        // Show calendar popup.
        $scope.clickedDatePicker = function() {
            ngDialog.open({
                template: '/assets/partials/nightlyDiary/rvNightlyDiaryDatePicker.html',
                controller: 'RVNightlyDiaryUnassignedListDatePickerController',
                className: 'single-date-picker',
                scope: $scope
            });
        };

        // To handle click on left date shift.
        $scope.clickedDateLeftShift = function() {
            $scope.diaryData.arrivalDate = moment(tzIndependentDate($scope.diaryData.arrivalDate)).subtract(1, 'days')
                .format($rootScope.momentFormatForAPI);
            fetchUnassignedReservationList();
            if ($scope.diaryData.isAssignRoomViewActive) {
                unSelectUnassignedListItem();
            }
        };

        // To handle click on right date shift.
        $scope.clickedDateRightShift = function() {
            $scope.diaryData.arrivalDate = moment(tzIndependentDate($scope.diaryData.arrivalDate)).add(1, 'days')
                .format($rootScope.momentFormatForAPI);
            fetchUnassignedReservationList();
            if ($scope.diaryData.isAssignRoomViewActive) {
                unSelectUnassignedListItem();
            }
        };
        // Show/Hide unassigned list based on screen width and filter type
        $scope.isShowUnassignedList = function() {
            return (screen.width >= 1600 || $scope.diaryData.rightFilter === 'UNASSIGNED_RESERVATION') ? 'visible' : '';
        };
}]);
