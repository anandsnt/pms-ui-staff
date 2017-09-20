angular.module('admin').controller('ADCertificatesCtrl', ['$scope', 'config', 'ADCertificateSrv',
    function ($scope, config, ADCertificateSrv) {

        $scope.onSaveCertificates = function () {
            $scope.callAPI(ADCertificateSrv.save, {
                params: $scope.config,
                successCallBack: function () {
                    $scope.goBackToPreviousState();
                }
            });
        };

        // Initialization
        (function () {
            $scope.config = config;
        })();
    }
]);
