angular.module('guestCardModule', []).config(
function(
    $stateProvider   
    ) {

        $stateProvider.state('rover.guest', {
            url: '/guest',
            resolve: {
                guestcardSearchAssets: function(jsMappings) {
                    return jsMappings.fetchAssets(['rover.guestcardsearch', 'directives']);
                },
                guestcardDetailsAssets: function(jsMappings) {
                    return jsMappings.fetchAssets(['rover.guestcarddetails', 'directives']);
                }
            }
        });
     
        $stateProvider.state('rover.guest.search', {
            url: '/cardsearch',
            params: {
                textInQueryBox: '',
                selectedIds: [],
                isMergeViewSelected: null
            },
            templateUrl: '/assets/partials/search/rvSearchGuestCard.html',
            controller: 'guestCardSearchController'
        });

        $stateProvider.state('rover.guest.details', {
            url: '/guestcarddetails',
            params: {
                guestId: '',
                query: '',
                isBackToStatistics: null,
                selectedStatisticsYear: null,
                selectedIds: [],
                isMergeViewSelected: null,
                reservationId: null,
                confirmationNo: null,
                fromStaycard: null,
                isPrimary: null,
                firstName: '',
                lastName: '',
                guestType: null
            },
            templateUrl: '/assets/partials/guestCard/rvGuestCardDetails.html',
            controller: 'rvGuestDetailsController',
            resolve: {
                loadPaymentMapping: function (jsMappings) {
                    return jsMappings.loadPaymentMapping();
                },
                loadPaymentModule: function (jsMappings, loadPaymentMapping) {
                    return jsMappings.loadPaymentModule();
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
                },
                idTypesList: function (RVCompanyCardSrv, guestcardDetailsAssets) {
                    return RVCompanyCardSrv.fetchIdTypes();
                }
            }
        });        
        
});
