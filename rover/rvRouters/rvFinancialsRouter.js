angular.module('FinancialsModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

    $stateProvider.state('rover.financials', {
        abstract: true,
        url: '/financials',
        templateUrl: '/assets/partials/financials/rvFinancials.html',
        controller: 'RVFinancialsController',
        resolve: {
            jsAssets: function(jsMappings) {
                return jsMappings.fetchAssets(['rover.financials', 'directives']);
            }
        }
    });

    $stateProvider.state('rover.financials.journal', {
        url: '/journal/:id',
        templateUrl: '/assets/partials/financials/journal/rvJournal.html',
        controller: 'RVJournalController',
        resolve: {
            journalResponse: function(RVJournalSrv, jsAssets) {
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

    $stateProvider.state('rover.financials.accountsReceivables', {
        url: '/accountsReceivables',
        templateUrl: '/assets/partials/financials/accountsReceivables/rvAccountsReceivables.html',
        controller: 'RVAccountsReceivablesController'
    });
    $stateProvider.state('rover.financials.commisions', {
        url: '/commissionSummary',
        templateUrl: '/assets/partials/financials/commissions/rvCommissionsSummary.html',
        controller: 'RVCommissionsSummaryController',
        resolve: {
            businessDate: function(RVCommissionsSrv, jsAssets) {
                    return RVCommissionsSrv.fetchHotelBusinessDate();
            }
        }
    });
    $stateProvider.state('rover.financials.invoiceSearch', {
        url: '/invoiceSearch',
        templateUrl: '/assets/partials/financials/invoiceSearch/rvInvoiceSearch.html',
        controller: 'RVInvoiceSearchController'
    });
    $stateProvider.state('rover.financials.autoCharge', {
        url: '/autoCharge',
        templateUrl: '/assets/partials/financials/autocharge/rvAutoCharge.html',
        controller: 'RVAutoChargeController'
    });
});
