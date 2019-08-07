angular.module('sntRover')
.controller('rvDiaryUnassignedListController',
    [
        '$scope',
        '$rootScope',
        'rvDiarySrv',
        function($scope, $rootScope, rvDiarySrv) {

            BaseCtrl.call(this, $scope);

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

            /**
             * Function to toggle the visibility of the unassigned panel
             * @return {boolean}
             */
            $scope.showUnassignedListPanel = function() {
                // === true ? 'visible' : ''; - toggle visibility with style instead of angular directive
                return $scope.gridProps.unassignedRoomList.open || false;
            };

            // $scope.getUdReservationsData = function() {
            //     return $scope.gridProps.unassignedRoomList.data || [];
            // };

            fetchUdReservationList();
            
            // var init = function() {
            //     var _sucess = function(data) {
            //         this.data = data;
            //         this.open = true;
            //         $scope.renderGrid();

            //         $scope.$emit('hideLoader');
            //     };

            //     var _failed = function(error) {
            //         this.data = [];
            //         $scope.errorMessage = error;
            //         $scope.renderGrid();

            //         $scope.$emit('hideLoader');
            //     };

            //     if ( this.open ) {
            //         this.reset();
            //     } else {
            //         this.data = [];
            //         this.dragData = {};
            //         $scope.invokeApi(rvDiarySrv.fetchUnassignedRoomList, {
            //             date: $filter('date')($scope.gridProps.filter.arrival_date, $rootScope.dateFormatForAPI)
            //         }, _sucess, _failed);
            //     }
            // };
        }
    ]
);
