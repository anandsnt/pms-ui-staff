sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/staff/dashboard');

		$stateProvider.state('rover', {
			url: '/staff',
			templateUrl: 'partials/rover.html',
			controller: 'roverController'
		});
		
		$stateProvider.state('rover.dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html'
		});

		// search state
		$stateProvider.state('rover.search', {
			url: '/search',
			templateUrl: 'partials/search.html',
			controller: 'searchController'
		});	
		
		$stateProvider.state('rover.staycard', {
			url: '/staycard',
			views: {	
					'': {
                    templateUrl: 'partials/staycard.html',
                    controller: 'staycardController'
                	},
	                'reservation_card':{
	                    templateUrl: 'partials/reservation_card.html',
	                    controller: 'reservarionCardController'	                	
	                },
	                'reservation_listing':{
	                    templateUrl: 'partials/reservation_listing.html',
	                    controller: 'reservationListController'	                	
	                }	              
			}
		});
		// let's redirect all undefined states to dashboard state
		
	}
]);