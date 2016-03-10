angular.module('rateManagerModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider){
        $stateProvider.state('rover.newRateManager', {
            url: '/todo/',
            templateUrl: '/assets/partials/rateManager_/rvRateManagerRoot.html',
            controller: 'rvRateManagerCtrl_',
            resolve: {
                reactAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['react.files', 'directives'], ['react']);
                },
                reduxAssets: function (jsMappings, reactAssets) {
                    return jsMappings.fetchAssets(['redux.files']);
                },
                rateMgrAssets: function (jsMappings, reduxAssets) {
                    return jsMappings.fetchAssets(['rover.newRateManager']);
                }
            }
        });

    });