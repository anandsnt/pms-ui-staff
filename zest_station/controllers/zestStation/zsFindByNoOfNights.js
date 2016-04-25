sntZestStation.controller('zsFindByNoOfNightsCtrl', [
    '$scope',
    '$state',
    'zsTabletSrv',
    'zsUtilitySrv',
    'zsModeConstants',
    'zsEventConstants',
    function($scope, $state, zsTabletSrv, zsUtilitySrv, zsModeConstants, zsEventConstants) {

        BaseCtrl.call(this, $scope);
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            if ($state.lastAt === "input-last") {
                $state.go('zest_station.find_reservation', {
                    mode: zsModeConstants.CHECKIN_MODE
                });
            } else if ($state.lastAt = "no-match") {
                $state.go('zest_station.find_reservation_no_match');
            }
        });

        $scope.configAttributesAndState = function() {
            $scope.at = 'find-by-no-of-nights';
            $scope.headingText = 'TYPE_NO_OF_NIGHTS';
            $scope.subHeadingText = '';
            $scope.inputTextPlaceholder = '';
            $scope.hideNavBtns = false;
            if ($state.lastAt === 'no-match') {
                $scope.input = {};
                $scope.input.inputTextValue = $state.input.NoOfNights;
            }
        };

        $scope.nextButtonClicked = function() {
            if ($scope.input.inputTextValue === '') {
                return;
            }
            $state.lastInput = $scope.input.inputTextValue;
            if ($state.lastAt !== 'no-match') {
                $state.lastAt = $scope.at;
            }
            $scope.searchWithNoOfNights();
        };

        $scope.searchWithNoOfNights = function() {
            //$state.search = true;//using state mode instead
            $scope.inputType = 'text';
            $state.lastAt = 'find-by-no-of-nights';
            if (!$state.input) {
                $state.input = {};
            }
            $state.input.NoOfNights = $scope.input.inputTextValue;
            if ($state.input.NoOfNights === '') {
                return;
            }
            $state.go('zest_station.reservation_search',{
                mode: zsModeConstants.CHECKIN_MODE
            });
        };

        /**
         * [initializeMe description]
         */
        var initializeMe = function() {
            $scope.input = {};

            //show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            $scope.configAttributesAndState();
        }();
    }
]);