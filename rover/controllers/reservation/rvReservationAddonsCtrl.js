sntRover.controller('RVReservationAddonsCtrl', [
    '$scope', '$rootScope', 'addonData', '$state', 'ngDialog', 'RVReservationAddonsSrv', '$filter', '$timeout', 'RVReservationSummarySrv', '$stateParams', '$vault', 'RVReservationPackageSrv', 'RVReservationStateService',
    function($scope, $rootScope, addonData, $state, ngDialog, RVReservationAddonsSrv, $filter, $timeout, RVReservationSummarySrv, $stateParams, $vault, RVReservationPackageSrv, RVReservationStateService) {

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
                            company_id: null,
                            travel_agent_id: null,
                            fromState: 'rover.reservation.staycard.mainCard.addons'
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
                        if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id) {
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
            };

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
            if ($stateParams.reservation === "HOURLY" || $scope.viewState.currentTab === $scope.reservationData.tabs.length - 1) {
                goToSummaryAndConfirm();
            } else {
                $scope.viewState.currentTab++;
                $state.go('rover.reservation.staycard.mainCard.roomType', {
                    from_date: $scope.reservationData.arrivalDate,
                    to_date: $scope.reservationData.departureDate,
                    view: "DEFAULT",
                    company_id: null,
                    travel_agent_id: null,
                    fromState: 'rover.reservation.staycard.mainCard.addons'
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

        $scope.selectAddon = function(addon, addonQty) {
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
                $scope.existingAddonsLength = $scope.existingAddonsLength.length;

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
                    });
                }
            }

            $scope.showEnhancementsPopup();
            computeTotals();
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
                    $scope.$emit('hideLoader');
                    $scope.roomNumber = data.room_no;
                    $scope.duration_of_stay = data.duration_of_stay;
                    $scope.addonsData.existingAddons = [];
                    angular.forEach(data.existing_packages, function(item) {
                        var addonsData = {
                                id: item.package_id,
                                title: item.package_name,
                                quantity: item.count,
                                totalAmount: item.count * item.price_per_piece,
                                price_per_piece: item.price_per_piece,
                                amount_type: item.amount_type,
                                post_type: item.post_type,
                                is_inclusive: item.is_inclusive
                            },
                            alreadyAdded = false;

                        if (!alreadyAdded) {
                            $scope.addonsData.existingAddons.push(addonsData);
                        }
                    });
                    $scope.existingAddonsLength = $scope.addonsData.existingAddons.length;
                };
                if (!RVReservationStateService.getReservationFlag('RATE_CHANGED') && !!$scope.reservationData.reservationId) {
                    $scope.invokeApi(RVReservationPackageSrv.getReservationPackages, $scope.reservationData.reservationId, successCallBack);
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