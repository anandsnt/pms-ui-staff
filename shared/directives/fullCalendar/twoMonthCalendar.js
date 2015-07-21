
angular.module('twoMonthscalendar', []).directive('twoMonthCalendar', function() {
    return {
        restrict: 'AE',
        scope: {
            eventSources:'=eventSources',
            leftCalendarOptions: '=leftCalendarOptions',
            rightCalendarOptions: '=rightCalendarOptions',
            nextButtonClickHandler: '&',
            prevButtonClickHandler: '&',
            disablePrevButton: '=disablePrevButton'
        },
        controller: function($scope, $compile, $http) {
            $scope.nextButtonClicked = function(){
                $scope.nextButtonClickHandler();
            };

            $scope.prevButtonClicked = function(){
                $scope.prevButtonClickHandler();

            };
        },
        link: function(scope, elm, attrs, controller) {

        },
        templateUrl: '../../assets/directives/fullCalendar/twoMonthCalendar.html'
    };
});