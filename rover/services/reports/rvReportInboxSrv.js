angular.module('sntRover').service('RVReportsInboxSrv', [
    '$q',
    'rvBaseWebSrvV2',
    'RVReportApplyIconClass',
    'RVReportApplyFlags',
    'RVReportSetupDates',
    'RVReportParamsConst',
    'RVReportInboxFilterLabelConst',
    'RVReservationBaseSearchSrv', 
    'RVreportsSubSrv', 
    '$filter',
    '$rootScope',      
    function($q, 
        rvBaseWebSrvV2,
        applyIconClass, 
        applyFlags, 
        setupDates,
        reportParamsConst,
        reportInboxFilterLabelConst,
        RVReservationBaseSearchSrv,
        RVreportsSubSrv,
        $filter,
        $rootScope ) {

        var self = this;

        this.PER_PAGE = 10;        

        this.fetchReportInbox = function(params) {
            var deferred = $q.defer(),            
               url = '/api/generated_reports';

            rvBaseWebSrvV2.getJSON(url, params)
            .then(function(data) {                
                deferred.resolve(data);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.processReports = function(report) {
            for (var i = 0, j = report.length; i < j; i++) {               

                // apply icon class based on the report name
                applyIconClass.init( report[i] );                
                
            }
        };

        /**
         * Add the from date and to date that needs to shown in report inbox summary
         * @param {Object} report generated report object
         * @return {void}
         */
        this.fillReportDates = (generatedReport) => {
            let fromDate = 'N/A',
                toDate = 'N/A',
                filters = generatedReport.filters;
            
            if (filters[reportParamsConst['FROM_DATE']]) {
                fromDate = filters[reportParamsConst['FROM_DATE']];
            } else if (filters[reportParamsConst['CANCEL_FROM_DATE']]) {
                fromDate = filters[reportParamsConst['CANCEL_FROM_DATE']];
            } else if (filters[reportParamsConst['ARRIVAL_FROM_DATE']]) {
                fromDate = filters[reportParamsConst['ARRIVAL_FROM_DATE']];
            } else if (filters[reportParamsConst['GROUP_START_DATE']]) {
                fromDate = filters[reportParamsConst['GROUP_START_DATE']];
            } else if (filters[reportParamsConst['DEPOSIT_FROM_DATE']]) {
                fromDate = filters[reportParamsConst['DEPOSIT_FROM_DATE']];
            } else if (filters[reportParamsConst['PAID_FROM_DATE']]) {
                fromDate = filters[reportParamsConst['PAID_FROM_DATE']];
            } else if (filters[reportParamsConst['CREATE_FROM_DATE']]) {
                fromDate = filters[reportParamsConst['CREATE_FROM_DATE']];
            } else if (filters[reportParamsConst['ADJUSTMENT_FROM_DATE']]) {
                fromDate = filters[reportParamsConst['ADJUSTMENT_FROM_DATE']];
            } else if (filters[reportParamsConst['SINGLE_DATE']]) {
                fromDate = filters[reportParamsConst['SINGLE_DATE']];
            }


            if (filters[reportParamsConst['TO_DATE']]) {
                toDate = filters[reportParamsConst['TO_DATE']];
            } else if (filters[reportParamsConst['CANCEL_TO_DATE']]) {
                toDate = filters[reportParamsConst['CANCEL_TO_DATE']];
            } else if (filters[reportParamsConst['ARRIVAL_TO_DATE']]) {
                toDate = filters[reportParamsConst['ARRIVAL_TO_DATE']];
            } else if (filters[reportParamsConst['GROUP_END_DATE']]) {
                toDate = filters[reportParamsConst['GROUP_END_DATE']];
            } else if (filters[reportParamsConst['DEPOSIT_TO_DATE']]) {
                toDate = filters[reportParamsConst['DEPOSIT_TO_DATE']];
            } else if (filters[reportParamsConst['PAID_TO_DATE']]) {
                toDate = filters[reportParamsConst['PAID_TO_DATE']];
            } else if (filters[reportParamsConst['CREATE_TO_DATE']]) {
                toDate = filters[reportParamsConst['CREATE_TO_DATE']];
            } else if (filters[reportParamsConst['ADJUSTMENT_TO_DATE']]) {
                toDate = filters[reportParamsConst['ADJUSTMENT_TO_DATE']];
            } else if (filters[reportParamsConst['SINGLE_DATE']]) {
                toDate = filters[reportParamsConst['SINGLE_DATE']];
            }

            generatedReport.fromDate = fromDate !== 'N/A' ? $filter('date')(tzIndependentDate(fromDate), $rootScope.dateFormat) : fromDate;
            generatedReport.toDate = toDate !== 'N/A' ? $filter('date')(tzIndependentDate(toDate), $rootScope.dateFormat) : toDate;

        };

        this.formatRequestedTimeForGeneratedReport = (generatedReport) => {
            let requestedDate = generatedReport.created_at;
        };

        /**
         * Filter values from a base array based on another array of values and the key to compare
         * @param {Array} dataArr Array of objects which should be filtered
         * @param {Array} filterArr array of values
         * @param {String} filterKey the key in the object whose values needs to be compared
         */
        this.filterArrayValues = (dataArr, filterArr, filterKey) => {
            let index = -1;
            let filteredList = _.filter(dataArr, (data) => {
                                    //return filterArr.indexOf(parseInt(data[filterKey])) !== -1; 
                                    index = _.findIndex(filterArr, (val) => {
                                                return val == data[filterKey];
                                            });
                                    return  index !== -1;                                  
                               });

            return filteredList;
        }

        /**
         * Fill rate names form array of ids
         * @param {Array} value array of rate ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */

        this.processRateIds = ( value, key, promises, formatedFilter) => {
            let params = {                
                "ids[]": value
            };

            promises.push(RVreportsSubSrv.fetchRateDetailsByIds(params).then(function(rates) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(rates, 'rate_name').join(',');
            }));
        };

        /**
         * Fill department names form array of ids
         * @param {Array} value array of department ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillDepartmentNames = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchDepartments().then((departments) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(departments, value, 'value'), 'name').join(',');
            }));
        };

        // this.processGuaranteeTypes = (value, key, promises, formatedFilter) => {
        //     let params = {
        //         ids: value
        //     };

        //     promises.push(RVreportsSubSrv.fetchGuaranteeTypes().then((guaranteeTypes) => {
        //         formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(guaranteeTypes, 'name').join(',');
        //     }));
        // };

        this.processMarkets = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchMarkets().then((markets) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(markets, 'name').join(',');
            }));
        };

        this.processOptions = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['OPTIONS']]) {
                formatedFilter[reportInboxFilterLabelConst['OPTIONS']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['OPTIONS']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        this.processDisplayFilter = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['DISPLAY']]) {
                formatedFilter[reportInboxFilterLabelConst['DISPLAY']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['DISPLAY']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };
        //TODO
        this.processAccounts = (value, key, formatedFilter) => {                          
            
        };

        this.processAgingBalance = (value, key, formatedFilter) => {
          let ageBuckets = [];

          _.each(value, (bucket) => {
            ageBuckets.push(reportInboxFilterLabelConst[bucket]);
          });

          formatedFilter[reportInboxFilterLabelConst[key]] =  ageBuckets.join(',');
            
        };        

        this.processArrayValuesWithNoFormating = (value, key, formatedFilter) => { 
          formatedFilter[reportInboxFilterLabelConst[key]] =  value.join(',');            
        };

        this.fillOriginInfo = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchOrigins().then((origins) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(origins, 'value').join(',');
            }));
        };

        this.processOriginUrls = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchURLs().then((urls) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(origins, 'name').join(',');
            }));
        };

         /**
         * Fill addon group names form array of ids
         * @param {Array} value array of addon group ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillAddonGroups = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchChargeNAddonGroups().then((addonGroups) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(addonGroups, value, 'id'), 'name').join(',');
            }));
        };

        /**
         * Fill addon names form array of ids
         * @param {Array} value array of addon ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillAddons = (value, key, promises, formatedFilter) => {            
            let params = {
                addon_ids: value
            };

            promises.push(RVreportsSubSrv.fetchAddonById(params).then((addonNames) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = addonNames.join(',');
            }));
        };

        /**
         * Fill reservation status names from array of ids
         * @param {Array} value array of reservation status ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillReservationStatus = (value, key, promises, formatedFilter) => {           

            promises.push(RVreportsSubSrv.fetchReservationStatus().then((statuses) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(statuses, value, 'id'), 'status').join(',');
            }));
        };

        this.fillOptionsWithoutFormating = (value, key, formatedFilter) => {
            formatedFilter[reportInboxFilterLabelConst[key]] = value;
        };

        this.fillCompanyTaGroupDetails = (value, key, promises, formatedFilter) => {            

            // promises.push(RVreportsSubSrv.fetchComTaGrp(value).then((entity) => {
            //     formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(entity, 'status').join(',');
            // }));
        };

        this.fillCheckedInCheckedOut = (value, key, formatedFilter) => {
            if (!formatedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']]) {
               formatedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']] = []; 
            }            
            if (value) {               
                formatedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']].push(reportInboxFilterLabelConst[key]);
            }
        };

        this.fillShowFields = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['SHOW']]) {
                formatedFilter[reportInboxFilterLabelConst['SHOW']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['SHOW']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        this.fillValueWithoutFormating = (value, key, formatedFilter) => {
            formatedFilter[reportInboxFilterLabelConst[key]] = value;
        };

        // TODO use the correct APIs
        this.fillRateTypes = (value, key, promises, formatedFilter) => {
            // var params = {               
            //     rate_type_ids: value
            // };

            // promises.push(RVreportsSubSrv.fetchRateDetailsForIds(params).then(function(rates) {
            //     formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(rates, 'name').join(',');
            // }));
        };

        /**
         * Fill charge code names from the array of ids
         * @param {Array} value array of charge code ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillChargeCodes = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchChargeCodes().then(function(chargeCodes) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(chargeCodes, value, 'id'), 'description').join(',');
            }));
        };

        /**
         * Fill charge group names from the array of ids
         * @param {Array} value array of charge group ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillChargeGroups = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchChargeNAddonGroups().then(function(chargeGroups) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(chargeGroups, value, 'id'), 'description').join(',');
            }));
        };

        this.fillGuestAccount = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']]) {
                formatedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        this.fillUserInfo = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchActiveUsers().then(function(users) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(users, value, 'id'), 'full_name').join(',');
            }));
        };

        this.fillBookingOrigins = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchBookingOrigins().then(function(origins) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(origins, 'name').join(',');
            }));
        };

        this.fillMarkets = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchMarkets().then(function(markets) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(users, 'name').join(',');
            }));
        };

        this.fillSources = (value, key, promises, formatedFilter) => {           

            promises.push(RVreportsSubSrv.fetchSources().then(function(sources) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(sources, 'name').join(',');
            }));
        };

        this.fillHoldStatuses = (value, key, promises, formatedFilter) => {           

            promises.push(RVreportsSubSrv.fetchHoldStatus().then(function(statuses) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(statuses, 'name').join(',');
            }));
        };

        // TODO
        this.fillGroupInfo = (value, key, promises, formatedFilter) => {           

            
        };

        this.fillRoomTypes = (value, key, promises, formatedFilter) => { 
            let params = {
                ids: value
            };          

            promises.push(RVreportsSubSrv.fetchRoomTypeList(params).then(function(roomTypes) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(roomTypes, 'name').join(',');
            }));
        };

        this.fillFloors = (value, key, promises, formatedFilter) => {                     

            promises.push(RVreportsSubSrv.fetchFloors().then(function(floors) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(floors, 'floor_number').join(',');
            }));
        };

        this.fillTravelAgentInfo = (value, key, promises, formatedFilter) => {                     
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchTravelAgents().then(function(travelAgents) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(travelAgents, 'account_name').join(',');
            }));
        };

        this.fillVatInfo = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL AGENT']]) {
                formatedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL AGENT']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL AGENT']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        this.fillCampaignTypesInfo = (value, key, promises, formatedFilter) => {  

            promises.push(RVreportsSubSrv.fetchCampaignTypes().then(function(campaignTypes) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(campaignTypes, 'name').join(',');
            }));
        };

        this.fillSortDir = (value, key, formatedFilter) => {            
            let sortDir = "ASC";

            if (!value) {
              sortDir = "DESC";              
            }

            formatedFilter[reportInboxFilterLabelConst[key]] = sortDir;   
        };

        this.fillSortField = (value, key, formatedFilter) => {            
            if (value) {
              value = value.replace(/_/g, " ");
            }

            formatedFilter[reportInboxFilterLabelConst[key]] = value;   
        };
        


        this.processFilters = function(filters) {
            let processedFilter = {},
                promises = [],
                deferred = $q.defer();



            _.each(filters, function(value, key) {
                switch(key) {
                   case reportParamsConst['FROM_DATE']:
                   case reportParamsConst['TO_DATE']:
                   case reportParamsConst['CANCEL_FROM_DATE']:
                   case reportParamsConst['CANCEL_TO_DATE']:
                   case reportParamsConst['ARRIVAL_FROM_DATE']:
                   case reportParamsConst['ARRIVAL_TO_DATE']:
                   case reportParamsConst['GROUP_START_DATE']:
                   case reportParamsConst['GROUP_END_DATE']:
                   case reportParamsConst['DEPOSIT_FROM_DATE']:
                   case reportParamsConst['DEPOSIT_TO_DATE']:
                   case reportParamsConst['PAID_FROM_DATE']:
                   case reportParamsConst['PAID_TO_DATE']:
                   case reportParamsConst['CREATE_FROM_DATE']:
                   case reportParamsConst['CREATE_TO_DATE']:
                   case reportParamsConst['ADJUSTMENT_FROM_DATE']:
                   case reportParamsConst['ADJUSTMENT_TO_DATE']:
                   case reportParamsConst['SINGLE_DATE']:                   
                        processedFilter[reportInboxFilterLabelConst[key]] = value ? $filter('date')(tzIndependentDate(value), $rootScope.dateFormat) : value;
                        break;
                   case reportParamsConst['FROM_TIME']:
                   case reportParamsConst['TO_TIME']:
                        processedFilter[reportInboxFilterLabelConst[key]] = value;
                        break;
                   case reportParamsConst['RATE_IDS']:
                        self.processRateIds(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['ASSIGNED_DEPARTMENTS']:
                        self.fillDepartmentNames(value, key, promises, processedFilter);
                        break;                   
                   case reportParamsConst['CHOOSE_MARKET']:
                        self.processMarkets(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['DEPOSIT_DUE']:
                   case reportParamsConst['DEPOSIT_PAID']:
                   case reportParamsConst['DEPOSIT_PAST']:
                   case reportParamsConst['INCLUDE_CANCELLED']:                   
                   case reportParamsConst['INCLUDE_NO_SHOW']:
                   case reportParamsConst['INCLUDE_TAX']:
                   case reportParamsConst['DUE_IN_ARRIVALS']:  
                   case reportParamsConst['INCLUDE_ACTIONS']:  
                   case reportParamsConst['INCLUDE_LEDGER_DATA']:  
                   case reportParamsConst['INCLUDE_GUEST_NOTES']: 
                   case reportParamsConst['INCLUDE_RESERVATION_NOTES']:
                   case reportParamsConst['SHOW_GUESTS']: 
                   case reportParamsConst['VIP_ONLY']: 
                   case reportParamsConst['EXCLUDE_NON_GTD']: 
                   case reportParamsConst['RESTRICTED_POST_ONLY']:  
                   case reportParamsConst['ROVER']:  
                   case reportParamsConst['ZEST']:  
                   case reportParamsConst['ZEST_WEB']: 
                   case reportParamsConst['INCLUDE_LAST_YEAR']:  
                   case reportParamsConst['INCLUDE_VARIANCE']: 
                   case reportParamsConst['INCLUDE_BOTH']: 
                   case reportParamsConst['INCLUDE_NEW']:  
                   case reportParamsConst['SHOW_RATE_ADJUSTMENTS_ONLY']:     
                   case reportParamsConst['EXCLUDE_TAX']:   
                   case reportParamsConst['DUE_OUT_DEPARTURES']:       
                        self.processOptions(value, key, processedFilter);
                        break;
                   case reportParamsConst['SHOW_DELETED_CHARGES']:
                   case reportParamsConst['SHOW_ADJUSTMENTS']:
                   case reportParamsConst['INCLUDE_MARKET']:
                   case reportParamsConst['INCLUDE_ORIGIN']:
                   case reportParamsConst['INCLUDE_SEGMENT']:
                   case reportParamsConst['INCLUDE_SOURCE']:
                   case reportParamsConst['SHOW_ROOM_REVENUE']:
                        self.processDisplayFilter(value, key, processedFilter);
                        break;
                   case reportParamsConst['ACCOUNT_SEARCH']:
                        self.processAccounts(value, key, processedFilter);
                        break;
                   case reportParamsConst['AGING_BALANCE']:
                        self.processAgingBalance(value, key, processedFilter);
                        break;
                   case reportParamsConst['COMPLETION_STATUS']:
                   case reportParamsConst['SHOW_ACTIONABLES']:
                   case reportParamsConst['INCLUDE_GUARANTEE_TYPE']:
                   case reportParamsConst['ORIGIN_VALUES']:
                        self.processArrayValuesWithNoFormating(value, key, processedFilter);
                        break;                   
                   case reportParamsConst['ORIGIN_URLS']:
                        self.processOriginUrls(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['ADDONS_GROUPS_IDS']:
                        self.fillAddonGroups(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['ADDONS_IDS']:
                        self.fillAddons(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['RESERVATION_STATUS']:
                        self.fillReservationStatus(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['ADDON_GROUP_BY']:
                        self.fillOptionsWithoutFormating(value, key, processedFilter);
                        break; 
                   case reportParamsConst['INCLUDE_COMPANYCARD_TA_GROUP']:
                        self.fillCompanyTaGroupDetails(value, key, processedFilter);
                        break;
                   case reportParamsConst['CHECKED_IN']:
                   case reportParamsConst['CHECKED_OUT']:
                        self.fillCheckedInCheckedOut(value, key, processedFilter);
                        break;
                   case reportParamsConst['SHOW_TRAVEL_AGENT']:
                   case reportParamsConst['SHOW_COMPANY']:
                   case reportParamsConst['INCLUDE_DUE_OUT']:
                   case reportParamsConst['INCLUDE_INHOUSE']:
                   case reportParamsConst['OOO']:
                   case reportParamsConst['OOS']:
                        self.fillShowFields(value, key, processedFilter);
                        break; 
                   case reportParamsConst['MIN_REVENUE']:
                   case reportParamsConst['MIN_NIGHTS']:
                   case reportParamsConst['MIN_NO_OF_DAYS_NOT_OCCUPIED']:
                   case reportParamsConst['VAT_YEAR']:                   
                        self.fillValueWithoutFormating(value, key, processedFilter);
                        break;
                   case reportParamsConst['RATE_TYPE_IDS']:
                        self.fillRateTypes(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['CHARGE_CODE_IDS']:
                        self.fillChargeCodes(value, key, promises, processedFilter);
                        break;  
                   case reportParamsConst['CHARGE_GROUP_IDS']:
                        self.fillChargeGroups(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['ACCOUNT']:
                   case reportParamsConst['GUEST']:
                        self.fillGuestAccount(value, key, processedFilter);
                        break; 
                   case reportParamsConst['USER_IDS']:
                        self.fillUserInfo(value, key, promises, processedFilter);
                        break;  
                   case reportParamsConst['BOOKING_ORIGIN_IDS']:
                        self.fillBookingOrigins(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['MARKET_IDS']:
                        self.fillMarkets(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['SOURCE_IDS']:
                        self.fillSources(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['HOLD_STATUS_IDS']:
                        self.fillHoldStatuses(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['INCLUDE_GROUP']:
                        self.fillGroupInfo(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['ROOM_TYPE_IDS']:
                        self.fillRoomTypes(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['FLOOR']:
                        self.fillFloors(value, key, promises, processedFilter);
                        break; 
                   case reportParamsConst['TRAVEL_AGENTS']:
                        self.fillTravelAgentInfo(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['WITH_VAT_NUMBER']:
                   case reportParamsConst['WITHOUT_VAT_NUMBER']:
                        self.fillVatInfo(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['CAMPAIGN_TYPES']:
                        self.fillCampaignTypesInfo(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['SORT_DIR']:
                        self.fillSortDir(value, key, processedFilter);
                        break;
                   case reportParamsConst['SORT_FIELD']:
                        self.fillSortField(value, key, processedFilter);
                        break;

                }                

            });

            if(processedFilter[reportInboxFilterLabelConst['OPTIONS']]) {
              processedFilter[reportInboxFilterLabelConst['OPTIONS']] = processedFilter[reportInboxFilterLabelConst['OPTIONS']].join(',');  
            }

            if(processedFilter[reportInboxFilterLabelConst['SHOW']]) {
              processedFilter[reportInboxFilterLabelConst['SHOW']] = processedFilter[reportInboxFilterLabelConst['SHOW']].join(',');  
            } 

            if(processedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL AGENT']]) {
              processedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL AGENT']] = processedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL AGENT']].join(',');  
            } 

            if(processedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']]) {
              processedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']] = processedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']].join(',');  
            } 

            if(processedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']]) {
              processedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']] = processedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']].join(',');  
            } 

            if(processedFilter[reportInboxFilterLabelConst['DISPLAY']]) {
              processedFilter[reportInboxFilterLabelConst['DISPLAY']] = processedFilter[reportInboxFilterLabelConst['DISPLAY']].join(',');  
            }             
           

            $q.all(promises).then(function() {
                deferred.resolve(processedFilter);
            }, function(errorMessage) {
                deferred.reject(processedFilter);
            });

            return deferred.promise;

        };

        /**
         * Add the missing report details in the generated reports data
         * @param {Array} generatedReports holding  the list of generated reports
         * @param {Array} reportList report list master data
         * @return {Array} generatedReports processed array of generated reports
         */
        this.formatReportList = (generatedReports, reportList) => {
            let selectedReport;

            _.each(generatedReports, function(report) {
                selectedReport = _.find(reportList, {id: report.report_id});
                report.name = selectedReport.title;
                report.reportIconCls = selectedReport.reportIconCls;
                report.shouldShowExport = selectedReport.display_export_button;
                report.isExpanded = false;
                self.fillReportDates(report);
            });
            
            return generatedReports;
        };
        
    }
]);
