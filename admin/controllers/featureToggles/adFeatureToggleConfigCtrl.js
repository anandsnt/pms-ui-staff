angular.module('admin')
    .controller('ADFeatureToggleConfigCtrl', ['$scope', '$state', 'ngTableParams', 'ADFeatureToggleSrv', 'feature',
        function ($scope, $state, ngTableParams, ADFeatureToggleSrv, feature) {
            $scope.scopesList = ['APPLICATION', 'CHAIN', 'HOTEL'];
            $scope.state = {
                toggleStatus: false
            };

            $scope.toggleFeature = function () {
                $scope.callAPI(ADFeatureToggleSrv.toggle, {
                    params: {
                        feature: $scope.feature.name
                    },
                    onSuccess: function () {
                        $scope.state.toggleStatus = !$scope.state.toggleStatus;
                    }
                });
            };

            $scope.onScopeChange = function () {
                feature.enabled = !!$scope.state.toggleStatus;
            };

            (function () {
                $scope.feature = feature;
                $scope.state.toggleStatus = !!feature.enabled;
                $scope.selectedScope = 'APPLICATION';
            })();

        }
    ]);
