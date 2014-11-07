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
        /**
        * IMPORTANT: 'rover.dashboardFromAdmin' state points to dashboard screen
        * It is needed for open sub-menu popup actions('EOD' and 'postcharge') on navigating from admin to rover.
        * All future changes made in 'rover.dashboard' state are required for that state too
        **/
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

        /**
        * adding extra state to be iniated when user is in admin screens
        **/
        $stateProvider.state('rover.dashboardFromAdmin', {
            url: '/dashboard/:type',    
            templateUrl: '/assets/partials/dashboard/rvDashboardRoot.html',         
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv) {
                    return RVDashboardSrv.fetchDashboardDetails();
                }
            } ,
             onEnter: function (ngDialog,$stateParams) {

               if($stateParams.type === 'changeBussinessDate'){
                    ngDialog.open({
                        template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
                        controller: 'RVEndOfDayModalController'
                    });
               }
               else if($stateParams.type === 'postCharge'){
                     ngDialog.open({
                        template: '/assets/partials/postCharge/outsidePostCharge.html',
                        controller: 'RVOutsidePostChargeController',
                    });
               }    

            }                                   
        });    
});