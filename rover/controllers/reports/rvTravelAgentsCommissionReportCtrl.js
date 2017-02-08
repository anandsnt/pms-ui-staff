angular.module('sntRover')
.controller('RVTravelAgentsCommissionReportCtrl', [
    '$scope',
    'RVReportParserFac',
    '$timeout',
    'RVReportMsgsConst',
    'RVreportsSubSrv',
    function($scope, reportParser, $timeout, reportMsgs, RVreportsSubSrv) {

       var SCROLL_NAME  = 'report-content-travel-agents-commission',
            timer;

        var refreshScroll = function() {
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
        $timeout( function() {
            setScroller(); }, 2000);

        $scope.$on("TRAVEL_AGENT_COMMISSIONS_SCROLL", function() {
            $timeout(function() {
                refreshScroll();
            }, 3000);
        });

        var successFetch = function (response) {
            console.log(response);
        };
        var failureFetch = function (response) {
            console.log("response== failed");
        };
        $scope.$on("updateReservations", function(e, paramsToApi) {
            $scope.invokeApi(RVreportsSubSrv.getReservationsOfTravelAgents, paramsToApi, successFetch, failureFetch);
            // $scope.results = [];
            // $scope.$apply();
        });


    }]);