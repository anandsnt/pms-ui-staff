angular.module('admin').controller('ADCertificatesCtrl', ['$scope', 'certificates', 'ADCertificateSrv',
    function ($scope, certificates, ADCertificateSrv) {

        $scope.onSaveCertificates = function () {
            $scope.callAPI(ADCertificateSrv.save, {
                params: $scope.certificates,
                successCallBack: function () {
                    $scope.goBackToPreviousState();
                }
            });
        };

        // Initialization
        (function () {
            $scope.certificates = certificates;
        })();
    }
]);