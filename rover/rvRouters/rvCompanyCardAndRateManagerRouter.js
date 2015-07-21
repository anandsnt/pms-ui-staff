angular.module('companyCardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
     //company card search
        $stateProvider.state('rover.companycardsearch', {
            url: '/cardsearch/:textInQueryBox',
            templateUrl: '/assets/partials/search/rvSearchCompanyCard.html',
            controller: 'searchCompanyCardController'
        });

        //company card details
        $stateProvider.state('rover.companycarddetails', {
            url: '/companycard/:type/:id/:query/:isBackFromStaycard',
            templateUrl: '/assets/partials/companyCard/rvCompanyCardDetails.html',
            controller: 'companyCardDetailsController'
        });
        //Rate Manager
        $stateProvider.state('rover.ratemanager', {
            url: '/rateManager',
            templateUrl: '/assets/partials/rateManager/dashboard.html',
            controller  : 'RMDashboradCtrl',
            resolve: {
                sortOrder: function(RateMngrCalendarSrv) {
                    return RateMngrCalendarSrv.fetchSortPreferences();
                },
                sortOptions: function(RateMngrCalendarSrv) {
                    return RateMngrCalendarSrv.fetchSortOptions();
                }
            }
        });
});