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

            var didOnce;

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

            /**
             * initiates the rendering of the react component
             * @param  {any} args any additional config data
             * @return {object}      undefined
             */
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

            /**
             * generated the header data with dates and each sub-header values
             * this also allows to calculate few other things like total width
             * @param  {object} uiFilter          the two ui filter status
             * @param  {object} chosenReport      the choosen report from the report list page
             * @param  {string} shortMonthAndDate info on how we want to show the date
             * @return {object}                   computed datas { headerTop, headerBot, colSpan, colspanArray, rightPaneWidth }
             */
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

            /**
             * generate the rate type name and in it the child rate name data which is
             * drawn on the left side as yAxis
             * generated a modified copy of results with each entry having its -
             * rate_name, rate_type_id and rate_type_name augmented.
             * @param  {array} results      results from the api
             * @param  {array} allRates     all rates info from list page
             * @param  {array} allRateTypes all rate types info from list page
             * @return {object}             computed data { yAxis, modifiedResults }
             */
            function genYaxisDataAndResults (results, didOnce) {
                var yAxis = [];
                var resultCopy = angular.copy(results);

                var matchedRate;
                var matchedRateType;
                var rateTypesInResults = {};

                _.each(resultCopy, function (dateObj, date) {
                    _.each(dateObj, function (post) {
                        matchedRate = didOnce.allMappedRates[post.rate_id];

                        if ( _.isUndefined(matchedRate) ) {
                            matchedRateType = UNDEFINED;
                            post.rate_name = UNDEFINED.name;
                        } else {
                            matchedRateType = didOnce.allMappedRateTypes[matchedRate.rate_type_id];
                            post.rate_name = matchedRate.rate_name || matchedRate.name;
                        }

                        post.rate_type_id = matchedRateType.rate_type_id;
                        post.rate_type_name = matchedRateType.name;

                        if ( _.has(rateTypesInResults, post.rate_type_id) ) {
                            rateTypesInResults[post.rate_type_id]
                                .rates_data[post.rate_id] = {
                                    id: post.rate_id,
                                    name: post.rate_name
                                };
                        } else {
                            rateTypesInResults[post.rate_type_id] = {
                                id: post.rate_type_id,
                                name: post.rate_type_name,
                                rates_data: {
                                    [post.rate_id]: {
                                        id: post.rate_id,
                                        name: post.rate_name
                                    }
                                }
                            };
                        }
                    });

                    resultCopy[date] = _.indexBy(dateObj, 'rate_id');
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

            /**
             * similar to the groupBy method on Underscore, except we specify the
             * exact value we are looking for in the subset/modified-set groupBy creates
             * @param  {array} source array of items
             * @param  {string} key    name of the key in each item
             * @param  {number|string} value  the exact value we are looking for
             * @return {array}        the found sub-set of source
             */
            function groupByKeyValue (source, key, value) {
                var grouped = [];

                _.each(source, function(item) {
                    if ( item[key] === value ) {
                        grouped.push(item);
                    }
                });

                return grouped;
            }

            /**
             * adds up the key-values of entries in an array, specifically for rate postings
             * @param  {array} source the array of entries
             * @return {object}        calculated totals
             */
            function valueAdder (source) {
                var adr = 0;
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
                    totals.available_rooms_count = item.available_rooms_count;
                    totals.occupied_rooms_count += parser(item.occupied_rooms_count);
                    totals.room_revenue += parser(item.room_revenue);
                });

                adr = totals.room_revenue / totals.occupied_rooms_count;
                totals.adr = isNaN( adr ) ? 0 : adr;

                return totals;
            }

            /**
             * generate the 2D matrix data that will fill the content part of the report
             * @param  {array} yAxis     generated yAxis data with rate types and rates to help fill horizontally
             * @param  {array} results   modified api results that will help fill vertically
             * @return {array}           composed array of array representing the data
             */
            function generateResultData(yAxis, results) {
                var resultData = [];
                var matchedPost;
                var dateData;
                // var insertedData;

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
                            matchedPost = dateObj[yAxisItem.rate_id];
                            dateData.isRateType = false;
                            dateData.data = matchedPost;
                        }

                        // insertedData = insertDateData(dateData);
                        // resultData[index] = resultData[index].concat( insertedData );
                        insertDateData(resultData[index], dateData);
                    });
                });

                return resultData;
            }

            /**
             * insert each date rate/type data into the 2D matrix horizontally
             * @param  {array} source snow-balling row from matrix
             * @param  {object} options config and data passed in
             * @return {array}         partial array containing data of a single date
             */
            function insertDateData(source, options) {
                var limiter = 2,
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
                    source.push({
                        value: data.occupied_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                    source.push({
                        value: data.available_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                } else if ( !options.showAvailability && options.showRevenue ) {
                    if ( !isPastDay ) {
                        source.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                    source.push({
                        value: $filter('currency')(data.adr, options.currencySymbol, limiter),
                        isRev: true,
                        isRateType: options.isRateType
                    });
                    if (isPastDay) {
                        source.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                } else if ( options.showAvailability && options.showRevenue ) {
                    source.push({
                        value: data.occupied_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                    source.push({
                        value: data.available_rooms_count,
                        isAvail: true,
                        isRateType: options.isRateType
                    });
                    if ( !isPastDay ) {
                        source.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                    source.push({
                        value: $filter('currency')(data.adr, options.currencySymbol, limiter),
                        isRev: true,
                        isRateType: options.isRateType
                    });

                    if (isPastDay) {
                        source.push({
                            value: $filter('currency')(data.room_revenue, options.currencySymbol, limiter),
                            isRev: true,
                            isRateType: options.isRateType
                        });
                    }
                }

                return source;
            }
            
            function doOnce (allRates, allRateTypes) {
                return {
                    allMappedRates: _.indexBy(allRates, 'id'),
                    allMappedRateTypes: _.indexBy(allRateTypes, 'rate_type_id')
                };
            }
            didOnce = doOnce($scope.chosenReport.hasRateFilter.data, $scope.chosenReport.hasRateTypeFilter.data);

            /**
             * initialize everything
             * @return {object} undefined
             */
            function init () {
                var genXAxis, genYAxis, modifiedResults;
                var results = mainCtrlScope.results;

                if ( ! _.has($scope.chosenReport, 'hasRateFilter') ) {
                    return;
                }

                genXAxis = generateXaxisData($scope.uiFilter, $scope.chosenReport, $rootScope.shortMonthAndDate);

                $scope.headerTop = genXAxis.headerTop;
                $scope.headerBot = genXAxis.headerBot;
                $scope.colSpan = genXAxis.colSpan;
                $scope.colspanArray = genXAxis.colspanArray;
                $scope.rightPaneWidth = genXAxis.rightPaneWidth;

                genYAxis = genYaxisDataAndResults(results, didOnce);
                $scope.yAxisLabels = genYAxis.yAxis;
                modifiedResults = genYAxis.modifiedResults;

                $scope.reportData = generateResultData($scope.yAxisLabels, modifiedResults);

                renderReact();
            }

            /**
             * re-initialize everything
             * @return {object} undefined
             */
            function reInit() {
                init();
            }

            init();
        }
    ]);
