angular
.module('diaryModule', [])
.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider.state('rover.diary', {
        url: '/diary/?reservation_id&checkin_date',
        templateUrl: '/assets/partials/diary/rvDiary.html',
        controller: 'rvDiaryCtrl',
        resolve: {
            diaryAssets: function(jsMappings, mappingList) {
                return jsMappings.fetchAssets(['react.files', 'rover.diary', 'directives'], ['react']);
            },
            propertyTime: function(RVReservationBaseSearchSrv, diaryAssets) {
                return RVReservationBaseSearchSrv.fetchCurrentTime();
            },
            baseSearchData: function(RVReservationBaseSearchSrv, diaryAssets) {
                return RVReservationBaseSearchSrv.fetchBaseSearchData();
            },
            payload: function($rootScope, rvDiarySrv, $stateParams, $vault, baseSearchData, propertyTime, diaryAssets) {
                var start_date = propertyTime.hotel_time.date;
                if($stateParams.checkin_date){
                    start_date = $stateParams.checkin_date;
                }
                return rvDiarySrv.load(rvDiarySrv.properDateTimeCreation(start_date), rvDiarySrv.ArrivalFromCreateReservation());
            }
        }
    });
    $stateProvider.state('rover.nightlyDiary', {
        url: '/nightlyDiary/?reservation_id&checkin_date',
        templateUrl: '/assets/partials/nightlyDiary/rvNightlyDiary.html',
        controller: 'rvNightlyDiaryController',
        resolve: {
            reactAssets: function(jsMappings, mappingList) {
                return jsMappings.fetchAssets(['react.files', 'directives'], ['react']);
            },
            reduxAssets: function(jsMappings, reactAssets) {
                return jsMappings.fetchAssets(['redux.files']);
            },
            diaryAssets: function(jsMappings, reduxAssets) {
                return jsMappings.fetchAssets(['rover.nightlyDiary']);
            }
        }
    });
});