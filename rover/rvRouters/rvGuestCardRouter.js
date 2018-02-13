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

        $stateProvider.state('rover.guestcarddetails', {
            url: '/guestcarddetails/:guestId',
            templateUrl: '/assets/partials/guestCard/rvGuestCardDetails.html',
            controller: 'rvGuestDetailsController',
            resolve: {
                guestcardDetailsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.guestcarddetails', 'directives']);
                },
                contactInfo: function (RVContactInfoSrv, guestcardDetailsAssets, $stateParams) {                    
                    RVContactInfoSrv.setGuest($stateParams.guestId);
                    return RVContactInfoSrv.getGuestDetails();
                    
                }
            }
        });        
        
});
