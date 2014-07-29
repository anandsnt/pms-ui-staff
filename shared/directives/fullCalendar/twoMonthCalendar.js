
angular.module('twoMonthscalendar', []).directive('twoMonthCalendar', function() {
    return {
        restrict: 'AE',
        scope: {
            eventSources:'=eventSources', 
            fullCalendarOptions: '=fullCalendarOptions'
        },
        link: function(scope, elm, attrs, controller) {

        },
        templateUrl: '../../assets/directives/fullCalendar/twoMonthCalendar.html'
    };
});