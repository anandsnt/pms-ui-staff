angular.module('overBookingModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    // define module-specific routes here
    $stateProvider.state('rover.overbooking', {
        url: '/overbooking',
        templateUrl: '/assets/partials/overBooking/rvOverBookingMain.html',
        controller: 'RvOverBookingMainCtrl',
        resolve: {
            overBookingAssets: function(jsMappings) {
                return jsMappings.fetchAssets(['rover.overbooking', 'directives']);
            },
            overBookingGridData: function(overBookingAssets, rvOverBookingSrv, $rootScope) {
                var params = {
                    'start_date': moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
                    'end_date': moment(tzIndependentDate($rootScope.businessDate)).day(14).format($rootScope.momentFormatForAPI),
                    'show_rooms_left_to_sell': false,
                    'room_type_ids': []
                };

                return rvOverBookingSrv.fetchOverBookingGridData(params);
            },
            completeRoomTypeListData: function(overBookingAssets, rvOverBookingSrv) {
                return rvOverBookingSrv.getAllRoomTypes();
            }
        }
    });
});