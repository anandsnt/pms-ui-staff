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
            controller: 'rvGroupSearchCtrl'
        });        
}]);