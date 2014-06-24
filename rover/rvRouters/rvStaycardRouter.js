angular.module('stayCardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
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
            url: '/roomassignment/:reservation_id/:room_type',
            templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController'
        });
         $stateProvider.state('rover.staycard.upgrades', {
            url: '/upgrades/:reservation_id',
            templateUrl: '/assets/partials/upgrades/rvUpgrades.html',
            controller: 'RVUpgradesController'
        });
        
        $stateProvider.state('rover.staycard.billcard.details', {
            url: '/:billNo',
            templateUrl : "/assets/partials/bill_details.html",
            controller  : 'billDetailsController'
        });
        
        $stateProvider.state('rover.staycard.nights', {
            url: '/nights',
            templateUrl: '/assets/partials/nights/rvNights.html',
            controller: 'RVnightsController'
        });
});