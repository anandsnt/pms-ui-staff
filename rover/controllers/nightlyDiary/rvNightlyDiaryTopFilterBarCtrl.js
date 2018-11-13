angular.module('sntRover')
.controller('rvNightlyDiaryTopFilterBarController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        'ngDialog',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $filter,
            ngDialog
        ) {

        BaseCtrl.call(this, $scope);
        var listeners = {};

        /*
         * Utility method to shift date.
         * @param {String}  - startDate : base date to be shifted.
         * @param {Number}  - shiftCount : no of days needed to shift.
         * @param {Boolean} - isRightShift : whether shift to future date or previous date.
         * @return {String} - calculated date.
         */
        var getDateShift = function( startDate, shiftCount,  isRightShift, isInclusive ) {
            var date = tzIndependentDate(startDate);
            /* For calculating diaryData.toDate, the shiftCount is 6. In case of diaryData.fromDate the shiftCount is 7.
               isInclusive is true in case of toDate. */

            if (isInclusive) {
                shiftCount -= 1;
            }
            if (isRightShift) {
                date.setDate(date.getDate() + shiftCount );
            }
            else {
                date.setDate(date.getDate() - shiftCount );
            }
            date = $filter('date')(date, 'yyyy-MM-dd');
            return date;
        };

        // Utility method to check for a given date range spans over two months.
        var checkDateRangeHaveMultipleMonths = function() {
            var startDate = tzIndependentDate($scope.diaryData.fromDate),
                endDate = tzIndependentDate($scope.diaryData.toDate),
                hasMultipleMonth = false;

            // if the date range having multiple months.
            if (startDate.getMonth() !== endDate.getMonth()) {
                hasMultipleMonth = true;
                if ($scope.diaryData.numberOfDays === 21) {
                    var isReachedSecondMonth = false;

                    $scope.diaryData.firstMonthDateList = [];
                    $scope.diaryData.secondMonthDateList = [];
                    angular.forEach($scope.diaryData.datesGridData, function(item) {
                        var dateObj = tzIndependentDate(item.date);

                        if (dateObj.getDate() === 1) {
                            isReachedSecondMonth = true;
                        }
                        if (isReachedSecondMonth) {
                            $scope.diaryData.secondMonthDateList.push(item);
                        }
                        else {
                            $scope.diaryData.firstMonthDateList.push(item);
                        }
                    });
                }

            }
            return hasMultipleMonth;
        };

        var init = function() {
            $scope.diaryData.fromDate = $filter('date')(tzIndependentDate($scope.diaryData.fromDate), 'yyyy-MM-dd');
            $scope.diaryData.toDate   = getDateShift( $scope.diaryData.fromDate, $scope.diaryData.numberOfDays, true, true);
            $scope.diaryData.firstMonthDateList = [];
            $scope.diaryData.secondMonthDateList = [];
            $scope.diaryData.hasMultipleMonth = false;
            $scope.diaryData.rightFilter = 'RESERVATION_FILTER';
        };

        // Show calendar popup.
        $scope.clickedDatePicker = function() {
            ngDialog.open({
                template: '/assets/partials/nightlyDiary/rvNightlyDiaryDatePicker.html',
                controller: 'RVNightlyDiaryDatePickerController',
                className: 'single-date-picker',
                scope: $scope
            });
        };
        // Catching event from date picker controller while date is changed.
        listeners['DATE_CHANGED'] = $scope.$on('DATE_CHANGED', function () {
            var isRightShift = true;

            if ($scope.diaryData.numberOfDays === 7) {
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift, true);
            }
            else {
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift, true);
            }
            $scope.$emit('UPDATE_RESERVATIONLIST');
        });
        // Catching event from main controller, when API is completed.
        listeners['FETCH_COMPLETED_DATE_LIST_DATA'] = $scope.$on('FETCH_COMPLETED_DATE_LIST_DATA', function() {
            $scope.diaryData.hasMultipleMonth = checkDateRangeHaveMultipleMonths();
        });

        // To toggle 7/21 button.
        $scope.toggleSwitchMode = function() {
            var isRightShift = true;

            if ($scope.diaryData.numberOfDays === 21) {
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift, true);
                $scope.diaryData.numberOfDays = 7;
            }
            else {
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift, true);
                $scope.diaryData.numberOfDays = 21;
            }
            $scope.$emit('UPDATE_RESERVATIONLIST');
            $scope.$emit('UPDATE_UNASSIGNED_RESERVATIONLIST');
        };

        /*
         * Method to calculate from date and to date after shifting.
         * @param {Boolean} - isRightShift : whether shift to future date or previous date.
         * @return {String} - calculated date.
         */
        var calculateFromDateAndToDate = function( isRightShift ) {
            var fromDate = angular.copy(tzIndependentDate($scope.diaryData.fromDate));
            var nextShift = isRightShift;

            if (!isRightShift) {
                // If the fromDate is a shift to the left, then the toDate is a shift right from the new fromDate.
                nextShift = true;
            }
            if ($scope.diaryData.numberOfDays === 7) {
                $scope.diaryData.fromDate = getDateShift(fromDate, 7, isRightShift, false);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, nextShift, true);
            }
            else {
                $scope.diaryData.fromDate = getDateShift(fromDate, 21, isRightShift, false);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, nextShift, true);
            }
        };

        // To handle click on left date shift.
        $scope.clickedDateLeftShift = function() {
            var isRightShift = false;

            calculateFromDateAndToDate(isRightShift);
            $scope.$emit('UPDATE_RESERVATIONLIST');
            $scope.$emit('UPDATE_UNASSIGNED_RESERVATIONLIST');
        };

        // To handle click on right date shift.
        $scope.clickedDateRightShift = function() {
            var isRightShift = true;

            calculateFromDateAndToDate(isRightShift);
            $scope.$emit('UPDATE_RESERVATIONLIST');
            $scope.$emit('UPDATE_UNASSIGNED_RESERVATIONLIST');
        };

        // To handle click on reset button.
        $scope.clickedResetButton = function() {
            init();
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS');
        };

        // To toggle filter and unassigned list.
        $scope.toggleFilter = function(activeTab) {
            if($scope.diaryData.rightFilter !== activeTab){
                $scope.diaryData.rightFilter = activeTab;
                $scope.$emit('TOGGLE_FILTER');
            }
            if (activeTab === 'UNASSIGNED_RESERVATION'){
                $scope.$emit('RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY');
            }
        };

        // Handle Nigthtly/Hourly toggle
        $scope.toggleHourlyNightly = false;
        $scope.navigateToHourlyDiary = function() {
            $state.go("rover.diary");
            $scope.toggleHourlyNightly = true;
        };

        /*
         *  Utility method to check whether we need to show Toggle DIARY H/N
         *  Based on settings values inside Reservation settings.
         */
        $scope.hideToggleMenu = function() {
            
            /**
             *  A = settings.day_use_enabled (true / false)
             *  B = settings.hourly_rates_for_day_use_enabled (true / false)
             *  C = settings.hourly_availability_calculation ('FULL' / 'LIMITED')
             *
             *  A == false => 1. Default with nightly Diary. No navigation to Hourly ( we can hide the toggle from UI ).
             *  A == true && B == false => 3. Default with nightly Diary. Able to view Hourly ( we can show the toggle from UI ).
             *  A == true && B == true && C == 'FULL' => 4. Default with Hourly Diary. Able to view Nightly ( we can show the toggle from UI ).
             *  A == true && B == true && C == 'LIMITED' => 3. Default with nightly Diary. Able to view Hourly ( we can show the toggle from UI ).
             */

            var diaryConfig = $rootScope.hotelDiaryConfig,
                hideToggleMenu = false;

            // A == false => 1. Default with nightly Diary. No navigation to Hourly ( we can hide the toggle from UI ).
            if ( !diaryConfig.dayUseEnabled ) {
                hideToggleMenu = true;
            }

            return hideToggleMenu;
        };

        init();

        // destroying listeners
        angular.forEach(listeners, function(listener) {
            $scope.$on('$destroy', listener);
        });
}]);