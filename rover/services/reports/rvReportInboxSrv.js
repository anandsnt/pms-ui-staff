angular.module('sntRover').service('RVReportsInboxSrv', [
    '$q',
    'rvBaseWebSrvV2',
    'RVReportApplyIconClass',
    'RVReportApplyFlags',
    'RVReportSetupDates',
    'RVReportParamsConst',
    'RVReportInboxFilterLabelConst',
    'RVReservationBaseSearchSrv',        
    function($q, 
        rvBaseWebSrvV2,
        applyIconClass, 
        applyFlags, 
        setupDates,
        reportParamsConst,
        reportInboxFilterLabelConst,
        RVReservationBaseSearchSrv ) {

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

        this.processFilters = function(filters) {
            let processedFilter = {},
                promises = [],
                deferred = $q.defer();



            _.each(filters, function(value, key) {
                switch(key) {
                   case reportParamsConst['FROM_DATE']:
                        reportParamsConst['TO_DATE']
                        processedFilter[reportInboxFilterLabelConst[key]] = value;
                        break;
                   case reportParamsConst['RATE_IDS']:
                        self.processRateIds(value, key, promises, processedFilter);
                }

            });

            $q.all(promises).then(function() {
                deferred.resolve(processedFilter);
            });

            return deferred.promise;

        };
        
    }
]);
