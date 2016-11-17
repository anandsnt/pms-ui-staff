admin.directive('fauxSelect', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            label: '@label',
            change: '=change',
            isDisabled: '=isDisabled',
            source: '=source',
            selectAll: '@selectAll'
        },
        templateUrl: '/assets/directives/fauxSelect/fauxSelectTemplate.html',
        compile: function(element, attributes) {
            return {
                pre: function($scope) {
                    if ($scope.selectAll) {
                        _.each($scope.source, function(item) {
                            item.isSelected = true;
                        });
                        $scope.title = 'All Selected';
                    }
                }
            };
        },
        controller: function($scope) {
            var setTitle = function() {
                var selectedItems = _.filter($scope.source, function(item) {
                        return !!item.isSelected;
                    }),
                    selectedCount = selectedItems.length;

                if (selectedCount === 0) {
                    $scope.title = "Select " + $scope.label;
                } else if (selectedCount === 1) {
                    $scope.title = selectedItems[0].name;
                } else if (selectedCount === $scope.source.length) {
                    $scope.title = 'All Selected';
                    $scope.selectAll = true;
                } else {
                    $scope.title = selectedCount + " Selected";
                }
            };

            $scope.toggleSelectAll = function() {
                _.each($scope.source, function(item) {
                    item.isSelected = !$scope.selectAll;
                });

                $scope.selectAll = !$scope.selectAll;

                setTitle();
                $scope.change && $scope.change();
            };

            if (!$scope.title) {
                setTitle();
            }

            $scope.toggleList = function() {
                $scope.show = !$scope.show;
            };

            $scope.fauxSelectChange = function() {
                setTitle();
                $scope.change && $scope.change();
            };

            $scope.$watch('source', function(newVal) {
                setTitle();
            });
        }
    };

});