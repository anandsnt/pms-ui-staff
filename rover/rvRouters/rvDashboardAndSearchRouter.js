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
        //IMPORTANT: 'rover.changeBussinesDate'  and 'rover.postCharge' both points to dashboard screen
        //They are added for extra popup actions(EOD and postcharge) on navigating from admin to rover.
        //All changes made here are required for those states too
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

        // adding extra states to be iniated when user is in admin screens
        $stateProvider.state('rover.changeBussinesDate', {
            url: '/changeBussinesDate',    
            templateUrl: '/assets/partials/dashboard/rvDashboardRoot.html',         
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv) {
                    return RVDashboardSrv.fetchDashboardDetails();
                }
            } ,
             onEnter: function (ngDialog) {
                ngDialog.open({
                  template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
                  controller: 'RVEndOfDayModalController'
                });
            }                                   
        });    

        $stateProvider.state('rover.postCharge', {
            url: '/postCharge',
            templateUrl: '/assets/partials/dashboard/rvDashboardRoot.html',         
            controller: 'RVdashboardController',
            resolve: {
                dashBoarddata: function(RVDashboardSrv) {
                    return RVDashboardSrv.fetchDashboardDetails();
                }
            } ,
             onEnter: function (ngDialog) {
                    ngDialog.open({
                    template: '/assets/partials/postCharge/outsidePostCharge.html',
                    controller: 'RVOutsidePostChargeController',
                    });
                }

                                                  
        });    
});