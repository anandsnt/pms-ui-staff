sntRover.service('RVReservationDataService', [
	function($q, RVBaseWebSrvV2) {
		var self = this;

		self.getReservationDataModel = function() {
			return {
				isHourly: false,
				isValidDeposit: false,
				arrivalDate: '',
				departureDate: '',
				midStay: false, // Flag to check in edit mode if in the middle of stay
				stayDays: [],
				resHours: 1,
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
				taxDetails: {},
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
					varyingOccupancy: false,
					stayDates: {},
					isOccupancyCheckAlerted: false,
					demographics: {
						market: '',
						source: '',
						reservationType: '',
						origin: '',
						segment: ''
					}
				}],
				totalTaxAmount: 0, //This is for ONLY exclusive taxes
				totalStayCost: 0,
				totalTax: 0, // CICO-10161 > This stores the tax inclusive and exclusive together
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
				rateDetails: [], // This array would hold the configuration information of rates selected for each room
				isRoomRateSuppressed: false, // This variable will hold flag to check whether any of the room rates is suppressed?
				reservation_card: {},
				number_of_infants: 0,
				number_of_adults: 0,
				number_of_children: 0
			};
		}

		self.getSearchDataModel = function(){
			return {
                guestCard: {
                    guestFirstName: "",
                    guestLastName: "",
                    guestCity: "",
                    guestLoyaltyNumber: "",
                    email: ""
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
            };
		}

		self.getReservationDetailsModel = function(){
			return {
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

		self.getTimeModel = function(){
			return {
                hh: '',
                mm: '00',
                ampm: 'AM'
            };
		}

	}
]);