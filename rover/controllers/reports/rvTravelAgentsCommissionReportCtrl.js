angular.module('sntRover')
.controller('RVTravelAgentsCommissionReportCtrl', [
    '$scope',
    'RVReportParserFac',
    '$timeout',
    'RVReportMsgsConst',
    function($scope, reportParser, $timeout, reportMsgs) {

       //  console.log($scope.results)
       // var loadAPIData = function(){
       //  console.log("reached")
       // }
       //   $scope.commisionReportTAPagination = {
       //               id: 'TA_COMMISSION_REPORT_MAIN',
       //               api: loadAPIData,
       //               perPage: 5
       //           };

       var SCROLL_NAME  = 'report-content-travel-agents-commission',
            timer;

        var refreshScroll = function() {
            console.log("---scroll")
            $scope.refreshScroller(SCROLL_NAME);
        };

        var setScroller = function() {
            $scope.setScroller(SCROLL_NAME, {
                probeType: 3,
                tap: true,
                preventDefault: false,
                scrollX: false,
                scrollY: true
            });
        };
        console.log("scroollllllll")
        setScroller();
        $scope.$on("TRAVEL_AGENT_COMMISSIONS_SCROLL", function(){
            refreshScroll();
        });

    }]);