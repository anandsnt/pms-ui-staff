sntRover.service('rvMenuSrv',
	[function() {
	
	//variable storing menu list, publicly available
	this.menu = [];

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
	* method to get menu for rover
	* options 
	*/
	this.getMenuForRover = function(options) {
		var defaultDashboardState = getDefaultDashboardState (options['defaultDashboard']),
			isHourlyRateOn = options['isHourlyRateOn'];

		this.menu = [	
		  	{
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

		return this.menu;
	};


}] );