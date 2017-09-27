admin.directive('adTreeSelectorCheckbox', function (ivhTreeviewMgr) {
    return {
        restrict: 'AE',
        require: '^ivhTreeview',
        replace: true,
        template: [
            '<label style="display: inline;" class="checkbox" ' +
            'ng-class="{\'checked\': node.selected, \'semi-checked\': node.__ivhTreeviewIndeterminate}">',
            '<span class="icon-form icon-checkbox" ' +
            'ng-class="{\'checked\': node.selected, \'semi-checked\': node.__ivhTreeviewIndeterminate}"></span>',
            '</label>'
        ].join(''),
        link: function (scope, element, attrs, ctrl) {
            element.on('click', function () {
                ivhTreeviewMgr.select(ctrl.root(), scope.node, !scope.node.selected);
                scope.$emit('SELECTION_CHANGED');
                scope.$apply();
            });
        }
    };
});
