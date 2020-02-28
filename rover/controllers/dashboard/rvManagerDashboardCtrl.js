sntRover.controller('RVmanagerDashboardController',
 ['$scope',
  '$rootScope',
  '$state',
  '$vault',
  'RVDashboardSrv',
  '$timeout',
  'ngDialog',
  'marketData',
  'sourceData',
  'segmentData',
  'originData',
  'rvAnalyticsHelperSrv',
  'rvAnalyticsSrv',
  function($scope, $rootScope, $state, $vault, RVDashboardSrv, $timeout, ngDialog, marketData, sourceData, segmentData, originData, rvAnalyticsHelperSrv, rvAnalyticsSrv) {
  // inheriting some useful things
  BaseCtrl.call(this, $scope);
  var that = this;
  // scroller related settings
  var scrollerOptions = {
    preventDefault: false
  };

  $scope.isStatisticsOpened = false;
  $scope.setScroller('dashboard_scroller', scrollerOptions);
  var analyticsScrollerOptions = {
      preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV)$/
      },
      preventDefault: false
    };
    
  $scope.setScroller('analytics_scroller', analyticsScrollerOptions);
  $scope.setScroller('analytics_details_scroller', analyticsScrollerOptions);

  // changing the header
  $scope.$emit("UpdateHeading", 'DASHBOARD_MANAGER_HEADING');
  $scope.showDashboard = true; // variable used to hide/show dabshboard

  // we are hiding the search results area
  $scope.$broadcast("showSearchResultsArea", false);

  $scope.tomorrow = tzIndependentDate($rootScope.businessDate);
  $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
  $scope.dayAfterTomorrow = tzIndependentDate($scope.tomorrow);
  $scope.dayAfterTomorrow.setDate($scope.tomorrow.getDate() + 1);

  $scope.$on("$includeContentLoaded", function() {
      // we are showing the add new guest button in searhc only if it is standalone & search result is empty
      if ($rootScope.isStandAlone) {
          $scope.$broadcast("showAddNewGuestButton", true);
      }
  });


  // we are setting the header accrdoing to manager's dashboard
  $scope.$emit("UpdateHeading", 'DASHBOARD_MANAGER_HEADING');

  /*
   *    a recievable function hide/show search area.
   *    when showing the search bar, we will hide dashboard & vice versa
   *    param1 {event}, javascript event
   *    param2 {boolean}, value to determine whether dashboard should be visible
   */
  $scope.$on("showDashboardArea", function(event, showDashboard) {
    $scope.showDashboard = showDashboard;
    $scope.refreshScroller('dashboard_scroller');
  });

  /**
   *   recievalble function to update dashboard reservatin search results
   *   intended for checkin, inhouse, checkout (departed), vip buttons handling.
   *   @param {Object} javascript event
   *   @param {array of Objects} data search results
   */
  $scope.$on("updateDashboardSearchDataFromExternal", function(event, data) {
    $scope.$broadcast("updateDataFromOutside", data);
    $scope.$broadcast("showSearchResultsArea", true);
  });

  /**
   *   recievalble function to update dashboard reservatin search result's type
   *   intended for checkin, inhouse, checkout (departed), vip buttons search result handling.
   *   @param {Object} javascript event
   *   @param {array of Objects} data search results
   */
  $scope.$on("updateDashboardSearchTypeFromExternal", function(event, type) {
    $scope.$broadcast("updateReservationTypeFromOutside", type);
  });

  // show Latecheckout icon
  $scope.shouldShowLateCheckout = true;
  $scope.shouldShowQueuedRooms = true;

  /**
   *   a recievder function to show erorr message in the dashboard
   *   @param {Object} Angular event
   *   @param {String} error message to display
   */

  $scope.$on("showErrorMessage", function(event, errorMessage) {
    $scope.errorMessage = errorMessage;
  });

  /**
   * function used to check null values, especially api response from templates
   */
  $scope.escapeNull = function(value, replaceWith) {
    var newValue = "";

    if ((typeof replaceWith !== "undefined") && (replaceWith !== null)) {
      newValue = replaceWith;
    }
    var valueToReturn = ((value === null || typeof value === 'undefined') ? newValue : value);

    return valueToReturn;
  };

  /**
   * function to check whether the object is empty or not
   * @param {Object} Js Object
   * @return Boolean
   */
  $scope.isEmptyObject = $.isEmptyObject;

  $scope.$on("UPDATE_MANAGER_DASHBOARD", function() {
    $scope.$emit("UpdateHeading", 'DASHBOARD_MANAGER_HEADING');
  });
  // scroller is not appearing after coming back from other screens
  setTimeout(function() {
    $scope.refreshScroller('dashboard_scroller');
  }, 500);


  // Function to be deleted - CICO-9433 - Sample button in dashboard screen
  $scope.setReservationDataFromDiaryScreen = function() {
    var temporaryReservationDataFromDiaryScreen = {

      "arrival_date": "2014-07-15",
      "departure_date": "2014-07-16",
      "arrival_time": "04:30 AM",
      "departure_time": "09:15 PM",

      "rooms": [{
        "room_id": "245",
        "rateId": "382",
        "numAdults": "1",
        "numChildren": "2",
        "numInfants": "4",
        "amount": 300
      }]
    };

    $vault.set('temporaryReservationDataFromDiaryScreen', JSON.stringify(temporaryReservationDataFromDiaryScreen));
    $state.go("rover.reservation.staycard.mainCard.summaryAndConfirm", {
      'reservation': 'HOURLY'
    });
  };

  /**
   * Function which checks whether ADR data is shown in statistic section or not
  */
  $scope.isADRShown = function() {
    return ($scope.isStandAlone && !$scope.isHourlyRateOn && $scope.isStatisticsOpened);
  };

  /**
   * Function which handles the click of the statistic btn in dashboard
  */
 $scope.toggleStatistics = function() {
  $scope.isStatisticsOpened = !$scope.isStatisticsOpened;
  var onStatisticsFetchSuccess = function(data) {
        $scope.$emit('hideLoader');
        $scope.statistics = data;

        $scope.refreshScroller('dashboard_scroller');
        $timeout(function() {
          $scope.myScroll['dashboard_scroller'].scrollTo($scope.myScroll['dashboard_scroller'].maxScrollX,
                  $scope.myScroll['dashboard_scroller'].maxScrollY, 500);
        }, 500);

      },
      onStatisticsFetchFailure = function(error) {
        $scope.$emit('hideLoader');

      };
  // Invoke the api only when the statistic block is opened
  var requestParams = {
    'show_adr': true,
    'show_upsell': true,
    'show_rate_of_day': true
  };
  // CICO-31344

  if (!$scope.isStandAlone) {
    requestParams.show_adr = false;
  }
  if ($scope.isStatisticsOpened) {
    $scope.invokeApi(RVDashboardSrv.fetchStatisticData, requestParams, onStatisticsFetchSuccess, onStatisticsFetchFailure);
  } else {
    $timeout(function() {
      $scope.refreshScroller('dashboard_scroller');
    }, 500);

  }

 };

  var refreshAnalyticsScroller = function() {
    $timeout(function() {
      $scope.refreshScroller('analytics_scroller');
      $scope.refreshScroller('analytics_details_scroller');
    }, 500);
  };

  $scope.dashboardFilter.isManagerDashboard = true;
  $scope.$on('REFRESH_ANALTICS_SCROLLER', refreshAnalyticsScroller);

  $scope.dashboardFilter.chartTypes = [{
    "name": "Occupancy",
    "code": "occupancy"
  }, {
    "name": "Occupied Rooms",
    "code": "occupied_rooms"
  }, {
    "name": "ADR",
    "code": "adr"
  }, {
    "name": "RevPAR",
    "code": "rev_par"
  }, {
      "name": "Room Revenue",
      "code": "revenue"
  }];

  $scope.dashboardFilter.chartType = "occupancy";

  $scope.dashboardFilter.aggTypes = [{
    "name": "Room type",
    "code": "room_type_id"
  }, {
    "name": "Market",
    "code": "market_id"
  }, {
    "name": "Source",
    "code": "source_id"
  }, {
    "name": "Segment",
    "code": "segment_id"
  }, {
    "name": "Origin",
    "code": "booking_origin_id"
  }];


  $scope.onChartTypeChanged = function() {
    $scope.$broadcast('CHART_TYPE_CHANGED');
  };

  $scope.onAggregationTypeChanged = function() {
    $scope.$broadcast('CHART_AGGGREGATION_CHANGED');
  };

  $scope.dashboardFilter.toDate = angular.copy($rootScope.businessDate);
  $scope.dashboardFilter.fromDate = angular.copy(moment($scope.dashboardFilter.toDate).subtract(7, 'days').format('YYYY-MM-DD'));

  var dateOptions = {
    changeYear: true,
    changeMonth: true,
    yearRange: "-5:+5",
    dateFormat: 'yy-mm-dd',
    onSelect: function(dateText) {
      $scope.dashboardFilter.fromDate = dateText;
      $scope.$broadcast('RELOAD_DATA_WITH_DATE_FILTER_' + $scope.dashboardFilter.selectedAnalyticsMenu);
      ngDialog.close();
    }
  };

  var toDateOptions = {
    changeYear: true,
    changeMonth: true,
    yearRange: "-5:+5",
    dateFormat: 'yy-mm-dd',
    onSelect: function(dateText, inst) {
      $scope.dashboardFilter.toDate = dateText;
      $scope.$broadcast('RELOAD_DATA_WITH_DATE_FILTER_' + $scope.dashboardFilter.selectedAnalyticsMenu);
      ngDialog.close();
    }
  };

  $scope.showAnalyticsCalendar = function(type) {
    $scope.dateOptions = (type === 'toDate') ? toDateOptions : dateOptions;
    $scope.datePicked = (type === 'toDate') ?
      moment($scope.dashboardFilter.toDate).format('YYYY-MM-DD') :
      moment($scope.dashboardFilter.fromDate).format('YYYY-MM-DD');
    $scope.datePicked = (type === 'toDate') ? $scope.dashboardFilter.toDate : $scope.dashboardFilter.fromDate;

    $timeout(function() {
      ngDialog.open({
        template: '/assets/partials/search/rvDatePickerPopup.html',
        className: '',
        scope: $scope
      });
    }, 1000);
  };

  $scope.availableRoomTypes = angular.copy($scope.roomTypes);
  $scope.marketData = marketData && marketData.markets ? marketData.markets : [];
  $scope.sourceData = sourceData && sourceData.sources ? sourceData.sources : [];
  $scope.segmentData = segmentData && segmentData.segments ? segmentData.segments : [];
  $scope.originData = originData && originData.booking_origins ? originData.booking_origins : [];

  var shallowDecoded,
    shallowEncoded;
  var generateParamsBasenOnFilters = function() {
    var filtersSelected = {
      "filters": {}
    };

    filtersSelected.filters.room_type_id = _.pluck($scope.selectedFilters.roomTypes, 'id');
    filtersSelected.filters.market_id = _.pluck($scope.selectedFilters.marketCodes, 'value');
    filtersSelected.filters.source_id = _.pluck($scope.selectedFilters.sourceCodes, 'value');
    filtersSelected.filters.segment_id = _.pluck($scope.selectedFilters.segmentCodes, 'value');
    filtersSelected.filters.booking_origin_id = _.pluck($scope.selectedFilters.originCodes, 'value');
    shallowEncoded = $.param(filtersSelected);
    shallowDecoded = decodeURIComponent(shallowEncoded);
  };

  $scope.toggleFilterView = function() {
    $scope.dashboardFilter.showFilters = !$scope.dashboardFilter.showFilters;

    if (($scope.dashboardFilter.selectedAnalyticsMenu === 'DISTRIBUTION' ||
        $scope.dashboardFilter.selectedAnalyticsMenu === 'PACE') &&
      !$scope.dashboardFilter.showFilters) {
      $scope.$broadcast('ANALYTICS_FILTER_CHANGED', shallowEncoded);
    }
  };

  var resetChartFilters = function() {
    $scope.selectedFilters = {
      "roomType": "",
      "marketCode": "",
      "sourceCode": "",
      "originCode": "",
      "segmentCode": "",
      "roomTypes": [],
      "marketCodes": [],
      "sourceCodes": [],
      "originCodes": [],
      "segmentCodes": []
    };
    $scope.dashboardFilter.selectedFilters = $scope.selectedFilters;
  };

  resetChartFilters();

  $scope.distributionFilterRemoved = function(type, value) {
    var selectedItem;

    if (type === 'MARKET' && value) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.selectedFilters.marketCodes, value);
      $scope.marketData = rvAnalyticsHelperSrv.addToAndSortArray($scope.marketData, selectedItem);
      $scope.selectedFilters.marketCodes = _.reject($scope.selectedFilters.marketCodes, selectedItem);
    } else if (type === 'SOURCE' && value) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.selectedFilters.sourceCodes, value);
      $scope.sourceData = rvAnalyticsHelperSrv.addToAndSortArray($scope.sourceData, selectedItem);
      $scope.selectedFilters.sourceCodes = _.reject($scope.selectedFilters.sourceCodes, selectedItem);
    } else if (type === 'SEGMENT' && value) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.selectedFilters.segmentCodes, value);
      $scope.segmentData = rvAnalyticsHelperSrv.addToAndSortArray($scope.segmentData, selectedItem);
      $scope.selectedFilters.segmentCodes = _.reject($scope.selectedFilters.segmentCodes, selectedItem);
    } else if (type === 'ORIGIN' && value) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.selectedFilters.originCodes, value);
      $scope.originData = rvAnalyticsHelperSrv.addToAndSortArray($scope.originData, selectedItem);
      $scope.selectedFilters.originCodes = _.reject($scope.selectedFilters.originCodes, selectedItem);
    } else if (type === 'ROOM_TYPE' && value) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.selectedFilters.roomTypes, value);
      $scope.availableRoomTypes = rvAnalyticsHelperSrv.addToAndSortArray($scope.availableRoomTypes, selectedItem);
      $scope.selectedFilters.roomTypes = _.reject($scope.selectedFilters.roomTypes, selectedItem);
    }
    generateParamsBasenOnFilters();
  };

  $scope.distributionFilterAdded = function(type) {
    var selectedItem;

    if (type === 'MARKET' && $scope.selectedFilters.marketCode) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.marketData, $scope.selectedFilters.marketCode);
      $scope.selectedFilters.marketCodes = rvAnalyticsHelperSrv.addToAndSortArray($scope.selectedFilters.marketCodes, selectedItem);
      $scope.marketData = _.reject($scope.marketData, selectedItem);
    } else if (type === 'SOURCE' && $scope.selectedFilters.sourceCode) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.sourceData, $scope.selectedFilters.sourceCode);
      $scope.selectedFilters.sourceCodes = rvAnalyticsHelperSrv.addToAndSortArray($scope.selectedFilters.sourceCodes, selectedItem);
      $scope.sourceData = _.reject($scope.sourceData, selectedItem);
    } else if (type === 'SEGMENT' && $scope.selectedFilters.segmentCode) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.segmentData, $scope.selectedFilters.segmentCode);
      $scope.selectedFilters.segmentCodes = rvAnalyticsHelperSrv.addToAndSortArray($scope.selectedFilters.segmentCodes, selectedItem);
      $scope.segmentData = _.reject($scope.segmentData, selectedItem);
    } else if (type === 'ORIGIN' && $scope.selectedFilters.originCode) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.originData, $scope.selectedFilters.originCode);
      $scope.selectedFilters.originCodes = rvAnalyticsHelperSrv.addToAndSortArray($scope.selectedFilters.originCodes, selectedItem);
      $scope.originData = _.reject($scope.originData, selectedItem);
    } else if (type === 'ROOM_TYPE' && $scope.selectedFilters.roomType) {
      selectedItem = rvAnalyticsHelperSrv.findSelectedFilter($scope.availableRoomTypes, $scope.selectedFilters.roomType);
      $scope.selectedFilters.roomTypes = rvAnalyticsHelperSrv.addToAndSortArray($scope.selectedFilters.roomTypes, selectedItem);
      $scope.availableRoomTypes = _.reject($scope.availableRoomTypes, selectedItem);
    }
    generateParamsBasenOnFilters();
  };

  var joinFiltersAndDataSet = function (dataSet, filterData) {
    dataSet = dataSet.concat(filterData);
    dataSet = _.sortBy(dataSet, function(item) {
      return item.name;
    });
    return dataSet;
  };

  var emptyAllChartFilters = function() {
    shallowEncoded = "";
    $scope.dashboardFilter.chartType = "occupancy";
    $scope.dashboardFilter.aggType = "";
    $scope.dashboardFilter.datePicked = $rootScope.businessDate;
    $scope.dashboardFilter.toDate = angular.copy($rootScope.businessDate);
    $scope.dashboardFilter.fromDate = angular.copy(moment($scope.dashboardFilter.toDate).subtract(7, 'days').format('YYYY-MM-DD'));

    $scope.marketData = joinFiltersAndDataSet($scope.marketData, $scope.selectedFilters.marketCodes);
    $scope.sourceData = joinFiltersAndDataSet($scope.sourceData, $scope.selectedFilters.sourceCodes);
    $scope.segmentData = joinFiltersAndDataSet($scope.segmentData, $scope.selectedFilters.segmentCodes);
    $scope.originData = joinFiltersAndDataSet($scope.originData, $scope.selectedFilters.originCodes);
    $scope.availableRoomTypes = joinFiltersAndDataSet($scope.availableRoomTypes, $scope.selectedFilters.roomTypes);
    $scope.dashboardFilter.showLastYearData = false;
    $scope.dashboardFilter.lastyearType = "SAME_DATE_LAST_YEAR";
    resetChartFilters();
  };

  $scope.$on('RESET_CHART_FILTERS', function() {
    emptyAllChartFilters();
  });

  $scope.distributionChartChanged = function() {
    $scope.$broadcast('DISTRUBUTION_CHART_CHANGED');
  };

  // house keeping

  $scope.availableRoomTypes = angular.copy($scope.roomTypes);

  $scope.$on('ROOM_TYPE_SHORTAGE_CALCULATED', function(e, calculatedRoomTypes) {
    $scope.roomTypesForWorkPrioriy = [];
    _.each($scope.availableRoomTypes, function(roomType) {
      roomType.shortage = 0;
      roomType.overBooking = 0;
      _.each(calculatedRoomTypes, function(calculatedRoomType) {
        if (roomType.code === calculatedRoomType.code) {
          roomType.shortage = calculatedRoomType.shortage;
          roomType.overBooking = calculatedRoomType.overBooking;
        }
      });
    });
  });

  // front desk

  $scope.onAnlayticsRoomTypeChange = function() {
    rvAnalyticsSrv.selectedRoomType = $scope.dashboardFilter.selectedRoomType;
    $scope.$broadcast('RELOAD_DATA_WITH_SELECTED_FILTER_' + $scope.dashboardFilter.selectedAnalyticsMenu);
  };

  $scope.showYesterdaysDataToggled = function() {
    $scope.$broadcast('SHOW_YESTERDAYS_DATA_TOGGLE');
  };
  $scope.showRemainingReservationsToggled = function() {
    $scope.$broadcast('SHOW_REMAINING_RESERVATIONS_TOGGLE');
  };
}]);
