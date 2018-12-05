angular.module('admin').
    directive('multiSelectDragDrop', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                selected: '=',
                available: '='
            },
            templateUrl: '/assets/directives/MultiSelectDragDrop/adMultiSelectDragDrop.html',
            controller: 'multiSelectDragDropCtrl'
        };
    });
