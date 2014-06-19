sntRover.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider) {
        
        $translateProvider.useStaticFilesLoader({
          prefix: '/assets/rvLocales/',
          suffix: '.json'
        });
        // default state
        $urlRouterProvider.otherwise('/');
		
		/*
		 * state added to show single url throughout the app
		 */
		$stateProvider.state('top', {
       
            url: '/',
            controller: 'topController',
    	});
    
        $stateProvider.state('rover', {
            abstract: true,
            url: '/staff',
            templateUrl: '/assets/partials/rvRover.html',
            controller: 'roverController',
            resolve: {
                hotelDetails: function(RVHotelDetailsSrv) {
                    return RVHotelDetailsSrv.fetchHotelDetails();
                },
                userInfoDetails: function(RVDashboardSrv) {
                    return RVDashboardSrv.fetchUserInfo();
                }
            }
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
			 url: '/billcard/:reservationId',
			 templateUrl: '/assets/partials/bill/rvBillCard.html',
             controller: 'RVbillCardController',
	         resolve: {
				reservationBillData: function(RVBillCardSrv, $stateParams) {
					return RVBillCardSrv.fetch($stateParams.reservationId);
				}
			}
        });
        
         $stateProvider.state('rover.staycard.roomassignment', {
            url: '/roomassignment',
            templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController'
        });

        //Change stay dates
        $stateProvider.state('rover.staycard.changestaydates', {
            url: '/changestaydates/:reservationId',
            templateUrl: '/assets/partials/staycard/rvChangeStayDates.html',
            controller: 'RVchangeStayDatesController',
            resolve: {
                stayDateDetails: function(RVChangeStayDatesSrv, $stateParams) {
                    return RVChangeStayDatesSrv.fetchInitialData($stateParams.reservationId);
                }
            }
        });         
        
        $stateProvider.state('rover.staycard.billcard.details', {
            url: '/:billNo',
            templateUrl : "/assets/partials/bill_details.html",
            controller  : 'billDetailsController'
        });

        $stateProvider.state('rover.ratemanager', {
            url: '/rateManager',
            templateUrl: '/assets/partials/rateManager/dashboard.html',
            controller  : 'RMDashboradCtrl'
        });
        
        $stateProvider.state('rover.staycard.nights', {
            url: '/nights',
            templateUrl: '/assets/partials/nights/rvNights.html',
            controller: 'RVnightsController'
        });

        // Reservation state actions - START
        
        $stateProvider.state('rover.reservation', {
            abstract : true,
            url: '/reservation',
            templateUrl: '/assets/partials/reservation/rvMain.html',
            controller: 'RVReservationMainCtrl',
            resolve: {
                baseData: function(RVReservationSummarySrv){
                    return RVReservationSummarySrv.fetchInitialData();
                }
            }
        });

        $stateProvider.state('rover.reservation.search', {
            url: '/search',
            templateUrl: '/assets/partials/reservation/rvBaseSearch.html',
            controller: 'RVReservationBaseSearchCtrl',
            resolve: {
                baseSearchData: function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchBaseSearchData();
                }
            }
        });


    }
]);