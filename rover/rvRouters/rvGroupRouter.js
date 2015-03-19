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
            controller: 'rvGroupRootCtrl'
        }); 

        //company card details
        $stateProvider.state('rover.groups.search', {
            url: '/search',
            templateUrl: '/assets/partials/groups/rvGroupSearch.html',
            controller: 'rvGroupSearchCtrl',
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
                            'query': '',
                            'from_date': businessDate.business_date,
                            'to_date': businessDate.business_date
                        }
                        return rvGroupSrv.getGroupList(params);
                    }
                ]
            }
        });        
}]);