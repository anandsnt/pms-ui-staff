sntRover.controller('rvNightlyDiarySetTimePopupCtrl', ['$scope', function($scope) {

    console.log($scope.setTimePopupData);

    // Handle save and continue button click actions.
    $scope.saveAndContinueClicked = function() {
        // $scope.$emit('SAVE_RESERVATION_EDITING');
    };

    var generateTimeDuration = function(minArrivalTime, maxDepartureTime) {
        var timeInterval = 15, // minutes interval
            startTime = 0, // start time
            endTime = 24 * 60, // end time
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
        for (var i = 0; startTime < endTime; i++) {
          hh = Math.floor(startTime / 60); // getting hours of day in 0-24 format
          mm = (startTime % 60); // getting minutes of the hour in 0-55 format
          twelveHrFormat = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + " " + ap[Math.floor(hh / 12)]; // data in [00:00 - 12:00 AM/PM format]
          twentyFourHrFormat = ("0" + (hh)).slice(-2) + ':' + ("0" + mm).slice(-2); // data in [00:00 - 24:00 format]
          obj = {
            "12": twelveHrFormat,
            "24": twentyFourHrFormat
          };
          times.push(obj);
          startTime = startTime + timeInterval;
        }

        console.log(times);
    };

}]);