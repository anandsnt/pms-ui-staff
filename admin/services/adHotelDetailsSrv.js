admin.service('ADHotelDetailsSrv', ['$http', '$q','ADBaseWebSrv', 'ADBaseWebSrvV2',function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
	/**
    *   An getter method to add deatils for a new hotel.
    */
   var that = this;
   var hotelDetailsData = {};
	that.fetchAddData = function(){
		var deferred = $q.defer();
		var url = '/admin/hotels/new.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    // deferred.resolve(data);
		    hotelDetailsData.data = data;
		    that.fetchLanguages(deferred);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	that.fetchLanguages = function(deferred){
			
			var url = '/api/reference_values.json?type=language';
			
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				hotelDetailsData.languages = data;
			    deferred.resolve(hotelDetailsData);
			},function(data){
			    deferred.reject(data);
			});
			return deferred.promise;
		};
	/**
    *   An getter method to edit deatils for an existing hotel for SNT Admin
    *   @param {Object} data - deatils of the hotel with hotel id.
    */
	that.fetchEditData = function(data){
		var deferred = $q.defer();
			
		var url = '/admin/hotels/'+data.id+'/edit.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			hotelDetailsData.data = data;
			that.fetchLanguages(deferred);
		    // deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   An getter method to edit deatils for an existing hotel for Hotel Admin
    *   @param {Object} data - deatils of the hotel with hotel id.
    */
	that.hotelAdminfetchEditData = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/edit.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   An post method to add deatils of a new hotel.
    *   @param {Object} data - deatils of the hotel.
    */
	that.addNewHotelDeatils = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   An update method to edit deatils of a hotel.
    *   @param {Object} data - deatils of a hotel.
    */
	that.updateHotelDeatils = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/'+data.id;

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A post method to test Mli Connectivity for a hotel.
    *   @param {Object} data for Mli Connectivity for the hotel.
    */
	that.testMliConnectivity = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/test_mli_settings';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.testMLIPaymentGateway = function(data){
		var deferred = $q.defer();
		var url = 'api/test_mli_payment_gate_way';
		ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);