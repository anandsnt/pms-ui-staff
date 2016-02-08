admin.service('adReportsSrv', ['$q', 'ADBaseWebSrvV2', 'adReportsFilterSrv',
    function($q, ADBaseWebSrvV2, adReportsFilterSrv) {
        var self = this;
        /*-------------------------------------------------------------------------------------------------------------- A. CONFIGURATION
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
        }];
        /*-------------------------------------------------------------------------------------------------------------- 
                  Filters to reports must be mapped in the below Object if prefetching is required
                                          Note: ONLY IF PREFETCHING is REQUIRED
                                i.e. The values must be available for selection from start
                      Else these can be handled in the individual report's / it's filter's controller    

        NOTE:
            The filter keys in the below map needs to be mapped to API requests in the service 'adReportsFilterSrv' if
        they are NOT already there. If, you are adding a NEW filter for a report, please implement supporting functions
        in the 'adReportsFilterSrv' Service     
        --------------------------------------------------------------------------------------------------------------*/
        var selectFilters = {
            "PMS_TYPES": ["CLIENT_USAGE"],
            "HOTELS": ["CLIENT_USAGE"],
            "HOTEL_CHAINS": ["CLIENT_USAGE"]
        }

        // ------------------------------------------------------------------------------------------------------------- B. EXPOSED SERVICES
        self.fetchReportsList = function() {
            var deferred = $q.defer();
            deferred.resolve(reportsList);
            return deferred.promise;
        };

        self.fetchFilterData = function(ReportKey) {
            var filters = _.filter(_.keys(selectFilters), function(key) {
                return _.indexOf(selectFilters[key], ReportKey) > -1
            });
            var deferred = $q.defer();
            $q.when(adReportsFilterSrv.fetchFilterData(filters), function(filters) {
                self.cache.filters[ReportKey] = {
                    data: filters,
                    expiryDate: Date.now() + (self.cache['config'].lifeSpan * 1000)
                };
                deferred.resolve("success");
            }, function(error) {
                deferred.reject(error);
            })
            return deferred.promise;
        };

        self.getFilterData = function(ReportKey) {
            var deferred = $q.defer();
            deferred.resolve(self.cache.filters[ReportKey].data);
            return deferred.promise;
        }

        // ------------------------------------------------------------------------------------------------------------- C. CACHING

        self.cache = {
            config: {
                lifeSpan: 3600 //in seconds
            },
            filters: {}
        }


    }
]);