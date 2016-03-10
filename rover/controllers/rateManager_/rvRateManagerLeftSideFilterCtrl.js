/**
 * Created by shahulhameed on 3/10/16.
 */
angular.module('sntRover').controller('rvRateManagerLeftSideFilterCtrl', [
    '$scope',
    '$filter',
    'ngDialog',
    'rvUtilSrv',
    '$rootScope',
    function($scope,
             $filter,
             ngDialog,
             util,
             $rootScope) {

        BaseCtrl.call(this, $scope);

        /**
         * function for initializing the scrollers
         */
        var setScroller = () => {
            $scope.setScroller( 'filter_details', {} );
        };

        /**
         * when we click the set button
         */
        $scope.$on("TWO_MONTH_CALENDAR_DATE_UPDATED", function(event, data){
            $scope.rateManagerDataModel.filterOptions.dateRange.from = data.fromDate;
            $scope.rateManagerDataModel.filterOptions.dateRange.to = data.toDate;

            $scope.selectedDateRange = formatDateForUI(data.fromDate) + ' to ' + formatDateForUI(data.toDate);
        });

        /**
         * we want to display date in what format set from hotel admin
         * @param {String/DateObject}
         * @return {String}
         */
        var formatDateForUI = function(date_) {
            var type_ = typeof date_,
                returnString = '';
            switch (type_) {
                //if date string passed
                case 'string':
                    returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
                    break;

                //if date object passed
                case 'object':
                    returnString = $filter('date')(date_, $rootScope.dateFormat);
                    break;
            }
            return (returnString);
        };

        /**
         * inorder to show the two month calendar on tapping the date range button
         */
        $scope.showCalendar = () => {

            ngDialog.open({
                template: '/assets/partials/rateManager_/dateRangeModal/rvDateRangeModal.html',
                controller: 'rvDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal',
                scope: $scope,
                data: {
                    fromDate: new tzIndependentDate($rootScope.businessDate),
                    toDate: util.getFirstDayOfNextMonth($rootScope.businessDate)
                }
            });
        };

        var initializeDataModelForMe = () => {
            $scope.selectedDateRange = '';
        };

        /**
         * initialisation function
         */
        (() => {
            setScroller();
            initializeDataModelForMe();
        })();

    }]);