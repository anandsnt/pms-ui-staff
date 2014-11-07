angular.module('diaryModule', []).
config(
    function($stateProvider, $urlRouterProvider, $translateProvider) {
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
                        x_N = new Date(cur_time + 86400000),
                        at;

                    return rvDiaryFilterSrv.fetchArrivalTimes(15) //x_0.toComponents().time, 15) 
                    .then(function(data) {
                        at = data;

                        return rvDiaryFilterSrv.fetchRates();
                    })  
                    .then(function(data) {
                        return rvDiarySrv.init(x_0, x_N);
                    })
                    .then(function(data) {
                        console.log(data);

                        data.arrival_times = at;

                        rvDiarySrv.set('rooms',      data.rooms);         
                        rvDiarySrv.set('room_types', data.room_types);
                        rvDiarySrv.set('occupancy',  data.occupancy);
                        rvDiarySrv.set('start_date', data.start_date);
                        rvDiarySrv.set('arrival_times', data.arrival_times);
                        rvDiarySrv.set('availability', data.availability);

                        return data;
                    });
                }
            }
        });

        $stateProvider.state('rover.diary.reservations.companycardsearch', {
            url: '/reservations/cardsearch/:textInQueryBox',
            templateUrl: '/assets/partials/search/rvSearchCompanyCard.html',
            controller: 'searchCompanyCardController'
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