/**
 * Created by shahulhameed on 3/10/16.
 */
angular.module('sntRover').controller('rvRateManagerLeftSideFilterCtrl', [
    '$scope',
    '$filter',
    function($scope,
             $filter) {

        BaseCtrl.call(this, $scope);

        /**
         * function for initializing the scrollers
         */
        var setScroller = () => {
            $scope.setScroller( 'filter_details', {} );
        };

        /**
         * inorder to show the two month calendar on tapping the date range button
         */
        $scope.showCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/rateManager/selectDateRangeModal.html',
                controller: 'SelectDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal',
                scope: $scope
            });
        };

        /**
         * initialisation function
         */
        (() => {
            setScroller();
        })();

        //--------------------------------------------------------------------------------------------------------------

        /**
         * This method handles on-click of the SHOW RATES BUTTON
         */
        $scope.onClickShowRates = function(){

        };

    }]);