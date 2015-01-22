angular
.module('diaryModule', [])
.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
	$stateProvider.state('rover.diary', {
            url: '/diary/?reservation_id&checkin_date',
            templateUrl: '/assets/partials/diary/rvDiary.html',
            controller: 'rvDiaryCtrl',
            resolve: {
                propertyTime: function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchCurrentTime();
                },
                baseSearchData: function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchBaseSearchData();
                },
                payload: function($rootScope, rvDiarySrv, $stateParams, $vault, baseSearchData) {
                    var start_date = baseSearchData.businessDate;
                    if($stateParams.checkin_date){
                        start_date = $stateParams.checkin_date;
                    }
                    return rvDiarySrv.load(rvDiarySrv.properDateTimeCreation(start_date), rvDiarySrv.ArrivalFromCreateReservation());
                }
            }
    });
});