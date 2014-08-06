angular.module('dashboardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
     /*$stateProvider.state('rover.dashboard', {
            url: '/dashboard',
            templateUrl: '/assets/partials/dashboard/rvDashboard.html',
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv) {
                    return RVDashboardSrv.fetchDashboardDetails();
                }
            }
        });  
        
        $stateProvider.state('rover.search', {
            url: '/search/:type',
            templateUrl: '/assets/partials/search/search.html',
            controller: 'searchController',
            resolve: {
                searchResultdata: function(RVSearchSrv, $stateParams) {
                	var oldType = "";
                	var dataDict = {};
                	oldType = $stateParams.type;
                	if( oldType != null && oldType!= '' ) {
	                	if(oldType == "LATE_CHECKOUT"){
				        	dataDict.is_late_checkout_only = true;
				        }
				        else{
				      		dataDict.status = oldType;
				        }
	         			//calling the webservice
	                    return RVSearchSrv.fetch(dataDict, $stateParams.useCache);
	                } else if ( !!$stateParams.useCache ) {
                		return RVSearchSrv.fetch({}, $stateParams.useCache);
	                } else {
                        console.log( 'to check in server' );
                        var results = [];
                        return results;
                    }
                }
            }
        }); */
        $stateProvider.state('rover.search', {
            url: '/search/:type',
            templateUrl: '/assets/partials/search/rvSearchReservation.html', 
            controller: 'rvReservationSearchController',
            resolve: {
                searchResultdata: function(RVSearchSrv, $stateParams) {
                    var oldType = "";
                    var dataDict = {};
                    oldType = $stateParams.type;
                    if( oldType != null && oldType!= '' ) {
                        if(oldType == "LATE_CHECKOUT"){
                            dataDict.is_late_checkout_only = true;
                        }
                        else if(oldType == "VIP"){
                            dataDict.vip = true;
                        }
                        else{
                            dataDict.status = oldType;
                        }
                        //calling the webservice
                        return RVSearchSrv.fetch(dataDict, $stateParams.useCache);
                    } else if ( !!$stateParams.useCache ) {
                        return RVSearchSrv.fetch({}, $stateParams.useCache);
                    } else {
                        console.log( 'to check in server' );
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
            url: '/dashboard/manager',
            templateUrl: '/assets/partials/dashboard/rvManagerDashboard.html',
            controller: 'RVmanagerDashboardController',                       
        });
        $stateProvider.state('rover.dashboard.frontoffice', {
            url: '/dashboard/frontoffice',
            templateUrl: '/assets/partials/dashboard/rvFrontDeskDashboard.html',
            controller: 'RVfrontDeskDashboardController',                       
        }); 
        $stateProvider.state('rover.dashboard.housekeeping', {
            url: '/dashboard/housekeeping',  //TODO: check can we reduced it to hk?
            templateUrl: '/assets/partials/dashboard/rvHouseKeepingDashboard.html',
            controller: 'RVhouseKeepingDashboardController',                       
        });           
});