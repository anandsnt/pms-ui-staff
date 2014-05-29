sntRover.controller('roverController', ['$rootScope', '$scope', '$state', '$window', 'RVDashboardSrv', 'ngDialog', '$translate',
  function($rootScope, $scope, $state, $window, RVDashboardSrv, ngDialog, $translate) {

    $scope.showSubMenu = false;
    $scope.activeSubMenu = [];

    // OBJECT WITH THE MENU STRUCTURE
    $scope.menu = [{
      title: "Dashboard",
      action: "rover.dashboard",
      menuIndex: "dashboard",
      submenu: [],
      iconClass: "icon-dashboard"
    }, {
      title: "Availability",
      action: "#",
      submenu: [{
        title: "House Status",
        action: "#"
      }, {
        title: "Availability",
        action: "#"
      }]
    }, {
      title: "Front Desk",
      action: "#",
      submenu: [{
        title: "Create Reservation",
        action: "#"
      }, {
        title: "Room Assignment",
        action: "#"
      }, {
        title: "Post Charges",
        action: "#"
      }, {
        title: "Cashier",
        action: "#"
      }, {
        title: "End of Day",
        action: "#"
      }]
    }, {
      title: "Conversations",
      action: "#",
      iconClass: "icon-social-lobby",
      submenu: [{
        title: "Social Lobby",
        action: "#"
      }, {
        title: "Messages",
        action: "#"
      }, {
        title: "Reviews",
        action: "#"
      }]
    }, {
      title: "Revenue Management",
      action: "#",
      submenu: [{
        title: "Rate Manager",
        action: "rover.ratemanager",
        menuIndex: "rateManager"
      }, {
        title: "Company & TA Cards",
        action: "#"
      }, {
        title: "Distribution Manager",
        action: "#"
      }]
    }, {
      title: "Housekeeping",
      action: "#",
      submenu: [{
        title: "Housekeeping",
        action: "#"
      }, {
        title: "Task Management",
        action: "#"
      }, {
        title: "Maintenance",
        action: "#"
      }]
    }, {
      title: "Financials",
      action: "#",
      submenu: [{
        title: "Revenue",
        action: "#"
      }, {
        title: "Accounting Interface",
        action: "#"
      }, {
        title: "Commissions",
        action: "#"
      }]
    }, {
      title: "Reports",
      action: "#",
      submenu: []
    }]

    $scope.$on("updateSubMenu", function(idx, item) {
      if(item && item[1] && item[1].submenu) {
        $scope.showSubMenu = true;
        $scope.activeSubMenu = item[1].submenu;
      }else{
        $scope.activeSubMenu = [];
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
      /*
       * retrieve user info
       */
      $scope.fetchData = function() {
        var fetchUserInfoSuccessCallback = function(data) {
          $scope.userInfo = data;
          $scope.isPmsConfigured = $scope.userInfo.is_pms_configured;
          $rootScope.adminRole = $scope.userInfo.user_role;
          if ($rootScope.adminRole == "Hotel admin")
            $scope.isHotelAdmin = true;
          if ($rootScope.adminRole == "Hotel staff")
            $scope.isHotelStaff = true;
          $scope.$emit('hideLoader');
          $scope.getLanguage();
        };
        var fetchUserInfoFailureCallback = function(data) {
          $scope.$emit('hideLoader');
        };
        $scope.invokeApi(RVDashboardSrv.fetchUserInfo, {}, fetchUserInfoSuccessCallback, fetchUserInfoFailureCallback);

      };
      // Show a loading message until promises are not resolved
      $scope.$emit('showLoader');

      // if menu is open, close it
      $scope.isMenuOpen();
      $scope.fetchData();
      $scope.menuOpen = false;
    };
    /*
     * Success callback of get language
     * @param {object} response
     */
    $scope.fetchHotelDetailsSuccessCallback = function(data) {

      if (data.language)
        $translate.use(data.language.value);
      else
        $translate.use('EN');
      $scope.$emit('hideLoader');

    };
    /*
     * Function to get the current hotel language
     */
    $scope.getLanguage = function() {
      $scope.invokeApi(RVDashboardSrv.fetchHotelDetails, {}, $scope.fetchHotelDetailsSuccessCallback);
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
    });



    //when state change start happens, we need to show the activity activator to prevent further clicking
    //this will happen when prefetch the data
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      // Show a loading message until promises are not resolved
      $scope.$emit('showLoader');

      // if menu is open, close it
      $scope.isMenuOpen();
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

  }
]);