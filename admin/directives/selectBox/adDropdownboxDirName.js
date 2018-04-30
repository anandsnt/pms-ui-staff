admin.directive('adDropdownName', function($timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            divStyle: '@divStyle',
            selboxStyle: '@selboxStyle',
            divClass: '@divClass',
            selboxClass: '@selboxClass',
            required: '@required',
            id: '@id',
            label: '@label',
            labelInDropDown: '@labelInDropDown',
            list: '=list',
            name: '@name',
            prop: '@property',
            ngModel: '=savemodel',
            selectedId: '=selectedId',
            labelClass: '@labelClass',
            valueproperty: '@valueproperty',
            options: '=',
            prefixValue: '@',
            labelProperties: '=',
            isDisabled: '=',
            changeHandler: '=',
            changeHandlerParam: '=',
            skipNumberConversion: '@'
        },
        link: function($scope) {
            
            if (typeof $scope.options !== 'undefined') {
                if ($scope.options.hasOwnProperty('showOptionsIf')) {
                    $scope.showOptionsIf = $scope.options.showOptionsIf;
                }
            } else {
                $scope.showOptionsIf = function() {
                    return true;
                };
            }

            $scope.onChange = function() {
                if ($scope.changeHandler) {
                    $timeout(function() {
                        $scope.changeHandler($scope.ngModel, $scope.changeHandlerParam);
                    });
                }
            };

            $scope.getLabel = function(row) {
                var label = '';

                _.each($scope.labelProperties, function(key, idx) {
                    if (idx === 0) {
                        label += row[key];
                    } else {
                        label += ' - ' + row[key];
                    }

                });
                return label;
            };
        },
        templateUrl: '/assets/directives/selectBox/adDropdownboxName.html'
    };
});
