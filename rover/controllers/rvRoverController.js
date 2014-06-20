sntRover.controller('roverController', ['$rootScope', '$scope', '$state', '$window', 'RVDashboardSrv', 'RVHotelDetailsSrv', 'ngDialog', '$translate','hotelDetails','userInfoDetails',
  function($rootScope, $scope, $state, $window, RVDashboardSrv, RVHotelDetailsSrv, ngDialog, $translate,hotelDetails,userInfoDetails) {
    
    // this is make sure we add an
    // additional class 'return-back' as a
    // parent to ui-view, so as to apply a
    // reverse slide animation
    var uiViewRevAnim = $scope.$on( '$stateChangeSuccess', function (event, toState, toStateData, fromState, fromStateData) {

      // check this template for the applied class:
      // app/assets/rover/partials/staycard/rvStaycard.html

      // hopefully this will be the only place to toggle class
      // as long as the current router definition stands

      // FUTURE: this check can include other state name also,
      // from which while returning we expect a reverse slide
      if ( fromState.name === 'rover.staycard.billcard' ) {
        $rootScope.returnBack = true;
      } else {
        $rootScope.returnBack = false;
      }
    });

    // make sure you also destroy 'uiViewRevAnim'
    // when moving away to release memory
    $scope.$on( '$destroy', uiViewRevAnim );
    
    //Used to add precison in amounts
    $rootScope.precisonZero = 0;
    $rootScope.precisonTwo = 2;
    //To get currency symbol - update the value with the value from API see fetchHotelDetailsSuccessCallback
    $rootScope.currencySymbol = "";
    $scope.showSubMenu = false;
    $scope.activeSubMenu = [];
    $scope.isStandAlone = false;

    $rootScope.shortDateFormat = "MM/yy"; //05/99
    $rootScope.dayInWeek = "EEE"; //Sun
    $rootScope.dayInMonth = "dd"; //01
    $rootScope.monthInYear = "MMM"; //Jan
    $rootScope.mmddyyyyFormat = "MM-dd-yyyy"; //01-22-2014
    $rootScope.fullDateFormat = "EEEE, d MMMM yyyy"; //Wednesday, 4 June 2014
    $rootScope.dayAndDate = "EEEE MM-dd-yyyy"; //Wednesday 06-04-2014
    $rootScope.fullDateFullMonthYear = "dd MMMM yyyy";

      /*
     * hotel Details 
     */
    
    $rootScope.businessDate = hotelDetails.business_date;
    $rootScope.currencySymbol = getCurrencySign(hotelDetails.currency.value);
    if (hotelDetails.language){
      $translate.use(hotelDetails.language.value);
    }
    else{
      $translate.use('EN');
    };
    //set flag if standalone PMS
    if (hotelDetails.pms_type === null){
       $scope.isStandAlone = true;
    };

 /*
 * retrieve user info
 */
    $scope.userInfo = userInfoDetails;
    $scope.isPmsConfigured = $scope.userInfo.is_pms_configured;
    $rootScope.adminRole = $scope.userInfo.user_role;
    $rootScope.isHotelStaff = $scope.userInfo.is_staff;
    if ($rootScope.adminRole == "Hotel Admin")
      $scope.isHotelAdmin = true;
  

    // OBJECT WITH THE MENU STRUCTURE
    $scope.menu = [{
      title: "MENU_DASHBOARD",
      action: "rover.dashboard",
      menuIndex: "dashboard",
      submenu: [],
      iconClass: "icon-dashboard"
    }, {
      title: "MENU_SEARCH",
      action: "rover.search",
      menuIndex: "search",
      submenu: [],
      iconClass: "icon-dashboard"
    }, {
      title: "MENU_AVAILABILITY",
      action: "",
      iconClass: "icon-availability",
      submenu: [{
        title: "MENU_HOUSE_STATUS",
        action: ""
      }, {
        title: "MENU_AVAILABILITY",
        action: ""
      }]
    }, {
      title: "MENU_FRONT_DESK",
      //hidden: true,
      action: "",
      iconClass: "icon-frontdesk",
      submenu: [{
        title: "MENU_CREATE_RESERVATION",
        action: "rover.reservation.search",
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
        title: "MENU_HOUSEKEEPING",
        action: ""
      }, {
        title: "MENU_TASK_MANAGEMENT",
        action: ""
      }, {
        title: "MENU_MAINTAENANCE",
        action: ""
      }]
    }, {
      title: "MENU_FINANCIALS",
      //hidden: true,
      action: "",
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
      action: "",
      iconClass: "icon-reports",
      submenu: []
    }];

    $scope.$on("updateSubMenu", function(idx, item) {
      if (item && item[1] && item[1].submenu && item[1].submenu.length > 0) {
        $scope.showSubMenu = true;
        $scope.activeSubMenu = item[1].submenu;
      } else {
        $scope.activeSubMenu = [];
        $scope.$emit("navToggled");
      }
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
    $scope.$on("navToggled", function() {
      $scope.menuOpen = !$scope.menuOpen;
      $scope.showSubMenu = false;
    });

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

    $rootScope.$on('$stateChangeSuccess', function(e, curr, prev) {
      // Hide loading message
      $scope.$emit('hideLoader');
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // Hide loading message
      $scope.$emit('hideLoader');
      //TODO: Log the error in proper way
    });

    $scope.settingsClicked = function() {
      if ($scope.isHotelAdmin) {
        $scope.selectedMenuIndex = "settings";
        $window.location.href = "/admin";
      } else if ($scope.isHotelStaff) {
        ngDialog.open({
          template: '/assets/partials/settings/rvStaffSettingModal.html',
          controller: 'RVStaffsettingsModalController',
          className: 'ngdialog-theme-plain calendar-modal'
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
      $scope.$broadcast('SWIPEHAPPENED', data);
    };

    $scope.failureCallBackSwipe = function() {};

    var options = [];
    options["successCallBack"] = $scope.successCallBackSwipe;
    options["failureCallBack"] = $scope.failureCallBackSwipe;
    
    setTimeout(function() {
      if (sntapp.cardSwipeDebug === true) {
        sntapp.cardReader.startReaderDebug(options);
      }
      if (sntapp.cordovaLoaded) {
        sntapp.cardReader.startReader(options);
      };
    }, 2000);
    /*
     * To show add new payment modal
     * @param {{passData}} information to pass to popup - from view, reservationid. guest id userid etc
     * @param {{object}} - payment data - used for swipe
     */
    $scope.showAddNewPaymentModal = function(passData, paymentData) {
      $scope.passData = passData;
      $scope.paymentData = paymentData;
      ngDialog.open({
        template: '/assets/partials/payment/rvPaymentModal.html',
        controller: 'RVPaymentMethodCtrl',
        scope: $scope
      });
    };
    /*
     *
     */
    $scope.$on('GUESTPAYMENTDATA', function(event, paymentData) {
      $scope.$broadcast('GUESTPAYMENT', paymentData);
    });
    /*
     * Tp close dialog box
     */
    $scope.closeDialog = function() {
      $scope.$emit('hideLoader');
      ngDialog.close();
    };

  }
]);