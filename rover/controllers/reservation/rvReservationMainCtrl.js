sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'baseData', 'ngDialog',
    function($scope, $rootScope, baseData, ngDialog) {

        $scope.initReservationData = function() {
            // intialize reservation object
            $scope.reservationData = {
                arrivalDate: '',
                departureDate: '',
                checkinTime: {
                    hh: '',
                    mm: '',
                    ampm: ''
                },
                checkoutTime: {
                    hh: '',
                    mm: '',
                    ampm: ''
                },
                numNights: '', // computed value, ensure to keep it updated
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
                totalTaxAmount: '',
                totalStayCost: '',
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
                }
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
            }

            var roomPref = getMaxOccupancy(activeRoom);

            if (typeof activeRoom == 'undefined' || activeRoom == null || activeRoom == "" || roomPref.max >= currOccupancy) {
                return true;
            }

            ngDialog.open({
                template: '/assets/partials/reservation/alerts/occupancy.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument : false,
                closeByEscape : false,
                data: JSON.stringify({
                    roomType: roomPref.name,
                    roomMax: roomPref.max
                })
            });
            return true;
        }

        $scope.initReservationData();
    }
]);
