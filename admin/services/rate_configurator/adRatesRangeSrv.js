admin.service('ADRatesRangeSrv', ['$q', 'ADBaseWebSrvV2',
    function ($q, ADBaseWebSrvV2) {
        /*
         * Service function to save date range
         * @params {object} data
         */

        this.postDateRange = function (dateRangeData) {

            var postData = dateRangeData.data;
            var id = dateRangeData.id;
            var deferred = $q.defer();

            var url = "/api/rates/" + id + "/rate_date_ranges";
            ADBaseWebSrvV2.postJSON(url, postData).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);