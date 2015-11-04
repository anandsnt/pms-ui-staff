sntRover.controller('rvReservationCardLoyaltyController', ['$rootScope', '$scope', 'ngDialog', 'RVLoyaltyProgramSrv',
    function($rootScope, $scope, ngDialog, RVLoyaltyProgramSrv) {
        BaseCtrl.call(this, $scope);

        $scope.selectedLoyaltyID = "";
        $scope.selectedLoyalty = {};
        $scope.hotelLoyaltyProgramEnabled = true;

        $scope.showSelectedLoyalty = function() {
            var display = true;
            var selectedLoyalty = $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty;
            if (selectedLoyalty === null || typeof selectedLoyalty === 'undefined' || selectedLoyalty === '' || selectedLoyalty === {}) {
                display = false;
            }
            return display;
        };
        $scope.showLoyaltyProgramDialog = function() {
            //Disable the feature when the reservation is checked out
            if(!$scope.$parent.isNewsPaperPreferenceAvailable()) {
                return;
            }
            ngDialog.open({
                template: '/assets/partials/reservationCard/rvAddLoyaltyProgramDialog.html',
                controller: 'rvAddLoyaltyProgramController',
                className: 'ngdialog-theme-default',
                scope: $scope
            });



        };

        $scope.$on("loyaltyProgramAdded", function(e, data, source) {

            if (data.membership_class === "HLP") {
                $scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram.push(data);
            } else {
                $scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram.push(data);
            }
            if (source === "fromReservationCard") {
                $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = data.id;
                $scope.selectedLoyaltyID = data.id;
                $scope.selectedLoyalty = data;
            }

            $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
        });
        $scope.$on("loyaltyProgramDeleted", function(e, id, index, loyaltyProgram) {

            if ($scope.selectedLoyaltyID !== id) {
                if (loyaltyProgram === 'FFP') {
                    $scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram.splice(index, 1);
                } else {
                    $scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram.splice(index, 1);
                }
                $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
            }

        });
        $scope.setSelectedLoyaltyForID = function(id) {
            var hotelLoyaltyProgram = $scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram;
            var freequentFlyerprogram = $scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram;

            var use_ffp = $scope.$parent.reservationData.use_ffp,
                    use_hlp = $scope.$parent.reservationData.use_hlp;
            var flag = false;
            // doing null check as when, no guest card attached the hotelLoyaltyProgram variable has null
            if (hotelLoyaltyProgram !== null && $rootScope.isHLPActive) {
                for (var i = 0; i < hotelLoyaltyProgram.length; i++) {
                    if (parseInt(id,10) === parseInt(hotelLoyaltyProgram[i].id,10)) {
                        flag = true;
                        $scope.selectedLoyalty = hotelLoyaltyProgram[i];
                        $scope.selectedLoyaltyID = hotelLoyaltyProgram[i].id;
                        $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = hotelLoyaltyProgram[i].id;
                        break;
                    }

                }
            }
            if (flag) {
                return true;
            }
            if (freequentFlyerprogram !== null && $rootScope.isFFPActive) {
                for (var i = 0; i < freequentFlyerprogram.length; i++) {
                    if (parseInt(id,10) === parseInt(freequentFlyerprogram[i].id,10)) {
                        flag = true;
                        $scope.selectedLoyalty = freequentFlyerprogram[i];
                        $scope.selectedLoyaltyID = freequentFlyerprogram[i].id;
                        $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = freequentFlyerprogram[i].id;
                        break;
                    }

                }
            }
            return flag;
        };
        $scope.setSelectedLoyaltyForID($scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty);

        $scope.setSelectedLoyalty = function(id) {
            var isSelectedSet = $scope.setSelectedLoyaltyForID(id);
            if (!isSelectedSet) {
                $scope.selectedLoyalty = "";
                $scope.selectedLoyaltyID = "";
                $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = "";
            }
        };
        $scope.loadLoyaltyPrograms = function(){
            if ($scope.$parent.$parent.refreshingReservation){
                $rootScope.goToReservationCalled = true;
                $rootScope.$broadcast('reload-loyalty-section-data',{'reload':true});
            }
        };
        $scope.callSelectLoyaltyAPI = function(id) {
            $scope.selectedLoyaltyID = id;
            var successCallback = function() {
                $scope.setSelectedLoyalty($scope.selectedLoyaltyID);
                $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
                $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.setSelectedLoyalty($scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty);
                $scope.$parent.$emit('hideLoader');
                $scope.$parent.errorMessage = errorMessage;
            };
            var params = {};
            params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
            params.membership_id = $scope.selectedLoyaltyID;
            $scope.invokeApi(RVLoyaltyProgramSrv.selectLoyalty, params, successCallback, errorCallback);
        };

        $scope.$on('detect-hlps-ffp-active-status',function(evt,data){
           if (data.userMemberships.use_hlp){
               $scope.loyaltyProgramsActive(true);
               $scope.$parent.reservationData.use_hlp = true;
           } else {
               $scope.loyaltyProgramsActive(false);
               $scope.$parent.reservationData.use_hlp = false;
           }


           if (data.userMemberships.use_ffp){
               $scope.ffpProgramsActive(true);
               $scope.$parent.reservationData.use_ffp = true;
           } else {
               $scope.ffpProgramsActive(false);
               $scope.$parent.reservationData.use_ffp = false;
           }


        });

        $scope.loyaltyProgramsActive = function(b){
          $scope.hotelLoyaltyProgramEnabled = b;
          $scope.$parent.reservationData.use_hlp = b;
        };
        $scope.ffpProgramsActive = function(b){
          $scope.hotelFrequentFlyerProgramEnabled = b;
          $scope.$parent.reservationData.use_ffp = b;
        };

    }
]);