sntRover.directive('durationFilter', [
    '$timeout', 
    function ($timeout) {
        var filterController = function ($scope, $element, $attrs) {

            $scope.removeFilter = function () {
                $scope.onRemove({filterPos: $scope.filterPos});
            };
        };

        return {
            restrict: 'E',
			templateUrl: '/assets/directives/customExports/durationFilter/durationFilter.html',
			replace: true,
			scope: {
                firstLevelData: '=',
                secondLevelData: '=',
                selectedFirstLevel: '=',
                selectedSecondLevel: '=',
                filterPos: '=',
                onRemove: '&'
                
            },
			controller: filterController

            
        };

}]);