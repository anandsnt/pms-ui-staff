sntRover.controller('rvReservationCardNotesController', ['$scope', '$filter', '$rootScope', 'ngDialog', '$state',
    function($scope, $filter, $rootScope, ngDialog, $state) {
        $scope.reservationNotes = "";
        /*
         *To save the reservation note and update the ui accordingly
         */
        var init = function() {
            var hideNotes = true;
            if ($scope.reservationData.reservation_card.notes.reservation_notes.length > 0) {
                hideNotes = false;
            }

            $scope.reservationNotesState = {
                hideDetails: hideNotes
            };

            $scope.setScroller('reservationNotes');
        };

        $scope.openNotesPopup = function() {
            ngDialog.open({
                template: '/assets/partials/reservationCard/rvReservationCardNotesPopup.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        $scope.navigateToGroup = function(event) {
            if ($rootScope.isStandAlone && !!$scope.reservationData.reservation_card.group_id) {
                // Navigate to Groups
                $state.go('rover.groups.config', {
                    id: $scope.reservationData.reservation_card.group_id,
                    activeTab: "SUMMARY"
                });
            } else {
                event.preventDefault();
            }
        };

        /**
         * whether the group card attached to reservation
         * @return {Boolean}
         */
        $scope.isGroupCardAttachedToReservation = function() {
            return ($scope.reservationDetails && $scope.reservationDetails.group && $scope.reservationDetails.group.id.trim() !== '');
        };

        /**
         * whether the group card attached to reservation
         * @return {Boolean}
         */
        $scope.isCompanyCardAttachedToReservation = function() {  
            return ($scope.reservationDetails && $scope.reservationDetails.companyCard && $scope.reservationDetails.companyCard.id.toString().trim() !== '');
        };

        /**
         * whether the travel agent attached to reservation
         * @return {Boolean}
         */
        $scope.isTravelAgentAttachedToReservation = function() {            
            return ($scope.reservationDetails && $scope.reservationDetails.travelAgent && $scope.reservationDetails.travelAgent.id.trim() !== '');
        };

        /**
         * whether the allotment card attached to reservation
         * @return {Boolean}
         */
        $scope.isAllotmentCardAttachedToReservation = function() {            
            return ($scope.reservationDetails && $scope.reservationDetails.allotment && $scope.reservationDetails.allotment.id.trim() !== '');
        };

        /**
         * if no cards has attached to reservation
         * @return {Boolean}
         */
        $scope.noCardAttachedToReservation = function() {
            return (
                    !$scope.isGroupCardAttachedToReservation() && 
                    !$scope.isCompanyCardAttachedToReservation() &&
                    !$scope.isTravelAgentAttachedToReservation() &&
                    !$scope.isAllotmentCardAttachedToReservation()
                    );
        };


        init();
    }
]);