admin.controller('adHotelFeatureTogglesEditCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$state',
    'adFeaturesSrv',
    'settings',
    function($rootScope, $scope, $stateParams, $state, adFeaturesSrv, settings) {
        $scope.title = "Edit Hotel Features";

        /**
        *   Go back to hotel list
        */
        $scope.back = function() {
            if ($rootScope.previousStateParam) {
                $state.go($rootScope.previousState, { menu: $rootScope.previousStateParam});
            }
            else if ($rootScope.previousState) {
                $state.go($rootScope.previousState);
            }
            else
            {
                $state.go('admin.dashboard', { menu: 5 });
            }
        };

        $scope.featureChanged = function() {
            console.log($scope.data)

// TODO: Provide server call with updated feature
//            $scope.callAPI(adFeaturesSrv.updateFeature, {params: {'feature': feature}});
        };

        (function () {
            $scope.data = settings;
        }());
}]);
