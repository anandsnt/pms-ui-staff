angular.module('overBookingModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    // define module-specific routes here
    $stateProvider.state('rover.overbooking', {
        url: '/overbooking',
        templateUrl: '/assets/partials/overBooking/rvOverBookingMain.html',
        controller: 'RvOverBookingMainCtrl',
        params: {
            start_date: null
        }
        resolve: {
            overBookingAssets: function(jsMappings) {
                return jsMappings.fetchAssets(['rover.overbooking', 'directives']);
            },
            completeRoomTypeListData: function(overBookingAssets, rvOverBookingSrv) {
                return rvOverBookingSrv.getAllRoomTypes();
            },
            overBookingGridData: function(overBookingAssets, rvOverBookingSrv, completeRoomTypeListData, $rootScope, $stateParams) {
                var startDate = '', DATE_SHIFT_LIMIT = 13;

                if (!!$stateParams.start_date) {
                    startDate = $stateParams.start_date;
                }
                else {
                    startDate = $rootScope.businessDate;
                }

                var params = {
                    'start_date': moment(tzIndependentDate(startDate))
                                .format('YYYY-MM-DD'),
                    'end_date': moment(tzIndependentDate(startDate)).add(DATE_SHIFT_LIMIT, 'd')
                                .format('YYYY-MM-DD'),
                    'show_rooms_left_to_sell': false,
                    'room_type_ids': _.pluck(completeRoomTypeListData.isCheckedTrue, 'id')
                };
                
                if ( !!rvOverBookingSrv) {
                    return rvOverBookingSrv.fetchOverBookingGridData(params);
                }
                else {
                    return {};
                }
            }
        }
    });
});