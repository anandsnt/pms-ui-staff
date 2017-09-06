angular.module('ADChainRouter', []).config(function ($stateProvider) {

    $stateProvider.state('admin.chain', {
        url: '/chain',
        abstract: true,
        template: '<div ui-view class="main-view"></div>'
    });

    $stateProvider.state('admin.chain.certificates', {
        templateUrl: '/assets/partials/chains/certificates/ADChainCertificatesSetup.html',
        url: '/certificates',
        controller: 'ADCertificatesCtrl',
        resolve: {
            certificates: ['ADCertificateSrv', function (ADCertificateSrv) {
                return ADCertificateSrv.fetch();
            }]
        }
    });

});