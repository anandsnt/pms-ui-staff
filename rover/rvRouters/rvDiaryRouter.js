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
            payload: function($rootScope, rvDiarySrv, $stateParams, $vault, baseSearchData, propertyTime) {
                var start_date = propertyTime.hotel_time.date;

                if ($stateParams.checkin_date) {
                    start_date = $stateParams.checkin_date;
                }
                return rvDiarySrv.load(rvDiarySrv.properDateTimeCreation(start_date), rvDiarySrv.ArrivalFromCreateReservation());
            }
        },
        lazyLoad: function ($transition$) {
            return $transition$.injector().get('jsMappings')
                .fetchAssets(['react.files', 'rover.diary', 'directives'], ['react']);
        }
    });

    $stateProvider.state('rover.nightlyDiary', {
        url: '/nightlyDiary/?reservation_id&start_date&origin',
        templateUrl: '/assets/partials/nightlyDiary/rvNightlyDiary.html',
        controller: 'rvNightlyDiaryMainController',
        resolve: {
            roomsList: function(RVNightlyDiarySrv, $rootScope, $stateParams) {
                var params = {};

                if ($stateParams.origin === 'STAYCARD') {
                    params = RVNightlyDiarySrv.getCache();
                }
                else {
                    params.page = 1;
                    params.per_page = 50;
                }
                return RVNightlyDiarySrv.fetchRoomsList(params);
            },
            datesList: function(RVNightlyDiarySrv, $rootScope, $stateParams) {
                var params = {};

                if ($stateParams.origin === 'STAYCARD') {
                    params = RVNightlyDiarySrv.getCache();
                }
                else {
                    if (!!$stateParams.start_date) {
                        params.start_date = $stateParams.start_date;
                    }
                    else {
                        params.start_date = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
                            .format($rootScope.momentFormatForAPI);
                    }
                    params.no_of_days = 7;
                }
                return RVNightlyDiarySrv.fetchDatesList(params);
            },
            reservationsList: function(RVNightlyDiarySrv, $rootScope, $stateParams) {
                var params = {};

                if ($stateParams.origin === 'STAYCARD') {
                    params = RVNightlyDiarySrv.getCache();
                }
                else {
                    params.start_date = $stateParams.start_date || moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
                        .format($rootScope.momentFormatForAPI);
                    params.no_of_days = 7;
                    params.page = 1;
                    params.per_page = 50;
                }
                return RVNightlyDiarySrv.fetchReservationsList(params);
            },
            unassignedReservationList: function(RVNightlyDiarySrv, $rootScope, $stateParams) {
                var params = {};

                if ($stateParams.origin === 'STAYCARD') {
                    params = RVNightlyDiarySrv.getCache();
                }
                else {
                    if (!!$stateParams.start_date) {
                        params.start_date = $stateParams.start_date;
                    }
                    else {
                        params.start_date = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
                            .format($rootScope.momentFormatForAPI);
                    }
                    params.no_of_days = 7;
                    params.businessDate = $rootScope.businessDate;
                }
                return RVNightlyDiarySrv.fetchUnassignedRoomList(params);
            }
        },
        lazyLoad: function($transition$) {
            return $transition$.injector().get('jsMappings')
                .fetchAssets(['react.files', 'redux.files', 'rover.nightlyDiary', 'directives'], ['react']);
        }
    });
});
