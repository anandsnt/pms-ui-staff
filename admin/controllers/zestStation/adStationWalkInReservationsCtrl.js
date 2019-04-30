admin.controller('adStationWalkInReservationsCtrl', ['$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    'ADZestStationSrv',
    '$filter',
    'kioskSettings',
    'marketSegments',
    'bookingSources',
    'bookingOrigins',
    'rateCodes',
    function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter, kioskSettings, marketSegments, bookingSources, bookingOrigins, rateCodes) {
        BaseCtrl.call(this, $scope);

        $scope.kioskSettings = kioskSettings;

        var retrieveActiveItems = function(list) {
            return _.filter(list, function(item) {
                return item.is_active;
            });
        };

        $scope.config = {
            marketSegments: [],
            bookingSources: [],
            bookingOrigins: [],
            rateCodes: rateCodes.results
        };

        var reservationSettings = [{
            'identifier': 'marketSegments',
            'listItems': marketSegments.markets,
            'isActive': marketSegments.is_use_markets
        }, {
            'identifier': 'bookingSources',
            'listItems': bookingSources.sources,
            'isActive': bookingSources.is_use_sources
        }, {
            'identifier': 'bookingOrigins',
            'listItems': bookingOrigins.booking_origins,
            'isActive': bookingOrigins.is_use_origins
        }];

        _.each(reservationSettings, function(setting) {
            $scope.config[setting.identifier] = setting.isActive ? retrieveActiveItems(setting.listItems) : [];
        });

        $scope.saveSettings = function() {
            var saveSuccess = function() {
                $scope.successMessage = 'Success';
                $scope.$emit('hideLoader');
            };
            var saveFailed = function(response) {
                $scope.errorMessage = 'Failed';
                $scope.$emit('hideLoader');
            };
            var dataToSend = {
                'kiosk': $scope.kioskSettings
            };

            $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
        };

    }
]);