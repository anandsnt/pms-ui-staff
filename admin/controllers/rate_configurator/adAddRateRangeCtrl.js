admin.controller('ADAddRateRangeCtrl', ['$scope', 
                                        '$filter', 
                                        'dateFilter', 
                                        'ADRatesRangeSrv',
                                        '$rootScope',
    function ($scope, $filter, dateFilter, ADRatesRangeSrv, $rootScope) {
        
        /**
        * set up data to be displayed
        */
        $scope.setUpData = function () {

            $scope.Sets = [];
            $scope.Sets.push(createDefaultSet("Set 1"));
            $scope.begin_date= tzIndependentDate($rootScope.businessDate);
         
            var dLastSelectedDate = '';
            var lastSelectedDate = '';

            try{ //Handle exception, in case of NaN, initially.
                lastSelectedDate = $scope.rateData.date_ranges[$scope.rateData.date_ranges.length - 1].end_date;
            }catch(e){}

            
            /* For new dateranges, fromdate should default 
             * to one day past the enddate of the last daterange
             * TODO: Only if lastDate > businessDate
             */
            if(typeof lastSelectedDate != "undefined" && lastSelectedDate != ""){

                dLastSelectedDate = tzIndependentDate(lastSelectedDate);
                // Get next Day
                dLastSelectedDate = new Date(dLastSelectedDate.getTime() + 24*60*60*1000);
                $scope.begin_date =dLastSelectedDate;
            }

            var businessDate = $rootScope.businessDate;
            $scope.fromDateOptions = {
                 changeYear: true,
                 changeMonth: true,
                // minDate: tzIndependentDate($rootScope.businessDate),
                 yearRange: "0:+10",
                 onSelect: function() {

                    if(tzIndependentDate($scope.begin_date) > tzIndependentDate($scope.end_date)){
                      $scope.end_date = $scope.begin_date;
                    }
                 }
             }

            $scope.toDateOptions = {
                 changeYear: true,
                 changeMonth: true,
               //  minDate: tzIndependentDate($rootScope.businessDate),
                 yearRange: "0:+10",
                 onSelect: function() {

                    if(tzIndependentDate($scope.begin_date) > tzIndependentDate($scope.end_date)){
                      $scope.begin_date = $scope.end_date;
                    }
                 }
            }
        };

        /*
        * Reset calendar action
        */
        $scope.$on('resetCalendar', function (e) {
            $scope.setUpData();
        });

        /*
        * to save rate range
        */
        $scope.saveDateRange = function () {

            var setData = [];
            angular.forEach($scope.Sets, function (set, key) {
                var setDetails = {};
                setDetails.name = set.setName;
                setDetails.monday = set.days[0].checked;
                setDetails.tuesday = set.days[1].checked;
                setDetails.wednesday = set.days[2].checked;
                setDetails.thursday = set.days[3].checked;
                setDetails.friday = set.days[4].checked;
                setDetails.saturday = set.days[5].checked;
                setDetails.sunday = set.days[6].checked;
                setData.push(setDetails);
            });
            var dateRangeData = {
                'id': $scope.rateData.id,
                'data': {
                    'begin_date': $scope.begin_date,
                    'end_date': $scope.end_date ,
                    'sets': setData
                }
            };

            var postDateRangeSuccessCallback = function (data) {
                var dateData = {};
                dateData.id = data.id;
                dateData.begin_date = dateRangeData.data.begin_date;
                dateData.end_date = dateRangeData.data.end_date;
                $scope.rateData.date_ranges.push(dateData);
                // activate last saved date range view
                $scope.$emit("changeMenu", data.id);
                $scope.$emit('hideLoader');
            };
            var postDateRangeFailureCallback = function (data) {
                $scope.$emit('hideLoader');
                $scope.$emit("errorReceived", data);
            };
            $scope.invokeApi(ADRatesRangeSrv.postDateRange, dateRangeData, postDateRangeSuccessCallback, postDateRangeFailureCallback);
        };


        /*
        * add new week set
        */
        $scope.addNewSet = function (index) {

            if ($scope.Sets.length < 7) {
                var newSet = {};

                var checkedDays = [];
                /*
                 * check if any day has already been checked,if else check it in new set
                 */
                angular.forEach($scope.Sets, function (set, key) {

                    angular.forEach(set.days, function (day, key) {
                        if (day.checked)
                            checkedDays.push(day.name);
                    });

                });
                newSet = createDefaultSet(" ");
                angular.forEach(checkedDays, function (uncheckedDay, key) {
                    angular.forEach(newSet.days, function (day, key) {
                        if (uncheckedDay === day.name) {
                            day.checked = false;
                        }
                    });
                });
                $scope.Sets.push(newSet)
            }
        };

        /*
        * delete set
        */
        $scope.deleteSet = function (index) {
            $scope.Sets.splice(index, 1);
        };

        /**
        * checkbox click action, uncheck all other set's day
        */
        $scope.checkboxClicked = function (dayIndex, SetIndex) {
            var temp = $scope.Sets[SetIndex].days[dayIndex].checked;
            angular.forEach($scope.Sets, function (set, key) {
                angular.forEach(set.days, function (day, key) {
                    if ($scope.Sets[SetIndex].days[dayIndex].name === day.name)
                        day.checked = false;
                });
            });
            $scope.Sets[SetIndex].days[dayIndex].checked = temp;
        }

        /**
        * Function to check if from_date and to_dates are selected in the calender
        */
        $scope.allFieldsFilled = function () {

            var anyOneDayisChecked = false;
            angular.forEach($scope.Sets, function (set, key) {
                angular.forEach(set.days, function (day, key) {
                    if (day.checked)
                        anyOneDayisChecked = true;
                });
            });

            if ($scope.begin_date && $scope.end_date && anyOneDayisChecked) {
                return true;
            } else
                return false;
        };

        /**
        * Create the default set of days for display
        * @param {String} name of the set
        * @return {Object} Sets with all days set to true
        */
        var createDefaultSet = function (setName) {

            var sets = {
                "setName": setName,
                'days': [{
                    'name': 'MON',
                    'checked': true
                }, {
                    'name': 'TUE',
                    'checked': true
                }, {
                    'name': 'WED',
                    'checked': true
                }, {
                    'name': 'THU',
                    'checked': true
                }, {
                    'name': 'FRI',
                    'checked': true
                }, {
                    'name': 'SAT',
                    'checked': true
                }, {
                    'name': 'SUN',
                    'checked': true
                }]
            };
            return sets;

        }

        $scope.count = 0;
     
        $scope.setUpData();
}]);
