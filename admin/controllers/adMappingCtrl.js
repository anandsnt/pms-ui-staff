admin.controller('ADMappingCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADInterfaceMappingSrv',
    function($scope, $rootScope, $state, $stateParams, ADInterfaceMappingSrv) {
        BaseCtrl.call(this, $scope);

        $scope.navigateBack = function() {
            $state.go('admin.dashboard', {menu: 8});
        };

        $scope.clickedMenuItem = function($event, stateToGo, state) {
            if (!state) {
                state = {};
            }

            $state.go(stateToGo, {
                interface_id: state.id,
                hotel_id: $scope.hotelId,
                interface_name: state.name
            });

            if ($scope.menuOpen) {
                $scope.menuOpen = !$scope.menuOpen;
                $scope.showSubMenu = false;
            }
        };

        $scope.fetchExternalMappingItems = function() {
            $scope.callAPI(ADInterfaceMappingSrv.fetchExternalMappingList, {
                params: {
                    'hotel_id': $rootScope.hotelId
                },
                onSuccess: function(response) {
                    $scope.extMappingSubComponents = response;
                }
            });

        };
    }
]);
