admin.service('adExternalInterfaceCommonSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', 'ADChannelMgrSrv', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2, ADChannelMgrSrv){

	var service = this;

	//-------------------------------------------------------------------------------------------------------------- CACHE CONTAINERS

        service.cache = {
            config: {
                lifeSpan: 300 //in seconds
            },
            responses: {
                paymentMethods: null,
                origins: null
            }
        }

       //-------------------------------------------------------------------------------------------------------------- CACHE CONTAINERS

	this.fetchSetup = function(params){
		var deferred = $q.defer();
		var url = 'admin/get_ota_connection_config.json?interface='+params.interface_id;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	this.fetchOrigins = function(){
		var deferred = $q.defer();
		var url = '/api/booking_origins.json';
		if (service.cache.responses['origins'] === null || Date.now() > service.cache.responses['origins']['expiryDate']) {
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				service.cache.responses['origins'] = {
					data: data,
					expiryDate: Date.now() + (service.cache['config'].lifeSpan * 1000)
				};
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
		} else {
			deferred.resolve(service.cache.responses['origins']['data']);
		}
		return deferred.promise;
	};
	this.fetchFailedMessages = function(){
		var deferred = $q.defer();
		var url = '/api/ota_messages.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
        
        this.deleteFailedMessages = function(messages) {
		var deferred = $q.defer();
		var url = '/api/ota_messages/delete_all';

		ADBaseWebSrv.postJSON(url, messages).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
        this.resubmitFailedMessages = function(messages) {
		var deferred = $q.defer();
		var url = '/api/ota_messages/requeue';

		ADBaseWebSrv.postJSON(url, messages).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

        
	/*
	* To fetch hotel PaymentMethods
	*/
	this.fetchPaymethods = function() {
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types.json';
		if (service.cache.responses['paymentMethods'] === null || Date.now() > service.cache.responses['paymentMethods']['expiryDate']) {
			ADBaseWebSrv.getJSON(url).then(function(data) {
				service.cache.responses['paymentMethods'] = {
					data: data,
					expiryDate: Date.now() + (service.cache['config'].lifeSpan * 1000)
				};
				deferred.resolve(data);
			}, function(errorMessage) {
				deferred.reject(errorMessage);
			});
		} else {
			deferred.resolve(service.cache.responses['paymentMethods']['data']);
		}
		return deferred.promise;
	};

	this.testSetup = function(data){
		var deferred = $q.defer();
		var url = 'admin/test_ota_connection/'+data.interface;
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.toggleActive = function(data){
		var deferred = $q.defer();
		var url = 'admin/ota_update_active/'+data.interface;
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * Fetches Rates List; Booking origin lists & Payment methods list
	 * @return {[type]} [description]
	 */
	this.fetchMetaData = function(params) {
		var deferred = $q.defer(),
			promises = [],
			meta = {
				rates: null,
				paymentMethods: null,
				bookingOrigins: null
			};

		promises.push(service.fetchPaymethods().then(function(response) {
			meta.paymentMethods = response.payments;
		}));
		promises.push(service.fetchOrigins().then(function(response) {
			meta.bookingOrigins = response.booking_origins;
		}));
		promises.push(ADChannelMgrSrv.fetchManagerDetails({
			id: params.interface_id
		}).then(function(response) {
			meta.rates = response.data.channel_manager_rates;
		}));

		$q.all(promises).then(function() {
			deferred.resolve(meta);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});

		return deferred.promise;
	};

}]);