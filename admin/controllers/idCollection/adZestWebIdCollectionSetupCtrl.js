angular.module('admin').controller('adZestWebIdCollectionSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv) {

        var interfaceIdentifier = 'zestWebIdCollection';  

        $scope.toggleAllGuests = function() {
            config.scan_all_guests = !config.scan_all_guests;
        };

        $scope.toggleFaceRecognition = function() {
            config.face_recognition_enabled = !config.face_recognition_enabled;
        };

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.toggleMandatory = function() {
            config.mandatory_enabled = !config.mandatory_enabled;
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