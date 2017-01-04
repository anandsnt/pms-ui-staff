angular.module('sntRover')
.controller('RVDailyProdRoomTypeReport.Controller', [
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
        var DELAY_100 = 100;
        var DELAY_300 = 300;
        var DELAY_1000 = 1000;
        var LIMITER = 2;
        var COL_5 = 5;
        var COL_3 = 3;
        var COL_2 = 2;

        var detailsCtrlScope = $scope.$parent,
            mainCtrlScope = detailsCtrlScope.$parent;

        var LEFT_PANE_SCROLL = 'left-pane-scroll',
            RIGHT_PANE_SCROLL = 'right-pane-scroll';

        var refreshScrollers = function() {
            if ( mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) ) {
                $scope.refreshScroller( LEFT_PANE_SCROLL );
            }

            if ( mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL) ) {
                $scope.refreshScroller( RIGHT_PANE_SCROLL );
            }
        };

        var setupScrollListner = function() {
            mainCtrlScope.myScroll[ LEFT_PANE_SCROLL ]
                .on('scroll', function() {
                    mainCtrlScope.myScroll[ RIGHT_PANE_SCROLL ]
                        .scrollTo( 0, this.y );
                });

            mainCtrlScope.myScroll[ RIGHT_PANE_SCROLL ]
                .on('scroll', function() {
                    mainCtrlScope.myScroll[ LEFT_PANE_SCROLL ]
                        .scrollTo( 0, this.y );
                });
        };

        var isScrollReady = function isScrollReady () {
            if ( mainCtrlScope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) && mainCtrlScope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL) ) {
                setupScrollListner();
            } else {
                $timeout(isScrollReady, DELAY_1000);
            }
        };

        var destroyScrolls = function() {
            mainCtrlScope.myScroll[ LEFT_PANE_SCROLL ].destroy();
            delete mainCtrlScope.myScroll[ LEFT_PANE_SCROLL ];

            mainCtrlScope.myScroll[ RIGHT_PANE_SCROLL ].destroy();
            delete mainCtrlScope.myScroll[ RIGHT_PANE_SCROLL ];
        };

        var watchShowAvailability, watchshowRevenue, reportSubmited, reportPrinting, reportUpdated, reportPageChanged;

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

        isScrollReady();

        $scope.$on( '$destroy', destroyScrolls );

        // default colspan value
        $scope.colSpan = 5;

        // ui filter by default showing both avail. and rev.
        $scope.uiFilter = {
            'showAvailability': true,
            'showRevenue': true
        };

        // cant disable both, when one disabled one the other should be enabled
        watchShowAvailability = $scope.$watch('uiFilter.showAvailability', function(newValue) {
            if ( false === newValue && ! $scope.uiFilter.showRevenue ) {
                $scope.uiFilter.showRevenue = true;
            }
            
            $scope.$emit('showLoader');
            $timeout( reInit, DELAY_100 );
        });

        // cant disable both, when one disabled one the other should be enabled
        watchshowRevenue = $scope.$watch('uiFilter.showRevenue', function(newValue) {
            if ( false === newValue && ! $scope.uiFilter.showAvailability ) {
                $scope.uiFilter.showAvailability = true;
            }

            $scope.$emit('showLoader');
            $timeout( reInit, DELAY_300 );
        });

        // re-render must be initiated before for taks like printing.
        // thats why timeout time is set to min value 50ms
        reportSubmited = $scope.$on( reportMsgs['REPORT_SUBMITED'], reInit );
        reportPrinting = $scope.$on( reportMsgs['REPORT_PRINTING'], reInit );
        reportUpdated = $scope.$on( reportMsgs['REPORT_UPDATED'], reInit );
        reportPageChanged = $scope.$on( reportMsgs['REPORT_PAGE_CHANGED'], reInit );

        $scope.$on( '$destroy', watchShowAvailability );
        $scope.$on( '$destroy', watchshowRevenue );
        $scope.$on( '$destroy', reportSubmited );
        $scope.$on( '$destroy', reportUpdated );
        $scope.$on( '$destroy', reportPrinting );
        $scope.$on( '$destroy', reportPageChanged );

        /**
         * generate the 2D matrix data that will fill the content part of the report
         * @return {object} undefined
         *
         * @todo Need to break this into smaller functions
         */
        function processData() {
            var SUB_HEADER_NAMES = [
                'Rooms Occ',
                'Rooms Available',
                /**/
                'Forecast Room Revenue',
                'ADR',
                'Actual Room Revenue'
            ];

            var startIndex, endIndex, triggerIndex;

            var roomObj, dateObj;

            var loopCount = 0;

            var allDatesValInRoom = [],
                eachDateVal = [];

            var noOfDays = 0,
                cellWidth = 145;

            var results = $scope.results,
                actualName;

            var roomKey, dateKey;

            if ( $scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue ) {
                $scope.colSpan = COL_5;
            } else if ( ! $scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue ) {
                $scope.colSpan = COL_3;
            } else if ( $scope.uiFilter.showAvailability && ! $scope.uiFilter.showRevenue ) {
                $scope.colSpan = COL_2;
            }

            $scope.headerTop = [];
            $scope.headerBot = [];

            $scope.reportData = [];	// this will be an array of arrays
            $scope.roomNames = [];	// keeping seperate array so that we can avoid object being itrated aphabetically            

            $scope.rightPaneWidth = 0;

            for ( roomKey in results ) {
                if ( ! results.hasOwnProperty(roomKey) ) {
                    continue;
                }

                actualName = roomKey.split('__')[0];
                $scope.roomNames.push( actualName || 'NA' );

                roomObj = results[roomKey];
                allDatesValInRoom = [];

                for ( dateKey in roomObj ) {
                    if ( ! roomObj.hasOwnProperty(dateKey) ) {
                        continue;
                    }

                    if ( 0 === loopCount ) {
                        $scope.headerTop.push({
                            name: $filter('date')(dateKey, $rootScope.shortMonthAndDate)
                        });

                        if ( COL_5 === $scope.colSpan ) {
                            startIndex = 0;
                            endIndex = SUB_HEADER_NAMES.length;
                            triggerIndex = SUB_HEADER_NAMES.length - 1;
                        } else if ( COL_3 === $scope.colSpan ) {
                            startIndex = COL_2;
                            endIndex = SUB_HEADER_NAMES.length;
                            triggerIndex = SUB_HEADER_NAMES.length - 1;
                        } else if ( COL_2 === $scope.colSpan ) {
                            startIndex = 0;
                            endIndex = 1 + 1;
                            triggerIndex = 1;
                        }

                        for (; startIndex < endIndex; startIndex++) {
                            $scope.headerBot.push({
                                'name': SUB_HEADER_NAMES[startIndex],
                                'cls': startIndex === triggerIndex ? 'day-end' : ''
                            });
                        }

                        noOfDays += 1;
                    }

                    dateObj = roomObj[dateKey];

                    eachDateVal = [];

                    if ( COL_2 === $scope.colSpan ) {
                        eachDateVal.push({
                            value: dateObj['total_reservations_count'],
                            isAvail: true
                        });
                        eachDateVal.push({
                            value: dateObj['available_rooms_count'],
                            isAvail: true,
                            cls: 'last-day'
                        });
                    } else if ( COL_3 === $scope.colSpan ) {
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, LIMITER),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, LIMITER),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, LIMITER),
                            isRev: true,
                            cls: 'last-day'
                        });
                    } else if ( COL_5 === $scope.colSpan ) {
                        eachDateVal.push({
                            value: dateObj['total_reservations_count'],
                            isAvail: true
                        });
                        eachDateVal.push({
                            value: dateObj['available_rooms_count'],
                            isAvail: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, LIMITER),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, LIMITER),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, LIMITER),
                            isRev: true,
                            cls: 'last-day'
                        });
                    }

                    allDatesValInRoom = allDatesValInRoom.concat( eachDateVal );
                }

                loopCount += 1;

                $scope.reportData.push( allDatesValInRoom );
            }

            $scope.rightPaneWidth = noOfDays * cellWidth * $scope.colSpan;

            $timeout(function() {
                refreshScrollers();
                $scope.$emit('hideLoader');
            }, DELAY_300 );
        }

        /**
         * initiates the rendering of the react component
         * @param  {any} options any additional config data
         * @return {object}      undefined
         */
        function renderReact (options) {
            var args = options || {},
                props = _.extend(args, {
                    'rightPaneWidth': $scope.rightPaneWidth,
                    'colspan': $scope.colSpan,
                    'headerTop': $scope.headerTop,
                    'headerBot': $scope.headerBot,
                    'reportData': $scope.reportData,
                    'isLastRowSum': true
                });

            ReactDOM.render(
                // eslint-disable-next-line no-undef
                React.createElement(DPContent, props),
                // eslint-disable-next-line angular/document-service
                document.getElementById('daily-production-render')
            );
        }

        /**
         * initialize everything
         * @return {object} undefined
         */
        function init () {
            processData();
            renderReact();
        }

        init();

        /**
         * re-initialize everything
         * @return {object} undefined
         */
        function reInit () {
            processData();
            renderReact();
        }
    }
]);
