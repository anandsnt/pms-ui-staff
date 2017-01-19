admin.controller('ADZestStationRoomUpsellCtrl', ['$scope', 'ADZestStationSrv', 'roomUpsellData',
    function($scope, ADZestStationSrv, roomUpsellData) {
        /**
         * [percentageChanged if any of the tier's percentage is changed, the other tier's 
         * percentage is recalculated]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        $scope.percentageChanged = function(type) {
            var isTier2Changed = type === 'tier2';
            var tier2Value = parseInt($scope.data.upsell_compositions_in_percentage.tier_2);
            var tier3Value = parseInt($scope.data.upsell_compositions_in_percentage.tier_3);
            if (isTier2Changed && !_.isNaN(tier2Value) && tier2Value < 100) {
                $scope.data.upsell_compositions_in_percentage.tier_3 = 100 - tier2Value;
                $scope.data.upsell_compositions_in_percentage.tier_2 = tier2Value;
            } else if (!isTier2Changed && !_.isNaN(tier3Value) && tier3Value < 100) {
                $scope.data.upsell_compositions_in_percentage.tier_2 = 100 - tier3Value;
                $scope.data.upsell_compositions_in_percentage.tier_3 = tier3Value;
            } else {
                return;
            }
        };
        /**
         * function to save the details
         */
        $scope.saveUpsellData = function() {
            var options = {
                params: $scope.data,
                successCallBack: $scope.goBackToPreviousState
            };
            $scope.callAPI(ADZestStationSrv.save, options);
        };
        (function() {
            BaseCtrl.call(this, $scope);
            var upsellData = {};
            // extract the required values
            upsellData.offer_kiosk_room_upsell = roomUpsellData.offer_kiosk_room_upsell;
            upsellData.room_upsell_options_order = roomUpsellData.room_upsell_options_order;
            upsellData.enforce_max_upsell_offered = roomUpsellData.enforce_max_upsell_offered;
            upsellData.maximum_room_upsell_offers = parseInt(roomUpsellData.maximum_room_upsell_offers);
            upsellData.upsell_compositions_in_percentage = roomUpsellData.upsell_compositions_in_percentage;
            upsellData.room_upsell_style = roomUpsellData.room_upsell_style;
            upsellData.hotel_room_upsell_on = roomUpsellData.hotel_room_upsell_on;
            $scope.data = upsellData;
            //upsellData.number_of_room_types_in_higher_level = 1;
            // create an array with max number as the number
            // of upsell room types available
            $scope.maxUpsellOptions = _.range(1, roomUpsellData.number_of_room_types_in_higher_level + 1);
        })();
    }
]);