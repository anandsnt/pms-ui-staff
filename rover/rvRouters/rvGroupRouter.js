angular.module('groupModule', [])
.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider){
    //define module-specific routes here
        //group
        $stateProvider.state('rover.groups', {
            url: '/groups',
            abstract: true,
            templateUrl: '/assets/partials/groups/rvGroupRoot.html',
            controller: 'rvGroupRootCtrl',
            resolve: {            
                groupAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.groups', 'directives']);
                }
            }
        });

        //company card details
        $stateProvider.state('rover.groups.search', {
            url: '/search',
            templateUrl: '/assets/partials/groups/search/rvGroupSearch.html',
            controller: 'rvGroupSearchCtrl',
            resolve: {
                //to tackle from coming admin app to rover, see the injection in next resolve function
                businessDate: ['rvGroupSrv', 'groupAssets', function(rvGroupSrv, groupAssets) {
                    return rvGroupSrv.fetchHotelBusinessDate();
                }],
                //to tackle from coming admin app to rover
                initialGroupListing: ['rvGroupSrv', 'businessDate', 'groupAssets',
                    function(rvGroupSrv, businessDate, groupAssets) {
                        //as per CICO-13899, initially we are looking for groups which has from & to date equal
                        // to business date
                        var params = {
                            'query'     : '',
                            'from_date' : businessDate.business_date,
                            'to_date'   : '',
                            'per_page'  : rvGroupSrv.DEFAULT_PER_PAGE,
                            'page'      : rvGroupSrv.DEFAULT_PAGE
                        }
                        return rvGroupSrv.getGroupList(params);
                    }
                ]
            }
        });

        //group summary : CICO-12790
        $stateProvider.state('rover.groups.config', {
            url: '/config/:id/:activeTab/:newGroupName',
            templateUrl: '/assets/partials/groups/rvGroupConfiguration.html',
            controller: 'rvGroupConfigurationCtrl',
            onEnter: ['$stateParams', function($stateParams) {
                if (typeof $stateParams.id === "undefined" || $stateParams.id === null) {
                    $stateParams.id = "NEW_GROUP";
                }
                if (typeof $stateParams.activeTab === "undefined" || $stateParams.activeTab === null) {
                    $stateParams.activeTab = "SUMMARY";
                }
            }],
            resolve: {
                loadPaymentModule: function (jsMappings) {
                    return jsMappings.loadPaymentModule();
                },
                //to tackle from coming admin app to rover
                summaryData: ['rvGroupConfigurationSrv', '$stateParams', 'groupAssets', 'loadPaymentModule',
                    function(rvGroupConfigurationSrv, $stateParams, groupAssets, loadPaymentModule){
                        var isInAddMode = ($stateParams.id === "NEW_GROUP");
                        var params = {
                            groupId: $stateParams.id
                        };
                        return rvGroupConfigurationSrv.getGroupSummary (params);
                    }
                ],
                holdStatusList: ['rvGroupConfigurationSrv', 'groupAssets', 'loadPaymentModule',
                    function (rvGroupConfigurationSrv, groupAssets, loadPaymentModule) {
                        var params = {
                            is_group: true
                        }
                        return rvGroupConfigurationSrv.getHoldStatusList (params);
                    }
                ]
            }

        });
}]);