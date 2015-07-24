sntRover.controller('RVReservationAddonsCtrl', ['$scope',
    '$rootScope',
    'addonData',
    '$state',
    'ngDialog', 'RVReservationAddonsSrv',
    '$filter',
    '$timeout',
    'RVReservationSummarySrv',
    '$stateParams',
    '$vault',
    'RVReservationPackageSrv',
    'RVReservationStateService',
    function($scope, $rootScope, addonData, $state, ngDialog, RVReservationAddonsSrv, $filter, $timeout, RVReservationSummarySrv, $stateParams, $vault, RVReservationPackageSrv, RVReservationStateService) {

        $scope.activeRoom = 0;
        $scope.fromPage = "";
        $scope.duration_of_stay = $scope.reservationData.numNights ? $scope.reservationData.numNights : 1;

        if($stateParams.from_screen === "staycard"){

            $scope.fromPage = "staycard";
            $rootScope.setPrevState = {
                title: $filter('translate')('STAY_CARD'),
                callback: 'goBackToStayCard',
                scope: $scope
            };

            $scope.goBackToStayCard = function() {
                $scope.addonsData.existingAddons = [];
                var reservationId = $scope.reservationData.reservationId,
                    confirmationNumber = $scope.reservationData.confirmNum;
                $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                    "id": reservationId,
                    "confirmationId": confirmationNumber,
                    "isrefresh": true
                });
            };
        } else if (!!$stateParams.isFromDiary) {
            $rootScope.setPrevState = {
                title: $filter('translate')('DIARY'),
                name: 'rover.diary',
                param: {}
            }
        } else {
            $scope.reservationData.number_of_adults = parseInt($scope.reservationData.rooms[0].numAdults);
            $scope.reservationData.number_of_children = parseInt($scope.reservationData.rooms[0].numChildren);
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
                    fromState: 'rover.reservation.staycard.mainCard.addons'
                }
            }
        }
        $scope.existingAddonsLength = 0;

        $scope.roomNumber = '';
        var successCallBack = function(data) {
            $scope.$emit('hideLoader');
            $scope.roomNumber = data.room_no;
            $scope.duration_of_stay = data.duration_of_stay;
            $scope.addonsData.existingAddons = [];
            angular.forEach(data.existing_packages, function(item, index) {
                var addonsData = {};
                addonsData.id = item.package_id;
                addonsData.title = item.package_name;
                addonsData.quantity = item.count;
                addonsData.totalAmount = (addonsData.quantity) * (item.price_per_piece);
                addonsData.price_per_piece = item.price_per_piece;
                addonsData.amount_type = item.amount_type
                addonsData.post_type = item.post_type;
                addonsData.is_inclusive = item.is_inclusive;
                var alreadyAdded = false;

                if (!alreadyAdded) {
                    $scope.addonsData.existingAddons.push(addonsData);
                };
            });
            $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;

        };
        if (!RVReservationStateService.getReservationFlag('RATE_CHANGED') && typeof $scope.reservationData.reservationId !== "undefined" && $scope.reservationData.reservationId !== "" && $scope.reservationData.reservationId !== null) {
            $scope.invokeApi(RVReservationPackageSrv.getReservationPackages, $scope.reservationData.reservationId, successCallBack);
        }



        var init = function() {
                $scope.reservationData.isHourly = true;
                var temporaryReservationDataFromDiaryScreen = $vault.get('temporaryReservationDataFromDiaryScreen');
                temporaryReservationDataFromDiaryScreen = JSON.parse(temporaryReservationDataFromDiaryScreen);
                if (temporaryReservationDataFromDiaryScreen) {
                    var getRoomsSuccess = function(data) {
                        var roomsArray = {};
                        angular.forEach(data.rooms, function(value, key) {
                            var roomKey = value.id;
                            roomsArray[roomKey] = value;
                        });
                        $scope.populateDatafromDiary(roomsArray, temporaryReservationDataFromDiaryScreen);
                    };
                    $scope.invokeApi(RVReservationSummarySrv.fetchRooms, {}, getRoomsSuccess);
                }

                $scope.duration_of_stay = 1;

                $scope.is_rate_addons_fetch = false;
                $scope.addonsData.existingAddons = [];
            }
            // by default load Best Sellers addon
            // Best Sellers in not a real charge code [just hard coding -1 as charge group id to fetch best sell addons]
            // same will be overrided if with valid charge code id
        $scope.activeAddonCategoryId = -1;

        $scope.heading = 'Enhance Stay';
        $scope.setHeadingTitle($scope.heading);

        $scope.showEnhancementsPopup = function() {

            var selectedAddons = $scope.addonsData.existingAddons;

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


            if($scope.fromPage === "staycard"){
                var saveData = {};
                saveData.addons = $scope.addonsData.existingAddons;
                saveData.reservationId = $scope.reservationData.reservationId;

                var successCallBack = function(data) {
                    $scope.$emit('hideLoader');
                    $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                        id: $scope.reservationData.reservationId,
                        confirmationId: $scope.reservationData.confirmNum,
                        isrefresh: true
                    });
                };
                var failureCallBack = function(errorMessage) {
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = errorMessage;
                };
                $scope.invokeApi(RVReservationSummarySrv.updateReservation, saveData, successCallBack, failureCallBack);

            } else {


                var save = function() {
                    if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id) {
                        // $scope.saveReservation('rover.reservation.staycard.mainCard.summaryAndConfirm');
                        /**
                         * 1. Move check for guest / company / ta card attached to the screen before the reservation summary screen.
                         * This may either be the rooms and rates screen or the Add on screen when turned on.
                         * -- QA Comments : done, but returns to enhance stay screen.
                         *    Upon closing, user should be on summary screen
                         */
                        $state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
                            "reservation": $stateParams.reservation
                        });
                    }
                }
                if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
                    $scope.$emit('PROMPTCARD');
                    $scope.$watch("reservationData.guest.id", save);
                    $scope.$watch("reservationData.company.id", save);
                    $scope.$watch("reservationData.travelAgent.id", save);
                } else {
                    $state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
                        "reservation": $stateParams.reservation
                    });
                }
            }

        }

        $scope.selectAddonCategory = function(category, event) {
            event.stopPropagation();
            if (category !== '') {
                $scope.activeAddonCategoryId = category.id;
                $scope.fetchAddons(category.id);
            } else {
                $scope.activeAddonCategoryId = -1;
                $scope.fetchAddons();
            }
        }

        $scope.calculateAddonTotal = function() {
            $($scope.reservationData.rooms[$scope.activeRoom].addons).each(function(index, elem) {});
        }

        $scope.selectAddon = function(addon, addonQty) {
            var alreadyAdded = false;
            angular.forEach($scope.addonsData.existingAddons,function(item, index) {
                if(item.id === addon.id){
                    alreadyAdded = true;
                    item.quantity = parseInt(item.quantity) + parseInt(addonQty);
                    item.totalAmount = (item.quantity) * (item.price_per_piece);
                }
            });
            if (!alreadyAdded) {
                var newAddonToReservation = {};
                newAddonToReservation.id = addon.id;
                newAddonToReservation.quantity = addonQty;
                newAddonToReservation.title = addon.title;
                newAddonToReservation.totalAmount = (newAddonToReservation.quantity) * (addon.price);
                newAddonToReservation.price_per_piece = addon.price;
                newAddonToReservation.amount_type = addon.amountType.description;
                newAddonToReservation.post_type = addon.postType.description;
                $scope.existingAddonsLength = parseInt($scope.existingAddonsLength) + parseInt(1);
                $scope.addonsData.existingAddons.push(newAddonToReservation)
            }
            var elemIndex = -1;
            $($scope.reservationData.rooms[$scope.activeRoom].addons).each(function(index, elem) {
                if (elem.id === addon.id) {
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
                if ($scope.reservationData.rooms[$scope.activeRoom].addons) {
                    $scope.reservationData.rooms[$scope.activeRoom].addons.push(item);
                } else {
                    $scope.reservationData.rooms[$scope.activeRoom].addons = [];
                    $scope.reservationData.rooms[$scope.activeRoom].addons.push(item);
                }
            } else {
                $scope.reservationData.rooms[$scope.activeRoom].addons[elemIndex].quantity += parseInt(addonQty);
            }
            // add selected addon amount to total stay cost
            // $scope.reservationData.totalStayCost += parseInt(addonQty) * parseInt(addon.price);
            $scope.showEnhancementsPopup();
            if ($scope.reservationData.isHourly) {
                $scope.computeHourlyTotalandTaxes();
            } else {
                $scope.computeTotalStayCost();
            }
        }

        $scope.removeSelectedAddons = function(index) {
            // subtract selected addon amount from total stay cost
            // $scope.reservationData.totalStayCost -= parseInt($scope.reservationData.rooms[$scope.activeRoom].addons[index].quantity) * parseInt($scope.reservationData.rooms[$scope.activeRoom].addons[index].price);
            $scope.addonsData.existingAddons.splice(index, 1);
            $scope.reservationData.rooms[$scope.activeRoom].addons.splice(index, 1);
            $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;
            if ($scope.addonsData.existingAddons.length === 0) {
                $scope.closePopup();
            }
            $scope.computeTotalStayCost();
        }

        $scope.addons = [];

        $scope.fetchAddons = function(paramChargeGrpId, isInitialLoad) {
            var successCallBackFetchAddons = function(data) {
                var inclusiveAddons = [];
                angular.forEach(data.rate_addons, function(item) {
                    if (item.is_inclusive) {
                        inclusiveAddons.push(item);
                    }
                });
                $scope.reservationData.rooms[$scope.activeRoom].inclusiveAddons = inclusiveAddons;
                $scope.addons = [];
                $scope.$emit("hideLoader");
                angular.forEach(data.results, function(item) {
                    if (item !== null) {
                        var addonItem = {};
                        addonItem.id = item.id;
                        addonItem.isBestSeller = item.bestseller;
                        addonItem.category = item.charge_group.name;
                        addonItem.title = item.name;
                        addonItem.description = item.description;
                        addonItem.price = item.amount;
                        addonItem.taxes = item.taxes;
                        addonItem.stay = "";
                        if (item.amount_type !== "") {
                            addonItem.stay = item.amount_type.description;
                        }
                        if (item.post_type !== "") {
                            if (addonItem.stay !== "") {
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

                // Clear the variables for Enhancement pop up And rooms Add ons And repopulate.
                // Do this only in case of create reservation. i.e. dont do if reservation ID exists.

                //CICO-16792 - DOING THIS ONLY ON INITIAL LOAD -- FOR BUG FIXING

                if (!!isInitialLoad &&
                    (RVReservationStateService.getReservationFlag('RATE_CHANGED') ||
                        (typeof $scope.reservationData.reservationId === "undefined" || $scope.reservationData.reservationId === "" || $scope.reservationData.reservationId === null))) {
                    RVReservationStateService.setReservationFlag('RATE_CHANGED', false);
                    if (!$scope.is_rate_addons_fetch) {
                        $scope.addonsData.existingAddons = [];
                        $scope.reservationData.rooms[$scope.activeRoom].addons = [];
                        angular.forEach(data.rate_addons, function(addon, index) {
                            //Set this flag when there is Children in reservation & addon on for child.
                            var flag = addon.amount_type.value === "CHILD" && $scope.reservationData.rooms[$scope.activeRoom].numChildren === 0;
                            if (!flag) {

                                var newAddonToReservation = {};
                                newAddonToReservation.id = addon.id;
                                newAddonToReservation.quantity = 1;
                                newAddonToReservation.title = addon.name;
                                newAddonToReservation.totalAmount = (newAddonToReservation.quantity) * (addon.amount);
                                newAddonToReservation.price_per_piece = addon.amount;
                                newAddonToReservation.amount_type = addon.amount_type.description;
                                newAddonToReservation.post_type = addon.post_type.description;
                                newAddonToReservation.is_inclusive = !!addon.is_inclusive;
                                $scope.addonsData.existingAddons.push(newAddonToReservation);
                                // Temp Variable to translate API response keys
                                // to data variable keys
                                var addonItem = {};
                                addonItem.id = addon.id;
                                addonItem.isBestSeller = addon.bestseller;
                                addonItem.category = addon.charge_group.name;
                                addonItem.title = addon.name;
                                addonItem.description = addon.description;
                                addonItem.price = addon.amount;
                                addonItem.taxes = addon.taxes;
                                addonItem.stay = "";
                                if (addon.amount_type !== "") {
                                    addonItem.stay = addon.amount_type.description;
                                }
                                if (addon.post_type !== "") {
                                    if (addonItem.stay !== "") {
                                        addonItem.stay += " / " + addon.post_type.description
                                    } else {
                                        addonItem.stay = addon.post_type.description
                                    }
                                }
                                addonItem.amountType = addon.amount_type;
                                addonItem.postType = addon.post_type;
                                addonItem.amountTypeDesc = addon.amount_type.description;
                                addonItem.postTypeDesc = addon.post_type.description;
                                addonItem.quantity = 1;
                                addonItem.is_inclusive = addon.is_inclusive;
                                // Push to the Rooms add ons information
                                $scope.reservationData.rooms[$scope.activeRoom].addons.push(addonItem);
                                // Recompute Total Stay Cost after Add ons are
                                // Updated
                                // Need to verify this.
                                $scope.computeTotalStayCost();
                                $scope.existingAddonsLength = data.rate_addons.length;
                                $scope.is_rate_addons_fetch = true;
                            }
                        });
                        $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;
                    }
                }
            }


            var chargeGroupId = paramChargeGrpId === undefined ? '' : paramChargeGrpId;
            var is_bestseller = paramChargeGrpId === undefined ? true : false;
            var paramDict = {
                'charge_group_id': chargeGroupId,
                'is_bestseller': is_bestseller,
                'from_date': $scope.reservationData.arrivalDate,
                'to_date': $scope.reservationData.departureDate,
                'is_active': true,
                'is_not_rate_only': true,
                'rate_id': $scope.reservationData.rooms[0].rateId
            };

            $scope.invokeApi(RVReservationAddonsSrv.fetchAddons, paramDict, successCallBackFetchAddons);
        }

        $scope.addonCategories = addonData.addonCategories;
        $scope.bestSellerEnabled = addonData.bestSellerEnabled;

        // first time fetch best seller addons
        // for fetching best sellers - call method without params ie. no charge group id
        // Best Sellers in not a real charge code [just hard coded charge group to fetch best sell addons]
        /**
         * CICO-16792 Sending a second parameter to the fetchAddons method to identify the initial call to the method
         */
        $scope.fetchAddons('', true);
        $scope.setScroller("enhanceStays");
        if ($stateParams.reservation === "HOURLY") {
            init();
        }
    }
]);
