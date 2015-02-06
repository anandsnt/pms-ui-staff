admin.service('ADCampaignSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv',
    function ($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {
       
        this.fetchCampaigns = function (data) {
            var deferred = $q.defer();

            //var url = "/sample_json/campaign/campaigns.json";
            var url = "/api/campaigns";
            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.saveCampaign = function (data) {
            var deferred = $q.defer();
            var url = "/api/campaigns";
            ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

       
    }
]);
