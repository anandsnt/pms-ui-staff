sntRover
.factory('rvDiarySessionSrv', 
    ['rvDiaryUtilSrv', 'rvDiaryStoreSrv','dateFilter',
    function(rvDiaryUtilSrv, rvDiaryStoreSrv, dateFilter) {
    	var slice   = Array.prototype.slice,
    		hops    = Object.prototype.hasOwnProperty,
            define  = Object.defineProperty,
            create  = Object.create,
            session = {
                pms_model:          undefined,
                pms_details_model:  undefined,
                search_model:       undefined,
                status_model:       undefined,
                guest_card_model:   undefined,
                selection_queue:    [],
                reservationList:    create(null)
            };

        function BaseModel() {
            if(!(this instanceof BaseModel)) {
                return new BaseModel();
            }
        }
        BaseModel.prototype = {
            constructor: BaseModel,
            create: function() {
                return this();
            },
            set: function(field, data) {
                this[field] = _.extend(this[field], data);
            },
            get: function(field) {
                return this[field];
            }
        };

        function ReservationData() {
            var args = slice.call(arguments),
                preloadedData = (args.length > 0 ? args.shift() : undefined);

            if(!(this instanceof ReservationData)) {
                return new ReservationData(arguments);
            }     

            this.roomTemplate = function() {
                return {
                    stayDates: Object.create(null),

                    numAdults:   1,
                    numChildren: 0,
                    numInfants:  0,

                    roomTypeId:   undefined,
                    roomTypeName: undefined,
                    
                    rateId:    undefined,
                    rateName:  undefined,
                    rateAvg:    0,
                    rateTotal:  0,
                    
                    addons: [],

                    varyingOccupancy:        false,
                    isOccupancyCheckAlerted: false
                };
            };

            this.midStay =  false; // Flag to check in edit mode if in the middle of stay
            
            this.arrivalDate = undefined;
            this.checkinTime = {
                hh:   undefined,
                mm:   undefined,
                ampm: undefined
            };
            this.departureDate = undefined;
            this.checkoutTime = {
                hh:   undefined,
                mm:   undefined,
                ampm: undefined
            };
            this.stayDays =  []; 
            this.numNights = 1; // computed value, ensure to keep it updated
            
            this.roomCount = 0; // Hard coded for now,
            this.rooms = [];
            
            this.taxDetails = Object.create(null);
            this.totalTaxAmount = 0; //This is for ONLY exclusive taxes
            this.totalStayCost = 0;
            this.totalTax = 0; // CICO-10161 > This stores the tax inclusive and exclusive together
            
            this.guest =  {
                id :   null, // if new guest, then it is null, other wise his id
                firstName :   '',
                lastName :   '',
                email :   '',
                city :   '',
                loyaltyNumber :   '',
                sendConfirmMailTo :   ''
            };

            this.company =  {
                id: null, // if new company, then it is null, other wise his id
                name: '',
                corporateid: '' // Add different fields for company as in story
            };

            this.travelAgent =  {
                id:   null, // if new , then it is null, other wise his id
                name: '',
                iataNumber: '' // Add different fields for travelAgent as in story
            };

            this.paymentType =  {
                type: Object.create(null),
                ccDetails: { //optional - only if credit card selected
                    number: '',
                    expMonth: '',
                    expYear: '',
                    nameOnCard: ''
                }
            };

            this.demographics = {
                market: '',
                source: '',
                reservationType: '',
                origin:  ''
            };

            this.promotion =  {
                promotionCode:  '',
                promotionType:  ''
            };

            this.status =  ''; //reservation status
            this.reservationId =  '';
            this.confirmNum =  '';
            this.isSameCard =  false; // Set flag to retain the card details,
            this.rateDetails =  []; // This array would hold the configuration information of rates selected for each room
            this.isRoomRateSuppressed = false; // This variable will hold flag to check whether any of the room rates is suppressed?
            this.isHourly =  true; 

            if(preloadedData) {
                rvDiaryUtilSrv.mixin(preloadedData, this);
            }
        }

        ReservationData.prototype = create(BaseModel.prototype);
        ReservationData.prototype.constructor = ReservationData;
        ReservationData.prototype.addReservation = function(room, reservation) {
            this.rooms.push({
                stayDates: Object.create(null),

                numAdults:   1,
                numChildren: 0,
                numInfants:  0,

                roomTypeId: reservation.room_type_id,
                roomTypeName: room.room_type,
                
                rateId: reservation.rate_id,
                rateName: undefined,
                rateAvg: 0,
                rateTotal: reservation.amount,
                
                addons: [],

                varyingOccupancy: false,
                isOccupancyCheckAlerted: false
            });  

            this.roomCount = this.rooms.length;
        };
        ReservationData.prototype.syncDates = function() {
            var args = slice.call(arguments),
                details = args.pop();

            (function convertArrivalDates(arrival) {
                var comp = (new Date(arrival)).toComponents();

                this.arrivalDate = comp.date.toDateString();
                this.checkinTime = comp.time.toReservationFormat();
            }.bind(session.pms_model, details.arrival))();

            (function convertDepartureDates(departure) {
                var comp = (new Date(departure)).toComponents();

                this.departureDate = comp.date.toDateString();
                this.checkoutTime = comp.time.toReservationFormat();
            }.bind(session.pms_model, details.departure))();
        };
        /*ReservationData.prototype.syncStayDates = function() {
            this.stayDays = [];
            
            this.rooms.forEach(function(room, idx) { 
                var indDate,
                    ms          = new tzIndependentDate(this.arrivalDate),
                    end         = new tzIndependentDate(this.departureDate),
                    stay_date   = dateFilter(ms, 'yyyy-MM-dd'),
                    step        = 24 * 3600 * 1000;

                room.stayDates = [];

                for (var d = []; ms <= end; ms += step) {
                    if (idx === 0) {
                        indDate =  new tzIndependentDate(ms);

                        pms_model.stayDays.push({
                            date:       dateFilter(indDate, 'yyyy-MM-dd'),
                            dayOfWeek:  dateFilter(indDate, 'EEE'),
                            day:        dateFilter(indDate, 'dd')
                        });
                    }
                    room.stayDates[idx] = {
                        guests: {
                            adults:     +room.numAdults,
                            children:   +room.numChildren,
                            infants:    +room.numInfants
                        },
                        rate: {
                            id: undefined,
                            name: undefined
                        }
                    }
                }
            })*/
        //}      
        function SearchData() {
            var args = slice.call(arguments),
                preloadedData = (args.length > 0 ? args.shift() : undefined);

            if(!(this instanceof SearchData)) {
                return new SearchData(arguments);
            }   

            this.guestCard = {
                    guestFirstName: "",
                    guestLastName: "",
                    guestCity: "",
                    guestLoyaltyNumber: ""
                };
            this.companyCard = {
                    companyName: "",
                    companyCity: "",
                    companyCorpId: ""
                };
            this.travelAgentCard = {
                    travelAgentName: "",
                    travelAgentCity: "",
                    travelAgentIATA: ""
                };
        }

        SearchData.prototype = create(BaseModel.prototype);
        SearchData.prototype.constructor = SearchData;

        function Status() {
            if(!(this instanceof Status)) {
                return new Status();
            }
           
            // default max value if max_adults, max_children, max_infants is not configured
           this.init = function(baseSearchData, baseData) {
                var defaultMaxvalue     = 5,
                    guestMaxSettings    = baseSearchData.settings.max_guests,
                    demographics        = baseData.demographics;

                this.taxesMeta          =  [];
                this.marketsEnabled     =  demographics.is_use_markets;
                this.markets            =  demographics.markets;
                this.sourcesEnabled     =  demographics.is_use_sources;
                this.sources            =  demographics.sources;
                this.originsEnabled     =  demographics.is_use_origins;
                this.origins            =  demographics.origins;
                this.reservationTypes   =  demographics.reservationTypes;
                this.promotionTypes     = [
                {
                    value: "v1",
                    description: "The first"
                }, 
                {
                    value: "v2",
                    description: "The Second"
                }];

                this.maxAdults              =  (!guestMaxSettings.max_adults || _.isEmpty(guestMaxSettings.max_adults)) ? defaultMaxvalue  :  guestMaxSettings.max_adults;
                this.maxChildren            =  (!guestMaxSettings.max_children || _.isEmpty(guestMaxSettings.max_children)) ? defaultMaxvalue :  guestMaxSettings.max_children;
                this.maxInfants             =  (!guestMaxSettings.max_infants  || _.isEmpty(guestMaxSettings.max_infants)) ? defaultMaxvalue  :  guestMaxSettings.max_infants;
                this.roomTypes              =   baseSearchData.roomTypes;
                this.fromSearch             =   false;
                this.recommendedRateDisplay =   baseSearchData.settings.recommended_rate_display;
                this.defaultRateDisplayName =   baseSearchData.settings.default_rate_display_name;
                this.businessDate           =   baseSearchData.businessDate;
                this.additionalEmail        = '';
                this.isGuestPrimaryEmailChecked =      false;
                this.isGuestAdditionalEmailChecked =   false;
                this.reservationCreated            =   false;           
        };

        Status.prototype = create(BaseModel.prototype);
        Status.prototype.constructor = Status;

        function GuestCardData() {
            if(!(this instanceof GuestCardData)) {
                return new GuestCardData();
            }


            this.init = function(id, headerImage, contactInfo) {
                this.cardHeaderImage = undefined;
                this.contactInfo     = undefined;
                this.userId          = undefined;
            }

            this.init(  null, 
                        '/assets/avatar-trans.png', 
                        Object.create(null, { 
                            birthDay: {
                                enumerable: true,
                                writable: true,
                                value: '1969-06-09'
                            }
                        }));
        }

        GuestCardData.prototype = create(BaseModel.prototype);
        GuestCardData.prototype.constructor = GuestCardData;

        function ReservationDetails() {
            var props = function(obj) {
                return _.extend(obj, {
                    id: '',
                    futureReservations: 0
                });
            };

            if(!(this instanceof ReservationDetails)) {
                return new ReservationDetails();
            }

            props(this.guestCard);
            props(this.companyCard);
            props(this.travelAgent);
        }

        ReservationDetails.prototype = create(BaseModel.prototype);
        ReservationDetails.prototype.constructor = ReservationDetails;

        //INIT SESSION DATA STORES
        session.pms_model         = ReservationData();
        session.pms_details_model = ReservationDetails();
        session.search_model      = SearchData();
        session.status_model      = StatusData();
        session.guest_card_model  = GuestCardData();

        return {
            selectionQueue:             session.selection_queue,
            reservationData:            session.pms_model,
            reservationDetails:         session.pms_details_model,
            guestCardData:              session.guest_card_model,
            searchData:                 session.search_model,
            statusData:                 session.status_model,
            updateReservationDates:     updateReservationDates,
            updateGuestDetails:         updateGuestDetails,
            finalizeReservationData:    configureStayDates,
            reservationListData:        session.reservationList
        };
    }
} ]);
	
