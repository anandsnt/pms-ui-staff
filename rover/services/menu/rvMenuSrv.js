sntRover.service('rvMenuSrv',
	[function() {
	

	/**
	* method to return default dashboard state for rover	
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
    * function to decide whether dashboard is front desk
    */
    var isFrontDeskDashboard = function (dashboard){
    	return dashboard === 'FRONT_DESK';
    };
	
	/**
	* whether the user role is 'Floor & Maintanance staff'	
	*/
    var isFloorMaintananceStaff= function (userRole){
    	return (userRole === "Floor & Maintenance Staff");
    };

	/**
	* method to get menu for rover
	* param1 {object}, contains the different value/function to decide the enabling/disabling of a menu item
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
		            hidden: !isHourlyRateOn,
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
		        hidden: true,
		        action: "",
		        iconClass: "icon-conversations",
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
		        submenu: [{
		            title: "MENU_ROOM_STATUS",
		            action: "rover.housekeeping.roomStatus",
		            menuIndex: "roomStatus"
		        }, {
		            title: "MENU_TASK_MANAGEMENT",
		            action: "rover.workManagement.start",
		            menuIndex: "workManagement",
		            hidden: isHourlyRateOn

		        }, {
		            title: "MENU_MAINTAENANCE",
		            action: ""
		        }]
		    }, {
		        title: "MENU_FINANCIALS",
		        //hidden: true,
		        action: "",
		        iconClass: "icon-financials",
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
		if(!isAutoChangeBussinessDate) {
			//finding the index where to insert EOD menu
			menuFrontDeskIndex 		= _.indexOf(_.pluck(menu, 'title'), "MENU_FRONT_DESK");
			menu[menuFrontDeskIndex].submenu.push(eodSubMenu);
		}

		return menu;
	};

	/**
	* method to 3rd party connected PMS - for now OPERA
	* param1 {object}, contains the different value/function to decide the enabling/disabling of a menu item
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
				hidden: isF_and_M_Staff
		}];

		return menu;
	};

	/**
	* method to get mobile menu for standalone
	* param1 {object}, contains the different value/function to decide the enabling/disabling of a menu item
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
			        hidden: isFrontDeskDashboard (defaultDashboard)
			    }
		];

		return menu;
	};

	/**
	* method to get mobile menu for connected
	* param1 {object}, contains the different value/function to decide the enabling/disabling of a menu item
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
			        hidden: isFrontDeskDashboard (defaultDashboard)
			    }
		];

		return menu;
	};



}] );