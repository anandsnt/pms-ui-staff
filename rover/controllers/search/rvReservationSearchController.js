sntRover.controller('rvReservationSearchController', ['$scope', '$rootScope', '$state', '$stateParams', '$filter', 'searchResultdata', '$vault',
  function($scope, $rootScope, $state, $stateParams, $filter, searchResultdata, $vault) {

    /*
     * Controller class for search,
     * will be updating the heading
     */

    var that = this;
    BaseCtrl.call(this, $scope);
    $scope.shouldShowLateCheckout = true;
    $scope.shouldShowQueuedRooms = true;
    //changing the header
    $scope.heading = 'SEARCH_TITLE';
    //updating the left side menu
    $scope.$emit("updateRoverLeftMenu", "search");

    //setting search back button caption
    $scope.$emit("UpdateSearchBackbuttonCaption", "");

    var headingDict = {
      'DUEIN': 'DASHBOARD_SEARCH_CHECKINGIN',
      'DUEOUT': 'DASHBOARD_SEARCH_CHECKINGOUT',
      'INHOUSE': 'DASHBOARD_SEARCH_INHOUSE',
      'LATE_CHECKOUT': 'DASHBOARD_SEARCH_LATECHECKOUT',
      'QUEUED_ROOMS': 'QUEUED_ROOMS_TITLE',
      'VIP': 'DASHBOARD_SEARCH_VIP',
      'NORMAL_SEARCH': 'SEARCH_NORMAL',
      'PRE_CHECKIN': 'PRE_CHECKIN'
    };

    if ($stateParams.type in headingDict) {
      heading = headingDict[$stateParams.type];
    } else {
      heading = headingDict['NORMAL_SEARCH'];
    }


    // set up a back button
    if ($stateParams.type != '' && $stateParams.type != null) {
      $rootScope.setPrevState = {
        title: $filter('translate')('DASHBOARD'),
        // name: 'rover.dashboard',
        scope: $scope,
        callback: 'backtoDash'
      };
    }

    $scope.backtoDash = function() {
      $vault.set('searchType', '');
      $scope.$broadcast("showSearchResultsArea", false);
      $state.go('rover.dashboard', {
        useCache: true
      });
    }

    // saving/reseting search params to $vault
    $vault.set('searchType', !!$stateParams.type ? $stateParams.type : '');

    // resetting the scroll position to 0, so that it dont jump anywhere else
    // check CICO-9247
    $vault.set('result_showing_area', 0);



    $scope.heading = heading;

    // setting the scroller for view
    var scrollerOptions = {
      click: true,
      preventDefault: false,
      probeType: 2,
      scrollEndCallback: function() {
        $vault.set('result_showing_area', this.y);
      }
    };

    // we are returning to this screen
    if ($rootScope.isReturning()) {
      scrollerOptions.scrollToPrevLoc = !!$vault.get('result_showing_area') ? $vault.get('result_showing_area') : 0;
    };

    // finally
    $scope.setScroller('result_showing_area', scrollerOptions);
    var totalNgIncludeRequested = 0;
    //click function on search area, mainly for closing the drawer
    $scope.clickedOnSearchArea = function($event) {      
      $scope.$emit("closeDrawer");
    };
    $scope.$on("$includeContentRequested", function(event){
      totalNgIncludeRequested++;
      $scope.$emit('showLoader');
    });    
    $scope.$on("$viewContentLoaded", function(event) {
      totalNgIncludeRequested--;
      if(totalNgIncludeRequested == 0){
        $scope.$emit('hideLoader');
      }
      setTimeout(function() {
        $scope.$apply(function() {
          //we are showing the search results area
          $scope.$broadcast("showSearchResultsArea", true);
          //we are showing the data in search results area
          if (typeof searchResultdata !== 'undefined') {
            $scope.$broadcast("updateDataFromOutside", searchResultdata);
          }
        });

      }, 100);

    });

    $scope.$on("SearchResultsCleared", function(event, data) {
      $scope.heading = headingDict['NORMAL_SEARCH'];
    });
    $scope.$on("UpdateHeading", function(event, data) {
      $scope.heading = data;
    });
    $scope.$on("UPDATE_MANAGER_DASHBOARD", function() {
      $scope.heading = headingDict['NORMAL_SEARCH'];
    });
    $stateParams.type = "";
  }
]);