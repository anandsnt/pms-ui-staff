admin.controller('ADAppCtrl', [
    '$state', '$scope', '$rootScope', 'ADAppSrv', '$stateParams', '$window', '$translate', 'adminMenuData', 'businessDate',
    '$timeout', 'ngDialog', 'sntAuthorizationSrv', '$filter', '$sce',
    function($state, $scope, $rootScope, ADAppSrv, $stateParams, $window, $translate, adminMenuData, businessDate,
             $timeout, ngDialog, sntAuthorizationSrv, $filter, $sce) {

		// hide the loading text that is been shown when entering Admin
		$( ".loading-container" ).hide();

		// when there is an occured while trying to access any menu details, we need to show that errors
		$scope.errorMessage = '';

		BaseCtrl.call(this, $scope);
		var title = "Showing Settings";

        var successCallbackOfFtechUserInfo = function (userInfoDetails) {
            // CICO-39623 : set current hotel details
            $scope.userInfo = {
                'first_name': userInfoDetails.first_name,
                'last_name': userInfoDetails.last_name,
                'business_date': userInfoDetails.business_date,
                'logo': userInfoDetails.logo
            };
            $scope.$emit('hideLoader');
        };

		$scope.setTitle(title);
		$scope.menuOpen = false;
		$scope.hotelListOpen = '';
		$scope.isStandAlone = false;        
		$scope.dragStart = false;
		$scope.selectedIndex = 0;
		$scope.dropedElementsModel = []; // model used for drag & drop feature, used for droping menu items displaying area

		// for preventing drag & drop operations turning into click
		var lastDropedTime = '';
		/*
	     * To close drawer on click inside pages
	     */

	    $scope.closeDrawer = function(event) {
	    	 $scope.menuOpen = false;
	    };
		// scroller options
		var scrollerOptions = {click: true, scrollbars: true};

		$scope.setScroller('tabs_menu', scrollerOptions);

		$scope.bookMarks = [];

		$rootScope.shortDateFormat = "MM/yy"; // 05/99
		$rootScope.dayInWeek = "EEE"; // Sun
		$rootScope.dayInMonth = "dd"; // 01
		$rootScope.monthInYear = "MMM"; // Jan
		// Use below standard date formatter in the UI.
		$rootScope.mmddyyyyFormat = "MM-dd-yyyy"; // 01-22-2014
		$rootScope.fullDateFormat = "EEEE, d MMMM yyyy"; // Wednesday, 4 June 2014
		$rootScope.dayAndDate = "EEEE MM-dd-yyyy"; // Wednesday 06-04-2014
		$rootScope.fullDateFullMonthYear = "dd MMMM yyyy";
		$rootScope.dayAndDateCS = "EEEE, MM-dd-yyyy";// Wednesday, 06-04-2014
		$rootScope.longDateFormat = "MMM dd, yyyy";// Wednesday, 06-04-2014
		$rootScope.dateFormatForAPI = "yyyy-MM-dd";
		$rootScope.currencySymbol = "";
        $rootScope.infrasecSpecificCountry = 'Sweden';
		// Initialise $rootScope.isHourlyRatesEnabled to false; the value is set on call to api/hotel_settings
		$rootScope.isHourlyRatesEnabled = false;
		$rootScope.isSuiteRoomsAvailable = false;
		// in order to prevent url change(in rover specially coming from admin/or fresh url entering with states)
	    // (bug fix to) https://stayntouch.atlassian.net/browse/CICO-7975

	    $rootScope.businessDate = businessDate;

	    // flag to decide show task management under house keeping: true by default
	    var showTaskManagementInHKMenu = true;

	    // flag to decide show neighbours screen
	    var isNeighboursEnabled = false;

        var setupLeftMenu = function() {
            var shouldHideNightlyDiaryMenu = true,
                shouldHideSellLimitMenu = true;

            if (!$rootScope.isHourlyRatesEnabled) {
                shouldHideNightlyDiaryMenu  = !$rootScope.isRoomDiaryEnabled && $rootScope.isPmsProductionEnv;
                shouldHideSellLimitMenu = !$rootScope.isSellLimitEnabled && $rootScope.isPmsProductionEnv;
            }
            if ($scope.isStandAlone) {
                $scope.menu = [
                    {
                        title: 'MENU_DASHBOARD',
                        action: 'rover.dashboard',
                        menuIndex: 'dashboard',
                        submenu: [],
                        iconClass: 'icon-dashboard'
                    },
                    {
                        title: 'MENU_FRONT_DESK',
                        action: '',
                        iconClass: 'icon-frontdesk',
                        submenu: [
                            {
                                title: 'MENU_SEARCH_RESERVATIONS',
                                action: 'rover.search'
                            },
                            {
                                title: 'MENU_CREATE_RESERVATION',
                                action: 'rover.reservation.search',
                                standAlone: true
                            }, {
                                title: 'MENU_ROOM_DIARY',
                                action: 'rover.diary',
                                standAlone: true,
                                hidden: !$rootScope.isHourlyRatesEnabled
                            }, {
                                title: 'MENU_ROOM_DIARY',
                                action: 'rover.nightlyDiary',
                                standAlone: true,
                                hidden: shouldHideNightlyDiaryMenu,
                                actionParams: {
                                    start_date: $rootScope.businessDate
                                }
                            }, {
                                title: 'MENU_POST_CHARGES',
                                action: 'rover.dashboardFromAdmin',
                                actionParams: {
                                    type: 'postCharge'
                                }
                            }, {
                                title: 'MENU_CASHIER',
                                action: 'rover.financials.journal',
                                actionParams: {
                                    id: 'CASHIER'
                                }
                            }, {
                                title: "MENU_GUESTS",
                                action: "rover.guest.search",
                                menuIndex: "guests"
                            }, {
                                title: 'MENU_ACCOUNTS',
                                action: 'rover.accounts.search',
                                menuIndex: 'accounts'                                
                            }, {
                                title: 'MENU_END_OF_DAY',
                                action: 'rover.endOfDay.starteod'
                            }, {
                                title: 'MENU_SOCIAL_LOBBY',
                                hidden: !isNeighboursEnabled,
                                action: 'rover.socialLobby'
                            }
                        ]
                    }, {
                        title: 'MENU_GROUPS',
                        action: '',
                        iconClass: 'icon-groups',
                        menuIndex: 'menuGroups',
                        hidden: $rootScope.isHourlyRatesEnabled,
                        submenu: [{
                            title: 'MENU_CREATE_GROUP',
                            action: 'rover.groups.config',
                            actionParams: {
                                id: 'NEW_GROUP'
                            },
                            menuIndex: 'menuCreateGroup'
                        }, {
                            title: 'MENU_MANAGE_GROUP',
                            action: 'rover.groups.search',
                            menuIndex: 'menuManageGroup'
                        }, {
                            title: 'MENU_CREATE_ALLOTMENT',
                            action: 'rover.allotments.config',
                            actionParams: {
                                id: 'NEW_ALLOTMENT'
                            },
                            menuIndex: 'menuCreateAllotment'
                        }, {
                            title: 'MENU_MANAGE_ALLOTMENT',
                            action: 'rover.allotments.search',
                            menuIndex: 'menuManageAllotment'
                        }]
                    }, {
                        title: 'MENU_CONVERSATIONS',
                        hidden: true,
                        action: '',
                        iconClass: 'icon-conversations',
                        submenu: [{
                            title: 'MENU_SOCIAL_LOBBY',
                            action: ''
                        }, {
                            title: 'MENU_MESSAGES',
                            action: ''
                        }, {
                            title: 'MENU_REVIEWS',
                            action: ''
                        }]
                    }, {
                        title: 'MENU_REV_MAN',
                        action: '',
                        iconClass: 'icon-revenue',
                        submenu: [
                            {
                                title: 'MENU_RATE_MANAGER',
                                action: 'rover.rateManager',
                                menuIndex: 'rateManager'
                            },
                            {
                                title: 'MENU_TA_CARDS',
                                action: 'rover.companycardsearch',
                                menuIndex: 'cards'
                            },
                            {
                                title: 'MENU_SELL_LIMITS',
                                action: 'rover.overbooking',
                                actionParams: {
                                    start_date: $rootScope.businessDate
                                },
                                standAlone: true,
                                hidden: shouldHideSellLimitMenu
                            }
                        ]
                    }, {
                        title: 'MENU_HOUSEKEEPING',
                        action: '',
                        iconClass: 'icon-housekeeping',
                        submenu: [{
                            title: 'MENU_ROOM_STATUS',
                            action: 'rover.housekeeping.roomStatus',
                            menuIndex: 'roomStatus'
                        }, {
                            title: 'MENU_TASK_MANAGEMENT',
                            action: 'rover.workManagement.start',
                            menuIndex: 'workManagement',
                            hidden: ( $rootScope.isHourlyRatesEnabled || !showTaskManagementInHKMenu )
                        }, {
                            title: 'MENU_MAINTAENANCE',
                            action: '',
                            hidden: true
                        }]
                    }, {
                        title: 'MENU_FINANCIALS',
                        action: '#',
                        iconClass: 'icon-financials',
                        submenu: [{
                            title: 'MENU_JOURNAL',
                            action: 'rover.financials.journal',
                            actionParams: {
                                id: 'REVENUE'
                            }
                        }, {
                            title: 'MENU_CC_TRANSACTIONS',
                            action: 'rover.financials.ccTransactions',
                            actionParams: {
                                id: 'REVENUE'
                            }
                        }, {
                            title: 'MENU_ACCOUNTS_RECEIVABLES',
                            action: 'rover.financials.accountsReceivables'
                        }, {
                            title: 'MENU_COMMISIONS',
                            action: 'rover.financials.commisions'
                        },
                        {
                            title: "MENU_INVOICE_SEARCH",
                            action: "rover.financials.invoiceSearch",
                            menuIndex: "invoiceSearch"
                        },
                        {
                            title: "AUTO_CHARGE",
                            action: "rover.financials.autoCharge",
                            menuIndex: "autoCharge"
                        }]
                    }, {
                        title: "MENU_ACTIONS",
                        action: "",
                        iconClass: "icon-actions",
                        menuIndex: "actions",                
                        submenu: [{
                            title: "MENU_ACTIONS_MANAGER",
                            action: "rover.actionsManager",
                            menuIndex: "actionsManager",
                            iconClass: "icon-actions"
                        },
                        {
                            title: "QUICKTEXT",
                            action: "rover.quicktext",
                            menuIndex: "QuickText",
                            hidden: !$rootScope.isQuickTextEnabled
                        }]
                    }, {
                        title: "MENU_REPORTS",              
                        action: "",
                        iconClass: "icon-reports",
                        menuIndex: "reports",               
                        submenu: [{
                            title: "MENU_NEW_REPORT",
                            action: "rover.reports.dashboard",
                            menuIndex: "new_report"
                        }, {
                            title: "MENU_REPORTS_INBOX",
                            action: "rover.reports.inbox",
                            menuIndex: "reports-inbox",
                            hidden: !$rootScope.isBackgroundReportsEnabled
                        }, {
                            title: "MENU_SCHEDULE_REPORT_OR_EXPORT",
                            action: "rover.reports.scheduleReportsAndExports",
                            menuIndex: "schedule_report_export"
                        }]
                    }];
                // menu for mobile views
                $scope.mobileMenu = [
                    {
                        title: 'MENU_DASHBOARD',
                        action: 'rover.dashboard',
                        menuIndex: 'dashboard',
                        submenu: [],
                        iconClass: 'icon-dashboard'
                    }, {
                        title: 'MENU_ROOM_STATUS',
                        action: 'rover.housekeeping.roomStatus',
                        menuIndex: 'roomStatus',
                        submenu: [],
                        iconClass: 'icon-housekeeping'
                    }];
            } else {
                $scope.menu = [
                    {
                        title: 'MENU_DASHBOARD',
                        action: 'rover.dashboard',
                        menuIndex: 'dashboard',
                        submenu: [],
                        iconClass: 'icon-dashboard'
                    }, {
                        title: 'MENU_HOUSEKEEPING',
                        action: '',
                        iconClass: 'icon-housekeeping',
                        submenu: [{
                            title: 'MENU_ROOM_STATUS',
                            action: 'rover.housekeeping.roomStatus',
                            menuIndex: 'roomStatus'
                        }]
                    }, {
                        title: "MENU_REPORTS",              
                        action: "",
                        iconClass: "icon-reports",
                        menuIndex: "reports",               
                        submenu: [{
                            title: "MENU_NEW_REPORT",
                            action: "rover.reports.dashboard",
                            menuIndex: "new_report"
                        }, {
                            title: "MENU_REPORTS_INBOX",
                            action: "rover.reports.inbox",
                            menuIndex: "reports-inbox",
                            hidden: !$rootScope.isBackgroundReportsEnabled
                        }, {
                            title: "MENU_SCHEDULE_REPORT_OR_EXPORT",
                            action: "rover.reports.scheduleReportsAndExports",
                            menuIndex: "schedule_report_export"
                        }]
                    }
                ];
                // menu for mobile views
                $scope.mobileMenu = [
                    {
                        title: 'MENU_DASHBOARD',
                        action: 'rover.dashboard',
                        menuIndex: 'dashboard',
                        iconClass: 'icon-dashboard'
                    }, {
                        title: 'MENU_ROOM_STATUS',
                        action: 'rover.housekeeping.roomStatus',
                        menuIndex: 'roomStatus',
                        submenu: [],
                        iconClass: 'icon-housekeeping'
                    }
                ];
            }
        };

        /**
		 * While navigating to a state from the bookmarks, this method ensures that the $scope.selectedMenu variable
		 * holds the correct parent state
         * @param {string} stateName name of the selected state
		 * @returns {undefined}
         */
        function updateSelectedMenu(stateName) {
            // Ensure that the selectedMenu is updated before navigating to the new state
            _.each($scope.data.menus, function(menu, stateIdx) {
                _.each(menu.components, function(component) {
                    if (component.state === stateName) {
                        $scope.selectedIndex = stateIdx;
                        $scope.selectedMenu = $scope.data.menus[$scope.selectedIndex];
                    }
                });
            });
        }

		/**
		* in case of we want to reinitialize left menu based on new $rootScope values or something
		* which set during it's creation, we can use
		*/
		$scope.$on('refreshLeftMenu', function(event) {
			setupLeftMenu();
		});

		$scope.$on("updateSubMenu", function(idx, item) {
			var selectedAction = item[1].action,
                selectedActionParams = item[1].actionParams,
				staffURL = "/staff/h/";

            // CICO-9816 Bug fix - When moving to /staff, the screen was showing blank content
			if (selectedAction && selectedAction.startsWith('rover')) {
				$('body').addClass('no-animation');
				$('#admin-header').css({'z-index': '0'});
				$('section.content-scroll').css({'overflow': 'visible'});

				staffURL +=  sntAuthorizationSrv.getProperty();
				staffURL += '?state=' + selectedAction.replace(/\./g, '-');

                if (angular.isObject(selectedActionParams)) {
                    staffURL += '&params=' + encodeURI(angular.toJson(selectedActionParams));
                }

                $window.location.href = staffURL;
            }

			if (item && item[1] && item[1].submenu) {
				$scope.showSubMenu = true;
				$scope.activeSubMenu = item[1].submenu;
			} else {
				$scope.activeSubMenu = [];
			}


		});

		if ($rootScope.adminRole === "hotel-admin") {
			$scope.isHotelAdmin = true;
            $scope.invokeApi(ADAppSrv.fetchUserInfo, {}, successCallbackOfFtechUserInfo);
		} else {
			$scope.isHotelAdmin = false;
		}

		$scope.isPmsConfigured = $rootScope.isPmsConfigured;
		$scope.isDragging = false;

		// on drag start we need to show a dotted border on bookmark area
		$scope.onDragStart = function() {
			$scope.isDragging = true;
		};

		// on drag stop we need to hide the dotted border on bookmark area
		$scope.onDragStop = function() {
			$scope.isDragging = false;

			// also we are taking the lastDropedTime to preventing click after drag stop operation
			lastDropedTime = new Date();
		};

		// function to copy the ids of bookmark to a new array
		var copyBookmarkIds = function(arrayToCopy) {
			for (var i = 0; i < $scope.bookMarks.length; i++) {
				arrayToCopy.push($scope.bookMarks[i].id);
			}
		};

		// function to change bookmark status after dropping
		var updateBookmarkStatus = function() {
			for (var i = 0; i < $scope.data.menus.length; i++) {
				for (var j = 0; j < $scope.data.menus[i].components.length; j++) {
					if ($scope.bookmarkIdList.indexOf($scope.data.menus[i].components[j].id) === -1) {
						$scope.data.menus[i].components[j].is_bookmarked = false;
					} else {
						$scope.data.menus[i].components[j].is_bookmarked = true;
					}
				}
			}
		};

		// drop function on menu item listing
		$scope.onDropingMenuItemListing = function(event, ui) {
			var index = -1;

			// successcallback of removing menu item
			var successCallbackOfRemovingBookMark = function() {
				$scope.$emit('hideLoader');

				if (index !== -1) {
					$scope.bookmarkIdList.splice(index, 1);
					index = -1;
				}
				updateBookmarkStatus();
			};


			var copiedBookMarkIds = [];

			copyBookmarkIds(copiedBookMarkIds);

			if ($scope.bookMarks.length <= $scope.bookmarkIdList.length) {
				for (var i = 0; i < $scope.bookmarkIdList.length; i++) {
					// checking bookmarked id's in copiedBookark id's, if it is no, call web service
					if (copiedBookMarkIds.indexOf($scope.bookmarkIdList[i]) === -1) {
						index = i;
						var data = {
							id: $scope.bookmarkIdList[i]
						};

						$scope.invokeApi(ADAppSrv.removeBookMarkItem, data, successCallbackOfRemovingBookMark);
					}
				}
			}

		};

		// drop function on boomark menu item listing
		$scope.onDropAtBookmarkArea = function(event, ui) {
			var index = -1;
			var successCallbackOfBookMark = function() {
				$scope.$emit('hideLoader');
				if (index !== -1) {
					$scope.bookmarkIdList.push($scope.bookMarks[index].id);
					index = -1;
					updateBookmarkStatus();
				}
			};

			var copiedBookMarkIds = [];

			copyBookmarkIds(copiedBookMarkIds);

			if ($scope.bookMarks.length > $scope.bookmarkIdList.length) {
				for (var i = 0; i < $scope.bookMarks.length; i++) {

					// if the newly added bookmark is not in the old copy then we have to web service and add it to the old array
					if ($scope.bookmarkIdList.indexOf($scope.bookMarks[i].id) === -1) {
						index = i;
						var data = {
							id: $scope.bookMarks[i].id
						};

						$scope.invokeApi(ADAppSrv.bookMarkItem, data, successCallbackOfBookMark);
					}
				}
			}

		};

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				// Show a loading message until promises are not resolve
				$scope.$emit('showLoader');
		});

		$rootScope.$on('$stateChangeSuccess', function(e, curr, currParams, from, fromParams) {
		  // Hide loading message
		  $scope.$emit('hideLoader');
		});

		/*
		 * function to handle exception when state is not found
		 */
		$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
			event.preventDefault();
			$scope.errorMessage = ['Sorry, the feature you are looking for is not implemented yet'];
			// closing the error message after after 2 seconds
			setTimeout(function() {
				$scope.clearErrorMessage();
				$scope.$apply();
			}, 10000);
		});

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			$scope.$emit('hideLoader');
			$scope.$broadcast("STATE_CHANGE_FAILURE", error);
		});

		/*
		 * function for handling click operation on menu item
		 * Here is a special case
		 * After drag operation, click event is firing. Inorder to prevent that
		 * we will check the lastDropedTime with click event fired time.
		 * if it is less than a predefined time, it will not fire click event, otherwise fire
		 */
		$scope.clickedMenuItem = function($event, stateToGo) {
			var currentTime = new Date();

			if (lastDropedTime !== '' && typeof lastDropedTime === 'object') {
				var diff = currentTime - lastDropedTime;

				if (diff <= 400) {
					$event.preventDefault();
					$event.stopImmediatePropagation();
					$event.stopPropagation();
					lastDropedTime = '';
					return false;
				} else {
					lastDropedTime = '';
                    updateSelectedMenu(stateToGo);
					$state.go(stateToGo);
				}
			} else {
				lastDropedTime = '';
                updateSelectedMenu(stateToGo);
				$state.go(stateToGo);
			}
			if ($scope.menuOpen) {
				$scope.menuOpen = !$scope.menuOpen;
				$scope.showSubMenu = false;
			}
		};

		$scope.$on("changedSelectedMenu", function(event, menu) {
			$scope.selectedIndex = menu;
			$scope.selectedMenu = $scope.data.menus[$scope.selectedIndex];
		});
		/*
		 * Success callback of get language
		 * @param {object} response
		 */
		$scope.fetchHotelDetailsSuccessCallback = function(data) {

			// flag to decide show task management under house keeping: true by default
			showTaskManagementInHKMenu = data.is_show_task_management_in_hk_menu;
			isNeighboursEnabled = data.social_lobby_settings.is_neighbours_enabled;
			if (data.language) {
		      $translate.use(data.language.value);
		      $translate.fallbackLanguage('EN');
		      /* For reason unclear, the fallback translation does not trigger
		       * unless a translation is requested explicitly, for second screen
		       * onwards.
		       * TODO: Fix this bug in ng-translate and implement in this here.
		       */
		      setTimeout(function() {
		        $translate('NA');
		      }, 1000); // Word around.
		    } else {
		      $translate.use('EN');
		    }

            // CICO-39623 : Setting up app theme.
            if ( !!data.selected_theme && data.selected_theme.value !== 'ORANGE' ) {
              var appTheme = 'theme-' + (data.selected_theme.value).toLowerCase();

              document.getElementsByTagName("html")[0].setAttribute( 'class', appTheme );
            }

		    // to hide eod submenu conditionally
			$rootScope.is_auto_change_bussiness_date = data.business_date.is_auto_change_bussiness_date;

			// set flag if standalone PMS
			if (data.pms_type === null) {
				$scope.isStandAlone = true;
			}
                        $rootScope.isStandAlone = $scope.isStandAlone;
			$rootScope.currencySymbol = getCurrencySign(data.currency.value);
			$rootScope.dateFormat = getDateFormat(data.date_format.value);
			$rootScope.jqDateFormat = getJqDateFormat(data.date_format.value);
            $rootScope.hotelDateFormat = data.date_format.value;
			$scope.$emit('hideLoader');
			$rootScope.isHourlyRatesEnabled = data.is_hourly_rate_on;
			$rootScope.isSuiteRoomsAvailable = data.suite_enabled;
			$rootScope.hotelTimeZoneFull = data.hotel_time_zone_full;
			$rootScope.hotelTimeZoneAbbr = data.hotel_time_zone_abbr;
			$rootScope.emvTimeout = data.emv_timeout || 120; // default timeout is 120s
            $rootScope.wsCCSwipeUrl = data.cc_swipe_listening_url;
            $rootScope.wsCCSwipePort = data.cc_swipe_listening_port;
            // CICO-51146
            $rootScope.isBackgroundReportsEnabled = data.background_report;
            // CICO-55154
            $rootScope.isQuickTextEnabled = data.is_quicktextenabled;

            // CICO-40544 - Now we have to enable menu in all standalone hotels
            // API not removing for now - Because if we need to disable it we can use the same param
            // $rootScope.isRoomDiaryEnabled = data.is_room_diary_enabled;
            $rootScope.isRoomDiaryEnabled = true;
            $rootScope.isPmsProductionEnv = data.is_pms_prod;

            // CICO-54961 - Hide Sell Limit feature for all hotels except for the pilot property 
            $rootScope.isSellLimitEnabled = data.is_sell_limit_enabled;

			// CICO-18040
			$rootScope.isFFPActive = data.is_ffp_active;
			$rootScope.isHLPActive = data.is_hlp_active;
			$rootScope.isPromoActive = data.is_promotion_active;
			// CICO-21697
			$rootScope.isEnabledRoomTypeByRoomClass = data.is_enabled_room_type_by_class;

			$rootScope.isRoomStatusImportPerRoomTypeOn = data.is_room_status_import_per_room_type_on ? data.is_room_status_import_per_room_type_on : false;

			// CICO-27286
			$rootScope.rateDateRangeLimit = data.rate_date_range_limit;

			$rootScope.mliEmvEnabled = data.mli_emv_enabled && data.payment_gateway === 'MLI';

            $rootScope.mliAndCBAEnabled = data.payment_gateway === 'MLI' && data.mli_cba_enabled;

			setupLeftMenu();

		};
		/*
		 * Function to get the current hotel language
		 */
		$scope.getLanguage = function() {
			$scope.invokeApi(ADAppSrv.fetchHotelDetails, {}, $scope.fetchHotelDetailsSuccessCallback);
		};

		/*
		 * Function to change hotel name on updation in hotel details page
		 */
		$scope.$on('hotelNameChanged', function(e, data) {
			$scope.data.current_hotel = data.new_name;
		});

        /** ************************** Hide partially completed admin menus ******** **/
        /** ********* hide the admin menus in release and production *************** **/

        var url = document.location,
            inDevEnvironment = false;

        if ((url.hostname && typeof url.hostname === typeof 'str') && (url.hostname.indexOf('pms-dev') !== -1 ||
                url.hostname.indexOf('localhost') !== -1)) {
            inDevEnvironment = true;
        }
        // add the menu or sub menu names you need to hide in production
        var partiallyCompeletedMenuNames = ['Email Templates Settings', 'TACS'];

        if (partiallyCompeletedMenuNames.length && !inDevEnvironment) {
            _.each(partiallyCompeletedMenuNames, function(partiallyCompeletedMenuName) {
                _.each(adminMenuData.menus, function(menu, menuIndex) {
                    // check if partially completed menu is one of the main menu item
                    if (menu && partiallyCompeletedMenuName === menu.menu_name) {
                        adminMenuData.menus.splice(menuIndex, 1);
                    }
                    if (menu) {
                        _.each(menu.components, function(component, componentIndex) {
                            // check if partially completed menu is one of the sub menu item
                            if (component && partiallyCompeletedMenuName === component.name) {
                                menu.components.splice(componentIndex, 1);
                            }
                            if (component) {
                                _.each(component.sub_components, function(subComponent, subComponentIndex) {
                                    // check if partially completed menu is one of the sub sub menu item
                                    if (subComponent && partiallyCompeletedMenuName === subComponent.name) {
                                        component.sub_components.splice(subComponentIndex, 1);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }

        /** *************************************************************************** **/

		$scope.data = adminMenuData;
		$scope.selectedMenu = $scope.data.menus[$scope.selectedIndex];
		$scope.bookMarks = $scope.data.bookmarks;
        $scope.isChainAdminMenuPresent = _.where(adminMenuData.menus, {menu_name: "Chain"});

		$scope.bookmarkIdList = [];
		for (var i = 0; i < $scope.data.bookmarks.length; i++) {
			$scope.bookmarkIdList.push($scope.data.bookmarks[i].id);
		}

		if ($scope.isHotelAdmin) {
			$scope.getLanguage();
		} else {
			$translate.use('EN');
		}


		// if there is any error occured
		$scope.$on("showErrorMessage", function($event, errorMessage) {
			$event.stopPropagation();
			$scope.errorMessage = errorMessage;

		});

		$scope.$on("navToggled", function() {
			$scope.menuOpen = !$scope.menuOpen;
			$scope.showSubMenu = false;
		});

		$scope.isMenuOpen = function() {
			return $scope.menuOpen ? true : false;
		};


		$scope.$on("showLoader", function() {
			$scope.hasLoader = true;
		});

		$scope.$on("hideLoader", function() {
			$scope.hasLoader = false;
		});

        /*
        *  Handle inline styles inside ng-bind-html directive.
        *  Let   =>  $scope.htmlData = "<p style='font-size:8pt;''>Sample Text</p>";
        *  Usage =>  <td data-ng-bind-html="trustAsHtml(htmlData)"></td>
        *  REF   =>  https://docs.angularjs.org/api/ng/service/$sce
        */
        $rootScope.trustHtml = function(str) {
            return $sce.trustAsHtml(str);
        };


		/**
		    *   Method to go back to previous state.
		    */
		$scope.goBackToPreviousState = function() {

			    if ($rootScope.previousStateParam) {
			      $state.go($rootScope.previousState, { menu: $rootScope.previousStateParam});
			    }
			    else if ($rootScope.previousState) {
			      $state.go($rootScope.previousState);
			    }
			    else
			    {
			      $state.go('admin.dashboard', {menu: 0});
			    }

		  	};


	  	$rootScope.$on('ngDialog.opened', function(e, $dialog) {
	        LastngDialogId = $dialog.attr('id');
	        // to add stjepan's popup showing animation
	        $rootScope.modalOpened = false;
	        $timeout(function() {
	            $rootScope.modalOpened = true;
	        }, 300);
	    });


	    var MENU_SCROLLER = 'MENU_SCROLLER';
	    var setupScrolls = function() {
	      var scrollerOptions = {
	        tap: true,
	        preventDefault: false,
	        showScrollbar: true
	      };

	      $scope.setScroller(MENU_SCROLLER, scrollerOptions);
	    };

	    setupScrolls();
	    var refreshScroll = function(name, reset) {
	      $scope.refreshScroller(name);
	      /**/
	      if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
	          $scope.myScroll[name].scrollTo(0, 0, 100);
	      }
	    };

	    $scope.refreshMenuScroll = function(reset) {
	      refreshScroll(MENU_SCROLLER, reset);
	    };

        $rootScope.showTimeoutError = function() {
            $scope.$emit('hideLoader');
            ngDialog.open({
                template: '/assets/partials/errorPopup/rvTimeoutError.html',
                className: 'ngdialog-theme-default1 modal-theme1',
                controller: 'ADTimeoutErrorCtrl',
                closeByDocument: false,
                scope: $scope
            });
        };

        $scope.logout = function() {
            var redirUrl = '/logout/';

            $timeout(function() {
                $window.location.href = redirUrl;
            }, 300);
        };

        $scope.disableFeatureInNonDevEnv = sntapp.environment === 'PROD';

        /**
         * [findMainMenuIndex find the main menu index for highlighting]
         * @param  {[string]} mainMenuName [description]
         * @return {[integer]}              [description]
         */
        $scope.findMainMenuIndex = function(mainMenuName) {
            var index = _.indexOf($scope.data.menus, _.find($scope.data.menus, function(menu) {
                return menu.menu_name === mainMenuName;
            }));
            
            // if index is not defined, set it as current selected index
            index = _.isUndefined(index) ? $scope.selectedIndex : index;
            return index;
        };
}]);
