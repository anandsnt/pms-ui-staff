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
    function($q, 
        rvBaseWebSrvV2,
        applyIconClass, 
        applyFlags, 
        setupDates,
        reportParamsConst,
        reportInboxFilterLabelConst,
        RVReservationBaseSearchSrv,
        RVreportsSubSrv ) {

        var self = this;

        this.PER_PAGE = 10;

        var reportInboxSampleData = [
            {
                id: 1,
                report_id: 8,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Arrival"
            },
            {
                id: 1,
                report_id: 7,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Departure"
            },
            {
                id: 1,
                report_id: 8,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Departure"
            },
            {
                id: 1,
                report_id: 7,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Arrival"
            }
        ]

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

        this.processRateIds = function( value, key, promises, formatedFilter) {
            var params = {
                //reportParamsConst['RATE_IDS']: value
                rate_ids: value
            };

            promises.push(RVReservationBaseSearchSrv.fetchRateDetailsForIds(params).then(function(rates) {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(rates, 'name').join(',');
            }));
        };

        this.processDepartments = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchDepartments().then((departments) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(departments, 'name').join(',');
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

        this.processOrigins = (value, key, promises, formatedFilter) => {
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

        this.fillAddonGroups = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchChargeNAddonGroups().then((addonGroups) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(addonGroups, 'name').join(',');
            }));
        };

        this.fillAddons = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchChargeCodes().then((chargeCodes) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(chargeCodes, 'description').join(',');
            }));
        };

        this.fillReservationStatus = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchReservationStatus().then((statuses) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(statuses, 'status').join(',');
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
                   case reportParamsConst['FROM_TIME']:
                   case reportParamsConst['TO_TIME']:
                        processedFilter[reportInboxFilterLabelConst[key]] = value;
                        break;
                   case reportParamsConst['RATE_IDS']:
                        self.processRateIds(value, key, promises, processedFilter);
                        break;
                   case reportParamsConst['ASSIGNED_DEPARTMENTS']:
                        self.processDepartments(value, key, promises, processedFilter);
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
                        self.processArrayValuesWithNoFormating(value, key, processedFilter);
                        break;
                   case reportParamsConst['ORIGIN_VALUES']:
                        self.processOrigin(value, key, promises, processedFilter);
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
                        self.fillShowFields(value, key, processedFilter);
                        break; 
                   case reportParamsConst['MIN_REVENUE']:
                   case reportParamsConst['MIN_NIGHTS']:
                        self.fillValueWithoutFormating(value, key, processedFilter);
                        break;   



                }                

            });

            if(processedFilter[reportInboxFilterLabelConst['OPTIONS']]) {
              processedFilter[reportInboxFilterLabelConst['OPTIONS']] = processedFilter[reportInboxFilterLabelConst['OPTIONS']].join(',');  
            }            

            $q.all(promises).then(function() {
                deferred.resolve(processedFilter);
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
            });
            
            return generatedReports;
        };
        
    }
]);
