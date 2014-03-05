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

        $stateProvider.state('rover.staycard.reservationcard', {
        	abstract : true,
			url: '/reservationcard',
			templateUrl: 'partials/reservation_card.html',
            controller: 'reservarionCardController'
        });

        $stateProvider.state('rover.staycard.reservationcard.all', {
        	url: '',
			views : { 'reservationList' :{
				templateUrl : "partials/reservation_listing.html",
				 controller: 'reservationListController'	
			},
			'reservationDetails' :{
				templateUrl : "partials/reservation_details.html",
				 controller: 'reservationDetailsController'	

			},

			}
        });

		
		// view bill state
		$stateProvider.state('rover.staycard.billcard', {
			abstract : true,
			url: '/billcard',
			templateUrl: 'partials/viewbill.html',
			controller: 'viewbillController'
		});
		
	    $stateProvider.state('rover.staycard.billcard.all', {
        	url: '',
			views : {
				'billcardDetails' :{
					templateUrl : "partials/billcard_details.html",
					 controller: 'billcardDetailsController'	
				},
				'signaturePanel' :{
					templateUrl : "partials/signature.html",
					 controller: 'signaturePanelController'	
				},
			}
        });
        
		$stateProvider.state('guestcard', {
			url: '/guestcard',
			templateUrl: 'partials/guestcard.html',
			controller: 'guestCardController'
		});	

		// let's redirect all undefined states to dashboard state
		
	}
]);