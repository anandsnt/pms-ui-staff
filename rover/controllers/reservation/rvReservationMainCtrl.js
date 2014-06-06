sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

    	$scope.maxNoOfAdults = 4;
    	$scope.maxNoOfChildrens = 4;
    	$scope.maxNoOfInfants = 4;
        // intialize reservation object
        $scope.reservationData = {
            arrivalDate: '2014-04-01',
            departureDate: '2014-04-02',
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

            numNights: 1, // computed value, ensure to keep it updated
            roomCount: 1, // Hard coded for now,
            rooms: [{
                numAdults: 0,
                numChildren: 0,
                numInfants: 0,
                roomType: 'Standard Room',
                rateName: 'Best Available Rate',
                rateAvg: 145,
                rateTotal: 1000,
                addOns: [
                    {
                        name: '2x Champagn and Chocolate',
                        avgAmount: 79,
                        totalAmount: 79
                    }
                ]
            }],
            totalTaxAmount: 15,
            totalStayCost: 300,
            guest: {
                id: null, // if new guest, then it is null, other wise his id
                firstName: 'Aaron',
                lastName: 'Smith',
                email: 'smith@snt.com',
                city: '',
                loyaltyNumber: '',
                sendConfirmMailTo :''
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
                market: 'v1',
                source: 'v2',
                reservationType: 'v1', 
                origin: 'v2'
            },
            promotion: {
                promotionCode: '',
                promotionType: ''
            }
        }

        $scope.listData = {
            markets: [{value:"v1", description: "The first"}, {value:"v2", description: "The Second"}],
            sources: [{value:"v1", description: "The first"}, {value:"v2", description: "The Second"}],
            origins: [{value:"v1", description: "The first"}, {value:"v2", description: "The Second"}],
            promotionTypes: [{value:"v1", description: "The first"}, {value:"v2", description: "The Second"}],
            reservationTypes: [{value:"v1", description: "The first"}, {value:"v2", description: "The Second"}]
        }
    }
]);