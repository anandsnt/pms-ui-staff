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
                /*payload: function(rvDiarySrv, $stateParams) {
                    return rvDiarySrv.fetchOccupancy(new Date(), (new Date()).addDays(2)); //fetchInitialData(Date.now());
                },*/
                arrivalTimes: function(rvDiaryFilterSrv, $stateParams) {
                    return rvDiaryFilterSrv.fetchArrivalTimes(15);
                },
                roomTypes: function(rvDiaryFilterSrv, $stateParams) {
                    return rvDiaryFilterSrv.fetchRoomTypes();
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