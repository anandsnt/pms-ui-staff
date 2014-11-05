angular.module('dashboardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){

        $stateProvider.state('rover.search', {
            url: '/search/:type',
            templateUrl: '/assets/partials/search/rvSearchReservation.html', 
            controller: 'rvReservationSearchController',
            resolve: {
                searchResultdata: function(RVSearchSrv, $stateParams) {
                    var oldType = "";
                    var dataDict = {};
                    oldType = $stateParams.type;
                    if( oldType != null && oldType!= '' && oldType !="RESET") {
                        if(oldType == "LATE_CHECKOUT"){
                            dataDict.is_late_checkout_only = true;
                        } else if(oldType == "QUEUED_ROOMS"){
                        	dataDict.is_queued_rooms_only = true;
                        }
                        else if(oldType == "VIP"){
                            dataDict.vip = true;
                        }
                        else{
                            dataDict.status = oldType;
                        }
                        //calling the webservice
                        RVSearchSrv.page = 1;
                        return RVSearchSrv.fetch(dataDict, $stateParams.useCache);
                    } else if ( !!$stateParams.useCache && oldType !="RESET") {
                        return RVSearchSrv.fetch({}, $stateParams.useCache);
                    } else {
                        var results = [];
                        return results;
                    }
                }
            }                      
        });
        $stateProvider.state('rover.dashboard', {
            url: '/dashboard',   
            templateUrl: '/assets/partials/dashboard/rvDashboardRoot.html',         
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv) {
                    return RVDashboardSrv.fetchDashboardDetails();
                }
            }          
        });
        $stateProvider.state('rover.dashboard.manager', {
            url: '/manager',
            templateUrl: '/assets/partials/dashboard/rvManagerDashboard.html',
            controller: 'RVmanagerDashboardController',                       
        });
        $stateProvider.state('rover.dashboard.frontoffice', {
            url: '/frontoffice',
            templateUrl: '/assets/partials/dashboard/rvFrontDeskDashboard.html',
            controller: 'RVfrontDeskDashboardController',                       
        }); 
        $stateProvider.state('rover.dashboard.housekeeping', {
            url: '/housekeeping',  //TODO: check can we reduced it to hk?
            templateUrl: '/assets/partials/dashboard/rvHouseKeepingDashboard.html',
            controller: 'RVhouseKeepingDashboardController',                       
        });           
});