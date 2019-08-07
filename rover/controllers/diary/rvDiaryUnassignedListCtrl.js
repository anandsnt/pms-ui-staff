angular.module('sntRover')
.controller('rvDiaryUnassignedListController',
    [
        '$scope',
        '$rootScope',
        'rvDiarySrv',
        function($scope, $rootScope, rvDiarySrv) {

            BaseCtrl.call(this, $scope);

            /**
             * Function to fetch the unassigned reservations on loading the controller
             * @return {Array}
             */
            var fetchUdReservationList = function () {
                var successCallBackFetchList = function(data) {
                        $scope.errorMessage = '';
                        $scope.udReservationsData = data;
                    },
                    postData = {
                        'date': $scope.gridProps.filter.arrival_date
                    },
                    options = {
                        params: postData,
                        successCallBack: successCallBackFetchList
                    };
    
                $scope.callAPI(rvDiarySrv.fetchUnassignedRoomList, options);
            };

            $scope.businessDate = $rootScope.businessDate;

            /**
             * Function to toggle the visibility of the unassigned panel
             * @return {boolean}
             */
            $scope.showUnassignedListPanel = function() {
                // === true ? 'visible' : ''; - toggle visibility with style instead of angular directive
                return $scope.gridProps.unassignedRoomList.open || false;
            };

            /**
             * 
             */
            $scope.clickedUnassignedReservation = function(reservation) {
                console.log('reservation', reservation);
                $scope.selectedIndex = reservation.reservation_id;
                $scope.$emit('UNASSIGNED_RESERVATION_SELECTED');
            };

            fetchUdReservationList();
        }
    ]
);
