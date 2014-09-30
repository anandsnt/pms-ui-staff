admin.controller('ADAppCtrl', ['$state', '$scope', '$rootScope', 'ADAppSrv', '$stateParams', '$window', '$translate', 'adminMenuData',
	function($state, $scope, $rootScope, ADAppSrv, $stateParams, $window, $translate, adminMenuData) {

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
						title: "MENU_ROOM_ASSIGNMENT",
						action: ""
					}, {
						title: "MENU_POST_CHARGES",
						action: ""
					}, {
						title: "MENU_CASHIER",
						action: ""
					}, {
						title: "MENU_END_OF_DAY",
						action: ""
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
						action: "staff#/staff/housekeeping/roomStatus/",
						menuIndex: "roomStatus"
					}, {
						title: "MENU_TASK_MANAGEMENT",
						action: ""
					}, {
						title: "MENU_MAINTAENANCE",
						action: ""
					}]
				}, {
					title: "MENU_FINANCIALS",
					action: "#",
					iconClass: "icon-finance",
					submenu: [{
						title: "MENU_REVENUE",
						action: ""
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
					iconClass: "icon-reports",
					submenu: []
				}];
			} else {
					$scope.menu = [{
					title: "MENU_DASHBOARD",
					action: "staff#/staff/dashboard/",
					menuIndex: "dashboard",
					submenu: [],
					iconClass: "icon-dashboard"
				}, {
					title: "MENU_SEARCH",
					action: "staff#/staff/search/",
					menuIndex: "search",
					submenu: [],
					iconClass: "icon-dashboard"
				}, {
					title: "MENU_HOUSEKEEPING",
					//hidden: true,
					action: "",
					iconClass: "icon-housekeeping",
					submenu: [{
						title: "MENU_ROOM_STATUS",
						action: "staff#/staff/housekeeping/roomStatus/",
						menuIndex: "roomStatus"
					}, {
						title: "MENU_TASK_MANAGEMENT",
						action: ""
					}, {
						title: "MENU_MAINTAENANCE",
						action: ""
					}]
				},{
					title: "MENU_REPORTS",
					action: "staff#/staff/reports",
					iconClass: "icon-reports",
					submenu: []
				}];
			}
		}
		
		

		$scope.$on("updateSubMenu", function(idx, item) {
			if (item && item[1] && item[1].submenu) {
				$scope.showSubMenu = true;
				$scope.activeSubMenu = item[1].submenu;
			} else {
				$scope.activeSubMenu = [];
			}
		});

		if ($rootScope.adminRole == "hotel-admin") {
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
					if ($scope.bookmarkIdList.indexOf($scope.data.menus[i].components[j].id) == -1) {
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
					if (copiedBookMarkIds.indexOf($scope.bookmarkIdList[i]) == -1) {
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
					if ($scope.bookmarkIdList.indexOf($scope.bookMarks[i].id) == -1) {
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
			}, 2000);
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
			if (lastDropedTime != '' && typeof lastDropedTime == 'object') {
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
				
				
			//set flag if standalone PMS
			if (data.pms_type === null)
				$scope.isStandAlone = true;
			setupLeftMenu();
			$rootScope.businessDate = data.business_date;
			$rootScope.currencySymbol = getCurrencySign(data.currency.value);
			$rootScope.dateFormat = getDateFormat(data.date_format.value);
		    console.log("currency code   : "+data.currency.value);
		    console.log("currency symbol : "+$rootScope.currencySymbol);
		    console.log("date format     : "+$rootScope.dateFormat);
			$scope.$emit('hideLoader');

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

		$scope.isHotelListOpen = function() {
			$scope.hotelListOpen = ($scope.hotelListOpen == "open") ? "" : "open";
		};
		$scope.redirectToHotel = function(hotel_id) {
			ADAppSrv.redirectToHotel(hotel_id).then(function(data) {
				$window.location.href = "/admin";
			}, function() {
				console.log("error controller");
			});
		};

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
	}
	
	
]);