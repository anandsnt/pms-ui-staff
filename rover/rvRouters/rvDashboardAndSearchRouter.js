angular.module('dashboardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){

        $stateProvider.state('rover.search', {
            url: '/search/:type/:from_page/:useCache',
            templateUrl: '/assets/partials/search/rvSearchReservation.html',
            controller: 'rvReservationSearchController',
            resolve: {
                searchResultdata: function(RVSearchSrv, $stateParams, mappingList) {
                    var oldType = "";
                    var dataDict = {};
                    oldType = $stateParams.type;

                    if( oldType !== null && oldType!== '' && oldType !=="RESET") {
                        if(oldType === "LATE_CHECKOUT"){
                            dataDict.is_late_checkout_only = true;
                        } else if(oldType === "QUEUED_ROOMS"){
                        	dataDict.is_queued_rooms_only = true;
                        }
                        else if(oldType === "VIP"){
                            dataDict.vip = true;
                        }
                        else{
                            dataDict.status = oldType;
                        }
                        //The pagination should be set to page=1. for navigations from dashboard buttons.
                        if($stateParams.from_page === "DASHBOARD"){
                            RVSearchSrv.page = 1;
                        }
                        //calling the webservice
                        return RVSearchSrv.fetch(dataDict, $stateParams.useCache);
                    } else if ( !!$stateParams.useCache && oldType !=="RESET") {
                        return RVSearchSrv.fetch({}, $stateParams.useCache);
                    } else {
                        var results = [];
                        return results;
                    }
                }
            }
        });
        /**
        * IMPORTANT: 'rover.dashboardFromAdmin' state points to dashboard screen
        * It is needed for opening sub-menu popup actions('EOD' and 'postcharge') on navigating from admin to rover.
        * All future changes made in 'rover.dashboard' state are required for that state too
        **/
        $stateProvider.state('rover.dashboard', {
            url: '/dashboard',
            templateUrl: '/assets/partials/dashboard/rvDashboardRoot.html',
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv, mappingList) {
                    return RVDashboardSrv.fetchDashboardDetails();
                },
                roomTypes : function(RVHkRoomStatusSrv) {
                    return RVHkRoomStatusSrv.fetchRoomTypes();
                }
            }
        });
        $stateProvider.state('rover.dashboard.manager', {
            url: '/manager',
            templateUrl: '/assets/partials/dashboard/rvManagerDashboard.html',
            controller: 'RVmanagerDashboardController'
        });
        $stateProvider.state('rover.dashboard.frontoffice', {
            url: '/frontoffice',
            templateUrl: '/assets/partials/dashboard/rvFrontDeskDashboard.html',
            controller: 'RVfrontDeskDashboardController'
        });
        $stateProvider.state('rover.dashboard.housekeeping', {
            url: '/housekeeping',  //TODO: check can we reduced it to hk?
            templateUrl: '/assets/partials/dashboard/rvHouseKeepingDashboard.html',
            controller: 'RVhouseKeepingDashboardController'
        });

        /**
        * adding extra state to be initiated when user is in admin screens
        **/
        $stateProvider.state('rover.dashboardFromAdmin', {
            url: '/dashboard/:type',
            templateUrl: '/assets/partials/dashboard/rvDashboardRoot.html',
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv, mappingList) {
                    return RVDashboardSrv.fetchDashboardDetails();
                },
                roomTypes : function(RVHkRoomStatusSrv, mappingList) {
                    return RVHkRoomStatusSrv.fetchRoomTypes();
                }
            } ,
             onEnter: function (ngDialog,$stateParams, mappingList, dashBoarddata, jsMappings) {

               if($stateParams.type === 'changeBussinessDate'){
                    jsMappings.fetchAssets(['endofday']).then(function(){
                        ngDialog.open({
                            template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
                            controller: 'RVEndOfDayModalController'
                        });
                    });
               }
               else if($stateParams.type === 'postCharge'){
                    jsMappings.fetchAssets(['postcharge', 'directives']).then(function(){
                        ngDialog.open({
                            template: '/assets/partials/postCharge/rvPostChargeV2.html',
                            controller: 'RVOutsidePostChargeController'
                        });
                    });
               }

            }
        });
});