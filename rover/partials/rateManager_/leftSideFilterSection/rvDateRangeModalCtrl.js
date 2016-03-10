angular.module('sntRover').controller('rvDateRangeModalCtrl',
    ['$scope', 'ngDialog', '$filter', 'dateFilter', '$rootScope',
        function($scope, ngDialog, $filter, dateFilter, $rootScope) {
            'use strict';

            var fromDate, toDate;
            /**
             * will set the date picker options
             */
            var initializeDatePicker = () => {

            };

            (()=>{

                var allParamsForCalendarExist = (!!$scope.ngDialogData && 'fromDate' in $scope.ngDialogData && 'toDate' in $scope.ngDialogData);
                if( !allParamsForCalendarExist ) { //if some of the params is missing from ngDialog initialization
                    console.error('Unable to initialize two month calendar, you may have missed the required params to initalize the calendar view');
                    return;
                }

                initializeDatePicker();

                fromDate = _.isEmpty($scope.ngDialogData) ? '' : filterData.begin_date;

            })();

            var filterData = $scope.currentFilterData,
                businessDate = tzIndependentDate($rootScope.businessDate),
                defaultDate = tzIndependentDate(Date.now()),
                fromDate = _.isEmpty(filterData.begin_date) ? '' : filterData.begin_date,
                toDate = _.isEmpty(filterData.end_date) ? '' : filterData.end_date;

            var getFirstDayOfNextMonth = function(date) {
                var date = new tzIndependentDate(date),
                    y = date.getFullYear(),
                    m = date.getMonth();

                return $filter('date')(new Date(y, m + 1, 1), $rootScope.dateFormatForAPI);
            };

            $scope.setUpData = function() {
                $scope.fromDate = fromDate || $filter('date')(businessDate, $rootScope.dateFormatForAPI);
                $scope.toDate = toDate || $filter('date')(getFirstDayOfNextMonth(businessDate), 'yyyy-MM-dd');

                if (!fromDate) {
                    fromDate = $scope.fromDate;
                }

                $scope.fromDateOptions = {
                    firstDay: 1,
                    changeYear: true,
                    changeMonth: true,
                    yearRange: "-5:+5", //Show 5 years in past & 5 years in future
                    onSelect: function(dateText, datePicker) {
                        fromDate = $scope.fromDate;
                        if (tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)) {
                            $scope.toDate = $scope.fromDate;
                            toDate = $scope.toDate;
                        }
                    }
                };

                $scope.toDateOptions = {
                    firstDay: 1,
                    changeYear: true,
                    changeMonth: true,
                    yearRange: "-5:+5",
                    onSelect: function(dateText, datePicker) {
                        toDate = $scope.toDate;
                        if (tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)) {
                            $scope.fromDate = $scope.toDate;
                            fromDate = $scope.fromDate;
                        }
                    }
                };

                $scope.errorMessage = '';
            };

            $scope.setUpData();

            $scope.updateClicked = function() {
                filterData.begin_date = $scope.fromDate;
                filterData.end_date = $scope.toDate;
                filterData.selected_date_range = dateFilter($scope.fromDate, $rootScope.dateFormat) +
                    ' to ' +
                    dateFilter($scope.toDate, $rootScope.dateFormat);

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
