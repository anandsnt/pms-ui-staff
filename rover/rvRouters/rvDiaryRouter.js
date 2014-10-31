angular.module('diaryModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {
        $stateProvider.state('rover.diary', {
            abstract: true,
            url: '/diary',
            templateUrl: '/assets/partials/diary/dashboard.html',
            controller: 'RVDiaryAppCtrl'
        });

        $stateProvider.state('rover.diary.reservations', {
            url: '/reservations',
            templateUrl: '/assets/partials/diary/rvDiary.html',
            controller: 'RVDiaryCtrl',
            resolve: {
                payload: function(rvDiarySrv, $stateParams) {
                    return rvDiarySrv.fetchRoomTypes()
                    .then(rvDiarySrv.fetchArrivalTimes(15))   
                    .then(rvDiarySrv.fetchRooms())
                    .then(function() {
                        var cur_time = Date.now();

                        return rvDiarySrv.fetchOccupancy((new Date(cur_time)).addHours(-2), (new Date(cur_time)).addDays(1));
                    })
                    .then(function() {
                        rvDiarySrv.normalize();

                        return rvDiarSrv.rooms;
                    }); 

                    /*return rvDiarySrv.fetchArrivalTimes(15)
                           .then(rvDiarySrv.fetchRoomTypes()) 
                           .then(rvDiarySrv.fetchRooms)      */
                }
            }
        });

        /*$stateProvider.state('rover.diary.reservations.staycard', {
            url: '/reservations/staycard',
            templateUrl: '/assets/partials/reservation/rvMain.html',
            controller: 'RVDiaryMainCardCtrl',
            resolve: {
                loadInitialData: function(rvDiarySrv, $stateParams) {
                    return {};
                }
            }
        });

        $stateProvider.state('rover.diary.reservations.staycard.summary', {
            url: 'reservations/summary',
            templateUrl: '/assets/partials/reservation/rvAddonsList.html',
            controller: 'RVDiarySummaryCtrl',
            resolve: {
                loadInitialData: function(rvDiarySrv, $stateParams) {
                    return {};
                }
            }
        });*/
});