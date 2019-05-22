angular.module('admin')
    .controller('ADFeatureToggleConfigCtrl', ['$scope', '$state', 'ngTableParams', 'ADFeatureToggleSrv', 'feature',
        function ($scope, $state, ngTableParams, ADFeatureToggleSrv, feature) {
            $scope.scopesList = ['APPLICATION', 'CHAIN', 'HOTEL'];

            $scope.toggleFeature = function () {
                $scope.callAPI(ADFeatureToggleSrv.toggle, {
                    params: {
                        feature: $scope.feature.name
                    }
                });
            };

            (function () {
                $scope.feature = feature;
                $scope.selectedScope = 'APPLICATION';
            })();

        }
    ]);
