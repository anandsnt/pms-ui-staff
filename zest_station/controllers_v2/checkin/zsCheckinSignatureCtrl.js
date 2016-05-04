sntZestStation.controller('zsCheckinSignatureCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    '$timeout',
    'zsCheckinSrv',
    'zsModeConstants',
    'zsGeneralSrv',
    function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv) {


        /**
         * [clearSignature description]
         * @return {[type]} [description]
         */
        $scope.clearSignature = function() {
            $scope.signatureData = '';
            $("#signature").jSignature("clear");
        };


        /**
         * [afterGuestCheckinCallback description]
         * @param  {[type]} response [description]
         * @return {[type]}          [description]
         */
        var afterGuestCheckinCallback = function(response) {
            console.info('response from guest check-in', response)
            var haveValidGuestEmail = $stateParams.email.legth > 0 ? true : false;
            console.info('successfulCheckIn: ', successfulCheckIn);
            //detect if coming from email input
            if (haveValidGuestEmail) {
                $state.go('zest_station.checkinKeyDispense', {
                    "reservationId": $stateParams.id,
                    "room": $stateParams.room_no,
                    "first_name": $stateParams.first_name
                });
                return;
            } else { //successful check-in but missing email on reservation
                $state.go('zest_station.inputReservationEmailAfterCheckin', {
                    "reservationId": $stateParams.id,
                    "room": $stateParams.room_no,
                    "first_name": $stateParams.first_name
                });
            }

        };

        var checkInGuest = function() {
            var signature = $scope.signatureData;
            var checkinParams = {
                'reservation_id': $stateParams.reservation_id,
                'workstation_id': $scope.zestStationData.set_workstation_id,
                "authorize_credit_card": false,
                "do_not_cc_auth": false,
                "is_promotions_and_email_set": false,
                "no_post": "",
                "is_kiosk": true,
                'signature': signature
            };
            var options = {
                params: checkinParams,
                successCallBack : afterGuestCheckinCallback
            };
            $scope.callAPI(zsCheckinSrv.checkInGuest, options);
        };
        /**
         * [submitSignature description]
         * @return {[type]} [description]
         */
        $scope.submitSignature = function() {
            /*
             * this method will check the guest in after swiping a card
             */
            $scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
            if ($scope.signatureData !== [] && $scope.signatureData !== null && $scope.signatureData !== '' && $scope.signatureData !== '[]') {
                checkInGuest();
            }else{
                return;
            }
        };

        /**
         * [initializeMe description]
         */

        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
        }();

    }
]);