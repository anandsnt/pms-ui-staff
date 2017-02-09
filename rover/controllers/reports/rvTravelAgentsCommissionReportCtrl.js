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
            setScroller(); }, 1000);

        $scope.$on("TRAVEL_AGENT_COMMISSIONS_SCROLL", function() {
            $timeout(function() {
                refreshScroll();
            }, 1000);
        });

        var selectedTAAgentId;
        var successFetch = function (response) {
            $scope.results = _.each($scope.results, function(travelAgents) {
                $scope.$emit( 'hideLoader' );
                if(travelAgents.travel_agent_id === selectedTAAgentId) {
                    travelAgents.reservation_details = response;
                }
                return travelAgents;
            });

            $timeout(function() {
                refreshScroll();
            }, 1000);
        };

        $scope.$on("updateReservations", function(e, paramsToApi) {
            selectedTAAgentId = paramsToApi.travel_agent_id;
            $scope.invokeApi(RVreportsSubSrv.getReservationsOfTravelAgents, paramsToApi, successFetch);
        });

        $scope.$on("UPDATE_RESULTS", function(e, results) {
            $scope.results = results;
        });


    }]);