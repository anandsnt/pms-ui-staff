sntRover.controller('roverController', ['$rootScope', '$scope', '$state', '$window', 'RVDashboardSrv', 'RVHotelDetailsSrv', 'ngDialog', '$translate', 'hotelDetails', 'userInfoDetails', 'RVChargeItems', '$stateParams',
  function($rootScope, $scope, $state, $window, RVDashboardSrv, RVHotelDetailsSrv, ngDialog, $translate, hotelDetails, userInfoDetails, RVChargeItems, $stateParams) {
    $rootScope.isOWSErrorShowing = false;    
    if (hotelDetails.language) {
      $translate.use(hotelDetails.language.value);
      $translate.fallbackLanguage('EN');
      /* For reason unclear, the fallback translation does not trigger
       * unless a translation is requested explicitly, for second screen
       * onwards.
       * TODO: Fix this bug in ng-translate and implement in this here.
       */
      setTimeout(function() {
        $translate('NA');
      }, 1000); //Word around.
    } else {
      $translate.use('EN');
    };

    /*
     * To close drawer on click inside pages
     */
    $scope.closeDrawer = function(event) {
      $scope.menuOpen = false;
    };
	$scope.isAddToGuestCardEnabledDuringCheckin = false;
	 $scope.$on('UPDATE_ADD_TO_GUEST_ON_CHECKIN_FLAG', function(e, value){
	 	$scope.isAddToGuestCardEnabledDuringCheckin = value;
	 });
    $scope.roverFlags = {};
    $scope.hotelDetails = hotelDetails;
    //set current hotel details
    $scope.currentHotelData = {
      "name":"",
      "id":""
    };    
    angular.forEach($scope.hotelDetails.userHotelsData.hotel_list, function(hotel, index) {
          if($scope.hotelDetails.userHotelsData.current_hotel_id === hotel.hotel_id){
             $scope.currentHotelData.name = hotel.hotel_name;
             $scope.currentHotelData.id   = hotel.hotel_id;
             $scope.hotelDetails.userHotelsData.hotel_list.splice(index,1);
          };
    });


    //Used to add precison in amounts
    $rootScope.precisonZero = 0;
    $rootScope.precisonTwo = 2;
    //To get currency symbol - update the value with the value from API see fetchHotelDetailsSuccessCallback
    $rootScope.currencySymbol = "";
    $scope.showSubMenu = false;
    $scope.activeSubMenu = [];
    $rootScope.isStandAlone = false;

    $rootScope.shortDateFormat = "MM/yy"; //05/99
    $rootScope.dayInWeek = "EEE"; //Sun
    $rootScope.dayInMonth = "dd"; //01
    $rootScope.monthInYear = "MMM"; //Jan
    // Use below standard date formatter in the UI.
    $rootScope.mmddyyyyFormat = "MM-dd-yyyy"; //01-22-2014
    $rootScope.mmddyyyyBackSlashFormat = "dd/MM/yyyy"; //01-22-2014
    $rootScope.fullDateFormat = "EEEE, d MMMM yyyy"; //Wednesday, 4 June 2014
    $rootScope.dayAndDate = "EEEE MM-dd-yyyy"; //Wednesday 06-04-2014
    $rootScope.fullDateFullMonthYear = "dd MMMM yyyy";
    $rootScope.dayAndDateCS = "EEEE, MM-dd-yyyy"; //Wednesday, 06-04-2014
    $rootScope.dateFormatForAPI = "yyyy-MM-dd";
    $rootScope.shortMonthAndDate = "MMM dd";
    $rootScope.monthAndDate = "MMMM dd";
    $rootScope.fullMonth = "MMMM";
    $rootScope.fullYear = "yyyy";
    $rootScope.fulldayInWeek = "EEEE";
    $rootScope.fullMonthFullDayFullYear = "MMMM dd, yyyy"; //January 06, 2014
    $rootScope.isCurrentUserChangingBussinessDate = false;
    $rootScope.termsAndConditionsText = hotelDetails.terms_and_conditions;
    /*
     * hotel Details
     */

    $rootScope.isLateCheckoutTurnedOn = hotelDetails.late_checkout_settings.is_late_checkout_on;
    $rootScope.businessDate = hotelDetails.business_date;
    $rootScope.currencySymbol = getCurrencySign(hotelDetails.currency.value);
    $rootScope.dateFormat = getDateFormat(hotelDetails.date_format.value);
    $rootScope.jqDateFormat = getJqDateFormat(hotelDetails.date_format.value);
    $rootScope.MLImerchantId = hotelDetails.mli_merchant_id;
    $rootScope.isQueuedRoomsTurnedOn = hotelDetails.housekeeping.is_queue_rooms_on;

    $rootScope.isManualCCEntryEnabled = hotelDetails.is_allow_manual_cc_entry;
    // $rootScope.isManualCCEntryEnabled = false;
    $rootScope.paymentGateway = hotelDetails.payment_gateway;
    $rootScope.isHourlyRateOn = hotelDetails.is_hourly_rate_on;
    $rootScope.isAddonOn = hotelDetails.is_addon_on;
    //set MLI Merchant Id
    try {
      sntapp.MLIOperator.setMerChantID($rootScope.MLImerchantId);
    } catch (err) {};
    $rootScope.isSingleDigitSearch = hotelDetails.is_single_digit_search;


    //handle six payment iFrame communication
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, function(e) {
      var responseData = e.data;
      if (responseData.response_message == "token_created") {
        $scope.$broadcast('six_token_recived', {
          'six_payment_data': responseData
        });
        $scope.$digest();
      }
      // if (responseData.response_message == "error_on_token_creation") {
        // $scope.$broadcast('six_token_recived',{'six_payment_data':responseData});
      // }
    }, false);

    //set flag if standalone PMS
    if (hotelDetails.pms_type === null) {
      $rootScope.isStandAlone = true;
    };

    /*
     * retrieve user info
     */
    $scope.userInfo = userInfoDetails;
    $scope.isPmsConfigured = $scope.userInfo.is_pms_configured;
    $rootScope.adminRole = $scope.userInfo.user_role;
    $rootScope.isHotelStaff = $scope.userInfo.is_staff;

    // self executing check
    $rootScope.isMaintenanceStaff = (function(roles) {
      // Values taken form DB
      var FLO_STF    = 'floor_&_maintenance_staff',
          FLO_STF_ID = 11,
          isFloStf   = false;

      isFloStf = _.find(roles, function(item) {
        return item.id === FLO_STF_ID || item.name === FLO_STF;
      });

      return isFloStf ? true : false;
    })(hotelDetails.current_user.roles);

    $rootScope.isMaintenanceManager = (function(roles) {
      // Values taken form DB
      var FLO_MGR    = 'floor_&_maintenance_manager',
          FLO_MGR_ID = 10,
          isFloMgr   = false;

      isFloMgr = _.find(roles, function(item) {
        return item.id === FLO_MGR_ID || item.name === FLO_MGR;
      });

      return isFloMgr ? true : false;
    })(hotelDetails.current_user.roles);

    $rootScope.$on('bussinessDateChanged', function(e, newBussinessDate) {
      $scope.userInfo.business_date = newBussinessDate;
    });

    //Default Dashboard
    $rootScope.default_dashboard = hotelDetails.current_user.default_dashboard;
    $rootScope.userName = userInfoDetails.first_name + ' ' + userInfoDetails.last_name;
    $rootScope.userId = hotelDetails.current_user.id;


    $scope.isDepositBalanceScreenOpened = false;
    $scope.$on("UPDATE_DEPOSIT_BALANCE_FLAG", function(e, value) {
      $scope.isDepositBalanceScreenOpened = value;
    });
    $scope.isCancelReservationPenaltyOpened = false;
    $scope.$on("UPDATE_CANCEL_RESERVATION_PENALTY_FLAG", function(e, value) {
      $scope.isCancelReservationPenaltyOpened = value;
    });
    $scope.isStayCardDepositScreenOpened = false;
    $scope.$on("UPDATE_STAY_CARD_DEPOSIT_FLAG", function(e, value) {
      $scope.isStayCardDepositScreenOpened = value;
    });
    $scope.searchBackButtonCaption = '';

    /**
     * reciever function used to change the heading according to the current page
     * if there is any trnslation, please use that
     * param1 {object}, javascript event
     * param2 {String}, Backbutton's caption
     */
    $scope.$on("UpdateSearchBackbuttonCaption", function(event, caption) {
      event.stopPropagation();
      //chnaging the heading of the page
      $scope.searchBackButtonCaption = caption; //if it is not blank, backbutton will show, otherwise dont
    });

    if ($rootScope.adminRole == "Hotel Admin")
      $scope.isHotelAdmin = true;

    var getDefaultDashboardState = function() {
      var statesForDashbaord = {
        'HOUSEKEEPING': 'rover.dashboard.housekeeping',
        'FRONT_DESK': 'rover.dashboard.frontoffice',
        'MANAGER': 'rover.dashboard.manager'
      };
      return statesForDashbaord[$rootScope.default_dashboard];
    };

    if ($rootScope.isStandAlone && $rootScope.default_dashboard ==="MANAGER") {
      // OBJECT WITH THE MENU STRUCTURE
      $scope.menu = [{
          title: "MENU_DASHBOARD",
          action: getDefaultDashboardState(),
          menuIndex: "dashboard",
          submenu: [],
          iconClass: "icon-dashboard"
        },
        // {
        //   title: "MENU_AVAILABILITY",
        //   action: "",
        //   iconClass: "icon-availability",
        //   submenu: [{
        //     title: "MENU_HOUSE_STATUS",
        //     action: ""
        //   }, {
        //     title: "MENU_AVAILABILITY",
        //     action: ""
        //   }]
        // }, 
        {
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
            hidden: !$rootScope.isHourlyRateOn,
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
            hidden: $rootScope.isHourlyRateOn

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

      // menu for mobile views
      $scope.mobileMenu = [{
        title: "MENU_DASHBOARD",
        action: getDefaultDashboardState(),
        menuIndex: "dashboard",
        iconClass: "icon-dashboard"
      }, {
        title: "MENU_ROOM_STATUS",
        action: "rover.housekeeping.roomStatus",
        menuIndex: "roomStatus",
        iconClass: "icon-housekeeping",
        hidden: $rootScope.default_dashboard == 'FRONT_DESK'
      }];


      if(!hotelDetails.is_auto_change_bussiness_date){
          var eodSubMenu = {
            title: "MENU_END_OF_DAY",
            action: "",
            actionPopup: true,
            menuIndex: "endOfDay"
          }
          angular.forEach($scope.menu, function(menu, index) {
              if(menu.title === 'MENU_FRONT_DESK'){
                menu.submenu.push(eodSubMenu)
              }
          });
       }     

    } else {
      // OBJECT WITH THE MENU STRUCTURE
      $scope.menu = [{
        title: "MENU_DASHBOARD",
        action: getDefaultDashboardState(),
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
        hidden: $scope.userInfo.user_role == "Floor & Maintenance Staff"
      }];

      // menu for mobile views
      $scope.mobileMenu = [{
        title: "MENU_DASHBOARD",
        action: getDefaultDashboardState(),
        menuIndex: "dashboard",
        iconClass: "icon-dashboard"
      }, {
        title: "MENU_ROOM_STATUS",
        action: "rover.housekeeping.roomStatus",
        menuIndex: "roomStatus",
        iconClass: "icon-housekeeping",
        hidden: $rootScope.default_dashboard == 'FRONT_DESK'
      }];

    }

    $rootScope.updateSubMenu = function(idx, item) {
      if (item && item.submenu && item.submenu.length > 0) {
        $scope.showSubMenu = true;
        $scope.activeSubMenu = item.submenu;
      } else if (item && item[1] && item[1].submenu && item[1].submenu.length > 0) {
        $scope.showSubMenu = true;
        $scope.activeSubMenu = item[1].submenu;
      } else {
        $scope.showSubMenu = false;
        $scope.activeSubMenu = [];
        $scope.toggleDrawerMenu();
      }
    };

    $scope.$on("updateSubMenu", function(idx, item) {
      $rootScope.updateSubMenu(idx, item);
    });

    $scope.$on("closeDrawer", function() {
      $scope.menuOpen = false;
      $scope.isMenuOpen();
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

    /**
     * in case of we want to reinitialize left menu based on new $rootScope values or something
     * which set during it's creation, we can use
     */
    $scope.$on('refreshLeftMenu', function(event) {
      setupLeftMenu();
    });

    $scope.init = function() {
      BaseCtrl.call(this, $scope);
      $rootScope.adminRole = '';
      $scope.selectedMenuIndex = 0;

      // if menu is open, close it
      $scope.isMenuOpen();
      $scope.menuOpen = false;
    };
    $scope.init();

    /*
     * update selected menu class
     */
    $scope.$on("updateRoverLeftMenu", function(e, value) {
      $scope.selectedMenuIndex = value;
    });


    /*
     * toggle action of drawer
     */
    $scope.toggleDrawerMenu = function(e) {
      if ( !!e ) {
        e.stopPropagation();
      };

      $scope.menuOpen = !$scope.menuOpen;
      $scope.showHotelSwitchList = false;
    };
    $scope.closeDrawerMenu = function() {
      $scope.menuOpen = false;
    };


    $scope.fetchAllItemsSuccessCallback = function(data) {
      $scope.$emit('hideLoader');

      $scope.fetchedData = data;

      ngDialog.open({
        template: '/assets/partials/postCharge/outsidePostCharge.html',
        controller: 'RVOutsidePostChargeController',
        scope: $scope
      });
    };
    $scope.subMenuAction = function(subMenu) {
      $scope.toggleDrawerMenu();
      if (subMenu === "postcharges") {
        $scope.invokeApi(RVChargeItems.fetchAllItems, '', $scope.fetchAllItemsSuccessCallback);

      }
      if (subMenu === "endOfDay") {
        ngDialog.open({
          template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
          controller: 'RVEndOfDayModalController',
          className: 'end-of-day-popup ngdialog-theme-plain'
        });
      }
    };

    //in order to prevent url change(in rover specially coming from admin/or fresh url entering with states)
    //(bug fix to) https://stayntouch.atlassian.net/browse/CICO-7975

    var routeChange = function(event, newURL) {
      event.preventDefault();
      return;
    };

    $rootScope.$on('$locationChangeStart', routeChange);
    window.history.pushState("initial", "Showing Dashboard", "#/"); //we are forcefully setting top url, please refer routerFile

    //
    // DEPRICATED!
    // since custom event emit and listning is breaking the
    // ng-animation associated with ui-view change
    //
    // REASON: There is a limited amount of time b/w the two $scopes dies and come into existance
    // '$emit' and '$on' somehow get more priority, by the time they are execured, $scopes have shifted
    // thus cancelling out animation, feels like animations are never considered 
    //
    // $scope.$on("navToggled", function() {
    //   $scope.menuOpen = !$scope.menuOpen;
    //   $scope.showSubMenu = false;
    // });

    //when state change start happens, we need to show the activity activator to prevent further clicking
    //this will happen when prefetch the data
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      // Show a loading message until promises are not resolved
      $scope.$emit('showLoader');

      // if menu is open, close it
      if ($scope.menuOpen) {
        $scope.menuOpen = !$scope.menuOpen;
        $scope.showSubMenu = false;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(e, curr, currParams, from, fromParams) {
      // Hide loading message
      $scope.$emit('hideLoader');
      $rootScope.previousState = from;
      $rootScope.previousStateParams = fromParams;


    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // Hide loading message
      $scope.$emit('hideLoader');
      //TODO: Log the error in proper way
    });

    $scope.settingsClicked = function() {
      if ($scope.isHotelAdmin) {
        //CICO-9816 bug fix
        $('body').addClass('no-animation');

        $scope.selectedMenuIndex = "settings";
        $window.location.href = "/admin";
      } else if ($scope.isHotelStaff) {
        ngDialog.open({
          template: '/assets/partials/settings/rvStaffSettingModal.html',
          controller: 'RVStaffsettingsModalController',
          className: 'calendar-modal'
        });
      }
    };
    //This variable is used to identify whether guest card is visible
    //Depends on $scope.guestCardVisible in rvguestcardcontroller.js
    $scope.isGuestCardVisible = false;
    $scope.$on('GUESTCARDVISIBLE', function(event, data) {
      $scope.isGuestCardVisible = false;
      if (data) {
        $scope.isGuestCardVisible = true;
      }
    });

    $scope.successCallBackSwipe = function(data) {
      // $scope.$broadcast('SWIPEHAPPENED', data);      
      $scope.$broadcast('SWIPE_ACTION', data);
    };

    $scope.failureCallBackSwipe = function() {};

    var options = {};
    options["successCallBack"] = $scope.successCallBackSwipe;
    options["failureCallBack"] = $scope.failureCallBackSwipe;

    $scope.numberOfCordovaCalls = 0;

    $scope.initiateCardReader = function() {
      if (sntapp.cardSwipeDebug === true) {
        sntapp.cardReader.startReaderDebug(options);
        return;
      }

      if ((sntapp.browser == 'rv_native') && sntapp.cordovaLoaded) {
        setTimeout(function() {
          sntapp.cardReader.startReader(options);
        }, 2000);
      } else {
        //If cordova not loaded in server, or page is not yet loaded completely
        //One second delay is set so that call will repeat in 1 sec delay
        if ($scope.numberOfCordovaCalls < 50) {
          setTimeout(function() {
            $scope.numberOfCordovaCalls = parseInt($scope.numberOfCordovaCalls) + parseInt(1);
            $scope.initiateCardReader();
          }, 2000);
        }
      }
    };

    /*
     * Start Card reader now!.
     * Time out is to call set Browser
     */
    if ($rootScope.paymentGateway != "sixpayments") {
      setTimeout(function() {
        $scope.initiateCardReader();
      }, 2000);
    }


    /*
     * To show add new payment modal
     * @param {{passData}} information to pass to popup - from view, reservationid. guest id userid etc
     * @param {{object}} - payment data - used for swipe
     */
    /* $scope.showAddNewPaymentModal = function(passData, paymentData) {
       $scope.passData = passData;
       $scope.paymentData = paymentData;
       $scope.guestInformationsToPaymentModal = $scope.guestInfoToPaymentModal;
       ngDialog.open({
         template: '/assets/partials/payment/rvPaymentModal.html',
         controller: 'RVPaymentMethodCtrl',
         scope: $scope
       });
     };*/
    /*
     * Call payment after CONTACT INFO
     */
    $scope.$on('GUESTPAYMENTDATA', function(event, paymentData) {

      $scope.$broadcast('GUESTPAYMENT', paymentData);
    });

    $scope.$on('SHOWGUESTLIKES', function(event) {
      $scope.$broadcast('SHOWGUESTLIKESINFO');
    });
    $scope.guestInfoToPaymentModal = {};
    $scope.$on('SETGUESTDATA', function(event, guestData) {
      $scope.guestInfoToPaymentModal = guestData;

    });
    /*
     * Tp close dialog box
     */
    $scope.closeDialog = function() {
      document.activeElement.blur();
      $scope.$emit('hideLoader');
      setTimeout(function() {
        ngDialog.close();
        window.scrollTo(0, 0);
        $scope.$apply();
      }, 700);
    };
    /*
     * To fix issue with ipad keypad - 7702
     */
    $scope.setPosition = function() {
      if (document.activeElement.nodeName !== 'INPUT' && document.activeElement.nodeName !== 'SELECT') {
        document.activeElement.blur();
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 700);
      }
    };

    /**
     * Handles the OWS error - Shows a popup having OWS connection test option
     */
    $rootScope.showOWSError = function() {

      // Hide loading message
      $scope.$emit('hideLoader');
      if (!$rootScope.isOWSErrorShowing) {
        $rootScope.isOWSErrorShowing = true;
        ngDialog.open({
          template: '/assets/partials/housekeeping/rvHkOWSError.html',
          className: 'ngdialog-theme-default1 modal-theme1',
          controller: 'RVHKOWSErrorCtrl',
          closeByDocument: false,
          scope: $scope
        });
      }
    };

    /**
     * Handles the bussiness date change in progress
     */

    var LastngDialogId = "";

    $scope.closeBussinnesDatePopup = function() {
      ngDialog.close(LastngDialogId, "");
    };

    $rootScope.$on('ngDialog.opened', function(e, $dialog) {
      LastngDialogId = $dialog.attr('id');
    });

    $rootScope.showBussinessDateChangingPopup = function() {

      // Hide loading message
      $scope.$emit('hideLoader');
      //if already shown no need to show again and again
      if (!$rootScope.isBussinessDateChanging && $rootScope.isStandAlone && !$rootScope.isCurrentUserChangingBussinessDate) {
        $rootScope.isBussinessDateChanging = true;
        var $dialog = ngDialog.open({
          template: '/assets/partials/common/bussinessDateChangingPopup.html',
          className: 'ngdialog-theme-default1 modal-theme1',
          controller: 'bussinessDateChangingCtrl',
          closeByDocument: false,
          scope: $scope
        });
      }
    };

    $rootScope.$on('bussinessDateChangeInProgress', function() {
      $rootScope.showBussinessDateChangingPopup();
    });

    $scope.goToDashboard = function() {
      ngDialog.close();
      // to reload app in case the bussiness date is changed
      // $state.go('rover.dashboard', {}, {reload: true});
      $window.location.reload();
    };

    /**
     * Handles the bussiness date change completion
     */
    $rootScope.showBussinessDateChangedPopup = function() {
      $rootScope.isBussinessDateChanging = false;
      // Hide loading message
      $scope.$emit('hideLoader');
      if (!$rootScope.isBussinessDateChanged) {
        $rootScope.isBussinessDateChanged = true;
        ngDialog.open({
          template: '/assets/partials/common/rvBussinessDateChangedPopup.html',
          className: 'ngdialog-theme-default1 modal-theme1',
          closeByDocument: false,
          scope: $scope
        });
      }
    };



    /**
     * function to execute on clicking latecheckout button
     */
    $scope.clickedOnHeaderLateCheckoutIcon = function(event) {
      if ($rootScope.default_dashboard != 'HOUSEKEEPING') {
        var type = "LATE_CHECKOUT";
        $state.go('rover.search', {
          'type': type,
          'from_page': 'DASHBOARD'
        });
      }
    };

    $scope.clickedOnQueuedRoomsIcon = function(event) {
      if ($rootScope.default_dashboard == 'HOUSEKEEPING') {
        $state.go('rover.housekeeping.roomStatus', {
          'roomStatus': 'QUEUED_ROOMS'
        });
      } else {
        $state.go('rover.search', {
          'type': 'QUEUED_ROOMS',
          'from_page': 'DASHBOARD'
        });
      }
    };

    $scope.$on('UPDATE_QUEUE_ROOMS_COUNT', function(event, data) {
      if (data == "remove") {
        $scope.userInfo.queue_rooms_count = parseInt($scope.userInfo.queue_rooms_count) - parseInt(1);
      } else {
        $scope.userInfo.queue_rooms_count = parseInt($scope.userInfo.queue_rooms_count) + parseInt(1);
      }

    });

    $scope.openPaymentDialogModal = function(passData, paymentData) {
      $scope.passData = passData;
      $scope.paymentData = paymentData;
      // $scope.guestInformationsToPaymentModal = $scope.guestInfoToPaymentModal;
      ngDialog.open({
        template: '/assets/partials/roverPayment/rvAddPayment.html',
        controller: 'RVPaymentAddPaymentCtrl',
        scope: $scope
      });
    };
    
    $scope.redirectToHotel = function(hotel_id) {
          RVHotelDetailsSrv.redirectToHotel(hotel_id).then(function(data) {
            $('body').addClass('no-animation');
            $window.location.href = "/staff";
          }, function() {
          });
    };    
}]);
