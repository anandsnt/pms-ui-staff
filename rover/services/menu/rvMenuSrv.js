sntRover.service('rvMenuSrv',
	['rvPermissionSrv', 
	function(rvPermissionSrv) {
	
	/**
	* method to return default dashboard state for rover
	* @param {string}, dashboard
	* @return {string}, corresponding state
	*/
	var getDefaultDashboardState = function(default_dashboard) {
		var statesForDashbaord = {
			'HOUSEKEEPING': 'rover.dashboard.housekeeping',
			'FRONT_DESK': 'rover.dashboard.frontoffice',
			'MANAGER': 'rover.dashboard.manager'
		};
		return statesForDashbaord[default_dashboard];
    };

    /**
    * utility function to decide whether dashboard is front desk
    * @param {string}, dashboard
	* @return {boolean}
    */
    var isFrontDeskDashboard = function (dashboard){
    	return dashboard === 'FRONT_DESK';
    };
	
	/**
	* utility the user role is 'Floor & Maintanance staff'	
    * @param {string}, user role
	* @return {boolean}	
	*/
    var isFloorMaintananceStaff= function (userRole){
    	return (userRole === "Floor & Maintenance Staff");
    };

	/**
	* method to get menu for rover
	* @param {object}, contains the different value/function to decide the enabling/disabling of a menu item
	* as well as different actions
	*/
	this.getMainMenuForStandAloneRover = function(options) {
		var defaultDashboard 		= options['defaultDashboard'],
		 	defaultDashboardState 	= getDefaultDashboardState (defaultDashboard),
			isHourlyRateOn 			= options['isHourlyRateOn'],
			isAutoChangeBussinessDate = options['isAutoChangeBussinessDate'],
			menuFrontDeskIndex 		= -1,
			eodSubMenu 				= {
	                title: "MENU_END_OF_DAY",
	                action: "",
	                actionPopup: true,
	                menuIndex: "endOfDay"
            };


		var menu = [{
		        title: "MENU_DASHBOARD",
		        action: defaultDashboardState,
		        menuIndex: "dashboard",
		        submenu: [],
		        iconClass: "icon-dashboard"
		    }, {
		        title: "MENU_FRONT_DESK",
		        //hidden: true,
		        action: "",		        
		        iconClass: "icon-frontdesk",
		        menuIndex: "front_desk",
		        submenu: [{
		            title: "MENU_SEARCH_RESERVATIONS",
		            action: "rover.search",
		            menuIndex: "search"
		        }, {
		            title: "MENU_CREATE_RESERVATION",
		            action: "rover.reservation.search",
		            standAlone: true,
		            menuIndex: "createReservation"
		        }, {
		            title: "MENU_ROOM_DIARY",
		            action: 'rover.diary',
		            standAlone: true,
		            //hidden: !isHourlyRateOn,
		            menuIndex: 'diaryReservation'
		        }, {
		            title: "MENU_POST_CHARGES",
		            action: "",
		            actionPopup: true,
		            menuIndex: "postcharges"
		        }, {
		            title: "MENU_CASHIER",
		            action: "rover.financials.journal({ id: 2 })",
		            menuIndex: "cashier"
		        }]
		    }, {
		        title: "MENU_CONVERSATIONS",
		        //hidden: true,
		        action: "",
		        iconClass: "icon-conversations",
		        menuIndex: "conversations",
		        submenu: [{
		            title: "MENU_SOCIAL_LOBBY",
		            action: ""
		        }, {
		            title: "MENU_MESSAGES",
		            action: ""
		        }, {
		            title: "MENU_REVIEWS",
		            action: ""
		        }]
		    }, {
		        title: "MENU_REV_MAN",
		        action: "",
		        iconClass: "icon-revenue",
		        menuIndex: "revenue-manager",
		        submenu: [{
		            title: "MENU_RATE_MANAGER",
		            action: "rover.ratemanager",
		            menuIndex: "rateManager"
		        }, {
		            title: "MENU_TA_CARDS",
		            action: "rover.companycardsearch",
		            menuIndex: "cards"
		        }, {
		            title: "MENU_DISTRIBUTION_MANAGER",
		            action: ""
		        }]
		    }, {
		        title: "MENU_HOUSEKEEPING",
		        //hidden: true,
		        action: "",
		        iconClass: "icon-housekeeping",
		        menuIndex: "housekeeping",
		        submenu: [{
		            title: "MENU_ROOM_STATUS",
		            action: "rover.housekeeping.roomStatus",
		            menuIndex: "roomStatus"
		        }, {
		            title: "MENU_TASK_MANAGEMENT",
		            action: "rover.workManagement.start",
		            menuIndex: "workManagement",
		            //hidden: isHourlyRateOn

		        }, {
		            title: "MENU_MAINTAENANCE",
		            action: ""
		        }]
		    }, {
		        title: "MENU_FINANCIALS",
		        //hidden: true,
		        action: "",
		        iconClass: "icon-financials",
		        menuIndex: "financials",
		        submenu: [{
		            title: "MENU_JOURNAL",
		            action: "rover.financials.journal({ id : 0})",
		            menuIndex: "journals"
		        }, {
		            title: "MENU_ACCOUNTING",
		            action: ""
		        }, {
		            title: "MENU_COMMISIONS",
		            action: ""
		        }]
		    }, {
		        title: "MENU_REPORTS",
		        action: "rover.reports",
		        menuIndex: "reports",
		        iconClass: "icon-reports",
		        submenu: []
		    }
		];

		//if auto change business is not enabled, we have to show EOD menu
		// hote admin -> Hotel & Staff -> Settings & Parameter -> AUTO CHANGE BUSINESS DATE
		if(!isAutoChangeBussinessDate) {
			//finding the index where to insert EOD menu
			menuFrontDeskIndex 		= _.indexOf(_.pluck(menu, 'menuIndex'), "front_desk");
			menu[menuFrontDeskIndex].submenu.push(eodSubMenu);
		}

		return menu;
	};

	/**
	* method to 3rd party connected PMS - for now OPERA
	* @param {object}, contains the different value/function to decide the enabling/disabling of a menu item
	* as well as different actions
	*/
	this.getMainMenuForConnectedRover = function(options) {
		var defaultDashboard 		= options['defaultDashboard'],
		 	defaultDashboardState 	= getDefaultDashboardState (defaultDashboard),
			isF_and_M_Staff 		= isFloorMaintananceStaff (options['userRole']);

		var menu = [{
				title: "MENU_DASHBOARD",
				action: defaultDashboardState,
				menuIndex: "dashboard",
				submenu: [],
				iconClass: "icon-dashboard"
			}, {
				title: "MENU_HOUSEKEEPING",
				//hidden: true,
				action: "",
				iconClass: "icon-housekeeping",
				submenu: [{
					title: "MENU_ROOM_STATUS",
					action: "rover.housekeeping.roomStatus",
					menuIndex: "roomStatus"
				}]
			}, {
				title: "MENU_REPORTS",
				action: "rover.reports",
				menuIndex: "reports",
				iconClass: "icon-reports",
				submenu: [],
				//hidden: isF_and_M_Staff
		}];

		return menu;
	};

	/**
	* method to get mobile menu for standalone
	* @param {object}, contains the different value/function to decide the enabling/disabling of a menu item
	* as well as different actions
	*/
	this.getMobileMenuForStandAloneRover = function(options) {
		var defaultDashboard 		= options['defaultDashboard'],
		 	defaultDashboardState 	= getDefaultDashboardState (defaultDashboard);
	    
	    // menu for mobile views
	    var menu = [{
			        title: "MENU_DASHBOARD",
			        action: defaultDashboardState,
			        menuIndex: "dashboard",
			        iconClass: "icon-dashboard"
			    },{
			        title: "MENU_ROOM_STATUS",
			        action: "rover.housekeeping.roomStatus",
			        menuIndex: "roomStatus",
			        iconClass: "icon-housekeeping",
			        //hidden: isFrontDeskDashboard (defaultDashboard)
			    }
		];

		return menu;
	};

	/**
	* method to get mobile menu for connected
	* @param {object}, contains the different value/function to decide the enabling/disabling of a menu item
	* as well as different actions
	*/
	this.getMobileMenuForConnectedRover = function(options) {
		var defaultDashboard 		= options['defaultDashboard'],
		 	defaultDashboardState 	= getDefaultDashboardState (defaultDashboard);
	    
	    // menu for mobile views
	    var menu = [{
			        title: "MENU_DASHBOARD",
			        action: defaultDashboardState,
			        menuIndex: "dashboard",
			        iconClass: "icon-dashboard"
			    },{
			        title: "MENU_ROOM_STATUS",
			        action: "rover.housekeeping.roomStatus",
			        menuIndex: "roomStatus",
			        iconClass: "icon-housekeeping",
			        //hidden: isFrontDeskDashboard (defaultDashboard)
			    }
		];

		return menu;
	};


	/**
	* function to check permissions against a menu
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.hasMenuPermission = function(menuIndex) {
		var menuPermissions = {
			'search': ['SEARCH_RESERVATIONS']
		};

		var permissions = null, collectivePermissionValue = true;

		if(menuIndex in menuPermissions) {
			permissions = menuPermissions[menuIndex];

			_.each(permissions, function(item) {
				collectivePermissionValue = collectivePermissionValue * rvPermissionSrv.getPermissionValue(item);
			});

			return collectivePermissionValue;
		}
		return true;
	};

	/**
	* function to check whether a menu has some role based association
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.hasRolePermission = function(menuIndex) {
		return true;
	};

	/**
	* function to check whether a menu has some role based association
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.hasSettingsVisbility = function(menuIndex) {
		return true;
	};

	/**
	* function to check permissions against a menu
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.shouldShowMenu = function(menuIndex) {
		if (!hasMenuPermission (menuIndex)) return false;		
		if (!hasRolePermission (menuIndex)) return false;	
		if (!hasSettingsVisbility (menuIndex)) return false;
		return true;
	};	

}] );




/*def menu_permissions(menuIndex)

	{ menuIndex : ['dasdsadsa', 'dasdsadasd'],

	}


	return true / false;

def role_permissions(menu_index)
	if menu_index == 'dasdsa':
		if role = 'dadas' : return true
			else : false
def 

def should_show_menu(menu_idex)
	if !menu_permissions_visibility(menuIndex) return false
	if !menu_role_visibility return false
	if !menu_settings_visibility return false*/