sntRover.service('rvMenuSrv',	
	['rvPermissionSrv', 'RVDashboardSrv', 'RVHotelDetailsSrv',
	function(rvPermissionSrv, RVDashboardSrv, RVHotelDetailsSrv) {
	

	//we have to keep reference 
	var self = this;

	/**
	* method to return default dashboard state for rover
	* will find the dashboard from current user object
	* @return {string}, corresponding state
	*/
	var getDefaultDashboardState = function() {
		var dashboard = RVHotelDetailsSrv.hotelDetails.current_user.default_dashboard;
		var statesForDashbaord = {
			'HOUSEKEEPING': 'rover.dashboard.housekeeping',
			'FRONT_DESK': 'rover.dashboard.frontoffice',
			'MANAGER': 'rover.dashboard.manager'
		};
		return statesForDashbaord[dashboard];
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
    * utility function to decide whether the hourly rate is on or not
    * will use the hotel details API response
    * @return {Boolean}
    */
    var isHourlyRateOn = function() {
    	return RVHotelDetailsSrv.hotelDetails.is_hourly_rate_on;
    };

    /**
    * utility function to decide whether the it is connected
    * will use the hotel details API response
    * @return {Boolean}
    */
    var isConnected = function() {
    	return (RVHotelDetailsSrv.hotelDetails.pms_type === null);
    };

    /**
    * utility function to decide whether the auto business date change is enabled or not
    * will use the hotel details API response
    * @return {Boolean}
    */
    var isAutoBussinessDateChangeEnabled = function() {
    	return RVHotelDetailsSrv.hotelDetails.is_auto_change_bussiness_date;
    };

	/**
	* utility the user role is 'Floor & Maintanance staff'	
    * @param {string}, user role
	* @return {boolean}	
	*/
    var isFloorMaintananceStaff= function() {
    	var userDetails = RVDashboardSrv.getUserDetails();
    	return (userDetails.user_role === "Floor & Maintenance Staff");
    };

    /**
    * utility function to process menu list
    * will check permission, check role permission, visibility permission
    * @param {array of Objects}
    * @return {array of Objects}
    */
    var processMenuList = function (menuList) {
    	//deep copying the obeject before proceeding
    	menuList = JSON.parse(JSON.stringify(menuList));

    	var menuToReturn = [],  
    		subMenuCount,
    		subMenuVisibleCount, 
    		hasSubMenu = false;

    	//we are processing on the menu list we have
		_.each (menuList, function(menuItem) {
			//if the menu is hi
			isMenuItemVisible = self.shouldShowMenuItem(menuItem.menuIndex);
			if(isMenuItemVisible) {
				subMenuCount = menuItem.submenu ? menuItem.submenu.length : 0;
				hasSubMenu = (subMenuCount > 0) ? true : false;
				subMenuVisibleCount = 0;

				//looping through submenus
				menuItem.submenu = _.filter (menuItem.submenu, function (subMenuItem){
					isMenuItemVisible = self.shouldShowMenuItem(subMenuItem.menuIndex);	
					
					if (isMenuItemVisible) subMenuVisibleCount++;
					return isMenuItemVisible;									
				});

				// if it has submenu & none of them are visible we will not show that menu
				if(hasSubMenu && subMenuVisibleCount != 0){
					menuToReturn.push (menuItem);
				}

				//if it has no submenu, we will just push them
				if(!hasSubMenu) {
					menuToReturn.push (menuItem);
				}
			}
		});

		return menuToReturn;
    };


	/**
	* method to get menu for rover
	* @return {array} - List of Menu
	*/
	this.getMainMenuForStandAloneRover = function() {
		var defaultDashboardState 	= getDefaultDashboardState (),
			menuFrontDeskIndex 		= -1,
			isMenuItemVisible		= true,
            menuList = []; //storing the menu list, will process on this and return


		menuList = [{
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
		            menuIndex: "createReservation"
		        }, {
		            title: "MENU_ROOM_DIARY",
		            action: 'rover.diary',
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
		        },{
	                title: "MENU_END_OF_DAY",
	                action: "",
	                actionPopup: true,
	                menuIndex: "endOfDay"
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
		            action: "",
		            menuIndex: "distribution_manager"
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

		        }, {
		            title: "MENU_MAINTAENANCE",
		            action: "",
		            menuIndex: "maintanance",
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
		            action: "",
		            menuIndex: "accounting"
		        }, {
		            title: "MENU_COMMISIONS",
		            action: "",
		            menuIndex: "commisions"
		        }]
		    }, {
		        title: "MENU_REPORTS",
		        action: "rover.reports",
		        menuIndex: "reports",
		        iconClass: "icon-reports",
		        submenu: []
		    }
		];

		return processMenuList (menuList);
	};

	/**
	* method to 3rd party connected PMS - for now OPERA
	* @return {array} - List of Menu
	*/
	this.getMainMenuForConnectedRover = function() {
		var defaultDashboardState 	= getDefaultDashboardState ();

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
		}];

		return processMenuList (menu);
	};

	/**
	* method to get mobile menu for standalone
	* @return {array} - List of Menu
	*/
	this.getMobileMenuForStandAloneRover = function() {
		var defaultDashboardState 	= getDefaultDashboardState ();
	    
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
			    }
		];

		return processMenuList (menu);
	};

	/**
	* method to get mobile menu for connected
	* @return {array} - List of Menu
	*/
	this.getMobileMenuForConnectedRover = function() {
		var defaultDashboardState 	= getDefaultDashboardState ();
	    
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
			    }
		];

		return processMenuList (menu);
	};


    /**
	* method to get settings menu
	* @return {array} - List of Menu
	*/
	this.getSettingsSubmenu = function() {
		var defaultDashboardState 	= getDefaultDashboardState ();

		var menu = [{
				title: "SETTINGS",
		        menuIndex: "settings",
		        action: "",
		        submenu: [{
		            title: "CAHNGE_PASSWORD",
		            action: "",
		            menuIndex: "changePassword",
		            actionPopup: true
		        }, {
		            title: "SETTINGS",
		            action: "",
		            menuIndex: "adminSettings",
		            actionPopup: true
		        }]
		    }];
		return processMenuList (menu);
	};


	/**
	* function to check permissions against a menu
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.hasMenuPermission = function(menuIndex) {
		
		// NOTE:- {key: menuIndex, value: [PERMISSIONS]}
		var menuPermissions = {
			'search': 				['SEARCH_RESERVATIONS'],
			'createReservation': 	['CREATE_EDIT_RESERVATIONS'],
			'postcharges': 			['ACCESS_POST_CHARGES'],
			
			'cashier': 				['ACCESS_CASHIERING'],
			'endOfDay': 			['ACCESS_RUN_END_OF_DAY'],
			'rateManager': 			['ACCESS_RATE_MANAGER'],
			
			'cards': 				['ACCESS_COMPANY_TA_CARDS'],
			'distribution_manager': ['ACCESS_DISTRIBUTION_MENU'],
			'roomStatus': 			['HOUSEKEEPING_ROOM_STATUS_ACCESS'],
			
			'workManagement': 		['ACCESS_TASK_MANAGEMENT'],
			'maintanance': 			['ACCESS_TASK_MAINTENANCE'],
			'journals': 			['ACCESS_JOURNAL'],

			'accounting': 			['ACCESS_ACCOUNTING_INTERFACE'],		
			'commisions': 			['ACCESS_COMMISSIONS'],	
			'diaryReservation': 	['CREATE_EDIT_RESERVATIONS'],

			'changePassword':       ['SETTINGS_CHANGE_PASSWORD_MENU'],
			'adminSettings':        ['SETTINGS_ACCESS_TO_HOTEL_ADMIN'] 

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
		var user = RVDashboardSrv.getUserDetails(),
			role = user.user_role,
			isHotelAdmin = (role === "Hotel Admin"),
			isHotelStaff = user.is_staff,
			returnValue = false;

		//currently every menu is available for Hotel Admin & Hotel Staff
		returnValue = (isHotelAdmin || isHotelStaff);


		return returnValue;
	};

	/**
	* function to check whether a menu has some role based association
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.hasSettingsPermission = function(menuIndex) {
		var returnValue = true;
		switch (menuIndex){
			case 'diaryReservation': 
				returnValue = isHourlyRateOn();
				break;

			//if auto change business is not enabled, we have to show EOD menu
			// hote admin -> Hotel & Staff -> Settings & Parameter -> AUTO CHANGE BUSINESS DATE
			case 'endOfDay':
				returnValue = !isAutoBussinessDateChangeEnabled(); 
				break;

			//we are hiding conversations for now
			case 'conversations':
				returnValue = false;
				break;		

			case 'reports':		
				// we are hiding the reports menu if it is a floor & maintanance staff	in connected/standalon	
				//returnValue = isConnected() ? (isFloorMaintananceStaff() ? false : true) : (isFloorMaintananceStaff() ? false : true);				
				break;
			case 'workManagement':
				returnValue = !isHourlyRateOn();
				break;

			default:
        		break;
		}

		return returnValue;
	};

	/**
	* function to check permissions against a menu
	* @param {string}, menu index
	* @return {boolean}
	*/
	this.shouldShowMenuItem = function(menuIndex) {
		if (!self.hasMenuPermission (menuIndex)) return false;		
		if (!self.hasRolePermission (menuIndex)) return false;	
		if (!self.hasSettingsPermission (menuIndex)) return false;
		return true;
	};	

}] );