angular.module('accountsModule', [])
.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider){
    //define module-specific routes here
        //group
        $stateProvider.state('rover.accounts', {
            url: '/accounts',
            abstract: true,
            templateUrl: '/assets/partials/accounts/rvAccountsRoot.html',
            controller: 'rvAccountsRootCtrl',
            resolve: {               
                accountsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.accounts', 'directives']);
                }
            }
        });

        //company card details
        $stateProvider.state('rover.accounts.search', {
            url: '/search',
            templateUrl: '/assets/partials/accounts/search/rvAccountsSearch.html',
            controller: 'rvAccountsSearchCtrl',
            resolve: {
                //to tackle from coming admin app to rover
                initialAccountsListing: ['rvAccountsSrv', 'accountsAssets',
                    function(rvAccountsSrv, accountsAssets) {
                        //as per CICO-13899, initially we are looking for groups which has from & to date equal
                        // to business date
                        var params = {
                            'query'     : '',
                            'status'    : '',
                            'per_page'  : rvAccountsSrv.DEFAULT_PER_PAGE,
                            'page'      : rvAccountsSrv.DEFAULT_PAGE
                        };
                        return rvAccountsSrv.getAccountsList(params);
                    }
                ]
            }
        });

        //group summary : CICO-6096
        $stateProvider.state('rover.accounts.config', {
            url: '/account/:id/:activeTab/:isFromArTransactions/:isFromCards',
            templateUrl: '/assets/partials/accounts/rvAccountsConfiguration.html',
            controller: 'rvAccountsConfigurationCtrl',
            onEnter: ['$stateParams', function($stateParams) {
                if (typeof $stateParams.id === "undefined" || $stateParams.id === null) {
                    $stateParams.id = "NEW_ACCOUNT";
                }
                if (typeof $stateParams.activeTab === "undefined" || $stateParams.activeTab === null) {
                    $stateParams.activeTab = "ACCOUNT";
                }
            }],
            resolve: {
                loadPaymentModule: function (jsMappings) {
                    return jsMappings.loadPaymentModule();
                },
                accountData: ['rvAccountsConfigurationSrv', '$stateParams', 'accountsAssets', 'loadPaymentModule',
                    function(rvAccountsConfigurationSrv, $stateParams, accountsAssets, loadPaymentModule){
                        var params = {
                            accountId: $stateParams.id
                        };
                        return rvAccountsConfigurationSrv.getAccountSummary (params);
                    }
                ]
            }

        });

}]);