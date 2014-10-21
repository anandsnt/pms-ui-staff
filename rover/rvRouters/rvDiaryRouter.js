angular.module('diaryModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {
        $stateProvider.state('rover.diary', {
            url: '/diary',
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

        $stateProvider.state('rover.diary.summary', {
            url: '/summary',
            templateUrl: '/assets/partials/reservation/rvAddonsList.html',
            controller: 'RVDiarySummaryCtrl',
            resolve: {
                loadInitialData: function(rvDiarySrv, $stateParams) {
                    return {};
                }
            }
        });
});