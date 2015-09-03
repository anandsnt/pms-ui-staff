sntRover.controller('rvGroupReservationEditCtrl', [
    '$rootScope',
    '$scope',
    'rvGroupRoomingListSrv',
    '$filter',
    '$timeout',
    'rvUtilSrv',
    'rvGroupConfigurationSrv',
    '$state',
    function ($rootScope,
        $scope,
        rvGroupRoomingListSrv,
        $filter,
        $timeout,
        util,
        rvGroupConfigurationSrv,
        $state) {

    BaseCtrl.call(this, $scope);

    //variables
    var initialPopupData = {};

    /**
     * should we allow to change the room of a particular reservation
     * @param {Object} reservation
     * @return {Boolean}
     */
    $scope.shouldDisableChangeRoom = function(reservation) {
        var rStatus = reservation.reservation_status,
            validResStatuses = ["RESERVED", "CHECKING_IN"];
        return !_.contains(validResStatuses, rStatus);
    };

    /**
     * should we allow to change from date of a particular reservation
     * @param {Object} reservation
     * @return {Boolean}
     */
    $scope.shouldDisableFromDateChange = function(reservation) {
        var rStatus = reservation.reservation_status,
            validResStatuses = ["RESERVED", "CHECKING_IN"];
        return !_.contains(validResStatuses, rStatus);
    };

    /**
     * should we allow to change to date of a particular reservation
     * @param {Object} reservation
     * @return {Boolean}
     */
    $scope.shouldDisableToDateChange = function(reservation) {
        var rStatus = reservation.reservation_status,
            validResStatuses = ["RESERVED", "CHECKING_IN", "CHECKEDIN", "CHECKING_OUT"];
        return !_.contains(validResStatuses, rStatus);
    };

    /**
     * is Room Number is empty
     * @return {Boolean} [description]
     */
    $scope.isEmptyRoomNumber = function(roomNo) {
        return (roomNo === null || roomNo === '');
    };

    /**
     * to run angular digest loop,
     * will check if it is not running
     * return - None
     */
    var runDigestCycle = function() {
        if (!$scope.$$phase) {
            $scope.$digest();
        }
    };

    /**
    * utility method to get the formmated date for API
    * @param  {String} dateString
    * @return {String} [formatted date]
    */
    var getFormattedDateForAPI = function (dateString) {
        return $filter('date')(tzIndependentDate(dateString), $rootScope.dateFormatForAPI);
    };

    /**
    * we need to update the reservation listing after updation
    */
    var onUpdateReservationSuccess = function(data) {
        $scope.closeDialog();
        $scope.$emit("REFRESH_GROUP_ROOMING_LIST_DATA");
    };

    /**
    * Method to update the reservation
    * @param  {object} reservation
    * @return {undefined}
    */
   
    $scope.updateReservation = function(reservation) {       
        

            $scope.errorMessage = "";

            _.extend(reservation, {
              group_id: $scope.groupConfigData.summary.group_id,
              arrival_date: getFormattedDateForAPI($scope.roomingListState.editedReservationStart),
              departure_date: getFormattedDateForAPI($scope.roomingListState.editedReservationEnd),
              room_type_id: parseInt(reservation.room_type_id),
              room_id: parseInt(reservation.room_id)
            });

            var options = {
              params: reservation,
              successCallBack: onUpdateReservationSuccess
            };
            $scope.callAPI(rvGroupConfigurationSrv.updateRoomingListItem, options);
        
    };

    /**
     * to goto staycard
     * @param {Object} reservation
     * @return {undefined}
     */
    $scope.navigateStayCard = function(reservation) {
        // Navigate to StayCard
        if (reservation.reservationStatusFlags.isGuestAttached) {
            $scope.closeDialog();
            $timeout(function() {
                $scope.$emit('showLoader');
                $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
                    "id": reservation.id,
                    "confirmationId": reservation.confirm_no,
                    "isrefresh": false
                });
            }, 750);
        }
    };

    /**
    * when we completed the fetching of free rooms available
    * @param  {Object} - free rooms available
    * @return {undefined}
    */
    var successCallBackOfListOfFreeRoomsAvailable = function (data) {
        var roomId = initialPopupData.room_id,
            assignedRoom = [],
            isSameRoomType = (initialPopupData.room_type_id === $scope.ngDialogData.room_type_id);

        if (roomId !== null && roomId !== '' && isSameRoomType) {
            assignedRoom = [{
                id: roomId,
                room_number: initialPopupData.room_no
            }];
        }

        //Since we have to include already assigned rooms in the select box, merging with rooms coming from the api
        $scope.ngDialogData.roomsFreeToAssign = assignedRoom.concat(data.rooms);
    };

    /**
    * when the room type changed from edit reservation popup
    * @param  {Object} ngDialogData [reservation data]
    * @return {undefined}
    */
    $scope.changedReservationRoomType = function () {
        var rData = $scope.ngDialogData;

        var paramsForListOfFreeRooms = {
            reserevation_id: rData.id,
            num_of_rooms_to_fetch: 5,
            room_type_id: rData.room_type_id
        };

        var options = {
            params: paramsForListOfFreeRooms,
            successCallBack: successCallBackOfListOfFreeRoomsAvailable
        };
        $scope.callAPI(rvGroupRoomingListSrv.getFreeAvailableRooms, options);
    };

    /**
    * when the reservation remove success
    * @param  {Object} data [API response]
    * @return {undefined}
    */
    var onRemoveReservationSuccess = function(data) {
        //calling initially required APIs
        $scope.$emit("REFRESH_GROUP_ROOMING_LIST_DATA");

        $timeout(function() {
            $scope.closeDialog();
        }, 700);
    };

    /**
    * Method to remove the reservation
    * @param  {object} reservation
    * @return {undefined}
    */
    $scope.removeReservation = function(reservation) {
        var rStatusFlags = reservation.reservationStatusFlags,
            options = null,
            params = null;

        if (!rStatusFlags.isExpected) {
            return false;
        }
        else {
            params = {
                id: reservation.id,
                group_id: $scope.groupConfigData.summary.group_id
            };

            options = {
                params: params,
                successCallBack: onRemoveReservationSuccess
            };
            $scope.callAPI(rvGroupConfigurationSrv.removeRoomingListItem, options);
        }
    };

    /**
     * when the reservation from choosed
     * @return {undefined}
     */
    var reservationFromDateChoosed = function(date, datePickerObj) {
        $scope.roomingListState.editedReservationStart = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
        runDigestCycle();
    };

    /**
     * when the reservation to choosed
     * @return {undefined}
     */
    var reservationToDateChoosed = function(date, datePickerObj) {
        $scope.roomingListState.editedReservationEnd = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
        runDigestCycle();
    };

    /**
     * utility function to set datepicker options
     * return - None
     */
    var setDatePickerOptions = function() {
        //referring data model -> from group summary
        var refData = $scope.groupConfigData.summary;

        //date picker options - Common
        var commonDateOptions = {
            dateFormat: $rootScope.jqDateFormat,
            numberOfMonths: 1,
            minDate: new tzIndependentDate(refData.block_from),
            maxDate: new tzIndependentDate(refData.block_to),
            beforeShow: function(input, inst) {
                $('#ui-datepicker-div').addClass('reservation hide-arrow');
                $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

                setTimeout(function() {
                    $('body').find('#ui-datepicker-overlay')
                        .on('click', function() {
                            $('#room-out-from').blur();
                            $('#room-out-to').blur();
                        });
                }, 100);
            },
            onClose: function(value) {
                $('#ui-datepicker-div').removeClass('reservation hide-arrow');
                $('#ui-datepicker-overlay').off('click').remove();
            }
        };

        //date picker options - From
        $scope.reservationFromDateOptions = _.extend({
            onSelect: reservationFromDateChoosed
        }, commonDateOptions);

        //date picker options - Departute
        $scope.reservationToDateOptions = _.extend({
            onSelect: reservationToDateChoosed
        }, commonDateOptions);
    };
    /**
    * Initialization of pop
    * @return {[type]} [description]
    */
    (function initilizeMe() {
        //variable initilizations
        _.extend(initialPopupData, $scope.ngDialogData);

        //date picker
        setDatePickerOptions();
    }());
}]);