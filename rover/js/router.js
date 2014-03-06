sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/staff/dashboard');

		$stateProvider.state('rover', {
			abstract: true,
			url: '/staff',
			templateUrl: 'partials/rover.html',
			controller: 'roverController'
		});
		
		$stateProvider.state('rover.dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html',
			controller: 'dashboardController'
		});

		// search state
		$stateProvider.state('rover.search', {
			url: '/search',
			templateUrl: 'partials/search.html',
			controller: 'searchController'
		});	
		
		$stateProvider.state('rover.staycard', {
			abstract : true,
			url: '/staycard',
			templateUrl: 'partials/staycard.html',
            controller: 'staycardController'
        });

        $stateProvider.state('rover.staycard.billcard', {
			url: '/viewbill',
			templateUrl: 'partials/viewbill.html',
            controller: 'viewbillController'
        });

        $stateProvider.state('rover.staycard.reservationcard', {
        	abstract : true,
			url: '/reservationcard',
			templateUrl: 'partials/reservation_card.html',
            controller: 'reservarionCardController'
        });

        $stateProvider.state('rover.staycard.reservationcard.reservationdetails', {
        	url: '/reservationdetails',
			templateUrl: 'partials/reservation_details.html',
            controller: 'reservationDetailsController'
        });                        

       /* $stateProvider.state('rover.staycard.reservationcard.all', {
        	url: '',
			views : { 
				'reservationList' :{
					templateUrl : "partials/reservation_listing.html",
				 	controller: 'reservationListController'	
				},
				'reservationDetails' :{
					templateUrl : "partials/reservation_details.html",
					controller: 'reservationDetailsController'	

				},

			}
        });

        $stateProvider.state('rover.staycard.reservationcard.all.selectedReservation', {
			url: '/:selected_reservation',
            controller: function($scope, )
        });*/
		// search state
		/*$stateProvider.state('rover.staycard.viewbill', {
			url: '/viewbill',
			templateUrl: 'partials/viewbill.html',
			controller: 'viewbillController'
		});
	
		$stateProvider.state('guestcard', {
			url: '/guestcard',
			templateUrl: 'partials/guestcard.html',
			controller: 'guestCardController'
		});	*/

		// let's redirect all undefined states to dashboard state
		
	}
]);