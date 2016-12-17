angular.module('sntRover')
.controller('RVDailyProdRoomTypeReportCtrl', [
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
                $timeout(isScrollReady, 1000);
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
            $timeout( reInit, 100 );
        });

        // cant disable both, when one disabled one the other should be enabled
        watchshowRevenue = $scope.$watch('uiFilter.showRevenue', function(newValue) {
            if ( false === newValue && ! $scope.uiFilter.showAvailability ) {
                $scope.uiFilter.showAvailability = true;
            }

            $scope.$emit('showLoader');
            $timeout( reInit, 300 );
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
                $scope.colSpan = 5;
            } else if ( ! $scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue ) {
                $scope.colSpan = 3;
            } else if ( $scope.uiFilter.showAvailability && ! $scope.uiFilter.showRevenue ) {
                $scope.colSpan = 2;
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

                        if ( 5 === $scope.colSpan ) {
                            startIndex = 0;
                            endIndex  = SUB_HEADER_NAMES.length;
                            triggerIndex = SUB_HEADER_NAMES.length - 1;
                        } else if ( 3 === $scope.colSpan ) {
                            startIndex = 2;
                            endIndex = SUB_HEADER_NAMES.length;
                            triggerIndex = SUB_HEADER_NAMES.length - 1;
                        } else if ( 2 === $scope.colSpan ) {
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

                    if ( 2 === $scope.colSpan ) {
                        eachDateVal.push({
                            value: dateObj['total_reservations_count'],
                            isAvail: true
                        });
                        eachDateVal.push({
                            value: dateObj['available_rooms_count'],
                            isAvail: true,
                            cls: 'last-day'
                        });
                    } else if ( 3 === $scope.colSpan ) {
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
                            isRev: true,
                            cls: 'last-day'
                        });
                    } else if ( 5 === $scope.colSpan ) {
                        eachDateVal.push({
                            value: dateObj['total_reservations_count'],
                            isAvail: true
                        });
                        eachDateVal.push({
                            value: dateObj['available_rooms_count'],
                            isAvail: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
                            isRev: true
                        });
                        eachDateVal.push({
                            value: $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
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
                }, 300 );
            };
        }

        function renderReact (options) {
            var args  = options || {},
                props = _.extend(args, {
                    'rightPaneWidth': $scope.rightPaneWidth,
                    'colspan': $scope.colSpan,
                    'headerTop': $scope.headerTop,
                    'headerBot': $scope.headerBot,
                    'reportData': $scope.reportData,
                    'isLastRowSum': true
                });

            ReactDOM.render(
                React.createElement(DPContent, props),
                document.getElementById('daily-production-render')
            );
        }

        function init (argument) {
            processData();
            renderReact();
        }

        init();

        function reInit (argument) {
            processData();
            renderReact();
        }
    }
]);
