
sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	
	$stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/common_templates/partials/MGM/Delano/gwCheckoutfinal.html',
		title: 'Status - Check-out Now'
   	 })
}]);