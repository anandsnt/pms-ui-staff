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
        	abstract : true,
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
		 $stateProvider.state('rover.staycard.reservationcard.all.reservationList', {
        	url: '',
			views : { 'reservationPayment' :{
				templateUrl : "partials/reservation_payment.html",
				 controller: 'reservationPaymentController'	
			}

			}
        });
		// view bill state
		$stateProvider.state('rover.staycard.billcard', {
			abstract : true,
			url: '/billcard',
			templateUrl: 'partials/billcard.html',
			controller: 'billcardController'
		});
		
	    $stateProvider.state('rover.staycard.billcard.all', {
        	url: '',
			views : {
				'billSummary' :{
					templateUrl : "partials/bill_summary.html",
					controller: 'billSummaryController'
				},
				'billTotalFees' :{	
					templateUrl : "partials/bill_total_fees.html",
					controller: 'billTotalFeesController'
				},
				'billSignature' :{
					templateUrl : "partials/bill_signature.html",
					controller: 'billSignatureController'
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