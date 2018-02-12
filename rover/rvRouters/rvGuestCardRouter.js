angular.module('guestCardModule', []).config(
function(
    $stateProvider,
    $urlRouterProvider,
    $translateProvider) {  
     
        $stateProvider.state('rover.guestcardsearch', {
            url: '/cardsearch/:textInQueryBox',
            templateUrl: '/assets/partials/search/rvSearchGuestCard.html',
            controller: 'guestCardSearchController',
            resolve: {
                guestcardSearchAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.guestcardsearch', 'directives']);
                }
            }
        });
        
});
