angular.module('guestCardModule', []).config(
function(
    $stateProvider   
    ) {  
     
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
            url: '/guestcarddetails/:guestId/:query',
            templateUrl: '/assets/partials/guestCard/rvGuestCardDetails.html',
            controller: 'rvGuestDetailsController',
            resolve: {
                loadPaymentMapping: function (jsMappings) {
                    return jsMappings.loadPaymentMapping();
                },
                loadPaymentModule: function (jsMappings, loadPaymentMapping) {
                    return jsMappings.loadPaymentModule();
                },
                guestcardDetailsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.guestcarddetails', 'directives']);
                },
                contactInfo: function (RVContactInfoSrv, guestcardDetailsAssets, $stateParams) {  
                   if ($stateParams.guestId) {
                     RVContactInfoSrv.setGuest($stateParams.guestId);
                     return RVContactInfoSrv.getGuestDetails();
                   }                 
                   return {};                    
                },
                countries: function (RVCompanyCardSrv, guestcardDetailsAssets) {
                    return RVCompanyCardSrv.fetchCountryList();
                }
            }
        });        
        
});
