angular.module('sntRover')
.controller('rvNightlyDiaryFiltersController',
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
        ){

        BaseCtrl.call(this, $scope);
        /*
         * Utility method to shift date.
         * @param {String}  - startDate : base date to be shifted.
         * @param {Number}  - shiftCount : no of days needed to shift.
         * @param {Boolean} - isRightShift : whether shift to future date or previous date.
         * @return {String} - calculated date.
         */
        var getDateShift = function( startDate, shiftCount,  isRightShift ){
            var date = tzIndependentDate(startDate);
            if(isRightShift){
                date.setDate(date.getDate() + shiftCount );
            }
            else{
                date.setDate(date.getDate() - shiftCount );
            }
            date = $filter('date')(date, 'yyyy-MM-dd');
            return date;
        };

        // Utility method to check for a given date range spans over two months.
        var checkDateRangeHaveMultipleMonths = function(){
            var startDate = tzIndependentDate($scope.diaryData.fromDate),
                endDate = tzIndependentDate($scope.diaryData.toDate),
                hasMultipleMonth = false;
            // if the date range having multiple months.
            if(startDate.getMonth() !== endDate.getMonth()){
                hasMultipleMonth = true;
                if($scope.diaryData.numberOfDays === 21){
                    var isReachedSecondMonth = false;
                    $scope.diaryData.firstMonthDateList = [];
                    $scope.diaryData.secondMonthDateList = [];
                    angular.forEach($scope.diaryData.datesGridData,function(item) {
                        var dateObj = tzIndependentDate(item.date);
                        if(dateObj.getDate() === 1){
                            isReachedSecondMonth = true;
                        }
                        if(isReachedSecondMonth){
                            $scope.diaryData.secondMonthDateList.push(item);
                        }
                        else{
                            $scope.diaryData.firstMonthDateList.push(item);
                        }
                    });
                }

            }
            return hasMultipleMonth;
        };

        var init = function(){
            $scope.diaryData.numberOfDays = 7;
            $scope.diaryData.fromDate = $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd');
            $scope.diaryData.toDate   = getDateShift( $rootScope.businessDate, 7, true);
            $scope.diaryData.firstMonthDateList = [];
            $scope.diaryData.secondMonthDateList = [];
            $scope.diaryData.hasMultipleMonth = false;
        };

        // Show calendar popup.
        $scope.clickedDatePicker = function(){
            ngDialog.open({
                template: '/assets/partials/nightlyDiary/rvNightlyDiaryDatePicker.html',
                controller: 'RVNightlyDiaryDatePickerController',
                className: 'single-date-picker',
                scope: $scope
            });
        };
        // Catching event from date picker controller while date is changed.
        $scope.$on('DATE_CHANGED',function () {
            var isRightShift = true;
            if($scope.diaryData.numberOfDays === 7){
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
            }
            else{
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
            }
            $scope.$emit('REFRESH_DIARY_TIMELINE');
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS');
        });
        // Catching event from main controller, when API is completed.
        $scope.$on('FETCH_COMPLETED_DATE_LIST_DATA',function () {
            $scope.diaryData.hasMultipleMonth = checkDateRangeHaveMultipleMonths();
        });

        // To toggle 7/21 button.
        $scope.toggleSwitchMode = function(){
            var isRightShift = true;
            //$scope.diaryData.isSevenSelected = !$scope.diaryData.isSevenSelected;
            if($scope.diaryData.numberOfDays === 21){
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
                $scope.diaryData.numberOfDays = 7;
            }
            else{
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
                $scope.diaryData.numberOfDays = 21;
                if($scope.diaryData.datesGridData.length !== 21){
                    $scope.$emit('REFRESH_DIARY_TIMELINE');
                }
            }
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS');
        };

        /*
         * Method to calculate from date and to date after shifting.
         * @param {Boolean} - isRightShift : whether shift to future date or previous date.
         * @return {String} - calculated date.
         */
        var calculateFromDateAndToDate = function( isRightShift ){
            var fromDate = angular.copy(tzIndependentDate($scope.diaryData.fromDate));
            var nextShift = isRightShift;
            if(!isRightShift) {
                // If the fromDate is a shift to the left, then the toDate is a shift right from the new fromDate.
                nextShift = true;
            }
            if($scope.diaryData.numberOfDays === 7){
                $scope.diaryData.fromDate = getDateShift(fromDate, 7, isRightShift);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, nextShift);
            }
            else{
                $scope.diaryData.fromDate = getDateShift(fromDate, 21, isRightShift);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, nextShift);
            }
        };

        // To handle click on left date shift.
        $scope.clickedDateLeftShift = function(){
            var isRightShift = false;
            calculateFromDateAndToDate(isRightShift);
            $scope.$emit('REFRESH_DIARY_TIMELINE');
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS');
        };

        // To handle click on right date shift.
        $scope.clickedDateRightShift = function(){
            var isRightShift = true;
            calculateFromDateAndToDate(isRightShift);
            $scope.$emit('REFRESH_DIARY_TIMELINE');
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS');
        };

        // To handle click on reset button.
        $scope.clickedResetButton = function(){
            init();
            $scope.$emit('REFRESH_DIARY_TIMELINE');
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS');
        };

        init();

}]);
