admin.service('adReportsSrv', ['$q', 'ADBaseWebSrvV2', 'adReportsFilterSrv', '$http',
    function($q, ADBaseWebSrvV2, adReportsFilterSrv, $http) {
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
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: params.url,
                data: params.payload
            }).then(function(response) {

                var data = response.data,
                    headers = response.headers,
                    hiddenAnchor = angular.element('<a/>'),
                    blob = new Blob([data]);

                hiddenAnchor.attr({
                    href: window.URL.createObjectURL(blob),
                    target: '_blank',
                    download: headers()['content-disposition'].match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]+/g, '')
                });

                // The below solution is from 
                // http://stackoverflow.com/questions/24673612/element-click-does-not-work-in-firefox-and-ie-but-works-in-chrome
                if (document.createEvent) {
                    var ev = document.createEvent("MouseEvent");

                    ev.initMouseEvent(
                        "click",
                        true /* bubble */, true /* cancelable */,
                        window, null,
                        0, 0, 0, 0, /* coordinates */
                        false, false, false, false, /* modifier keys */
                        0 /* left*/, null
                    );
                    hiddenAnchor[0].dispatchEvent(ev);
                } else {
                    hiddenAnchor[0].fireEvent("onclick");
                }

                deferred.resolve(true);
            }, function(response) {
                deferred.reject(response.errorMessage);
            });
            return deferred.promise;
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
