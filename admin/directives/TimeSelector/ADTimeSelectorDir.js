admin.directive('sntTimeSelector', function() {
    /**
     * Method to generate time values for the selector
     * @param {Integer} interval defaults to 60
     * @return {Array} array of time intervals
     */
    function getTimeOptions(interval) {
        var i, currentTime, options = [];

        interval = interval || 60;

        for (i = 0, currentTime = 0; currentTime < 24 * 60; i++, currentTime += interval) {
            var hh = Math.floor(currentTime / 60),
                mm = currentTime % 60;

            options[i] = {
                hour: ('0' + hh % 12).slice(-2) + [' AM', ' PM'][Math.floor(hh / 12)],
                name: ('0' + hh % 12).slice(-2) + ':' + ('0' + mm).slice(-2) + [' AM', ' PM'][Math.floor(hh / 12)],
                value: ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2)
            };
        }

        return options;
    }

    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            interval: '@',
            timeVariable: '='
        },
        templateUrl: '/assets/directives/TimeSelector/sntTimeSelector.html',
        link: function(scope) {
            scope.interval = scope.interval || 15;
            scope.options = getTimeOptions(scope.interval);
        }
    };

});