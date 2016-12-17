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
        // eslint-disable-next-line max-params
        function($rootScope, $scope, reportsSrv, reportsSubSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout) {
            var UNDEFINED = {
                id: 'UNDEFINED',
                rate_type_id: 'UNDEFINED',
                name: 'Undefined'
            };

            var detailsCtrlScope = $scope.$parent,
                mainCtrlScope = detailsCtrlScope.$parent;

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

            var isScrollReady = function () {
                if (mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) && mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL)) {
                    setupScrollListner();
                } else {
                    $timeout(isScrollReady, POLL);
                }
            };

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

            isScrollReady();

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
            $scope.$on('$destroy', reportSubmited);
            $scope.$on('$destroy', reportUpdated);
            $scope.$on('$destroy', reportPrinting);
            $scope.$on('$destroy', reportPageChanged);

            $scope.reactRenderDone = function() {
                refreshScrollers();
                $scope.$emit('hideLoader');
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
                        'isLastRowSum': false,
                        reactRenderDone: $scope.reactRenderDone
                    });

                ReactDOM.render(
                    // eslint-disable-next-line no-undef
                    React.createElement(DPContent, props),
                    // eslint-disable-next-line angular/document-service
                    document.getElementById('daily-production-render')
                );
            }

            function generateXaxisData (uiFilter, chosenReport, shortMonthAndDate) {
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

                var headerTop = [];
                var headerBot = [];
                var colspanArray = [];
                var rightPaneWidth = 0;
                var colSpan = 0;

                var ms = new tzIndependentDate(chosenReport.fromDate) * 1;
                var last = new tzIndependentDate(chosenReport.untilDate) * 1;
                var ONE_DAY = 86400000;
                var isPastDay, currentHeaders;

                if (uiFilter.showAvailability && uiFilter.showRevenue) {
                    headers = ['ROOMS', 'AVAILABLE_ROOMS', 'FORECAST', 'ADR']; 
                    // Header is initialized to FORECAST, If past date is selected it will be replaced with ACTUAL column
                } else if (!uiFilter.showAvailability && uiFilter.showRevenue) {
                    headers = ['FORECAST', 'ADR'];
                } else if (uiFilter.showAvailability && !uiFilter.showRevenue) {
                    headers = ['ROOMS', 'AVAILABLE_ROOMS'];
                }

                colSpan = headers.length;

                // compute Number of Days here!
                for (; ms <= last; ms += ONE_DAY) {
                    isPastDay = new tzIndependentDate(ms) < new tzIndependentDate($rootScope.businessDate);

                    headerTop.push({
                        ms: ms,
                        name: $filter('date')(ms, shortMonthAndDate)
                    });
                    currentHeaders = headers;

                    if (isPastDay && uiFilter.showRevenue) {
                        // Remove FORECAST header and push ACTUAL
                        currentHeaders = _.without(currentHeaders, 'FORECAST').concat(['ACTUAL']);
                        if (chosenReport.chosenOptions['include_addon_revenue']) {
                            currentHeaders.push('ADDON');
                        }
                    }

                    colspanArray.push(currentHeaders.length);

                    _.each(currentHeaders, function(idx) {
                        headerBot.push({
                            'name': SUB_HEADER_NAMES[idx],
                            'cls': idx === headers.length - 1 ? 'day-end' : ''
                        });
                    });

                    noOfDays += 1;
                }

                rightPaneWidth = noOfDays * cellWidth * _.max(colspanArray);

                return {
                    headerTop: headerTop,
                    headerBot: headerBot,
                    colSpan: colSpan,
                    colspanArray: colspanArray,
                    rightPaneWidth: rightPaneWidth
                };
            }

            function generateYaxisData (results, allRates, allRateTypes) {
                var yAxis = [];
                var resultCopy = angular.copy(results);

                var allMappedRates = _.indexBy(allRates, 'id');
                var allMappedRateTypes = _.indexBy(allRateTypes, 'rate_type_id');

                var matchedRate;
                var matchedRateType;
                var rateTypesInResults = {};

                _.each(resultCopy, function (dates) {
                    _.each(dates, function (post) {
                        matchedRate = allMappedRates[post.rate_id];

                        if ( _.isUndefined(matchedRate) ) {
                            matchedRateType = UNDEFINED;
                            post.rate_name = UNDEFINED.name;
                        } else {
                            matchedRateType = allMappedRateTypes[matchedRate.rate_type_id];
                            post.rate_name = matchedRate.rate_name || matchedRate.name;
                        }

                        post.rate_type_id = matchedRateType.rate_type_id;
                        post.rate_type_name = matchedRateType.name;

                        if ( _.has(rateTypesInResults, post.rate_type_id) ) {

                            if ( _.find(rateTypesInResults[post.rate_type_id].rates_data, { id: post.rate_id }) ) {
                                // do nothing, already pushed
                            } else {
                                rateTypesInResults[post.rate_type_id].rates_data.push({
                                    id: post.rate_id,
                                    name: post.rate_name
                                });
                            }
                        } else {
                            rateTypesInResults[post.rate_type_id] = {
                                id: post.rate_type_id,
                                name: post.rate_type_name,
                                rates_data: [{
                                    id: post.rate_id,
                                    name: post.rate_name
                                }]
                            };
                        }
                    });
                });

                _.each(rateTypesInResults, function (rateType) {
                    yAxis.push({
                        rate_type_id: rateType.id,
                        name: rateType.name,
                        is_rate_type: true
                    });

                    if ( rateType.name !== UNDEFINED.name ) {
                        _.each(rateType.rates_data, function (rates) {
                            yAxis.push({
                                rate_id: rates.id,
                                name: rates.name,
                                is_rate_type: false
                            });
                        });
                    }
                });

                return {
                    yAxis: yAxis,
                    modifiedResults: resultCopy
                };
            }

            function groupByKeyValue (source, key, value) {
                var grouped = [];

                _.each(source, function(item) {
                    if ( item[key] === value ) {
                        grouped.push(item);
                    }
                });

                return grouped;
            }

            function valueAdder (source) {
                var totals = {
                    adr: 0,
                    available_rooms_count: 0,
                    occupied_rooms_count: 0,
                    room_revenue: 0
                };

                var parser = function(value) {
                    var parsed = parseFloat(value);

                    return isNaN(parsed) ? 0 : parsed;
                };

                _.each(source, function(item) {
                    totals.adr += parser(item.adr);
                    totals.available_rooms_count += parser(item.available_rooms_count);
                    totals.occupied_rooms_count += parser(item.occupied_rooms_count);
                    totals.room_revenue += parser(item.room_revenue);
                });

                return totals;
            }

            function generateResultData(yAxis, headerTop, results) {
                var resultData = [];
                var matchedPost;
                var dateData;
                var insertedData;

                _.each(yAxis, function (yAxisItem, index) {
                    resultData.push([]);

                    _.each(results, function (dateObj, date) {
                        dateData = {
                            date: date,
                            businessDate: $rootScope.businessDate,
                            currencySymbol: $rootScope.currencySymbol,
                            showAvailability: $scope.uiFilter.showAvailability,
                            showRevenue: $scope.uiFilter.showRevenue
                        };

                        // if is a rate type there is not actual data
                        // fill the placeholders anyway
                        if ( yAxisItem.is_rate_type ) {
                            dateData.isRateType = true;
                            dateData.data = valueAdder( groupByKeyValue(dateObj, 'rate_type_id', yAxisItem.rate_type_id) );
                        } else {
                            matchedPost = _.find(dateObj, { rate_id: yAxisItem.rate_id });
                            dateData.isRateType = false;
                            dateData.data = matchedPost;
                        }

                        insertedData = insetDateData(dateData);
                        resultData[index] = resultData[index].concat( insertedData );
                    });
                });

                return resultData;
            }

            function insetDateData(options) {
                var limiter = 2,
                    eachDateVal = [],
                    isPastDay = new tzIndependentDate(options.date) < new tzIndependentDate(options.businessDate);

                var data = _.extend(
                    {
                        adr: 0,
                        available_rooms_count: 0,
                        occupied_rooms_count: 0,
                        rate_id: 0,
                        room_revenue: 0
                    },
                    options.data
                );

                if ( options.showAvailability && !options.showRevenue ) {
                    eachDateVal.push({
                        value: data.occupied_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                    eachDateVal.push({
                        value: data.available_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                } else if ( !options.showAvailability && options.showRevenue ) {
                    if ( !isPastDay ) {
                        eachDateVal.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                    eachDateVal.push({
                        value: $filter('currency')(data.adr, options.currencySymbol, limiter),
                        isRev: true,
                        isRateType: options.isRateType
                    });
                    if (isPastDay) {
                        eachDateVal.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                } else if ( options.showAvailability && options.showRevenue ) {
                    eachDateVal.push({
                        value: data.occupied_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                    eachDateVal.push({
                        value: data.available_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                    if ( !isPastDay ) {
                        eachDateVal.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                    eachDateVal.push({
                        value: $filter('currency')(data.adr, options.currencySymbol, limiter),
                        isRev: true,
                        isRateType: options.isRateType
                    });

                    if (isPastDay) {
                        eachDateVal.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                }

                return eachDateVal;
            }

            function init () {
                var genXAxis, genYAxis, modifiedResults;

                if ( ! _.has($scope.chosenReport, 'hasRateFilter') ) {
                    return;
                }

                genXAxis = generateXaxisData($scope.uiFilter, $scope.chosenReport, $rootScope.shortMonthAndDate);

                $scope.headerTop = genXAxis.headerTop;
                $scope.headerBot = genXAxis.headerBot;
                $scope.colSpan = genXAxis.colSpan;
                $scope.colspanArray = genXAxis.colspanArray;
                $scope.rightPaneWidth = genXAxis.rightPaneWidth;

                genYAxis = generateYaxisData($scope.results, $scope.chosenReport.hasRateFilter.data, $scope.chosenReport.hasRateTypeFilter.data);
                $scope.yAxisLabels = genYAxis.yAxis;
                modifiedResults = genYAxis.modifiedResults;

                $scope.reportData = generateResultData($scope.yAxisLabels, $scope.headerTop, modifiedResults);

                renderReact();
            }

            function reInit() {
                init();
            }

            init();
        }
    ]);
