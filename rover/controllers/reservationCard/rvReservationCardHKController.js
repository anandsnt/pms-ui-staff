sntRover.controller('rvReservationCardHKController',
    ['$scope', '$filter','$stateParams', '$rootScope', '$state', '$timeout', 'rvReservationHouseKeepingSrv',
    function($scope, $filter,$stateParams, $rootScope , $state, $timeout, rvReservationHouseKeepingSrv) {

        BaseCtrl.call(this, $scope);

        $scope.toggleHKDetails = function() {
            $scope.houseKeeping.hideDetails = !$scope.houseKeeping.hideDetails;
            $scope.refreshScroller('resultDetails');
            $timeout(function(){
                $scope.$parent.myScroll['resultDetails'].scrollTo($scope.$parent.myScroll['resultDetails'].maxScrollX,
                    $scope.$parent.myScroll['resultDetails'].maxScrollY, 500);
            }, 500);

        };

        $scope.toggleService = function() {
            // save data
        };

        $scope.selectDefaultTask = function(workType, task) {
            // save data
        };

        $scope.save = function() {
            // call put api
        };

        var fetchInitialDataSuccessCallBack = function(data) {
            $scope.houseKeeping.workTypes = data.work_types;
            $scope.houseKeeping.serviceEnabled = data.is_room_service_opted;
            $scope.houseKeeping.reservationTasks = data.reservation_tasks;
            $scope.houseKeeping.defaultWorkTyoe = data.default_work_type;
        };

        var fetchInitialDataFailureCallBack = function(error) {
            $scope.errorMessage = error;
        };

        /**
         * All inital API calls.
         * 1. Fetch list of work types and tasks configured to show on show card
         * @return {undefined}
         */
        var callInitialAPIs = function() {
            var params = {
                reservation_id: $scope.reservationData.reservation_card.reservation_id
            };

            $scope.invokeApi(rvReservationHouseKeepingSrv.fetch, params, fetchInitialDataSuccessCallBack, fetchInitialDataFailureCallBack);
        };

        var init = function(){
            $scope.houseKeeping = {};
            $scope.houseKeeping.serviceEnabled = true;
            $scope.houseKeeping.hideDetails = true;

            // fetch all necessary data
            callInitialAPIs();
        };
        init();
    }
]);