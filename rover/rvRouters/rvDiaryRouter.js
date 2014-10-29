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
                loadInitialData: function(rvDiarySrv, $stateParams) {
                    return rvDiarySrv.fetchInitialData(new Date('09/30/2014 12:00 AM'),
                                                       { arrival_date: 'start_date',
                                                         departure_date: 'end_date' });
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