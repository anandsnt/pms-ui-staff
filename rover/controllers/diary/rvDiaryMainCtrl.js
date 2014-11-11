sntRover.controller('rvDiaryMainCtrl', 
    ['$scope', 
    '$rootScope', 
    'ngDialog', 
    '$filter',
    'RVCompanyCardSrv',
    'rvDiaryReservationCompatSrv',
    'rvDiaryStoreSrv',
    'dateFilter',
    //'baseData',
    //'baseSearchData',
    '$state',
    //'$stateParams',
    function($scope, 
             $rootScope, 
             ngDialog, 
             $filter, 
             RVCompanyCardSrv, 
             rvDiaryReservationCompatSrv,
             rvDiaryStoreSrv,
             dateFilter,
             //baseData,
             //baseSearchData,
             $state) { //, {}
             //$stateParams) {

        BaseCtrl.call(this, $scope);

        var store = rvDiaryStoreSrv,
            resv =  rvDiaryReservationCompatSrv,
            title = $filter('translate')('RESERVATION_TITLE'),
            reservationData = resv.reservationData;

        console.log(rvDiaryReservationCompatSrv);
        console.log($state, $stateParams);
        
        //resv.set('baseData', baseData);
        //resv.set('baseSearchData', baseSearchData);

        //resv.statusData.init($stateParams.baseData, $stateParams.baseSearchData);

        $scope.setTitle(title);
        $scope.heading = "Reservations";
        $scope.hideSidebar = false;
        $scope.reservationListData = {};

        $scope.$emit("updateRoverLeftMenu", "diaryReservation");

        /*_.extend($scope.viewState, {
            isAddNewCard: false,
            pendingRemoval: {
                status: false,
                cardType: ""
            },
            identifier: "CREATION",
            lastCardSlot: {
                cardType: ""
            },
            reservationStatus: {
                confirm: false,
                number: null
            },
            searching: false
        });*/

        $scope.viewState.searching = false;

        var successCallbackOfCountryListFetch = function(data) {
            $scope.countries = data;
        };

        //fetching country list
        //Commenting - Another call is happening to fetch countries
        $scope.invokeApi(RVCompanyCardSrv.fetchCountryList, {}, successCallbackOfCountryListFetch);

        $scope.getEmptyAccountData = function() {
            return {
                "address_details": {
                    "street1": null,
                    "street2": null,
                    "street3": null,
                    "city": null,
                    "state": null,
                    "postal_code": null,
                    "country_id": null,
                    "email_address": null,
                    "phone": null
                },
                "account_details": {
                    "account_name": null,
                    "company_logo": "",
                    "account_number": null,
                    "accounts_receivable_number": null,
                    "billing_information": "Test"
                },
                "primary_contact_details": {
                    "contact_first_name": null,
                    "contact_last_name": null,
                    "contact_job_title": null,
                    "contact_phone": null,
                    "contact_email": null
                },
                "future_reservation_count": 0
            }
        }

        //CICO-7641
        var isOccupancyConfigured = function(roomIndex) {
            var rateConfigured = true,
                rateDetails = reservationData.rateDetails,
                rooms = reservationData.rooms;

            if(_.isUndefined(rateDetails[roomIndex])) {

                _.each(rateDetails[roomIndex], function(d, dateIter) {
                    if (dateIter !== reservationData.departureDate && rooms[roomIndex].stayDates[dateIter].rate.id !== '') {
                        var rateToday   = d[rooms[roomIndex].stayDates[dateIter].rate.id].rateBreakUp,
                            numAdults   = parseInt(rooms[roomIndex].stayDates[dateIter].guests.adults),
                            numChildren = parseInt(rooms[roomIndex].stayDates[dateIter].guests.children);

                        if (rateToday.single === null && 
                            rateToday.double === null && 
                            rateToday.extra_adult === null && 
                            rateToday.child === null) {
                            
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
        }

        $scope.checkOccupancyLimit = function(date) {
            var roomIndex = 0;
            if (isOccupancyConfigured(roomIndex)) {
                $scope.reservationData.rooms[roomIndex].varyingOccupancy = $scope.reservationUtils.isVaryingOccupancy(roomIndex);
                $scope.computeTotalStayCost();
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
                        if (roomId == d.id) {
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

                if (typeof activeRoom == 'undefined' || activeRoom == null || activeRoom == "" || roomPref.max == null || roomPref.max >= currOccupancy) {
                    return true;
                }
                // CICO-9575: The occupancy warning should pop up only once during the reservation process if no changes are being made to the room type.
                if (!$scope.reservationData.rooms[roomIndex].isOccupancyCheckAlerted || $scope.reservationData.rooms[roomIndex].isOccupancyCheckAlerted != activeRoom) {
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
        };

        $scope.resetRoomSelection = function(roomIndex) {
            $scope.editRoomRates(roomIndex);
            $scope.closeDialog();
        }

        /*
         * This method will return the tax details for the amount and the tax provided
         * The computation happens at day level as the rate details can be varying for each day!
         */

        $scope.calculateTax = function(date, amount, taxes, roomIndex) {
            var taxInclusiveTotal = 0.0; //Per Night Inclusive Charges
            var taxExclusiveTotal = 0.0; //Per Night Exclusive Charges
            var taxesLookUp = {};
            /* --The above two are required only for the room and rates section where we 
             *  do not display the STAY taxes
             */
            var taxInclusiveStayTotal = 0.0, //Per Stay Inclusive Charges
                taxExclusiveStayTotal = 0.0, //Per Stay Exlusive Charges
                taxDescription = [];

            var adults      = reservationData.rooms[roomIndex].stayDates[date].guests.adults,
                children    = reservationData.rooms[roomIndex].stayDates[date].guests.children,
                nights      = reservationData.numNights;

            _.each(taxes, function(tax) {
                //for every tax that is associated to the date proceed
                var isInclusive = tax.is_inclusive,
                    taxDetails = _.where($scope.otherData.taxesMeta, {
                                                        id: parseInt(tax.charge_code_id, 10)
                                                    });
                if (taxDetails.length === 0) {
                    //Error condition! Tax code in results but not in meta data
                    console.log("Error on tax meta data");
                } else {
                    var taxData = taxDetails[0];
                    // Need not consider perstay here
                    var taxAmount = taxData.amount;
                    if (taxData.amount_sign !== "+") {
                        taxData.amount = parseFloat(taxData.amount * -1.0);
                    }
                    var taxAmountType = taxData.amount_type,
                        multiplicity = 1; // for amount_type = flat

                    if (taxAmountType === "ADULT") {
                        multiplicity = adults;
                    } else if (taxAmountType === "CHILD") {
                        multiplicity = children;
                    } else if (taxAmountType === "PERSON") {
                        multiplicity = parseInt(children, 10) + parseInt(adults, 10);
                    }

                    var taxOnAmount = amount;

                    // if (!!tax.calculation_rules.length) {
                    //     _.each(tax.calculation_rules, function(tax) {
                    //         taxOnAmount = parseFloat(taxOnAmount) + parseFloat(taxesLookUp[tax]);
                    //     });
                    // }

                    /*
                     *  THE TAX CALCULATION HAPPENS HERE
                     */
                    var taxCalculated = 0;

                    if (taxData.amount_symbol === '%' && parseFloat(taxData.amount) !== 0.0) {
                        taxCalculated = parseFloat(multiplicity * (parseFloat(taxData.amount / 100) * taxOnAmount));
                    } else {
                        taxCalculated = parseFloat(multiplicity * parseFloat(taxData.amount));
                    }

                    taxesLookUp[taxData.id] = taxCalculated;

                    if (taxData.post_type === 'NIGHT') { // NIGHT tax computations
                        if (isInclusive) {
                            taxInclusiveTotal = parseFloat(taxInclusiveTotal) + parseFloat(taxCalculated);
                        } else {
                            taxExclusiveTotal = parseFloat(taxExclusiveTotal) + parseFloat(taxCalculated);
                        }
                    } else { // STAY tax computations                 
                        if (isInclusive) {
                            taxInclusiveStayTotal = parseFloat(taxInclusiveTotal) + parseFloat(taxCalculated);
                        } else {
                            taxExclusiveStayTotal = parseFloat(taxExclusiveTotal) + parseFloat(taxCalculated);
                        }
                    }

                    taxDescription.push({
                        postType: taxData.post_type,
                        isInclusive: isInclusive,
                        amount: taxCalculated,
                        id: taxData.id,
                        description: taxData.description,
                        roomIndex: roomIndex
                    });
                }
            });
            return {
                inclusive: taxInclusiveTotal,
                exclusive: taxExclusiveTotal,
                stayInclusive: taxInclusiveStayTotal,
                stayExclusive: taxExclusiveStayTotal,
                taxDescription: taxDescription
            };
        }


        $scope.computeTotalStayCost = function() {
            // TODO : Loop thru all rooms
            var roomIndex = 0,
                currentRoom = reservationData.rooms[roomIndex];

            //compute stay cost for the current room
            var adults = currentRoom.numAdults,
                children = currentRoom.numChildren,
                roomTotal = 0,
                roomTax = 0,
                roomAvg = 0,
                totalTaxes = 0,
                taxes = currentRoom.taxes,
                taxDetails = reservationData.taxDetails,
                rateDetails = reservationData.rateDetails,
                rooms = reservationData.rooms;

            taxDetails = {};

            _.each(rateDetails[roomIndex], function(d, date) {
                if ((date !== reservationData.departureDate || 
                    reservationData.numNights === 0) && 
                    rooms[roomIndex].stayDates[date].rate.id !== '') {

                    var rateToday = d[rooms[roomIndex].stayDates[date].rate.id].rateBreakUp,
                        taxes = d[rooms[roomIndex].stayDates[date].rate.id].taxes;

                    adults = parseInt(rooms[roomIndex].stayDates[date].guests.adults, 10);
                    children = parseInt(rooms[roomIndex].stayDates[date].guests.children, 10);

                    var baseRoomRate = adults >= 2 ? rateToday.double : rateToday.single,
                        extraAdults = adults >= 2 ? adults - 2 : 0,
                        roomAmount = baseRoomRate + (extraAdults * rateToday.extra_adult) + (children * rateToday.child);

                    roomTotal += roomAmount;

                    if (!!taxes && !!taxes.length) {
                        //  We get the tax details for the specific day here
                        var taxApplied = $scope.calculateTax(date, roomAmount, taxes, roomIndex);
                        //  Note: Got to add the exclusive taxes into the tax Amount thing
                        var taxAmount = 0;
                        //  Compile up the data to be shown for the tax breakup
                        //  Add up the inclusive taxes & exclusive taxes pernight
                        //  TODO: PERSTAY TAXES TO BE COMPUTED HERE [[[[[[[[PER_STAY NEEDS TO BE DONE ONLY ONCE FOR A RATE ID & TAX ID COMBO]]]]]]]]
                        _.each(taxApplied.taxDescription, function(description, index) {
                            description.rate = rooms[roomIndex].stayDates[date].rate.id;
                            if (description.postType === "NIGHT") {
                                if (_.isUndefined(taxDetails[description.id])) {
                                    taxDetails[description.id] = description;
                                } else {
                                    // add the amount here
                                    taxDetails[description.id].amount = parseFloat(taxDetails[description.id].amount) + parseFloat(description.amount);
                                }
                                taxAmount = parseFloat(taxApplied.exclusive);
                            } else { //[[[[[[ PER_STAY NEEDS TO BE DONE ONLY ONCE FOR A RATE ID & TAX ID COMBO]]]]]]
                                if (_.isUndefined(taxDetails[description.id])) {
                                    // As stated earler per_stay taxes can be taken in only for the first rateId
                                    if (_.isEmpty(taxDetails)) {
                                        taxDetails[description.id] = description;
                                    } else {
                                        //get the rateId of the first value in the $scope.reservationData.taxDetail
                                        var rateIdExisting = taxDetails[Object.keys(taxDetails)[0]].rate;
                                        if (rateIdExisting === description.rate) {
                                            taxDetails[description.id] = description;
                                        }
                                    }
                                } else {
                                    /*
                                     *   --NOTE: For the same rateId there could be different rates across the stay period.
                                     *   For the above scenario if the PERSTAY tax is say some x% of the rate,
                                     *   we would be having different rates >>> WHAT TO DO? For now sticking to the larger number
                                     *   Now, even better: Say there are multiple rateIds selected, or even for this comment's sake a single rate for the all stay dates
                                     *   but there are multiple occupancies and the taxes arent flat, but they are PER_PERSON/ PER_CHILD / PER_ADULT
                                     *   ThereAgain : for now sticking to the largest tax amount of all
                                     *   === TODO === Mail product team for a clarification on this!!!
                                     */
                                    taxDetails[description.id].amount = taxDetails[description.id].amount > description.amount ? taxDetails[description.id].amount : description.amount;
                                }
                            }

                        });
                        //  update the total Tax Amount to be shown                        
                        totalTaxes = parseFloat(totalTaxes) + parseFloat(taxAmount);
                    }
                }
            });

            // Add exclusiveStayTaxes
            var exclusiveStayTaxes = _.where(taxDetails, {
                postType: 'STAY',
                isInclusive: false
            });

            _.each(exclusiveStayTaxes, function(description, index) {
                totalTaxes = parseFloat(totalTaxes) + parseFloat(description.amount);
            })

            currentRoom.rateTotal = parseFloat(roomTotal) + parseFloat(roomTax);
            currentRoom.rateAvg = currentRoom.rateTotal / (reservationData.numNights === 0 ? 1 : reservationData.numNights);

            //Calculate Addon Addition for the room
            var addOnCumulative = 0;
            $(currentRoom.addons).each(function(i, addon) {
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
                // Function to compute the amount per day of the selected addon 
                var amountPerday = (function getAmountPerDay() {
                    //TODO: calculate rate based on the amount type
                    if (addon.amountType.value == "PERSON") {
                        // Calculate the total number of occupants and multiply with base rate
                        // Total number of occupants doesnt count the infants!
                        return baseRate * parseInt(parseInt(currentRoom.numAdults, 10) + parseInt(currentRoom.numChildren, 10), 10);
                    } else if (addon.amountType.value == "CHILD") {
                        //TODO : Calculate the total number of occupants and multiply with base rate
                        return baseRate * parseInt(currentRoom.numChildren, 10);
                    } else if (addon.amountType.value == "ADULT") {
                        //TODO : Calculate the total number of occupants and multiply with base rate
                        return baseRate * parseInt(currentRoom.numAdults, 10);
                    }
                    //fallback should happen if amount type is flat
                    return baseRate;
                })();
                if (addon.postType.value == "NIGHT") {
                    finalRate = parseFloat(amountPerday) * parseInt(reservationData.numNights, 10);
                } else {
                    finalRate = amountPerday;
                }

                //  CICO-9576 => TAXES FOR ADDONS

                /**
                 * Update finalRate for the current addon!
                 * finalRate = finalRate + taxOn(finalRate)
                 * Taxes associated with the addon will be present in addon.taxDetail array.
                 * TODO :   Try to use the existing calculateTax method available to compute the tax on the finalRate value for the addon
                 *          To find out how significant the date's value could be in affecting the tax computation.
                 *          Days will have varyiung occupancies and addons rates are calculated based on the occupancies
                 *          In case of addons with the amountType as person/child/adult we will have to consider the occupancy, in which case a varying occupancy adds to the existing confusion,
                 *          To begin with, ASSUMING that occupancy of the first day is taken into consideration for such calculation, we can pass the arrival date to the $scope.calculateTax method
                 *              so that the occupancy is considered for that day.
                 *          ALSO, current granularity of the method is per day... whereas we compute the addon stuff on the whole stay... so multiplicity in case of PER_NIGHT will have to be
                 *              taken into consideration!    [IMPORTANT]
                 */

                // we are sending the arrivaldate as in case of varying occupancies, it is ASSUMED that we go forward with the first day's occupancy
                var taxApplied = $scope.calculateTax($scope.reservationData.arrivalDate, finalRate, addon.taxDetail, roomIndex);

                // Go through the tax applied and update the calculations such that
                // When Add-on items are being added to a reservation, their respective tax should also be added to the reservation summary screen, to 
                //      a) the respective tax charge code (can be grouped with accommodation tax charge, should not be a separate line if the same tax charge code already exists)
                //      b) the total tax amount

                var taxAmount = 0;
                _.each(taxApplied.taxDescription, function(description, index) {
                    if (description.postType == "NIGHT") {
                        var nights = reservationData.numNights || 1;

                        if (_.isUndefined(taxDetails[description.id])) {
                            taxDetails[description.id] = description;
                        } else {
                            // add the amount here
                            // Note Got to multiply with the number of days as this is a per night tax
                            var nights = reservationData.numNights === 0 ? 1 : reservationData.numNights;

                            taxDetails[description.id].amount = parseFloat(taxDetails[description.id].amount) + (nights * parseFloat(description.amount));
                        }
                        taxAmount = parseFloat(nights * taxApplied.exclusive);
                    } else { //STAY
                        if (_.isUndefined(taxDetails[description.id])) {
                            taxDetails[description.id] = description;
                        } else {
                            taxDetails[description.id].amount = parseFloat(taxDetails[description.id].amount) + parseFloat(description.amount);
                        }
                        taxAmount = parseFloat(taxApplied.exclusive);
                    }
                });

                totalTaxes = parseFloat(totalTaxes) + parseFloat(taxAmount);

                //  CICO-9576

                addOnCumulative += parseInt(finalRate);
                addon.effectivePrice = finalRate;
            });


            //TODO: Extend for multiple rooms
            reservationData.totalTaxAmount = totalTaxes;
            reservationData.totalStayCost = parseFloat(currentRoom.rateTotal) + parseFloat(addOnCumulative) + parseFloat(totalTaxes);


        }


        $scope.editRoomRates = function(roomIdx) {
            //TODO: Navigate back to roomtype selection screen after resetting the current room options
            $scope.reservationData.rooms[roomIdx].roomTypeId = '';
            $scope.reservationData.rooms[roomIdx].roomTypeName = '';
            $scope.reservationData.rooms[roomIdx].rateId = '';
            $scope.reservationData.rooms[roomIdx].rateName = '';
            $scope.reservationData.demographics.market = '';
            $scope.reservationData.demographics.source = '';

            // Redo the staydates array
            for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                $scope.reservationData.rooms[roomIdx].stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')].rate = {
                    id: ''
                }
            }

            $state.go('rover.diary.reservation', {
                from_date: $scope.reservationData.arrivalDate,
                to_date: $scope.reservationData.departureDate,
                fromState: 'rover.reservation.search',
                company_id: $scope.reservationData.company.id,
                travel_agent_id: $scope.reservationData.travelAgent.id
            });
        }

        $scope.updateOccupancy = function(roomIdx) {
            for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                $scope.reservationData.rooms[roomIdx].stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')].guests = {
                    adults: parseInt($scope.reservationData.rooms[roomIdx].numAdults),
                    children: parseInt($scope.reservationData.rooms[roomIdx].numChildren),
                    infants: parseInt($scope.reservationData.rooms[roomIdx].numInfants)
                }
            }
        }

        /*
            This function is called once the stay card loads and 
            populates the $scope.reservationData object with the current reservation's data.

            This is done to enable use of the $scope.reservationData object in the subsequent screens in 
            the flow from the staycards 
        */

        $scope.populateDataModel = function(reservationDetails) {
            var reservation_card = reservationDetails.reservation_card;
            /*
                CICO-8320 parse the reservation Details and store the data in the
                $scope.reservationData model
            */
            //status
            reservationData.status = reservationDetails.reservation_card.reservation_status;

            // id
            reservationData.confirmNum      = reservation_card.confirmation_num;
            reservationData.reservationId   = reservation_card.reservation_id;

            reservationData.arrivalDate     = reservation_card.arrival_date;
            reservationData.departureDate   = reservation_card.departure_date;
            reservationData.numNights       = reservation_card.total_nights;

            /** CICO-6135
             *   TODO : Change the hard coded values to take the ones coming from the reservation_details API call
             */
            //  reservationDetails.reservation_card.departureDate ! = null
            if (reservationDetails.reservation_card.arrival_time) {
                var timeParts = reservationDetails.reservation_card.arrival_time.trim().split(" ");
                //flooring to nearest 15th as the select element's options are in 15s
                var hourMinutes = timeParts[0].split(":");

                hourMinutes[1] = (15 * Math.floor(hourMinutes[1] / 15) % 60).toString();

                $scope.reservationData.checkinTime = {
                    hh: hourMinutes[0].length == 1 ? "0" + hourMinutes[0] : hourMinutes[0],
                    mm: hourMinutes[1].length == 1 ? "0" + hourMinutes[1] : hourMinutes[1],
                    ampm: timeParts[1]
                }
            }
            // Handling late checkout
            if (reservationDetails.reservation_card.is_opted_late_checkout && 
                reservationDetails.reservation_card.late_checkout_time) {

                var timeParts = reservationDetails.reservation_card.late_checkout_time.trim().split(" "),
                    hourMinutes = timeParts[0].split(":");
                //flooring to nearest 15th as the select element's options are in 15s
                hourMinutes[1] = (15 * Math.floor(hourMinutes[1] / 15) % 60).toString();

                reservationData.checkoutTime = {
                    hh: hourMinutes[0].length == 1 ? "0" + hourMinutes[0] : hourMinutes[0],
                    mm: hourMinutes[1].length == 1 ? "0" + hourMinutes[1] : hourMinutes[1],
                    ampm: timeParts[1]
                }
            }
            //  reservationDetails.reservation_card.departureDate ! = null   
            else if (reservationDetails.reservation_card.departure_time) {
                var timeParts = reservationDetails.reservation_card.departure_time.trim().split(" "),
                    hourMinutes = timeParts[0].split(":");
                //flooring to nearest 15th as the select element's options are in 15s
                hourMinutes[1] = (15 * Math.floor(hourMinutes[1] / 15) % 60).toString();

                reservationData.checkoutTime = {
                    hh: hourMinutes[0].length == 1 ? "0" + hourMinutes[0] : hourMinutes[0],
                    mm: hourMinutes[1].length == 1 ? "0" + hourMinutes[1] : hourMinutes[1],
                    ampm: timeParts[1]
                }
            }

            // cards
            reservationData.company.id      = reservationListData.company_id;
            reservationData.travelAgent.id  = reservationListData.travel_agent_id;
            reservationData.guest.id        = reservationListData.guest_details.user_id;

            //demographics
            reservationData.demographics.reservationType = reservationDetails.reservation_card.reservation_type_id === null ? "" : reservationDetails.reservation_card.reservation_type_id;
            reservationData.demographics.market          = reservationDetails.reservation_card.market_segment_id === null ? "" : reservationDetails.reservation_card.market_segment_id;
            reservationData.demographics.source          = reservationDetails.reservation_card.source_id === null ? "" : reservationDetails.reservation_card.source_id;
            reservationData.demographics.origin          = reservationDetails.reservation_card.booking_origin_id === null ? "" : reservationDetails.reservation_card.booking_origin_id;

            // TODO : This following LOC has to change if the room number changes to an array
            // to handle multiple rooms in future
            reservationData.rooms[0].roomNumber          = reservationDetails.reservation_card.room_number;
            reservationData.rooms[0].roomTypeDescription = reservationDetails.reservation_card.room_type_description;
            //cost
            reservationData.rooms[0].rateAvg    = reservationDetails.reservation_card.avg_daily_rate;
            reservationData.rooms[0].rateTotal  = reservationDetails.reservation_card.total_rate;


            $scope.reservationData.totalStayCost = reservationDetails.reservation_card.total_rate;



            /*
            reservation stay dates manipulation
            */
            $scope.reservationData.stayDays = [];
            $scope.reservationData.rooms[0].rateId = [];

            angular.forEach(reservationDetails.reservation_card.stay_dates, function(item, index) {
                $scope.reservationData.stayDays.push({
                    date: dateFilter(new tzIndependentDate(item.date), 'yyyy-MM-dd'),
                    dayOfWeek: dateFilter(new tzIndependentDate(item.date), 'EEE'),
                    day: dateFilter(new tzIndependentDate(item.date), 'dd')
                });
                $scope.reservationData.rooms[0].stayDates[dateFilter(new tzIndependentDate(item.date), 'yyyy-MM-dd')] = {
                    guests: {
                        adults: item.adults,
                        children: item.children,
                        infants: item.infants
                    },
                    rate: {
                        id: item.rate_id
                    }
                }
                // TODO : Extend for each stay dates
                $scope.reservationData.rooms[0].rateId.push(item.rate_id);
                if (index == 0) {
                    $scope.reservationData.rooms[0].roomTypeId = item.room_type_id;
                    $scope.reservationData.rooms[0].roomTypeName = reservationDetails.reservation_card.room_type_description
                }

            });

            // appending departure date for UI handling since its not in API response IFF not a day reservation
            if (parseInt($scope.reservationData.numNights) > 0) {
                $scope.reservationData.stayDays.push({
                    date: dateFilter(new tzIndependentDate($scope.reservationData.departureDate), 'yyyy-MM-dd'),
                    dayOfWeek: dateFilter(new tzIndependentDate($scope.reservationData.departureDate), 'EEE'),
                    day: dateFilter(new tzIndependentDate($scope.reservationData.departureDate), 'dd')
                });

                $scope.reservationData.rooms[0].stayDates[dateFilter(new tzIndependentDate($scope.reservationData.departureDate), 'yyyy-MM-dd')] = {
                    guests: {
                        adults: "",
                        children: "",
                        infants: ""
                    },
                    rate: {
                        id: ""
                    }
                }
            }
            if (reservationDetails.reservation_card.payment_method_used !== "" && reservationDetails.reservation_card.payment_method_used !== null) {
                $scope.reservationData.paymentType.type.description = reservationDetails.reservation_card.payment_method_description;
                $scope.reservationData.paymentType.type.value = reservationDetails.reservation_card.payment_method_used;
            }


            /* CICO-6069
             *  Comments from story:
             *  We should show the first nights room type by default and the respective rate as 'Booked Rate'.
             *  If the reservation is already in house and it is midstay, it should show the current rate. Would this be possible?
             */
            var arrivalDateDetails = _.where(reservationDetails.reservation_card.stay_dates, {
                date: $scope.reservationData.arrivalDate
            });
            $scope.reservationData.rooms[0].numAdults = arrivalDateDetails[0].adults;
            $scope.reservationData.rooms[0].numChildren = arrivalDateDetails[0].children;
            $scope.reservationData.rooms[0].numInfants = arrivalDateDetails[0].infants;

            // Find if midstay or later
            if (new tzIndependentDate($scope.reservationData.arrivalDate) < new tzIndependentDate($rootScope.businessDate)) {
                $scope.reservationData.midStay = true;
                /**
                 * CICO-8504
                 * Initialize occupancy to the last day
                 * If midstay update it to that day's
                 *
                 */
                var lastDaydetails = _.last(reservationDetails.reservation_card.stay_dates);
                $scope.reservationData.rooms[0].numAdults = lastDaydetails.adults;
                $scope.reservationData.rooms[0].numChildren = lastDaydetails.children;
                $scope.reservationData.rooms[0].numInfants = lastDaydetails.infants;

                var currentDayDetails = _.where(reservationDetails.reservation_card.stay_dates, {
                    date: dateFilter(new tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
                });

                if (currentDayDetails.length > 0) {
                    $scope.reservationData.rooms[0].numAdults = currentDayDetails[0].adults;
                    $scope.reservationData.rooms[0].numChildren = currentDayDetails[0].children;
                    $scope.reservationData.rooms[0].numInfants = currentDayDetails[0].infants;
                }
            }
            $scope.reservationData.rooms[0].varyingOccupancy = $scope.reservationUtils.isVaryingOccupancy(0);
            if ($scope.reservationUtils.isVaryingRates(0)) {
                $scope.reservationData.rooms[0].rateName = "Multiple Rates Selected"
            } else {
                $scope.reservationData.rooms[0].rateName = reservationDetails.reservation_card.package_description;
            }
        };

        /**
         * Event handler for the left menu staydates click action
         * We should display the calendar screen
         */
        $scope.stayDatesClicked = function() {
            var fromState = $state.current.name;
            //If we are already in state for calendar/rooms&rates, 
            //then we only need to switch the vuew type to calendar
            if (fromState == 'rover.reservation.staycard.mainCard.roomType') {
                $scope.$broadcast('switchToStayDatesCalendar');
                //Switch state to display the reservation calendar
            } else {
                $state.go('rover.reservation.staycard.mainCard.roomType', {
                    from_date: $scope.reservationData.arrivalDate,
                    to_date: $scope.reservationData.departureDate,
                    view: "CALENDAR",
                    fromState: fromState,
                    company_id: $scope.reservationData.company.id,
                    travel_agent_id: $scope.reservationData.travelAgent.id
                });
            }
            $scope.$broadcast('closeSidebar');
        };

        $scope.$on("guestEmailChanged", function(e) {
            $scope.$broadcast('updateGuestEmail');
        });

        //CICO-8504 Generic method to check for varying occupancy
        $scope.reservationUtils = (function() {
            var self = this;
            self.isVaryingOccupancy = function(roomIndex) {
                var stayDates = $scope.reservationData.rooms[roomIndex].stayDates;
                // If staying for just one night then there is no chance for varying occupancy
                if ($scope.reservationData.numNights < 2) {
                    return false;
                }
                // If number of nights is more than one, then need to check across the occupancies 
                var numInitialAdults = stayDates[$scope.reservationData.arrivalDate].guests.adults;
                var numInitialChildren = stayDates[$scope.reservationData.arrivalDate].guests.children;
                var numInitialInfants = stayDates[$scope.reservationData.arrivalDate].guests.infants;

                var occupancySimilarity = _.filter(stayDates, function(stayDateInfo, date) {
                    return date != $scope.reservationData.departureDate && stayDateInfo.guests.adults == numInitialAdults && stayDateInfo.guests.children == numInitialChildren && stayDateInfo.guests.infants == numInitialInfants;
                })

                if (occupancySimilarity.length < $scope.reservationData.numNights) {
                    return true;
                } else {
                    return false;
                }
            }
            self.isVaryingRates = function(roomIndex) {
                var stayDates = $scope.reservationData.rooms[roomIndex].stayDates;
                // If staying for just one night then there is no chance for varying occupancy
                if ($scope.reservationData.numNights < 2) {
                    return false;
                }
                // If number of nights is more than one, then need to check across the occupancies 
                var arrivalRate = stayDates[$scope.reservationData.arrivalDate].rate.id;

                var similarRates = _.filter(stayDates, function(stayDateInfo, date) {
                    return date != $scope.reservationData.departureDate && stayDateInfo.rate.id == arrivalRate;
                })

                if (similarRates.length < $scope.reservationData.numNights) {
                    return true;
                } else {
                    return false;
                }
            }
            return {
                isVaryingOccupancy: self.isVaryingOccupancy,
                isVaryingRates: self.isVaryingRates
            }
        })();

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

            if (from === 'adult' && (numAdults === 0 && numChildren === 0)) {
                room.numChildren = 1;
            } else if (from === 'children' && (numChildren === 0 && numAdults === 0)) {
                room.numAdults = 1;
            }
        };

        $scope.initReservationData();

        $scope.$on('REFRESHACCORDIAN', function() {
            $scope.$broadcast('GETREFRESHACCORDIAN');
        });
    }
]);