sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	
	$stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
       	controller: 'checkOutStatusController',
       	templateUrl: '/assets/common_templates/partials/MGM/Excalibur/gwCheckoutfinal.html',
		title: 'Status - Check-out Now'
   	 }).state('checkOutLaterSuccess', {
		url: '/checkOutLaterOptions/:id',
		templateUrl: '/assets/common_templates/partials/MGM/Excalibur/gwLateCheckoutfinal.html',
		controller: 'checkOutLaterSuccessController',
		title: 'Status - Check-out Later'
	 });
}]);



