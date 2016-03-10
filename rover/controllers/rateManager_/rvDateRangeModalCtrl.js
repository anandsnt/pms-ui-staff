angular.module('sntRover').controller('rvDateRangeModalCtrl',
    ['$scope', 'ngDialog', '$filter', 'dateFilter', '$rootScope','rvUtilSrv',
        function($scope, ngDialog, $filter, dateFilter, $rootScope, util ) {
            'use strict';

            var fromDate, toDate;
            /**
             * will set the date picker options
             */
            var initializeDatePicker = () => {

                var commonDateOptions = {
                    firstDay: 1,
                    changeYear: true,
                    changeMonth: true,
                    yearRange: "-5:+5", //Show 5 years in past & 5 years in future
                };

                $scope.fromDateOptions = _.extend({
                    onSelect: function(dateText, datePicker) {
                        fromDate = new tzIndependentDate(util.get_date_from_date_picker(datePicker));
                        toDate = (fromDate > toDate) ? fromDate : toDate;
                    }
                }, commonDateOptions);

                $scope.toDateOptions = _.extend({
                    onSelect: function(dateText, datePicker) {
                        toDate = new tzIndependentDate(util.get_date_from_date_picker(datePicker));
                        fromDate = (fromDate > toDate) ? toDate : fromDate;
                    }
                }, commonDateOptions);
            };

            (()=>{

                var allParamsForCalendarExist = (!!$scope.ngDialogData && 'fromDate' in $scope.ngDialogData && 'toDate' in $scope.ngDialogData);
                if( !allParamsForCalendarExist ) { //if some of the params is missing from ngDialog initialization
                    console.error('Unable to initialize two month calendar, you may have missed the required params to initalize the calendar view');
                    return;
                }

                if($scope.ngDialogData)

                initializeDatePicker();

                fromDate = $scope.ngDialogData.fromDate;
                toDate = $scope.ngDialogData.toDate;
            })();


            var getFirstDayOfNextMonth = function(date) {
                var date = new tzIndependentDate(date),
                    y = date.getFullYear(),
                    m = date.getMonth();

                return $filter('date')(new Date(y, m + 1, 1), $rootScope.dateFormatForAPI);
            };

            $scope.setUpData();

            $scope.updateClicked = function() {

                ngDialog.close();
            };

            $scope.toggleUpdate = function() {
                return _.isEmpty($scope.fromDate) || _.isEmpty($scope.toDate);
            };

            $scope.cancelClicked = function() {
                ngDialog.close();
            };

        }
    ]);
