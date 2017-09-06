angular.module('ADChainRouter', []).config(function ($stateProvider) {

    $stateProvider.state('admin.chain', {
        url: '/chain',
        abstract: true,
        template: '<div ui-view class="main-view"></div>'
    });

    $stateProvider.state('admin.chain.certificates', {
        templateUrl: '/assets/partials/interfaces/adInterfacesSubMenuList.html',
        controller: 'ADInterfaceSubMenuCtrl',
        url: '/certificates'
    });

    $stateProvider.state('admin.chain.qr_code_encryption_certificate', {
        templateUrl: '/assets/partials/chains/certificates/ADChainCertificatesSetup.html',
        url: '/QRKey',
        controller: 'ADCertificatesCtrl',
        resolve: {
            config: ['ADCertificateSrv', function (ADCertificateSrv) {
                return ADCertificateSrv.fetch();
            }]
        }
    });
});
