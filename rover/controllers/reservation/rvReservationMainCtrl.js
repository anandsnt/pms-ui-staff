sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'baseData', 'ngDialog', '$filter', 'RVCompanyCardSrv', 'RVReservationBaseSearchSrv', '$state', 'dateFilter', 'baseSearchData',
    function($scope, $rootScope, baseData, ngDialog, $filter, RVCompanyCardSrv, RVReservationBaseSearchSrv, $state, dateFilter, baseSearchData) {
        BaseCtrl.call(this, $scope);

        $scope.$emit("updateRoverLeftMenu", "createReservation");

        var title = $filter('translate')('RESERVATION_TITLE');
        $scope.setTitle(title);


        //setting the main header of the screen
        $scope.heading = "Reservations";

        // This is a temporary fix, has to be revisited as to why the heading is not changeable from the 
        // inner controllers
        $scope.$on("setHeading", function(e, value) {
            $scope.heading = value;
        })

        $scope.viewState = {
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
            }
        };

        var successCallbackOfCountryListFetch = function(data) {
            $scope.countries = data;
        };

        //fetching country list
        //Commenting - Another call is happening to fetch countries
        $scope.invokeApi(RVCompanyCardSrv.fetchCountryList, {}, successCallbackOfCountryListFetch);

        $scope.initReservationData = function() {
            $scope.hideSidebar = false;
            // intialize reservation object
            $scope.reservationData = {
                arrivalDate: '',
                departureDate: '',
                midStay: false, // Flag to check in edit mode if in the middle of stay
                stayDays: [],
                checkinTime: {
                    hh: '',
                    mm: '00',
                    ampm: 'AM'
                },
                checkoutTime: {
                    hh: '',
                    mm: '00',
                    ampm: 'AM'
                },
                numNights: 1, // computed value, ensure to keep it updated
                roomCount: 1, // Hard coded for now,
                rooms: [{
                    numAdults: 1,
                    numChildren: 0,
                    numInfants: 0,
                    roomTypeId: '',
                    roomTypeName: '',
                    rateId: '',
                    rateName: '',
                    rateAvg: 0,
                    rateTotal: 0,
                    addons: [],
                    stayDates: {},
                    taxes: {
                        taxTotal: 0,
                        taxDetails: [{
                            tax_id: '',
                            tax_amount: '',
                            tax_desc: ''
                        }]
                    }
                }],
                totalTaxAmount: 0,
                totalStayCost: 0,
                guest: {
                    id: null, // if new guest, then it is null, other wise his id
                    firstName: '',
                    lastName: '',
                    email: '',
                    city: '',
                    loyaltyNumber: '',
                    sendConfirmMailTo: ''
                },
                company: {
                    id: null, // if new company, then it is null, other wise his id
                    name: '',
                    corporateid: '', // Add different fields for company as in story
                },
                travelAgent: {
                    id: null, // if new , then it is null, other wise his id
                    name: '',
                    iataNumber: '', // Add different fields for travelAgent as in story
                },
                paymentType: {
                    type: {},
                    ccDetails: { //optional - only if credit card selected
                        number: '',
                        expMonth: '',
                        expYear: '',
                        nameOnCard: ''
                    }
                },
                demographics: {
                    market: '',
                    source: '',
                    reservationType: '',
                    origin: ''
                },
                promotion: {
                    promotionCode: '',
                    promotionType: ''
                },
                status: '', //reservation status
                reservationId: '',
                confirmNum: '',
                isSameCard: false, // Set flag to retain the card details,
                rateDetails: [] // This array would hold the configuration information of rates selected for each room
            }

            $scope.searchData = {
                guestCard: {
                    guestFirstName: "",
                    guestLastName: "",
                    guestCity: "",
                    guestLoyaltyNumber: ""
                },
                companyCard: {
                    companyName: "",
                    companyCity: "",
                    companyCorpId: ""
                },
                travelAgentCard: {
                    travelAgentName: "",
                    travelAgentCity: "",
                    travelAgentIATA: ""
                }
            }
            // default max value if max_adults, max_children, max_infants is not configured
            var defaultMaxvalue = 5;
            var guestMaxSettings = baseSearchData.settings.max_guests;
            $scope.otherData = {
                taxesMeta: [],
                markets: baseData.demographics.markets,
                sources: baseData.demographics.sources,
                origins: baseData.demographics.origins,
                reservationTypes: baseData.demographics.reservationTypes,
                promotionTypes: [{
                    value: "v1",
                    description: "The first"
                }, {
                    value: "v2",
                    description: "The Second"
                }],
                maxAdults: (guestMaxSettings.max_adults === null || guestMaxSettings.max_adults === '') ? defaultMaxvalue : guestMaxSettings.max_adults,
                maxChildren: (guestMaxSettings.max_children === null || guestMaxSettings.max_children === '') ? defaultMaxvalue : guestMaxSettings.max_children,
                maxInfants: (guestMaxSettings.max_infants === null || guestMaxSettings.max_infants === '') ? defaultMaxvalue : guestMaxSettings.max_infants,
                roomTypes: baseSearchData.roomTypes,
                fromSearch: false,
                recommendedRateDisplay: baseSearchData.settings.recommended_rate_display,
                defaultRateDisplayName: baseSearchData.settings.default_rate_display_name,
                businessDate: baseSearchData.businessDate,
                additionalEmail: "",
                isGuestPrimaryEmailChecked: false,
                isGuestAdditionalEmailChecked: false
            };

            $scope.guestCardData = {};
            $scope.guestCardData.contactInfo = {};
            $scope.guestCardData.userId = '';

            $scope.guestCardData.contactInfo.birthday = '';

            $scope.reservationListData = {};

            $scope.reservationDetails = {
                guestCard: {
                    id: "",
                    futureReservations: 0
                },
                companyCard: {
                    id: "",
                    futureReservations: 0
                },
                travelAgent: {
                    id: "",
                    futureReservations: 0
                }
            };
        }

        $scope.initReservationDetails = function() {
            // Initiate All Cards 
            $scope.reservationDetails.guestCard.id = "";
            $scope.reservationDetails.guestCard.futureReservations = 0;
            $scope.reservationDetails.companyCard.id = "";
            $scope.reservationDetails.companyCard.futureReservations = 0;
            $scope.reservationDetails.travelAgent.id = "";
            $scope.reservationDetails.travelAgent.futureReservations = 0;
        }


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
            var rateConfigured = true;
            if (typeof $scope.reservationData.rateDetails[roomIndex] != "undefined") {
                _.each($scope.reservationData.rateDetails[roomIndex], function(d, dateIter) {
                    if (dateIter != $scope.reservationData.departureDate && $scope.reservationData.rooms[roomIndex].stayDates[dateIter].rate.id != '') {
                        var rateToday = d[$scope.reservationData.rooms[roomIndex].stayDates[dateIter].rate.id].rateBreakUp;
                        var numAdults = parseInt($scope.reservationData.rooms[roomIndex].numAdults);
                        var numChildren = parseInt($scope.reservationData.rooms[roomIndex].numChildren);

                        if (rateToday.single == null && rateToday.double == null && rateToday.extra_adult == null && rateToday.child == null) {
                            rateConfigured = false;
                        } else {
                            // Step 2: Check for the other constraints here
                            // Step 2 A : Children
                            if (numChildren > 0 && rateToday.child == null) {
                                rateConfigured = false;
                            } else if (numAdults == 1 && rateToday.single == null) { // Step 2 B: one adult - single needs to be configured
                                rateConfigured = false;
                            } else if (numAdults >= 2 && rateToday.double == null) { // Step 2 C: more than one adult - double needs to be configured
                                rateConfigured = false;
                            } else if (numAdults > 2 && rateToday.extra_adult == null) { // Step 2 D: more than two adults - need extra_adult to be configured
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
         *
         * NOTE >>> CURRENTLY HANDLES ONLY PERNIGHT TAXES
         */
        $scope.calculateTax = function(date, amount, taxes, roomIndex) {
            var taxTotal = 0.0;
            var adults = $scope.reservationData.rooms[roomIndex].stayDates[date].guests.adults;
            var children = $scope.reservationData.rooms[roomIndex].stayDates[date].guests.children;
            var nights = $scope.reservationData.numNights;
            _.each(taxes, function(tax) {
                //for every tax that is associated to the date proceed
                var taxDetails = _.where($scope.otherData.taxesMeta, {
                    id: parseInt(tax.charge_code_id)
                });
                if (taxDetails.length == 0) {
                    //Error condition! Tax code in results but not in meta data
                    console.log("Error on tax meta data");
                } else {
                    var taxData = taxDetails[0];
                    // Need not consider perstay here
                    var taxAmount = taxData.amount;
                    if (taxData.amount_sign != "+") {
                        taxData.amount = parseFloat(taxData.amount * -1.0);
                    }
                    var taxAmountType = taxData.amount_type;
                    var multiplicity = 1; // for amount_type = flat
                    if (taxAmountType == "Adult") {
                        multiplicity = adults;
                    } else if (taxAmountType == "Child") {
                        multiplicity = children;
                    } else if (taxAmountType == "Person") {
                        multiplicity = parseInt(children) + parseInt(adults);
                    }

                    /*******************************************************************************
                     *  THE TAX CALCULATION HAPPENS HERE
                     *  FOR EVERY TAX (iteration) ADD APPROPRIATELY TO TOTAL PERCENT / TOTAL DOLLAR
                     *  ONLY GOT TO DO THE PER NIGHT HERE
                     *******************************************************************************/

                    if (taxData.post_type == 'Per Night') {
                        if (taxData.amount_symbol == '%') {
                            taxTotal = parseFloat(taxTotal) + (multiplicity * (parseFloat(taxData.amount) * amount));
                        } else {
                            taxTotal = (multiplicity * parseFloat(taxData.amount)) + parseFloat(taxTotal);
                        }
                    }
                }
            });
            return taxTotal;
        }


        $scope.computeTotalStayCost = function() {
            // TODO : Loop thru all rooms
            var roomIndex = 0;
            var currentRoom = $scope.reservationData.rooms[roomIndex];

            //compute stay cost for the current room
            var adults = currentRoom.numAdults;
            var children = currentRoom.numChildren;
            var roomTotal = 0;
            var roomAvg = 0;

            _.each($scope.reservationData.rateDetails[roomIndex], function(d, date) {
                if (date != $scope.reservationData.departureDate && $scope.reservationData.rooms[roomIndex].stayDates[date].rate.id != '') {
                    var rateToday = d[$scope.reservationData.rooms[roomIndex].stayDates[date].rate.id].rateBreakUp;
                    var baseRoomRate = adults >= 2 ? rateToday.double : rateToday.single;
                    var extraAdults = adults >= 2 ? adults - 2 : 0;
                    roomTotal = roomTotal + (baseRoomRate + (extraAdults * rateToday.extra_adult) + (children * rateToday.child));
                }
            });

            currentRoom.rateTotal = roomTotal;
            currentRoom.rateAvg = roomTotal / $scope.reservationData.numNights;

            //Calculate Addon Addition for the room
            var addOnCumulative = 0;
            $(currentRoom.addons).each(function(i, addon) {
                // console.log(addon.amountType.value, addon.postType.value);
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
                        return baseRate * parseInt(parseInt(currentRoom.numAdults) + parseInt(currentRoom.numChildren));
                    } else if (addon.amountType.value == "CHILD") {
                        //TODO : Calculate the total number of occupants and multiply with base rate
                        return baseRate * parseInt(currentRoom.numChildren);
                    } else if (addon.amountType.value == "ADULT") {
                        //TODO : Calculate the total number of occupants and multiply with base rate
                        return baseRate * parseInt(currentRoom.numAdults);
                    }
                    //fallback should happen if amount type is flat
                    return baseRate;
                })();
                if (addon.postType.value == "NIGHT") {
                    console.log("//TODO:Got to calculate based on amount type and then mutiply with nights");
                    finalRate = parseFloat(amountPerday) * parseInt($scope.reservationData.numNights);
                } else {
                    console.log("//TODO:Rate is incl of all days");
                    finalRate = amountPerday;
                }
                addOnCumulative += parseInt(finalRate);
                addon.effectivePrice = finalRate;
            });
            //TODO: Extend for multiple rooms
            $scope.reservationData.totalStayCost = parseFloat(currentRoom.rateTotal) + parseFloat(addOnCumulative);
        }


        $scope.editRoomRates = function(roomIdx) {
            // console.log($scope.reservationData.rooms[roomIdx]);
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

            $state.go('rover.reservation.staycard.mainCard.roomType', {
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
            /*
                CICO-8320 parse the reservation Details and store the data in the
                $scope.reservationData model
            */
            //status
            $scope.reservationData.status = reservationDetails.reservation_card.reservation_status;

            // id
            $scope.reservationData.confirmNum = reservationDetails.reservation_card.confirmation_num;
            $scope.reservationData.reservationId = reservationDetails.reservation_card.reservation_id;

            // stay
            var arrivalDateParts = reservationDetails.reservation_card.arrival_date.split(' ')[1].split('-');
            var departureDateParts = reservationDetails.reservation_card.departure_date.split(' ')[1].split('-');
            $scope.reservationData.arrivalDate = dateFilter(new tzIndependentDate(arrivalDateParts[2] + "-" + arrivalDateParts[0] + "-" + arrivalDateParts[1]), 'yyyy-MM-dd');
            $scope.reservationData.departureDate = dateFilter(new tzIndependentDate(departureDateParts[2] + "-" + departureDateParts[0] + "-" + departureDateParts[1]), 'yyyy-MM-dd');
            $scope.reservationData.numNights = reservationDetails.reservation_card.total_nights;

            // cards
            $scope.reservationData.company.id = $scope.reservationListData.company_id;
            $scope.reservationData.travelAgent.id = $scope.reservationListData.travel_agent_id;
            $scope.reservationData.guest.id = $scope.reservationListData.guest_details.user_id;

            // TODO : This following LOC has to change if the room number changes to an array
            // to handle multiple rooms in future
            $scope.reservationData.rooms[0].roomNumber = reservationDetails.reservation_card.room_number;
            $scope.reservationData.rooms[0].roomTypeDescription = reservationDetails.reservation_card.room_type_description;
            //cost
            $scope.reservationData.totalStayCost = reservationDetails.reservation_card.total_rate;
            /*
            reservation stay dates manipulation
            */

            $scope.reservationData.stayDays = [];
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
                if (index == 0) {
                    $scope.reservationData.rooms[0].roomTypeId = item.room_type_id;
                }

            });
            // appending departure date for UI handling since its not in API response
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

            /* CICO-6069
             *  Comments from story:
             *  We should show the first nights room type by default and the respective rate as 'Booked Rate'.
             *  If the reservation is already in house and it is midstay, it should show the current rate. Would this be possible?
             */

            // Find if midstay
            if (new tzIndependentDate($scope.reservationData.arrivalDate) < new tzIndependentDate($rootScope.businessDate)) {
                $scope.reservationData.midStay = true;
            }

        };

        $scope.$on("guestEmailChanged", function(e) {
            console.log('reached main controller');
            $scope.$broadcast('updateGuestEmail');
        });

        $scope.initReservationData();
    }
]);