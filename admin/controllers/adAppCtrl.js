admin.controller('ADAppCtrl', ['$state', '$scope', '$rootScope', 'ADAppSrv', '$stateParams', '$window', '$translate', 'adminMenuData', 'businessDate','$timeout',
	function($state, $scope, $rootScope, ADAppSrv, $stateParams, $window, $translate, adminMenuData, businessDate,$timeout) {

		//hide the loading text that is been shown when entering Admin
		$( ".loading-container" ).hide();

		//when there is an occured while trying to access any menu details, we need to show that errors
		$scope.errorMessage = '';

		BaseCtrl.call(this, $scope);
		$scope.menuOpen = false;
		$scope.hotelListOpen = '';
		$scope.isStandAlone = false;

		$scope.dragStart = false;
		$scope.selectedIndex = 0;
		$scope.dropedElementsModel = []; // model used for drag & drop feature, used for droping menu items displaying area

		//for preventing drag & drop operations turning into click
		var lastDropedTime = '';
		/*
	     * To close drawer on click inside pages
	     */
	    $scope.closeDrawer = function(event){
	    	 $scope.menuOpen = false;
	    };
		//scroller options
		var scrollerOptions = {click: true, scrollbars: true};
		$scope.setScroller('tabs_menu', scrollerOptions);

		$scope.bookMarks = [];

		$rootScope.shortDateFormat = "MM/yy"; //05/99
		$rootScope.dayInWeek = "EEE"; //Sun
		$rootScope.dayInMonth = "dd"; //01
		$rootScope.monthInYear = "MMM"; //Jan
		// Use below standard date formatter in the UI.
		$rootScope.mmddyyyyFormat = "MM-dd-yyyy"; //01-22-2014
		$rootScope.fullDateFormat = "EEEE, d MMMM yyyy"; //Wednesday, 4 June 2014
		$rootScope.dayAndDate = "EEEE MM-dd-yyyy"; //Wednesday 06-04-2014
		$rootScope.fullDateFullMonthYear = "dd MMMM yyyy";
		$rootScope.dayAndDateCS = "EEEE, MM-dd-yyyy";//Wednesday, 06-04-2014
		$rootScope.longDateFormat = "MMM dd, yyyy";//Wednesday, 06-04-2014
		$rootScope.currencySymbol = "";
		// Initialise $rootScope.isHourlyRatesEnabled to false; the value is set on call to api/hotel_settings
		$rootScope.isHourlyRatesEnabled = false;
		//in order to prevent url change(in rover specially coming from admin/or fresh url entering with states)
	    // (bug fix to) https://stayntouch.atlassian.net/browse/CICO-7975

	    $rootScope.businessDate = businessDate;

	    var routeChange = function(event, newURL) {
	      event.preventDefault();
	      return;
	    };

	    $rootScope.$on('$locationChangeStart', routeChange);
	    window.history.pushState("initial", "Showing Admin Dashboard", "#/"); //we are forcefully setting top url, please refer routerFile


		var setupLeftMenu = function(){
			if($scope.isStandAlone){
				$scope.menu = [{
					title: "MENU_DASHBOARD",
					action: "staff#/staff/dashboard/",
					menuIndex: "dashboard",
					submenu: [],
					iconClass: "icon-dashboard"
				},
				// {
				// 	title: "MENU_AVAILABILITY",
				// 	action: "",
				// 	iconClass: "icon-availability",
				// 	submenu: [{
				// 		title: "MENU_HOUSE_STATUS",
				// 		action: ""
				// 	}, {
				// 		title: "MENU_AVAILABILITY",
				// 		action: ""
				// 	}]
				// },
				{
					title: "MENU_FRONT_DESK",
					//hidden: true,
					action: "",
					iconClass: "icon-frontdesk",
					submenu: [
					{
						title: "MENU_SEARCH_RESERVATIONS",
						action: "staff#/staff/search/"
					},
					{
						title: "MENU_CREATE_RESERVATION",
						action: "staff#/staff/staycard/search",
						standAlone : true
					}, {
						title: "MENU_ROOM_DIARY",
						action: "staff#/staff/diary/",
						standAlone: true,
						hidden: !$rootScope.isHourlyRatesEnabled
					}, {
						title: "MENU_POST_CHARGES",
						action: "staff#/staff/dashboard/postCharge"
					}, {
						title: "MENU_CASHIER",
						action: "staff#/staff/financials/journal/2"
					}, {
		            	title: "MENU_ACCOUNTS",
		            	action: "staff#/staff/accounts/search",
		            	menuIndex: "accounts",
		            	hidden: $rootScope.isHourlyRatesEnabled
		       	 	}]
				}, {
			        title: "MENU_GROUPS",
			        //hidden: true,
			        action: "",
			        iconClass: "icon-groups",
			        menuIndex: "menuGroups",
			        hidden: $rootScope.isHourlyRatesEnabled,
			        submenu: [{
			            title: "MENU_CREATE_GROUP",
			            action: "staff#/staff/groups/config/NEW_GROUP/SUMMARY",
			            menuIndex: "menuCreateGroup",
			        }, {
			            title: "MENU_MANAGE_GROUP",
			            action: "staff#/staff/groups/search",
			            menuIndex: "menuManageGroup",
			        }]
		    	},{
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
						action: "staff#/staff/rateManager",
						menuIndex: "rateManager"
					}, {
						title: "MENU_TA_CARDS",
						action: "staff#/staff/cardsearch/",
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
						action: "staff#/staff/housekeeping/roomStatus?businessDate=" + $rootScope.businessDate,
						menuIndex: "roomStatus"
					}, {
						title: "MENU_TASK_MANAGEMENT",
						action: "staff#/staff/workmanagement/start",
						menuIndex: "workManagement",
			            hidden: $rootScope.isHourlyRatesEnabled
					}, {
						title: "MENU_MAINTAENANCE",
						action: ""
					}]
				}, {
					title: "MENU_FINANCIALS",
					action: "#",
					iconClass: "icon-financials",
					submenu: [{
						title: "MENU_JOURNAL",
						action: "staff#/staff/financials/journal/0"
					}, {
						title: "MENU_CC_TRANSACTIONS",
						action: "staff#/staff/financials/ccTransactions/0"
					}, {
						title: "MENU_ACCOUNTING",
						action: ""
					}, {
						title: "MENU_COMMISIONS",
						action: ""
					}]
				}, {
					title: "MENU_REPORTS",
					action: "staff#/staff/reports",
					menuIndex: "reports",
					iconClass: "icon-reports",
					submenu: []
				}];
				// menu for mobile views
				$scope.mobileMenu = [{
				  title: "MENU_DASHBOARD",
				  action: "staff#/staff/dashboard/",
				  menuIndex: "dashboard",
				  submenu: [],
				  iconClass: "icon-dashboard"
				}, {
				  title: "MENU_ROOM_STATUS",
				  action: "staff#/staff/housekeeping/roomStatus/",
				  menuIndex: "roomStatus",
				  submenu: [],
				  iconClass: "icon-housekeeping"
				}];

				if(!$rootScope.is_auto_change_bussiness_date){
			          var eodSubMenu =  {
						title: "MENU_END_OF_DAY",
						action: "staff#/staff/dashboard/changeBussinessDate"
					  };
			          angular.forEach($scope.menu, function(menu, index) {
			              if(menu.title === 'MENU_FRONT_DESK'){
			                menu.submenu.push(eodSubMenu)
			              }
			          });
       			};

			} else {
					$scope.menu = [{
					title: "MENU_DASHBOARD",
					action: "staff#/staff/dashboard/",
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
						action: "staff#/staff/housekeeping/roomStatus?businessDate=" + $rootScope.businessDate,
						menuIndex: "roomStatus"
					}]
				},{
					title: "MENU_REPORTS",
					action: "staff#/staff/reports",
					menuIndex: "reports",
					iconClass: "icon-reports",
					submenu: []
				}];

				// menu for mobile views
				$scope.mobileMenu = [{
				  title: "MENU_DASHBOARD",
				  action: "staff#/staff/dashboard/",
				  menuIndex: "dashboard",
				  iconClass: "icon-dashboard"
				}, {
				  title: "MENU_ROOM_STATUS",
				  action: "rover.housekeeping.roomStatus",
				  menuIndex: "staff#/staff/housekeeping/roomStatus/",
				  submenu: [],
				  iconClass: "icon-housekeeping"
				}];
			}
		};

		/**
		* in case of we want to reinitialize left menu based on new $rootScope values or something
		* which set during it's creation, we can use
		*/
		$scope.$on('refreshLeftMenu', function(event){
			setupLeftMenu();
		});

		$scope.$on("updateSubMenu", function(idx, item) {
			//CICO-9816 Bug fix - When moving to /staff, the screen was showing blank content
			if (item[1].action.split('#')[0] === "staff"){
				$('body').addClass('no-animation');
				$('#admin-header').css({'z-index':'0'});
				$('section.content-scroll').css({'overflow':'visible'});
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
		} else {
			$scope.isHotelAdmin = false;
		}
		$scope.isPmsConfigured = $rootScope.isPmsConfigured;
		$scope.isDragging = false;

		//on drag start we need to show a dotted border on bookmark area
		$scope.onDragStart = function() {
			$scope.isDragging = true;
		};

		//on drag stop we need to hide the dotted border on bookmark area
		$scope.onDragStop = function() {
			$scope.isDragging = false;

			//also we are taking the lastDropedTime to preventing click after drag stop operation
			lastDropedTime = new Date();
		};

		//function to copy the ids of bookmark to a new array
		var copyBookmarkIds = function(arrayToCopy) {
			for (var i = 0; i < $scope.bookMarks.length; i++) {
				arrayToCopy.push($scope.bookMarks[i].id);
			}
		};

		//function to change bookmark status after dropping
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

		//drop function on menu item listing
		$scope.onDropingMenuItemListing = function(event, ui) {
			var index = -1;

			//successcallback of removing menu item
			var successCallbackOfRemovingBookMark = function() {
				$scope.$emit('hideLoader');

				if (index != -1) {
					$scope.bookmarkIdList.splice(index, 1);
					index = -1;
				}
				updateBookmarkStatus();
			};



			var copiedBookMarkIds = [];
			copyBookmarkIds(copiedBookMarkIds);

			if ($scope.bookMarks.length <= $scope.bookmarkIdList.length) {
				for (var i = 0; i < $scope.bookmarkIdList.length; i++) {
					//checking bookmarked id's in copiedBookark id's, if it is no, call web service
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

		//drop function on boomark menu item listing
		$scope.onDropAtBookmarkArea = function(event, ui) {
			var index = -1;
			var successCallbackOfBookMark = function() {
				$scope.$emit('hideLoader');
				if (index != -1) {
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

		/*
		 * function to handle exception when state is not found
		 */
		$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
			event.preventDefault();
			$scope.errorMessage = ['Sorry, the feature you are looking for is not implemented yet'];
			//closing the error message after after 2 seconds
			setTimeout(function() {
				$scope.clearErrorMessage();
				$scope.$apply();
			}, 10000);
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
			if (lastDropedTime != '' && typeof lastDropedTime === 'object') {
				var diff = currentTime - lastDropedTime;
				if (diff <= 400) {
					$event.preventDefault();
					$event.stopImmediatePropagation();
					$event.stopPropagation();
					lastDropedTime = '';
					return false;
				} else {
					lastDropedTime = '';
					$state.go(stateToGo);
				}
			} else {
				lastDropedTime = '';
				$state.go(stateToGo);
			}
			if ($scope.menuOpen) {
				$scope.menuOpen = !$scope.menuOpen;
				$scope.showSubMenu = false;
			}
		};

		$scope.$on("changedSelectedMenu", function(event, menu) {
			$scope.selectedIndex = menu;
		});
		/*
		 * Success callback of get language
		 * @param {object} response
		 */
		$scope.fetchHotelDetailsSuccessCallback = function(data) {

			if (data.language) {
		      $translate.use(data.language.value);
		      $translate.fallbackLanguage('EN');
		      /* For reason unclear, the fallback translation does not trigger
		       * unless a translation is requested explicitly, for second screen
		       * onwards.
		       * TODO: Fix this bug in ng-translate and implement in this here.
		       */
		      setTimeout(function() {
		        $translate('NA')
		      }, 1000); //Word around.
		    } else {
		      $translate.use('EN');
		    };
		    //to hide eod submenu conditionally
			$rootScope.is_auto_change_bussiness_date = data.business_date.is_auto_change_bussiness_date;

			//set flag if standalone PMS
			if (data.pms_type === null)
				$scope.isStandAlone = true;
			$rootScope.currencySymbol = getCurrencySign(data.currency.value);
			$rootScope.dateFormat = getDateFormat(data.date_format.value);
			$scope.$emit('hideLoader');
			$rootScope.isHourlyRatesEnabled = data.is_hourly_rate_on;
			$rootScope.hotelTimeZoneFull = data.hotel_time_zone_full;
			$rootScope.hotelTimeZoneAbbr = data.hotel_time_zone_abbr;

			// CICO-18040
			$rootScope.isFFPActive = data.is_ffp_active;
			$rootScope.isHLPActive = data.is_hlp_active;
			$rootScope.isPromoActive = data.is_promotion_active;

			$rootScope.isRoomStatusImportPerRoomTypeOn = data.is_room_status_import_per_room_type_on ? data.is_room_status_import_per_room_type_on : false;

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
		$scope.$on('hotelNameChanged',function(e,data){
			$scope.data.current_hotel = data.new_name;
		});


        /*
         * Admin menu data
         */


		$scope.data = adminMenuData;
		$scope.selectedMenu = $scope.data.menus[$scope.selectedIndex];
		$scope.bookMarks = $scope.data.bookmarks;

		$scope.bookmarkIdList = [];
		for (var i = 0; i < $scope.data.bookmarks.length; i++) {
			$scope.bookmarkIdList.push($scope.data.bookmarks[i].id);
		}

		if ($scope.isHotelAdmin) {
			$scope.getLanguage();
		}else{
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

		/*$scope.isHotelListOpen = function() {
			$scope.hotelListOpen = ($scope.hotelListOpen === "open") ? "" : "open";
		};
		$scope.redirectToHotel = function(hotel_id) {
			ADAppSrv.redirectToHotel(hotel_id).then(function(data) {
				//CICO-9816 bug fix
				$('body').addClass('no-animation');
				$('#admin-header').css({'z-index':'0'});
				$('section.content-scroll').css({'overflow':'visible'});

				$window.location.href = "/admin";
			}, function() {
			});
		};*/

		/**
		    *   Method to go back to previous state.
		    */
		$scope.goBackToPreviousState = function(){

			    if($rootScope.previousStateParam){
			      $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
			    }
			    else if($rootScope.previousState){
			      $state.go($rootScope.previousState);
			    }
			    else
			    {
			      $state.go('admin.dashboard', {menu : 0});
			    }

		  	};


	  	$rootScope.$on('ngDialog.opened', function(e, $dialog) {
	        LastngDialogId = $dialog.attr('id');
	        //to add stjepan's popup showing animation
	        $rootScope.modalOpened = false;
	        $timeout(function() {
	            $rootScope.modalOpened = true;
	        }, 300);
	    });

}]);
