angular.module('overBookingModule', []).config(function($stateProvider) {
    // define module-specific routes here
    $stateProvider.state('rover.overbooking', {
        url: '/overbooking',
        templateUrl: '/assets/partials/overBooking/rvOverBookingMain.html',
        controller: 'RvOverBookingMainCtrl',
        resolve: {
            overBookingAssets: function(jsMappings) {
                return jsMappings.fetchAssets(['rover.overbooking', 'directives']);
            },
            completeRoomTypeListData: function(overBookingAssets, rvOverBookingSrv) {
                return rvOverBookingSrv.getAllRoomTypes();
            },
            overBookingGridData: function(overBookingAssets, rvOverBookingSrv, completeRoomTypeListData, $rootScope) {
                var params = {
                    'start_date': moment(tzIndependentDate($rootScope.businessDate))
                                .format($rootScope.momentFormatForAPI),
                    'end_date': moment(tzIndependentDate($rootScope.businessDate)).add(13, 'd')
                                .format($rootScope.momentFormatForAPI),
                    'show_rooms_left_to_sell': true,
                    'room_type_ids': []
                };
                
                params.room_type_ids = _.pluck(completeRoomTypeListData, 'id');
                
                return rvOverBookingSrv.fetchOverBookingGridData(params);
            }
        }
    });
});