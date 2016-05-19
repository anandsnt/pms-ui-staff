sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'ngDialog', '$filter', 'RVCompanyCardSrv', '$state', 'dateFilter', 'baseSearchData', 'RVReservationSummarySrv', 'RVReservationCardSrv', 'RVPaymentSrv', '$timeout', '$stateParams', 'RVReservationGuestSrv',
    'RVReservationStateService', 'RVReservationDataService',
    function($scope, $rootScope, ngDialog, $filter, RVCompanyCardSrv, $state, dateFilter, baseSearchData, RVReservationSummarySrv, RVReservationCardSrv, RVPaymentSrv, $timeout, $stateParams, RVReservationGuestSrv, RVReservationStateService, RVReservationDataService) {

        BaseCtrl.call(this, $scope);

        $scope.$emit("updateRoverLeftMenu", "createReservation");

        var title = $filter('translate')('RESERVATION_TITLE');
        $scope.setTitle(title);
        var that = this;

        var roomAndRatesState = 'rover.reservation.staycard.mainCard.room-rates';


        //setting the main header of the screen
        $scope.heading = "Reservations";

        $scope.viewState = {
            currentTab: 0,
            isAddNewCard: false,
            pendingRemoval: {
                status: false,
                cardType: ""
            },
            identifier: "CREATION",
            lastCardSlot: "",
            reservationStatus: {
                confirm: false,
                number: null
            }
        };

        //fetching country list
        //Commenting - Another call is happening to fetch countries

        // adding extra function to reset time
        $scope.clearArrivalAndDepartureTime = function() {
            $scope.reservationData.checkinTime = RVReservationDataService.getTimeModel();
            $scope.reservationData.checkoutTime = RVReservationDataService.getTimeModel();
        };

        $scope.otherData = {};
        // needed to add an extra data variable as others were getting reset
        $scope.addonsData = {};
        $scope.addonsData.existingAddons = [];

        //to set data for reverse checkout process
        $scope.initreverseCheckoutDetails = function() {
            $scope.reverseCheckoutDetails = {
                data: {
                    is_reverse_checkout_failed: false,
                    errormessage: ""
                }
            };
        };
        $scope.initreverseCheckoutDetails();

        $scope.initReservationData = function() {
            RVReservationStateService.bookMark.lastPostedRate = null;
            $scope.hideSidebar = false;
            $scope.addonsData.existingAddons = [];
            // intialize reservation object
            $scope.reservationData = RVReservationDataService.getReservationDataModel();
            $scope.searchData = RVReservationDataService.getSearchDataModel();
            // default max value if max_adults, max_children, max_infants is not configured
            var defaultMaxvalue = 5;
            var guestMaxSettings = baseSearchData.settings.max_guests;
            var maxRoomCount = parseInt(baseSearchData.settings.max_room_quantity, 10) || 5; //Defaulting to 5

            /**
             *   We have moved the fetching of 'baseData' form 'rover.reservation' state
             *   to the states where it actually requires it.
             *
             *   Now we do want to bind the baseData so we have created a 'callFromChildCtrl' (last method).
             *
             *   Once that state controller fetch 'baseData', it will find this controller
             *   by climbing the $socpe.$parent ladder and will call 'callFromChildCtrl' method.
             */

            $scope.otherData.taxesMeta = [];
            $scope.otherData.promotionTypes = [{
                value: "v1",
                description: "The first"
            }, {
                value: "v2",
                description: "The Second"
            }];
            $scope.otherData.maxAdults = (guestMaxSettings.max_adults === null || guestMaxSettings.max_adults === '') ? defaultMaxvalue : guestMaxSettings.max_adults;
            $scope.otherData.maxChildren = (guestMaxSettings.max_children === null || guestMaxSettings.max_children === '') ? defaultMaxvalue : guestMaxSettings.max_children;
            $scope.otherData.maxInfants = (guestMaxSettings.max_infants === null || guestMaxSettings.max_infants === '') ? defaultMaxvalue : guestMaxSettings.max_infants;
            $scope.otherData.maxRoomCount = maxRoomCount;

            $scope.otherData.roomTypes = baseSearchData.roomTypes;
            $scope.reservationData.roomsMeta = {};
            _.each(baseSearchData.roomTypes, function(room) {
                $scope.reservationData.roomsMeta[room.id] = room;
            });

            $scope.otherData.fromSearch = false;
            $scope.otherData.recommendedRateDisplay = baseSearchData.settings.recommended_rate_display;
            $scope.otherData.defaultRateDisplayName = baseSearchData.settings.default_rate_display_name;
            $scope.otherData.businessDate = baseSearchData.businessDate;
            $scope.otherData.additionalEmail = "";
            $scope.otherData.isGuestPrimaryEmailChecked = false;
            $scope.otherData.isGuestAdditionalEmailChecked = false;
            $scope.otherData.reservationCreated = false;

            $scope.otherData.marketIsForced = baseSearchData.settings.force_market_code;
            $scope.otherData.sourceIsForced = baseSearchData.settings.force_source_code;
            $scope.otherData.originIsForced = baseSearchData.settings.force_origin_of_booking;
            $scope.otherData.reservationTypeIsForced = baseSearchData.settings.force_reservation_type;
            $scope.otherData.segmentsIsForced = baseSearchData.settings.force_segments;
            //CICO-17731 Force Adjustment Reasons
            $scope.otherData.forceAdjustmentReason = baseSearchData.settings.force_rate_adjustment_reason;
            // CICO-12562 Zoku - Overbooking Alert
            $scope.otherData.showOverbookingAlert = baseSearchData.settings.show_overbooking_alert;

            $scope.otherData.isAddonEnabled = baseSearchData.settings.is_addon_on;

            $scope.guestCardData = {};
            $scope.guestCardData.cardHeaderImage = "/assets/images/avatar-trans.png";
            $scope.guestCardData.contactInfo = {};
            $scope.guestCardData.userId = '';

            $scope.guestCardData.contactInfo.birthday = '';

            $scope.reservationListData = {};

            $scope.reservationDetails = RVReservationDataService.getReservationDetailsModel();
        };

        $scope.initReservationDetails = function() {
            // Initiate All Cards
            $scope.reservationDetails = RVReservationDataService.getReservationDetailsModel();

            $scope.viewState = {
                currentTab: 0,
                isAddNewCard: false,
                pendingRemoval: {
                    status: false,
                    cardType: ""
                },
                identifier: "CREATION",
                lastCardSlot: "",
                reservationStatus: {
                    confirm: false,
                    number: null
                }
            };
        };

        //CICO-7641
        var isOccupancyConfigured = function(roomIndex) {
            var rateConfigured = true;
            if (typeof $scope.reservationData.rateDetails[roomIndex] !== "undefined") {
                _.each($scope.reservationData.rateDetails[roomIndex], function(d, dateIter) {
                    if (dateIter !== $scope.reservationData.departureDate && $scope.reservationData.rooms[roomIndex].stayDates[dateIter].rate.id !== '' && parseFloat($scope.reservationData.rooms[roomIndex].stayDates[dateIter].rateDetails.actual_amount) !== 0.00) {
                        var rateToday = d[$scope.reservationData.rooms[roomIndex].stayDates[dateIter].rate.id].rateBreakUp;
                        var numAdults = parseInt($scope.reservationData.rooms[roomIndex].stayDates[dateIter].guests.adults);
                        var numChildren = parseInt($scope.reservationData.rooms[roomIndex].stayDates[dateIter].guests.children);

                        if (rateToday.single === null && rateToday.double === null && rateToday.extra_adult === null && rateToday.child === null) {
                            rateConfigured = false;
                        } else {
                            // Step 2: Check for the other constraints here
                            // Step 2 A : Children
                            if (numChildren > 0 && rateToday.child === null) {
                                rateConfigured = false;
                            } else if (numAdults === 1 && rateToday.single === null) { // Step 2 B: one adult - single needs to be configured
                                rateConfigured = false;
                            } else if (numAdults >= 2 && rateToday.double === null) { // Step 2 C: more than one adult - double needs to be configured
                                rateConfigured = false;
                            } else if (numAdults > 2 && rateToday.extra_adult === null) { // Step 2 D: more than two adults - need extra_adult to be configured
                                rateConfigured = false;
                            }
                        }
                    }
                });
            }
            return rateConfigured;
        };

        $scope.checkOccupancyLimit = function(date, reset, index) {
            //CICO-11716
            if ($scope.reservationData.isHourly) {
                return false;
            } else {
                var roomIndex = index || 0;
                if (isOccupancyConfigured(roomIndex)) {
                    $scope.reservationData.rooms[roomIndex].varyingOccupancy = RVReservationDataService.isVaryingOccupancy($scope.reservationData.rooms[roomIndex].stayDates, $scope.reservationData.arrivalDate, $scope.reservationData.departureDate, $scope.reservationData.numNights);
                    $scope.computeTotalStayCost(reset);
                    if (reset) {
                        $scope.saveReservation(false, false, roomIndex);
                    }
                    var activeRoom = $scope.reservationData.rooms[roomIndex].roomTypeId;
                    var currOccupancy = parseInt($scope.reservationData.rooms[roomIndex].numChildren) +
                        parseInt($scope.reservationData.rooms[roomIndex].numAdults);
                    if (date) {
                        // If there is an date sent as a param the occupancy check has to be done for the particular day
                        currOccupancy = parseInt($scope.reservationData.rooms[roomIndex].stayDates[date].guests.adults) + parseInt($scope.reservationData.rooms[roomIndex].stayDates[date].guests.children);
                    }

                    var getMaxOccupancy = function(roomId) {
                        var max = -1;
                        var name = "";
                        $($scope.otherData.roomTypes).each(function(i, d) {
                            if (parseInt(roomId) === d.id) {
                                max = d.max_occupancy;
                                name = d.name;
                            }
                        });
                        return {
                            max: max,
                            name: name
                        };
                    };

                    var roomPref = getMaxOccupancy(activeRoom);

                    if (typeof activeRoom === 'undefined' || activeRoom === null || activeRoom === "" || roomPref.max === null || roomPref.max >= currOccupancy) {
                        return true;
                    }
                    // CICO-9575: The occupancy warning should pop up only once during the reservation process if no changes are being made to the room type.
                    if ((!$scope.reservationData.rooms[roomIndex].isOccupancyCheckAlerted || $scope.reservationData.rooms[roomIndex].isOccupancyCheckAlerted !== activeRoom) && $state.current.name !== "rover.reservation.staycard.reservationcard.reservationdetails") {
                        ngDialog.open({
                            template: '/assets/partials/reservation/alerts/occupancy.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            closeByDocument: false,
                            closeByEscape: false,
                            data: JSON.stringify({
                                roomType: roomPref.name,
                                roomMax: roomPref.max
                            })
                        });
                        // CICO-9575: The occupancy warning should pop up only once during the reservation process if no changes are being made to the room type.
                        $scope.reservationData.rooms[roomIndex].isOccupancyCheckAlerted = activeRoom;
                    }

                    return true;
                } else {
                    // TODO: 7641
                    // prompt user that the room doesn't have a rate configured for the current availability
                    ngDialog.open({
                        template: '/assets/partials/reservation/alerts/notConfiguredOccupancy.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false,
                        data: JSON.stringify({
                            roomIndex: roomIndex
                        })
                    });
                }
            }
        };

        $scope.resetRoomSelection = function(roomIndex) {
            $scope.editRoomRates(roomIndex);
            $scope.closeDialog();
        };

        var processTaxInfo = function(taxApplied, roomIndex, date) {
            var currentTaxes = $scope.reservationData.taxDetails;

            _.each(taxApplied.taxDescription, function(description) {
                var taxId = description.id;
                var taxType = description.isInclusive ? "incl" : "excl";
                description.rate = $scope.reservationData.rooms[roomIndex].stayDates[date].rate.id;
                if (description.postType === "NIGHT") {
                    if (typeof currentTaxes[taxType][taxId] === "undefined") {
                        currentTaxes[taxType][taxId] = description;
                    } else {
                        currentTaxes[taxType][taxId].amount = parseFloat(currentTaxes[taxType][taxId].amount) + Number(parseFloat(description.amount).toFixed(2)); // add the amount here
                    }
                } else { //[[[[[[ PER_STAY NEEDS TO BE DONE ONLY ONCE FOR A RATE ID & TAX ID COMBO]]]]]]
                    if (typeof currentTaxes[taxType][taxId] === "undefined") {
                        // As stated earler per_stay taxes can be taken in only for the first rateId
                        if (_.isEmpty(currentTaxes[taxType])) {
                            currentTaxes[taxType][taxId] = description;
                        } else {
                            //get the rateId of the first value in the $scope.reservationData.taxDetail
                            var rateIdExisting = currentTaxes[taxType][Object.keys(currentTaxes[taxType])[0]].rate;
                            if (rateIdExisting === description.rate) {
                                currentTaxes[taxType][taxId] = description;
                            }
                        }
                    } else { //STAY
                        /*
                         *   --NOTE: For the same rateId there could be different rates across the stay period.
                         *   For the above scenario if the PERSTAY tax is say some x% of the rate,
                         *   we would be having different rates >>> WHAT TO DO? For now sticking to the larger number
                         *   Now, even better: Say there are multiple rateIds selected, or even for this comment's sake a single rate for the all stay dates
                         *   but there are multiple occupancies and the taxes arent flat, but they are PER_PERSON/ PER_CHILD / PER_ADULT
                         *   ThereAgain : for now sticking to the largest tax amount of all
                         *   === TODO === Mail product team for a clarification on this!!!
                         */
                        currentTaxes[taxType][taxId].amount = currentTaxes[taxType][taxId].amount > description.amount ? currentTaxes[taxType][taxId].amount : Number(parseFloat(description.amount).toFixed(2));
                    }
                }
            });
        };

        //-----------------------------------------------------------------------------------------------------------//



        $scope.computeTotalStayCost = function(reset) {
            $scope.reservationData.taxDetails = {
                incl: {},
                excl: {}
            }; // -- RESET existing tax info
            $scope.reservationData.totalStayCost = 0.0;
            $scope.reservationData.totalTaxAmount = 0.0;
            $scope.reservationData.totalTax = 0.0;

            // For every Room
            angular.forEach($scope.reservationData.rooms, function(currentRoom, roomIndex) {
                currentRoom.rateTotal = 0.0; // -- RESET
                currentRoom.associatedAddonTotal = 0.0;
                var roomMetaData = {
                    arrival: $scope.reservationData.arrivalDate,
                    departure: $scope.reservationData.departureDate,
                    rateInfo: $scope.reservationData.rateDetails[roomIndex],
                    roomTotal: 0.0,
                    roomTax: 0.0,
                    totalTaxes: 0.0, // only exclusive
                    taxesInclusiveExclusive: 0.0, // CICO-10161 > holds both inclusive and exclusive
                    addOnCumulative: 0.0
                };

                // For every Day
                angular.forEach(currentRoom.stayDates, function(stay, date) {
                    // EXCLUDE departure date from cost computations - EXCEPT for SINGLE DAY(zero nights) reservations
                    if ((date === roomMetaData.arrival || date !== roomMetaData.departure)) {
                        var todaysRate = stay.rate.id,
                            adultsOnTheDay = stay.guests.adults,
                            childrenOnTheDay = stay.guests.children;

                        if (!todaysRate || todaysRate === null || !$scope.reservationData.rateDetails.length) {
                            // ERROR! - NO RATE SELECTED FOR THIS RESERVATION - THIS DAY
                        } else {
                            var todaysMetaData = $scope.reservationData.rateDetails[roomIndex] && $scope.reservationData.rateDetails[roomIndex][date] && $scope.reservationData.rateDetails[roomIndex][date];
                            if (!todaysMetaData) {
                                return;
                            }
                            // --------------------------------------------------------------------------------//
                            // -- Calculate the rate amount for the Room for that rate for that day --
                            // --------------------------------------------------------------------------------//
                            { // STEP ONE -- rate computation block
                                var roomAmount = todaysMetaData.rateDetails.actual_amount,
                                    roomAmountRounded = Number(roomAmount.toFixed(2));
                                if (reset) { // -- in case of rate changes reset the modified rate amount as well
                                    stay.rateDetails.actual_amount = $filter('number')(roomAmount, 2);
                                    stay.rateDetails.modified_amount = stay.rateDetails.actual_amount;
                                }
                                if (stay && stay.rateDetails) { //CICO-6079 -- In case of modified rates, set the roomAmount to that rate
                                    if (stay.rateDetails.actual_amount !== stay.rateDetails.modified_amount) {
                                        roomAmount = parseFloat(stay.rateDetails.modified_amount);
                                        roomAmountRounded = Number(roomAmount.toFixed(2));
                                    }
                                }
                                var taxableRateAmount = roomAmountRounded; // default taxableRoomAmount to the calculated room amount. This inclusive addons are to be adjusted wrt this value!
                                currentRoom.rateTotal = currentRoom.rateTotal + roomAmountRounded; // cumulative total of all days goes to roomTotal
                                currentRoom.rateAvg = currentRoom.rateTotal / $scope.reservationData.numNights;
                            }
                            // --------------------------------------------------------------------------------//
                            // -- Calculate the rate amount for the Room for that rate for that day --
                            // --------------------------------------------------------------------------------//
                            { // STEP TWO -- addon computation block
                                //for every addon
                                angular.forEach(currentRoom.addons, function(addon) {
                                    if (date === roomMetaData.arrival) {
                                        addon.effectivePrice = 0.0; // RESET addon rate
                                    }
                                    var baseRate = parseFloat(addon.quantity) * parseFloat(addon.price), //calculate the base
                                        finalRate = 0.0, //default calculated amount to the base rate,
                                        finalRateRounded = 0.0,
                                        postType = addon.post_type || addon.postType,
                                        amountType = addon.amount_type || addon.amountType,
                                        chargefullweeksonly = addon.chargefullweeksonly,
                                        shouldPostAddon = RVReservationStateService.shouldPostAddon(postType.frequency, date, roomMetaData.arrival, roomMetaData.departure, chargefullweeksonly);
                                    if (shouldPostAddon) {
                                        finalRate = parseFloat(RVReservationStateService.getAddonAmount(amountType.value, baseRate, adultsOnTheDay, childrenOnTheDay));
                                        finalRateRounded = Number(finalRate.toFixed(2));
                                        if (!!_.findWhere(todaysMetaData.associatedAddons, {
                                            id: addon.id
                                        })) {
                                            //check if the addon is associated
                                            if (todaysMetaData.applyPromotion) {
                                                finalRate = RVReservationStateService.applyDiscount(finalRate, todaysMetaData.appliedPromotion.discount, $scope.reservationData.numNights);
                                                finalRateRounded = Number(finalRate.toFixed(2));
                                            }
                                            if (!addon.is_inclusive) {
                                                currentRoom.associatedAddonTotal += finalRateRounded;
                                            }
                                            currentRoom.rateAvg = (currentRoom.rateTotal + currentRoom.associatedAddonTotal) / $scope.reservationData.numNights;
                                        }

                                    }
                                    // cummulative sum (Not just multiplication of rate per day with the num of nights) >> Has to done at "day level" to handle the reservations with varying occupancy!
                                    if (postType.frequency > 0 && shouldPostAddon) {
                                        addon.effectivePrice = parseFloat(addon.effectivePrice) + parseFloat(finalRateRounded);

                                    } else if (postType.frequency === 0 && shouldPostAddon) {
                                        addon.effectivePrice = finalRateRounded; //Posted only on the first Night
                                    }
                                    if (!addon.is_inclusive) {
                                        roomMetaData.addOnCumulative += parseFloat(finalRateRounded);
                                    } else {
                                        taxableRateAmount -= parseFloat(finalRateRounded); //reduce the addon amount from this day's calculated rate
                                    }
                                    // --------------------------------------------------------------------------------//
                                    // -- Calculate the tax for add-ons --
                                    // --------------------------------------------------------------------------------//
                                    { // STEP THREE -- compute tax for addons
                                        processTaxInfo(RVReservationStateService.calculateTax(finalRate, addon.taxDetail || addon.taxes, roomIndex, adultsOnTheDay, childrenOnTheDay, true), roomIndex, date);
                                    }
                                });

                            }
                            // --------------------------------------------------------------------------------//
                            // -- Calculate the tax on adjusted rate amount for that day --
                            // --------------------------------------------------------------------------------//
                            { // STEP FOUR -- compute tax for rate
                                var daysTaxes = $scope.reservationData.ratesMeta[currentRoom.stayDates[date].rate.id].taxes;
                                if (daysTaxes && !!daysTaxes.length) {
                                    if (parseFloat(taxableRateAmount) < 0.0) {
                                        taxableRateAmount = 0.0;
                                    }
                                    processTaxInfo(RVReservationStateService.calculateTax(taxableRateAmount, daysTaxes, roomIndex, adultsOnTheDay, childrenOnTheDay), roomIndex, date);
                                }
                            }
                        }
                    }
                });

                $scope.reservationData.taxInformation = {};

                angular.forEach($scope.reservationData.taxDetails.incl, function(tax) {
                    $scope.reservationData.taxInformation = angular.copy($scope.reservationData.taxDetails.incl);
                    roomMetaData.taxesInclusiveExclusive = parseFloat(roomMetaData.taxesInclusiveExclusive) + Number(parseFloat(tax.amount).toFixed(2));
                });

                angular.forEach($scope.reservationData.taxDetails.excl, function(tax, code) {
                    roomMetaData.totalTaxes = parseFloat(roomMetaData.totalTaxes) + Number(parseFloat(tax.amount).toFixed(2)); // add only exclusive taxes here
                    roomMetaData.taxesInclusiveExclusive = parseFloat(roomMetaData.taxesInclusiveExclusive) + Number(parseFloat(tax.amount).toFixed(2));
                    if (typeof $scope.reservationData.taxInformation[code] === 'undefined') {
                        $scope.reservationData.taxInformation[code] = tax;
                    } else {
                        $scope.reservationData.taxInformation[code].amount = parseFloat($scope.reservationData.taxInformation[code].amount) + Number(parseFloat(tax.amount).toFixed(2));
                    }
                });

                //cumulative total of all stay costs
                $scope.reservationData.totalTaxAmount = parseFloat($scope.reservationData.totalTaxAmount) + parseFloat(roomMetaData.totalTaxes);
                $scope.reservationData.totalStayCost = parseFloat($scope.reservationData.totalStayCost) + parseFloat(currentRoom.rateTotal) + parseFloat(roomMetaData.addOnCumulative) + parseFloat(roomMetaData.totalTaxes);
                $scope.reservationData.totalTax = parseFloat($scope.reservationData.totalTax) + parseFloat(roomMetaData.taxesInclusiveExclusive);
            });
        };


        $scope.editRoomRates = function(roomIdx) {
            //TODO: Navigate back to roomtype selection screen after resetting the current room options
            $scope.reservationData.rooms[roomIdx].roomTypeId = '';
            $scope.reservationData.rooms[roomIdx].roomTypeName = '';
            $scope.reservationData.rooms[roomIdx].rateId = '';
            $scope.reservationData.rooms[roomIdx].rateName = '';
            $scope.reservationData.demographics = {
                market: '',
                source: '',
                reservationType: '',
                origin: ''
            };

            // Redo the staydates array
            for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                $scope.reservationData.rooms[roomIdx].stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')].rate = {
                    id: ''
                };
            };

            $state.go(roomAndRatesState, {
                from_date: $scope.reservationData.arrivalDate,
                to_date: $scope.reservationData.departureDate,
                fromState: 'rover.reservation.search',
                company_id: $scope.reservationData.company.id,
                travel_agent_id: $scope.reservationData.travelAgent.id
            });
        };

        $scope.updateOccupancy = function(roomIdx) {
            for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                $scope.reservationData.rooms[roomIdx].stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')].guests = {
                    adults: parseInt($scope.reservationData.rooms[roomIdx].numAdults),
                    children: parseInt($scope.reservationData.rooms[roomIdx].numChildren),
                    infants: parseInt($scope.reservationData.rooms[roomIdx].numInfants)
                };
            };
        };

        /*
            This function is called once the stay card loads and
            populates the $scope.reservationData object with the current reservation's data.

            This is done to enable use of the $scope.reservationData object in the subsequent screens in
            the flow from the staycards
        */

        $scope.populateDataModel = function(reservationDetails) {
            var parsedStayCardData = RVReservationDataService.parseReservationData(reservationDetails.reservation_card, $scope.reservationListData);
            _.extend($scope.reservationData, parsedStayCardData.reservationData);
            // Not sure why the below four are being dumped to the scope
            // Ref original commit at https://github.com/StayNTouch/pms/commit/d1021861
            $scope.isManual = parsedStayCardData.isManual;
            $scope.reservationEditMode = parsedStayCardData.reservationEditMode;
            $scope.showSelectedCreditCard = parsedStayCardData.showSelectedCreditCard;
            $scope.renderData = parsedStayCardData.renderData;
        };

        /**
         * Event handler for the left menu staydates click action
         * We should display the calendar screen
         */
        $scope.stayDatesClicked = function() {
            var fromState = $state.current.name;
            //If we are already in state for calendar/rooms&rates,
            //then we only need to switch the vuew type to calendar


            $state.go(roomAndRatesState, {
                from_date: $scope.reservationData.arrivalDate,
                to_date: $scope.reservationData.departureDate,
                view: "DEFAULT",
                fromState: fromState,
                company_id: $scope.reservationData.company.id,
                travel_agent_id: $scope.reservationData.travelAgent.id,
                group_id: $scope.reservationData.group.id
            });
        };

        $scope.$on("guestEmailChanged", function(e) {
            $scope.$broadcast('updateGuestEmail');
        });


        /**
         *   Validation conditions
         *
         *   Either adults or children can be 0,
         *   but one of them will have to have a value other than 0.
         *
         *   Infants should be excluded from this validation.
         */
        $scope.validateOccupant = function(room, from) {

            // just in case
            if (!room) {
                return;
            };

            var numAdults = parseInt(room.numAdults),
                numChildren = parseInt(room.numChildren);

            if ((from === 'adult' || from === "numAdults") && (numAdults === 0 && numChildren === 0)) {
                room.numChildren = 1;
            } else if ((from === 'children' || from === "numChildren") && (numChildren === 0 && numAdults === 0)) {
                room.numAdults = 1;
            }
        };

        $scope.initReservationData();

        $scope.$on('REFRESHACCORDIAN', function() {
            $scope.$broadcast('GETREFRESHACCORDIAN');
        });

        $scope.$on('PROMPTCARD', function() {
            $scope.$broadcast('PROMPTCARDENTRY');
        });

        /**
         *   We have moved the fetching of 'baseData' form 'rover.reservation' state
         *   to the states where it actually requires it.
         *
         *   Now we do want to bind the baseData so we have created a 'callFromChildCtrl' method here.
         *
         *   Once that state controller fetch 'baseData', it will find this controller
         *   by climbing the $socpe.$parent ladder and will call this method.
         */
        $scope.callFromChildCtrl = function(baseData) {
            // update these datas.
            $scope.otherData.marketsEnabled = baseData.demographics.is_use_markets;
            $scope.otherData.markets = baseData.demographics.markets;
            $scope.otherData.sourcesEnabled = baseData.demographics.is_use_sources;
            $scope.otherData.sources = baseData.demographics.sources;
            $scope.otherData.originsEnabled = baseData.demographics.is_use_origins;
            $scope.otherData.origins = baseData.demographics.origins;
            $scope.otherData.reservationTypes = baseData.demographics.reservationTypes;
            // call this. no sure how we can pass date from here
            //
            $scope.otherData.segmentsEnabled = baseData.demographics.is_use_segments;
            $scope.otherData.segments = baseData.demographics.segments;
        };

        var openRateAdjustmentPopup = function(room, index, lastReason) {
            var popUpData = JSON.stringify({
                room: room,
                index: index,
                lastReason: lastReason
            });

            ngDialog.open({
                template: '/assets/partials/reservation/rvEditRates.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                controller: 'RVEditRatesCtrl',
                closeByEscape: false,
                data: popUpData
            });
        };

        /**
         * success callback of fetch last rate adjustment reason
         * @return undefined
         */
        var successCallBackOffetchLastRateAdjustReason = function(data, successcallbackParams) {
            var room = successcallbackParams.room,
                index = successcallbackParams.index,
                reason = data.reason;
            openRateAdjustmentPopup(room, index, reason);
        };

        /**
         * we need to show last rate adjustment reason in the popup of rate adjustment
         * @return undefined
         */
        var fetchLastRateAdjustReason = function(room, index) {
            var params = {
                reservation_id: $scope.reservationData.reservationId
            };

            var options = {
                params: params,
                successCallBack: successCallBackOffetchLastRateAdjustReason,
                successCallBackParameters: {
                    room: room,
                    index: index
                }
            };
            $scope.callAPI(RVReservationCardSrv.getLastRateAdjustmentReason, options);
        };

        $scope.editReservationRates = function(room, index) {
            //as per CICO-14354, we need to show the last rate adjustment in comment textbox,
            //so fetching that, we will show the popup in successcallback
            fetchLastRateAdjustReason(room, index);
        };

        $scope.computeReservationDataforUpdate = function(skipPaymentData, skipConfirmationEmails, roomIndex) {
            var data = {},
                isInStayCard = ($state.current.name === "rover.reservation.staycard.reservationcard.reservationdetails"),
                shouldWeIncludeRoomTypeArray = !isInStayCard && !$scope.reservationData.isHourly && typeof roomIndex === 'undefined';

            data.is_hourly = $scope.reservationData.isHourly;
            data.arrival_date = $scope.reservationData.arrivalDate;
            data.arrival_time = '';
            data.is_reinstate = $scope.viewState.identifier === "REINSTATE";
            //Check if the check-in time is set by the user. If yes, format it to the 24hr format and build the API data.
            if ($scope.reservationData.checkinTime.hh !== '' && $scope.reservationData.checkinTime.mm !== '' && $scope.reservationData.checkinTime.ampm !== '') {
                data.arrival_time = getTimeFormated($scope.reservationData.checkinTime.hh,
                    $scope.reservationData.checkinTime.mm,
                    $scope.reservationData.checkinTime.ampm);
            }
            data.departure_date = $scope.reservationData.departureDate;
            data.departure_time = '';
            //Check if the checkout time is set by the user. If yes, format it to the 24hr format and build the API data.
            if ($scope.reservationData.checkoutTime.hh !== '' && $scope.reservationData.checkoutTime.mm !== '' && $scope.reservationData.checkoutTime.ampm !== '') {
                data.departure_time = getTimeFormated($scope.reservationData.checkoutTime.hh,
                    $scope.reservationData.checkoutTime.mm,
                    $scope.reservationData.checkoutTime.ampm);
            }

            data.adults_count = parseInt($scope.reservationData.rooms[0].numAdults);
            data.children_count = parseInt($scope.reservationData.rooms[0].numChildren);
            data.infants_count = parseInt($scope.reservationData.rooms[0].numInfants);
            // CICO - 8320 Rate to be handled in room level
            data.room_type_id = parseInt($scope.reservationData.rooms[0].roomTypeId);
            //Guest details
            data.guest_detail = {};
            // Send null if no guest card is attached, empty string causes server internal error
            data.guest_detail.id = $scope.reservationData.guest.id === "" ? null : $scope.reservationData.guest.id;
            // New API changes
            data.guest_detail_id = data.guest_detail.id;
            data.guest_detail.first_name = $scope.reservationData.guest.firstName;
            data.guest_detail.last_name = $scope.reservationData.guest.lastName;
            data.guest_detail.email = $scope.reservationData.guest.email;

            if (!skipPaymentData) {
                data.payment_type = {};
                if ($scope.reservationData.paymentType.type.value !== null) {
                    angular.forEach($scope.reservationData.paymentMethods, function(item, index) {
                        if ($scope.reservationData.paymentType.type.value === item.value) {
                            if ($scope.reservationData.paymentType.type.value === "CC") {
                                data.payment_type.payment_method_id = $scope.reservationData.selectedPaymentId;
                            } else {
                                data.payment_type.type_id = item.id;
                            }
                        }
                    });
                    data.payment_type.expiry_date = ($scope.reservationData.paymentType.ccDetails.expYear === "" || $scope.reservationData.paymentType.ccDetails.expYear === "") ? "" : "20" + $scope.reservationData.paymentType.ccDetails.expYear + "-" +
                        $scope.reservationData.paymentType.ccDetails.expMonth + "-01";
                    data.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;
                }
            }


            // CICO-7077 Confirmation Mail to have tax details


            data.tax_details = [];
            _.each($scope.reservationData.taxDetails, function(taxDetail) {
                data.tax_details.push(taxDetail);
            });

            data.tax_total = $scope.reservationData.totalTaxAmount;

            // guest emails to which confirmation emails should send

            if (!skipConfirmationEmails) {
                data.confirmation_emails = [];
                if ($scope.otherData.isGuestPrimaryEmailChecked && $scope.reservationData.guest.email !== "") {
                    data.confirmation_emails.push($scope.reservationData.guest.email);
                }
                if ($scope.otherData.isGuestAdditionalEmailChecked && $scope.otherData.additionalEmail !== "") {
                    data.confirmation_emails.push($scope.otherData.additionalEmail);
                }
            }

            //  CICO-8320
            //  The API request payload changes
            var stay = [];
            data.room_id = [];
            _.each($scope.reservationData.rooms, function(room, currentRoomIndex) {
                var applicableRate = room.stayDates[$scope.reservationData.arrivalDate].rate.id;
                if ($scope.reservationData.rateDetails &&
                    $scope.reservationData.rateDetails[currentRoomIndex] &&
                    $scope.reservationData.rateDetails[currentRoomIndex][$scope.reservationData.arrivalDate][applicableRate] &&
                    $scope.reservationData.rateDetails[currentRoomIndex][$scope.reservationData.arrivalDate][applicableRate].applyPromotion) {
                    data.promotion_id = $scope.reservationData.rateDetails[currentRoomIndex][$scope.reservationData.arrivalDate][applicableRate].appliedPromotion.id;
                    data.promotion_status = !!_.findWhere($scope.reservationData.rateDetails[currentRoomIndex][$scope.reservationData.arrivalDate][applicableRate].restrictions, {
                        key: 'INVALID_PROMO'
                    }) ? 'OVERRIDE' : 'VALID';
                } else {
                    data.promotion_id = null;
                }
                RVReservationStateService.bookMark.lastPostedRate = room.stayDates[$scope.reservationData.arrivalDate].rate.id;
                var reservationStayDetails = [];
                if (typeof roomIndex === 'undefined' || currentRoomIndex === roomIndex) {
                    _.each(room.stayDates, function(staydata, date) {
                        reservationStayDetails.push({
                            date: date,
                            // In case of the last day, send the first day's occupancy
                            rate_id: (function() {
                                var rate = (date === $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].rate.id : staydata.rate.id;
                                // in case of custom rates (rates without IDs send them as null.... the named ids used within the UI controllers are just for tracking and arent saved)
                                return rate && rate.toString().match(/_CUSTOM_/) ? null : rate
                            })(),
                            room_type_id: room.roomTypeId,
                            room_id: room.room_id,
                            adults_count: (date === $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].guests.adults : parseInt(staydata.guests.adults),
                            children_count: (date === $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].guests.children : parseInt(staydata.guests.children),
                            infants_count: (date === $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].guests.infants : parseInt(staydata.guests.infants),
                            rate_amount: parseFloat((date === $scope.reservationData.departureDate) ? ((room.stayDates[$scope.reservationData.arrivalDate] && room.stayDates[$scope.reservationData.arrivalDate].rateDetails && room.stayDates[$scope.reservationData.arrivalDate].rateDetails.modified_amount) || 0) : ((staydata.rateDetails && staydata.rateDetails.modified_amount) || 0))

                        });
                    });
                    stay.push(reservationStayDetails);
                }

            });

            //  end of payload changes
            data.stay_dates = stay;

            data.company_id = $scope.reservationData.company.id || $scope.reservationData.group.company;
            data.travel_agent_id = $scope.reservationData.travelAgent.id || $scope.reservationData.group.travelAgent;
            data.group_id = $scope.reservationData.group.id;
            data.allotment_id = $scope.reservationData.allotment.id;

            // DEMOGRAPHICS
            var demographicsData = $scope.reservationData.demographics;
            if (typeof roomIndex !== 'undefined') {
                demographicsData = $scope.reservationData.rooms[roomIndex].demographics;
            }

            // CICO-11755
            if (typeof demographicsData !== undefined) {
                data.reservation_type_id = parseInt(demographicsData.reservationType);
                data.source_id = parseInt(demographicsData.source);
                data.market_segment_id = parseInt(demographicsData.market);
                data.booking_origin_id = parseInt(demographicsData.origin);
                data.segment_id = parseInt(demographicsData.segment);
            }

            data.confirmation_email = $scope.reservationData.guest.sendConfirmMailTo;
            data.room_id = [];
            if (shouldWeIncludeRoomTypeArray) {
                data.room_types = [];
            }
            angular.forEach($scope.reservationData.tabs, function(tab, tabIndex) {
                //addons
                var firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
                        roomTypeId: parseInt(tab.roomTypeId, 10)
                    })),
                    addonsForRoomType = [];
                if (!!RVReservationStateService.getReservationFlag('RATE_CHANGED') ||
                    !$scope.reservationData.rooms[firstIndex].is_package_exist || //is_package_exist flag is set only while editing a reservation! -- Changes for CICO-17173
                    ($scope.reservationData.rooms[firstIndex].is_package_exist && $scope.reservationData.rooms[firstIndex].addons.length === parseInt($scope.reservationData.rooms[firstIndex].package_count))) { //-- Changes for CICO-17173                    
                    if (tabIndex === $scope.reservationData.tabs.length - 1) {
                        RVReservationStateService.setReservationFlag('RATE_CHANGED', false);
                    }
                    _.each($scope.reservationData.rooms[firstIndex].addons, function(addon) {
                        //skip rate associated addons on create/update calls --> they will be taken care off by API 
                        if (!addon.is_rate_addon) {
                            addonsForRoomType.push({
                                id: addon.id,
                                quantity: addon.quantity || 1
                            });
                        }
                    });
                }
                if (shouldWeIncludeRoomTypeArray) {
                    data.room_types.push({
                        id: parseInt(tab.roomTypeId, 10),
                        num_rooms: parseInt(tab.roomCount, 10),
                        addons: addonsForRoomType
                    });
                }
            });
            angular.forEach($scope.reservationData.rooms, function(room, currentRoomIndex) {
                if (typeof roomIndex === 'undefined' || currentRoomIndex === roomIndex) {
                    data.room_id.push(room.room_id);
                }
            });

            // This senario is currently discharged for now, may be in future
            // 'is_outside_group_stay_dates' will always be sent as 'false' from server
            // data.outside_group_stay_dates = RVReservationStateService.getReservationFlag('outsideStaydatesForGroup');
            
            data.borrow_for_groups = RVReservationStateService.getReservationFlag('borrowForGroups');

            //to delete ends here
            return data;
        };

        var cancellationCharge = 0;
        var nights = false;
        var depositAmount = 0;
        $scope.creditCardTypes = [];
        $scope.paymentTypes = [];



        var promptCancel = function(penalty, nights) {
            var openCancelPopup = function() {
                var passData = {
                    "reservationId": $scope.reservationData.reservationId,
                    "details": {
                        "firstName": $scope.guestCardData.contactInfo.first_name,
                        "lastName": $scope.guestCardData.contactInfo.last_name,
                        "creditCardTypes": $scope.creditCardTypes,
                        "paymentTypes": $scope.paymentTypes
                    }
                };

                $scope.passData = passData;
                ngDialog.open({
                    template: '/assets/partials/reservationCard/rvCancelReservation.html',
                    controller: 'RVCancelReservation',
                    scope: $scope,
                    data: JSON.stringify({
                        state: 'CONFIRM',
                        cards: false,
                        penalty: penalty,
                        penaltyText: (function() {
                            if (nights) {
                                return penalty + (penalty > 1 ? " nights" : " night");
                            } else {
                                return $rootScope.currencySymbol + $filter('number')(penalty, 2);
                            }
                        })()
                    })
                });
            };

            var successCallback = function(data) {
                $scope.$emit('hideLoader');
                $scope.paymentTypes = data;
                data.forEach(function(item) {
                    if (item.name === 'CC') {
                        $scope.creditCardTypes = item.values;
                    };
                });
                openCancelPopup();
            };
            $scope.invokeApi(RVPaymentSrv.renderPaymentScreen, "", successCallback);

        };

        $scope.cancelReservation = function() {
            var checkCancellationPolicy = function() {
                var onCancellationDetailsFetchSuccess = function(data) {
                    $scope.$emit('hideLoader');

                    // Sample Response from api/reservations/:id/policies inside the results hash
                    // calculated_penalty_amount: 40



                    depositAmount = data.results.deposit_amount;
                    var isOutOfCancellationPeriod = (typeof data.results.cancellation_policy_id !== 'undefined');
                    if (isOutOfCancellationPeriod) {
                        if (data.results.penalty_type === 'day') {
                            // To get the duration of stay
                            var stayDuration = $scope.reservationData.numNights > 0 ? $scope.reservationData.numNights : 1;
                            // Make sure that the cancellation value is -lte thatn the total duration
                            cancellationCharge = stayDuration > data.results.penalty_value ? data.results.penalty_value : stayDuration;
                            nights = true;
                        } else {
                            cancellationCharge = parseFloat(data.results.calculated_penalty_amount);
                        }
                        if (parseInt(depositAmount) > 0) {
                            showDepositPopup(depositAmount, isOutOfCancellationPeriod, cancellationCharge);
                        } else {
                            promptCancel(cancellationCharge, nights);
                        };
                    } else {
                        if (parseInt(depositAmount) > 0) {
                            showDepositPopup(depositAmount, isOutOfCancellationPeriod, '');
                        } else {
                            promptCancel('', nights);
                        };
                    }
                };
                var onCancellationDetailsFetchFailure = function(error) {
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = error;
                };

                var params = {
                    id: $scope.reservationData.reservationId
                };

                $scope.invokeApi(RVReservationCardSrv.fetchCancellationPolicies, params, onCancellationDetailsFetchSuccess, onCancellationDetailsFetchFailure);
            };

            /**
             * If the reservation is within cancellation period, no action will take place.
             * If the reservation is outside of the cancellation period, a screen will display to show the cancellation rule.
             * [Cancellation period is the date and time set up in the cancellation rule]
             */

            checkCancellationPolicy();
        };

        var showDepositPopup = function(deposit, isOutOfCancellationPeriod, penalty) {
            $scope.DailogeState = {};
            $scope.DailogeState.successMessage = '';
            $scope.DailogeState.failureMessage = '';
            ngDialog.open({
                template: '/assets/partials/reservationCard/rvCancelReservationDeposits.html',
                controller: 'RVCancelReservationDepositController',
                scope: $scope,
                data: JSON.stringify({
                    state: 'CONFIRM',
                    cards: false,
                    penalty: penalty,
                    deposit: deposit,
                    depositText: (function() {
                        if (!isOutOfCancellationPeriod) {
                            return "Within Cancellation Period. Deposit of " + $rootScope.currencySymbol + $filter('number')(deposit, 2) + " is refundable.";
                        } else {
                            return "Reservation outside of cancellation period. A cancellation fee of " + $rootScope.currencySymbol + $filter('number')(penalty, 2) + " will be charged, deposit not refundable";
                        }
                    })()
                })
            });
        };

        var nextState = '';
        var nextStateParameters = '';

        this.showConfirmRoutingPopup = function(type, id) {

            ngDialog.open({
                template: '/assets/partials/reservation/alerts/rvBillingInfoConfirmPopup.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };

        this.showConflictingRoutingPopup = function(type, id) {

            ngDialog.open({
                template: '/assets/partials/reservation/alerts/rvBillingInfoConflictingPopup.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };

        this.hasTravelAgent = function() {
            hasTravelAgent = false;
            if ($scope.reservationData.travelAgent.id !== null && $scope.reservationData.travelAgent.id !== undefined) {
                hasTravelAgent = true;
            }
            return hasTravelAgent;
        };

        this.hasCompanyCard = function() {
            hasCompanyCard = false;
            if ($scope.reservationData.company.id !== null && $scope.reservationData.company.id !== undefined) {
                hasCompanyCard = true;
            }
            return hasCompanyCard;

        };

        $scope.applyRoutingToReservation = function() {
            var routingApplySuccess = function(data) {
                $scope.$emit("hideLoader");
                $scope.$broadcast('BILLINGINFOADDED');
                ngDialog.close();

                if ($scope.contractRoutingType === 'TRAVEL_AGENT' && that.hasCompanyCard() && $scope.routingInfo.company.routings_count > 0) {

                    $scope.contractRoutingType = "COMPANY";
                    that.showConfirmRoutingPopup($scope.contractRoutingType, $scope.reservationData.company.id);
                    return false;
                }
                /*
                 *Proceed with reservation creation flow
                 */
            };

            var params = {};
            params.account_id = $scope.contractRoutingType === 'TRAVEL_AGENT' ? $scope.reservationData.travelAgent.id : $scope.reservationData.company.id;
            params.reservation_ids = [];
            for (var i in $scope.reservationData.reservations) {
                params.reservation_ids.push($scope.reservationData.reservations[i].id);
            }
            $scope.invokeApi(RVReservationSummarySrv.applyDefaultRoutingToReservation, params, routingApplySuccess);

        };

        $scope.noRoutingToReservation = function() {
            ngDialog.close();

            if ($scope.contractRoutingType === 'TRAVEL_AGENT' && that.hasCompanyCard() && $scope.routingInfo.company.routings_count > 0) {

                $scope.contractRoutingType = "COMPANY";
                that.showConfirmRoutingPopup($scope.contractRoutingType, $scope.reservationData.company.id);
                return false;


            }
            /*
             *Proceed with reservation creation flow
             */
        };

        $scope.okClickedForConflictingRoutes = function() {
            ngDialog.close();
        };

        this.attachCompanyTACardRoutings = function() {
            // CICO-20161
            /**
             * In this case there does not need to be any prompt for Rate or Billing Information to copy,
             * since all primary reservation information should come from the group itself.
             */
            if (!!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id) {
                return false;
            }

            var fetchSuccessofDefaultRouting = function(data) {
                $scope.$emit("hideLoader");
                $scope.routingInfo = data;
                if (data.has_conflicting_routes) {
                    $scope.conflict_cards = [];
                    if (that.hasTravelAgent() && data.travel_agent.routings_count > 0) {
                        $scope.conflict_cards.push($scope.reservationData.travelAgent.name);
                    }
                    if (that.hasCompanyCard() && data.company.routings_count > 0) {
                        $scope.conflict_cards.push($scope.reservationData.company.name);
                    }

                    that.showConflictingRoutingPopup();

                    return false;
                }

                if (that.hasTravelAgent() && data.travel_agent.routings_count > 0) {
                    $scope.contractRoutingType = "TRAVEL_AGENT";
                    that.showConfirmRoutingPopup($scope.contractRoutingType, $scope.reservationData.travelAgent.id);
                    return false;

                }
                if (that.hasCompanyCard() && data.company.routings_count > 0) {
                    $scope.contractRoutingType = "COMPANY";
                    that.showConfirmRoutingPopup($scope.contractRoutingType, $scope.reservationData.company.id);
                    return false;

                }
            };

            if (that.hasTravelAgent() || that.hasCompanyCard()) {
                var params = {};
                params.reservation_id = $scope.reservationData.reservationId;
                params.travel_agent_id = $scope.reservationData.travelAgent.id;
                params.company_id = $scope.reservationData.company.id;
                $scope.invokeApi(RVReservationSummarySrv.fetchDefaultRoutingInfo, params, fetchSuccessofDefaultRouting);
            }
        };

        $scope.saveReservation = function(navigateTo, stateParameters, index) {
            $scope.$emit('showLoader');
            nextState = navigateTo;
            nextStateParameters = stateParameters;
            /**
             * CICO-10321
             * Move check for guest / company / ta card attached to the screen before the reservation summary screen.
             * This may either be the rooms and rates screen or the Add on screen when turned on.
             */
            if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id && !$scope.reservationData.group.id && !$scope.reservationData.allotment.id) {
                $scope.$emit('PROMPTCARD');
            } else {
                /**
                 * CICO-10321
                 * 3. Once hitting the BOOK button and cards have been attached, issue the confirmation number and move to reservation summary screen
                 * NOTE :
                 *     Exisiting implementation : Confirmation number gets generated when the submit reservation button in the summary screen is clicked
                 */

                var postData = $scope.computeReservationDataforUpdate(true, true);

                var saveSuccess = function(data) {

                    // Update reservation type
                    $rootScope.$broadcast('UPDATERESERVATIONTYPE', data.reservations[0].reservation_type_id);
                    var totalDeposit = 0;
                    //calculate sum of each reservation deposits
                    $scope.reservationsListArray = data;
                    angular.forEach(data.reservations, function(reservation, key) {

                        totalDeposit = parseFloat(totalDeposit) + parseFloat(reservation.deposit_amount);
                    });

                    $scope.reservationData.depositAmount = parseFloat(totalDeposit).toFixed(2);
                    $scope.reservationData.depositEditable = (data.allow_deposit_edit !== null && data.allow_deposit_edit) ? true : false;
                    $scope.reservationData.isValidDeposit = parseInt($scope.reservationData.depositAmount) > 0;

                    if (typeof data.reservations !== 'undefined' && data.reservations instanceof Array) {
                        $scope.reservationData.reservationIds = [];
                        angular.forEach(data.reservations, function(reservation, key) {
                            $scope.reservationData.reservationIds.push(reservation.id);
                            if (!$scope.reservationData.isHourly) {
                                $scope.reservationData.rooms[key].confirm_no = reservation.confirm_no; // For NIGHTLY the API is supposed to hand over the rooms in the same order as requested
                            } else {
                                angular.forEach($scope.reservationData.rooms, function(room, key) {
                                    if (parseInt(reservation.room_id) === parseInt(room.room_id)) {
                                        room.confirm_no = reservation.confirm_no;
                                    }
                                });
                            }
                        });
                        $scope.reservationData.reservations = data.reservations;
                        $scope.reservationData.reservationId = $scope.reservationData.reservations[0].id;
                        $scope.reservationData.confirmNum = $scope.reservationData.reservations[0].confirm_no;
                        $scope.reservationData.status = $scope.reservationData.reservations[0].status;
                        $scope.viewState.reservationStatus.number = $scope.reservationData.reservations[0].id;
                        $scope.reservationData.is_custom_text_per_reservation = $scope.reservationData.reservations[0].is_custom_text_per_reservation;
                    } else {
                        $scope.reservationData.reservationId = data.id;
                        $scope.reservationData.confirmNum = data.confirm_no;
                        $scope.reservationData.rooms[0].confirm_no = data.confirm_no;
                        $scope.reservationData.status = data.status;
                        $scope.viewState.reservationStatus.number = data.id;
                        $scope.reservationData.is_custom_text_per_reservation = data.is_custom_text_per_reservation;
                    }
                    /*
                     * TO DO:ends here
                     */

                    /*
                     * Comment out .if existing cards needed remove comments
                     */

                    $scope.successPaymentList = function(data) {
                        $scope.$emit("hideLoader");
                        $scope.cardsList = data.existing_payments;
                        angular.forEach($scope.cardsList, function(value, key) {
                            value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
                            value.card_expiry = value.expiry_date; //Same comment above
                        });
                    };

                    $scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.reservationData.reservationId, $scope.successPaymentList);

                    $scope.viewState.reservationStatus.confirm = true;
                    $scope.reservationData.is_routing_available = false;
                    // Change mode to stay card as the reservation has been made!
                    $scope.viewState.identifier = "CONFIRM";

                    $scope.reservation = {
                        reservation_card: {}
                    };

                    $scope.reservation.reservation_card.arrival_date = $scope.reservationData.arrivalDate;
                    $scope.reservation.reservation_card.departure_date = $scope.reservationData.departureDate;



                    $scope.$broadcast('PROMPTCARDENTRY');


                    $scope.$emit('hideLoader');
                    that.attachCompanyTACardRoutings();

                    if (nextState) {
                        if (!nextStateParameters) {
                            nextStateParameters = {};
                        }
                        $state.go(nextState, nextStateParameters);
                    }
                };

                var saveFailure = function(data) {
                    $scope.errorMessage = data;
                    $scope.$broadcast('FAILURE_SAVE_RESERVATION', data);
                    $scope.$emit('hideLoader');
                };

                var updateFailure = function(data) {
                    $scope.errorMessage = data;
                    $scope.$broadcast('FAILURE_UPDATE_RESERVATION', data);
                    $scope.$emit('hideLoader');
                };

                var updateSuccess = function(data) {
                    var totalDepositOnRateUpdate = 0;
                    /**
                     * CICO-10195 : While extending a hourly reservation from
                     * diary the reservationListArray would be undefined
                     * Hence.. at this point as it is enough to just update
                     * reservation.deposit_amount
                     * totalDepositOnRateUpdate for just the single reservation.
                     */

                    if ($scope.reservationsListArray) {
                        angular.forEach($scope.reservationsListArray.reservations, function(reservation, key) {
                            if ((!index && !_.isNumber(index)) || key === index) {
                                reservation.deposit_amount = data.deposit_amount;
                                totalDepositOnRateUpdate = parseFloat(totalDepositOnRateUpdate) + parseFloat(data.deposit_amount);
                            } else {
                                totalDepositOnRateUpdate = parseFloat(totalDepositOnRateUpdate) + parseFloat(reservation.deposit_amount);
                            }
                        });
                    } else {
                        totalDepositOnRateUpdate = parseFloat(data.deposit_amount);
                    }

                    $scope.reservationData.depositAmount = parseFloat(totalDepositOnRateUpdate).toFixed(2);
                    $scope.reservationData.depositEditable = (data.allow_deposit_edit !== null && data.allow_deposit_edit) ? true : false;
                    $scope.reservationData.isValidDeposit = parseInt($scope.reservationData.depositAmount) > 0;
                    $scope.reservationData.fees_details = data.fees_details;

                    $scope.$broadcast('UPDATEFEE');
                    $scope.viewState.identifier = "UPDATED";
                    $scope.reservationData.is_routing_available = data.is_routing_available;

                    $scope.reservationData.status = data.reservation_status;

                    // resetting borrowForGroups anyway
                    RVReservationStateService.setReservationFlag('borrowForGroups', false);

                    if (nextState) {
                        if (!nextStateParameters) {
                            nextStateParameters = {};
                        }
                        $state.go(nextState, nextStateParameters);
                    } else {
                        $scope.$emit('hideLoader');
                    }
                };

                if ($scope.reservationData.reservationId !== "" && $scope.reservationData.reservationId !== null && typeof $scope.reservationData.reservationId !== "undefined") {
                    if (typeof index !== 'undefined') {

                        //CICO-15795 : Fix by Shiju, UI team to review.
                        if ($scope.reservationsListArray) {
                            postData.reservationId = $scope.reservationsListArray.reservations[index].id;
                        } else {
                            postData.reservationId = $scope.reservationData.reservationId;
                        }


                        var roomId = postData.room_id[index];
                        postData.room_id = [];
                        postData.room_id.push(roomId);

                    } else {
                        postData.reservationId = $scope.reservationData.reservationId;
                    }
                    $scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, updateFailure);

                } else {
                    $scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess, saveFailure);
                }
                //CICO-16959 We use a flag to indicate if the reservation is extended outside staydate range for the group, if it is a group reservation. Resetting this flag after passing the flag to the API.
                RVReservationStateService.setReservationFlag('outsideStaydatesForGroup', false);

            }
        };

        $scope.fetchDemoGraphics = function() {

            var fetchSuccess = function(data) {
                $scope.otherData.marketsEnabled = data.demographics.is_use_markets;
                $scope.otherData.markets = data.demographics.markets;
                $scope.otherData.sourcesEnabled = data.demographics.is_use_sources;
                $scope.otherData.sources = data.demographics.sources;
                $scope.otherData.originsEnabled = data.demographics.is_use_origins;
                $scope.otherData.origins = data.demographics.origins;
                $scope.otherData.reservationTypes = data.demographics.reservationTypes;
                $scope.otherData.segmentsEnabled = data.demographics.is_use_segments;
                $scope.otherData.segments = data.demographics.segments;
                $scope.$emit('hideLoader');
            };
            var fetchFailure = function(data) {
                $scope.errorMessage = data;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(RVReservationSummarySrv.fetchInitialData, {}, fetchSuccess, fetchFailure);
        };

        $scope.resetAddons = function() {
            angular.forEach($scope.reservationData.rooms, function(room) {
                room.addons = [];
            });
        };

        $scope.computeHourlyTotalandTaxes = function() {
            $scope.reservationData.taxDetails = {
                incl: {},
                excl: {}
            }; // -- RESET existing tax info
            $scope.reservationData.totalStayCost = 0.0;
            $scope.reservationData.totalTax = 0.0;
            $scope.reservationData.totalTaxAmount = 0.0;

            _.each($scope.reservationData.rooms, function(room, roomNumber) {
                var taxes = $scope.otherData.hourlyTaxInfo[0];
                room.rateTotal = 0.0; // -- RESET
                var roomMetaData = {
                    arrival: $scope.reservationData.arrivalDate,
                    departure: $scope.reservationData.departureDate,
                    rateInfo: $scope.reservationData.rateDetails[roomNumber],
                    roomTotal: 0.0,
                    roomTax: 0.0,
                    totalTaxes: 0.0, // only exclusive
                    taxesInclusiveExclusive: 0.0, // CICO-10161 > holds both inclusive and exclusive
                    addOnCumulative: 0.0
                };

                room.amount = 0.0;
                _.each(room.stayDates, function(stayDate, date) {
                    if (date === $scope.reservationData.arrivalDate) {
                        stayDate.rateDetails.modified_amount = parseFloat(stayDate.rateDetails.modified_amount).toFixed(2);
                        if (isNaN(stayDate.rateDetails.modified_amount)) {
                            stayDate.rateDetails.modified_amount = parseFloat(stayDate.rateDetails.actual_amount).toFixed(2);
                        }
                        room.amount = parseFloat(room.amount) + parseFloat(stayDate.rateDetails.modified_amount);
                    }
                });
                room.rateTotal = room.amount;

                if (taxes) {
                    /**
                     * Calculating taxApplied just for the arrival date, as this being the case for hourly reservations.
                     */
                    processTaxInfo(RVReservationStateService.calculateTax(room.amount, taxes.tax, roomNumber, room.numAdults, room.numChildren), roomNumber, $scope.reservationData.arrivalDate);
                }

                //Calculate Addon Addition for the room
                var addOnCumulative = 0;
                $(room.addons).each(function(i, addon) {
                    //Amount_Types
                    // 1   ADULT
                    // 2   CHILD
                    // 3   PERSON
                    // 4   FLAT
                    // The Amount Type is available in the amountType object of the selected addon
                    // ("AT", addon.amountType.value)

                    //Post Types
                    // 1   STAY
                    // 2   NIGHT
                    // The Post Type is available in the postType object of the selected addon
                    // ("PT", addon.postType.value)

                    //TODO: IN CASE OF DATA ERRORS MAKE FLAT STAY AS DEFAULT

                    var baseRate = parseFloat(addon.quantity) * parseFloat(addon.price);

                    var finalRate = baseRate;

                    if (addon.postType.value === "STAY" && parseInt($scope.reservationData.numNights) > 1) {
                        var cumulativeRate = 0;
                        _.each(currentRoom.stayDates, function(stayDate, date) {
                            if (date !== $scope.reservationData.departureDate) {
                                cumulativeRate = parseFloat(cumulativeRate) + parseFloat(RVReservationStateService.getAddonAmount(
                                    addon.amountType.value,
                                    baseRate,
                                    stayDate.guests.adults, // Using EACH night's occupancy information to calculate the addon's applicable amount!
                                    stayDate.guests.children)); // cummulative sum (Not just multiplication of rate per day with the num of nights) >> Has to done at "day level" to handle the reservations with varying occupancy!
                            }
                        });
                        finalRate = cumulativeRate;
                    } else {
                        finalRate = parseFloat(RVReservationStateService.getAddonAmount(
                            addon.amountType.value,
                            baseRate,
                            room.numAdults, // Using FIRST night's occupancy information to calculate the addon's applicable amount!
                            room.numChildren));
                    }
                    addOnCumulative += parseInt(finalRate);
                    addon.effectivePrice = finalRate;
                });

                $scope.reservationData.taxInformation = {};

                angular.forEach($scope.reservationData.taxDetails.incl, function(tax) {
                    $scope.reservationData.taxInformation = angular.copy($scope.reservationData.taxDetails.incl);
                    roomMetaData.taxesInclusiveExclusive = parseFloat(roomMetaData.taxesInclusiveExclusive) + parseFloat(tax.amount);
                });

                angular.forEach($scope.reservationData.taxDetails.excl, function(tax, code) {
                    roomMetaData.totalTaxes = parseFloat(roomMetaData.totalTaxes) + parseFloat(tax.amount); // add only exclusive taxes here
                    roomMetaData.taxesInclusiveExclusive = parseFloat(roomMetaData.taxesInclusiveExclusive) + parseFloat(tax.amount);
                    if (typeof $scope.reservationData.taxInformation[code] === 'undefined') {
                        $scope.reservationData.taxInformation[code] = tax;
                    } else {
                        $scope.reservationData.taxInformation[code].amount = parseFloat($scope.reservationData.taxInformation[code].amount) + parseFloat(tax.amount);
                    }
                });

                //cumulative total of all stay costs
                $scope.reservationData.totalTaxAmount = parseFloat($scope.reservationData.totalTaxAmount) + parseFloat(roomMetaData.totalTaxes);
                $scope.reservationData.totalStayCost = parseFloat($scope.reservationData.totalStayCost) + parseFloat(room.rateTotal) + parseFloat(addOnCumulative);
                $scope.reservationData.totalTax = parseFloat($scope.reservationData.totalTax) + parseFloat(roomMetaData.taxesInclusiveExclusive);
            });
        };

        //CICO-11716
        $scope.onOccupancyChange = function(type, tabIndex) {
            var currentRoomTypeId = parseInt($scope.reservationData.tabs[tabIndex].roomTypeId, 10) || "",
                firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
                    roomTypeId: currentRoomTypeId
                })),
                lastIndex = _.lastIndexOf($scope.reservationData.rooms, _.last(_.where($scope.reservationData.rooms, {
                    roomTypeId: currentRoomTypeId
                }))),
                i;
            for (i = firstIndex; i <= lastIndex; i++) {
                $scope.reservationData.rooms[i][type] = parseInt($scope.reservationData.tabs[tabIndex][type], 10);
                if (!$scope.reservationData.isHourly) {
                    $scope.validateOccupant($scope.reservationData.rooms[i], type);
                    if (!!$scope.reservationData.rooms[i].rateId) {
                        $scope.checkOccupancyLimit(null, true, i);
                    }
                }
                $scope.updateOccupancy(i);
            }
            $scope.$broadcast('SIDE_BAR_OCCUPANCY_UPDATE');
            devlogRoomsArray();
        };

        $scope.removeTab = function(tabIndex) {

            var firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
                roomTypeId: parseInt($scope.reservationData.tabs[tabIndex].roomTypeId, 10) || ""
            }));
            var currentCount = parseInt($scope.reservationData.tabs[tabIndex].roomCount, 10);
            $scope.reservationData.tabs.splice(tabIndex, 1);
            $scope.reservationData.rooms.splice(firstIndex, currentCount);

            if ($scope.viewState.currentTab == tabIndex) {
                $scope.viewState.currentTab = 0; //In case of deleting current tab, reset to first
            };

            $scope.$broadcast('TABS_MODIFIED');
            devlogRoomsArray();
        };

        var devlogRoomsArray = function() {
            console.log({
                size: $scope.reservationData.rooms.length,
                contents: $scope.reservationData.rooms
            });
        }


        $scope.onRoomCountChange = function(tabIndex) {
            var currentCount = parseInt($scope.reservationData.tabs[tabIndex].roomCount, 10),
                currentRoomTypeId = parseInt($scope.reservationData.tabs[tabIndex].roomTypeId, 10) || "",
                firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
                    roomTypeId: currentRoomTypeId
                })),
                lastIndex = _.lastIndexOf($scope.reservationData.rooms, _.last(_.where($scope.reservationData.rooms, {
                    roomTypeId: currentRoomTypeId
                }))),
                totalCount = (lastIndex - firstIndex) + 1;
            if (totalCount < currentCount) {
                var copy,
                    i;
                for (i = 0; i < currentCount - totalCount; i++) {
                    copy = angular.copy($scope.reservationData.rooms[firstIndex]);
                    $scope.reservationData.rooms.splice(lastIndex, 0, copy);
                }
            } else {
                $scope.reservationData.rooms.splice(firstIndex, totalCount - currentCount);
            }
            $scope.$broadcast('TABS_MODIFIED');
            devlogRoomsArray();
        };

    }

]);