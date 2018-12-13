angular.module('admin').
    directive('multiSelectDragDrop', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                selected: '=',
                available: '='
            },
            templateUrl: '/assets/directives/MultiSelectDragDrop/adMultiSelectDragDrop.html',
            controller: 'multiSelectDragDropCtrl'
        };
    });
