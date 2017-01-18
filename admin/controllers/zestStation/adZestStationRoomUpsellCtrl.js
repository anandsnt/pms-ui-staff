admin.controller('ADZestStationRoomUpsellCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter',
    function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter) {
        BaseCtrl.call(this, $scope);
        $scope.data = {};
        $scope.data.hotel_upsell_is_on = true;

        var maxUpsellPresent = 5;

        $scope.maxUpsellOptions = _.range(1, maxUpsellPresent + 1);
        console.log($scope.maxUpsellOptions);

        $scope.percentageChanged = function(type) {
            var isTier2Changed = type === 'tier2';
            var tier2Value = parseInt($scope.data.upsell_compositions_in_percerntage.tier_2);
            var tier3Value = parseInt($scope.data.upsell_compositions_in_percerntage.tier_3);
            if (isTier2Changed && tier2Value < 100) {
                $scope.data.upsell_compositions_in_percerntage.tier_3 = 100 - tier2Value;
            } else if (tier3Value < 100) {
                $scope.data.upsell_compositions_in_percerntage.tier_2 = 100 - tier3Value;
            } else {
                return;
            }
        };
    }
]);