sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'baseData', 'ngDialog', '$filter', 'RVCompanyCardSrv',
    function($scope, $rootScope, baseData, ngDialog, $filter, RVCompanyCardSrv) {
        BaseCtrl.call(this, $scope);

        $scope.$emit("updateRoverLeftMenu","createReservation");

        var title = $filter('translate')('RESERVATION_TITLE');
        $scope.setTitle(title);

        $scope.viewState = {
            isAddNewCard: false,
            reservationStatus: {
                confirm: false,
                number: null
            },
            pendingRemoval: {
                status: false,
                cardType: ""
            },
            identifier: "CREATION",
            lastCardSlot: {
                cardType: ""
            }
        };

        var successCallbackOfCountryListFetch = function(data) {
            $scope.countries = data;
        };

        //fetching country list
        $scope.invokeApi(RVCompanyCardSrv.fetchCountryList, {}, successCallbackOfCountryListFetch);

        $scope.initReservationData = function() {
            $scope.hideSidebar = false;

            // intialize reservation object
            $scope.reservationData = {
                arrivalDate: '',
                departureDate: '',
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
                    addons: []
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
                reservationId: '',
                confirmNum: '',
                isSameCard: false // Set flag to retain the card details
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

            $scope.otherData = {
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
                maxAdults: '',
                maxChildren: '',
                maxInfants: '',
                roomTypes: [],
                fromSearch: false,
                recommendedRateDisplay: '',
                defaultRateDisplayName: ''
            };

            $scope.guestCardData = {};

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

        //setting the main header of the screen
        $scope.heading = "Reservations";

        $scope.checkOccupancyLimit = function() {
            $scope.computeTotalStayCost();
            var roomIndex = 0;
            var activeRoom = $scope.reservationData.rooms[roomIndex].roomTypeId;
            var currOccupancy = parseInt($scope.reservationData.rooms[roomIndex].numChildren) +
                parseInt($scope.reservationData.rooms[roomIndex].numAdults);

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
        };

        $scope.computeTotalStayCost = function() {
            // TODO : Loop thru all rooms
            var currentRoom = $scope.reservationData.rooms[0];

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
        $scope.initReservationData();
    }
]);