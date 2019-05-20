angular.module('admin')
    .controller('ADFeatureToggleConfigCtrl', ['$scope', '$state', 'ngTableParams', 'ADFeatureToggleSrv', 'feature',
        function ($scope, $state, ngTableParams, ADFeatureToggleSrv, feature) {
            $scope.scopesList = ['APPLICATION', 'CHAIN', 'HOTEL'];

            $scope.saveToggle = function () {
                console.log('save', feature);
            };

            $scope.changeScope = function () {
                console.log($scope.selectedScope);
            };

            (function () {
                $scope.feature = feature;
                $scope.selectedScope = 'APPLICATION';
            })();

        }
    ]);
