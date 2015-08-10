admin.service('ADCampaignSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv',
    function ($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {

        this.fetchCampaigns = function (data) {
            var deferred = $q.defer();

            
            var url = "/api/campaigns";
            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchCampaignData = function (data) {
        	console.log("fetchCampaignData");
            var deferred = $q.defer();

            
            var url = "/api/campaigns/" + data.id;
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
            	console.log(data);
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


        this.updateCampaign = function (data) {
            var deferred = $q.defer();
            var url = "/api/campaigns/" + data.id;
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.startCampaign = function(data){
			var deferred = $q.defer();
			var url = "api/campaigns/start_campaign/";
			ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
			    deferred.resolve(data);
			}, function (data) {
			    deferred.reject(data);
			});
			return deferred.promise;

        };

        this.deleteCampaign = function(params){

        	var deferred = $q.defer();
        	var url = "/api/campaigns/"+ params.id;
        	ADBaseWebSrvV2.deleteJSON(url).then(function (data) {
        	    deferred.resolve(data);
        	}, function (data) {
        	    deferred.reject(data);
        	});
        	return deferred.promise;
        };

        this.fetchCampaignConfig = function(){
        	console.log("in servie");

        	var deferred = $q.defer();
        	
            var url = "api/campaigns/configurations";

        	ADBaseWebSrvV2.getJSON(url).then(function (data) {
        	    deferred.resolve(data);
        	}, function (data) {
        	    deferred.reject(data);
        	});
        	return deferred.promise;
        };


    }
]);
