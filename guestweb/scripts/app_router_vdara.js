
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
	$stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/partials/mgm_chain/Vdara/gwCheckoutfinal.html',
		title: 'Status - Check-out Now'
   	 })
}]);