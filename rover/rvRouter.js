sntRover.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$translateProvider',
	function($stateProvider, $urlRouterProvider, $translateProvider) {
		
		$translateProvider.useStaticFilesLoader({
		  prefix: '/assets/messages/',
		  suffix: '.json'
		});
		//$translateProvider.preferredLanguage('en');
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
			url: '/search/:type',
			templateUrl: '/assets/partials/search/search.html',
			controller: 'searchController'
		});	

		//company card search
		$stateProvider.state('rover.companycardsearch', {
			url: '/cardsearch',
			templateUrl: '/assets/partials/search/rvSearchCompanyCard.html',
			controller: 'searchCompanyCardController'
		});	

		//company card details
		$stateProvider.state('rover.companycarddetails', {
			url: '/companycard/:type/:id/:firstname',
			templateUrl: '/assets/partials/companyCard/rvCompanyCardDetails.html',
			controller: 'companyCardDetailsController'
		});		

		$stateProvider.state('rover.staycard', {
			abstract : true,
			url: '/staycard',
			templateUrl: '/assets/partials/staycard/rvStaycard.html',
            controller: 'staycardController'
        });


        $stateProvider.state('rover.staycard.reservationcard', {
        	abstract : true,
			url: '/reservationcard',
			templateUrl: '/assets/partials/reservationCard/rvReservationCard.html',
            controller: 'reservationCardController'
        });

        $stateProvider.state('rover.staycard.reservationcard.reservationdetails', {
        	url: '/reservationdetails/:id/:confirmationId',
			templateUrl: '/assets/partials/reservationCard/rvReservationDetails.html',
            controller: 'reservationDetailsController',
            resolve: {
				reservationListData: function(RVReservationCardSrv, $stateParams) {
					
					return RVReservationCardSrv.fetch($stateParams.id);
				},
				reservationDetails:function(RVReservationCardSrv, $stateParams) {
					
					return RVReservationCardSrv.fetchReservationDetails($stateParams.confirmationId);
				}
			}
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

        $stateProvider.state('rover.ratemanager', {
        	url: '/rateManager',
        	templateUrl: '/assets/partials/rateManager/dashboard.html',
        	controller	: 'RMDashboradCtrl'
		});
		
        $stateProvider.state('rover.staycard.nights', {
			url: '/nights',
			templateUrl: '/assets/partials/nights/rvNights.html',
            controller: 'RVnightsController'
        });
        
		// let's redirect all undefined states to dashboard state
		
	}
]);