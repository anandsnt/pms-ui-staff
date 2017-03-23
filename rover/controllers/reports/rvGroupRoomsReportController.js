angular.module('sntRover')
.controller('RVGroupRoomsReportController', [
    '$scope',
    'RVreportsSrv',
    '$filter',
    'RVReportMsgsConst',
    'rvUtilSrv',
    '$timeout',
    function($scope, RVreportsSrv, $filter, reportMsgs, rvUtilSrv, $timeout) {

        BaseCtrl.call(this, $scope);

        var SCROLL_NAME  = 'group-rooms-scroll';

        var setScroller = function() {
            $scope.setScroller(SCROLL_NAME, {
                'preventDefault': false,
                'probeType': 3
            });
        };

        var refreshScroll = function() {
            if ( $scope.myScroll.hasOwnProperty(SCROLL_NAME) ) {
                $scope.refreshScroller( SCROLL_NAME );
            }
        };

        var chosenReport = RVreportsSrv.getChoosenReport();

        // Transform the summary count from the api to the format required for the ui
        var processSummaryCounts = function(summaryCount, dateRange) {

                var blockedRooms = [dateRange.length],
                    availableRooms = [dateRange.length],
                    pickedUpRooms = [dateRange.length];


                    _.each(summaryCount.rooms_count, function(roomCount) {
                        var index = dateRange.indexOf(roomCount.date);

                        availableRooms[index] = roomCount.available;
                        pickedUpRooms[index] = roomCount.picked_up;
                        blockedRooms[index] = roomCount.blocked;
                    });

                    summaryCount.availableCounts = availableRooms;
                    summaryCount.pickedUpCounts = pickedUpRooms;
                    summaryCount.blockedCounts = blockedRooms;

        };

        // Transform the count from the api to the format required for the ui
        var processCounts = function(resultsFromApi, dateRange) {

             var blockedRooms, availableRooms, pickedUpRooms;

            _.each(resultsFromApi, function(group, index) {
                    blockedRooms = [dateRange.length],
                    availableRooms = [dateRange.length],
                    pickedUpRooms = [dateRange.length];


                    _.each(group.rooms_count, function(roomCount) {
                        var index = dateRange.indexOf(roomCount.date);

                        availableRooms[index] = roomCount.available;
                        pickedUpRooms[index] = roomCount.picked_up;
                        blockedRooms[index] = roomCount.blocked;
                    });


                    resultsFromApi[index].availableCounts = availableRooms;
                    resultsFromApi[index].pickedUpCounts = pickedUpRooms;
                    resultsFromApi[index].blockedCounts = blockedRooms;

            });

        };

        // Calculate the dates and styles required for rendering in ui
        var processDates = function(fromDate, toDate, dateRange) {
            var fromMoment = moment(chosenReport.fromDate),
                toMoment = moment(chosenReport.untilDate);

            $scope.fromMonth = fromMoment.format("MMMM");
            $scope.fromYear = fromMoment.format("YYYY");

            $scope.toMonth = toMoment.format("MMMM");
            $scope.toYear = toMoment.format("YYYY");

            $scope.showNextMonth = false;

            if ($scope.fromMonth !== $scope.toMonth) {
                $scope.showNextMonth = true;
            }

            $scope.days = rvUtilSrv.getDayBetweenTwoDates(fromDate, toDate);

            var fromMonthNo = chosenReport.fromDate.getMonth(),
                toMonthNo = chosenReport.untilDate.getMonth();

            if (fromMonthNo === toMonthNo) {
                $scope.noOfDaysFromMonth = $scope.days.length;
            } else {
                var currentMonthDays = 0,
                    nextMonthDays = 0;
                _.each(dateRange, function( dateObj ) {
                    if (rvUtilSrv.getMonthFromDateString(dateObj) === fromMonthNo ) {
                        currentMonthDays++;
                    } else {
                       nextMonthDays++;
                    }
                });

                $scope.noOfDaysFromMonth = currentMonthDays;
                $scope.noOfDaysToMonth = nextMonthDays;

            }

            $scope.columnWidth = 100 / $scope.days.length;
        };


        // Transform the data from the api
        var processData = function() {
            var fromDate = new Date(chosenReport.fromDate),
                toDate = new Date(chosenReport.untilDate);

            var dateRange = rvUtilSrv.getFormattedDatesBetweenTwoDates(fromDate, toDate);

            processDates(fromDate, toDate, dateRange);

            processSummaryCounts($scope.summaryCounts, dateRange);

            processCounts($scope.results, dateRange);

            $timeout(function() {
                refreshScroll();
            }, 1000);
        };

        // Initialize the controller and set up the listeners
        var init =  function() {

            processData();

            setScroller();

            var reportSubmited = $scope.$on( reportMsgs['REPORT_SUBMITED'], processData );
            var reportPrinting = $scope.$on( reportMsgs['REPORT_PRINTING'], processData );
            var reportUpdated = $scope.$on( reportMsgs['REPORT_UPDATED'], processData );
            var reportPageChanged = $scope.$on( reportMsgs['REPORT_PAGE_CHANGED'], processData );

            $scope.$on( '$destroy', reportSubmited );
            $scope.$on( '$destroy', reportUpdated );
            $scope.$on( '$destroy', reportPrinting );
            $scope.$on( '$destroy', reportPageChanged );

        };

        init();

    }]);
