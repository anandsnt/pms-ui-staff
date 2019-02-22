angular.module('admin').controller('adArchiveScannedGuestIdentifiactionCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'ACGIIntegrationSrv',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, ACGIIntegrationSrv) {

        var TURN_ON = false,
            updateMode = function() {
                if (!$scope.config.guest_id_archive_enabled) {
                    $scope.MODE = 'CONFIGURE';
                } else if ( $scope.config.guest_id_archive_enabled && TURN_ON) {
                    $scope.MODE = 'CONFIGURE_ON';
                } else if ($scope.config.guest_id_archive_platform) {
                    $scope.MODE = 'CONFIGURED';
                } else {
                    $scope.MODE = 'DISCONNECTED';
                }
            },
            updateConnectedDetails = function() {
                if ($scope.config.guest_id_archive_platform === 'dropbox') {
                    $scope.connctedDetails.name = 'Drop Box';
                    $scope.connctedDetails.iconUrl = '/assets/images/archive-option-dropbox.png';
                } else if ($scope.config.guest_id_archive_platform === 's3') {
                    $scope.connctedDetails.name = 'AWS';
                    $scope.connctedDetails.iconUrl = '/assets/images/archive-option-aws.png';
                } else {
                    $scope.connctedDetails.name = 'Google Drive';
                    $scope.connctedDetails.iconUrl = '/assets/images/archive-option-gdrive.png';
                }
                $scope.connctedDetails.isConnected = true;
            },
            init = function() {
                $scope.config = config.data;
                $scope.connctedDetails = {};
                updateMode();
                updateConnectedDetails();
                GAPI.call(this, $scope);
            };

        $scope.enableAcceptButton = function() {
            if ($scope.config.guest_id_archive_position.length >= 3
                && $scope.config.guest_id_archive_last_name.length >= 3
                && $scope.config.guest_id_archive_first_name.length >= 2) {
                return true;
            } 
            return false;

        };

        $scope.validateToken = function() {
            if ($scope.config && (($scope.config.guest_id_archive_platform_token && $scope.config.guest_id_archive_platform_token.length)
                || ($scope.config.aws_secret_access_key && $scope.config.aws_access_key_id))) {
                return true;
            }
            return false;
        };

        $scope.toggleEnabled = function() {
            if ( !$scope.config.guest_id_archive_enabled ) {
                $scope.config.guest_id_archive_enabled = true;
                TURN_ON = true;
                init();
            } else {
                $scope.config.guest_id_archive_enabled = false;
                $scope.MODE = 'DISCONNECTED';
            }
        };

        var setPlatform = function(platform) {
            $scope.config.guest_id_archive_platform = platform;
            $scope.config.guest_id_archive_platform_token = "";
            $scope.MODE = 'ACCESS_TOKEN';
        }

        $scope.dropBoxSignIn = function() {
            setPlatform("dropbox");
        };

        $scope.connectToS3 = function() {
            setPlatform("s3")
        };

        $scope.gapiSignIn = function() {
            if ($scope.GoogleAuth) {
                $scope.config.guest_id_archive_platform = 'google_drive';
                $scope.GoogleAuth.grantOfflineAccess()
                .then(function(res) {
                    if (res.code) {
                        $scope.config.guest_id_archive_platform_token = res.code;
                        $scope.MODE = 'ACCESS_TOKEN';
                        setTimeout(function () {
                            $scope.$apply();
                        }, 700);
                    }
                });
            } else {
                GAPI.call(this, $scope);
                $scope.errorMessage = ["Google client failed to load...please try again"];
            }
            
            
        };

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
        $scope.disConnect = function() {
            $scope.config.guest_id_archive_enabled = true;
            $scope.MODE = 'CONFIGURE_ON';
        };
        $scope.acceptTerms = function() {
            $scope.MODE = 'CHOOSE_PLATFORM';
        };


        init();
    }
]);
