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
        templateUrl: '/assets/partials/financials/rvJournal.html',
        controller: 'RVJournalController'
    });

});