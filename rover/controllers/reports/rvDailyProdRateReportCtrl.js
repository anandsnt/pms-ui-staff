angular.module('sntRover')
    .controller('RVDailyProdRateReport.Controller', [
        '$rootScope',
        '$scope',
        'RVreportsSrv',
        'RVreportsSubSrv',
        'RVReportUtilsFac',
        'RVReportParamsConst',
        'RVReportMsgsConst',
        'RVReportNamesConst',
        '$filter',
        '$timeout',
        function($rootScope, $scope, reportsSrv, reportsSubSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout) {


            var detailsCtrlScope = $scope.$parent,
                mainCtrlScope = detailsCtrlScope.$parent,
                chosenReport = detailsCtrlScope.chosenReport;

            var LEFT_PANE_SCROLL = 'left-pane-scroll',
                RIGHT_PANE_SCROLL = 'right-pane-scroll',
                TIMEOUT = 300,
                POLL = 1000;

            var refreshScrollers = function() {
                if (mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL)) {
                    $scope.refreshScroller(LEFT_PANE_SCROLL);
                }

                if (mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL)) {
                    $scope.refreshScroller(RIGHT_PANE_SCROLL);
                }
            };

            var setupScrollListner = function() {
                mainCtrlScope.myScroll[LEFT_PANE_SCROLL]
                    .on('scroll', function() {
                        mainCtrlScope.myScroll[RIGHT_PANE_SCROLL]
                            .scrollTo(0, this.y);
                    });

                mainCtrlScope.myScroll[RIGHT_PANE_SCROLL]
                    .on('scroll', function() {
                        mainCtrlScope.myScroll[LEFT_PANE_SCROLL]
                            .scrollTo(0, this.y);
                    });
            };

            var isScrollReady = (function () {
                if (mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) && mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL)) {
                    setupScrollListner();
                } else {
                    $timeout(isScrollReady, POLL);
                }
            })();

            var destroyScrolls = function() {
                mainCtrlScope.myScroll[LEFT_PANE_SCROLL].destroy();
                delete mainCtrlScope.myScroll[LEFT_PANE_SCROLL];

                mainCtrlScope.myScroll[RIGHT_PANE_SCROLL].destroy();
                delete mainCtrlScope.myScroll[RIGHT_PANE_SCROLL];
            };

            var watchShowAvailability, watchshowRevenue;

            // re-render must be initiated before for taks like printing.
            // thats why timeout time is set to min value 50ms
            var reportSubmited = $scope.$on(reportMsgs['REPORT_SUBMITED'], reInit);
            var reportPrinting = $scope.$on(reportMsgs['REPORT_PRINTING'], reInit);
            var reportUpdated = $scope.$on(reportMsgs['REPORT_UPDATED'], reInit);
            var reportPageChanged = $scope.$on(reportMsgs['REPORT_PAGE_CHANGED'], reInit);

            $scope.$on('$destroy', reportSubmited);
            $scope.$on('$destroy', reportUpdated);
            $scope.$on('$destroy', reportPrinting);
            $scope.$on('$destroy', reportPageChanged);

            BaseCtrl.call(this, $scope);

            $scope.setScroller(LEFT_PANE_SCROLL, {
                'preventDefault': false,
                'probeType': 3
            });

            $scope.setScroller(RIGHT_PANE_SCROLL, {
                'preventDefault': false,
                'probeType': 3,
                'scrollX': true
            });

            $scope.$on('$destroy', destroyScrolls);


            // default colspan value
            $scope.colSpan = 5;

            // ui filter by default showing both avail. and rev.
            $scope.uiFilter = {
                'showAvailability': true,
                'showRevenue': true
            };

            // cant disable both, when one disabled one the other should be enabled
            watchShowAvailability = $scope.$watch('uiFilter.showAvailability', function(newValue) {
                if (false === newValue && !$scope.uiFilter.showRevenue) {
                    $scope.uiFilter.showRevenue = true;
                }

                $scope.$emit('showLoader');
                $timeout(reInit, TIMEOUT);
            });

            // cant disable both, when one disabled one the other should be enabled
            watchshowRevenue = $scope.$watch('uiFilter.showRevenue', function(newValue) {
                if (false === newValue && !$scope.uiFilter.showAvailability) {
                    $scope.uiFilter.showAvailability = true;
                }

                $scope.$emit('showLoader');
                $timeout(reInit, TIMEOUT);
            });

            $scope.$on('$destroy', watchShowAvailability);
            $scope.$on('$destroy', watchshowRevenue);


            function parseDailyData(dateObj, isRateType) {
                var limiter = 2;
                var parsedData = [];

                _.each(dateObj, function(dateObj, currDate) {

                    var eachDateVal = [],
                        isPastDay = new tzIndependentDate(currDate) < new tzIndependentDate($rootScope.businessDate);


                    if ($scope.uiFilter.showAvailability && !$scope.uiFilter.showRevenue) {
                        eachDateVal.push({
                            value: dateObj['total_reservations_count'],
                            isAvail: true,
                            isRateType: isRateType
                        });
                        eachDateVal.push({
                            value: dateObj['available_rooms_count'],
                            isAvail: true,
                            isRateType: isRateType
                        });
                    } else if (!$scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
                        if (!isPastDay) {
                            eachDateVal.push({
                                value: $filter('currency')(dateObj['room_revenue'], $rootScope.currencySymbol, limiter),
                                isRev: true,
                                isRateType: isRateType
                            });
                        }
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, limiter),
                            isRev: true,
                            isRateType: isRateType
                        });
                        if (isPastDay) {
                            eachDateVal.push({
                                value: $filter('currency')(dateObj['room_revenue'], $rootScope.currencySymbol, limiter),
                                isRev: true,
                                isRateType: isRateType
                            });
                        }
                    } else if ($scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
                        eachDateVal.push({
                            value: dateObj['total_reservations_count'],
                            isAvail: true,
                            isRateType: isRateType
                        });
                        eachDateVal.push({
                            value: dateObj['available_rooms_count'],
                            isAvail: true,
                            isRateType: isRateType
                        });
                        if (!isPastDay) {
                            eachDateVal.push({
                                value: $filter('currency')(dateObj['room_revenue'], $rootScope.currencySymbol, limiter),
                                isRev: true,
                                isRateType: isRateType
                            });
                        }
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, limiter),
                            isRev: true,
                            isRateType: isRateType
                        });

                        if (isPastDay) {
                            eachDateVal.push({
                                value: $filter('currency')(dateObj['room_revenue'], $rootScope.currencySymbol, limiter),
                                isRev: true,
                                isRateType: isRateType
                            });
                        }
                    }

                    // TODO: If user has opted to show addon revenue, add that as a column
                    if (isPastDay && $scope.chosenReport.chosenOptions['include_addon_revenue'] && $scope.uiFilter.showRevenue) {
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['addon_revenue'], $rootScope.currencySymbol, limiter),
                            isRev: true,
                            cls: 'last-day',
                            isRateType: isRateType
                        });
                    } else {
                        eachDateVal[eachDateVal.length - 1]['cls'] = 'last-day';
                    }

                    parsedData = parsedData.concat(eachDateVal);

                });

                return parsedData;
            }


            function processData() {
                var SUB_HEADER_NAMES = {
                        'ROOMS': 'Occ Rooms',
                        'AVAILABLE_ROOMS': 'Avl. Rooms',
                        /**/
                        'FORECAST': 'Forecast.',
                        'ADR': 'ADR',
                        'ACTUAL': 'Room Rev.',
                        /**/
                        'ADDON': 'Add-on' // >> This is to be shown IFF 'Options'->'Include Add-on Revenue' is checked
                    },
                    headers,
                    noOfDays = 0,
                    cellWidth = 80;

                $scope.headerTop = [];
                $scope.headerBot = [];
                $scope.colspanArray = [];
                $scope.reportData = []; // this will be an array of arrays
                $scope.yAxisLabels = []; // keeping seperate array so that we can avoid object being itrated aphabetically
                $scope.rightPaneWidth = 0;

                if ($scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
                    // Header is initialized to FORECAST, If past date is selected it will be replaced with ACTUAL column
                    headers = ['ROOMS', 'AVAILABLE_ROOMS', 'FORECAST', 'ADR'];
                } else if (!$scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
                    headers = ['FORECAST', 'ADR'];
                } else if ($scope.uiFilter.showAvailability && !$scope.uiFilter.showRevenue) {
                    headers = ['ROOMS', 'AVAILABLE_ROOMS'];
                }

                $scope.colSpan = headers.length;

                // compute Number of Days here!
                var hrs = 24;
                var secInHr = 3600;
                var msInSec = 1000;
                var ONE_DAY_MS = hrs * secInHr * msInSec;
                var ms = new tzIndependentDate($scope.chosenReport.fromDate) * 1;
                var last = new tzIndependentDate($scope.chosenReport.untilDate) * 1;
                for (; ms <= last; ms += ONE_DAY_MS) {

                    var isPastDay = new tzIndependentDate(ms) < new tzIndependentDate($rootScope.businessDate);

                    $scope.headerTop.push($filter('date')(ms, $rootScope.shortMonthAndDate));
                    var currentHeaders = headers;

                    if (isPastDay && $scope.uiFilter.showRevenue) {
                        // Remove FORECAST header and push ACTUAL
                        currentHeaders = _.without(currentHeaders, 'FORECAST').concat(['ACTUAL']);
                        if ($scope.chosenReport.chosenOptions['include_addon_revenue']) {
                            currentHeaders.push('ADDON');
                        }
                    }

                    $scope.colspanArray.push(currentHeaders.length);

                    _.each(currentHeaders, function(idx) {
                        $scope.headerBot.push({
                            'name': SUB_HEADER_NAMES[idx],
                            'cls': idx === headers.length - 1 ? 'day-end' : ''
                        });
                    });

                    noOfDays += 1;
                }

                var results = $scope.results;

                // Parse Rates OR Rate Types based on the filter here
                _.each(results.rate_types, function(rateTypeData) {
                    $scope.yAxisLabels.push({
                        name: rateTypeData.rate_type_name,
                        rate_type_id: rateTypeData.rate_type_id,
                        is_rate_type: true
                    });

                    $scope.reportData.push(parseDailyData(rateTypeData.data, true));
                    // Put rates under the rate type
                    var rates = _.filter(results.rates, {
                        rate_type_id: rateTypeData.rate_type_id
                    });

                    _.each(rates, function(rate) {
                            $scope.yAxisLabels.push({
                            name: rate.rate_name,
                            rate_type_id: rate.rate_type_id,
                            is_rate_type: false
                        });
                        $scope.reportData.push(parseDailyData(rate.data, false));
                    });
                });

                $scope.rightPaneWidth = noOfDays * cellWidth * _.max($scope.colspanArray);

                $timeout(function() {
                    refreshScrollers();
                    $scope.$emit('hideLoader');
                }, TIMEOUT);

                window.results = $scope.results;
            };

            function renderReact(args) {
                var options = args || {},
                    props = _.extend(options, {
                        'rightPaneWidth': $scope.rightPaneWidth,
                        'colspan': $scope.colSpan,
                        'headerTop': $scope.headerTop,
                        'headerBot': $scope.headerBot,
                        'reportData': $scope.reportData,
                        'colspanArray': $scope.colspanArray,
                        'isLastRowSum': false
                    });

                ReactDOM.render(
                    React.createElement(DPContent, props),
                    document.getElementById('daily-production-render')
                );
            }

            function init() {
                processData();
                renderReact();
            }

            function reInit() {
                processData();
                renderReact();
            }

            init();



            function generateRateNames () {
                var rateTypes = chosenReport.hasRateTypeFilter.data;
                var rates = chosenReport.hasRateFilter.data;


                var tmpAry, matchedRates;
                var yAxisArys = _.map(rateTypes, function (item) {
                    tmpAry = [];

                    tmpAry.push({
                        name: item.name,
                        rate_type_id: item.rate_type_id,
                        is_rate_type: true
                    });

                    matchedRates = _.filter(rates, {
                        rate_type_id: item.rate_type_id
                    });

                    _.each(matchedRates, function (each) {
                        if ( item.rate_type_id === each.rate_type_id ) {
                            tmpAry.push({
                                name: each.name,
                                id: each.id,
                                rate_type_id: each.rate_type_id,
                                is_rate_type: false
                            });
                        }
                    });

                    return tmpAry;
                });

                $scope.yAxisLabelsV2 = _.flatten(yAxisArys);
                $scope.yAxisLabelsV2.push({
                    name: 'Undefined',
                    rate_type_id: 'undefined',
                    is_rate_type: true
                });

                $scope.rateIndexRef = {};
                _.each($scope.yAxisLabelsV2, function (each, index) {
                    if ( ! each.is_rate_type ) {
                        $scope.rateIndexRef[each.id] = index;
                    }
                });
            }
            $timeout(generateRateNames, 2000);

            function generateDatesV2() {
                var SUB_HEADER_NAMES = {
                        'ROOMS': 'Occ Rooms',
                        'AVAILABLE_ROOMS': 'Avl. Rooms',
                        /**/
                        'FORECAST': 'Forecast.',
                        'ADR': 'ADR',
                        'ACTUAL': 'Room Rev.',
                        /**/
                        'ADDON': 'Add-on' // >> This is to be shown IFF 'Options'->'Include Add-on Revenue' is checked
                    },
                    headers,
                    noOfDays = 0,
                    cellWidth = 80;

                $scope.headerTop = [];
                $scope.headerBot = [];
                $scope.colspanArray = [];
                $scope.rightPaneWidth = 0;

                if ($scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
                    // Header is initialized to FORECAST, If past date is selected it will be replaced with ACTUAL column
                    headers = ['ROOMS', 'AVAILABLE_ROOMS', 'FORECAST', 'ADR'];
                } else if (!$scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue) {
                    headers = ['FORECAST', 'ADR'];
                } else if ($scope.uiFilter.showAvailability && !$scope.uiFilter.showRevenue) {
                    headers = ['ROOMS', 'AVAILABLE_ROOMS'];
                }

                $scope.colSpan = headers.length;

                // compute Number of Days here!
                var hrs = 24;
                var secInHr = 3600;
                var msInSec = 1000;
                var ONE_DAY_MS = hrs * secInHr * msInSec;
                var ms = new tzIndependentDate($scope.chosenReport.fromDate) * 1;
                var last = new tzIndependentDate($scope.chosenReport.untilDate) * 1;
                for (; ms <= last; ms += ONE_DAY_MS) {

                    var isPastDay = new tzIndependentDate(ms) < new tzIndependentDate($rootScope.businessDate);

                    $scope.headerTop.push({
                        ms: ms,
                        name: $filter('date')(ms, $rootScope.shortMonthAndDate)
                    });

                    var currentHeaders = headers;

                    if (isPastDay && $scope.uiFilter.showRevenue) {
                        // Remove FORECAST header and push ACTUAL
                        currentHeaders = _.without(currentHeaders, 'FORECAST').concat(['ACTUAL']);
                        if ($scope.chosenReport.chosenOptions['include_addon_revenue']) {
                            currentHeaders.push('ADDON');
                        }
                    }

                    $scope.colspanArray.push(currentHeaders.length);

                    _.each(currentHeaders, function(idx) {
                        $scope.headerBot.push({
                            'name': SUB_HEADER_NAMES[idx],
                            'cls': idx === headers.length - 1 ? 'day-end' : ''
                        });
                    });

                    noOfDays += 1;
                }

                $scope.rightPaneWidth = noOfDays * cellWidth * _.max($scope.colspanArray);
            }


            function parseVijay () {
                var results = $scope.results;
                var resultKeys = _.keys(results);
                var resultKeysIndex = 0;

                var reportData = [];

                var key, dateMatch, rateFind;

                _.each($scope.yAxisLabelsV2, function (rateObj) {

                    // { is_rate_type, id }

                    if ( rateObj.is_rate_type ) {

                    }

                    _.each($scope.headerTop, function (dateObj) {
                        // { ms, name }

                        key = resultKeys[resultKeysIndex];
                        dateMatch = dateObj.ms === new tzIndependentDate(key) * 1;

                        if ( dateMatch ) {
                            rateFind = _.find($scope.results[key], { rate_id: rateObj.id });
                            reportData.push( parseDailyData({ [key]: rateFind }, false) );
                            resultKeysIndex += 1;
                        } else {
                            reportData.push({
                                [dateObj.ms]: {
                                    actual_revenue: 0,
                                    adr: 0,
                                    available_rooms_count: 0,
                                    room_revenue: 0,
                                    total_reservations_count: 0
                                }
                            }, false);
                        }
                    });

                    resultKeysIndex = 0;
                });
            }
        }
    ]);
