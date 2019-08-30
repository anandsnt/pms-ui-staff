angular.module('admin').controller('adStationIdCollectionSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv) {

        var interfaceIdentifier = 'zestStationIdCollection';

        $scope.scan_types = [
            {
                "name": "ID Scan",
                "value": "id_scan"
            },
            {
                "name": "ID Scan With Staff Verification",
                "value": "id_scan_with_staff_verification"
            },
            {
                "name": "ID Scan With Facial Verification",
                "value": "id_scan_with_facial_verification"
            },
            {
                "name": "Staff ID Verification",
                "value": "staff_id_verification"
            },
            {
                "name": "ID Scan With Samsotech",
                "value": "id_scan_with_samsotech"
            }
        ];

        $scope.toggleAllGuests = function() {
            config.scan_all_guests = !config.scan_all_guests;
        };

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.toggleBellSoundEnabled = function() {
            config.bell_sound_active = !config.bell_sound_active;
        };

        $scope.saveConfig = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            //    init
            $scope.config = config;
        })();
    }
]);