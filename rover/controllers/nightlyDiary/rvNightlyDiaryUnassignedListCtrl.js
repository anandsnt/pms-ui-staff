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
        $scope.diaryData.selectedUnassignedReservation = {};
        $scope.businessDate = $rootScope.businessDate;

        var selectUnassignedListItem = function(item) {
            $scope.diaryData.isReservationSelected = true;
            $scope.diaryData.selectedUnassignedReservation = item;
            $scope.diaryData.roomAssignmentFilters = {};
            var successCallBack = function(responce) {
                $scope.diaryData.roomAssignmentFilters = responce.data;
                $scope.diaryData.roomAssignmentFilters.roomTypeId = item.room_type_id.toString();
                $scope.diaryData.roomAssignmentFilters.floorId = '';
                $scope.diaryData.roomAssignmentFilters.roomFeatureIds = [];
                $scope.$emit('APPLY_GUEST_PREFERENCE_FILTER_TOP');
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
            $scope.diaryData.selectedUnassignedReservation = {};
            $scope.diaryData.isReservationSelected = false;
            $scope.$emit("RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY");
        };

        /**
         *  Handle unassigned reservation items
         *  @param {int} - [index value of reservations]
         */
        $scope.clickedUnassignedItem = function( index ) {
            var item = $scope.diaryData.unassignedReservationList.reservations[index];

            if (item.reservation_id === $scope.diaryData.selectedUnassignedReservation.reservation_id) {
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
                    return obj.reservation_id === $scope.diaryData.selectedUnassignedReservation.reservation_id; 
                }
            );

            $scope.diaryData.unassignedReservationList.reservations = [];
            $scope.diaryData.unassignedReservationList.reservations = unassignedReservationList;
            $scope.diaryData.selectedUnassignedReservation = {};

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
            $scope.diaryData.selectedUnassignedReservation = {};
            $scope.diaryData.isReservationSelected = false;
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
