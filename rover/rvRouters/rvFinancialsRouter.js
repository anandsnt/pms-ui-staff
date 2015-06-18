angular.module('FinancialsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.financials', {
        abstract: true,
        url: '/financials',
        templateUrl: '/assets/partials/financials/rvFinancials.html',
        controller: 'RVFinancialsController'
    });

    $stateProvider.state('rover.financials.journal', {
        url: '/journal/:id',
        templateUrl: '/assets/partials/financials/journal/rvJournal.html',
        controller: 'RVJournalController',
        resolve: {
            journalResponse: function(RVJournalSrv) {
                if ( !!RVJournalSrv ) {
                    return RVJournalSrv.fetchGenericData();
                } else {
                    return {};
                }
            }
        }
    });

    $stateProvider.state('rover.financials.ccTransactions', {
        url: '/ccTransactions/:id',
        templateUrl: '/assets/partials/financials/ccTransactions/rvCcTransactions.html',
        controller: 'RVccTransactionsController'
    });

});