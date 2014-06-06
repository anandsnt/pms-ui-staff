sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

    	$scope.maxNoOfAdults = 4;
    	$scope.maxNoOfChildrens = 4;
    	$scope.maxNoOfInfants = 4;
        // intialize reservation object
        $scope.reservationData = {
            arrivalDate: '2014-06-29',
            departureDate: '2014-06-30',
            numNights: 1, // computed value, ensure to keep it updated
            room_count: 1, // Hard coded for now,
            rooms: [{
                numAdults: 2,
                numChildren: 2,
                numInfants: 1,
                roomType: 'Standard Room',
                roomRate: 149,
                addOns: [], // Details will come later
                totalRate: '149'
            }],
            guest: {
                id: null, // if new guest, then it is null, other wise his id
                firstName: '',
                lastName: '',
                city: '',
                loyaltyNumber: ''
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
                type: '',	//Cash / CC / etc,
                ccDetails: {} // if required.
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