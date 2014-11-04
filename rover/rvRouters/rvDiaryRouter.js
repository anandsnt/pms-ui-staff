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
                payload: function(rvDiarySrv, rvDiaryFilterSrv, $stateParams) {
                    var cur_time = Date.now(),
                        x_0 = new Date(cur_time - 7200000),
                        x_N = new Date(cur_time + 86400000);

                    return rvDiaryFilterSrv.fetchArrivalTimes(x_0.toComponents().time, 15)   
                    .then(function() {
                        return rvDiarySrv.fetchOccupancy(x_0, x_N);
                    })
                    .then(function(data) {
                        return { 
                            start_date: rvDiarySrv.start_date,
                            data: rvDiarySrv.rooms,
                            arrival_times: rvDiaryFilterSrv.arrival_times,
                            room_types: rvDiarySrv.room_types
                        };
                    });
                }
            }
        });

        $stateProvider.state('rover.diary.reservations.staycard', {
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
        });
});