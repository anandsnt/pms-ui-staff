sntRover.controller('roverController', ['$rootScope', '$scope', '$state', '$window', 'RVDashboardSrv', 'RVHotelDetailsSrv', 'ngDialog', '$translate', 'hotelDetails', 'userInfoDetails',
  function($rootScope, $scope, $state, $window, RVDashboardSrv, RVHotelDetailsSrv, ngDialog, $translate, hotelDetails, userInfoDetails) {
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
        $translate('NA')
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




    /***
     * A method on the $rootScope to determine if the
     * slide animation during stateChange should run in reverse or forward
     *
     * @param {string} fromState - name of the fromState
     * @param {string} toState - name of the toState
     *
     * @return {boolean} - to indicate reverse or not
     */
    $rootScope.shallRevDir = function(fromState, toState) {
      if (fromState === 'rover.housekeeping.roomDetails' && toState === 'rover.housekeeping.roomStatus') {
        return true;
      };

      if (fromState === 'rover.reservation.staycard.reservationcard.reservationdetails' && toState === 'rover.search') {
        return true;
      };

      if (fromState === 'rover.reservation.staycard.billcard' && toState === 'rover.reservation.staycard.reservationcard.reservationdetails') {
        return true;
      };

      if (fromState === 'rover.staycard.nights' && toState === 'rover.reservation.staycard.reservationcard.reservationdetails') {
        return true;
      };

      if (fromState === 'rover.companycarddetails' && toState === 'rover.companycardsearch') {
        return true;
      };

      return false;
    };

    // this is make sure we add an
    // additional class 'return-back' as a
    // parent to ui-view, so as to apply a
    // reverse slide animation
    var uiViewRevAnim = $scope.$on('$stateChangeSuccess', function(event, toState, toStateData, fromState, fromStateData) {

      // check this template for the applied class:
      // app/assets/rover/partials/staycard/rvStaycard.html

      // FUTURE: this check can include other state name also,
      // from which while returning we expect a reverse slide
      if ($rootScope.shallRevDir(fromState.name, toState.name)) {
        $rootScope.returnBack = true;
      } else {
        $rootScope.returnBack = false;
      }
    });

    // make sure you also destroy 'uiViewRevAnim'
    // when moving away to release memory
    $scope.$on('$destroy', uiViewRevAnim);



    $scope.hotelDetails = hotelDetails;

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
    $rootScope.fullDateFormat = "EEEE, d MMMM yyyy"; //Wednesday, 4 June 2014
    $rootScope.dayAndDate = "EEEE MM-dd-yyyy"; //Wednesday 06-04-2014
    $rootScope.fullDateFullMonthYear = "dd MMMM yyyy";
    $rootScope.dayAndDateCS = "EEEE, MM-dd-yyyy"; //Wednesday, 06-04-2014
    $rootScope.monthAndDate = "MMMM dd";
    $rootScope.fullMonth = "MMMM";
    $rootScope.fullYear = "yyyy";

    /*
     * hotel Details
     */

    $rootScope.isLateCheckoutTurnedOn = hotelDetails.late_checkout_settings.is_late_checkout_on;
    $rootScope.businessDate = hotelDetails.business_date;
    $rootScope.currencySymbol = getCurrencySign(hotelDetails.currency.value);
    $rootScope.MLImerchantId = hotelDetails.mli_merchant_id;



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

    //Default Dashboard
    $rootScope.default_dashboard = hotelDetails.current_user.default_dashboard;

    $scope.searchBackButtonCaption = '';

    /**
    * reciever function used to change the heading according to the current page
    * if there is any trnslation, please use that
    * param1 {object}, javascript event
    * param2 {String}, Backbutton's caption
    */
    $scope.$on("UpdateSearchBackbuttonCaption", function(event, caption){
      event.stopPropagation();
      //chnaging the heading of the page
      $scope.searchBackButtonCaption = caption; //if it is not blank, backbutton will show, otherwise dont
    });

    if ($rootScope.adminRole == "Hotel Admin")
      $scope.isHotelAdmin = true;

    var getDefaultDashboardState = function(){
        var statesForDashbaord = {
          'HOUSEKEEPING': 'rover.dashboard.housekeeping',
          'FRONT_DESK'  : 'rover.dashboard.frontoffice',
          'MANAGER'     : 'rover.dashboard.manager'
        }
        return statesForDashbaord[$rootScope.default_dashboard];
    }

    if($rootScope.isStandAlone){
      // OBJECT WITH THE MENU STRUCTURE
        $scope.menu = [{
          title: "MENU_DASHBOARD",
          action: getDefaultDashboardState(),
          menuIndex: "dashboard",
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
            title: "MENU_SEARCH_RESERVATIONS",
            action: "rover.search",
            menuIndex:"search"
          },{
            title: "MENU_CREATE_RESERVATION",
            action: "rover.reservation.search",
            standAlone: true,
            menuIndex: "createReservation"
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
            action: "",
            actionPopup:true,
            menuIndex:"endOfDay"
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
          action: "rover.reports",
          iconClass: "icon-reports",
          submenu: []
        }];
    }
    else{
      // OBJECT WITH THE MENU STRUCTURE
        $scope.menu = [{
          title: "MENU_DASHBOARD",
          action: getDefaultDashboardState(),
          menuIndex: "dashboard",
          submenu: [],
          iconClass: "icon-dashboard"
        }, {
          title: "MENU_SEARCH",
          action: "rover.search",
          menuIndex: "search",
          submenu: [],
          iconClass: "icon-dashboard"
        }, 
         {
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
            action: ""
          }, {
            title: "MENU_MAINTAENANCE",
            action: ""
          }]
        },{
          title: "MENU_REPORTS",
          action: "rover.reports",
          iconClass: "icon-reports",
          submenu: []
        }];

    }
    

    $scope.$on("updateSubMenu", function(idx, item) {
      if (item && item[1] && item[1].submenu && item[1].submenu.length > 0) {
        $scope.showSubMenu = true;
        $scope.activeSubMenu = item[1].submenu;
      } else {
        $scope.activeSubMenu = [];
        $scope.toggleDrawerMenu();
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
    $scope.toggleDrawerMenu = function() {
      $scope.menuOpen = !$scope.menuOpen;
      $scope.showSubMenu = false;
    };
    $scope.closeDrawerMenu = function() {
      $scope.menuOpen = false;
      $scope.showSubMenu = false;
    };

    $scope.subMenuAction = function(subMenu){
      $scope.toggleDrawerMenu();
      if(subMenu === "endOfDay"){
         ngDialog.open({
            template: '/assets/partials/settings/rvEndOfDayModal.html',
            controller: 'RVEndOfDayModalController',
            className: 'ngdialog-theme-plain calendar-modal'
          });
      }
    };

    //in order to prevent url change(in rover specially coming from admin/or fresh url entering with states)
    // (bug fix to) https://stayntouch.atlassian.net/browse/CICO-7975
    
    var routeChange = function(event, newURL){
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
    	console.log('success');
      $scope.$broadcast('SWIPEHAPPENED', data);
    };

    $scope.failureCallBackSwipe = function() {
    	console.log('failure');
    	
    };

    var options = {};
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
        console.log("===========++++++++++====================")
        console.log($scope.guestInfoToPaymentModal)
      $scope.guestInformationsToPaymentModal = $scope.guestInfoToPaymentModal;
      ngDialog.open({
        template: '/assets/partials/payment/rvPaymentModal.html',
        controller: 'RVPaymentMethodCtrl',
        scope: $scope
      });
    };
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
      console.log("=========== $scope.guestInfoToPaymentModal====================")
        $scope.guestInfoToPaymentModal = guestData;
      
        console.log( $scope.guestInfoToPaymentModal);
    });
    /*
     * Tp close dialog box
     */
    $scope.closeDialog = function() {
      console.log("reached hereerrreee");
      console.log(document.activeElement);
        document.activeElement.blur();
        $scope.$emit('hideLoader');
        setTimeout(function(){
           ngDialog.close();
           window.scrollTo(0,0);
           $scope.$apply();
        }, 700);
    };
    /*
     * To fix issue with ipad keypad - 7702
     */
    $scope.setPosition = function(){
      if(document.activeElement.nodeName !== 'INPUT' && document.activeElement.nodeName !== 'SELECT'){
         document.activeElement.blur();
          setTimeout(function(){
             window.scrollTo(0,0);
          }, 700);
      }
    };

    /**
    * Handles the OWS error - Shows a popup having OWS connection test option
    */
    $rootScope.showOWSError = function() {

        // Hide loading message
        $scope.$emit('hideLoader');
        if(!$rootScope.isOWSErrorShowing){
            $rootScope.isOWSErrorShowing = true;
            ngDialog.open({
              template: '/assets/partials/hkOWSError.html',
              className: 'ngdialog-theme-default1 modal-theme1',
              controller: 'RVHKOWSErrorCtrl',
              closeByDocument: false,
              scope: $scope
          });
        }        
    };

  /**
    * Handles the bussiness date change
    */
    $rootScope.showBussinessDateChangingPopup = function() {

        // Hide loading message
        $scope.$emit('hideLoader');
        //if already shown no need to show again and again
        if(!$rootScope.isBussinessDateChanging){
            $rootScope.isBussinessDateChanging = true;
            ngDialog.open({
              template: '/assets/partials/common/bussinessDateChangingPopup.html',
              className: 'ngdialog-theme-default1 modal-theme1',
              controller: 'bussinessDateChangingCtrl',
              closeByDocument: false,
              scope: $scope
          });
        }        
    };

  }
]);

// adding an OWS check Interceptor here and bussiness date change
// but should be moved to higher up above in root level
sntRover.factory('httpInterceptor', function ($rootScope, $q, $location) {
  return {
    request: function (config) {
      return config;
    },
    response: function (response) {
        return response || $q.when(response);
    },
    responseError: function(rejection) {
      if(rejection.status == 520 && rejection.config.url !== '/admin/test_pms_connection') {
        $rootScope.showOWSError && $rootScope.showOWSError();
      }
      else if(rejection.status == 505){
        $rootScope.showBussinessDateChangingPopup();
        $rootScope.isBussinessDateChanging = true;
        //need to unset this once change is done and set new bussiness date
      }
      return $q.reject(rejection);
    }
  };
});

sntRover.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});
