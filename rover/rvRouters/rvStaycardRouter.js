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
            url: '/reservationdetails/:id/:confirmationId/:isrefresh',
            templateUrl: '/assets/partials/reservationCard/rvReservationDetails.html',
            controller: 'reservationDetailsController',
            resolve: {
                reservationListData: function(RVReservationCardSrv, $stateParams) {
                    
                    return RVReservationCardSrv.fetch($stateParams.id);
                },
                reservationDetails:function(RVReservationCardSrv, $stateParams) {
                     var data = {
				 		  	"confirmationNumber": $stateParams.confirmationId,
				 		  	"isRefresh": $stateParams.isrefresh
				 		  }; 
                    return RVReservationCardSrv.fetchReservationDetails(data);
                }
            }
        }); 

                               
        $stateProvider.state('rover.staycard.billcard', {
			 url: '/billcard/:reservationId/:clickedButton',
			 templateUrl: '/assets/partials/bill/rvBillCard.html',
             controller: 'RVbillCardController',
	         resolve: {
				reservationBillData: function(RVBillCardSrv, $stateParams) {
					return RVBillCardSrv.fetch($stateParams.reservationId);
				}
			}
        });
         $stateProvider.state('rover.staycard.roomassignment', {
            url: '/roomassignment/:reservation_id/:room_type/:clickedButton',
            templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController',
            resolve: {
                roomsList: function(RVRoomAssignmentSrv, $stateParams) {
                    
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    params.room_type = $stateParams.room_type;
                    return RVRoomAssignmentSrv.getRooms(params);
                },
                roomPreferences:function(RVRoomAssignmentSrv, $stateParams) {
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    return RVRoomAssignmentSrv.getPreferences(params);
                },
                roomUpgrades:function(RVUpgradesSrv, $stateParams) {
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    return RVUpgradesSrv.getAllUpgrades(params);
                }
            }
        });
         $stateProvider.state('rover.staycard.upgrades', {
            url: '/upgrades/:reservation_id/:clickedButton',
            templateUrl: '/assets/partials/upgrades/rvUpgrades.html',
            controller: 'RVUpgradesController'
        });

        //Change stay dates
        $stateProvider.state('rover.staycard.changestaydates', {
            url: '/changestaydates/:reservationId',
            templateUrl: '/assets/partials/changeStayDates/rvChangeStayDates.html',
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
});