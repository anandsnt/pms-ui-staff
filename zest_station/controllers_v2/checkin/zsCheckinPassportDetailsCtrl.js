sntZestStation.controller('zsCheckinPassportDetailsCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'zsEventConstants',
    'zsCheckinSrv',
    function ($scope, $state, $stateParams, zsEventConstants, zsCheckinSrv) {

        BaseCtrl.call(this, $scope);
        $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
        $scope.mode = 'PASSPORT_DETAILS';
        $scope.guestDetails = {};
        $scope.isPassportNumberBlank = true;
        $scope.isBypassReasonNil = true;

        if ($stateParams.previousState) {
            $scope.previousState = $stateParams.previousState;
        }

        $scope.clickedOnEnterPassportNoButton = function () {

            $scope.mode = 'COLLECT_PASSPORT_NUMBER';
        };

        $scope.clickedOnBypassButton = function () {

            $scope.mode = 'BYPASS_PASSPORT_DETAILS';
            $scope.bypassPassportReasons = $scope.$parent.zestStationData.passport_bypass_reasons;
        };

        $scope.passportNumberEntered = function () {
            var params = angular.copy($scope.selectedReservation.guest_details[0]);

            params.passport_no = $scope.passportNumber;
            params.reservation_id = $scope.selectedReservation.id;

            var options = {
                params: params,
                successCallBack: function () {
                    $state.go('zest_station.checkInReservationDetails', {
                        previousState: 'COLLECT_PASSPORT_NUMBER'
                    });
                }
            };

            $scope.callAPI(zsCheckinSrv.saveGuestAddress, options);
        };

        $scope.bypassPassportDetails = function () {
            zsCheckinSrv.savePassportBypassReason($scope.bypassReasonId);
            $state.go('zest_station.checkInReservationDetails', {
                previousState: 'BYPASS_PASSPORT_DETAILS'
            });
        };

        $scope.onchangePassportNumber = function () {
            if (typeof $scope.passportNumber === 'undefined' || $scope.passportNumber === "") {
                $scope.isPassportNumberBlank = true;
            } else {
                $scope.isPassportNumberBlank = false;
            }
        };

        $scope.onchangeBypassReason = function () {
            if (typeof $scope.bypassReasonId === 'undefined' || $scope.bypassReasonId === "") {
                $scope.isBypassReasonNil = true;
            } else {
                $scope.isBypassReasonNil = false;
            }
        };

        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function () {
            $scope.isBypassReasonNil = true;
            $scope.isPassportNumberBlank = true;
            if ($scope.mode === 'PASSPORT_DETAILS') {
                $state.go('zest_station.collectGuestAddress');
            } else if ($scope.mode === 'COLLECT_PASSPORT_NUMBER' || $scope.mode === 'BYPASS_PASSPORT_DETAILS') {
                $scope.mode = 'PASSPORT_DETAILS';
            }
        });

        (function () {
            $scope.$emit('hideLoader');
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
        }());
    }
]);