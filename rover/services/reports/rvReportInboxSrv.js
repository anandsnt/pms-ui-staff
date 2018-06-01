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
    'RVReportNamesConst',
    'RVReportUtilsFac',
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
        $rootScope,
        reportNames,
        reportUtils ) {

        var self = this;

        this.PER_PAGE = 10; 


        /**
         * Fetches the list of generated reports
         * @param {Object} contain the params used in api
         * @return {Promise} promise
         */
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

        /**
         * Apply additional flags on the report which we got from the reports api
         * @param {Object} report the instance of a report
         * @return {void}
         */
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
         * Fill department names from array of ids
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

        /**
         * Fill market names from array of ids
         * @param {Array} value array of market ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.processMarkets = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchMarkets().then((markets) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(markets, 'name').join(',');
            }));
        };

        /**
         * Fill options item
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter 
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.processOptions = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['OPTIONS']]) {
                formatedFilter[reportInboxFilterLabelConst['OPTIONS']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['OPTIONS']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        /**
         * Fill display items
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter 
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.processDisplayFilter = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['DISPLAY']]) {
                formatedFilter[reportInboxFilterLabelConst['DISPLAY']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['DISPLAY']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };
        
        /**
         * Fill account(TA/CC) names
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter 
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.fillTaCCDetails = (value, key, promises, formatedFilter) => {                          
            promises.push(RVreportsSubSrv.fetchAccountsById(value).then((accountInfo) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = accountInfo.account_details.account_name;
            }));
        };

        /**
         * Fill aeging balance details
         * @param {Array} value array of values
         * @param {String} key the key to be used in the formatted filter 
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.processAgingBalance = (value, key, formatedFilter) => {
          let ageBuckets = [];

          _.each(value, (bucket) => {
            ageBuckets.push(reportInboxFilterLabelConst[bucket]);
          });

          formatedFilter[reportInboxFilterLabelConst[key]] =  ageBuckets.join(',');
            
        };        

        /**
         * Generic function to process array of values with no formatting required
         * @param {Array} value array of values
         * @param {String} key the key to be used in the formatted filter 
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.processArrayValuesWithNoFormating = (value, key, formatedFilter) => { 
          formatedFilter[reportInboxFilterLabelConst[key]] =  value.join(',');            
        };

         /**
         * Fill origin info details
         * @param {Array} value array of values
         * @param {String} key the key to be used in the formatted filter 
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.fillOriginInfo = (value, key, promises, formatedFilter) => {
            promises.push(RVreportsSubSrv.fetchOrigins().then((origins) => {
                let filteredOrigins = _.filter(origins,
                    function(origin) {
                        return _.contains(value, origin.value);
                    });

                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(filteredOrigins, 'description').join(',');
            }));
        };

        /**
         * Fill origin urls info details
         * @param {Array} value array of values
         * @param {String} key the key to be used in the formatted filter 
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object        
         * @return {void} 
         */
        this.processOriginUrls = (value, key, promises, formatedFilter) => {
            promises.push(RVreportsSubSrv.fetchURLs().then((urls) => {
                let filteredUrls = _.filter(urls,
                    function(url) {
                        return _.contains(value, url.id);
                    });

                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(filteredUrls, 'name').join(',');
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

        /**
         * Fill options with no formatting required
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillOptionsWithoutFormating = (value, key, formatedFilter) => {
            formatedFilter[reportInboxFilterLabelConst[key]] = value;
        };

        /**
         * Fill company/ta/group details
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @param {String} entityType values are GROUP/TRAVELAGENT/COMPANY
         * @return {void} 
         */
        this.fillCompanyTaGroupDetails = (value, key, promises, formatedFilter, entityType) => {
            var entityId = value.split("_")[1];           
            switch (entityType) {
                case "GROUP":
                      self.fillGroupInfo(entityId, key, promises, formatedFilter);
                      break;
                case "TRAVELAGENT":
                case "COMPANY":
                      self.fillTaCCDetails(entityId, key, promises, formatedFilter)
                      break;

            }            
        };

        /**
         * Fill checkin checkout details
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillCheckedInCheckedOut = (value, key, formatedFilter) => {
            if (!formatedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']]) {
               formatedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']] = []; 
            }            
            if (value) {               
                formatedFilter[reportInboxFilterLabelConst['CHECK IN/ CHECK OUT']].push(reportInboxFilterLabelConst[key]);
            }
        };

        /**
         * Fill show fields
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillShowFields = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['SHOW']]) {
                formatedFilter[reportInboxFilterLabelConst['SHOW']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['SHOW']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        /**
         * Fill values with no formatting required
         * @param {String} value of the option
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillValueWithoutFormating = (value, key, formatedFilter) => {
            formatedFilter[reportInboxFilterLabelConst[key]] = value;
        };

        /**
         * Fill rates types name
         * @param {Array} value array of rate type ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillRateTypes = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchRateTypes().then(function(rates) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(rates.results, value, "id"), 'name').join(',');
            }));
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

        /**
         * Fill guest/account selection
         * @param {Array} value either guest or account
         * @param {String} key the key to be used in the formatted filter        
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillGuestAccount = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']]) {
                formatedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['GUEST/ACCOUNT']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        /**
         * Fill user names from the array of ids
         * @param {Array} value array of user ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillUserInfo = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchActiveUsers().then(function(users) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(users, value, 'id'), 'full_name').join(',');
            }));
        };

        /**
         * Fill origin names from the array of ids
         * @param {Array} value array of origin ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillBookingOrigins = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchBookingOrigins().then(function(origins) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(origins, value, 'value'), 'name').join(',');
            }));
        };

        /**
         * Fill market names from the array of ids
         * @param {Array} value array of market ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillMarkets = (value, key, promises, formatedFilter) => {            

            promises.push(RVreportsSubSrv.fetchMarkets().then(function(markets) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(markets, value, 'value'), 'name').join(',');
            }));
        };

        /**
         * Fill source names from the array of ids
         * @param {Array} value array of source ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillSources = (value, key, promises, formatedFilter) => {           

            promises.push(RVreportsSubSrv.fetchSources().then(function(sources) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(sources, value, 'value'), 'name').join(',');
            }));
        };

        /**
         * Fill hold status names from the array of ids
         * @param {Array} value array of hold status ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillHoldStatuses = (value, key, promises, formatedFilter) => {           

            promises.push(RVreportsSubSrv.fetchHoldStatus().then(function(statuses) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(statuses, value, 'id'), 'name').join(',');
            }));
        };

        /**
         * Fill the group name from id
         * @param {String} value id of the group
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillGroupInfo = (value, key, promises, formatedFilter) => {           

            promises.push(RVreportsSubSrv.fetchGroupById(value).then(function(groupInfo) {
                formatedFilter[reportInboxFilterLabelConst[key]] = groupInfo.group_name;
            })); 
        };

        /**
         * Fill room type names from the array of ids
         * @param {Array} value array of room type ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillRoomTypes = (value, key, promises, formatedFilter) => { 
            let params = {
                "ids[]": value
            };          

            promises.push(RVreportsSubSrv.fetchRoomTypeList(params).then(function(roomTypes) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(roomTypes, 'name').join(',');
            }));
        };

         /**
         * Fill floor names from the array of ids
         * @param {Array} value array of floor ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillFloors = (value, key, promises, formatedFilter) => {                     

            promises.push(RVreportsSubSrv.fetchFloors().then(function(floors) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(floors, value, 'floor_number'), 'floor_number').join(',');
            }));
        };

        /**
         * Fill travel agent names from an array of ids
         * @param {Array} value array of ta ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillTravelAgentInfo = (value, key, promises, formatedFilter) => {                     
            let params = {
                "ids[]": value
            };

            promises.push(RVreportsSubSrv.fetchTravelAgents(params).then(function(travelAgents) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(travelAgents, 'account_name').join(',');
            }));
        };

        /**
         * Fill vat info
         * @param {String} value 
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillVatInfo = (value, key, formatedFilter) => {
            if(!formatedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL_AGENT']]) {
                formatedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL_AGENT']] = [];
            }

            if (value) {
             formatedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL_AGENT']].push(reportInboxFilterLabelConst[key]);
            }               
            
        };

        /**
         * Fill campaign type names from an array of ids
         * @param {Array} value array of campaign ids
         * @param {String} key the key to be used in the formatted filter
         * @param {Promises} promises array of promises
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillCampaignTypesInfo = (value, key, promises, formatedFilter) => {  

            promises.push(RVreportsSubSrv.fetchCampaignTypes().then(function(campaignTypes) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(self.filterArrayValues(campaignTypes, value, 'value'), 'name').join(',');
            }));
        };

        /**
         * Fill sort direction
         * @param {String} value sort direction
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillSortDir = (value, key, formatedFilter) => {            
            let sortDir = "ASC";

            if (!value) {
              sortDir = "DESC";              
            }

            formatedFilter[reportInboxFilterLabelConst[key]] = sortDir;   
        };

        /**
         * Fill sort field
         * @param {String} value sort field
         * @param {String} key the key to be used in the formatted filter
         * @param {Object} formatedFilter the formatted filter object
         * @return {void} 
         */
        this.fillSortField = (value, key, formatedFilter) => {            
            if (value) {
              value = value.replace(/_/g, " ");
            }

            formatedFilter[reportInboxFilterLabelConst[key]] = value;   
        };
        
        /**
         * Process filters for the given generated report
         * @param {Object} filters filter which was chosen to run the report
         * @return {void}
         */
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
                   case reportParamsConst['INCLUDE_CANCELED']:                   
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
                        self.fillOriginInfo(value, key, promises, processedFilter);
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
                        self.fillCompanyTaGroupDetails(value, key, promises, processedFilter, filters.entity_type);
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
                        self.fillVatInfo(value, key, processedFilter);
                        break
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

            if(processedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL_AGENT']]) {
              processedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL_AGENT']] = processedFilter[reportInboxFilterLabelConst['COMPANY/TRAVEL_AGENT']].join(',');  
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
                reportUtils.parseDatesInObject(report.filters.rawData);
                report.rawData = report.filters.rawData;                
                self.fillReportDates(report);
            });
            
            return generatedReports;
        };
        
    }
]);
