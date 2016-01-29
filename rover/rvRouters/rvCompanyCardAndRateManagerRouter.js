angular.module('companyCardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
     //company card search
        $stateProvider.state('rover.companycardsearch', {
            url: '/cardsearch/:textInQueryBox',
            templateUrl: '/assets/partials/search/rvSearchCompanyCard.html',
            controller: 'searchCompanyCardController',
            resolve: {
                directivesJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets('directives');
                },
                comapanycardSearchAssets: function(jsMappings, mappingList, directivesJsAssets) {
                    return jsMappings.fetchAssets('rover.companycardsearch');
                }
            }
        });

        //company card details
        $stateProvider.state('rover.companycarddetails', {
            url: '/companycard/:type/:id/:query/:isBackFromStaycard',
            templateUrl: '/assets/partials/companyCard/rvCompanyCardDetails.html',
            controller: 'companyCardDetailsController',
            resolve: {
                directivesJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets('directives');
                },
                comapanycardDetailsAssets: function(jsMappings, directivesJsAssets) {
                    return jsMappings.fetchAssets('rover.companycarddetails');
                }
            }
        });
        //Rate Manager
        $stateProvider.state('rover.ratemanager', {
            url: '/rateManager',
            templateUrl: '/assets/partials/rateManager/dashboard.html',
            controller  : 'RMDashboradCtrl',
            resolve: {
                directivesJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets('directives');
                },                
                rateMangerAssets: function(jsMappings, mappingList, directivesJsAssets) {
                    return jsMappings.fetchAssets('rover.ratemanager', ['highcharts-ng']);
                },
                sortOrder: function(RateMngrCalendarSrv, rateMangerAssets) {
                    return RateMngrCalendarSrv.fetchSortPreferences();
                },
                sortOptions: function(RateMngrCalendarSrv, rateMangerAssets) {
                    return RateMngrCalendarSrv.fetchSortOptions();
                }
            }
        });
});