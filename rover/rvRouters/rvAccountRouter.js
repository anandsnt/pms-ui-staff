angular.module('accountModule', [])
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
            templateUrl: '/assets/partials/accounts/rvAccountRoot.html',
            controller: 'rvAccountRootCtrl'
        }); 
}]);