
sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
	$stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/partials/mgm_chain/Bellagio/gwCheckoutfinal.html',
		title: 'Status - Check-out Now'
   	 })
}]);