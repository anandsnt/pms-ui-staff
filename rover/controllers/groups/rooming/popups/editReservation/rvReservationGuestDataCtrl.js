angular.module('sntRover').controller('rvReservationGuestDataPopupCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    'rvGroupRoomingListSrv',
    '$state',
    function ($rootScope,
            $scope,
            $timeout,
            rvGroupRoomingListSrv,
            $state) {
        //To set the title
    $scope.title = ($scope.isUpdateReservation) ? "Edit" : "Add";
    //Updating and adding some params to show in screen
    //accompanyingLength, occupancyName etc are not there in API
    _.each($scope.selected_reservations, function(eachData){
            eachData.isOpenAccompanyingGuest = false;
            var cnt = 0;
            angular.forEach(eachData.accompanying_guests_details, function(value, key) {
              if(value.first_name !== "" && value.first_name !== null){
                  cnt = cnt + 1;
              }
        });
        eachData.accompanyingLength = cnt;
        var occupancyName = "";
        if(eachData.occupancy ===1){
            occupancyName = "Single";
        } else if(eachData.occupancy === 2){
            occupancyName = "Double";
        } else if(eachData.occupancy === 3){
            occupancyName = "Triple";
        } else if(eachData.occupancy === 4){
            occupancyName = "Quadruple";
        }
        eachData.occupancyName = occupancyName;
    });
    /*
     * Toggle action of accompanying guest
     */
    $scope.toggleAccompanyingGuest = function(index){
        _.each($scope.selected_reservations, function(eachData, resIndex){
            if(resIndex !== index)
                eachData.isOpenAccompanyingGuest = false;
        });
        $scope.selected_reservations[index].isOpenAccompanyingGuest = !$scope.selected_reservations[index].isOpenAccompanyingGuest;
    };
    var successCallBackOfUpdateGuestData = function(){

    };
    /*
     * To update all selected reservations guest data
     */
    $scope.updateCompleteGuestData = function(){

        var unWantedKeysToRemove = ['confirm_no', 'reservation_status', 'arrival_date',
                                    'departure_date', 'guest_card_id', 'rate_id', 'room_type_id', 'room_type_name',
                                    'room_rate_amount', 'can_checkin', 'can_checkout', 'is_guest_name_added',
                                    'is_room_number_present', 'is_room_ready', 'due_in', 'room_id', 'room_no',
                                    'fostatus', 'roomstatus', 'checkin_inspected_only', 'room_ready_status',
                                    'isOpenAccompanyingGuest', 'accompanyingLength', 'occupancyName'];
        var guestData = [];
        _.each($scope.selected_reservations, function(eachData, resIndex){
            guestData.push(dclone(eachData, unWantedKeysToRemove));
        });
        var data = {};
        data.guest_data = guestData;

        var options = {
            params: data,
            successCallBack: successCallBackOfUpdateGuestData
        };
        $scope.callAPI(rvGroupRoomingListSrv.updateGuestData, options);

    }



}]);