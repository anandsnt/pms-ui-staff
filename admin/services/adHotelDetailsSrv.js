admin.service('ADHotelDetailsSrv', ['$http', '$q','ADBaseWebSrv', 'ADBaseWebSrvV2',function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
	/**
    *   An getter method to add deatils for a new hotel.
    */
   var hotelDetailsData = {};
	this.fetchAddData = function(){
		var deferred = $q.defer();
		var url = '/admin/hotels/new.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};	
	
	/**
    *   An getter method to edit deatils for an existing hotel for SNT Admin
    *   @param {Object} data - deatils of the hotel with hotel id.
    */
	this.fetchEditData = function(data){
		var deferred = $q.defer();
		this.fetchCountries = function(){
			
			var url = '/api/reference_values.json?type=language';	
			
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				hotelDetailsData.countries = data;
			    deferred.resolve(hotelDetailsData);
			},function(data){
			    deferred.reject(data);
			});	
			return deferred.promise;
		};
		
			
			var url = '/admin/hotels/'+data.id+'/edit.json';	
			
			ADBaseWebSrv.getJSON(url).then(function(data) {
				hotelDetailsData.data = data;
				this.fetchCountries();
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
	this.hotelAdminfetchEditData = function(data){
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
	this.addNewHotelDeatils = function(data){
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
	this.updateHotelDeatils = function(data){
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
	this.testMliConnectivity = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/test_mli_settings';	

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
}]);