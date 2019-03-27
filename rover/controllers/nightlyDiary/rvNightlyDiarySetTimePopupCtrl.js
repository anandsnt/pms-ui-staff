sntRover.controller('rvNightlyDiarySetTimePopupCtrl', ['$scope', function($scope) {

    /*
     *  generateTimeDuration
     *  @param {string} - [minArrivalTime] 
     *  @param {string} - [maxDepartureTime]
     *  @return {Array} - [List of time objects having 12hr and 24hr formats]
     */
    var generateTimeDuration = function(minArrivalTime, maxDepartureTime) {
        var timeInterval = 15, // minutes interval
            startTime = 0, // start time
            endTime = (24 * 60) - timeInterval, // end time
            ap = ['AM', 'PM'], // AM-PM

            times = [], // time array - output array
            twelveHrFormat = '',
            twentyFourHrFormat = '',
            hh = '',
            mm = '',
            obj = {};

        if (minArrivalTime) {
            startTime = minArrivalTime.split(':')[0] * 60 + minArrivalTime.split(':')[1] * 1;
        }
        else if (maxDepartureTime) {
            endTime = maxDepartureTime.split(':')[0] * 60 + maxDepartureTime.split(':')[1] * 1;
        }

        // loop to increment the time and push results in times array
        for (var i = 0; startTime <= endTime; i++) {
          hh = Math.floor(startTime / 60); // getting hours of day in 0-24 format
          mm = (startTime % 60); // getting minutes of the hour in 0-55 format
          twelveHrFormat = (("0" + hh %12).slice(-2) === '00' ? '12' : ("0" + hh %12).slice(-2)) + ':' + ("0" + mm).slice(-2) + " " + ap[Math.floor(hh / 12)]; // data in [12:00 AM- 12:00 PM format]
          twentyFourHrFormat = ("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2); // data in [00:00 - 24:00 format]
          obj = {
            "12": twelveHrFormat,
            "24": twentyFourHrFormat
          };
          times.push(obj);
          startTime = startTime + timeInterval;
        }
        return times;
    };

    /* 
     *  Generate data set for day count - arrival, dep date mappings.
     *  @paran {Object} - [ Data object with available_dates[], min_arrival_time,max_departure_time,default_checkout_time]
     *  @return {Array} - [ List of objects contains arrivalTimeList and departureTimeList ]
     */
    var generateDataForBookAction = function( data ) {
        var generatedList = [];

        if (data && data.available_dates) {
            for (var i = 1; i <= data.available_dates.length; i++ ) {
                var obj = {
                    day: i,
                    arrivalTimeList: [],
                    departureTimeList: []
                };

                if (i === data.available_dates) {
                    obj.arrivalTimeList = generateTimeDuration(data.min_arrival_time, null);
                    obj.departureTimeList = generateTimeDuration(null, $scope.setTimePopupData.data.max_departure_time);
                }
                else {
                    obj.arrivalTimeList = generateTimeDuration(data.min_arrival_time, null);
                    obj.departureTimeList = generateTimeDuration(null, $scope.setTimePopupData.data.default_checkout_time);
                }
                generatedList.push(obj);
            }
        }

        return generatedList;
    };

    // Initialization of data set based on scenarios.
    var init = function() {
        if ($scope.setTimePopupData.type === 'ASSIGN' || $scope.setTimePopupData.type === 'MOVE') {
            $scope.setTimePopupData.selectedArrivalTime = $scope.setTimePopupData.data.min_arrival_time;
            $scope.setTimePopupData.selectedDepartureTime = $scope.setTimePopupData.data.max_departure_time;
            $scope.setTimePopupData.arrivalTimeList = generateTimeDuration($scope.setTimePopupData.data.min_arrival_time, null);
            $scope.setTimePopupData.departureTimeList = generateTimeDuration(null, $scope.setTimePopupData.data.max_departure_time);
        }
        else if ($scope.setTimePopupData.type === 'BOOK') {
            $scope.setTimePopupData.selectedArrivalTime = '';
            $scope.setTimePopupData.selectedDepartureTime = '';
            $scope.setTimePopupData.selectedCount = '1';
            $scope.setTimePopupData.processData = generateDataForBookAction($scope.setTimePopupData.data);
        }
    };

    // Handle day count change actions
    $scope.daysCountChanged = function() {
        $scope.setTimePopupData.arrivalTimeList = $scope.setTimePopupData.processData[$scope.setTimePopupData.selectedCount-1].arrivalTimeList;
        $scope.setTimePopupData.departureTimeList = $scope.setTimePopupData.processData[$scope.setTimePopupData.selectedCount-1].departureTimeList;
    };

    // Handle save and continue button click actions.
    $scope.saveAndContinueClicked = function() {
        var timeObj = {
            arrival_time: $scope.setTimePopupData.selectedArrivalTime,
            departure_time: $scope.setTimePopupData.selectedDepartureTime
        };

        $scope.$emit('SET_TIME_AND_SAVE', timeObj);
    };

    init();

}]);