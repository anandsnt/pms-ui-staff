sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'baseData', 'ngDialog', '$filter',
    function($scope, $rootScope, baseData, ngDialog, $filter) {
		 	BaseCtrl.call(this, $scope);

		    var title = $filter('translate')('RESERVATION_TITLE');
			$scope.setTitle(title);


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
                confirmNum: ''
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
            fromSearch: false
        };

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

        $scope.initReservationData();
    }
]);
