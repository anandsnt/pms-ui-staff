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

    }]);