admin.service('adReportsSrv', ['$q', 'ADBaseWebSrvV2',
    function ($q, ADBaseWebSrvV2) {
        var self = this;

        self.fetchReportsList = function () {
            var deferred = $q.defer();
            // TODO: Replace this with the appropriate Reports Listing API
            var url = '/api/business_dates/active';
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                // TODO: Clean up this code
                data = [];
                
                data.push({
                    desc: "Client Usage Report",
                    canExport: true,
                    canView: false,
                    subTitle: "",
                    title: "Client Usage"
                });
                
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);