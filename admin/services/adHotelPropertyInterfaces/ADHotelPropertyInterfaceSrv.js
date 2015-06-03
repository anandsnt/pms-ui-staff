admin.service('ADHotelPropertyInterfaceSrv', ['$http', '$q', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrvV2) {
        /**
         * To get configuration details
         * @return {object} list json
         */
        this.fetchList = function (params) {

            var deferred = $q.defer();
            var url = 'admin/hotel_interfaces.json';

            ADBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.activateInactivate = function(data, activate){//data needs to include id (ie. {id: 'wakeup_call'}
		var deferred = $q.defer(), url;
                if (activate){
                    url = '/admin/hotel_interfaces.json';
                } else {
                    url = 'admin/hotel_interfaces/'+data.id+'.json';
                }
                
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
        
    }]);