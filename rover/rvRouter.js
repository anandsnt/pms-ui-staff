sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// dashboard state
		$urlRouterProvider.otherwise('/staff/dashboard');

		$stateProvider.state('rover', {
			abstract: true,
			url: '/staff',
			templateUrl: '/assets/partials/rvRover.html',
			controller: 'roverController'
		});
		
		$stateProvider.state('rover.dashboard', {
			url: '/dashboard',
			templateUrl: '/assets/partials/dashboard/rvDashboard.html',
			controller: 'RVdashboardController',
			resolve: {
				dashBoarddata: function(RVDashboardSrv) {
					return RVDashboardSrv.fetchDashboardDetails();
				}
			}
		});

		// search state
		$stateProvider.state('rover.search', {
			url: '/search',
			templateUrl: '/assets/partials/search.html',
			controller: 'searchController'
		});	
		
		$stateProvider.state('rover.staycard', {
			abstract : true,
			url: '/staycard',
			templateUrl: '/assets/partials/rvStaycard.html',
            controller: 'staycardController'
        });


        $stateProvider.state('rover.staycard.reservationcard', {
        	abstract : true,
			url: '/reservationcard',
			templateUrl: '/assets/partials/reservationCard/reservation_card.html',
            controller: 'reservarionCardController'
        });

        $stateProvider.state('rover.staycard.reservationcard.reservationdetails', {
        	url: '/reservationdetails',
			templateUrl: '/assets/partials/reservationCard/reservation_details.html',
            controller: 'reservationDetailsController'
        }); 

                               
        $stateProvider.state('rover.staycard.billcard', {
			url: '/billcard',
			templateUrl: '/assets/partials/billcard.html',
            controller: 'billcardController'
        });
         $stateProvider.state('rover.staycard.roomassignment', {
			url: '/roomassignment',
			templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController'
        });
        
       	$stateProvider.state('rover.staycard.billcard.details', {
			url: '/:billNo',
			templateUrl : "/assets/partials/bill_details.html",
			controller	: 'billDetailsController'
        });
        
        // $stateProvider.state('rover.staycard.billcard.details', {
			// url: '/:billNo',
			// templateUrl : "/assets/partials/bill_details.html",
			// controller	: 'billDetailsController'
        // });
        
		// may be replaced with ng-include?
	    /*$stateProvider.state('rover.staycard.billcard.all', {
        	url: '',
			views : {
				'billDetails' :{
					templateUrl : "partials/bill_details.html",
					controller	: 'billDetailsController'

				}
			}
        });*/
        
		/*$stateProvider.state('guestcard', {
			url: '/guestcard',
			templateUrl: 'partials/guestcard.html',
			controller: 'guestCardController'
		});	*/

		// let's redirect all undefined states to dashboard state
		
	}
]);