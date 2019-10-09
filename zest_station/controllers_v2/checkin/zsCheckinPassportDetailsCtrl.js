sntZestStation.controller('zsCheckinPassportDetailsCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'zsEventConstants',
    'zsCheckinSrv',
    '$controller',
    '$filter',
    function ($scope, $state, $stateParams, zsEventConstants, zsCheckinSrv, $controller, $filter) {

        BaseCtrl.call(this, $scope);

        $controller('zsCheckinNextPageBaseCtrl', {
            $scope: $scope
        });
        $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
        $scope.mode = 'PASSPORT_DETAILS';
        $scope.guestDetails = {};
        $scope.isPassportNumberBlank = true;
        $scope.isBypassReasonNil = true;
        $scope.data = {
            'passportNumber': "",
            'bypassReason': ""
        };

        $scope.clickedOnEnterPassportNoButton = function () {

            $scope.mode = 'COLLECT_PASSPORT_NUMBER';
        };

        $scope.clickedOnBypassButton = function () {

            $scope.mode = 'BYPASS_PASSPORT_DETAILS';
        };

        $scope.passportNumberEntered = function () {
            if ($scope.data.passportNumber === "") {
                return;
            }
            var params = angular.copy($scope.selectedReservation.guest_details[0]);

            params.passport_no = $scope.data.passportNumber;
            params.reservation_id = $scope.selectedReservation.id;

            var options = {
                params: params,
                successCallBack: function () {
                    $scope.checkinGuest();
                }
            };

            $scope.callAPI(zsCheckinSrv.saveGuestAddress, options);
        };

        $scope.bypassPassportDetails = function () {
            if ($scope.data.bypassReason === "") {
                return;
            }
            zsCheckinSrv.savePassportBypassReason($scope.data.bypassReason);
            $scope.checkinGuest();
        };

        $scope.onchangePassportNumber = function () {
            if ($scope.data.passportNumber === "") {
                $scope.isPassportNumberBlank = true;
            } else {
                $scope.isPassportNumberBlank = false;
            }
        };

        $scope.onchangeBypassReason = function () {
            if ($scope.data.bypassReason === "") {
                $scope.isBypassReasonNil = true;
            } else {
                $scope.isBypassReasonNil = false;
            }
        };

        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function () {
            if ($scope.mode === 'PASSPORT_DETAILS') {
                $state.go('zest_station.checkInReservationDetails');
            } else if ($scope.mode === 'COLLECT_PASSPORT_NUMBER' || $scope.mode === 'BYPASS_PASSPORT_DETAILS') {
                $scope.mode = 'PASSPORT_DETAILS';
            }
        });

        (function () {
            $scope.$emit('hideLoader');
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            zsCheckinSrv.savePassportBypassReason("");
            var passportBypassReasons = $filter('translate')('PASSPORT_BYPASS_REASONS');
            $scope.bypass_passport_entry = $scope.zestStationData.bypass_passport_entry && passportBypassReasons !== 'PASSPORT_BYPASS_REASONS';
            // The tag PASSPORT_BYPASS_REASONS has to be saved in admin with ';' separating reasons
            if ($scope.bypass_passport_entry) {
                $scope.bypassPassportReasons = passportBypassReasons.split(";");
            }            
        }());
    }
]);