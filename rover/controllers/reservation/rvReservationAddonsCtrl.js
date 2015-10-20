sntRover.controller('RVReservationAddonsCtrl', [
    '$scope', '$rootScope', 'addonData', '$state', 'ngDialog', 'RVReservationAddonsSrv', '$filter', '$timeout', 'RVReservationSummarySrv', '$stateParams', '$vault', 'RVReservationPackageSrv', 'RVReservationStateService', 'rvGroupConfigurationSrv', 'rvPermissionSrv',
    function($scope, $rootScope, addonData, $state, ngDialog, RVReservationAddonsSrv, $filter, $timeout, RVReservationSummarySrv, $stateParams, $vault, RVReservationPackageSrv, RVReservationStateService, rvGroupConfigurationSrv, rvPermissionSrv) {

        var setBackButton = function() {
                if ($stateParams.from_screen === "staycard") {
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
                    };
                } else {
                    $scope.reservationData.number_of_adults = parseInt($scope.reservationData.rooms[0].numAdults, 10);
                    $scope.reservationData.number_of_children = parseInt($scope.reservationData.rooms[0].numChildren, 10);
                    // set the previous state
                    $rootScope.setPrevState = {
                        title: $filter('translate')('ROOM_RATES'),
                        name: 'rover.reservation.staycard.mainCard.roomType',
                        param: {
                            from_date: $scope.reservationData.arrivalDate,
                            to_date: $scope.reservationData.departureDate,
                            view: "ROOM_RATE",
                            company_id: $scope.reservationData.company.id,
                            travel_agent_id: $scope.reservationData.travelAgent.id,
                            fromState: 'rover.reservation.staycard.mainCard.addons',
                            group_id: $scope.reservationData.group.id
                        }
                    };
                }
            },
            initFromHourly = function() {
                $scope.reservationData.isHourly = true;
                var temporaryReservationDataFromDiaryScreen = $vault.get('temporaryReservationDataFromDiaryScreen');
                temporaryReservationDataFromDiaryScreen = JSON.parse(temporaryReservationDataFromDiaryScreen);
                if (temporaryReservationDataFromDiaryScreen) {
                    var getRoomsSuccess = function(data) {
                        var roomsArray = {};
                        angular.forEach(data.rooms, function(value) {
                            var roomKey = value.id;
                            roomsArray[roomKey] = value;
                        });
                        $scope.populateDatafromDiary(roomsArray, temporaryReservationDataFromDiaryScreen);
                        $scope.roomDetails = getCurrentRoomDetails();
                        fetchAddons('', true);
                    };

                    $scope.invokeApi(RVReservationSummarySrv.fetchRooms, {}, getRoomsSuccess);
                }

                $scope.duration_of_stay = 1;

                $scope.is_rate_addons_fetch = false;
                $scope.addonsData.existingAddons = [];
            },
            computeTotals = function() {
                if ($scope.reservationData.isHourly) {
                    $scope.computeHourlyTotalandTaxes();
                } else {
                    $scope.computeTotalStayCost();
                }
            },
            goToSummaryAndConfirm = function() {
                if ($scope.fromPage === "staycard") {
                    var saveData = {};
                    saveData.addons = $scope.addonsData.existingAddons;
                    saveData.reservationId = $scope.reservationData.reservationId;

                    var successCallBack = function() {
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
                        if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id || $scope.reservationData.group.id || $scope.reservationData.allotment.id) {
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
                    };
                    if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id && !$scope.reservationData.group.id) {
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
            },
            getCurrentRoomDetails = function() {
                var currentRoomTypeId = parseInt($scope.reservationData.tabs[$scope.activeRoom].roomTypeId, 10),
                    firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
                        roomTypeId: currentRoomTypeId
                    })),
                    lastIndex = _.lastIndexOf($scope.reservationData.rooms, _.last(_.where($scope.reservationData.rooms, {
                        roomTypeId: currentRoomTypeId
                    })));

                return {
                    roomTypeId: currentRoomTypeId,
                    firstIndex: firstIndex,
                    lastIndex: lastIndex
                };
            },
            fetchAddons = function(paramChargeGrpId, isInitialLoad) {
                var successCallBackFetchAddons = function(data) {
                    var inclusiveAddons = [],
                        startIndex = $scope.roomDetails.firstIndex,
                        endIndex = $scope.roomDetails.lastIndex,
                        i;
                    if ($stateParams.reservation === "HOURLY") {
                        startIndex = 0;
                        endIndex = $scope.reservationData.rooms.length - 1;
                    }

                    // Hide loader anime
                    $scope.$emit("hideLoader");
                    // segregate inclusive addons and store them
                    _.each(data.rate_addons, function(item) {
                        if (item.is_inclusive) {
                            inclusiveAddons.push(item);
                        }
                    });
                    for (i = startIndex; i <= endIndex; i++) {
                        $scope.reservationData.rooms[i].inclusiveAddons = inclusiveAddons;
                    }
                    // initialize addons for display
                    $scope.addons = [];
                    _.each(data.results, function(item) {
                        if (!!item) {
                            $scope.addons.push(RVReservationPackageSrv.parseAddonItem(item));
                        }
                    });
                    // refresh scroller
                    $scope.refreshAddonsScroller();

                    // Clear the variables for Enhancement pop up And rooms Add ons And repopulate.
                    // Do this only in case of create reservation. i.e. dont do if reservation ID exists.
                    //CICO-16792 - DOING THIS ONLY ON INITIAL LOAD -- FOR BUG FIXING

                    if (!!isInitialLoad && (RVReservationStateService.getReservationFlag('RATE_CHANGED') || !$scope.reservationData.reservationId)) {
                        // reset flag!
                        RVReservationStateService.setReservationFlag('RATE_CHANGED', false);
                        if (!$scope.is_rate_addons_fetch) {
                            $scope.addonsData.existingAddons = [];
                            for (i = startIndex; i <= endIndex; i++) {
                                $scope.reservationData.rooms[i].addons = [];
                            }
                            _.each(data.rate_addons, function(addon) {
                                //Set this flag when there is Children in reservation & addon on for child.
                                var flag = addon.amount_type.value === "CHILD" && $scope.reservationData.tabs[$scope.activeRoom].numChildren === 0,
                                    roomIndex;
                                if (!flag) {
                                    $scope.addonsData.existingAddons.push(RVReservationPackageSrv.parseRateAddonItem(addon));
                                    for (roomIndex = startIndex; roomIndex <= endIndex; roomIndex++) {
                                        $scope.reservationData.rooms[roomIndex].addons.push(RVReservationPackageSrv.parseAddonItem(addon, true));
                                    }
                                }
                            });
                            computeTotals();
                        }
                        $scope.is_rate_addons_fetch = true;
                    }
                    $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;
                };

                $scope.invokeApi(RVReservationAddonsSrv.fetchAddons, {
                    'charge_group_id': paramChargeGrpId === undefined ? '' : paramChargeGrpId,
                    'is_bestseller': !paramChargeGrpId,
                    'from_date': $scope.reservationData.arrivalDate,
                    'to_date': $scope.reservationData.departureDate,
                    'is_active': true,
                    'is_not_rate_only': true,
                    'rate_id': $scope.reservationData.rooms[$scope.roomDetails.firstIndex].rateId
                }, successCallBackFetchAddons);
            },
            insertAddon = function(addon, addonQty) {
                var currentItem = _.find($scope.addonsData.existingAddons, {
                        id: addon.id
                    }),
                    startIndex = $scope.roomDetails.firstIndex,
                    endIndex = $scope.roomDetails.lastIndex,
                    i;

                if ($stateParams.reservation === "HOURLY") {
                    startIndex = 0;
                    endIndex = $scope.reservationData.rooms.length - 1;
                }

                addonQty = parseInt(addonQty, 10) || 1;
                if (!!currentItem) { // Adding count to existing addon type
                    currentItem.quantity = parseInt(currentItem.quantity, 10) + addonQty;
                    currentItem.totalAmount = (currentItem.quantity) * (currentItem.price_per_piece);
                    var elemIndex = -1;
                    $($scope.reservationData.rooms[startIndex].addons).each(function(index, elem) {
                        if (elem.id === addon.id) {
                            elemIndex = index;
                        }
                    });
                    for (i = startIndex; i <= endIndex; i++) {
                        $scope.reservationData.rooms[i].addons[elemIndex].quantity += addonQty;
                    }
                } else { // Adding a new addon type
                    $scope.addonsData.existingAddons.push({
                        id: addon.id,
                        quantity: addonQty,
                        title: addon.title,
                        totalAmount: addonQty * (addon.price),
                        price_per_piece: addon.price,
                        amount_type: addon.amountType.description,
                        post_type: addon.postType.description
                    });
                    $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;

                    for (i = startIndex; i <= endIndex; i++) {
                        if (!$scope.reservationData.rooms[i].addons) {
                            $scope.reservationData.rooms[i].addons = [];
                        }
                        $scope.reservationData.rooms[i].addons.push({
                            id: addon.id,
                            title: addon.title,
                            quantity: addonQty,
                            price: addon.price,
                            amountType: addon.amountType,
                            postType: addon.postType,
                            taxDetail: addon.taxes,
                            chargefullweeksonly:addon.chargefullweeksonly
                        });
                    }
                }

                $scope.showEnhancementsPopup();
                computeTotals();
            },
            addonsDataCopy = [];

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
        };

        $scope.closePopup = function() {
            ngDialog.close();
        };

        $scope.refreshAddonsScroller = function() {
            $timeout(function() {
                if ($scope.$parent.myScroll['enhanceStays']) {
                    $scope.$parent.myScroll['enhanceStays'].refresh();
                }
            }, 700);
        };

        $scope.proceed = function() {
            $scope.closePopup();
            var allRatesSelected = _.reduce(_.pluck($scope.reservationData.rooms, 'rateId'), function(a, b) {
                return !!a && !!b
            });
            if ($stateParams.reservation === "HOURLY" || allRatesSelected) {
                goToSummaryAndConfirm();
            } else {
                var roomIndexWithoutRate = _.findIndex($scope.reservationData.rooms, {
                    rateId: ""
                });

                var tabIndexWithoutRate = _.findIndex($scope.reservationData.tabs, {
                    roomTypeId: $scope.reservationData.rooms[roomIndexWithoutRate].roomTypeId
                });

                $scope.viewState.currentTab = tabIndexWithoutRate;
                $state.go('rover.reservation.staycard.mainCard.roomType', {
                    from_date: $scope.reservationData.arrivalDate,
                    to_date: $scope.reservationData.departureDate,
                    view: "DEFAULT",
                    company_id: null,
                    travel_agent_id: null,
                    fromState: 'rover.reservation.staycard.mainCard.addons',
                    group_id: $scope.reservationData.group.id
                });
            }
        };

        $scope.selectAddonCategory = function(category, event) {
            event.stopPropagation();
            if (!!category) {
                $scope.activeAddonCategoryId = category.id;
                fetchAddons(category.id);
            } else {
                $scope.activeAddonCategoryId = -1;
                fetchAddons();
            }
        };

        $scope.selectAddon = function(addon, addonQty, overBook) {
            $scope.closePopup();
            if (!$rootScope.isItemInventoryOn || overBook) {
                insertAddon(addon, addonQty)
            } else {
                /*
                 *  the following is for the calculation to check if the inventory limit is exeeded
                 *  as the count is dependant on duration of stay ,type and number of guests etc
                 *
                 */
                $scope.selectedAddonName = addon.title;
                var fetchHeadCount = function(type, count) {
                        var remainingCount = 0;
                        if (type === 'Entire Stay') {
                            remainingCount = $scope.duration_of_stay * count;
                        } else {
                            remainingCount = count;
                        };
                        return remainingCount;
                    },
                    headCount = 0,
                    roomCount = $scope.reservationData.tabs[$scope.viewState.currentTab].roomCount;

                if (addon.amountType.description === 'Person') {
                    headCount = fetchHeadCount(addon.postType.description, $scope.reservationData.number_of_adults + $scope.reservationData.number_of_children);
                } else if (addon.amountType.description === 'Adult') {
                    headCount = fetchHeadCount(addon.postType.description, $scope.reservationData.number_of_adults);
                } else if (addon.amountType.description === 'Child') {
                    headCount = fetchHeadCount(addon.postType.description, $scope.reservationData.number_of_children);
                } else if (addon.amountType.description === 'Flat') {
                    headCount = fetchHeadCount(addon.postType.description, 1);
                };

                // account for room-count
                headCount = headCount * roomCount;

                var newAddonQty = 0;
                var alreadyAdded = false;
                angular.forEach($scope.addonsData.existingAddons, function(item, index) {
                    if (item.id === addon.id) {
                        newAddonQty = parseInt(item.quantity) + parseInt(addonQty);
                        alreadyAdded = true;
                    }
                });
                var oldAddonQty = 0;
                angular.forEach(addonsDataCopy, function(item, index) {
                    if (item.id === addon.id) {
                        oldAddonQty = parseInt(item.quantity) + parseInt(addonQty);
                    }
                });
                var difference = alreadyAdded ? ((newAddonQty - oldAddonQty) === 0) ? 1 : (newAddonQty - oldAddonQty) : newAddonQty;

                var successCallBackInventoryCheck = function(response) {
                    $scope.$emit('hideLoader');
                    var availableAddonCount = response.available_count;
                    var remainingCount = availableAddonCount - (headCount * difference);
                    /*
                     *  if the available count is less we prompts warning popup
                     */
                    if (remainingCount >= 0 || availableAddonCount === null) {
                        insertAddon(addon, addonQty);
                    } else {
                        $scope.addon = addon;
                        $scope.addonQty = addonQty;
                        $scope.remainingCount = availableAddonCount;
                        ngDialog.open({
                            template: '/assets/partials/reservationCard/rvInsufficientInventory.html',
                            className: 'ngdialog-theme-default',
                            closeByDocument: true,
                            scope: $scope,
                            data: JSON.stringify({
                                name: $scope.selectedAddonName,
                                count: availableAddonCount,
                                canOverbookInventory: rvPermissionSrv.getPermissionValue('OVERRIDE_ITEM_INVENTORY')
                            })
                        });
                    };
                };

                var paramDict = {
                    'addon_id': addon.id,
                    'from_date': $scope.reservationData.arrivalDate,
                    'to_date': $scope.reservationData.departureDate,
                }
                $scope.invokeApi(RVReservationAddonsSrv.checkInventory, paramDict, successCallBackInventoryCheck);
            }

        };

        $scope.removeSelectedAddons = function(index) {
            var roomIndex,
                startIndex = $scope.roomDetails.firstIndex,
                endIndex = $scope.roomDetails.lastIndex;

            if ($stateParams.reservation === "HOURLY") {
                startIndex = 0;
                endIndex = $scope.reservationData.rooms.length - 1;
            };

            // subtract selected addon amount from total stay cost
            $scope.addonsData.existingAddons.splice(index, 1);

            for (roomIndex = startIndex; roomIndex <= endIndex; roomIndex++) {
                $scope.reservationData.rooms[roomIndex].addons.splice(index, 1);
            }

            $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;
            if ($scope.addonsData.existingAddons.length === 0) {
                $scope.closePopup();
            }
            computeTotals();
        };

        var initController = function() {
            $scope.addons = [];
            $scope.activeRoom = $scope.viewState.currentTab;
            $scope.fromPage = "";
            $scope.duration_of_stay = $scope.reservationData.numNights || 1;
            $scope.existingAddonsLength = 0;
            $scope.setHeadingTitle('Enhance Stay');


            setBackButton();

            if ($stateParams.reservation === "HOURLY") {
                initFromHourly();
            } else {
                $scope.roomDetails = getCurrentRoomDetails();
                var successCallBack = function(data) {
                    var roomIndex,
                        startIndex = $scope.roomDetails.firstIndex,
                        endIndex = $scope.roomDetails.lastIndex;

                    if ($stateParams.reservation === "HOURLY") {
                        startIndex = 0;
                        endIndex = $scope.reservationData.rooms.length - 1;
                    };

                    $scope.$emit('hideLoader');
                    $scope.roomNumber = data.room_no;
                    $scope.duration_of_stay = data.duration_of_stay || $scope.reservationData.numNights;
                    $scope.addonsData.existingAddons = [];
                    for (roomIndex = startIndex; roomIndex <= endIndex; roomIndex++) { //Reset Addons list in Room Model - CICO-20061
                        $scope.reservationData.rooms[roomIndex].addons = [];
                    }
                    var associatedPackages = data.existing_packages || data;
                    angular.forEach(associatedPackages, function(item) {
                        var addonsData = {
                            id: item.id,
                            title: item.name,
                            quantity: item.addon_count,
                            totalAmount: item.addon_count * parseFloat(item.amount),
                            price_per_piece: item.amount,
                            amount_type: item.amount_type.value,
                            post_type: item.post_type.value,
                            is_inclusive: item.is_inclusive
                        };

                        $scope.addonsData.existingAddons.push(addonsData);

                        for (roomIndex = startIndex; roomIndex <= endIndex; roomIndex++) {
                            $scope.reservationData.rooms[roomIndex].addons.push({
                                quantity: addonsData.quantity,
                                id: addonsData.id,
                                price: parseFloat(item.amount),
                                amountType: item.amount_type,
                                postType: item.post_type,
                                title: addonsData.title,
                                totalAmount: addonsData.totalAmount,
                                is_inclusive: addonsData.is_inclusive,
                                taxes: item.taxes
                            });
                        }

                    });

                    addonsDataCopy = angular.copy($scope.addonsData.existingAddons);
                    $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;

                    $scope.computeTotalStayCost();
                };
                if (!RVReservationStateService.getReservationFlag('RATE_CHANGED') && !!$scope.reservationData.reservationId) {
                    $scope.invokeApi(RVReservationPackageSrv.getReservationPackages, $scope.reservationData.reservationId, successCallBack);
                } else if (!!$scope.reservationData.group.id) {
                    $scope.is_rate_addons_fetch = true;
                    $scope.callAPI(rvGroupConfigurationSrv.getGroupEnhancements, {
                        successCallBack: successCallBack,
                        params: {
                            "id": $scope.reservationData.group.id
                        }
                    });
                }
                // by default load Best Sellers addon
                // Best Sellers in not a real charge code [just hard coding -1 as charge group id to fetch best sell addons]
                // same will be overrided if with valid charge code id
                $scope.activeAddonCategoryId = -1;
                $scope.roomNumber = '';
                $scope.addonCategories = addonData.addonCategories;
                $scope.bestSellerEnabled = addonData.bestSellerEnabled;

                // first time fetch best seller addons
                // for fetching best sellers - call method without params ie. no charge group id
                // Best Sellers in not a real charge code [just hard coded charge group to fetch best sell addons]
                /**
                 * CICO-16792 Sending a second parameter to the fetchAddons method to identify the initial call to the method
                 */
                fetchAddons('', true);
                $scope.setScroller("enhanceStays");
            }
        };
        initController();
    }
]);