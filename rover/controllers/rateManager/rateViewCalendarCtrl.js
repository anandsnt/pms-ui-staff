sntRover.controller('RateViewCalendarCtrl', ['$scope', function($scope){
    $scope.$parent.myScrollOptions = {
            'rateViewCalendar': {
                hScrollbar: true,
                scrollbars: true,
                snap: false,
                mouseWheel: true,
                hideScrollbar: false,
            },
    };
    
    BaseCtrl.call(this, $scope);

}]);
