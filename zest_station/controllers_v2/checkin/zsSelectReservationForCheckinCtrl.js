sntZestStation.controller('zsSelectReservationForCheckInCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    '$stateParams',
    function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv, $stateParams) {
        
        /**********************************************************************************************
        **      Please note that, not all the stateparams passed to this state will not be used in this state, 
        **      however we will have to pass this so as to pass again to future states which will use these.
        **
        **      Expected state params -----> guest_id    
        **      Exit function -> selectReservation                              
        **                                                                       
        ***********************************************************************************************/

        //This controller is to select checkin reservation from list of reservations.

        BaseCtrl.call(this, $scope);

        $scope.selectReservation = function(reservation){
            var selectedReservation = [];
            selectedReservation.push(reservation);
            zsCheckinSrv.setSelectedCheckInReservation(selectedReservation);
            var primaryGuest = _.find(selectedReservation[0].guest_details, function(guest_detail) {
                return guest_detail.is_primary === true;
            });
            if($scope.zestStationData.check_in_collect_nationality){
                $state.go('zest_station.collectNationality',{'guestId':primaryGuest.id});
            }else{
                $state.go('zest_station.checkInReservationDetails');
            }

        };
        var initPagination = function(){
            $scope.itemPerPage = 3;
            $scope.currentPage = 1;
            $scope.totalPages = Math.ceil($scope.reservations.length / $scope.itemPerPage);
        };
        $scope.moveToNextPage = function(){
            if($scope.currentPage ===$scope.totalPages){
                return;
            };
            $scope.currentPage++;
            listReservations();
        };
        $scope.moveToPreviousPage = function(){
            if($scope.currentPage ===1){
                return;
            };
            $scope.currentPage--;
            listReservations();
        };
        var listReservations = function(){
            $scope.listedReservations = _.filter($scope.reservations , function(reservations, index){
                return Math.ceil((index+1)/$scope.itemPerPage) == ($scope.currentPage) ;
            });
        };
        var getCheckInReservations = function(){
            $scope.reservations = zsCheckinSrv.getCheckInReservations();
            //Deleting reservation details from zsCheckinSrv
            zsCheckinSrv.setCheckInReservations([]);
        };
        var init = function() {
            //hide back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            //back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
                $state.go('zest_station.checkInReservationSearch');
                //what needs to be passed back to re-init search results
                //  if more than 1 reservation was found? else go back to input 2nd screen (confirmation, no of nites, etc..)
            });
            //starting mode
            $scope.mode = "RESERVATION_DETAILS";
            getCheckInReservations();
            initPagination();
            listReservations();
        };
        init();
    }
]);