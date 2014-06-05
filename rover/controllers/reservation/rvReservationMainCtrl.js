sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

        // intialize reservation object
        $scope.reservationData = {
            arrivalDate: '',
            departureDate: '',
            numNights: 1, // computed value, ensure to keep it updated
            room_count: 1, // Hard coded for now,
            rooms: [{
                numAdults: 0,
                numChildren: 0,
                numInfants: 0,
                roomType: '',
                roomRate: 0,
                addOns: [], // Details will come later
                totalRate: ''
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
                market: '',
                source: '',
                reservationTypes: '', 
                origin: ''
            },
            promotion: {
                promotionCode: '',
                promotionType: ''
            }
        }

        $scope.otherdata = {
            markets: {
                id: '',
                name: ''
            },
            sources: {},
            origins: {},
            promotionTypes: {}
        }
    }
]);