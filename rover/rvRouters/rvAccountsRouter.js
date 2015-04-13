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
            controller: 'rvAccountsRootCtrl'
        }); 

        //company card details
        $stateProvider.state('rover.accounts.search', {
            url: '/search',
            templateUrl: '/assets/partials/accounts/search/rvAccountsSearch.html',
            controller: 'rvAccountsSearchCtrl',
            resolve: {
                //to tackle from coming admin app to rover, see the injection in next resolve function
                businessDate: ['rvGroupSrv', function(rvGroupSrv) {
                    return rvGroupSrv.fetchHotelBusinessDate();
                }],
                //to tackle from coming admin app to rover
                initialGroupListing: ['rvGroupSrv', 'businessDate', 
                    function(rvGroupSrv, businessDate) {
                        //as per CICO-13899, initially we are looking for groups which has from & to date equal
                        // to business date
                        var params = {
                            'query'     : '',
                            'from_date' : businessDate.business_date,
                            'to_date'   : '',
                            'per_page'  : rvGroupSrv.DEFAULT_PER_PAGE,
                            'page'      : rvGroupSrv.DEFAULT_PAGE,
                        }
                        return rvGroupSrv.getGroupList(params);
                    }
                ]
            }
        });
    
}]);