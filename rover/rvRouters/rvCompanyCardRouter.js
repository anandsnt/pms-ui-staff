angular.module('companyCardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
     //company card search
        $stateProvider.state('rover.companycardsearch', {
            url: '/cardsearch/:textInQueryBox',
            templateUrl: '/assets/partials/search/rvSearchCompanyCard.html',
            controller: 'searchCompanyCardController',
            resolve: {
                comapanycardSearchAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.companycardsearch', 'directives']);
                }
            }
        });

        //company card details
        $stateProvider.state('rover.companycarddetails', {
            url: '/companycard/:type/:id/:query/:isBackFromStaycard/:origin',
            templateUrl: '/assets/partials/companyCard/rvCompanyCardDetails.html',
            controller: 'companyCardDetailsController',
            resolve: {
                loadPaymentModule: function (jsMappings) {
                    return jsMappings.loadPaymentModule();
                },
                comapanycardDetailsAssets: function(jsMappings, loadPaymentModule) {
                    return jsMappings.fetchAssets(['rover.companycarddetails', 'directives', 'highcharts'], ['highcharts-ng']);
                }
            }
        });
});