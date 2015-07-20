admin.service('ADHotelPropertyInterfaceSrv', ['$http', '$q', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrvV2) {
        /**
         * To get configuration details
         * @return {object} list json
         */
        this.fetchList = function (params) {
            var deferred = $q.defer();
            var url = 'api/hotels/guest_preferences.json';

            ADBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.activate = function(data){//data needs to include id (ie. {id: 'wakeup_call'}
		var deferred = $q.defer(), url;
                    url = '/admin/hotel_interfaces.json';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
        this.deActivate = function(data){
		var deferred = $q.defer(), url;
                    url = 'admin/hotel_interfaces/'+data.id+'.json';

		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

    }]);