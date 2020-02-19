admin.service('adReportsSrv', ['$q', 'sntBaseWebSrv', 'adReportsFilterSrv',
    function($q, sntBaseWebSrv, adReportsFilterSrv) {
        var self = this;
        /* -------------------------------------------------------------------------------------------------------------- A. CONFIGURATION
                                               Reports are identified by their "KEY"
                                           ENSURE that the key of the reports stays UNIQUE
                                     The below objects (self.reports, self.filters) contain
                                                  the configuration for the reports
        NOTE:
        To add a report add an object of the following type to the self.reports array
        {
            key:  
            desc:
            canExport:
            canView:
            subTitle:
            title:
        }
        --------------------------------------------------------------------------------------------------------------*/
        var reportsList = [{
            key: "CLIENT_USAGE",
            desc: "Client Usage Report",
            canExport: true,
            canView: false,
            subTitle: "",
            title: "Client Usage"
        }, {
            key: "ENABLED_INTERFACES",
            desc: "Enabled Interface",
            canExport: true,
            canView: false,
            subTitle: "",
            title: "Enabled Interfaces Per Hotel"
        }];
        /* -------------------------------------------------------------------------------------------------------------- 
                  Filters to reports must be mapped in the below Object if prefetching is required
                                          Note: ONLY IF PREFETCHING is REQUIRED
                                i.e. The values must be available for selection from start
                      Else these can be handled in the individual report's / it's filter's controller    

        NOTE:
            The filter keys in the below map needs to be mapped to API requests in the service 'adReportsFilterSrv' if
        they are NOT already there. If, you are adding a NEW filter for a report, please implement supporting functions
        in the 'adReportsFilterSrv' Service     
        --------------------------------------------------------------------------------------------------------------*/
        var reportFiltersMap = {
            "PMS_TYPES": ["CLIENT_USAGE"],
            "HOTELS": ["CLIENT_USAGE"],
            "HOTEL_CHAINS": ["CLIENT_USAGE"]
        };

        // ------------------------------------------------------------------------------------------------------------- B. EXPOSED SERVICES
        self.fetchReportsList = function() {
            var deferred = $q.defer();

            deferred.resolve(reportsList);
            return deferred.promise;
        };

        // Pre Fetch Iniital Dependencies Reqiured to show the filters
        self.fetchFilterData = function(ReportKey) {
            var filters = _.filter(_.keys(reportFiltersMap), function(key) {
                return _.indexOf(reportFiltersMap[key], ReportKey) > -1;
            });
            var deferred = $q.defer();

            if (!self.cache.filters[ReportKey] || Date.now() > self.cache.filters[ReportKey]['expiryDate']) {
                $q.when(adReportsFilterSrv.fetchFilterData(filters), function(filters) {
                    self.cache.filters[ReportKey] = {
                        data: filters,
                        expiryDate: Date.now() + (self.cache['config'].lifeSpan * 1000)
                    };
                    deferred.resolve("success");
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve(self.cache.filters[ReportKey]['data']);
            }
            return deferred.promise;
        };

        // gets pre fetched filter data
        self.getFilterData = function(ReportKey) {
            var deferred = $q.defer();

            deferred.resolve(self.cache.filters[ReportKey].data);
            return deferred.promise;
        };

        self.exportCSV = function(params) {
            return sntBaseWebSrv.download(params.url, params.payload);
        };

        // ------------------------------------------------------------------------------------------------------------- C. CACHING

        self.cache = {
            config: {
                lifeSpan: 600 // in seconds
            },
            filters: {}
        };


    }
]);
