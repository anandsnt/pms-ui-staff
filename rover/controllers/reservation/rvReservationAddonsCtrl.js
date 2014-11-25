sntRover.controller('RVReservationAddonsCtrl', ['$scope', '$rootScope', 'addonData', '$state', 'ngDialog', 'RVReservationAddonsSrv', '$filter', '$timeout', 'RVReservationSummarySrv',
    function($scope, $rootScope, addonData, $state, ngDialog, RVReservationAddonsSrv, $filter, $timeout, RVReservationSummarySrv) {

        // set the previous state
        $rootScope.setPrevState = {
            title: $filter('translate')('ROOM_RATES'),
            name: 'rover.reservation.staycard.mainCard.roomType',
            param: {
                from_date: $scope.reservationData.arrivalDate,
                to_date: $scope.reservationData.departureDate,
                view: "ROOM_RATE",
                company_id: null,
                travel_agent_id: null,
                fromState: 'rover.reservation.staycard.reservationcard.reservationdetails'
            }
        }


        // by default load Best Sellers addon
        // Best Sellers in not a real charge code [just hard coding -1 as charge group id to fetch best sell addons] 
        // same will be overrided if with valid charge code id
        $scope.activeAddonCategoryId = -1;
        $scope.activeRoom = $scope.reservationData.rooms[0];

        $scope.heading = 'Enhance Stay';
        $scope.setHeadingTitle($scope.heading);

        $scope.showEnhancementsPopup = function() {
            var selectedAddons = $scope.activeRoom.addons;
            if (selectedAddons.length > 0) {
                ngDialog.open({
                    template: '/assets/partials/reservation/selectedAddonsListPopup.html',
                    className: 'ngdialog-theme-default',
                    closeByDocument: true,
                    scope: $scope
                });
            }
        }

        $scope.closePopup = function() {
            ngDialog.close();
        }

        $scope.refreshAddonsScroller = function() {
            $timeout(function() {
                $scope.$parent.myScroll['enhanceStays'].refresh();
            }, 700);
        }

        $scope.goToSummaryAndConfirm = function() {
            $scope.closePopup();
            /**
             * CICO-10321
             * Move check for guest / company / ta card attached to the screen before the reservation summary screen.
             * This may either be the rooms and rates screen or the Add on screen when turned on.
             */
            if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
                console.log({
                    guest: $scope.reservationData.guest.id,
                    company: $scope.reservationData.company.id,
                    agent: $scope.reservationData.travelAgent.id
                });
                $scope.$emit('PROMPTCARD');
            } else {
                /**
                 * CICO-10321
                 * 3. Once hitting the BOOK button and cards have been attached, issue the confirmation number and move to reservation summary screen
                 * NOTE :
                 *     Exisiting implementation : Confirmation number gets generated when the submit reservation button in the summary screen is clicked
                 */
                
                var postData = $scope.computeReservationDataforUpdate(true,true);
                var saveSuccess = function(data) {
                    $scope.reservationData.depositAmount = data.reservations[0].deposit_amount;
                    if (typeof data.reservations !== 'undefined' && data.reservations instanceof Array) {
                        angular.forEach(data.reservations, function(reservation, key) {
                            angular.forEach($scope.reservationData.rooms, function(room, key) {
                                if (parseInt(reservation.room_id) === parseInt(room.room_id)) {
                                    room.confirm_no = reservation.confirm_no;
                                }
                            });
                        });
                        $scope.reservationData.reservations = data.reservations;
                        $scope.reservationData.reservationId = $scope.reservationData.reservations[0].id;
                        $scope.reservationData.confirmNum = $scope.reservationData.reservations[0].confirm_no;
                        $scope.reservationData.status = $scope.reservationData.reservations[0].status;
                        $scope.viewState.reservationStatus.number = $scope.reservationData.reservations[0].id;
                    } else {
                        $scope.reservationData.reservationId = data.id;
                        $scope.reservationData.confirmNum = data.confirm_no;
                        $scope.reservationData.rooms[0].confirm_no = data.confirm_no;
                        $scope.reservationData.status = data.status;
                        $scope.viewState.reservationStatus.number = data.id;
                    }
                    /*
                     * TO DO:ends here
                     */

                    $scope.viewState.reservationStatus.confirm = true;
                    $scope.reservationData.is_routing_available = false;
                    // Change mode to stay card as the reservation has been made!
                    $scope.viewState.identifier = "CONFIRM";

                    $scope.reservation = {
                        reservation_card: {}
                    };

                    $scope.reservation.reservation_card.arrival_date = $scope.reservationData.arrivalDate;
                    $scope.reservation.reservation_card.departure_date = $scope.reservationData.departure_time;
                    $scope.$emit('hideLoader');
                    console.log("*************************", $scope.reservationData.reservationId);
                    $state.go('rover.reservation.staycard.mainCard.summaryAndConfirm');
                }
                var saveFailure = function(data) {
                    $scope.errorMessage = data;
                    $scope.$emit('hideLoader');
                }

                var updateSuccess = function(data) {
                    console.log("*************************", $scope.reservationData.reservationId);
                    $scope.reservationData.depositAmount = data.deposit_amount;
                    $scope.viewState.identifier = "UPDATED";
                    $scope.reservationData.is_routing_available = data.is_routing_available;
                    $state.go('rover.reservation.staycard.mainCard.summaryAndConfirm');
                };

                if ($scope.reservationData.reservationId != "" && $scope.reservationData.reservationId != null && typeof $scope.reservationData.reservationId != "undefined") {
                    postData.reservationId = $scope.reservationData.reservationId;
                    $scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, saveFailure);
                } else {
                    $scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess, saveFailure);
                }
            }
        }

        $scope.selectAddonCategory = function(category, event) {
            event.stopPropagation();
            if (category != '') {
                $scope.activeAddonCategoryId = category.id;
                $scope.fetchAddons(category.id);
            } else {
                $scope.activeAddonCategoryId = -1;
                $scope.fetchAddons();
            }
        }

        $scope.calculateAddonTotal = function() {
            $($scope.activeRoom.addons).each(function(index, elem) {});
        }

        $scope.selectAddon = function(addon, addonQty) {
            var elemIndex = -1;
            $($scope.activeRoom.addons).each(function(index, elem) {
                if (elem.id == addon.id) {
                    elemIndex = index;
                }
            });
            if (elemIndex < 0) {
                var item = {};
                item.id = addon.id;
                item.title = addon.title;
                item.quantity = parseInt(addonQty);
                item.price = addon.price;
                item.amountType = addon.amountType;
                item.postType = addon.postType;
                item.taxDetail = addon.taxes;
                $scope.activeRoom.addons.push(item);
            } else {
                $scope.activeRoom.addons[elemIndex].quantity += parseInt(addonQty);
            }
            // add selected addon amount to total stay cost
            // $scope.reservationData.totalStayCost += parseInt(addonQty) * parseInt(addon.price);
            $scope.showEnhancementsPopup();
            $scope.computeTotalStayCost();
        }

        $scope.removeSelectedAddons = function(index) {
            // subtract selected addon amount from total stay cost
            // $scope.reservationData.totalStayCost -= parseInt($scope.activeRoom.addons[index].quantity) * parseInt($scope.activeRoom.addons[index].price);
            $scope.activeRoom.addons.splice(index, 1);
            if ($scope.activeRoom.addons.length === 0) {
                $scope.closePopup();
            }
            $scope.computeTotalStayCost();
        }

        $scope.addons = [];

        $scope.fetchAddons = function(paramChargeGrpId) {
            var successCallBackFetchAddons = function(data) {
                $scope.addons = [];
                $scope.$emit("hideLoader");
                angular.forEach(data.results, function(item) {
                    if (item != null) {
                        var addonItem = {};
                        addonItem.id = item.id;
                        addonItem.isBestSeller = item.bestseller;
                        addonItem.category = item.charge_group.name;
                        addonItem.title = item.name;
                        addonItem.description = item.description;
                        addonItem.price = item.amount;
                        addonItem.taxes = item.taxes;
                        addonItem.stay = "";
                        if (item.amount_type != "") {
                            addonItem.stay = item.amount_type.description;
                        }
                        if (item.post_type != "") {
                            if (addonItem.stay != "") {
                                addonItem.stay += " / " + item.post_type.description
                            } else {
                                addonItem.stay = item.post_type.description
                            }
                        }
                        addonItem.amountType = item.amount_type;
                        addonItem.postType = item.post_type;
                        addonItem.amountTypeDesc = item.amount_type.description;
                        addonItem.postTypeDesc = item.post_type.description;
                        $scope.addons.push(addonItem);
                    }
                });
                $scope.refreshAddonsScroller();

            }
            var chargeGroupId = paramChargeGrpId == undefined ? '' : paramChargeGrpId;
            var is_bestseller = paramChargeGrpId == undefined ? true : false;
            var paramDict = {
                'charge_group_id': chargeGroupId,
                'is_bestseller': is_bestseller,
                'from_date': $scope.reservationData.arrivalDate,
                'to_date': $scope.reservationData.departureDate,
                'is_active': true,
                'is_not_rate_only': true
            };
            $scope.invokeApi(RVReservationAddonsSrv.fetchAddons, paramDict, successCallBackFetchAddons);
        }

        $scope.addonCategories = addonData.addonCategories;
        $scope.bestSellerEnabled = addonData.bestSellerEnabled;

        // first time fetch best seller addons
        // for fetching best sellers - call method without params ie. no charge group id
        // Best Sellers in not a real charge code [just hard coded charge group to fetch best sell addons]
        $scope.fetchAddons();
        $scope.setScroller("enhanceStays");


    }
]);