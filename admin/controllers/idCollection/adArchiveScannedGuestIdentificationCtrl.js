angular.module('admin').controller('adArchiveScannedGuestIdentifiactionCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'ACGIIntegrationSrv', 'ngDialog',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, ACGIIntegrationSrv, ngDialog) {

        var interfaceIdentifier = 'idCollectionArchive';

        $scope.toggleEnabled = function() {
            $scope.config.guest_id_archive_enabled = !$scope.config.guest_id_archive_enabled;
            if ($scope.config.guest_id_archive_enabled) {
                $scope.MODE = 'CONFIGURE';
            }
        };

        $scope.buttonClicked = function( mode ) {
            if (mode === 'SAVE') {
                $scope.saveConfig();
            }
            $scope.MODE = mode;
        };

        $scope.update = function(isSignedIn) {
            $scope.GoogleAuth.grantOfflineAccess()
                .then(function(res) {
                    if (isSignedIn) {
                        $scope.config.guest_id_archive_platform_token = res.code;
                    }
                });
        };

        $scope.dropBoxSignIn = function() {
            DROPBOX.call(this, $scope);
        }

        $scope.gapiSignIn = function() {
            $scope.config.guest_id_archive_platform = 'google_drive';
            GAPI.call(this, $scope);
        }

        $scope.saveConfig = function() {
            $scope.callAPI(ACGIIntegrationSrv.saveConfiguration, {
                params: {
                    config: $scope.config
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            //    init
            $scope.config = config.data;
            $scope.isAccepted = false;

        })();
    }
]);
