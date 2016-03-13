angular.module('sntRover').controller('rvDateRangeModalCtrl',
    ['$scope', 'ngDialog', '$filter', 'dateFilter', '$rootScope','rvUtilSrv', 'rvTwoMonthCalendarEventConstants',
        function($scope, ngDialog, $filter, dateFilter, $rootScope, util, rvTwoMonthCalendarEventConstants) {
          'use strict';

          /**
           * when to press the set button
           */
          $scope.updateClicked = () => {
            var updatedData = {
              fromDate: $scope.fromDate,
              toDate: $scope.toDate
            };
            $scope.$emit(rvTwoMonthCalendarEventConstants.TWO_MONTH_CALENDAR_DATE_UPDATED, updatedData);
            $scope.closeDialog();
          };

          /**
           * will set the date picker options
           */
          var initializeDatePicker = () => {

            var commonDateOptions = {
              firstDay: 1,
              changeYear: true,
              changeMonth: true,
              yearRange: '-5:+5', //Show 5 years in past & 5 years in future
            };

            $scope.fromDateOptions = Object.assign({
              onSelect: function(dateText, datePicker) {
                $scope.fromDate = new tzIndependentDate(util.get_date_from_date_picker(datePicker));
                $scope.toDate = ($scope.fromDate > $scope.toDate) ? $scope.fromDate : $scope.toDate;
              }
            }, commonDateOptions);

            $scope.toDateOptions = Object.assign({
              onSelect: function(dateText, datePicker) {
                $scope.toDate = new tzIndependentDate(util.get_date_from_date_picker(datePicker));
                $scope.fromDate = ($scope.fromDate > $scope.toDate) ? $scope.toDate : $scope.fromDate;
              }
            }, commonDateOptions);
          };

          (()=> {

            var allParamsForCalendarExist = (!!$scope.ngDialogData && 'fromDate' in $scope.ngDialogData && 'toDate' in $scope.ngDialogData);
            if (!allParamsForCalendarExist) { //if some of the params is missing from ngDialog initialization
              console.error('Unable to initialize two month calendar, you may have missed the required params to initalize the calendar view');
              return;
            }

            if (!_.isDate($scope.ngDialogData.fromDate) || !_.isDate($scope.ngDialogData.toDate)) {
              console.error('Unable to initialize two month calendar, from date or to date expecting a date object ');
              return;
            }

            initializeDatePicker();

            $scope.fromDate = new tzIndependentDate($scope.ngDialogData.fromDate);
            $scope.toDate = new tzIndependentDate($scope.ngDialogData.toDate);
          })();
        }
    ]);
