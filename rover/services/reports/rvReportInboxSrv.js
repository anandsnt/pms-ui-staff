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

        this.PER_PAGE = 5;

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

        this.processGuaranteeTypes = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchGuaranteeTypes().then((guaranteeTypes) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(guaranteeTypes, 'name').join(',');
            }));
        };

        this.processMarkets = (value, key, promises, formatedFilter) => {
            let params = {
                ids: value
            };

            promises.push(RVreportsSubSrv.fetchMarkets().then((markets) => {
                formatedFilter[reportInboxFilterLabelConst[key]] = _.pluck(markets, 'name').join(',');
            }));
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
                   case reportParamsConst['INCLUDE_GUARANTEE_TYPE']:
                        self.processDepartments(value, key, promises, processedFilter);
                   case reportParamsConst['CHOOSE_MARKET']:
                        self.processMarkets(value, key, promises, processedFilter);


                }

            });

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
