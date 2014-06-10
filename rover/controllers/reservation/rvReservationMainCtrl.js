sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'baseData', function ($scope, $rootScope, baseData) {

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
            rateName: 'Bed & BreakFast',
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
            firstName: '',
            lastName: '',
            email: '',
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
            market: '1',
            source: '1',
            reservationType: '8', 
            origin: '0'
        },
        promotion: {
            promotionCode: '',
            promotionType: ''
        }
    }

    $scope.otherData = {
        markets: baseData.demographics.markets,
        sources: baseData.demographics.sources,
        origins: baseData.demographics.origins,
        reservationTypes: baseData.demographics.reservationTypes,
        promotionTypes: [{value:"v1", description: "The first"}, {value:"v2", description: "The Second"}],
        maxAdults: '',
        maxChildren: '',
        maxInfants: '',
        roomTypes: []
    };

    //setting the main header of the screen
    $scope.heading = "Reservations";

}]);