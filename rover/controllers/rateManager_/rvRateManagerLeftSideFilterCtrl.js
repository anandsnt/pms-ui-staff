/**
 * Created by shahulhameed on 3/10/16.
 */
angular.module('sntRover').controller('rvRateManagerLeftSideFilterCtrl', [
    '$scope',
    '$filter',
    'ngDialog',
    'rvUtilSrv',
    '$rootScope',
    'rvRateManagerOrderByConstants',
    'rvTwoMonthCalendarEventConstants',
    function($scope,
             $filter,
             ngDialog,
             util,
             $rootScope,
             rvRateManagerOrderByConstants,
             rvTwoMonthCalendarEventConstants) {

    BaseCtrl.call(this, $scope);

    /**
     * This method handles on-click of the SHOW RATES BUTTON
     */
    $scope.onClickShowRates = () => {
        // Find out the view selected by the user
        /**
         * NOTE The possible views are
         *  1. Multiple Rates
         *  2. All Room Types
         *  3. Single Rate
         */
        let filter = $scope.rateManagerDataModel.filterOptions;
        if(filter.viewTypeSelection.showAllRoomTypes){
        //    All Room Types
        }else if(filter.viewTypeSelection.selectedRates.length === 1){
        //    Single Rate
        }else{
        //    Multiple Rates View
        }
    };

    /**
     * to switch the tab from left side filter's show all/select rate
     * @param  {[type]} tab [description]
     * @return {[type]}     [description]
     */
    $scope.switchTab = (tab) => { 
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.chosenTab = tab;
        refreshScroller();
    };

    /**
     * to referesh the scroller objects
     */
    var refreshScroller = () => {
        $scope.refreshScroller( 'filter_details' );
    };

    /**
     * function for initializing the scrollers
     */
    var setScroller = () => {
        $scope.setScroller( 'filter_details', {} );
    };

    /**
     * when we click the set button
     */
    $scope.$on(rvTwoMonthCalendarEventConstants.TWO_MONTH_CALENDAR_DATE_UPDATED, function(event, data){
        $scope.rateManagerDataModel.filterOptions.dateRange.from = data.fromDate;
        $scope.rateManagerDataModel.filterOptions.dateRange.to = data.toDate;

        $scope.selectedDateRange = formatDateForUI(data.fromDate) + ' to ' + formatDateForUI(data.toDate);
    });

    /**
     * we want to display date in what format set from hotel admin
     * @param {String/DateObject}
     * @return {String}
     */
    var formatDateForUI = (date_) => {
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

        $scope.orderByValueMappings = rvRateManagerOrderByConstants;
    };

    /**
     * initialisation function
     */
    (() => {
        setScroller();
        initializeDataModelForMe();
    })();
}]);