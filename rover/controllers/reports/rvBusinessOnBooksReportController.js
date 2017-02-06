angular.module('sntRover')
.controller('RVBusinessOnBooksController', [
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

        BaseCtrl.call(this, $scope);

        var LEFT_PANE_SCROLL = 'left-pane-scroll',
            RIGHT_PANE_SCROLL = 'right-pane-scroll',
            DELAY_1000 = 1000,
            DELAY_300 = 300;


        var setScroller = function() {
            $scope.setScroller(LEFT_PANE_SCROLL, {
                'preventDefault': false,
                'probeType': 3
            });

            $scope.setScroller(RIGHT_PANE_SCROLL, {
                'preventDefault': false,
                'probeType': 3,
                'scrollX': true
            });

        };

        var setupScrollListner = function() {
            $scope.myScroll[ LEFT_PANE_SCROLL ]
                .on('scroll', function() {
                    $scope.myScroll[ RIGHT_PANE_SCROLL ]
                        .scrollTo( 0, this.y );
                });

            $scope.myScroll[ RIGHT_PANE_SCROLL ]
                .on('scroll', function() {
                    $scope.myScroll[ LEFT_PANE_SCROLL ]
                        .scrollTo( 0, this.y );
                });
        };

        var isScrollReady = function isScrollReady () {
            if ( $scope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) && $scope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL) ) {
                setupScrollListner();
            } else {
                $timeout(isScrollReady, DELAY_1000);
            }
        };

        var refreshScrollers = function() {
            if ( $scope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) ) {
                $scope.refreshScroller( LEFT_PANE_SCROLL );
            }

            if ( $scope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL) ) {
                $scope.refreshScroller( RIGHT_PANE_SCROLL );
            }
        };

        var processData = function() {
           $scope.dates = [];
           $scope.roomDetails = [];
           var results = $scope.results;
           _.each(results, function(result) {
                $scope.dates.push(result.date);
                $scope.roomDetails.push(result);
           });
           $timeout(function() {
                refreshScrollers();
                $scope.$emit('hideLoader');
            }, DELAY_1000 );
        };

        var init =  function() {
            setScroller();
            isScrollReady();
            processData();

            reportSubmited = $scope.$on( reportMsgs['REPORT_SUBMITED'], processData );
            reportPrinting = $scope.$on( reportMsgs['REPORT_PRINTING'], processData );
            reportUpdated = $scope.$on( reportMsgs['REPORT_UPDATED'], processData );
            reportPageChanged = $scope.$on( reportMsgs['REPORT_PAGE_CHANGED'], processData );

            $scope.$on( '$destroy', reportSubmited );
            $scope.$on( '$destroy', reportUpdated );
            $scope.$on( '$destroy', reportPrinting );
            $scope.$on( '$destroy', reportPageChanged );

        };

        init();



    }]);
